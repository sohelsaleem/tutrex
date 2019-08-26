<?php

namespace ApiBundle\Controller;

use AppBundle\Entity\Lesson;
use AppBundle\Util\HostnameUtil;
use StorageBundle\Entity\StorageItem;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use NT\RestBundle\Controller\RestController;
use NT\RestBundle\Annotation\JsonView;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Validator\Constraints\Email;
use UserBundle\Entity\Teacher;
use UserBundle\Entity\User;

class V1Controller extends RestController
{
    /**
     * @Route(path="/user.get-info", methods={"GET"})
     * @JsonView(serializerGroups={"access_token"})
     */
    public function getUserInfo(Request $request)
    {
        $token = $request->query->get('token');
        $fileSharing = false;
        $teacherGoneTimeout = 0;

        $userLessonTokenObject = $this->get('userLessonToken.manager')->getOneBy(['token' => $token]);

        $user = $userLessonTokenObject->getUser();
        /** @var Lesson $lesson */
        $lesson = $userLessonTokenObject->getLesson();
        $isApiLesson = $lesson->isApiLesson();
        $canRecord = $lesson->isRecordingAvailable();

        /** @var User $lessonOwner */
        $lessonOwner = $lesson->getUser();
        $classroomOwner = $lessonOwner;

        if ($lessonOwner instanceof Teacher)
            $classroomOwner = $lessonOwner->getUser();
        $reseller = $classroomOwner->getReseller();
        $config = $this->get('config.manager')->getConfig();
        $logo = $config->getLogo();
        if ($reseller)
            $logo = $reseller->getLogo();
        $classroomLogo = $logo ? $request->getUriForPath($logo) : '';
        if ($classroomOwner->getPlan() && $classroomOwner->getPlan()->getName() != 'Basic'
            && $filename = $classroomOwner->getClassroomLogo()) {
            $classroomLogo = $request->getUriForPath('/uploads/logo/'.$filename);
        }

        if ($user->hasRole('ROLE_GUEST') || $lesson->getUser()->getId() != $user->getId()) {
            $isTeacher = false;
            $exitLink = $this->generateUrl('homepage', [], true);
        }


        if ($lesson->getUser()->getId() == $user->getId()) {
            $isTeacher = true;
            $exitLink = $this->generateUrl('app_lesson_show_lessons', [], true);
            if ($user->hasRole('ROLE_GUEST')) {
                $canRecord = false;
                $fileSharing = true;
            }
        }

        if ($user->hasRole('ROLE_CONSULTANT')) {
            $currentConsultantLesson = $this->get('lesson.manager')->findLessonWithConsultant();

            if ($currentConsultantLesson && !$currentConsultantLesson->getFinished() && ($currentConsultantLesson->getUser() != $user)) {
                $isTeacher = false;
            } else {
                $isTeacher = true;
                $teacherGoneTimeout = 1;
            }

            $canRecord = false;
            $fileSharing = false;
            $exitLink = $this->generateUrl('fos_user_security_logout', [], true);
        }

        $resellerManager = $this->get('reseller.manager');
        if ($exitLink && $reseller)
            $exitLink = $resellerManager->updateUrlByReseller($exitLink, $reseller);
        $lessonLink = $this->generateUrl('lesson_start', ['id' => $lesson->getLinkId()], true);
        if ($reseller)
            $lessonLink = $resellerManager->updateUrlByReseller($lessonLink, $reseller);
        if ($subdomain = $classroomOwner->getSubdomain()) {
            if ($exitLink)
                $exitLink = HostnameUtil::addSubdomain($exitLink, $subdomain);
            $lessonLink = HostnameUtil::addSubdomain($lessonLink, $subdomain);
        }

        return [
            'user' => [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'isTeacher' => $isTeacher,
                'exitLink' => $lesson->getExitLink() ?: $exitLink,
            ],
            'room' => [
                'id' => $lesson->getId(),
                'name' => $lesson->getTitle(),
                'canRecordClass' => $canRecord,
                'classroomLogo' => $classroomLogo,
                'isFilesSharingNotAvailable' => $fileSharing,
                'lessonLink' => $lesson->getShareLink() ?: $lessonLink,
                'lessonCode' => $lesson->getLessonCode(),
                'numberOfStudents' => $isApiLesson ? $lessonOwner->getApiStudentsInClassroom() : $lessonOwner->getStudentsInClassroom(),
                'approxDuration' => ($lesson->getDurationHours() * 3600) + ($lesson->getDurationMinutes() * 60),
                'maxDuration' => ($isApiLesson ? $lessonOwner->getApiMinutesLessonDuration() : $lessonOwner->getMinutesLessonDuration()) * 60,
                'startTime' => +$lesson->getUTCStartDateTimeStamp(),
                'teacherGoneTimeout' => $teacherGoneTimeout,
                'maxUploadSize' => $isApiLesson ? $lessonOwner->getApiMaxUploadSize() : $lessonOwner->getMaxUploadSize(),
            ],
        ];
    }

