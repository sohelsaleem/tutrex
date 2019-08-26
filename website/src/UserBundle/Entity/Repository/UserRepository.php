<?php

namespace UserBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\User;

class UserRepository extends EntityRepository
{
    public function checkEmailUniqueness(array $criteria)
    {
        return $this->_em->getRepository('UserBundle:User')->findBy($criteria);
    }

    public function getTeachers()
    {
        $qb = $this->createQueryBuilder('t')
                   ->where('t.roles NOT LIKE :role')
                   ->setParameter('role', '%"ROLE_ADMIN"%')
                   ->andWhere('t.enabled = :isEnabled')
                   ->setParameter('isEnabled', true)
                   ->orderBy('t.name');

        return $qb->getQuery()->getResult();
    }

    /**
     * @param string        $name
     * @param Reseller|null $reseller
     *
     * @return User[]
     */
    public function getFilteredTeachers($name, $reseller)
    {
        $qb = $this->createQueryBuilder('t')
                   ->innerJoin('t.plan', 'p')
                   ->where('t.roles NOT LIKE :role')
                   ->setParameter('role', '%"ROLE_ADMIN"%')
                   ->andWhere('t.name LIKE :name OR t.email LIKE :name OR p.name LIKE :name')
                   ->setParameter('name', '%'.$name.'%')
                   ->andWhere('t.enabled = :isEnabled')
                   ->setParameter('isEnabled', true)
                   ->orderBy('t.name');
        if ($reseller) {
            $qb->andWhere($qb->expr()->eq('t.reseller', ':reseller'))
               ->setParameter('reseller', $reseller);
        } else {
            $qb->andWhere($qb->expr()->isNull('t.reseller'));
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * @param Reseller|null $reseller
     *
     * @return User[]
     */
    public function getIndividualTeachers($reseller)
    {
        $qb = $this->createQueryBuilder('t')
                   ->where('t.roles LIKE :role1')
                   ->setParameter('role1', '%"ROLE_TEACHER"%')
                   ->andWhere('t.roles NOT LIKE :role2')
                   ->setParameter('role2', '%"ROLE_SUB_TEACHER"%')
                   ->orderBy('t.name');
        if ($reseller) {
            $qb->andWhere($qb->expr()->eq('t.reseller', ':reseller'))
               ->setParameter('reseller', $reseller);
        } else {
            $qb->andWhere($qb->expr()->isNull('t.reseller'));
        }

        return $qb->getQuery()->getResult();
    }

    public function getAdmins()
    {
        $qb = $this->createQueryBuilder('a')
                   ->where('a.roles LIKE :role')
                   ->setParameter('role', '%"ROLE_ADMIN"%');

        return $qb->getQuery()->getResult();
    }

    public function getMasterTeachers()
    {
        $qb = $this->createQueryBuilder('t')
                   ->where('t.roles LIKE :role1')
                   ->setParameter('role1', '%"ROLE_TEACHER"%');

        return $qb->getQuery()->getResult();
    }

    /**
     * @return User[]
     */
    public function findMasterTeachersWithoutApiKey()
    {
        $qb = $this->createQueryBuilder('user');
        $qb
            ->where($qb->expr()->andX(
                $qb->expr()->like('user.roles', ':teacherRole'),
                $qb->expr()->isNull('user.apiKey'),
                $qb->expr()->isNull('user.reseller'),
                $qb->expr()->eq('user.enabled', true)
            ))
            ->setParameter('teacherRole', '%"ROLE_TEACHER"%');

        return $qb->getQuery()->getResult();
    }
}
