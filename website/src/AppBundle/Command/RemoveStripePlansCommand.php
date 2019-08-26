<?php

namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class RemoveStripePlansCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('app:remove-stripe-plans')
            ->setDescription('Remove 10 first stripe plans (fire again to remove rest of them)');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $planManager = $this->getContainer()->get('plan.manager');

        $planManager->removeStripePlans();

        $output->writeln('Plans were removed');
    }
}