    /**
     * @Route(path="/add-lesson-record", methods={"POST"})
     * @JsonView(serializerGroups={"access_token"})
     */
    public function addLessonRecord(Request $request)
    {
        $recordId = $request->request->get('recordId');
        $recordURL = $request->request->get('recordURL');
        $recordPath = $request->request->get('recordPath');
        $lessonId = $request->request->get('roomId');

        $lessonManager = $this->get('lesson.manager');
        $resellerManager = $this->get('reseller.manager');

        $lesson = $lessonManager->getLessonBy(['id' => $lessonId]);
        $records = $lesson->getLessonRecord();
        $reseller = $lesson->getUser()->getReseller();
        if ($reseller && $recordURL)
            $recordURL = $resellerManager->updateUrlByReseller($recordURL, $reseller);
        if ($recordId && $recordURL && $recordPath) {
            $records[] = ['recordName' => $recordId, 'recordPath' => $recordPath, 'recordURL' => $recordURL];
            $lesson->setLessonRecord($records);
            $lessonManager->updateLesson();
        }

        $lessonManager->concatLessonRecords($lesson);

        return [
            'status' => 'success',
        ];
    }

    /**
     * @Route(path="/finish-lesson", methods={"POST"})
     * @JsonView(serializerGroups={"access_token"})
     */
    public function finishLesson(Request $request)
    {
        $mailManager = $this->get('app.mailer');
        $lessonManager = $this->get('lesson.manager');
        $userLessonTokenManager = $this->get('userLessonToken.manager');
        $userManager = $this->get('user.manager');

        $documentsList = $request->request->get('documentsList');
        $lessonId = $request->request->get('roomId');
        $demoLessonTeacher = null;

        $lesson = $lessonManager->getLessonBy(['id' => $lessonId]);

        foreach ($lesson->getUserLessonTokens() as $token) {
            /** @var User $lessonUser */
            $lessonUser = $token->getUser();
            $userLessonTokenManager->deleteUserLessonToken($token);

            if (count($documentsList) > 0) {
                $valid = $this->get('validator')->validate($token->getUser()->getEmail(), [new Email()])->count() == 0;
                if ($lesson->getUser()->getId() != $token->getUser()->getId() && $valid) {
                    $mailManager->sendSharedDocuments($lesson, $documentsList, $token->getUser()->getEmail());
                }
            }

            if (
                $lessonUser->hasRole('ROLE_GUEST') && $lessonUser->hasLesson($lesson)
                ||
                $lessonUser->hasRole('ROLE_CONSULTANT')
            ) {
                $demoLessonTeacher = $lessonUser;
            } elseif ($lessonUser->hasRole('ROLE_GUEST')) {
                $userManager->deleteUser($lessonUser);
            }
        }

        if ($lesson != null) {
            $lesson->setFinished(true);
            $lesson->setNumberOfInvitedUsers(0);
            $lessonManager->persistLesson($lesson);
        }

        if (isset($demoLessonTeacher)) {
            $lessonManager->deleteLesson($lesson);

            if (!$lesson->getUser()->hasRole('ROLE_CONSULTANT')) {
                $userManager->deleteUser($demoLessonTeacher);
            }
        }

        return [
            'status' => 'success',
        ];
    }

