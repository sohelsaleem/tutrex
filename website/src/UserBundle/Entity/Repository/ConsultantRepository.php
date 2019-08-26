<?php

namespace UserBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;

class ConsultantRepository extends EntityRepository
{
    public function checkEmailUniqueness(array $criteria)
    {
        return $this->_em->getRepository('UserBundle:User')->findBy($criteria);
    }
}