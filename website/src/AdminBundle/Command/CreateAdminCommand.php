<?php

namespace AdminBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use UserBundle\Entity\Admin;

class CreateAdminCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('admin:create')
            ->setDescription('Create admin');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $userManager = $this->getContainer()->get('fos_user.user_manager');

        $admin = new Admin();

        $admin->addRole('ROLE_ADMIN');
        $admin->setName('admin');
        $admin->setEmail('admin');
        $admin->setPlainPassword('@Werty12');
        $admin->setEnabled(true);
        $admin->setRegistrationDate(new \DateTime());
        $userManager->updateUser($admin);

        $output->writeln('Admin is created');
    }
}