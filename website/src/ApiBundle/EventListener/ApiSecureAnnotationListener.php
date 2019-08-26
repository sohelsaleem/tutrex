<?php

namespace ApiBundle\EventListener;

use ApiBundle\Util\AnnotationUtil;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;
use UserBundle\Entity\User;
use UserBundle\Manager\UserManager;

class ApiSecureAnnotationListener
{
    const ANNOTATION = 'ApiBundle\Annotation\ApiSecure';

    protected $annotationUtil;
    protected $userManager;

    public function __construct(AnnotationUtil $annotationUtil, UserManager $userManager)
    {
        $this->annotationUtil = $annotationUtil;
        $this->userManager = $userManager;
    }

    /**
     * @param FilterControllerEvent $event
     */
    public function onKernelController(FilterControllerEvent $event)
    {
        $controller = $event->getController();

        if (!is_array($controller)) {
            return;
        }

        if (!$this->annotationUtil->getControllerAnnotation($controller, self::ANNOTATION)) {
            return;
        }

        $request = $event->getRequest();
        $apiKey = $request->headers->get('X-API-KEY', '');
        $user = $this->findUserByApiKey($apiKey);

        if (!$user) {
            throw new HttpException(401, 'Unauthorized');
        }

        $request->attributes->set('user', $user);
    }

    /**
     * @param string $apiKey
     *
     * @return null|User
     */
    private function findUserByApiKey($apiKey)
    {
        if (!$apiKey) {
            return null;
        }

        $user = $this->userManager->getUserBy(['apiKey' => $apiKey]);
        $reseller = $user->getReseller();

        if ($reseller && !$reseller->isApiEnabled()) {
            return null;
        }

        return $user;
    }
}
