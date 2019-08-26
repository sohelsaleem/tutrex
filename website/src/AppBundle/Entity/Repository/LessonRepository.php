<?php

namespace AppBundle\Entity\Repository;

use AppBundle\Entity\Lesson;
use Doctrine\ORM\EntityRepository;
use UserBundle\Entity\User;

class LessonRepository extends EntityRepository
{
    public function getPastLessonsForRemove($date)
    {
        $qb = $this->createQueryBuilder('l')
                   ->andWhere('l.lessonRecord is not null')
                   ->andWhere('l.UTCStartDateTimeStamp < :date')
                   ->setParameter('date', $date);

        return $qb->getQuery()->getResult();
    }

    /**
     * @return Lesson|null
     */
    public function findLessonWithConsultant()
    {
        $qb = $this->createQueryBuilder('l')
                   ->innerJoin('l.user', 'u')
                   ->andWhere('u.roles LIKE :role')
                   ->setParameter('role', '%"ROLE_CONSULTANT"%');

        if ($qb->getQuery()->getResult()) {
            return $qb->getQuery()->getResult()[0];
        } else {
            return null;
        }
    }

    public function getExpiredDemoLessons($period, $nowTimestamp)
    {
        $qb = $this->createQueryBuilder('l')
                   ->where(':now - l.UTCStartDateTimeStamp > :period')->setParameter('period', $period)->setParameter('now', $nowTimestamp)
                   ->andWhere('l.isDemoLesson = :isTrue')->setParameter('isTrue', true);

        return $qb->getQuery()->getResult();
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
        $qb = $this->createQueryBuilder('lesson');
        $qb
            ->where($qb->expr()->andX(
                $qb->expr()->eq('lesson.user', ':user'),
                $qb->expr()->eq('lesson.apiLesson', true)
            ))
            ->orderBy("lesson.$sortBy", $sortDirection)
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->setParameter('user', $user);

        return $qb->getQuery()->getResult();
    }

    /**
     * @param User     $user
     * @param int      $lessonStartTimestamp
     * @param int      $lessonEndTimestamp
     * @param int|null $lessonId
     *
     * @return int
     */
    public function countConcurrentLessons(User $user, $lessonStartTimestamp, $lessonEndTimestamp, $lessonId = null)
    {
        $qb = $this->createQueryBuilder('lesson');
        $qb
            ->select($qb->expr()->count('lesson'))
            ->where($qb->expr()->andX(
                $qb->expr()->eq('lesson.user', ':user'),
                $qb->expr()->eq('lesson.finished', 0),
                $qb->expr()->eq('lesson.apiLesson', 1),
                $qb->expr()->orX(
                    $qb->expr()->andX(
                        $qb->expr()->gte('lesson.UTCStartDateTimeStamp', ':lessonStart'),
                        $qb->expr()->lt('lesson.UTCStartDateTimeStamp', ':lessonEnd')
                    ),
                    $qb->expr()->andX(
                        $qb->expr()->gt($qb->expr()->sum('lesson.UTCStartDateTimeStamp', $qb->expr()->prod($qb->expr()->sum('lesson.durationMinutes', $qb->expr()->prod('lesson.durationHours', 60)), 60)), ':lessonStart'),
                        $qb->expr()->lte($qb->expr()->sum('lesson.UTCStartDateTimeStamp', $qb->expr()->prod($qb->expr()->sum('lesson.durationMinutes', $qb->expr()->prod('lesson.durationHours', 60)), 60)), ':lessonEnd')
                    ),
                    $qb->expr()->andX(
                        $qb->expr()->lt('lesson.UTCStartDateTimeStamp', ':lessonStart'),
                        $qb->expr()->gt($qb->expr()->sum('lesson.UTCStartDateTimeStamp', $qb->expr()->prod($qb->expr()->sum('lesson.durationMinutes', $qb->expr()->prod('lesson.durationHours', 60)), 60)), ':lessonEnd')
                    )
                )
            ))
            ->setParameters([
                'user' => $user,
                'lessonStart' => $lessonStartTimestamp,
                'lessonEnd' => $lessonEndTimestamp,
            ]);

        if ($lessonId)
            $qb
                ->andWhere($qb->expr()->neq('lesson.id', ':lessonId'))
                ->setParameter('lessonId', $lessonId);

        return $qb->getQuery()->getSingleScalarResult();
    }

    /**
     * @param User     $user
     * @param int      $fromTimestamp
     * @param int      $toTimestamp
     * @param int|null $lessonId
     *
     * @return int
     */
    public function sumLessonsDuration(User $user, $fromTimestamp, $toTimestamp, $lessonId = null)
    {
        $qb = $this->createQueryBuilder('lesson');
        $qb
            ->select('SUM(lesson.durationMinutes + lesson.durationHours * 60)')
            ->where($qb->expr()->andX(
                $qb->expr()->eq('lesson.user', ':user'),
                $qb->expr()->eq('lesson.apiLesson', true),
                $qb->expr()->gte('lesson.UTCStartDateTimeStamp', ':from'),
                $qb->expr()->lt('lesson.UTCStartDateTimeStamp', ':to')
            ))
            ->setParameters([
                'user' => $user,
                'from' => $fromTimestamp,
                'to' => $toTimestamp,
            ]);

        if ($lessonId)
            $qb
                ->andWhere($qb->expr()->neq('lesson.id', ':lessonId'))
                ->setParameter('lessonId', $lessonId);

        return $qb->getQuery()->getSingleScalarResult();
    }
}
