<?php

namespace UserBundle\Entity;

use AppBundle\Entity\Lesson;
use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;
use StorageBundle\Entity\StorageItem;
use StorageBundle\Utils\FileManager;
use Symfony\Component\Validator\Constraints as Assert;
use UserBundle\Validator\Constraints as UserAssert;
use Doctrine\Common\Collections\ArrayCollection;
use PlanBundle\Entity\Plan;
use Misd\PhoneNumberBundle\Validator\Constraints\PhoneNumber as AssertPhoneNumber;

/**
 * @ORM\Entity(repositoryClass="UserBundle\Entity\Repository\UserRepository")
 * @ORM\Table(name="users")
 * @ORM\InheritanceType("JOINED")
 * @ORM\DiscriminatorColumn(name="user_type", type="string")
 * @ORM\DiscriminatorMap({
 *     "admin"="Admin",
 *     "user"="User",
 *     "teacher"="Teacher",
 *     "consultant"="Consultant",
 *     "reseller"="Reseller"
 * })
 * @ORM\AttributeOverrides({
 *      @ORM\AttributeOverride(name="emailCanonical",
 *          column=@ORM\Column(
 *              name     = "email_canonical",
 *              unique   = false,
 *              length   = 180,
 *              nullable = false
 *          )
 *      ),
 *     @ORM\AttributeOverride(name="usernameCanonical",
 *          column=@ORM\Column(
 *              name     = "username_canonical",
 *              unique   = false,
 *              length   = 180,
 *              nullable = false
 *          )
 *      )
 * })
 *
 * @UserAssert\UniqueEmail(
 *     groups={"UserRegistration", "UserEdit", "ConsultantRegistration", "TeacherRegistration", "ResellerRegistration"}
 * )
 * @UserAssert\UniqueSubdomain(
 *     groups={"SubdomainRegistration"}
 * )
 * @UserAssert\TeachersNumber(
 *     groups={"UserRegistration", "TeacherRegistration"}
 * )
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @Assert\NotBlank(
     *     message="The password should not be blank",
     *     groups={"UserRegistration"}
     * )
     * @Assert\Length(
     *     min=6,
     *     max=50,
     *     minMessage="The password should be at least {{ limit }} characters long",
     *     maxMessage="The password should not be longer than {{ limit }} characters",
     *     groups={"UserRegistration"}
     * )
     * @Assert\Regex(
     *     pattern="/\s/",
     *     match=false,
     *     message="The password should not contain spaces",
     *     groups={"UserRegistration"}
     * )
     * @Assert\Regex(
     *     pattern="/(?=.*[a-z])/",
     *     match=true,
     *     message="The password should contain at least one letter in lowercase",
     *     groups={"UserRegistration"}
     * )
     * @Assert\Regex(
     *     pattern="/(?=.*[A-Z])/",
     *     match=true,
     *     message="The password should contain at least one letter in uppercase",
     *     groups={"UserRegistration"}
     * )
     */
    protected $plainPassword;

    /**
     * @Assert\NotBlank(
     *     message="The email should not be blank",
     *     groups={"UserRegistration", "UserEdit", "TeacherRegistration", "ConsultantRegistration", "ResellerRegistration"}
     * )
     * @Assert\Email(
     *     message="This value is not a valid email address",
     *     groups={"UserRegistration", "UserEdit", "TeacherRegistration", "ConsultantRegistration", "ResellerRegistration"}
     * )
     */
    protected $email;

    /**
     * @ORM\Column(type="string")
     * @Assert\NotBlank(
     *     message="The name should not be blank",
     *     groups={"UserRegistration", "UserEdit", "TeacherRegistration", "ConsultantRegistration", "ResellerRegistration"}
     * )
     * @Assert\Length(
     *      min = 2,
     *      max = 50,
     *      minMessage = "The name should be at least {{ limit }} characters long",
     *      maxMessage = "The name should not be longer than {{ limit }} characters",
     *      groups={"UserRegistration", "UserEdit", "TeacherRegistration", "ConsultantRegistration", "ResellerRegistration"}
     * )
     */
    protected $name;

    /**
     * @ORM\Column(type="phone_number", nullable=true)
     * @AssertPhoneNumber(type="mobile")
     */
    protected $phone;

    /**
     * @ORM\Column(type="boolean", options={"default": false})
     */
    protected $banned = false;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $studentsInClassroom;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $minutesLessonDuration;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $registrationDate;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $stripeActive = false;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $customerId;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $subscriptionId;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $subscriptionEndsAt;

    /**
     * @ORM\ManyToOne(targetEntity="PlanBundle\Entity\Plan", inversedBy="users")
     */
    protected $plan;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $last4CardCode;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="UserBundle\Entity\Teacher", mappedBy="user", cascade={"remove"})
     */
    protected $teachers;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Lesson", mappedBy="user", cascade={"remove"})
     */
    protected $lessons;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $numberOfTeachers;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\UserLessonToken", mappedBy="user", cascade={"remove"})
     */
    protected $userLessonTokens;

    /**
     * @ORM\Column(type="string", nullable=true)
     *
     * @Assert\File(mimeTypes={ "image/png", "image/jpeg" }, mimeTypesMessage ="Please, upload image in supported format: .jpg, .png", groups={"UserEdit"})
     */
    private $classroomLogo;

    /**
     * @ORM\Column(type="integer", options={"default": 0})
     */
    protected $storageSpaceUsed = 0;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    protected $storageLimit;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="StorageBundle\Entity\StorageItem", mappedBy="user", cascade={"remove"})
     */
    protected $storageItems;

    /**
     * @var Reseller
     *
     * @ORM\ManyToOne(targetEntity="UserBundle\Entity\Reseller", inversedBy="users")
     */
    protected $reseller;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=true)
     *
     * @Assert\NotBlank(
     *     groups={"ResellerRegistration"}
     * )
     * @Assert\Length(
     *     min="2",
     *     max="10",
     *     groups={"SubdomainRegistration"}
     * )
     * @Assert\Regex(
     *     pattern="/^[a-zA-Z0-9]*$/",
     *     groups={"SubdomainRegistration"}
     * )
     */
    protected $subdomain;

    /**
     * @var \DateTime
     *
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $expirationDate;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=true)
     */
    protected $apiKey;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=true)
     */
    protected $apiSubscriptionId;

    /**
     * @var Plan
     *
     * @ORM\ManyToOne(targetEntity="PlanBundle\Entity\Plan", inversedBy="users")
     */
    protected $apiPlan;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $apiStudentsInClassroom;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $apiNumberOfTeachers;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $apiMinutesLessonDuration;

    /**
     * @var float
     *
     * @ORM\Column(type="float", nullable=true)
     */
    protected $maxUploadSize;

    /**
     * @var float
     *
     * @ORM\Column(type="float", nullable=true)
     */
    protected $apiMaxUploadSize;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $apiConcurrentLessons;

    public function __construct()
    {
        parent::__construct();

        $this->teachers = new ArrayCollection();
        $this->lessons = new ArrayCollection();
        $this->apiKey = md5(uniqid());
    }

    /**
     * @return mixed
     */
    public function getClassroomLogo()
    {
        return $this->classroomLogo;
    }

    /**
     * @param mixed $classroomLogo
     *
     * @return User
     */
    public function setClassroomLogo($classroomLogo)
    {
        $this->classroomLogo = $classroomLogo;

        return $this;
    }


    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param $email
     *
     * @return User
     */
    public function setEmail($email)
    {
        $this->email = $email;
        $this->setUsername($email);

        return $this;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     *
     * @return User
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Set phone
     *
     * @param string $phone
     *
     * @return User
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;

        return $this;
    }

    /**
     * Get phone
     *
     * @return string
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * @return mixed
     */
    public function getBanned()
    {
        return $this->banned;
    }

    /**
     * @param bool $banned
     *
     * @return User
     */
    public function setBanned($banned)
    {
        $this->banned = $banned;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getStudentsInClassroom()
    {
        return $this->studentsInClassroom;
    }

    /**
     * @param mixed $studentsInClassroom
     *
     * @return User
     */
    public function setStudentsInClassroom($studentsInClassroom)
    {
        $this->studentsInClassroom = $studentsInClassroom;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getMinutesLessonDuration()
    {
        return $this->minutesLessonDuration;
    }

    /**
     * @param mixed $minutesLessonDuration
     *
     * @return User
     */
    public function setMinutesLessonDuration($minutesLessonDuration)
    {
        $this->minutesLessonDuration = $minutesLessonDuration;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getRegistrationDate()
    {
        return $this->registrationDate;
    }

    /**
     * @param mixed $registrationDate
     *
     * @return User
     */
    public function setRegistrationDate($registrationDate)
    {
        $this->registrationDate = $registrationDate;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getStripeActive()
    {
        return $this->stripeActive;
    }

    /**
     * @param bool $isActive
     *
     * @return User
     */
    public function setStripeActive($isActive)
    {
        $this->stripeActive = $isActive;

        return $this;
    }

    public function isCancelled()
    {
        return !$this->stripeActive;
    }

    /**
     * @return mixed
     */
    public function getCustomerId()
    {
        return $this->customerId;
    }

    /**
     * @param $customerId
     *
     * @return User
     */
    public function setCustomerId($customerId)
    {
        $this->customerId = $customerId;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getSubscriptionEndsAt()
    {
        return $this->subscriptionEndsAt;
    }

    /**
     * @param $endsAt
     *
     * @return User
     */
    public function setSubscriptionEndsAt($endsAt)
    {
        $this->subscriptionEndsAt = $endsAt;

        return $this;
    }

    public function setSubscriptionEndsAtMicroseconds($microsec)
    {
        $this->setSubscriptionEndsAt(new \DateTime(date('Y-m-d H:i:s.', $microsec)));
    }

    /**
     * @return mixed
     */
    public function getSubscriptionId()
    {
        return $this->subscriptionId;
    }

    /**
     * @param $subscriptionId
     *
     * @return User
     */
    public function setSubscriptionId($subscriptionId)
    {
        $this->subscriptionId = $subscriptionId;

        return $this;
    }

    public function makeSubscriptionValid()
    {
        $this->stripeActive = true;
        $this->subscriptionEndsAt = null;
    }

    /**
     * @return Plan
     */
    public function getPlan()
    {
        return $this->plan;
    }

    /**
     * @param mixed $plan
     */
    public function setPlan($plan)
    {
        $this->plan = $plan;
    }

    /**
     * @return mixed
     */
    public function getLast4CardCode()
    {
        return $this->last4CardCode;
    }

    /**
     * @param mixed $last4CardCode
     *
     * @return User
     */
    public function setLast4CardCode($last4CardCode)
    {
        $this->last4CardCode = $last4CardCode;

        return $this;
    }

    /**
     * @return bool
     */
    public function isSubscribed()
    {
        return $this->stripeActive;
    }

    /**
     * @return ArrayCollection
     */
    public function getTeachers()
    {
        return $this->teachers;
    }

    /**
     * @param mixed $teachers
     */
    public function setTeachers($teachers)
    {
        $this->teachers = $teachers;
    }

    /**
     * @return mixed
     */
    public function getNumberOfTeachers()
    {
        return $this->numberOfTeachers;
    }

    /**
     * @return mixed
     */
    public function getNumberOfTeachersWithoutMainTeacher()
    {
        return $this->numberOfTeachers - 1;
    }

    /**
     * @param mixed $numberOfTeachers
     *
     * @return User
     */
    public function setNumberOfTeachers($numberOfTeachers)
    {
        $this->numberOfTeachers = $numberOfTeachers;

        return $this;
    }

    /**
     * Add teachers
     *
     * @param \UserBundle\Entity\Teacher $teachers
     *
     * @return User
     */
    public function addTeacher(\UserBundle\Entity\Teacher $teachers)
    {
        $this->teachers[] = $teachers;

        return $this;
    }

    /**
     * Remove teachers
     *
     * @param \UserBundle\Entity\Teacher $teachers
     */
    public function removeTeacher(\UserBundle\Entity\Teacher $teachers)
    {
        $this->teachers->removeElement($teachers);
    }

    /**
     * Add lessons
     *
     * @param \AppBundle\Entity\Lesson $lessons
     *
     * @return User
     */
    public function addLesson(\AppBundle\Entity\Lesson $lessons)
    {
        $this->lessons[] = $lessons;

        return $this;
    }

    /**
     * Remove lessons
     *
     * @param \AppBundle\Entity\Lesson $lessons
     */
    public function removeLesson(\AppBundle\Entity\Lesson $lessons)
    {
        $this->lessons->removeElement($lessons);
    }

    /**
     * Get lessons
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getLessons()
    {
        return $this->lessons;
    }

    public function hasLesson(Lesson $lesson)
    {
        return $this->lessons->contains($lesson);
    }

    /**
     * Add userLessonTokens
     *
     * @param \AppBundle\Entity\UserLessonToken $userLessonTokens
     *
     * @return User
     */
    public function addUserLessonToken(\AppBundle\Entity\UserLessonToken $userLessonTokens)
    {
        $this->userLessonTokens[] = $userLessonTokens;

        return $this;
    }

    /**
     * Remove userLessonTokens
     *
     * @param \AppBundle\Entity\UserLessonToken $userLessonTokens
     */
    public function removeUserLessonToken(\AppBundle\Entity\UserLessonToken $userLessonTokens)
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
     * @return mixed
     */
    public function getStorageSpaceUsed()
    {
        return $this->storageSpaceUsed;
    }

    /**
     * @param mixed $storageSpaceUsed
     *
     * @return User
     */
    public function setStorageSpaceUsed($storageSpaceUsed)
    {
        $this->storageSpaceUsed = $storageSpaceUsed;

        return $this;
    }

    /**
     * @return float
     */
    public function getStorageLimit()
    {
        if ($this->storageLimit === null) {
            $plan = $this->getPlan();
            if (!$plan)
                return FileManager::$FREE_STORAGE_LIMIT;

            return $plan->getCloudStorageSize() * 1024 * 1024 * 1024;
        }

        return $this->storageLimit * 1024 * 1024 * 1024;
    }

    /**
     * @return mixed
     */
    public function getStorageLimitInGb()
    {
        return $this->storageLimit;
    }

    /**
     * @return mixed
     */
    public function getPlanStorageLimit()
    {
        $plan = $this->getPlan();
        if (!$plan)
            return FileManager::$FREE_STORAGE_LIMIT;

        return $plan->getCloudStorageSize();
    }

    /**
     * @param mixed $storageLimit
     *
     * @return User
     */
    public function setStorageLimit($storageLimit)
    {
        $this->storageLimit = $storageLimit;

        return $this;
    }

    /**
     * @param StorageItem $storageItem
     *
     * @return User
     */
    public function addStorageItems(StorageItem $storageItem)
    {
        $this->storageItems[] = $storageItem;

        return $this;
    }

    /**
     * @param StorageItem $storageItem
     *
     * @return User
     */
    public function removeStorageItems(StorageItem $storageItem)
    {
        $this->storageItems->removeElement($storageItem);

        return $this;
    }

    /**
     * @return ArrayCollection
     */
    public function getStorageItems()
    {
        return $this->storageItems;
    }

    /**
     * @return Reseller
     */
    public function getReseller()
    {
        return $this->reseller;
    }

    /**
     * @param Reseller|null $reseller
     *
     * @return User
     */
    public function setReseller($reseller)
    {
        $this->reseller = $reseller;

        return $this;
    }

    /**
     * @return string
     */
    public function getSubdomain()
    {
        return $this->subdomain;
    }

    /**
     * @param string $subdomain
     *
     * @return User
     */
    public function setSubdomain($subdomain)
    {
        $this->subdomain = $subdomain;

        return $this;
    }

    /**
     * @return ArrayCollection
     */
    public function getActiveTeachers()
    {
        return $this->teachers->filter(function (User $user) {
            return $user->isEnabled();
        });
    }

    /**
     * @return int
     */
    public function countTeachers()
    {
        return $this->getActiveTeachers()->count();
    }

    /**
     * @return \DateTime
     */
    public function getExpirationDate()
    {
        return $this->expirationDate;
    }

    /**
     * @param \DateTime $expirationDate
     *
     * @return User
     */
    public function setExpirationDate($expirationDate)
    {
        $this->expirationDate = $expirationDate;

        return $this;
    }

    /**
     * @return string
     */
    public function getApiKey()
    {
        return $this->apiKey;
    }

    /**
     * @param string $apiKey
     *
     * @return User
     */
    public function setApiKey($apiKey)
    {
        $this->apiKey = $apiKey;

        return $this;
    }

    /**
     * @param int $lessonId
     *
     * @return bool
     */
    public function hasLessonWithId($lessonId)
    {
        return $this->lessons->exists(function ($key, Lesson $lesson) use ($lessonId) {
            return $lesson->isApiLesson() && $lesson->getId() === $lessonId;
        });
    }

    /**
     * @return string
     */
    public function getApiSubscriptionId()
    {
        return $this->apiSubscriptionId;
    }

    /**
     * @param string $apiSubscriptionId
     *
     * @return User
     */
    public function setApiSubscriptionId($apiSubscriptionId)
    {
        $this->apiSubscriptionId = $apiSubscriptionId;

        return $this;
    }

    /**
     * @param Plan   $plan
     * @param string $subscriptionId
     */
    public function updatePlan(Plan $plan, $subscriptionId)
    {
        $this->updateSubscriptionId($subscriptionId, $plan->isApiPlan());
        $this->makeSubscriptionValid();
        if ($plan->isApiPlan()) {
            $this->setApiPlan($plan);

            return;
        }

        $this->setPlan($plan);
    }

    /**
     * @param string $subscriptionId
     * @param bool   $isApiSubscription
     */
    public function updateSubscriptionId($subscriptionId, $isApiSubscription = false)
    {
        if ($isApiSubscription) {
            $this->setApiSubscriptionId($subscriptionId);

            return;
        }

        $this->setSubscriptionId($subscriptionId);
    }

    /**
     * @return Plan
     */
    public function getApiPlan()
    {
        return $this->apiPlan;
    }

    /**
     * @param Plan $apiPlan
     *
     * @return User
     */
    public function setApiPlan(Plan $apiPlan)
    {
        $this->apiPlan = $apiPlan;

        return $this;
    }

    /**
     * @param Plan $plan
     *
     * @return bool
     */
    public function isOnPlan(Plan $plan)
    {
        if ($plan->isApiPlan()) {
            return $this->getApiPlan() === $plan;
        }

        return $this->getPlan() === $plan;
    }

    /**
     * @return int
     */
    public function getApiStudentsInClassroom()
    {
        return $this->apiStudentsInClassroom ?: $this->apiPlan->getStudentsInClassroom()[0];
    }

    /**
     * @param int $apiStudentsInClassroom
     *
     * @return User
     */
    public function setApiStudentsInClassroom($apiStudentsInClassroom)
    {
        $this->apiStudentsInClassroom = $apiStudentsInClassroom;

        return $this;
    }

    /**
     * @return int
     */
    public function getApiNumberOfTeachers()
    {
        return $this->apiNumberOfTeachers;
    }

    /**
     * @param int $apiNumberOfTeachers
     *
     * @return User
     */
    public function setApiNumberOfTeachers($apiNumberOfTeachers)
    {
        $this->apiNumberOfTeachers = $apiNumberOfTeachers;

        return $this;
    }

    /**
     * @return int
     */
    public function getApiMinutesLessonDuration()
    {
        return $this->apiMinutesLessonDuration ?: $this->apiPlan->getMinutesLessonDuration();
    }

    /**
     * @param int $apiMinutesLessonDuration
     *
     * @return User
     */
    public function setApiMinutesLessonDuration($apiMinutesLessonDuration)
    {
        $this->apiMinutesLessonDuration = $apiMinutesLessonDuration;

        return $this;
    }

    /**
     * @return float
     */
    public function getMaxUploadSize()
    {
        if ($this->maxUploadSize)
            return $this->maxUploadSize;

        if ($this->getPlan())
            return $this->getPlan()->getMaxUploadSize();

        return 20;
    }

    /**
     * @param float $maxUploadSize
     *
     * @return User
     */
    public function setMaxUploadSize($maxUploadSize)
    {
        $this->maxUploadSize = $maxUploadSize;

        return $this;
    }

    public function getApiMaxUploadSize()
    {
        return $this->apiMaxUploadSize ?: $this->getApiPlan()->getMaxUploadSize();
    }

    public function setApiMaxUploadSize($apiMaxUploadSize)
    {
        $this->apiMaxUploadSize = $apiMaxUploadSize;

        return $this;
    }

    /**
     * @return int
     */
    public function getApiConcurrentLessons()
    {
        return $this->apiConcurrentLessons ?: $this->apiPlan->getConcurrentLessons();
    }

    /**
     * @param int $apiConcurrentLessons
     *
     * @return User
     */
    public function setApiConcurrentLessons($apiConcurrentLessons)
    {
        $this->apiConcurrentLessons = $apiConcurrentLessons;

        return $this;
    }

    /**
     * @param Plan $plan
     */
    public function changePlan(Plan $plan)
    {
        if ($plan->isApiPlan()) {
            $this->setApiPlan($plan);
            return;
        }

        $this->setPlan($plan);
    }

    /**
     * @return bool
     */
    public function isGuest()
    {
        return $this->hasRole('ROLE_GUEST');
    }

    /**
     * @return bool
     */
    public function isMasterTeacher()
    {
        return $this->hasRole('ROLE_TEACHER');
    }

    /**
     * @return bool
     */
    public function hasPaidPlan()
    {
        return $this->isMasterTeacher() && (!$this->getPlan()->isBasic() || !$this->getApiPlan()->isBasic());
    }
}
