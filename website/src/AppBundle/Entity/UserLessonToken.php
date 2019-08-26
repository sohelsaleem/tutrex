<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use UserBundle\Entity\User;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Repository\UserLessonTokenRepository")
 * @ORM\Table(name="user_lesson_tokens")
 */
class UserLessonToken
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="UserBundle\Entity\User", inversedBy="userLessonTokens")
     * @ORM\JoinColumn(name="user_id", nullable=true)
     */
    protected $user;

    /**
     * @var Lesson
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Lesson", inversedBy="userLessonTokens")
     */
    protected $lesson;

    /**
     * @ORM\Column(type="string")
     */
    protected $token;

    /**
     * Constructor
     */
    public function __construct()
    {
    }

    /**
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param string $token
     *
     * @return UserLessonToken
     */
    public function setToken($token)
    {
        $this->token = $token;

        return $this;
    }

    /**
     * Get token
     *
     * @return string 
     */
    public function getToken()
    {
        return $this->token;
    }

    /**
     * Get lesson
     *
     * @return Lesson
     */
    public function getLesson()
    {
        return $this->lesson;
    }

    /**
     * @param User $user
     *
     * @return UserLessonToken
     */
    public function setUser(User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return \UserBundle\Entity\User 
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param Lesson $lesson
     *
     * @return UserLessonToken
     */
    public function setLesson(Lesson $lesson = null)
    {
        $this->lesson = $lesson;

        return $this;
    }
}
