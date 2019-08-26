<?php

namespace PlanBundle\Manager;

use PlanBundle\Entity\Plan;
use Symfony\Component\DependencyInjection\ContainerInterface;
use UserBundle\Entity\Teacher;
use UserBundle\Entity\User;
use UserBundle\Exception\ExceededPaidTeachersException;

class PlanManager
{
    protected $container;
    protected $entityManager;
    protected $planRepository;
    protected $stripePublic;
    protected $stripeSecret;
    protected $logger;
    protected $stripeManager;
    protected $teacherManager;
    protected $userManager;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->entityManager = $container->get('doctrine.orm.default_entity_manager');
        $this->planRepository = $this->entityManager->getRepository('PlanBundle:Plan');
        $this->stripePublic = $container->getParameter('stripe_public_key');
        $this->stripeSecret = $container->getParameter('stripe_secret_key');
        $this->logger = $container->get('logger');
        $this->stripeManager = $container->get('stripe.manager');
        $this->teacherManager = $container->get('teacher.manager');
        $this->userManager = $container->get('user.manager');
    }

    /**
     * @param array $criteria
     *
     * @return Plan[]
     */
    public function findBy(array $criteria)
    {
        return $this->planRepository->findBy($criteria);
    }

    /**
     * @return Plan[]
     */
    public function findAllWebsitePlans()
    {
        return $this->planRepository->findBy([
            'apiPlan' => false,
            'obsolete' => false,
        ]);
    }

    /**
     * @return Plan[]
     */
    public function findAllApiPlans()
    {
        return $this->planRepository->findBy([
            'apiPlan' => true,
            'obsolete' => false,
        ]);
    }

    public function getPlans()
    {
        $plans = $this->planRepository->findAll();

        return $plans;
    }

    public function findPlanById($id)
    {
        $location = $this->planRepository->findOneById($id);

        return $location;
    }

    /**
     * @param array $params
     *
     * @return Plan
     */
    public function findOnePlanBy(array $params)
    {
        $plan = $this->planRepository->findOneBy($params);

        return $plan;
    }

    public function savePlan($plan)
    {
        $this->entityManager->persist($plan);
        $this->updatePlan();
    }

    public function updatePlan()
    {
        $this->entityManager->flush();
    }

    /**
     * @param Plan[]|null $plans
     */
    public function updateAllStripePlans($plans = null)
    {
        if (!$plans)
            $plans = $this->getPlans();
        $this->logger->info("updateAllStripePlans");
        foreach ($plans as $plan) {
            $this->updateOrCreateStripePlan($plan);
        }
    }

    public function updateOrCreateStripePlan(Plan $plan)
    {
        \Stripe\Stripe::setApiKey($this->stripeSecret);

        $stripePlan = $plan->retrieveStripePlan(null);

        $this->logger->info("checking ".$plan->getStripePlanId());

        if (is_null($stripePlan)) {
            $this->logger->info("no such plan creating ".$plan->getStripePlanId());
            $plan->createStripePlan(null);

            return;
        }

        if (!$plan->isStripePlanEqual($stripePlan)) {
            $this->logger->info("Stripe plan differs, recreating");
            $stripePlan->delete();
            $plan->createStripePlan(null);
            //$this->updateAllValidSubscriptionsWithPlan($plan);
        }
    }

    public function removeStripePlans()
    {
        \Stripe\Stripe::setApiKey($this->stripeSecret);

        $planList = \Stripe\Plan::all();
        $plans = $planList->data;

        foreach ($plans as $plan) {
            $stripePlan = \Stripe\Plan::retrieve($plan->id);
            $stripePlan->delete();
        }
    }

    public function getOrCreateChildPlan(Plan $basicPlan, $students, $teachers)
    {
        //check that plan is basic
        if (!$basicPlan->isBasicPlan()) {
            throw new \Exception("this plan is not basic!");
        } elseif (!$students) {
            throw new \Exception("got no students!");
        } elseif (!$teachers) {
            throw new \Exception("got no teachers!");
        }

        $childPlan = $this->findOnePlanBy([
            "stripePlanId" => Plan::generatePlanIdBasedOnBasicPlan($basicPlan, $students, $teachers),
        ]);

        //if there is no such child plan => create it
        if (is_null($childPlan)) {
            $childPlan = Plan::createChildPlan($basicPlan, $students, $teachers);

            $this->updateOrCreateStripePlan($childPlan);

            $this->entityManager->persist($childPlan);
            $this->entityManager->flush();
        }

        return $childPlan;
    }

    /**
     * @param User $user
     * @param Plan $plan
     *
     * @return User
     */
    public function postChangingPlanActions(User $user, Plan $plan)
    {
        if ($plan->isApiPlan()) {
            $user->setApiNumberOfTeachers($plan->getNumberOfTeachers()[0]);
            $user->setApiStudentsInClassroom($plan->getStudentsInClassroom()[0]);
            $user->setApiMinutesLessonDuration($plan->getMinutesLessonDuration());
            $user->setApiMaxUploadSize($plan->getMaxUploadSize());
            $user->setApiConcurrentLessons($plan->getConcurrentLessons());

            return $user;
        }

        $newAvailableNumberOfTeachers = $plan->getNumberOfTeachers()[0] - 1;
        $numberOfStudents = $plan->getStudentsInClassroom()[0];
        $oldNumberOfTeachers = count($user->getTeachers());
        $oldAvailableNumberOfTeachers = $user->getNumberOfTeachersWithoutMainTeacher();
        $numberOfActiveTeachers = count($this->teacherManager->getActiveTeachersByUser($user));

        if (($oldAvailableNumberOfTeachers - $newAvailableNumberOfTeachers) > 0) {
            if ($numberOfActiveTeachers > $newAvailableNumberOfTeachers) {
                $numberOfExceedingTeachers = $numberOfActiveTeachers - $newAvailableNumberOfTeachers;

                $this->teacherManager->blockLastTeachers($user, $numberOfExceedingTeachers);
            }
        } elseif (($oldAvailableNumberOfTeachers - $newAvailableNumberOfTeachers) < 0) {
            if ($oldNumberOfTeachers > $oldAvailableNumberOfTeachers) {
                $remainingAvailableNumberOfTeachers = $newAvailableNumberOfTeachers - $oldAvailableNumberOfTeachers;

                $this->teacherManager->unblockTeachers($user, $remainingAvailableNumberOfTeachers);
            }
        }
        /** @var Teacher[] $subTeachers */
        $subTeachers = $this->teacherManager->getActiveTeachersByUser($user);
        foreach ($subTeachers as $subTeacher) {
            $subTeacher->setStudentsInClassroom($numberOfStudents);
            $subTeacher->setMinutesLessonDuration($plan->getMinutesLessonDuration());
            $subTeacher->setMaxUploadSize($plan->getMaxUploadSize());
        }

        $user->setNumberOfTeachers($newAvailableNumberOfTeachers + 1);
        $user->setStudentsInClassroom($numberOfStudents);
        $user->setMinutesLessonDuration($plan->getMinutesLessonDuration());
        $user->setStorageLimit($plan->getCloudStorageSize());
        $user->setMaxUploadSize($plan->getMaxUploadSize());

        return $user;
    }

    /**
     * @param User $user
     */
    public function changePlanToBasic(User $user)
    {
        $plan = $this->findOnePlanBy([
            'name' => 'Basic',
        ]);

        $this->stripeManager->changeUserPlanTo($user, $plan);
        $this->postChangingPlanActions($user, $plan);

        $this->userManager->persistUser($user);
    }

    /**
     * @param string $stripePlanId
     * @param User   $user
     *
     * @return array
     */
    public function getPreChangePlanData($stripePlanId, User $user)
    {
        $newPlan = $this->findOnePlanBy([
            'stripePlanId' => $stripePlanId,
        ]);
        $isApiPlan = $newPlan->isApiPlan();
        $currentPlan = $isApiPlan ? $user->getApiPlan() : $user->getPlan();
        $currentPossibilities = [
            'numberOfStudents' => $isApiPlan ? $user->getApiStudentsInClassroom() : $user->getStudentsInClassroom(),
            'numberOfTeachers' => $isApiPlan ? $user->getApiNumberOfTeachers() : $user->getNumberOfTeachers(),
            'lessonDuration' => $isApiPlan ? $user->getApiMinutesLessonDuration() : $user->getMinutesLessonDuration(),
            'paymentPeriod' => $currentPlan->getPeriod(),
        ];
        $newPossibilities = [
            'numberOfStudents' => $newPlan->getStudentsInClassroom()[0],
            'numberOfTeachers' => $newPlan->getNumberOfTeachers()[0],
            'lessonDuration' => $newPlan->getMinutesLessonDuration(),
            'paymentPeriod' => $newPlan->getPeriod(),
        ];

        return [
            'current' => $currentPossibilities,
            'new' => $newPossibilities,
        ];
    }

    /**
     * @param string $stripeId
     *
     * @return Plan
     */
    public function getOrCreatePlanByStripeId($stripeId)
    {
        $existingPlan = $this->findOnePlanBy(['stripePlanId' => $stripeId]);
        if ($existingPlan)
            return $existingPlan;

        return new Plan();
    }

    /**
     * @param array $params
     *
     * @return Plan
     */
    public function createPlanFromParams(array $params)
    {
        $plan = $this->getOrCreatePlanByStripeId($params['stripeId']);
        $plan
            ->setName($params['name'])
            ->setPrice($params['price'])
            ->setPeriod('year')
            ->setNumberOfTeachers([$params['numberOfTeachers']])
            ->setMinutesLessonDuration($params['lessonDuration'])
            ->setStudentsInClassroom([$params['numberOfStudents']])
            ->setStripePlanId($params['stripeId'])
            ->setCurrency(Plan::CURRENCY_USD)
            ->setDescription($params['description'])
            ->setApiPlan($params['apiPlan'])
            ->setMaxUploadSize($params['maxUpload'])
            ->setCloudStorageSize($params['cloudStorage'])
            ->setConcurrentLessons($params['concurrentLessons'])
            ->setLessonMinutesPerMonth($params['lessonMinutesPerMonth']);

        $this->entityManager->persist($plan);

        return $plan;
    }

    /**
     * @param User $user
     *
     * @throws ExceededPaidTeachersException
     */
    public function switchTeacherPlan(User $user)
    {
        $newStripePlanId = $user->getPlan()->getStripePlanId() === 'Basic' ? 'EnterpriseYear' : 'Basic';
        $newPlan = $this->findOnePlanBy([
            'stripePlanId' => $newStripePlanId,
        ]);

        $this->changeTeacherPlan($user, $newPlan);
    }

    /**
     * @param User $user
     * @param Plan $plan
     *
     * @throws ExceededPaidTeachersException
     */
    public function changeTeacherPlan(User $user, Plan $plan)
    {
        $reseller = $user->getReseller();

        if ($reseller && !$plan->isBasic() && $reseller->isExceededPaidTeachers()) {
            throw new ExceededPaidTeachersException();
        }

        $this->postChangingPlanActions($user, $plan);

        $user->changePlan($plan);

        $this->entityManager->flush();
    }
}
