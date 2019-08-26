<?php

namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class RemoveOldDemoLessonsCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('app:remove-expired-demo-lessons')
            ->setDescription('Remove expired demo lessons and its temporary users');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();

        $demoLessonPeriod = $container->getParameter('demo_lesson_period');

        $lessonManager = $container->get('lesson.manager');
        $userLessonTokenManager = $container->get('userLessonToken.manager');
        $userManager = $container->get('user.manager');

        $expiredDemoLessons = $lessonManager->getExpiredDemoLessons($demoLessonPeriod);

        foreach($expiredDemoLessons as $expiredDemoLesson) {
            $demoLessonTokens =  $userLessonTokenManager->getDemoLessonTokens($expiredDemoLesson);

            $lessonManager->deleteLesson($expiredDemoLesson);

            foreach($demoLessonTokens as $demoLessonToken) {
                $userManager->deleteUser($demoLessonToken->getUser());
            }
        }

        $output->writeln('Expired lessons have been removed');
    }
}