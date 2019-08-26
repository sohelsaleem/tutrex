<?php

namespace StorageBundle\Utils;

use Doctrine\ORM\EntityManager;
use StorageBundle\Entity\StorageItem;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use UserBundle\Entity\User;

class StorageManager
{
    private $entityManager;
    private $repository;
    private $fileManager;

    public static $KEY_DELIMITER = '.';

    /**
     * StorageManager constructor.
     *
     * @param EntityManager      $entityManager
     * @param ContainerInterface $container
     * @param FileManager        $fileManager
     */
    public function __construct(EntityManager $entityManager, ContainerInterface $container, FileManager $fileManager)
    {
        $this->entityManager = $entityManager;
        $this->repository = $entityManager->getRepository('StorageBundle:StorageItem');
        $this->container = $container;
        $this->fileManager = $fileManager;
    }

    private function getCurrentUser()
    {
        $tokenStorage = $this->container->get('security.token_storage');
        $user = $tokenStorage->getToken()->getUser();

        return $user;
    }

    public function findFolderBySlug($slug)
    {
        return $this->findFolderBySlugAndUser($slug, $this->getCurrentUser());
    }

    public function findFolderBySlugAndUser($slug, User $user)
    {
        return $this->repository->findOneBy(array('slug' => $slug, 'user' => $user));
    }

    public function findFolderById($id)
    {
        return $this->findFolderByIdAndUser($id, $this->getCurrentUser());
    }

    public function findFolderByIdAndUser($id, User $user)
    {
        return $this->repository->findOneBy(array(
            'id' => $id,
            'type' => StorageItem::TYPE_FOLDER,
            'user' => $user));
    }

    public function findFileById($id)
    {
        return $this->findFileByIdAndUser($id, $this->getCurrentUser());
    }

    public function findFileByIdAndUser($id, User $user)
    {
        return $this->repository->findOneBy(array(
            'id' => $id,
            'type' => StorageItem::TYPE_FILE,
            'user' => $user));
    }

    public function findContent($parentId)
    {
        return $this->findContentForUser($parentId, $this->getCurrentUser());
    }

    public function findContentForUser($parentId, User $user)
    {
        return $this->repository->findBy(
            array(
                'user' => $user,
                'folder' => $this->findFolderByIdAndUser($parentId, $user)
            ),
            array(
                'type' => 'ASC',
                'updatedAt' => 'DESC')
        );
    }

    /**
     * @param $criteria
     *
     * @return StorageItem[]
     */
    public function findBy($criteria)
    {
        return $this->repository->findBy($criteria);
    }

    public function createFolder($name, $parentId)
    {
        $storageItem = new StorageItem();
        $storageItem->setName($name);
        $storageItem->setUser($this->getCurrentUser());
        $storageItem->setType(StorageItem::TYPE_FOLDER);
        $this->addItemKey($storageItem, $parentId);
        $this->entityManager->persist($storageItem);
        $this->entityManager->flush();
        $this->repository->updateUpdatedTimestamp($storageItem->getItemKey());

        return $this->ensureSlugExist($storageItem);
    }

    private function addItemKey(StorageItem &$storageItem, $parentId)
    {
        if ($parentId !== null) {
            $parent = $this->findFolderById($parentId);
            if ($parent === null)
                return;
            $parentKey = $parent->getItemKey();
            $itemKey = $parentKey !== null
                ? $parentKey.$parent->getId().StorageManager::$KEY_DELIMITER
                : $parent->getId().StorageManager::$KEY_DELIMITER;
            $storageItem->setFolder($parent);
            $storageItem->setItemKey($itemKey);
        }
    }

    public function rename($id, $name)
    {
        $item = $this->repository->findOneBy(array('id' => $id));
        $item->setName($name);
        $this->entityManager->persist($item);
        $this->entityManager->flush();

        return $this->ensureSlugExist($item);
    }

    private function ensureSlugExist(StorageItem $item)
    {
        if (strlen($item->getSlug()) > 0)
            return $item;

        $item->setSlug($item->getId());
        $this->entityManager->persist($item);
        $this->entityManager->flush();

        return $item;
    }

    public function delete($id)
    {
        $item = $this->repository->findOneBy(array('id' => $id));
        if ($item->isFile()) {
            $this->fileManager->delete($item);
            $this->entityManager->remove($item);
        } else {
            $items = $this->repository->findItemsByKey($item->getFullItemKey());
            array_push($items, $item);
            foreach ($items as $i) {
                if ($i->isFile()) {
                    $this->fileManager->delete($i);
                }
                $this->entityManager->remove($i);
            }
        }
        $this->syncStorageSpaceUsed($this->getCurrentUser());
    }

    public function createItems($files, $parentId)
    {
        /** @var User $user */
        $user = $this->getCurrentUser();
        if (!$this->fileManager->isCanUpload($user, $files))
            throw new BadRequestHttpException('You reached storage limit');

        $filesData = $this->fileManager->upload($user, $files);
        $key = null;

        foreach ($filesData as $i) {
            $storageItem = new StorageItem();
            $storageItem->setName($i['name']);
            $storageItem->setUser($user);
            $storageItem->setFilePath($i['filePath']);
            $storageItem->setType(StorageItem::TYPE_FILE);
            $this->addItemKey($storageItem, $parentId);
            $this->entityManager->persist($storageItem);
            $key = $storageItem->getItemKey();
            $user->addStorageItems($storageItem);
        }

        $this->syncStorageSpaceUsed($user);
        if ($key !== null) {
            $this->repository->updateUpdatedTimestamp($key);
        }
    }

    public function syncStorageSpaceUsed(User $user)
    {
        $newSize = $this->fileManager->spaceUsed($user);
        $user->setStorageSpaceUsed($newSize);

        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }

    public function getStorageParameters()
    {
        /** @var User $user */
        $user = $this->getCurrentUser();

        return $this->getStorageParametersForUser($user);
    }

    public function getStorageParametersForUser(User $user)
    {
        return array(
            'used' => $this->humanFilesize($user->getStorageSpaceUsed()),
            'total' => $this->humanFilesize($user->getStorageLimit()),
            'usedRaw' => $user->getStorageSpaceUsed(),
            'totalRaw' => $user->getStorageLimit()
        );
    }

    private function humanFilesize($bytes, $decimals = 1)
    {
        $size = array('B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
        $factor = floor((strlen($bytes) - 1) / 3);

        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)).@$size[$factor];
    }

    public function download($id)
    {
        $item = $this->findFileById($id);
        if ($item == null)
            throw new NotFoundHttpException();
        $response = $this->fileManager->download($item);

        return $response;
    }

    public function getRawUrl(StorageItem $item)
    {
        return $this->fileManager->resolveUrl($item);
    }

    public function updateItemKeys()
    {
        $storageItems = $this->findBy([
            'folder' => null,
            'type' => StorageItem::TYPE_FOLDER
        ]);
        foreach ($storageItems as $storageItem)
            $this->updateItemKey($storageItem);
        $this->entityManager->flush();
    }

    /**
     * @param StorageItem $storageItem
     */
    public function updateItemKey(StorageItem $storageItem)
    {
        $folder = $storageItem->getFolder();
        if ($folder) {
            $itemKey = $folder->getItemKey().$folder->getId().'.';
            $storageItem->setItemKey($itemKey);
        }
        /** @var StorageItem $file */
        foreach ($storageItem->getFiles() as $file)
            if (!$file->getItemKey())
                $this->updateItemKey($file);
    }
}
