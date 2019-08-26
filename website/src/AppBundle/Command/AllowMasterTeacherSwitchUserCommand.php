<?php

namespace AppBundle\Command;


use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class AllowMasterTeacherSwitchUserCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('app:master-allow-switch-user')
            ->setDescription('Allow teachers switch user');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $userManager = $container->get('user.manager');
        $entityManager = $this->getContainer()->get('doctrine')->getEntityManager();

        $teachers = $userManager->getMasterTeachers();
        foreach ($teachers as $t) {
            if (!$t->hasRole('ROLE_ALLOWED_TO_SWITCH')) {
                $t->addRole('ROLE_ALLOWED_TO_SWITCH');
                $entityManager->persist($t);
            }
        }
        $entityManager->flush();
    }
}