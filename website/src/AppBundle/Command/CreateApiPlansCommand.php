<?php

namespace AppBundle\Command;

use PlanBundle\Entity\Plan;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CreateApiPlansCommand extends ContainerAwareCommand
{
    private $API_BASIC_PARAMS = [
        'stripeId' => 'ApiBasic',
        'name' => 'API Basic',
        'price' => 0,
        'numberOfTeachers' => 1,
        'numberOfStudents' => 5,
        'lessonDuration' => 30,
        'maxUpload' => 20,
        'cloudStorage' => null,
        'apiPlan' => true,
        'description' => 'Basic API plan.',
        'concurrentLessons' => 1,
        'lessonMinutesPerMonth' => 300,
    ];

    private $API_5_PARAMS = [
        'stripeId' => 'Api5YearNew',
        'name' => 'API 5',
        'price' => 4900,
        'numberOfTeachers' => 1,
        'numberOfStudents' => 50,
        'lessonDuration' => 120,
        'maxUpload' => 100,
        'cloudStorage' => null,
        'apiPlan' => true,
        'description' => 'API 5 plan.',
        'concurrentLessons' => 5,
        'lessonMinutesPerMonth' => null,
    ];

    private $API_25_PARAMS = [
        'stripeId' => 'Api25YearNew',
        'name' => 'API 25',
        'price' => 9900,
        'numberOfTeachers' => 1,
        'numberOfStudents' => 100,
        'lessonDuration' => 180,
        'maxUpload' => 100,
        'cloudStorage' => null,
        'apiPlan' => true,
        'description' => 'API 25 plan.',
        'concurrentLessons' => 25,
        'lessonMinutesPerMonth' => null,
    ];

    private $API_50_PARAMS = [
        'stripeId' => 'Api50YearNew',
        'name' => 'API 50',
        'price' => 19900,
        'numberOfTeachers' => 1,
        'numberOfStudents' => 100,
        'lessonDuration' => 180,
        'maxUpload' => 100,
        'cloudStorage' => null,
        'apiPlan' => true,
        'description' => 'API 50 plan.',
        'concurrentLessons' => 50,
        'lessonMinutesPerMonth' => null,
    ];

    protected function configure()
    {
        $this
            ->setName('app:create-api-plans')
            ->setDescription('Creates plans for API subscription.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $planManager = $container->get('plan.manager');
        $entityManager = $container->get('doctrine.orm.default_entity_manager');

        $basicPlan = $planManager->createPlanFromParams($this->API_BASIC_PARAMS);
        $api5Plan = $planManager->createPlanFromParams($this->API_5_PARAMS);
        $api25Plan = $planManager->createPlanFromParams($this->API_25_PARAMS);
        $api50Plan = $planManager->createPlanFromParams($this->API_50_PARAMS);
        $entityManager->flush();
        $planManager->updateAllStripePlans([$basicPlan, $api5Plan, $api25Plan, $api50Plan]);
    }
}
