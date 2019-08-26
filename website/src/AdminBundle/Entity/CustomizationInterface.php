<?php

namespace AdminBundle\Entity;

interface CustomizationInterface
{
    public function getLandingHeader();
    public function setLandingHeader($landingHeader);
    public function getLandingSubHeader();
    public function setLandingSubHeader($landingSubHeader);
    public function getLandingImage();
    public function setLandingImage($landingImage);
    public function getLogo();
    public function setLogo($logo);
    public function getLandingHeaderBottom();
    public function setLandingHeaderBottom($landingHeaderBottom);
    public function getLandingSubHeaderBottom();
    public function setLandingSubHeaderBottom($landingSubHeaderBottom);
    public function getLandingImageBottom();
    public function setLandingImageBottom($landingImageBottom);
    public function getPageTitle();
    public function setPageTitle($pageTitle);
    public function getPrivacySite();
    public function setPrivacySite($privacySite);
    public function getPrivacyAddressFirstLine();
    public function setPrivacyAddressFirstLine($privacyAddressFirstLine);
    public function getPrivacyAddressSecondLine();
    public function setPrivacyAddressSecondLine($privacyAddressSecondLine);
    public function getPrivacyCountry();
    public function setPrivacyCountry($privacyCountry);
    public function getPrivacyEmail();
    public function setPrivacyEmail($privacyEmail);
}