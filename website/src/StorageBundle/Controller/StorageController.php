<?php

namespace StorageBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use StorageBundle\Entity\StorageItem;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * @Route("/storage")
 */
class StorageController extends Controller
{
    /**
     * @Route("/", name="storage_index")
     * @Method("GET")
     * @param Request $request
     *
     * @return Response
     */
    public function indexAction(Request $request)
    {
        return $this->render('StorageBundle:Storage:index.html.twig', [
            'folder' => null,
            'content' => $this->getContent(null),
        ]);
    }

    /**
     * @Route("/", name="storage_create_item", options={"expose"=true})
     * @Method("POST")
     * @param Request $request
     *
     * @return Response
     */
    public function createItemAction(Request $request)
    {
        $files = $request->files->get('file');
        $parentId = $request->get('parentId', null);
        $storageManager = $this->get('storage.manager');
        $storageManager->createItems($files, $parentId);

        return new JsonResponse([
            'status' => 'success',
            'content' => $this->renderView(
                'StorageBundle:Storage:folderContent.html.twig',
                ['content' => $this->getContent($parentId)]
            ),
        ]);
    }

    /**
     * @Route("/folder", name="storage_create_folder", options={"expose"=true})
     * @Method("POST")
     * @param Request $request
     *
     * @return Response
     */
    public function createFolderAction(Request $request)
    {
        $name = $request->get('name');
        $parentId = $request->get('parentId', null);
        $storageManager = $this->get('storage.manager');
        $storageManager->createFolder($name, $parentId);

        return new JsonResponse([
            'status' => 'success',
            'content' => $this->renderView(
                'StorageBundle:Storage:folderContent.html.twig',
                ['content' => $this->getContent($parentId)]
            ),
        ]);
    }

    /**
     * @Route("/{id}", name="storage_rename_item", options={"expose"=true})
     * @Method("PUT")
     * @param Request $request
     * @param Integer $id
     *
     * @return Response
     */
    public function renameItemAction(Request $request, $id)
    {
        $name = $request->get('name');
        $storageManager = $this->get('storage.manager');
        $item = $storageManager->rename($id, $name);

        return new JsonResponse([
            'status' => 'success',
            'itemUrl' => $this->generateUrl('storage_folder', ['slug' => $item->getSlug()]),
            'isFolder' => !$item->isFile(),
        ]);
    }

    /**
     * @Route("/{id}", name="storage_delete_item", options={"expose"=true})
     * @Method("DELETE")
     * @param Integer $id
     *
     * @return Response
     */
    public function deleteItemAction($id)
    {
        $storageManager = $this->get('storage.manager');
        $storageManager->delete($id);

        return new JsonResponse([
            'status' => 'success',
            'storage' => $storageManager->getStorageParameters(),
        ]);
    }

    /**
     * @Route("/{slug}", name="storage_folder")
     * @Method("GET")
     * @ParamConverter("folder", class="StorageBundle:StorageItem", converter="slug_folder_converter")
     * @param Request     $request
     * @param StorageItem $folder
     *
     * @return Response
     */
    public function showFolderAction(Request $request, StorageItem $folder)
    {
        return $this->render('StorageBundle:Storage:index.html.twig', [
            'folder' => $folder,
            'content' => $this->getContent($folder->getId()),
        ]);
    }

    private function getContent($parentId)
    {
        $storageManager = $this->get('storage.manager');

        return [
            'content' => $storageManager->findContent($parentId),
            'storage' => $storageManager->getStorageParameters(),
        ];
    }

    /**
     * @Route("/download/{id}", name="storage_download")
     * @Method("GET")
     * @param Integer $id
     *
     * @return Response
     */
    public function downloadAction($id)
    {
        $storageManager = $this->get('storage.manager');
        $response = $storageManager->download($id);

        return $response;
    }
}
