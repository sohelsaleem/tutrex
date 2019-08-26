<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use AppBundle\Entity\Lesson;
use AppBundle\Entity\UserLessonToken;
use AppBundle\Form\Type\LessonType;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\Teacher;
use UserBundle\Entity\User;

class LessonController extends Controller
{
    /**
     * @Route("/lessons/start-consultant-lesson", name="lesson_consultant_lesson_start", options={"expose"=true})
     */
    public function startConsultantSessionAction()
    {
        $lessonManager = $this->get('lesson.manager');
        $userLessonTokenManager = $this->get('userLessonToken.manager');
        $userManager = $this->get('user.manager');
        $demoLessonTeacher = null;

        $lesson = $this->get('lesson.manager')->findLessonWithConsultant();

        if ($lesson && !$lesson->getFinished()) {
            return $this->redirectToRoute('lesson_start', ['id' => $lesson->getLinkId()]);
        } elseif ($lesson && $lesson->getFinished()) {
            /** @var UserLessonToken $token */
            foreach ($lesson->getUserLessonTokens() as $token) {
                $lessonUser = $token->getUser();
                $userLessonTokenManager->deleteUserLessonToken($token);

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

            if (isset($demoLessonTeacher)) {
                $lessonManager->deleteLesson($lesson);
            }
        }

        $timezoneName = $this->get('session')->get('timezoneName');
        if (!$timezoneName) {
            return $this->redirectToRoute('app_get_user_timezone');
        }

        $user = $this->getUser();
        $lesson = new Lesson();
        $token = md5(uniqid(rand(), true));
        $lessonLinkId = uniqid();
        $timeZone = new \DateTimeZone($timezoneName);
        $currentDate = new \DateTime('now', $timeZone);

        $lesson->setDate($currentDate);
        $lesson->setTime($currentDate->format('g:i A'));
        $lesson->setDurationHours(24);

        $lessonTimeWithCurrentDateTimestamp = strtotime($lesson->getTime());
        $lessonTimeWithCurrentDateObject = new \DateTime();

        $lessonTimeWithCurrentDateObject->setTimestamp($lessonTimeWithCurrentDateTimestamp);

        $lesson->setIsDemoLesson(true);
        $lesson->setTitle($user->getName().'\'s demo lesson');

        $startTime = $lesson->getDate()->setTime($lessonTimeWithCurrentDateObject->format('H'), $lessonTimeWithCurrentDateObject->format('i'));

        $lesson->setUTCStartDateTimeStamp($startTime->getTimestamp());

        $lesson
            ->setLinkId($lessonLinkId)
            ->setUser($user);

        $this->get('lesson.manager')->persistLesson($lesson);

        $userLessonToken = new UserLessonToken();

        $userLessonToken
            ->setToken($token)
            ->setUser($user)
            ->setLesson($lesson);

        $this->get('userLessonToken.manager')->persistUserLessonToken($userLessonToken);

        return $this->redirectToRoute('lesson_check_user', [
            'token' => $token,
        ]);
    }

    /**
     * @Route("/lessons/expired-lesson", name="lesson_expired")
     */
    public function showExpiredLessonPageAction()
    {
        return $this->render('AppBundle:Lesson:expiredLesson.html.twig');
    }

    /**
     * @Route("/lessons", name="app_lesson_show_lessons", options={"expose"=true})
     * @Security("has_role('ROLE_SUB_TEACHER') or has_role('ROLE_TEACHER')")
     */
    public function showLessonsAction()
    {
        /** @var User $user */
        $user = $this->getUser();
        $timezoneName = $this->get('session')->get('timezoneName');
        $lessons = $user->getLessons()->filter(function (Lesson $lesson) {
            return !$lesson->isApiLesson();
        });
        foreach ($lessons as &$l) {
            /**@var Lesson $l */
            $utc = new \DateTimeZone('UTC');
            $datetime = new \DateTime('now', $utc);
            $clientTimezone = new \DateTimeZone($timezoneName);
            $offset = $clientTimezone->getOffset($datetime);

            $datetime->setTimestamp($l->getUTCStartDateTimeStamp() + $offset);

            $l->setDateWithTimeZone($datetime);
        }

        return $this->render('AppBundle:Lesson:lessons.html.twig', ['lessons' => $lessons]);
    }

    /**
     * @Route("/lessons/create-demo", name="lesson_demo_create", options={"expose"=true})
     */
    public function createDemoLessonAction(Request $request, Reseller $reseller = null)
    {
        $lesson = $this->get('lesson.manager')->findLessonWithConsultant();
        if ($lesson) {
            return $this->redirectToRoute('lesson_start', ['id' => $lesson->getLinkId()]);
        }

        $form = $this->createFormBuilder()
                     ->add('name', 'text', [
                         'label' => 'Enter name to experience Virtual Classroom',
                         'constraints' => [
                             new NotBlank(['message' => 'The name should not be blank']),
                             new Length([
                                 'min' => 2,
                                 'max' => 50,
                                 'minMessage' => 'The name should be at least {{ limit }} characters long',
                                 'maxMessage' => 'The name should not be longer than {{ limit }} characters',
                             ]),
                         ],
                     ])
                     ->getForm();
        $timezoneName = $this->get('session')->get('timezoneName');

        $form->handleRequest($request);
        if ($form->isValid()) {
            $user = new User();
            $user->setReseller($reseller);
            $lesson = new Lesson();
            $token = md5(uniqid(rand(), true));

            $user->addRole('ROLE_GUEST');
            $user->setRegistrationDate(new \DateTime());

            $tokenGenerator = $this->get('fos_user.util.token_generator');
            $password = $tokenGenerator->generateToken();
            $user->setPlainPassword($password);
            $userManager = $this->get('fos_user.user_manager');
            $user->setEnabled(true);
            $user->setEmail($token);
            $user->setMinutesLessonDuration(5);
            $user->setStudentsInClassroom(500);
            $lesson->setDurationMinutes(5);
            $lesson->setDurationHours(0);
            $user->setName($form->get('name')->getData());
            $userManager->updateUser($user);

            $lessonLinkId = uniqid();

            $timeZone = new \DateTimeZone($timezoneName);
            $currentDate = new \DateTime('now', $timeZone);


            $lesson->setDate($currentDate);
            $lesson->setTime($currentDate->format('g:i A'));

            $lessonTimeWithCurrentDateTimestamp = strtotime($lesson->getTime());
            $lessonTimeWithCurrentDateObject = new \DateTime();

            $lessonTimeWithCurrentDateObject->setTimestamp($lessonTimeWithCurrentDateTimestamp);

            $lesson->setIsDemoLesson(true);
            $lesson->setTitle($user->getName().'\'s demo lesson');

            $startTime = $lesson->getDate()->setTime($lessonTimeWithCurrentDateObject->format('H'), $lessonTimeWithCurrentDateObject->format('i'));

            $lesson->setUTCStartDateTimeStamp($startTime->getTimestamp());

            $lesson
                ->setLinkId($lessonLinkId)
                ->setUser($user);

            $this->get('lesson.manager')->persistLesson($lesson);

            $userLessonToken = new UserLessonToken();

            $userLessonToken
                ->setToken($token)
                ->setUser($user)
                ->setLesson($lesson);

            $this->get('userLessonToken.manager')->persistUserLessonToken($userLessonToken);

            return $this->redirectToRoute('lesson_check_user', [
                'token' => $token,
            ]);
        }

        return $this->render('AppBundle:Lesson:createLessonUser.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/lessons/create", name="lesson_create", options={"expose"=true})
     * @Security("has_role('ROLE_SUB_TEACHER') or has_role('ROLE_TEACHER')")
     */
    public function createLessonAction(Request $request)
    {
        $session = $this->get('session');
        $timezoneName = $session->get('timezoneName');

        $lesson = new Lesson();

        $form = $this->createForm(new LessonType(), $lesson, [
            'timezoneName' => $timezoneName,
        ]);

        $form->handleRequest($request);
        if ($form->isValid() && $request->isXmlHttpRequest()) {
            $lessonLinkId = uniqid();
            $user = $this->getUser();

            $timeZone = new \DateTimeZone($timezoneName);
            $currentDate = new \DateTime();
            $currentDate->setTimezone(new \DateTimeZone($timezoneName));
            $timeOffset = $timeZone->getOffset($currentDate);

            $lessonTimeWithCurrentDateTimestamp = strtotime($lesson->getTime());
            $lessonTimeWithCurrentDateObject = new \DateTime();
            $lessonTimeWithCurrentDateObject->setTimestamp($lessonTimeWithCurrentDateTimestamp);
            $startTime = $lesson->getDate()->setTime($lessonTimeWithCurrentDateObject->format('H'), $lessonTimeWithCurrentDateObject->format('i'));

            $lesson->setUTCStartDateTimeStamp($startTime->getTimestamp() - $timeOffset);

            $lesson
                ->setLinkId($lessonLinkId)
                ->setUser($user);

            $this->get('lesson.manager')->persistLesson($lesson);

            return new JsonResponse([
                'status' => 'success',
                'route' => $this->generateUrl('app_lesson_show_lessons'),
            ]);
        }

        return new JsonResponse([
            'status' => 'error',
            'form' => $this->renderView('AppBundle:Lesson:lessonForm.html.twig', [
                'form' => $form->createView(),
            ]),
        ]);
    }

    /**
     * @return RedirectResponse
     *
     * @Route(path="/lessons/schedule-now", name="lesson_schedule_now", options={"expose"=true})
     * @Security("has_role('ROLE_SUB_TEACHER') or has_role('ROLE_TEACHER')")
     */
    public function scheduleNowLessonAction()
    {
        $session = $this->get('session');
        $timezoneName = $session->get('timezoneName');
        /** @var User $user */
        $user = $this->getUser();

        $lesson = new Lesson();
        $lessonLinkId = uniqid();
        $timeZone = new \DateTimeZone($timezoneName);
        $currentDate = new \DateTime();
        $currentDate->setTimezone(new \DateTimeZone($timezoneName));
        $timeOffset = $timeZone->getOffset($currentDate);

        $lessonDateTime = date_create_from_format('d/m/Y H:i', $currentDate->format('d/m/Y H:i'));
        $minutes = (int) $lessonDateTime->format('i');
        $minutesRemainder = $minutes % 5;
        if ($minutesRemainder) {
            $minutesToAdd = 5 - $minutesRemainder;
            $lessonDateTime->modify("+$minutesToAdd minutes");
        }
        $lessonDateString = $lessonDateTime->format('d.m.Y');
        $lessonTimeString = $lessonDateTime->format('g:i A');
        $maxDurationInMinutes = $user->getMinutesLessonDuration();
        $durationHours = (int) ($maxDurationInMinutes / 60);
        $durationMinutes = $maxDurationInMinutes % 60;
        $lesson
            ->setLinkId($lessonLinkId)
            ->setUser($user)
            ->setTitle("Lesson - $lessonDateString - $lessonTimeString")
            ->setDate($lessonDateTime)
            ->setTime($lessonTimeString)
            ->setDurationHours($durationHours)
            ->setDurationMinutes($durationMinutes);

        $lessonTimeWithCurrentDateTimestamp = strtotime($lesson->getTime());
        $lessonTimeWithCurrentDateObject = new \DateTime();
        $lessonTimeWithCurrentDateObject->setTimestamp($lessonTimeWithCurrentDateTimestamp);
        $startTime = $lesson->getDate()->setTime($lessonTimeWithCurrentDateObject->format('H'), $lessonTimeWithCurrentDateObject->format('i'));

        $lesson->setUTCStartDateTimeStamp($startTime->getTimestamp() - $timeOffset);

        $this->get('lesson.manager')->persistLesson($lesson);

        return $this->redirectToRoute('lesson_start', [
            'id' => $lessonLinkId,
        ]);
    }

    /**
     * @Route("/lessons/{id}/register-user", name="lesson_create_user", options={"expose"=true})
     */
    public function createLessonUserAction(Lesson $lesson, Request $request)
    {
        $form = $this->createFormBuilder()
                     ->add('name', 'text', [
                         'label' => 'Enter name to experience Virtual Classroom',
                         'constraints' => [
                             new NotBlank(['message' => 'The name should not be blank']),
                             new Length([
                                 'min' => 2,
                                 'max' => 50,
                                 'minMessage' => 'The name should be at least {{ limit }} characters long',
                                 'maxMessage' => 'The name should not be longer than {{ limit }} characters',
                             ]),
                         ],
                     ])
                     ->getForm();

        $form->handleRequest($request);
        if ($form->isValid()) {
            $user = new User();
            $token = md5(uniqid(rand(), true));

            $user->addRole('ROLE_GUEST');
            $user->setRegistrationDate(new \DateTime());

            $tokenGenerator = $this->get('fos_user.util.token_generator');
            $password = $tokenGenerator->generateToken();
            $user->setPlainPassword($password);
            $userManager = $this->get('fos_user.user_manager');
            $user->setEnabled(true);
            $user->setEmail($token);
            $user->setName($form->get('name')->getData());
            $userManager->updateUser($user);

            $userLessonToken = new UserLessonToken();

            $userLessonToken
                ->setToken($token)
                ->setUser($user)
                ->setLesson($lesson);

            $this->get('userLessonToken.manager')->persistUserLessonToken($userLessonToken);

            return $this->redirectToRoute('lesson_check_user', [
                'token' => $token,
            ]);
        }

        return $this->render('AppBundle:Lesson:createLessonUser.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/lessons/{id}/delete", name="app_lesson_delete", options={"expose"=true})
     * @Security("has_role('ROLE_SUB_TEACHER') or has_role('ROLE_TEACHER')")
     */
    public function deleteLessonAction(Lesson $lesson)
    {
        $this->get('lesson.manager')->deleteLesson($lesson);

        return $this->redirectToRoute('app_lesson_show_lessons');
    }

    /**
     * @Route("/lessons/{id}/edit", name="app_lesson_edit", options={"expose"=true})
     * @Security("has_role('ROLE_SUB_TEACHER') or has_role('ROLE_TEACHER')")
     */
    public function editLessonAction(Lesson $lesson, Request $request)
    {
        $session = $this->get('session');
        $timezoneName = $session->get('timezoneName');

        $form = $this->createForm(new LessonType(), $lesson, [
            'timezoneName' => $timezoneName,
        ]);

        $form->handleRequest($request);
        if ($form->isValid()) {
            $timeZone = new \DateTimeZone($timezoneName);
            $currentDate = new \DateTime();
            $currentDate->setTimezone(new \DateTimeZone($timezoneName));
            $timeOffset = $timeZone->getOffset($currentDate);

            $lessonTimeWithCurrentDateTimestamp = strtotime($lesson->getTime());
            $lessonTimeWithCurrentDateObject = new \DateTime();
            $lessonTimeWithCurrentDateObject->setTimestamp($lessonTimeWithCurrentDateTimestamp);
            $startTime = $lesson->getDate()->setTime($lessonTimeWithCurrentDateObject->format('H'), $lessonTimeWithCurrentDateObject->format('i'));

            $lesson->setUTCStartDateTimeStamp($startTime->getTimestamp() - $timeOffset);

            $this->get('lesson.manager')->persistLesson($lesson);

            $path = $this->generateUrl('app_lesson_show_lessons');

            return new JsonResponse([
                'status' => 'success',
                'path' => $path,
            ]);
        }

        return new JsonResponse([
            'status' => 'error',
            'form' => $this->renderView('AppBundle:Lesson:lessonForm.html.twig', [
                'form' => $form->createView(),
                'formType' => 'edit',
            ]),
        ]);
    }

    /**
     * @Route("/lessons/{id}", name="lesson_start", options={"expose"=true})
     * @ParamConverter("lesson", options={"mapping": {"id": "linkId"}})
     */
    public function startLessonAction(Lesson $lesson, Reseller $reseller = null, User $subdomainUser = null)
    {
        $classroomOwner = $lesson->getUser();
        if ($classroomOwner instanceof Teacher)
            $classroomOwner = $classroomOwner->getUser();
        $subdomain = $subdomainUser ? $subdomainUser->getSubdomain() : null;
        if ($classroomOwner->getReseller() !== $reseller || $subdomain && $classroomOwner->getSubdomain() !== $subdomain)
            throw new NotFoundHttpException('Lesson not found');

        /** @var User $user */
        $user = $this->getUser();

        if ($user) {
            $userLessonTokenObject = $this->get('userLessonToken.manager')->getOneBy(['user' => $user, 'lesson' => $lesson]);

            if ($userLessonTokenObject) {
                $token = $userLessonTokenObject->getToken();

                return $this->redirectToRoute('lesson_check_user', [
                    'token' => $token,
                ]);
            } else {
                if ($user->hasRole('ROLE_GUEST') || $user->hasRole('ROLE_ADMIN')) {
                    return $this->redirectToRoute('lesson_create_user', [
                        'id' => $lesson->getId(),
                    ]);
                } else {
                    $token = md5(uniqid(rand(), true));
                    $userLessonToken = new UserLessonToken();

                    $userLessonToken
                        ->setToken($token)
                        ->setUser($user)
                        ->setLesson($lesson);

                    $this->get('userLessonToken.manager')->persistUserLessonToken($userLessonToken);

                    return $this->redirectToRoute('lesson_check_user', [
                        'token' => $token,
                    ]);
                }
            }
        } else {
            return $this->redirectToRoute('lesson_create_user', [
                'id' => $lesson->getId(),
            ]);
        }
    }

    /**
     * @param Lesson        $lesson
     * @param Reseller|null $reseller
     *
     * @return JsonResponse
     *
     * @Route("/lessons/code/{code}", name="lesson_start_by_code", options={"expose"=true})
     * @ParamConverter("lesson", options={"mapping": {"code": "lessonCode"}})
     */
    public function startLessonByCode(Lesson $lesson, Reseller $reseller = null)
    {
        $classroomOwner = $lesson->getUser();
        if ($classroomOwner instanceof Teacher)
            $classroomOwner = $classroomOwner->getUser();
        if ($classroomOwner->getReseller() !== $reseller)
            throw new NotFoundHttpException('Lesson not found');

        return new JsonResponse([
            'route' => $this->generateUrl('lesson_start', [
                'id' => $lesson->getLinkId(),
            ]),
        ]);
    }

    /**
     * @Route("/board/", name="lesson_check_user", options={"expose"=true})
     */
    public function checkUserAction(Request $request, Reseller $reseller = null)
    {
        $homeUrl = $this->generateUrl('homepage', [], true);
        $token = $request->query->get('token');
        $browser = $this->get('browser.manager')->getBrowser();
        if (isset($browser['browser']) && in_array($browser['browser'], ['Chrome', 'Firefox'])) {
            $faviconUrl = $reseller ? '/favicon-reseller.ico' : '/favicon.ico';
            $response = function () use ($reseller, $homeUrl, $token, $faviconUrl) {
                $content = file_get_contents($homeUrl.'board/board.html?token='.$token);
                if (!$reseller)
                    return $content;

                return str_replace("<head>", '<head><link rel="icon" type="image/x-icon" href="/favicon-reseller.ico">', $content);
            };
            if ($request->query->get('fromTimerPage')) {
                return new Response($response());
            }

            $userLessonTokenObject = $this->get('userLessonToken.manager')->getOneBy(['token' => $token]);
            if (!$userLessonTokenObject)
                throw new NotFoundHttpException();
            $user = $userLessonTokenObject->getUser();
            $lesson = $userLessonTokenObject->getLesson();

            $tokenUser = $userLessonTokenObject->getUser();

            $lessonAvailability = $lesson->getLessonStatus($user);

            if ($user === $userLessonTokenObject->getUser()) {
                if ($lessonAvailability == 'available') {
                    return new Response($response());
                } elseif ($lessonAvailability == 'coming') {
                    return $this->redirectToRoute('lesson_show_timer', [
                        'id' => $lesson->getId(),
                        'timeToLesson' => $lesson->getTimeToLesson(),
                        'token' => $token,
                    ]);
                } else {
                    return $this->redirectToRoute('lesson_expired');
                }
            } elseif ($tokenUser->hasRole('ROLE_GUEST')) {
                if ($lessonAvailability == 'available') {
                    return new Response($response());
                } elseif ($lessonAvailability == 'coming') {
                    return $this->redirectToRoute('lesson_show_timer', [
                        'id' => $lesson->getId(),
                        'timeToLesson' => $lesson->getTimeToLesson(),
                        'token' => $token,
                    ]);
                } else {
                    return $this->redirectToRoute('lesson_expired');
                }
            } else {
                return $this->redirectToRoute('lesson_start', [
                    'id' => $userLessonTokenObject->getLesson()->getLinkId(),
                ]);
            }
        } else {
            return $this->redirectToRoute('download_browser');
        }
    }

    /**
     * @Route("/lessons/{id}/countdown/{token}", name="lesson_show_timer")
     */
    public function showLessonTimerAction(Lesson $lesson, $token)
    {
//        $timeToLesson = $lesson->getTimeToLesson();
//
//        if ($timeToLesson['hours'] > 15) {
//            return $this->render('AppBundle:Lesson:lessonCountdown.html.twig', [
//                'lessonDate' => $lesson->getDate(),
//                'lessonTime' => $lesson->getTime(),
//                'timer' => false,
//                'token' => $token,
//
//            ]);
//        }
//
//        return $this->render('AppBundle:Lesson:lessonCountdown.html.twig', [
//            'timeToLesson' => $timeToLesson['hours'].':'.$timeToLesson['minutes'].':'.$timeToLesson['seconds'],
//            'lesson' => $lesson,
//            'timer' => true,
//            'token' => $token,
//        ]);

        return $this->render('AppBundle:Lesson:lessonCountdown.html.twig', [
            'lesson' => $lesson,
            'token' => $token,
        ]);
    }
}
