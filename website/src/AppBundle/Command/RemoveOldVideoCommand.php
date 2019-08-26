<?php

namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class RemoveOldVideoCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('app:remove-old-video')
            ->setDescription('Remove video for past lessons');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $lessonManager = $container->get('lesson.manager');
        $date = new \DateTime($container->getParameter('video_delete_timeout').' minutes');
        $ts = date_timestamp_get($date);
        $output->writeln('search for ' . date('m-d-Y H:i',$ts));
        $d = $lessonManager->getPastLessonsForRemove($ts);
        foreach ($d as $row) {
            if($row->getLessonRecord()) {
                foreach ($row->getLessonRecord() as $record) {
                    if(isset($record['recordPath']) && file_exists($record['recordPath'])) {
                        unlink($record['recordPath']);
                    }
                }
            }
            $row->setLessonRecord(null);
            $output->writeln('remove files for lesson '. $row->getId(). ' for time ' . date('m-d-Y H:i', $row->getUTCStartDateTimeStamp()));
        }
        $lessonManager->updateLesson();
    }
}