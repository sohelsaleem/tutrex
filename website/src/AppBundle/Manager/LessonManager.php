<?php

namespace AppBundle\Manager;

use AppBundle\Entity\Lesson;
use AppBundle\Entity\UserLessonToken;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use UserBundle\Entity\User;

class LessonManager
{
    protected $container;
    protected $entityManager;
    protected $repository;
    protected $userLessonTokenManager;
    protected $ffmpegUtil;
    protected $boardFilesPath;
    protected $boardFilesUrl;
    protected $resellerManager;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->entityManager = $container->get('doctrine.orm.default_entity_manager');
        $this->userLessonTokenManager = $container->get('userlessontoken.manager');
        $this->repository = $this->entityManager->getRepository('AppBundle:Lesson');
        $this->ffmpegUtil = $container->get('app.ffmpeg.util');
        $this->boardFilesPath = $container->getParameter('board_files_path');
        $this->boardFilesUrl = $container->getParameter('board_files_url');
        $this->resellerManager = $container->get('reseller.manager');
    }

    public function updateLesson()
    {
        $this->entityManager->flush();
    }

    /**
     * @param array $criteria
     *
     * @return Lesson|null
     */
    public function getLessonBy(array $criteria)
    {
        return $this->repository->findOneBy($criteria);
    }

    public function getPastLessonsForRemove($date)
    {
        return $this->repository->getPastLessonsForRemove($date);
    }

    public function deleteLesson(Lesson $lesson)
    {
        $this->entityManager->remove($lesson);
        $this->updateLesson();
    }

    public function persistLesson(Lesson $lesson)
    {
        $this->entityManager->persist($lesson);
        $this->updateLesson();
    }

    public function getActiveLessons($chapter)
    {
        return $this->repository->getActiveLessons($chapter);
    }

    /**
     * @return Lesson|null
     */
    public function findLessonWithConsultant()
    {
        return $this->repository->findLessonWithConsultant();
    }

    public function getExpiredDemoLessons($demoLessonPeriod)
    {
        $now = new \DateTime();
        $nowTimestamp = $now->getTimestamp();

        return $this->repository->getExpiredDemoLessons($demoLessonPeriod, $nowTimestamp);
    }

    /**
     * @param Lesson $lesson
     */
    public function concatLessonRecords(Lesson $lesson)
    {
        $lessonRecordsSubPath = "/rooms/{$lesson->getId()}/records";
        $recordsPath = $this->boardFilesPath.$lessonRecordsSubPath;
        $concatenatedRecordFileName = str_replace(' ', '_', $lesson->getTitle()).'_'.uniqid().'.webm';
        $concatenatedRecordPath = $recordsPath.'/'.$concatenatedRecordFileName;
        $concatenatedRecordUrl = $this->boardFilesUrl.$lessonRecordsSubPath.'/'.$concatenatedRecordFileName;
        $reseller = $lesson->getUser()->getReseller();
        if ($reseller)
            $concatenatedRecordUrl = $this->resellerManager->updateUrlByReseller($concatenatedRecordUrl, $reseller);
        $lessonRecordPaths = array_map(function ($lessonRecord) {
            return $lessonRecord['recordPath'];
        }, $lesson->getLessonRecord());
        $listFileContent = array_reduce($lessonRecordPaths, function ($fileContent, $lessonRecordPath) {
            $fileContent .= "file '".$lessonRecordPath."'".PHP_EOL;

            return $fileContent;
        }, '');
        $listFilePath = $recordsPath.'/list';
        $file = fopen($listFilePath, 'w');
        fwrite($file, $listFileContent);
        fclose($file);
        $this->ffmpegUtil->concatVideos($listFilePath, $concatenatedRecordPath);
        $fs = new Filesystem();
        foreach ($lessonRecordPaths as $lessonRecordPath) {
            $fs->remove($lessonRecordPath);
        }
        $fs->remove($listFilePath);
        $lessonRecords = [
            [
                'recordName' => $concatenatedRecordFileName,
                'recordPath' => $concatenatedRecordPath,
                'recordURL' => $concatenatedRecordUrl,
            ],
        ];
        $lesson->setLessonRecord($lessonRecords);
        $this->updateLesson();
    }

    /**
     * @param Lesson $lesson
     *
     * @return array
     */
    public function getLessonDto(Lesson $lesson)
    {
        $router = $this->container->get('router');

        $lessonDto = $lesson->toDto();
        $lessonDto['teacherUrl'] = $router->generate(
            'lesson_check_user',
            ['token' => $lesson->getTeacherToken()],
            UrlGeneratorInterface::ABSOLUTE_URL
        );
        $lessonDto['studentUrl'] = $router->generate(
            'lesson_start',
            ['id' => $lesson->getLinkId()],
            UrlGeneratorInterface::ABSOLUTE_URL
        );

        return $lessonDto;
    }

    /**
     * @param User   $user
     * @param int    $limit
     * @param int    $offset
     * @param string $sortBy
     * @param string $sortDirection
     *
     * @return array
     */
    public function getUserLessonsDto(User $user, $limit, $offset, $sortBy, $sortDirection)
    {
        $userLessons = $this->getUserLessons($user, $limit, $offset, $sortBy, $sortDirection);

        return array_map([$this, 'getLessonDto'], $userLessons);
    }

    /**
     * @param User   $user
     * @param int    $limit
     * @param int    $offset
     * @param string $sortBy
     * @param string $sortDirection
     *
     * @return Lesson[]
     */
    public function getUserLessons(User $user, $limit, $offset, $sortBy, $sortDirection)
    {
        return $this->repository->getUserLessons($user, $limit, $offset, $sortBy, $sortDirection);
    }

    /**
     * @param mixed  $timestamp
     * @param string $title
     * @param int    $duration
     * @param User   $user
     * @param string $exitLink
     * @param string $shareLink
     *
     * @return Lesson
     */
    public function createLessonFromApi($timestamp, $title, $duration, User $user, $exitLink, $shareLink)
    {
        $lesson = new Lesson();
        $lessonLinkId = uniqid();

        $lesson
            ->setApiLesson(true)
            ->setLinkId($lessonLinkId)
            ->setUser($user)
            ->updateStartTime($timestamp)
            ->setTitle($title)
            ->updateDuration($duration)
            ->setExitLink($exitLink)
            ->setShareLink($shareLink);

        $this->persistLesson($lesson);

        $token = md5(uniqid(rand(), true));
        $userLessonToken = new UserLessonToken();
        $userLessonToken
            ->setToken($token)
            ->setUser($user)
            ->setLesson($lesson);
        $lesson->addUserLessonToken($userLessonToken);

        $this->userLessonTokenManager->persistUserLessonToken($userLessonToken);

        return $lesson;
    }

    /**
     * @param mixed  $timestamp
     * @param string $title
     * @param int    $duration
     * @param Lesson $lesson
     * @param string $exitLink
     * @param string $shareLink
     *
     * @return Lesson
     */
    public function updateLessonFromApi($timestamp, $title, $duration, Lesson $lesson, $exitLink, $shareLink)
    {
        $lesson
            ->updateStartTime($timestamp)
            ->setTitle($title)
            ->updateDuration($duration)
            ->setExitLink($exitLink)
            ->setShareLink($shareLink);

        $this->updateLesson();

        return $lesson;
    }

    /**
     * @param User     $user
     * @param int      $lessonStartTimestamp
     * @param int      $lessonDuration
     * @param int|null $lessonId
     *
     * @return int
     */
    public function countConcurrentLessons(User $user, $lessonStartTimestamp, $lessonDuration, $lessonId = null)
    {
        $lessonEndTimestamp = $lessonStartTimestamp + $lessonDuration * 60;

        return $this->repository->countConcurrentLessons($user, $lessonStartTimestamp, $lessonEndTimestamp, $lessonId);
    }

    /**
     * @param User     $user
     * @param int      $lessonStartTimestamp
     * @param int|null $lessonId
     *
     * @return mixed
     */
    public function sumLessonsDuration(User $user, $lessonStartTimestamp, $lessonId = null)
    {
        $fromTimestamp = (new \DateTime('@'.$lessonStartTimestamp))->modify('-1 month')->getTimestamp();

        return $this->repository->sumLessonsDuration($user, $fromTimestamp, $lessonStartTimestamp, $lessonId);
    }
}
