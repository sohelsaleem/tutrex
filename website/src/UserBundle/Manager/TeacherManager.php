<?php

namespace UserBundle\Manager;

use Doctrine\ORM\EntityManager;
use UserBundle\Entity\Teacher;

class TeacherManager
{
    protected $entityManager;
    protected $repository;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->repository = $this->entityManager->getRepository('UserBundle:Teacher');
    }

    public function persistTeacher (Teacher $teacher)
    {
        $this->entityManager->persist($teacher);
        $this->updateTeacher ();
    }

    public function deleteTeacher(Teacher $teacher)
    {
        $this->entityManager->remove($teacher);
        $this->updateTeacher ();
    }

    public function updateTeacher ()
    {
        $this->entityManager->flush();
    }

    public function blockLastTeachers($user, $diffNumberOfTeachers)
    {
        $lastTeachers = $this->repository->findLastByUser($user, $diffNumberOfTeachers);


        foreach($lastTeachers as $teacher) {
            $teacher->setBlocked(true);
        }

        $this->updateTeacher();
    }

    public function unblockTeachers($user, $diffNumberOfTeachers)
    {
        $lastTeachers = $this->repository->findFirstByUser($user, $diffNumberOfTeachers);

        foreach($lastTeachers as $teacher) {
            $teacher->setBlocked(false);
        }

        $this->updateTeacher();
    }

    public function getActiveTeachersByUser($user)
    {
        return $this->repository->getActiveTeachersByUser($user);
    }
}