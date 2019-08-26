<?php

namespace AdminBundle\Entity;

trait CustomizationTrait
{
    /**
     * @var string
     *
     * @ORM\Column(type="string")
     *
     * @Assert\NotBlank()
     */
    private $landingHeader;

    /**
     * @var string
     *
     * @ORM\Column(type="text")
     *
     * @Assert\NotBlank()
     */
    private $landingSubHeader;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=true)
     */
    private $landingImage;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=true)
     */
    private $logo;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     *
     * @Assert\NotBlank()
     */
    private $landingHeaderBottom;

    /**
     * @var string
     *
     * @ORM\Column(type="text")
     *
     * @Assert\NotBlank()
     */
    private $landingSubHeaderBottom;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=true)
     */
    private $landingImageBottom;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     *
     * @Assert\NotBlank()
     * @Assert\Length(
     *     max="20"
     * )
     */
    private $pageTitle;

    /**
     * @var string
     *
     * @ORM\Column(type="string", options={"default": "www.tutrex.com"})
     *
     * @Assert\NotBlank()
     * @Assert\Length(
     *     max="100"
     * )
     */
    protected $privacySite;

    /**
     * @var string
     *
     * @ORM\Column(type="string", options={"default": "2255 Braeswood Park Dr"})
     *
     * @Assert\NotBlank()
     * @Assert\Length(
     *     max="100"
     * )
     */
    protected $privacyAddressFirstLine;

    /**
     * @var string
     *
     * @ORM\Column(type="string", options={"default": "houston, Texas 77030"})
     *
     * @Assert\NotBlank()
     * @Assert\Length(
     *     max="100"
     * )
     */
    protected $privacyAddressSecondLine;

    /**
     * @var string
     *
     * @ORM\Column(type="string", options={"default": "United States"})
     *
     * @Assert\NotBlank()
     * @Assert\Length(
     *     max="100"
     * )
     */
    protected $privacyCountry;

    /**
     * @var string
     *
     * @ORM\Column(type="string", options={"default": "support@tutrex.com"})
     *
     * @Assert\NotBlank()
     * @Assert\Length(
     *     max="100"
     * )
     */
    protected $privacyEmail;

    /**
     * @return string
     */
    public function getLandingHeader()
    {
        return $this->landingHeader;
    }

    /**
     * @param string $landingHeader
     *
     * @return $this
     */
    public function setLandingHeader($landingHeader)
    {
        $this->landingHeader = $landingHeader;

        return $this;
    }

    /**
     * @return string
     */
    public function getLandingSubHeader()
    {
        return $this->landingSubHeader;
    }

    /**
     * @param string $landingSubHeader
     *
     * @return $this
     */
    public function setLandingSubHeader($landingSubHeader)
    {
        $this->landingSubHeader = $landingSubHeader;

        return $this;
    }

    /**
     * @return string
     */
    public function getLandingImage()
    {
        return $this->landingImage;
    }

    /**
     * @param string $landingImage
     *
     * @return $this
     */
    public function setLandingImage($landingImage)
    {
        $this->landingImage = $landingImage;

        return $this;
    }

    /**
     * @return string
     */
    public function getLogo()
    {
        return $this->logo;
    }

    /**
     * @param string $logo
     *
     * @return $this
     */
    public function setLogo($logo)
    {
        $this->logo = $logo;

        return $this;
    }

    /**
     * @return string
     */
    public function getLandingHeaderBottom()
    {
        return $this->landingHeaderBottom;
    }

    /**
     * @param string $landingHeaderBottom
     *
     * @return $this
     */
    public function setLandingHeaderBottom($landingHeaderBottom)
    {
        $this->landingHeaderBottom = $landingHeaderBottom;

        return $this;
    }

    /**
     * @return string
     */
    public function getLandingSubHeaderBottom()
    {
        return $this->landingSubHeaderBottom;
    }

    /**
     * @param string $landingSubHeaderBottom
     *
     * @return $this
     */
    public function setLandingSubHeaderBottom($landingSubHeaderBottom)
    {
        $this->landingSubHeaderBottom = $landingSubHeaderBottom;

        return $this;
    }

    /**
     * @return string
     */
    public function getLandingImageBottom()
    {
        return $this->landingImageBottom;
    }

    /**
     * @param string $landingImageBottom
     *
     * @return $this
     */
    public function setLandingImageBottom($landingImageBottom)
    {
        $this->landingImageBottom = $landingImageBottom;

        return $this;
    }

    /**
     * @return string
     */
    public function getPageTitle()
    {
        return $this->pageTitle;
    }

    /**
     * @param string $pageTitle
     *
     * @return $this
     */
    public function setPageTitle($pageTitle)
    {
        $this->pageTitle = $pageTitle;

        return $this;
    }

    /**
     * @return string
     */
    public function getPrivacySite()
    {
        return $this->privacySite;
    }

    /**
     * @param string $privacySite
     *
     * @return $this
     */
    public function setPrivacySite($privacySite)
    {
        $this->privacySite = $privacySite;

        return $this;
    }

    /**
     * @return string
     */
    public function getPrivacyAddressFirstLine()
    {
        return $this->privacyAddressFirstLine;
    }

    /**
     * @param string $privacyAddressFirstLine
     *
     * @return $this
     */
    public function setPrivacyAddressFirstLine($privacyAddressFirstLine)
    {
        $this->privacyAddressFirstLine = $privacyAddressFirstLine;

        return $this;
    }

    /**
     * @return string
     */
    public function getPrivacyAddressSecondLine()
    {
        return $this->privacyAddressSecondLine;
    }

    /**
     * @param string $privacyAddressSecondLine
     *
     * @return $this
     */
    public function setPrivacyAddressSecondLine($privacyAddressSecondLine)
    {
        $this->privacyAddressSecondLine = $privacyAddressSecondLine;

        return $this;
    }

    /**
     * @return string
     */
    public function getPrivacyCountry()
    {
        return $this->privacyCountry;
    }

    /**
     * @param string $privacyCountry
     *
     * @return $this
     */
    public function setPrivacyCountry($privacyCountry)
    {
        $this->privacyCountry = $privacyCountry;

        return $this;
    }

    /**
     * @return string
     */
    public function getPrivacyEmail()
    {
        return $this->privacyEmail;
    }

    /**
     * @param string $privacyEmail
     *
     * @return $this
     */
    public function setPrivacyEmail($privacyEmail)
    {
        $this->privacyEmail = $privacyEmail;

        return $this;
    }
}