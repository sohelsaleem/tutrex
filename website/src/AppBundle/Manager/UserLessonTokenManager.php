<?php

namespace AppBundle\Manager;

use AppBundle\Entity\UserLessonToken;
use Doctrine\ORM\EntityManager;

class UserLessonTokenManager
{
    protected $entityManager;
    protected $repository;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->repository = $this->entityManager->getRepository('AppBundle:UserLessonToken');
    }

    public function updateUserLessonToken()
    {
        $this->entityManager->flush();

        return $this;
    }

    public function persistUserLessonToken(UserLessonToken $userLessonToken)
    {
        $this->entityManager->persist($userLessonToken);
        return $this->updateUserLessonToken();
    }

    public function getOneBy(array $criteria)
    {
        return $this->repository->findOneBy($criteria);
    }

    public function deleteUserLessonToken(UserLessonToken $userLessonToken)
    {
        $this->entityManager->remove($userLessonToken);
        $this->updateUserLessonToken();
    }

    public function getDemoLessonTokens($expiredDemoLesson)
    {
        return $this->repository->getDemoLessonTokens($expiredDemoLesson);
    }
}