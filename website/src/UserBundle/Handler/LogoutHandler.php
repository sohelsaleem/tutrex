<?php

namespace UserBundle\Handler;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Router;
use Symfony\Component\Security\Http\Logout\LogoutSuccessHandlerInterface;

class LogoutHandler implements LogoutSuccessHandlerInterface
{
    protected $router;
    protected $session;

    public function __construct( Router $router, Session $session)
    {
        $this->router = $router;
        $this->session = $session;
    }

    public function onLogoutSuccess(Request $request)
    {
        $this->session->set('userStateIsChanged', true);

        return new RedirectResponse($this->router->generate('homepage'));
    }
}