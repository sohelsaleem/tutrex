<?php

namespace PlanBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Stripe\Error\InvalidRequest;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="plans")
 */
class Plan
{
    const CURRENCY_USD = "usd";

    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string")
     * @Assert\NotBlank()
     * @Assert\Length(
     *      min = 2,
     *      max = 50,
     *      minMessage = "The name must be at least {{ limit }} characters long",
     *      maxMessage = "The name cannot be longer than {{ limit }} characters"
     * )
     */
    protected $name;

    /**
     * @ORM\Column(type="decimal")
     * @Assert\NotBlank()
     * @Assert\Range(
     *     min = 1,
     *     max = 1000000,
     *     minMessage="The price must be at least {{ limit }}",
     *     maxMessage="The price cannot be larger than {{ limit }}"
     * )
     */
    protected $price;

    /**
     * @ORM\Column(type="simple_array", nullable=true)
     */
    protected $studentsInClassroom;

    /**
     * @ORM\Column(type="integer")
     */
    protected $minutesLessonDuration;

    /**
     * @ORM\OneToMany(targetEntity="UserBundle\Entity\User", mappedBy="plan")
     */
    protected $users;

    /**
     * @ORM\Column(type="string", unique=true)
     */
    protected $stripePlanId;

    /**
     * @ORM\Column(type="simple_array", nullable=true)
     */
    protected $numberOfTeachers;

    /**
     * @ORM\Column(type="string")
     */
    protected $currency;

    /**
     * @ORM\Column(type="string")
     * @Assert\NotBlank()
     * @Assert\Length(
     *      min = 2,
     *      max = 500,
     *      minMessage = "The value must be at least {{ limit }} characters long",
     *      maxMessage = "The value cannot be longer than {{ limit }} characters"
     * )
     */
    protected $description;

    /**
     * @ORM\Column(type="string", options={"default": "month"})
     */
    protected $period = 'month';

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $parentPlanId;

    /**
     * @var bool
     *
     * @ORM\Column(type="boolean")
     */
    protected $apiPlan;

    /**
     * @var float
     *
     * @ORM\Column(type="float")
     */
    protected $maxUploadSize;

    /**
     * @var float
     *
     * @ORM\Column(type="float", nullable=true)
     */
    protected $cloudStorageSize;

