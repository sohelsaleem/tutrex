<?php

namespace UserBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;

class ResellerRepository extends EntityRepository
{
    public function checkEmailUniqueness(array $criteria)
    {
        return $this->_em->getRepository('UserBundle:User')->findBy($criteria);
    }
}