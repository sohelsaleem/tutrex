<?php

namespace AppBundle\Command;


use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class AllowAdminSwitchUserCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('app:admin-allow-switch-user')
            ->setDescription('Allow admins switch user');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $userManager = $container->get('user.manager');
        $entityManager = $this->getContainer()->get('doctrine')->getEntityManager();

        $admins = $userManager->getAdmins();
        foreach ($admins as $a) {
            if (!$a->hasRole('ROLE_ALLOWED_TO_SWITCH')) {
                $a->addRole('ROLE_ALLOWED_TO_SWITCH');
                $entityManager->persist($a);
            }
        }
        $entityManager->flush();
    }
}