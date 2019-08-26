<?php

namespace StorageBundle\Repository;

use Doctrine\DBAL\Types\Type;
use Doctrine\ORM\EntityRepository;
use StorageBundle\Entity\StorageItem;
use StorageBundle\Utils\StorageManager;


class StorageItemRepository extends EntityRepository
{
    public function findItemsByKey($itemKey)
    {
        return $this->createQueryBuilder('i')
            ->where('i.itemKey LIKE :itemKey')
            ->setParameter('itemKey', $itemKey . StorageManager::$KEY_DELIMITER . '%')
            ->getQuery()
            ->getResult();
    }

    public function updateUpdatedTimestamp($parentItemKey)
    {
        if (!$parentItemKey)
            return null;
        $keys = explode(StorageManager::$KEY_DELIMITER, $parentItemKey);
        $query = $this->createQueryBuilder('i')
            ->update('StorageBundle:StorageItem', 'i')
            ->set('i.updatedAt', ':updatedAt')
            ->setParameter('updatedAt', new \DateTime('now'), Type::DATETIME)
            ->where('i.id=:id')
            ->orWhere('i.itemKey LIKE :itemKey')
            ->andWhere('i.type=:type')
            ->setParameter('id', $keys[0])
            ->setParameter('type', StorageItem::TYPE_FOLDER)
            ->setParameter('itemKey', $keys[0] . '%')
            ->getQuery();

        return $query->getResult();
    }
}
