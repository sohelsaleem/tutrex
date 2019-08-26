<?php

namespace ApiBundle\Controller;

use ApiBundle\Annotation\ApiSecure;
use ApiBundle\Annotation\JsonResponse;
use ApiBundle\Annotation\LessonAccess;
use ApiBundle\Exception\JsonException;
use AppBundle\Entity\Lesson;
use AppBundle\Util\LessonApiValidator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use UserBundle\Entity\User;

/**
 * @ApiSecure()
 */
class LessonV1Controller extends Controller
{
    /**
     * @param Request $request
     * @param User    $user
     *
     * @return array
     *
     * @Route(path="/lessons", methods={"POST"}, name="api_v1_lessons_create")
     * @JsonResponse()
     */
    public function createLessonAction(Request $request, User $user)
    {
        $lessonManager = $this->get('lesson.manager');
        $lessonApiValidator = $this->get('lesson.api_validator');

        $timestamp = $request->request->get('startTime');
        $title = $request->request->get('title');
        $duration = $request->request->getInt('duration');
        $exitLink = $request->request->get('exitLink', null);
        $shareLink = $request->request->get('shareLink', null);

        $validationResult = $lessonApiValidator->validateLessonData($timestamp, $title, $duration, $user, $exitLink, $shareLink);

        if ($validationResult->hasErrors())
            throw new JsonException('Invalid data.', $validationResult->getErrors());

        $lesson = $lessonManager->createLessonFromApi($timestamp, $title, $duration, $user, $exitLink, $shareLink);

        return $lessonManager->getLessonDto($lesson);
    }

    /**
     * @param Request $request
     * @param User    $user
     *
     * @return array
     *
     * @Route(path="/lessons", methods={"GET"}, name="api_v1_lessons_get")
     * @JsonResponse()
     */
    public function getLessonsListAction(Request $request, User $user)
    {
        $lessonManager = $this->get('lesson.manager');
        $lessonApiValidator = $this->get('lesson.api_validator');

        $sortBy = $request->request->get('sortBy', 'UTCStartDateTimeStamp');
        $sortDirection = strtoupper($request->request->get('sortDirection', 'DESC'));
        $limit = $request->request->get('limit', 20);
        $offset = $request->request->get('offset', 0);

        if ($sortBy === 'startTime')
            $sortBy = Lesson::SORT_FIELD_START_TIME;

        $validationResult = $lessonApiValidator->validateSortingParameters($limit, $offset, $sortBy, $sortDirection);

        if ($validationResult->hasErrors())
            throw new JsonException('Invalid data.', $validationResult->getErrors());

        return $lessonManager->getUserLessonsDto($user, (int) $limit, (int) $offset, $sortBy, $sortDirection);
    }

    /**
     * @param Lesson $lesson
     *
     * @return array
     *
     * @Route(path="/lessons/{lesson}", methods={"GET"}, name="api_v1_lessons_get_one")
     * @JsonResponse()
     *
     * @LessonAccess()
     */
    public function getLessonAction(Lesson $lesson)
    {
        $lessonManager = $this->get('lesson.manager');

        return $lessonManager->getLessonDto($lesson);
    }

    /**
     * @param Lesson $lesson
     *
     * @return array
     *
     * @Route(path="/lessons/{lesson}", methods={"DELETE"}, name="api_v1_lessons_delete")
     * @JsonResponse()
     *
     * @LessonAccess()
     */
    public function deleteLessonAction(Lesson $lesson)
    {
        $lessonManager = $this->get('lesson.manager');

        $lessonManager->deleteLesson($lesson);

        return [];
    }

    /**
     * @param Request $request
     * @param User    $user
     * @param Lesson  $lesson
     *
     * @return array
     *
     * @Route(path="/lessons/{lesson}", methods={"POST"}, name="api_v1_lessons_edit")
     * @JsonResponse()
     *
     * @LessonAccess()
     */
    public function updateLessonAction(Request $request, User $user, Lesson $lesson)
    {
        $lessonManager = $this->get('lesson.manager');
        $lessonApiValidator = $this->get('lesson.api_validator');

        $timestamp = $request->request->get('startTime', $lesson->getUTCStartDateTimeStamp());
        $title = $request->request->get('title', $lesson->getTitle());
        $duration = $request->request->getInt('duration', $lesson->getDurationInMinutes());
        $exitLink = $request->request->get('exitLink');
        $shareLink = $request->request->get('shareLink');

        if (is_null($exitLink))
            $exitLink = $lesson->getExitLink();
        if (is_null($shareLink))
            $shareLink = $lesson->getShareLink();

        $validationResult = $lessonApiValidator->validateLessonData($timestamp, $title, $duration, $user, $exitLink, $shareLink, $lesson->getId());

        if ($validationResult->hasErrors())
            throw new JsonException('Invalid data.', $validationResult->getErrors());

        $lessonManager->updateLessonFromApi($timestamp, $title, $duration, $lesson, $exitLink, $shareLink);

        return $lessonManager->getLessonDto($lesson);
    }
}
