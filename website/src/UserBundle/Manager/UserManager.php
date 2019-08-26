<?php

namespace UserBundle\Manager;

use Doctrine\ORM\EntityManager;
use UserBundle\Entity\Admin;
use UserBundle\Entity\Repository\UserRepository;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\User;

class UserManager
{
    protected $entityManager;
    protected $repository;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
        /** @var UserRepository repository */
        $this->repository = $this->entityManager->getRepository('UserBundle:User');
    }

    public function persistUser(User $user)
    {
        $this->entityManager->persist($user);
        $this->updateUser();
    }

    public function deleteUser(User $user)
    {
        $this->entityManager->remove($user);
        $this->updateUser();
    }

    public function getUserBy(array $criteria)
    {
        return $this->repository->findOneBy($criteria);
    }

    public function updateUser()
    {
        $this->entityManager->flush();
    }

    public function getTeachers()
    {
        return $this->repository->getTeachers();
    }

    /**
     * @param Reseller|null $reseller
     *
     * @return User[]
     */
    public function getIndividualTeachers($reseller)
    {
        return $this->repository->getIndividualTeachers($reseller);
    }

    public function getFilteredTeachers($name, $reseller)
    {
        return $this->repository->getFilteredTeachers($name, $reseller);
    }

    public function getMasterTeachers()
    {
        return $this->repository->getMasterTeachers();
    }

    public function banUser($userId)
    {
        $user = $this->repository->find($userId);
        $user->setBanned(true);
        $this->updateUser();
    }

    public function unbanUser($userId)
    {
        $user = $this->repository->find($userId);
        $user->setBanned(false);
        $this->updateUser();
    }

    public function getAdmins()
    {
        return $this->repository->getAdmins();
    }

    /**
     * @param string $email
     *
     * @return Admin
     */
    public function findAdminByEmail($email)
    {
        return $this->entityManager->getRepository('UserBundle:Admin')->findOneBy([
            'email' => $email,
        ]);
    }

    /**
     * @return User[]
     */
    public function findMasterTeachersWithoutApiKey()
    {
        return $this->repository->findMasterTeachersWithoutApiKey();
    }
}
