<?php

namespace UserBundle\Utils;

use Symfony\Component\Form\FormError;

class PhoneNumberValidator
{
    public function validatePhoneNumberLength($phoneNumberField)
    {
        $phoneNumberObject = $phoneNumberField->getData();

        $countryCodeLength = mb_strlen($phoneNumberObject->getCountryCode());
        $nationalNumberLength = mb_strlen($phoneNumberObject->getNationalNumber());
        $phoneNumberLength = $countryCodeLength + $nationalNumberLength;

        if ($phoneNumberLength < 5 || $phoneNumberLength > 15) {
            $phoneNumberField->addError(new FormError('This value is not a valid phone number'));

            return false;
        } else {
            return true;
        }
    }
}