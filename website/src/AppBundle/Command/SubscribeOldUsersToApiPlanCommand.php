<?php

namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class SubscribeOldUsersToApiPlanCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('app:subscribe-old-users-to-api')
            ->setDescription('Subscribe old users to basic API plan.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $planManager = $container->get('plan.manager');
        $userManager = $container->get('user.manager');
        $stripeManager = $container->get('stripe.manager');
        $entityManager = $container->get('doctrine.orm.default_entity_manager');

        $basicApiPlan = $planManager->findOnePlanBy(['name' => 'API Basic']);
        $oldUsers = $userManager->findMasterTeachersWithoutApiKey();

        foreach ($oldUsers as $user) {
            try {
                $user->setApiPlan($basicApiPlan);
                $user->setApiStudentsInClassroom($basicApiPlan->getStudentsInClassroom()[0]);
                $user->setApiNumberOfTeachers($basicApiPlan->getNumberOfTeachers()[0]);
                $user->setApiMinutesLessonDuration($basicApiPlan->getMinutesLessonDuration());
                $user->setApiMaxUploadSize($basicApiPlan->getMaxUploadSize());

                $customer = $stripeManager->retrieveCustomerFromUser($user);
                if ($customer->subscriptions->total_count < 2) {
                    $apiSubscription = $stripeManager->createSubscriptionForCustomer($customer, $basicApiPlan, null);
                    $user->setApiSubscriptionId($apiSubscription->id);
                } else {
                    $user->setApiSubscriptionId($customer->subscriptions->data[1]->id);
                }

                $user->setApiKey(md5(uniqid()));
            } catch (\Exception $exception) {
            }
        }

        $entityManager->flush();
    }
}
