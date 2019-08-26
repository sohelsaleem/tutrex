<?php

namespace AppBundle\Command;

use PlanBundle\Entity\Plan;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class InitProjectCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('app:init-project')
            ->setDescription('Initialize project');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $planManager = $this->getContainer()->get('plan.manager');

        $this->createBasicPlans($input, $output);
        $this->createMonthPlans($input, $output);
        $this->createYearPlans($input, $output);

        $output->writeln("updating stripe plans if need");
        $planManager->updateAllStripePlans();

        $output->writeln('Project is initialized');
    }

    private function createBasicPlans(InputInterface $input, OutputInterface $output)
    {
        $entityManager = $this->getContainer()->get('doctrine')->getEntityManager();
        $planManager = $this->getContainer()->get('plan.manager');

        $stripeId = "Basic";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Basic');
            $plan->setPrice(0);
            $plan->setStripePlanId($stripeId);
            $plan->setStudentsInClassroom([5]);
            $plan->setNumberOfTeachers([1]);
            $plan->setMinutesLessonDuration(30);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "ProMonth";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $proPlan = new Plan();
            $proPlan->setName('Pro');
            $proPlan->setPrice(1999);
            $proPlan->setNumberOfTeachers([1]);
            $proPlan->setMinutesLessonDuration(120);
            $proPlan->setStudentsInClassroom([10, 25, 50, 100, 500]);
            $proPlan->setStripePlanId($stripeId);
            $proPlan->setCurrency(Plan::CURRENCY_USD);
            $proPlan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($proPlan);
        }


        $stripeId = "EnterpriseMonth";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $enterprisePlan = new Plan();
            $enterprisePlan->setName('Enterprise');
            $enterprisePlan->setPrice(3999);
            $enterprisePlan->setNumberOfTeachers([5, 10, 25]);
            $enterprisePlan->setMinutesLessonDuration(180);
            $enterprisePlan->setStudentsInClassroom([10, 25, 50, 100, 500]);
            $enterprisePlan->setStripePlanId($stripeId);
            $enterprisePlan->setCurrency(Plan::CURRENCY_USD);
            $enterprisePlan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($enterprisePlan);
        }
        $entityManager->flush();
    }

    private function createMonthPlans(InputInterface $input, OutputInterface $output)
    {
        $entityManager = $this->getContainer()->get('doctrine')->getEntityManager();
        $planManager = $this->getContainer()->get('plan.manager');

        $stripeId = "ProMonth_10_1";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Pro');
            $plan->setPrice(1999);
            $plan->setParentPlanId(2);
            $plan->setNumberOfTeachers([1]);
            $plan->setMinutesLessonDuration(120);
            $plan->setStudentsInClassroom([10]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "ProMonth_25_1";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Pro');
            $plan->setPrice(2999);
            $plan->setParentPlanId(2);
            $plan->setNumberOfTeachers([1]);
            $plan->setMinutesLessonDuration(120);
            $plan->setStudentsInClassroom([25]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "ProMonth_50_1";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Pro');
            $plan->setPrice(3999);
            $plan->setParentPlanId(2);
            $plan->setNumberOfTeachers([1]);
            $plan->setMinutesLessonDuration(120);
            $plan->setStudentsInClassroom([50]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "ProMonth_100_1";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Pro');
            $plan->setPrice(4999);
            $plan->setParentPlanId(2);
            $plan->setNumberOfTeachers([1]);
            $plan->setMinutesLessonDuration(120);
            $plan->setStudentsInClassroom([100]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "ProMonth_500_1";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Pro');
            $plan->setPrice(7999);
            $plan->setParentPlanId(2);
            $plan->setNumberOfTeachers([1]);
            $plan->setMinutesLessonDuration(120);
            $plan->setStudentsInClassroom([500]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_25_5";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(4999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([5]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([25]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_25_10";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(5999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([10]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([25]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_25_25";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(8999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([25]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([25]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_50_5";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(5999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([5]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([50]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_50_10";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(6999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([10]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([50]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_50_25";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(9999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([25]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([50]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_100_5";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(6999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([5]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([100]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_100_10";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(7999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([10]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([100]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_100_25";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(10999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([25]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([100]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_10_5";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(3999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([5]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([10]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_10_10";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(4999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([10]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([10]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_10_25";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(7999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([25]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([10]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_500_5";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(9999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([5]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([500]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_500_10";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(10999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([10]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([500]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseMonth_500_25";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(14999);
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([25]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([500]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $entityManager->flush();
    }

    private function createYearPlans(InputInterface $input, OutputInterface $output)
    {
        $entityManager = $this->getContainer()->get('doctrine')->getEntityManager();
        $planManager = $this->getContainer()->get('plan.manager');

        $stripeId = "ProYear_10_1";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Pro');
            $plan->setPrice(19200);
            $plan->setPeriod('year');
            $plan->setParentPlanId(2);
            $plan->setNumberOfTeachers([1]);
            $plan->setMinutesLessonDuration(120);
            $plan->setStudentsInClassroom([10]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "ProYear_25_1";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Pro');
            $plan->setPrice(28800);
            $plan->setPeriod('year');
            $plan->setParentPlanId(2);
            $plan->setNumberOfTeachers([1]);
            $plan->setMinutesLessonDuration(120);
            $plan->setStudentsInClassroom([25]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "ProYear_50_1";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Pro');
            $plan->setPrice(38400);
            $plan->setPeriod('year');
            $plan->setParentPlanId(2);
            $plan->setNumberOfTeachers([1]);
            $plan->setMinutesLessonDuration(120);
            $plan->setStudentsInClassroom([50]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "ProYear_100_1";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Pro');
            $plan->setPrice(48000);
            $plan->setPeriod('year');
            $plan->setParentPlanId(2);
            $plan->setNumberOfTeachers([1]);
            $plan->setMinutesLessonDuration(120);
            $plan->setStudentsInClassroom([100]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "ProYear_500_1";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Pro');
            $plan->setPrice(76800);
            $plan->setPeriod('year');
            $plan->setParentPlanId(2);
            $plan->setNumberOfTeachers([1]);
            $plan->setMinutesLessonDuration(120);
            $plan->setStudentsInClassroom([500]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_25_5";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(48000);
            $plan->setPeriod('year');
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([5]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([25]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_25_10";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(57600);
            $plan->setPeriod('year');
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([10]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([25]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_25_25";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(86400);
            $plan->setParentPlanId(3);
            $plan->setPeriod('year');
            $plan->setNumberOfTeachers([25]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([25]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_50_5";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(57600);
            $plan->setPeriod('year');
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([5]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([50]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_50_10";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(67200);
            $plan->setPeriod('year');
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([10]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([50]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_50_25";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(96000);
            $plan->setPeriod('year');
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([25]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([50]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_100_5";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(67200);
            $plan->setPeriod('year');
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([5]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([100]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_100_10";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(76800);
            $plan->setPeriod('year');
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([10]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([100]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_100_25";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(105600);
            $plan->setPeriod('year');
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([25]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([100]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_10_5";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(38400);
            $plan->setPeriod('year');
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([5]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([10]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_10_10";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(48000);
            $plan->setPeriod('year');
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([10]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([10]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_10_25";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(76800);
            $plan->setPeriod('year');
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([25]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([10]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_500_5";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(96000);
            $plan->setPeriod('year');
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([5]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([500]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_500_10";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(105600);
            $plan->setPeriod('year');
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([10]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([500]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $stripeId = "EnterpriseYear_500_25";
        if (is_null($planManager->findOnePlanBy(["stripePlanId" => $stripeId]))) {
            $output->writeln("create " . $stripeId);
            $plan = new Plan();
            $plan->setName('Enterprise');
            $plan->setPrice(144000);
            $plan->setPeriod('year');
            $plan->setParentPlanId(3);
            $plan->setNumberOfTeachers([25]);
            $plan->setMinutesLessonDuration(180);
            $plan->setStudentsInClassroom([500]);
            $plan->setStripePlanId($stripeId);
            $plan->setCurrency(Plan::CURRENCY_USD);
            $plan->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.');
            $entityManager->persist($plan);
        }

        $entityManager->flush();
    }
}
