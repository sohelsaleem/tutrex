<?php

namespace StorageBundle\Utils;

use Doctrine\Common\Persistence\ManagerRegistry;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use StorageBundle\Entity\StorageItem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class FolderParamConverter implements ParamConverterInterface
{
    /**
     * @var ManagerRegistry $registry Manager registry
     */
    private $registry;

    private $storageManager;

    /**
     * RoomParamConverter constructor.
     * @param ManagerRegistry|null $registry
     * @param StorageManager $storageManager
     */
    public function __construct(ManagerRegistry $registry = null, StorageManager $storageManager)
    {
        $this->registry = $registry;
        $this->storageManager = $storageManager;
    }


    public function apply(Request $request, ParamConverter $configuration)
    {
        $slug = $request->attributes->get('slug');
        $folder = $this->storageManager->findFolderBySlug($slug);

        if (!$folder)
            throw new NotFoundHttpException();

        $request->attributes->set($configuration->getName(), $folder);
    }

    public function supports(ParamConverter $configuration)
    {
        // If there is no manager, this means that only Doctrine DBAL is configured
        // In this case we can do nothing and just return
        if (null === $this->registry || !count($this->registry->getManagers())) {
            return false;
        }

        // Check, if option class was set in configuration
        if (null === $configuration->getClass()) {
            return false;
        }

        // Get actual entity manager for class
        $em = $this->registry->getManagerForClass($configuration->getClass());

        // Check, if class name is what we need
        if (StorageItem::class !== $em->getClassMetadata($configuration->getClass())->getName()) {
            return false;
        }

        return true;
    }
}
