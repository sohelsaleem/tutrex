<?php

namespace UserBundle\Provider;

use AppBundle\Util\HostnameUtil;
use FOS\UserBundle\Security\EmailUserProvider as FOSProvider;
use PlanBundle\Manager\PlanManager;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use UserBundle\Entity\Admin;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\Teacher;
use UserBundle\Entity\User;
use UserBundle\Exception\BannedUserException;
use UserBundle\Manager\ResellerManager;
use UserBundle\Manager\UserManager;

class UserProvider extends FOSProvider
{
    protected $planManager;
    protected $requestStack;
    protected $resellerManager;
    protected $customUserManager;
    protected $defaultHost;

    public function __construct(
        UserManagerInterface $userManager,
        PlanManager $planManager,
        RequestStack $requestStack,
        ResellerManager $resellerManager,
        UserManager $customUserManager,
        $defaultHost
    ) {
        parent::__construct($userManager);

        $this->planManager = $planManager;
        $this->requestStack = $requestStack;
        $this->resellerManager = $resellerManager;
        $this->customUserManager = $customUserManager;
        $this->defaultHost = $defaultHost;
    }

    /**
     * {@inheritdoc}
     */
    public function loadUserByUsername($username)
    {
        $request = $this->requestStack->getCurrentRequest();
        /** @var Reseller|null $reseller */
        $reseller = $this->resellerManager->getResellerFromRequest($request);
        $user = $this->customUserManager->findAdminByEmail($username);
        if (!$user) {
            if ($reseller && $username === $reseller->getEmail())
                $user = $reseller;
            if (!$user) {
                /** @var User $user */
                $user = $this->userManager->findUserBy([
                    'email' => $username,
                    'reseller' => $reseller,
                ]);
            }
        }
        if ($user) {
            $resellerId = $reseller ? $reseller->getId() : null;
            $userResellerId = $user->getReseller() ? $user->getReseller()->getId() : null;
            if ($user instanceof Admin || $user->getId() === $resellerId || !$user instanceof Reseller && $resellerId === $userResellerId) {
                if ($user && !$user->isEnabled()) {
                    throw new BannedUserException('Account is not activated');
                } elseif ($user && $user->hasRole('ROLE_SUB_TEACHER') && $user->getBlocked()) {
                    throw new BannedUserException('Account is blocked');
                }
                $subdomain = HostnameUtil::getSubdomain($request->getHost(), $this->defaultHost);
                if ((!$reseller || $reseller->getExternalDomain()) && ($user->hasRole('ROLE_TEACHER') && $subdomain || $user instanceof Teacher) && $subdomain !== $user->getSubdomain())
                    throw new UsernameNotFoundException('This email does not exist');

                return $user;
            }
        }

        throw new UsernameNotFoundException('This email does not exist');
    }
}
