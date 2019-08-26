<?php

namespace UserBundle\Utils;


use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class FileUploader
{
    private $targetDir;

    public function __construct($targetDir)
    {
        $this->targetDir = $targetDir;
    }

    public function upload(UploadedFile $file)
    {
        $fs = new Filesystem();
        if (!$fs->exists($this->getTargetDir()))
            $fs->mkdir($this->getTargetDir(), 0777);

        $fileName = md5(uniqid()) . '.' . $file->guessExtension();

        $image = new ImageResize($file->getPath() . '/' . $file->getFilename());
        $image->resizeToBestFit(400, 200);

        $image->save($this->getTargetDir() . '/' . $fileName);

        return $fileName;
    }

    public function getTargetDir()
    {
        return $this->targetDir;
    }
}