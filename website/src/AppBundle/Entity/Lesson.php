<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use AppBundle\Validator\Constraints as CustomAssert;
use UserBundle\Entity\Teacher;
use UserBundle\Entity\User;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Repository\LessonRepository")
 * @ORM\Table(name="lessons")
 * @UniqueEntity(fields={"title", "user"}, message="This title is already used")
 * @CustomAssert\IsNotEmptyDuration
 * @CustomAssert\ApproxDurationLimit
 */
class Lesson
{
    const SORT_FIELD_ID = 'id';
    const SORT_FIELD_TITLE = 'title';
    const SORT_FIELD_START_TIME = 'UTCStartDateTimeStamp';

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string")
     *
     * @Assert\NotBlank(
     *      message="The title should not be blank"
     * )
     * @Assert\Length(
     *      min = 2,
     *      max = 50,
     *      minMessage = "The title should be at least {{ limit }} characters long",
     *      maxMessage = "The title should not be longer than {{ limit }} characters"
     * )
     */
    protected $title;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\Range(
     *     min = 0,
     *     max = 10,
     *     minMessage = "The hour duration should not be negative",
     *     maxMessage = "The hour duration should not be longer than {{ limit }} hours"
     * )
     */
    protected $durationHours = 0;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\Expression(expression="!(this.getDurationHours() == 0 and this.getDurationMinutes() == 0)", message="Lesson duration should be at least 1 minute.")
     * @Assert\Range(
     *     min = 0,
     *     max = 59,
     *     minMessage = "The minutes duration should not be negative",
     *     maxMessage = "The minutes duration should not be longer than {{ limit }} minutes"
     * )
     */
    protected $durationMinutes = 0;

    /**
     * @ORM\Column(type="date")
     */
    protected $date;

    /**
     * @ORM\Column(type="string")
     */
    protected $time;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $UTCStartDateTimeStamp;

    /**
     * @ORM\ManyToOne(targetEntity="UserBundle\Entity\User", inversedBy="lessons", cascade={"persist"})
     * @ORM\JoinColumn(name="user_id", nullable=true)
     */
    protected $user;

    /**
     * @ORM\Column(type="string")
     */
    protected $linkId;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     */
    protected $lessonCode;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\UserLessonToken", mappedBy="lesson", cascade={"remove"})
     */
    protected $userLessonTokens;

    /**
     * @ORM\Column(type="integer", options={"default": 0})
     */
    protected $numberOfInvitedUsers = 0;

    /**
     * @ORM\Column(type="boolean", options={"default": false})
     */
    protected $started = false;

    /**
     * @ORM\Column(type="boolean", options={"default": false})
     */
    protected $finished = false;


    /**
     * @ORM\Column(type="array", name="lesson_record", nullable=true)
     */
    protected $lessonRecord;

    /**
     * @ORM\Column(type="boolean", options={"default": false})
     */
    protected $isDemoLesson = false;