    /**
     * @var bool
     *
     * @ORM\Column(type="boolean")
     */
    protected $obsolete;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $concurrentLessons;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $lessonMinutesPerMonth;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->apiPlan = false;
        $this->obsolete = false;
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
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     *
     * @return Plan
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @param int $price
     *
     * @return Plan
     */
    public function setPrice($price)
    {
        $this->price = $price;

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
     * @param array $studentsInClassroom
     *
     * @return Plan
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
     * @param int $minutesLessonDuration
     *
     * @return Plan
     */
    public function setMinutesLessonDuration($minutesLessonDuration)
    {
        $this->minutesLessonDuration = $minutesLessonDuration;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getUsers()
    {
        return $this->users;
    }

    /**
     * @param mixed $users
     */
    public function setUsers($users)
    {
        $this->users = $users;
    }

    /**
     * @return mixed
     */
    public function getStripePlanId()
    {
        return $this->stripePlanId;
    }

    /**
     * @param string $stripePlanId
     *
     * @return Plan
     */
    public function setStripePlanId($stripePlanId)
    {
        $this->stripePlanId = $stripePlanId;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getCurrency()
    {
        return $this->currency;
    }

    /**
     * @param string $currency
     *
     * @return Plan
     */
    public function setCurrency($currency)
    {
        $this->currency = $currency;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param string $description
     *
     * @return Plan
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getNumberOfTeachers()
    {
        return $this->numberOfTeachers;
    }

    /**
     * @param array $numberOfTeachers
     *
     * @return Plan
     */
    public function setNumberOfTeachers($numberOfTeachers)
    {
        $this->numberOfTeachers = $numberOfTeachers;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getPeriod()
    {
        return $this->period;
    }

    /**
     * @param mixed $period
     *
     * @return Plan
     */
    public function setPeriod($period)
    {
        $this->period = $period;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getParentPlanId()
    {
        return $this->parentPlanId;
    }

    /**
     * @param int $id
     */
    public function setParentPlanId($id)
    {
        $this->parentPlanId = $id;
    }

    public function isBasicPlan()
    {
        return is_null($this->parentPlanId);
    }

    public function isFreePlan()
    {
        return $this->price == 0;
    }

    static function generatePlanIdBasedOnBasicPlan(Plan $basePlan, $students, $teachers)
    {
        return $basePlan->getStripePlanId()."_".$students."_".$teachers;
    }

    static function generatePlanNameBasedOnBasicPlan(Plan $basePlan, $students, $teachers)
    {
        return $basePlan->getName()."_".$students."_".$teachers;
    }

    public function retrieveStripePlan($stripeSecret)
    {
        if (!is_null($stripeSecret)) {
            \Stripe\Stripe::setApiKey($stripeSecret);
        }

        try {
            return \Stripe\Plan::retrieve($this->getStripePlanId());
        } catch (InvalidRequest $e) {
            return null;
        }
    }

    public function createStripePlan($stripeSecret)
    {
        if (!is_null($stripeSecret)) {
            \Stripe\Stripe::setApiKey($stripeSecret);
        }

        return \Stripe\Plan::create([
            "amount" => 12 * $this->price,
            "interval" => $this->period,
            "name" => $this->getName(),
            "currency" => $this->getCurrency(),
            "id" => $this->getStripePlanId(),
        ]);
    }

    /**
     * @param $stripePlan
     *
     * @return bool
     */
    public function isStripePlanEqual($stripePlan)
    {
        return $stripePlan->name === $this->getName();
    }

    static function createChildPlan(Plan $basicPlan, $students, $teachers)
    {
        if (!$basicPlan->isBasicPlan()) {
            return null;
        }

        $plan = new Plan();
        $plan->setName(Plan::generatePlanNameBasedOnBasicPlan($basicPlan, $students, $teachers));
        $plan->setStripePlanId(Plan::generatePlanIdBasedOnBasicPlan($basicPlan, $students, $teachers));
        $plan->setPrice($basicPlan->getPrice());
        $plan->setDescription($basicPlan->getDescription());
        $plan->setParentPlanId($basicPlan->getId());
        $plan->setStudentsInClassroom([$students]);
        $plan->setNumberOfTeachers([$teachers]);
        $plan->setMinutesLessonDuration($basicPlan->getMinutesLessonDuration());
        $plan->setCurrency(Plan::CURRENCY_USD);

        return $plan;
    }

    /**
     * @return bool
     */
    public function isApiPlan()
    {
        return $this->apiPlan;
    }

    /**
     * @param bool $apiPlan
     *
     * @return Plan
     */
    public function setApiPlan($apiPlan)
    {
        $this->apiPlan = $apiPlan;

        return $this;
    }

    /**
     * @return float
     */
    public function getMaxUploadSize()
    {
        return $this->maxUploadSize;
    }

    /**
     * @param float $maxUploadSize
     *
     * @return Plan
     */
    public function setMaxUploadSize($maxUploadSize)
    {
        $this->maxUploadSize = $maxUploadSize;

        return $this;
    }

    /**
     * @return float
     */
    public function getCloudStorageSize()
    {
        return $this->cloudStorageSize;
    }

    /**
     * @param float $cloudStorageSize
     *
     * @return Plan
     */
    public function setCloudStorageSize($cloudStorageSize)
    {
        $this->cloudStorageSize = $cloudStorageSize;

        return $this;
    }

    /**
     * @return bool
     */
    public function isUnlimitedCloudStorage()
    {
        return is_null($this->cloudStorageSize);
    }


    /**
     * @return bool
     */
    public function isObsolete()
    {
        return $this->obsolete;
    }

    /**
     * @param bool $obsolete
     *
     * @return Plan
     */
    public function setObsolete($obsolete)
    {
        $this->obsolete = $obsolete;

        return $this;
    }

    /**
     * @return int
     */
    public function getConcurrentLessons()
    {
        return $this->concurrentLessons;
    }

    /**
     * @param int $concurrentLessons
     *
     * @return Plan
     */
    public function setConcurrentLessons($concurrentLessons)
    {
        $this->concurrentLessons = $concurrentLessons;

        return $this;
    }

    /**
     * @return int
     */
    public function getLessonMinutesPerMonth()
    {
        return $this->lessonMinutesPerMonth;
    }

    /**
     * @param int $lessonMinutesPerMonth
     *
     * @return Plan
     */
    public function setLessonMinutesPerMonth($lessonMinutesPerMonth)
    {
        $this->lessonMinutesPerMonth = $lessonMinutesPerMonth;

        return $this;
    }

    /**
     * @return bool
     */
    public function isBasic()
    {
        return $this->stripePlanId === 'Basic' || $this->stripePlanId === 'ApiBasic';
    }
}
