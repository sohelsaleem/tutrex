<?php

namespace StorageBundle\Utils;

use Knp\Bundle\GaufretteBundle\FilesystemMap;
use StorageBundle\Entity\StorageItem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use UserBundle\Entity\User;

class FileManager
{
    public static $FREE_STORAGE_LIMIT = 1073741824;
    public static $PAID_STORAGE_LIMIT = 5368709120;

    private $filesystem;

    public function __construct(FilesystemMap $map)
    {
        $this->filesystem = $map->get('cloud_storage_filesystem');
    }

    public function delete(StorageItem $item)
    {
        $adapter = $this->filesystem->getAdapter();
        $filePath = $item->getFilePath();
        if (!$adapter->exists($filePath))
            return;

        $adapter->delete($filePath);
    }

    /**
     * @param User  $user
     * @param array $files
     *
     * @return bool
     */
    public function isCanUpload(User $user, $files)
    {
        if (!$user->getStorageLimit())
            return true;

        $totalSize = $this->getTotalSize($files);

        return $user->getStorageLimit() > $user->getStorageSpaceUsed() + $totalSize;
    }

    private function getTotalSize($files)
    {
        $totalSize = 0;
        foreach ($files as $f) {
            $totalSize += $f->getClientSize();
        }

        return $totalSize;
    }

    public function upload(User $user, $files)
    {
        $targetDir = $this->getUserDir($user);
        $adapter = $this->filesystem->getAdapter();
        $items = [];

        foreach ($files as $f) {
            /** @var UploadedFile $f */
            $fileName = md5(uniqid()).'.'.$f->guessExtension();
            $filePath = $targetDir.'/'.$fileName;

            $adapter->setMetadata($fileName, ['contentType' => $f->getClientMimeType()]);
            $adapter->write($filePath, file_get_contents($f->getPathname()));

            array_push($items, [
                'name' => $f->getClientOriginalName(),
                'filePath' => $filePath,
            ]);
        }

        return $items;
    }

    private function getUserDir(User $user)
    {
        return $user->getId();
    }

    public function spaceUsed(User $user)
    {
        $size = 0;
        /** @var StorageItem $storageItem */
        foreach ($user->getStorageItems() as $storageItem) {
            if ($storageItem->getFilePath())
                try {
                    $size += $this->filesystem->size($storageItem->getFilePath());
                } catch (\Exception $exception) {
                }
        }

        return $size;
    }

    public function download(StorageItem $item)
    {
        $fileName = $item->getName();
        $filePath = $item->getFilePath();
        $file = $this->filesystem->get($filePath);
        $response = new Response();
        $response->headers->set('Content-Type', $file->getMtime());
        $response->headers->set('Cache-Control', '');
        $response->headers->set('Content-Length', $file->getSize());
        $response->headers->set('Last-Modified', gmdate('D, d M Y H:i:s'));
        $fileNameFallback = preg_replace('/\w+\//', '', $filePath);
        $contentDisposition = $response->headers->makeDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, $fileName, $fileNameFallback);
        $response->headers->set('Content-Disposition', $contentDisposition);
        $response->setContent($file->getContent());

        return $response;
    }

    public function resolveUrl(StorageItem $item)
    {
        $adapter = $this->filesystem->getAdapter();

        return $adapter->getUrl($item->getFilePath());
    }
}
