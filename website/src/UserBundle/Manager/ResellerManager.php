<?php

namespace UserBundle\Manager;

use AppBundle\Util\HostnameUtil;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use UserBundle\Entity\Reseller;

class ResellerManager
{
    private $container;
    private $em;
    private $repository;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->em = $container->get('doctrine.orm.entity_manager');
        $this->repository = $this->em->getRepository('UserBundle:Reseller');
    }

    /**
     * @return Reseller[]
     */
    public function findAll()
    {
        $resellers = $this->repository->findAll();

        return $this->checkResellersCertificates($resellers);
    }

    /**
     * @param Request $request
     *
     * @return null|Reseller
     */
    public function getResellerFromRequest(Request $request)
    {
        $defaultHost = $this->container->getParameter('default_host');

        $reseller = null;
        $hostname = $request->getHost();
        $domain = HostnameUtil::getDomain($hostname, $defaultHost);
        if ($domain !== $defaultHost) {
            $reseller = $this->findByExternalDomain($domain);
            if (!$reseller)
                throw new NotFoundHttpException('External domain was not found');
        }
        $subdomain = HostnameUtil::getSubdomain($hostname, $defaultHost);
        if (!$reseller && $subdomain) {
            $reseller = $this->findBySubdomain($subdomain);
            if ($reseller && $reseller->getExternalDomain())
                throw new NotFoundHttpException('This reseller has external subdomain');
        }

        return $reseller;
    }

    /**
     * @param string $subdomain
     *
     * @return Reseller
     */
    public function findBySubdomain($subdomain)
    {
        return $this->repository->findOneBy(['subdomain' => $subdomain]);
    }

    /**
     * @param Reseller $reseller
     */
    public function addReseller(Reseller $reseller)
    {
        $mailer = $this->container->get('fos_user.mailer');
        $tokenGenerator = $this->container->get('fos_user.util.token_generator');
        $password = substr(md5(uniqid(rand(), 1)), 0, 10);
        $reseller->setPlainPassword($password);
        $reseller->setConfirmationToken($tokenGenerator->generateToken());
        $mailer->sendResettingEmailMessage($reseller);
        $reseller->setPasswordRequestedAt(new \DateTime());
        $reseller->setPageTitle('Tutrex');
        $reseller->setLandingHeader('Online Training Platform');
        $reseller->setLandingSubHeader('Easy to use cloud based Virtual Classroom with collaborative whiteboard and a comprehensive webinar and conferencing solution. It has everything you need for seamless online training.');
        $reseller->setLandingHeaderBottom('Virtual Classroom');
        $reseller->setLandingSubHeaderBottom('Create live lessons with social media integration to invite larger audience. Use feature packed virtual classroom to effectively deliver lessons and keep your audience engaged.');
        $reseller->setPrivacySite('www.tutrex.com');
        $reseller->setPrivacyAddressFirstLine('2255 Braeswood Park Dr');
        $reseller->setPrivacyAddressSecondLine('houston, Texas 77030');
        $reseller->setPrivacyCountry('United States');
        $reseller->setPrivacyEmail('support@tutrex.com');
        if (!$reseller->getExternalDomain())
            $reseller->setAllowSubdomains(false);

        $this->em->persist($reseller);
        $this->em->flush();
    }

    /**
     * @param string $email
     *
     * @return Reseller
     */
    public function findByEmail($email)
    {
        return $this->repository->findOneBy(['email' => $email]);
    }

    /**
     * @param Reseller $reseller
     */
    public function deleteReseller(Reseller $reseller)
    {
        $this->em->remove($reseller);
        $this->em->flush();
    }

    /**
     * @param Reseller $reseller
     */
    public function toggleBan(Reseller $reseller)
    {
        $reseller->setBanned(!$reseller->getBanned());
        $this->em->flush();
    }

    /**
     * @param string $externalDomain
     *
     * @return null|Reseller
     */
    public function findByExternalDomain($externalDomain)
    {
        return $this->repository->findOneBy(['externalDomain' => $externalDomain]);
    }

    /**
     * @param string   $url
     * @param Reseller $reseller
     *
     * @return string
     */
    public function updateUrlByReseller($url, Reseller $reseller)
    {
        $defaultHost = $this->container->getParameter('default_host');

        if ($externalDomain = $reseller->getExternalDomain())
            return HostnameUtil::replaceDomain($url, $externalDomain, $defaultHost);

        return HostnameUtil::addSubdomain($url, $reseller->getSubdomain());
    }

    /**
     * @param Reseller[] $resellers
     *
     * @return Reseller[]
     */
    public function checkResellersCertificates($resellers)
    {
        $existingCertificates = $this->container->get('config.manager')->getConfig()->getDomains();

        return $resellers;

//        return array_map(function (Reseller $reseller) use ($existingCertificates) {
//            $reseller->setHasCertificate(!$reseller->getExternalDomain() || in_array($reseller->getExternalDomain(), $existingCertificates));
//
//            return $reseller;
//        }, $resellers);
    }
}
