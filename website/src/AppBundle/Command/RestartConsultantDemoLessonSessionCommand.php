<?php

namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class RestartConsultantDemoLessonSessionCommand /*extends ContainerAwareCommand*/
{
   /* protected function configure()
    {
        $this
            ->setName('app:restart-consultant-lesson-session')
            ->setDescription('Remove expired demo lessons and its temporary users');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();

        $lessonManager = $container->get('lesson.manager');

        $lessonManager->resetConsultantDemoLesson();

        $output->writeln('Consultant demo lesson has been restarted');
    }*/
}