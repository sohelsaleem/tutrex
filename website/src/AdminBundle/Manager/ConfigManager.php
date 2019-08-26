<?php

namespace AdminBundle\Manager;

use AdminBundle\Entity\Config;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ConfigManager
{
    private $container;
    private $em;
    private $repository;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->em = $container->get('doctrine.orm.entity_manager');
        $this->repository = $this->em->getRepository('AdminBundle:Config');
    }

    /**
     * @return Config
     */
    public function createDefaultConfig()
    {
        $config = new Config();
        $config->setPageTitle('Tutrex');
        $config->setLandingHeader('Online Training Platform');
        $config->setLandingSubHeader('Easy to use cloud based Virtual Classroom with collaborative whiteboard and a comprehensive webinar and conferencing solution. It has everything you need for seamless online training.');
        $config->setLandingHeaderBottom('Virtual Classroom');
        $config->setLandingSubHeaderBottom('Create live lessons with social media integration to invite larger audience. Use feature packed virtual classroom to effectively deliver lessons and keep your audience engaged.');
        $config->setDomainsWithCert([]);
        $config->setPrivacySite('www.tutrex.com');
        $config->setPrivacyAddressFirstLine('2255 Braeswood Park Dr');
        $config->setPrivacyAddressSecondLine('houston, Texas 77030');
        $config->setPrivacyCountry('United States');
        $config->setPrivacyEmail('support@tutrex.com');
        $this->em->persist($config);
        $this->em->flush();

        return $config;
    }

    /**
     * @return Config
     */
    public function getConfig()
    {
        $configs = $this->repository->findAll();
        if (!count($configs)) {
            return $this->createDefaultConfig();
        }

        return $configs[0];
    }
}