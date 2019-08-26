<?php

namespace StorageBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class UpdateItemKeysCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('storage:update-item-keys')
            ->setDescription('Update storage item keys after migrating reseller');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $storageManager = $container->get('storage.manager');

        $storageManager->updateItemKeys();
        $output->writeln('ITEM KEYS UPDATED');
    }
}
