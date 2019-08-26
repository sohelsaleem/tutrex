<?php

namespace AppBundle\Command;

use PlanBundle\Entity\Plan;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CreatePlansCommand extends ContainerAwareCommand
{
    private $BASIC_PARAMS = [
        'stripeId' => 'Basic',
        'name' => 'Basic',
        'price' => 0,
        'numberOfTeachers' => 1,
        'numberOfStudents' => 5,
        'lessonDuration' => 60,
        'maxUpload' => 20,
        'cloudStorage' => 5,
        'apiPlan' => false,
        'description' => 'Basic website plan.',
        'concurrentLessons' => null,
        'lessonMinutesPerMonth' => null,
    ];

    private $PRO_PARAMS = [
        'stripeId' => 'ProYear',
        'name' => 'Pro',
        'price' => 2900,
        'numberOfTeachers' => 5,
        'numberOfStudents' => 50,
        'lessonDuration' => 120,
        'maxUpload' => 100,
        'cloudStorage' => 50,
        'apiPlan' => false,
        'description' => 'Pro website plan.',
        'concurrentLessons' => null,
        'lessonMinutesPerMonth' => null,
    ];

    private $ENTERPRISE_PARAMS = [
        'stripeId' => 'EnterpriseYear',
        'name' => 'Enterprise',
        'price' => 9900,
        'numberOfTeachers' => 25,
        'numberOfStudents' => 100,
        'lessonDuration' => 180,
        'maxUpload' => 100,
        'cloudStorage' => null,
        'apiPlan' => false,
        'description' => 'Enterprise website plan.',
        'concurrentLessons' => null,
        'lessonMinutesPerMonth' => null,
    ];

    protected function configure()
    {
        $this
            ->setName('app:create-plans')
            ->setDescription('Creates plans for website subscription.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $planManager = $container->get('plan.manager');
        $entityManager = $container->get('doctrine.orm.default_entity_manager');

        $basicPlan = $planManager->createPlanFromParams($this->BASIC_PARAMS);
        $proPlan = $planManager->createPlanFromParams($this->PRO_PARAMS);
        $enterprisePlan = $planManager->createPlanFromParams($this->ENTERPRISE_PARAMS);
        $entityManager->flush();
        $planManager->updateAllStripePlans([$basicPlan, $proPlan, $enterprisePlan]);
    }
}
