<?php

namespace AppBundle\EventListener;

use AppBundle\Util\HostnameUtil;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use UserBundle\Entity\Admin;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\Teacher;
use UserBundle\Entity\User;

class HostListener
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function onKernelRequest(GetResponseEvent $event)
    {
        $container = $this->container;
        $resellerManager = $container->get('reseller.manager');
        $tokenStorage = $container->get('security.token_storage');
        $twig = $container->get('twig');
        $configManager = $container->get('config.manager');
        $router = $container->get('router');
        $userManager = $container->get('user.manager');
        $defaultHost = $container->getParameter('default_host');

        $request = $event->getRequest();
        $currentRoute = $request->get('_route');
        $isTemporaryProblemsRoute = $currentRoute === 'temporary_problems';
        $temporaryProblemsResponse = new RedirectResponse($router->generate('temporary_problems'));
        $reseller = $resellerManager->getResellerFromRequest($request);
        if ($reseller && $reseller->getBanned() && !$isTemporaryProblemsRoute)
            return $event->setResponse($temporaryProblemsResponse);
        $hostname = $request->getHost();
        $subdomain = HostnameUtil::getSubdomain($hostname, $defaultHost);
        $isNonResellerSubdomain = $subdomain && (!$reseller || $reseller->getExternalDomain());
        if ($isNonResellerSubdomain) {
            $subdomainUser = $userManager->getUserBy([
                'subdomain' => $subdomain,
                'reseller' => $reseller,
            ]);
            if (!$subdomainUser)
                throw new NotFoundHttpException('Subdomain was not found');
            if ($subdomainUser->getBanned() && !$isTemporaryProblemsRoute)
                return $event->setResponse($temporaryProblemsResponse);
            if (!($subdomainUser instanceof Reseller))
                $request->attributes->set('subdomainUser', $subdomainUser);
        }
        $config = $configManager->getConfig();
        $logo = $config->getLogo();
        $pageTitle = $config->getPageTitle();
        $landingHeader = $config->getLandingHeader();
        $landingSubHeader = $config->getLandingSubHeader();
        $landingImage = $config->getLandingImage();
        $landingHeaderBottom = $config->getLandingHeaderBottom();
        $landingSubHeaderBottom = $config->getLandingSubHeaderBottom();
        $landingImageBottom = $config->getLandingImageBottom();
        $privacySite = $config->getPrivacySite();
        $privacyAddressFirstLine = $config->getPrivacyAddressFirstLine();
        $privacyAddressSecondLine = $config->getPrivacyAddressSecondLine();
        $privacyCountry = $config->getPrivacyCountry();
        $privacyEmail = $config->getPrivacyEmail();
        if ($reseller) {
            $request->attributes->set('reseller', $reseller);
            $logo = $reseller->getLogo();
            $pageTitle = $reseller->getPageTitle();
            $landingHeader = $reseller->getLandingHeader();
            $landingSubHeader = $reseller->getLandingSubHeader();
            $landingImage = $reseller->getLandingImage();
            $landingHeaderBottom = $reseller->getLandingHeaderBottom();
            $landingSubHeaderBottom = $reseller->getLandingSubHeaderBottom();
            $landingImageBottom = $reseller->getLandingImageBottom();
            $privacySite = $reseller->getPrivacySite();
            $privacyAddressFirstLine = $reseller->getPrivacyAddressFirstLine();
            $privacyAddressSecondLine = $reseller->getPrivacyAddressSecondLine();
            $privacyCountry = $reseller->getPrivacyCountry();
            $privacyEmail = $reseller->getPrivacyEmail();
        }
        $twig->addGlobal('jivochatCode', $this->getJivochatCode($reseller));
        $twig->addGlobal('logo', $logo);
        $twig->addGlobal('pageTitle', $pageTitle);
        $twig->addGlobal('landingHeader', $landingHeader);
        $twig->addGlobal('landingSubHeader', $landingSubHeader);
        $twig->addGlobal('landingImage', $landingImage);
        $twig->addGlobal('landingHeaderBottom', $landingHeaderBottom);
        $twig->addGlobal('landingSubHeaderBottom', $landingSubHeaderBottom);
        $twig->addGlobal('landingImageBottom', $landingImageBottom);
        $twig->addGlobal('privacySite', $privacySite);
        $twig->addGlobal('privacyAddressFirstLine', $privacyAddressFirstLine);
        $twig->addGlobal('privacyAddressSecondLine', $privacyAddressSecondLine);
        $twig->addGlobal('privacyCountry', $privacyCountry);
        $twig->addGlobal('privacyEmail', $privacyEmail);

        if (!$request->isXmlHttpRequest()) {
            $token = $tokenStorage->getToken();
            if ($token) {
                $user = $token->getUser();
                $logoutResponse = new RedirectResponse($router->generate('fos_user_security_logout'));
                if ($user instanceof User && !$user->hasRole('ROLE_ADMIN')) {
                    $userReseller = $user instanceof Reseller ? $user : $user->getReseller();
                    if ($userReseller !== $reseller)
                        return $event->setResponse($logoutResponse);
                    if (($isNonResellerSubdomain || !$subdomain) && !$user->hasRole('ROLE_RESELLER'))
                        if (($user instanceof Teacher || $subdomain) && $user->getSubdomain() !== $subdomain)
                            return $event->setResponse($logoutResponse);
                }
            }
        }
    }

    /**
     * @param Reseller|null $reseller
     *
     * @return string
     */
    private function getJivochatCode($reseller = null)
    {
        $defaultJivochatCode = $this->container->getParameter('jivochat_code');

        if (!$reseller)
            return $defaultJivochatCode;

        if (!$reseller->isJivochatEnabled())
            return null;

        return $reseller->getJivochatCode() ?: $defaultJivochatCode;
    }
}
