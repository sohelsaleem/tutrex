<?php

namespace UserBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;

class TeacherRepository extends EntityRepository
{
    public function checkEmailUniqueness(array $criteria)
    {
        return $this->_em->getRepository('UserBundle:User')->findBy($criteria);
    }

    public function findLastByUser($user, $diffNumberOfTeachers)
    {
        $qb = $this->createQueryBuilder('t')
            ->where('t.user = :user')
            ->setParameter('user', $user)
            ->andWhere('t.blocked = :isBlocked')
            ->setParameter('isBlocked', false)
            ->orderBy('t.registrationDate', 'DESC')
            ->setMaxResults($diffNumberOfTeachers);

        return $qb->getQuery()->getResult();
    }

    public function findFirstByUser($user, $diffNumberOfTeachers)
    {
        $qb = $this->createQueryBuilder('t')
            ->where('t.user = :user')
            ->setParameter('user', $user)
            ->andWhere('t.blocked = :isBlocked')
            ->setParameter('isBlocked', true)
            ->orderBy('t.registrationDate', 'ASC')
            ->setMaxResults($diffNumberOfTeachers);

        return $qb->getQuery()->getResult();
    }

    public function getActiveTeachersByUser($user)
    {
        $qb = $this->createQueryBuilder('t')
            ->where('t.user = :user')
            ->setParameter('user', $user)
            ->andWhere('t.blocked = :isBlocked')
            ->setParameter('isBlocked', false);

        return $qb->getQuery()->getResult();
    }
}