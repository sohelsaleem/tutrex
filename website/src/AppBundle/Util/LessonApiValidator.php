<?php

namespace AppBundle\Util;

use ApiBundle\Util\ValidationResult;
use AppBundle\Entity\Lesson;
use AppBundle\Manager\LessonManager;
use UserBundle\Entity\User;

class LessonApiValidator
{
    private $lessonManager;

    public function __construct(LessonManager $lessonManager)
    {
        $this->lessonManager = $lessonManager;
    }

    /**
     * @param mixed    $startTime
     * @param string   $title
     * @param int      $duration
     * @param User     $user
     * @param string   $exitLink
     * @param string   $shareLink
     * @param int|null $lessonId
     *
     * @return ValidationResult
     */
    public function validateLessonData($startTime, $title, $duration, User $user, $exitLink, $shareLink, $lessonId = null)
    {
        return new ValidationResult([
            'startTime' => $this->validateStartTime($startTime, $duration, $user, $lessonId),
            'title' => $this->validateTitle($title),
            'duration' => $this->validateDuration($duration, $user, $startTime, $lessonId),
            'exitLink' => $this->validateLink($exitLink),
            'shareLink' => $this->validateLink($shareLink),
        ]);
    }

    /**
     * @param mixed    $timestamp
     * @param int      $duration
     * @param User     $user
     * @param int|null $lessonId
     *
     * @return null|string
     */
    private function validateStartTime($timestamp, $duration, User $user, $lessonId = null)
    {
        if ($timestamp === null)
            return 'Start time should not be empty.';

        if (!preg_match('/^\d{1,10}$/', $timestamp))
            return 'Start time should be a valid unix timestamp.';

        if (!$this->isAvailableConcurrentLessons($timestamp, $duration, $user, $lessonId))
            return 'You already created maximum number of lessons for this time.';

        return null;
    }

    /**
     * @param string $title
     *
     * @return null|string
     */
    private function validateTitle($title)
    {
        if (!$title)
            return 'Title should not be empty.';

        return null;
    }

    /**
     * @param int      $duration
     * @param User     $user
     * @param int      $timestamp
     * @param int|null $lessonId
     *
     * @return null|string
     */
    private function validateDuration($duration, User $user, $timestamp, $lessonId = null)
    {
        if ($duration <= 0)
            return 'Duration should be a valid integer greater than 0.';

        $maxDuration = $user->getApiMinutesLessonDuration();
        if ($duration > $maxDuration)
            return "Your maximum lesson duration is $maxDuration minutes.";

        if (!$this->isAvailableLessonMinutesPerMonth($user, $timestamp, $duration, $lessonId))
            return 'You reached your monthly limit of lesson\'s minutes.';

        return null;
    }

    /**
     * @param string $link
     *
     * @return null|string
     */
    private function validateLink($link)
    {
        if ($link && !filter_var($link, FILTER_VALIDATE_URL))
            return 'Link should be a valid URL.';

        return null;
    }

    /**
     * @param int      $timestamp
     * @param int      $duration
     * @param User     $user
     * @param int|null $lessonId
     *
     * @return bool
     */
    private function isAvailableConcurrentLessons($timestamp, $duration, User $user, $lessonId = null)
    {
        $maxConcurrentLessons = $user->getApiConcurrentLessons();
        $existingConcurrentLessons = $this->lessonManager->countConcurrentLessons($user, $timestamp, $duration, $lessonId);

        return $maxConcurrentLessons > $existingConcurrentLessons;
    }

    /**
     * @param User $user
     * @param int  $timestamp
     * @param int  $duration
     * @param null $lessonId
     *
     * @return bool
     */
    private function isAvailableLessonMinutesPerMonth(User $user, $timestamp, $duration, $lessonId = null)
    {
        $minutesLimit = $user->getApiPlan()->getLessonMinutesPerMonth();

        if (!$minutesLimit)
            return true;

        $minutesUsed = $this->lessonManager->sumLessonsDuration($user, $timestamp, $lessonId) + $duration;

        return $minutesLimit >= $minutesUsed;
    }

    /**
     * @param mixed  $limit
     * @param mixed  $offset
     * @param string $sortBy
     * @param string $sortDirection
     *
     * @return ValidationResult
     */
    public function validateSortingParameters($limit, $offset, $sortBy, $sortDirection)
    {
        $validSortFields = [Lesson::SORT_FIELD_ID, Lesson::SORT_FIELD_START_TIME, Lesson::SORT_FIELD_TITLE];
        $validSortDirections = ['ASC', 'DESC'];

        return new ValidationResult([
            'sortBy' => !in_array($sortBy, $validSortFields) ? 'Invalid sort field.' : null,
            'sortDirection' => !in_array($sortDirection, $validSortDirections) ? 'Invalid sort direction.' : null,
            'limit' => !is_numeric($limit) || (int) $limit <= 0 ? 'Invalid limit value.' : null,
            'offset' => !is_numeric($offset) || (int) $offset < 0 ? 'Invalid offset value.' : null,
        ]);
    }
}
