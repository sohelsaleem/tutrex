<?php

namespace UserBundle\Controller;

use FOS\UserBundle\Controller\SecurityController as BaseController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use UserBundle\Entity\Reseller;

class SecurityController extends BaseController
{
    public function loginAction(Request $request)
    {
        $session = $request->getSession();
        $router = $this->get('router');

        if ($this->isGranted('ROLE_ADMIN') || $this->isGranted('ROLE_RESELLER')) {
            $session->set('userStateIsChanged', true);

            $redirectRoute = $router->generate('admin_show_teachers');

            if ($request->isXmlHttpRequest()) {
                return new JsonResponse([
                    'message' => 'logged',
                    'route' => $redirectRoute
                ]);
            }

            return new RedirectResponse($redirectRoute, 307);
        } else if ($this->isGranted('ROLE_CONSULTANT')) {
            $session->set('userStateIsChanged', true);

            $redirectRoute = $router->generate('lesson_consultant_lesson_start');

            if ($request->isXmlHttpRequest()) {
                return new JsonResponse([
                    'route' => $redirectRoute,
                    'message' => 'logged',
                ]);
            }

            return new RedirectResponse($redirectRoute, 307);
        } else if ($this->isGranted('ROLE_USER')) {
            $session->set('userStateIsChanged', true);

            $redirectRoute = $router->generate('app_lesson_show_lessons');

            if ($request->isXmlHttpRequest()) {
                return new JsonResponse([
                    'route' => $redirectRoute,
                    'message' => 'logged',
                ]);
            }

            return new RedirectResponse($redirectRoute, 307);
        }

        $authErrorKey = Security::AUTHENTICATION_ERROR;
        $lastUsernameKey = Security::LAST_USERNAME;

        if ($request->attributes->has($authErrorKey)) {
            $error = $request->attributes->get($authErrorKey);
        } elseif (null !== $session && $session->has($authErrorKey)) {
            $error = $session->get($authErrorKey);
            $session->remove($authErrorKey);
        } else {
            $error = null;
        }

        if (!$error instanceof AuthenticationException) {
            $error = null;
        }

        $lastUsername = (null === $session) ? '' : $session->get($lastUsernameKey);

        $csrfToken = $this->has('security.csrf.token_manager')
            ? $this->get('security.csrf.token_manager')->getToken('authenticate')->getValue()
            : null;

        return new JsonResponse([
                'form' => $this->renderView(
                    'UserBundle:Security:login.html.twig', [
                        'last_username' => $lastUsername,
                        'error' => $error,
                        'csrf_token' => $csrfToken,
                    ]
                )
            ]
        );
    }
}