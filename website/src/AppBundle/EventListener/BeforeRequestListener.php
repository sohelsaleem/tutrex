<?php
namespace AppBundle\EventListener;

use PlanBundle\Manager\PlanManager;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\Routing\Router;
use UserBundle\Entity\Teacher;
use UserBundle\Entity\User;

class BeforeRequestListener
{
    private $security;
    private $router;
    private $planManager;

    public function __construct($security, Router $router, PlanManager $planManager)
    {
        $this->security = $security;
        $this->router = $router;
        $this->planManager = $planManager;
    }

    public function onKernelController(FilterControllerEvent $event)
    {
        $token = $this->security->getToken();

        if ($token) {
            $user = $token->getUser();

            if ($user instanceof User) {
                if (($user instanceof  User && $user->getBanned()) or
                    ($user instanceof  Teacher  && $user->getBlocked())
                ) {
                    $redirectUrl = $this->router->generate('fos_user_security_logout');

                    if ($event->getRequest()->isXmlHttpRequest()) {
                        $event->setController(function() use ($redirectUrl) {
                            return new JsonResponse([
                                'message' => 'banned',
                                'route' => $redirectUrl
                            ]);
                        });
                    } else {
                        $event->setController(function() use ($redirectUrl) {
                            return new RedirectResponse($redirectUrl);
                        });
                    }
                }
            }
        }
    }
}