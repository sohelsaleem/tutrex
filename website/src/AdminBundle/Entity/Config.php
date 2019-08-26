<?php

namespace AdminBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity()
 * @ORM\Table(name="config")
 */
class Config implements CustomizationInterface
{
    use CustomizationTrait;

    /**
     * @var int
     *
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var array
     *
     * @ORM\Column(type="array")
     */
    private $domains;

    /**
     * @var bool
     *
     * @ORM\Column(type="boolean")
     */
    private $certificateFailed;

    public function __construct()
    {
        $this->certificateFailed = false;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return array
     */
    public function getDomains()
    {
        return $this->domains;
    }

    /**
     * @param array $domains
     *
     * @return Config
     */
    public function setDomains(array $domains)
    {
        $this->domains = $domains;

        return $this;
    }

    /**
     * @return bool
     */
    public function isCertificateFailed()
    {
        return $this->certificateFailed;
    }

    /**
     * @param bool $certificateFailed
     *
     * @return Config
     */
    public function setCertificateFailed($certificateFailed)
    {
        $this->certificateFailed = $certificateFailed;

        return $this;
    }
}