    /**
     * @Route(path="/room.in", methods={"POST"})
     * @JsonView(serializerGroups={"access_token"})
     */
    public function roomIn(Request $request)
    {
        $lessonId = $request->request->get('roomId');
        $userId = $request->request->get('userId');

        $lessonManager = $this->get('lesson.manager');
        $userManager = $this->get('user.manager');

        $user = $userManager->getUserBy(['id' => $userId]);
        $lesson = $lessonManager->getLessonBy(['id' => $lessonId]);

        if ($lesson->getUser() != $user && !$lesson->getFinished()) {
            $lesson->setNumberOfInvitedUsers($lesson->getNumberOfInvitedUsers() + 1);
        } else {
            $lesson->setStarted(true);
        }

        $lessonManager->persistLesson($lesson);

        return [
            'status' => 'success',
        ];
    }

    /**
     * @Route(path="/room.out", methods={"POST"})
     * @JsonView(serializerGroups={"access_token"})
     */
    public function roomOut(Request $request)
    {
        $lessonId = $request->request->get('roomId');
        $userId = $request->request->get('userId');

        $lessonManager = $this->get('lesson.manager');
        $userManager = $this->get('user.manager');

        $user = $userManager->getUserBy(['id' => $userId]);
        $lesson = $lessonManager->getLessonBy(['id' => $lessonId]);

        if ($lesson != null) {
            if ($lesson->getUser() != $user && !$lesson->getFinished()) {
                $lesson->setNumberOfInvitedUsers($lesson->getNumberOfInvitedUsers() - 1);

                $lessonManager->persistLesson($lesson);
            }
        }

        return [
            'status' => 'success',
        ];
    }

    /**
     * @Route(path="/storage.list", methods={"GET"})
     * @JsonView(serializerGroups={"access_token"})
     */
    public function getStorageList(Request $request)
    {
        $folderId = $request->get('folderId', null);
        $userId = $request->get('userId');

        $userManager = $this->get('user.manager');
        $storageManager = $this->get('storage.manager');
        $user = $userManager->getUserBy(['id' => $userId]);

        if ($user == null)
            throw new AccessDeniedHttpException();

        $content = $storageManager->findContentForUser($folderId, $user);
        $result = [];
        foreach ($content as $c) {
            /**@var StorageItem $c */
            $url = $storageManager->getRawUrl($c);
            $dto = $c->toDTO($url);
            array_push($result, $dto);
        }
        $response = [
            'status' => 'success',
            'content' => $result,
        ];


        if ($folderId) {
            $folder = $storageManager->findFolderByIdAndUser($folderId, $user);
            $folderUrl = $this->generateUrl('storage_download', ['id' => $folder->getId()], true);
            $response['folder'] = $folder->toDTO($folderUrl);
        }

        return $response;
    }

    /**
     * @Route(path="/storage.available", methods={"GET"})
     * @JsonView(serializerGroups={"access_token"})
     */
    public function isItemAvailable(Request $request)
    {
        $itemId = $request->get('itemId', null);
        $userId = $request->get('userId');

        $userManager = $this->get('user.manager');
        $storageManager = $this->get('storage.manager');
        $user = $userManager->getUserBy(['id' => $userId]);

        if ($user == null)
            throw new AccessDeniedHttpException();


        $params = $storageManager->getStorageParametersForUser($user);
        $error = $user->hasRole('ROLE_TEACHER')
            ? 'Your subscription has expired. Please upgrade to continue using your storage space or clean storage to fit 1GB limit.'
            : 'You storage limit has decreased. Please contact your manager or clean the storage to fit the limit.';

        if ($params['usedRaw'] > $params['totalRaw']) {
            return [
                'status' => 'error',
                'error' => $error,
            ];
        }

        $storageItem = $storageManager->findFileByIdAndUser($itemId, $user);

        if ($storageItem == null)
            return [
                'status' => 'error',
                'error' => 'File was not found in cloud storage',
            ];

        return [
            'status' => 'success',
        ];
    }
}
