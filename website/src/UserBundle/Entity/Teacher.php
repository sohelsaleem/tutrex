<?php

namespace UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass="UserBundle\Entity\Repository\TeacherRepository")
 * @ORM\Table(name="teachers")
 */
class Teacher extends User
{
    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="UserBundle\Entity\User", inversedBy="teachers")
     */
    protected $user;

    /**
     * @ORM\Column(type="boolean", options={"default": false})
     */
    protected $blocked = false;

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param User $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * @return mixed
     */
    public function getBlocked()
    {
        return $this->blocked;
    }

    /**
     * @param mixed $blocked
     */
    public function setBlocked($blocked)
    {
        $this->blocked = $blocked;
    }

    public function getStorageLimit()
    {
        return $this->getUser()->getStorageLimit();
    }

    public function getPlanStorageLimit()
    {
        return $this->getUser()->getPlanStorageLimit();
    }

    public function getSubdomain()
    {
        return $this->user->getSubdomain();
    }

    public function getReseller()
    {
        return $this->user->getReseller();
    }
}
