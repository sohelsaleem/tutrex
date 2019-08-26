<?php

namespace AppBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;

class UserLessonTokenRepository extends EntityRepository
{
    public function getDemoLessonTokens($expiredDemoLesson)
    {
        $qb = $this->createQueryBuilder('ult')
            ->innerJoin('ult.user', 'u')
            ->where('ult.lesson = :expiredDemoLessonId')->setParameter('expiredDemoLessonId', $expiredDemoLesson->getId())
            ->andWhere('u.roles LIKE :role')->setParameter('role', '%"ROLE_GUEST"%');

        return $qb->getQuery()->getResult();
    }
}