    /**
     * @var bool
     *
     * @ORM\Column(type="boolean")
     */
    protected $apiLesson;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=true)
     */
    protected $exitLink;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=true)
     */
    protected $shareLink;

    public $dateWithTimeZone;

    public function __construct()
    {
        $this->userLessonTokens = new \Doctrine\Common\Collections\ArrayCollection();
        $this->lessonCode = array_reduce(range(0, 5), function ($result) {
            $result .= rand(0, 9);

            return $result;
        }, '');
        $this->apiLesson = false;
    }

    /**
     * @return array
     */
    public function toDto()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'duration' => $this->getDurationInMinutes(),
            'recordUrl' => $this->getLessonRecordUrl(),
            'startTime' => $this->UTCStartDateTimeStamp,
            'status' => $this->availableForEnter(),
        ];
    }

    /**
     * @param mixed $dateWithTimeZone
     */
    public function setDateWithTimeZone($dateWithTimeZone)
    {
        $this->dateWithTimeZone = $dateWithTimeZone;
    }


    /**
     * @param mixed $lessonRecord
     *
     * @return Lesson
     */
    public function setLessonRecord($lessonRecord)
    {
        $this->lessonRecord = $lessonRecord;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getLessonRecord()
    {
        return $this->lessonRecord;
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Lesson
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set user
     *
     * @param \UserBundle\Entity\User $user
     *
     * @return Lesson
     */
    public function setUser(\UserBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \UserBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set date
     *
     * @param \DateTime $date
     *
     * @return Lesson
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get date
     *
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Set time
     *
     * @param string $time
     *
     * @return Lesson
     */
    public function setTime($time)
    {
        $this->time = $time;

        return $this;
    }

    /**
     * Get time
     *
     * @return \DateTime
     */
    public function getTime()
    {
        return $this->time;
    }

    /**
     * Set linkId
     *
     * @param string $linkId
     *
     * @return Lesson
     */
    public function setLinkId($linkId)
    {
        $this->linkId = $linkId;

        return $this;
    }

    /**
     * Get linkId
     *
     * @return string
     */
    public function getLinkId()
    {
        return $this->linkId;
    }

    /**
     * Add userLessonTokens
     *
     * @param \AppBundle\Entity\UserLessonToken $userLessonTokens
     *
     * @return Lesson
     */
    public function addUserLessonToken(UserLessonToken $userLessonTokens)
    {
        $this->userLessonTokens[] = $userLessonTokens;

        return $this;
    }

    /**
     * Remove userLessonTokens
     *
     * @param \AppBundle\Entity\UserLessonToken $userLessonTokens
     */
    public function removeUserLessonToken(UserLessonToken $userLessonTokens)
    {
        $this->userLessonTokens->removeElement($userLessonTokens);
    }

    /**
     * Get userLessonTokens
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getUserLessonTokens()
    {
        return $this->userLessonTokens;
    }

    /**
     * Set durationHours
     *
     * @param string $durationHours
     *
     * @return Lesson
     */
    public function setDurationHours($durationHours)
    {
        $this->durationHours = $durationHours;

        return $this;
    }

    /**
     * Get durationHours
     *
     * @return string
     */
    public function getDurationHours()
    {
        return $this->durationHours;
    }

    /**
     * Set durationMinutes
     *
     * @param string $durationMinutes
     *
     * @return Lesson
     */
    public function setDurationMinutes($durationMinutes)
    {
        $this->durationMinutes = $durationMinutes;

        return $this;
    }

    /**
     * Get durationMinutes
     *
     * @return string
     */
    public function getDurationMinutes()
    {
        return $this->durationMinutes;
    }

    /**
     * Set UTCStartDateTimeStamp
     *
     * @param string $uTCStartDateTimeStamp
     *
     * @return Lesson
     */
    public function setUTCStartDateTimeStamp($uTCStartDateTimeStamp)
    {
        $this->UTCStartDateTimeStamp = $uTCStartDateTimeStamp;

        return $this;
    }

    /**
     * Get UTCStartDateTimeStamp
     *
     * @return int
     */
    public function getUTCStartDateTimeStamp()
    {
        return $this->UTCStartDateTimeStamp;
    }

    /**
     * Set numberOfInvitedUsers
     *
     * @param integer $numberOfInvitedUsers
     *
     * @return Lesson
     */
    public function setNumberOfInvitedUsers($numberOfInvitedUsers)
    {
        $this->numberOfInvitedUsers = $numberOfInvitedUsers;

        return $this;
    }

    /**
     * Get numberOfInvitedUsers
     *
     * @return integer
     */
    public function getNumberOfInvitedUsers()
    {
        return $this->numberOfInvitedUsers;
    }

    public function availableForEnter()
    {
        $lessonTimeStamp = $this->getUTCStartDateTimeStamp();

        $currentDateTimeObject = new \DateTime();
        $currentDateTimeObject->setTimezone(new \DateTimeZone('UTC'));

        $currentTimeStamp = $currentDateTimeObject->getTimestamp();
        $lessonDuration = $this->getUser()->getMinutesLessonDuration() * 60;


        if ($currentTimeStamp < ($lessonTimeStamp - (60 * 15))) {
            return 'coming';
        } elseif (($currentTimeStamp > ($lessonTimeStamp + $lessonDuration + (60 * 15))) && !$this->getStarted()) {
            return 'expired';
        } elseif ($currentTimeStamp > ($lessonTimeStamp + $lessonDuration + (60 * 15)) || $this->getFinished()) {
            return 'past';
        } else {
            return 'available';
        }
    }

    public function getLessonStatus($user)
    {
        $lessonTimeStamp = $this->getUTCStartDateTimeStamp();

        $currentDateTimeObject = new \DateTime();
        $currentDateTimeObject->setTimezone(new \DateTimeZone('UTC'));
        $currentTimeStamp = $currentDateTimeObject->getTimestamp();
        $lessonDuration = $this->getUser()->getMinutesLessonDuration() * 60;

        $lessonStartDelayTime = 0;

        if ($this->getUser() == $user) {
            $lessonStartDelayTime = 60 * 15;
        }

        if ($currentTimeStamp < $lessonTimeStamp - $lessonStartDelayTime) {
            return 'coming';
        }
        if (($currentTimeStamp > ($lessonTimeStamp + $lessonDuration + (60 * 15))) && !$this->getStarted()) {
            return 'expired';
        }
        if (($currentTimeStamp > ($lessonTimeStamp + $lessonDuration + (60 * 15))) || $this->getFinished()) {
            return 'past';
        }

        return 'available';
    }


    public function getTimeToLesson()
    {
        $totalSecondsToStartLesson = $this->getTimeToLessonInSeconds();

        $hoursToStartLesson = intval($totalSecondsToStartLesson / 3600);
        $minutesToStartLesson = intval(($totalSecondsToStartLesson - $hoursToStartLesson * 3600) / 60);
        $secondsToStartLesson = $totalSecondsToStartLesson - $hoursToStartLesson * 3600 - $minutesToStartLesson * 60;

        return [
            'hours' => $hoursToStartLesson,
            'minutes' => $minutesToStartLesson,
            'seconds' => $secondsToStartLesson,
        ];
    }

    public function getTimeToLessonInSeconds()
    {
        $lessonTimeStamp = $this->getUTCStartDateTimeStamp();

        $currentDateTimeObject = new \DateTime();
        $currentTimeStamp = $currentDateTimeObject->getTimestamp();

        return $lessonTimeStamp - $currentTimeStamp;
    }

    public function getVideoAvailable()
    {
        return $this->getLessonRecord() && count($this->getLessonRecord()) > 0;
    }

    /**
     * Set started
     *
     * @param boolean $started
     *
     * @return Lesson
     */
    public function setStarted($started)
    {
        $this->started = $started;

        return $this;
    }

    /**
     * Get started
     *
     * @return boolean
     */
    public function getStarted()
    {
        return $this->started;
    }

    /**
     * Set finished
     *
     * @param boolean $finished
     *
     * @return Lesson
     */
    public function setFinished($finished)
    {
        $this->finished = $finished;

        return $this;
    }

    /**
     * Get finished
     *
     * @return boolean
     */
    public function getFinished()
    {
        return $this->finished;
    }

    /**
     * Set isDemoLesson
     *
     * @param boolean $isDemoLesson
     *
     * @return Lesson
     */
    public function setIsDemoLesson($isDemoLesson)
    {
        $this->isDemoLesson = $isDemoLesson;

        return $this;
    }

    /**
     * Get isDemoLesson
     *
     * @return boolean
     */
    public function getIsDemoLesson()
    {
        return $this->isDemoLesson;
    }

    /**
     * @return string
     */
    public function getLessonCode()
    {
        return $this->lessonCode;
    }

    /**
     * @param string $lessonCode
     *
     * @return Lesson
     */
    public function setLessonCode($lessonCode)
    {
        $this->lessonCode = $lessonCode;

        return $this;
    }

    /**
     * @return int
     */
    public function getDurationInMinutes()
    {
        return $this->durationHours * 60 + $this->durationMinutes;
    }

    /**
     * @return string|null
     */
    public function getLessonRecordUrl()
    {
        if (!count($this->lessonRecord))
            return null;

        return $this->lessonRecord[0]['recordURL'];
    }

    /**
     * @return null|string
     */
    public function getTeacherToken()
    {
        $teacher = $this->getUser();
        $tokens = $this->getUserLessonTokens()->filter(function (UserLessonToken $userLessonToken) use ($teacher) {
            return $userLessonToken->getUser() === $teacher;
        });

        if (!$tokens->count())
            return null;

        /** @var UserLessonToken $teacherToken */
        $teacherToken = $tokens[0];

        return $teacherToken->getToken();
    }

    /**
     * @param mixed $timestamp
     *
     * @return Lesson
     */
    public function updateStartTime($timestamp)
    {
        $lessonDateTime = new \DateTime('@'.$timestamp);
        $this
            ->setUTCStartDateTimeStamp($timestamp)
            ->setDate($lessonDateTime)
            ->setTime($lessonDateTime->format('g:i A'));

        return $this;
    }

    /**
     * @param int $duration
     *
     * @return Lesson
     */
    public function updateDuration($duration)
    {
        $durationHours = (int) ($duration / 60);
        $durationMinutes = $duration % 60;
        $this
            ->setDurationHours($durationHours)
            ->setDurationMinutes($durationMinutes);

        return $this;
    }

    /**
     * @return bool
     */
    public function isApiLesson()
    {
        return $this->apiLesson;
    }

    /**
     * @param bool $apiLesson
     *
     * @return Lesson
     */
    public function setApiLesson($apiLesson)
    {
        $this->apiLesson = $apiLesson;

        return $this;
    }

    /**
     * @return string
     */
    public function getExitLink()
    {
        return $this->exitLink;
    }

    /**
     * @param string $exitLink
     *
     * @return Lesson
     */
    public function setExitLink($exitLink)
    {
        $this->exitLink = $exitLink;

        return $this;
    }

    /**
     * @return string
     */
    public function getShareLink()
    {
        return $this->shareLink;
    }

    /**
     * @param string $shareLink
     *
     * @return Lesson
     */
    public function setShareLink($shareLink)
    {
        $this->shareLink = $shareLink;

        return $this;
    }

    /**
     * @return User
     */
    public function getMasterTeacher()
    {
        $user = $this->getUser();

        if ($user instanceof Teacher)
            return $user->getUser();

        return $user;
    }

    /**
     * @return bool
     */
    public function isRecordingAvailable()
    {
        $masterTeacher = $this->getMasterTeacher();

        if (!$masterTeacher->getPlan())
            return false;

        if ($this->isApiLesson())
            return $masterTeacher->getApiPlan()->getName() !== 'API Basic';

        return $masterTeacher->getPlan()->getName() !== 'Basic';
    }
}
