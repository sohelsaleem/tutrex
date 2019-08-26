<?php

namespace UserBundle\Handler;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Router;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\SecurityContextInterface;
use Symfony\Component\Translation\TranslatorInterface;

class LoginHandler implements AuthenticationSuccessHandlerInterface, AuthenticationFailureHandlerInterface
{
    private $router;

    public function __construct(Router $router)
    {
        $this->router = $router;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token)
    {
        $response = new Response($this->router->generate('fos_user_security_login'));

        if ($token->getUser()->getBanned()) {
            return new JsonResponse([
                    'message' => 'Account is disabled',
                    'success' => false,
                    'form' => new RedirectResponse($this->router->generate('login_ajax'))
                ]
            );
        } else {
            return new JsonResponse([
                    'route' => $response->getContent(),
                    'success' => true
                ]
            );
        }
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $exception = $exception->getPrevious();

        $request->getSession()->set(SecurityContextInterface::AUTHENTICATION_ERROR, $exception);

        return new JsonResponse([
                'message' => $exception->getMessage(),
                'success' => false,
                'form' => new RedirectResponse($this->router->generate('login_ajax'))
            ]
        );
    }
}