<?php

namespace UserBundle\EventListener;

use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use UserBundle\Utils\FileUploader;
use UserBundle\Entity\User;

class LogoUploaderListener
{
    private $uploader;

    public function __construct(FileUploader $uploader)
    {
        $this->uploader = $uploader;
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();

        $this->uploadFile($entity);
    }

    public function preUpdate(PreUpdateEventArgs $args)
    {
        $entity = $args->getEntity();

        $this->uploadFile($entity);
    }

    private function uploadFile($entity)
    {
        // upload only works for User entities
        if (!$entity instanceof User) {
            return;
        }

        $file = $entity->getClassroomLogo();

        // only upload new files
        if ($file instanceof UploadedFile) {
            $fileName = $this->uploader->upload($file);
            $entity->setClassroomLogo($fileName);
        }
    }

    public function postLoad(LifecycleEventArgs $args)
    {
//        $entity = $args->getEntity();
//
//        if (!$entity instanceof User) {
//            return;
//        }
//
//        if ($fileName = $entity->getClassroomLogo()) {
//            $entity->setClassroomLogo(new File($this->uploader->getTargetDir() . '/' . $fileName));
//        }
    }
}
