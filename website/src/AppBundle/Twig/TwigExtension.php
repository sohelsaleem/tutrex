<?php

namespace AppBundle\Twig;

class TwigExtension extends \Twig_Extension
{
    public function getFunctions()
    {
        return [
          new \Twig_SimpleFunction('getRegistrationPeriod', [$this, 'getRegistrationPeriodFunction'])
        ];
    }

    public function getRegistrationPeriodFunction($registrationDate)
    {
        $dateDiff = $registrationDate->diff(new \DateTime());

        if ($dateDiff->format('%d') == 0) {
            $registeredDays = '';
        } else if ($dateDiff->format('%d') == 1) {
            $registeredDays = $dateDiff->format('%d day');
        } else {
            $registeredDays = $dateDiff->format('%d days');
        }

        if ($dateDiff->format('%m') == 0) {
            $registeredMonth = '';
        } else if ($dateDiff->format('%m') == 1) {
            $registeredMonth = $dateDiff->format('%m month');
        } else {
            $registeredMonth = $dateDiff->format('%m months');
        }

        if ($dateDiff->format('%y') == 0) {
            $registeredYears = '';
        } else if ($dateDiff->format('%y') == 1) {
            $registeredYears = $dateDiff->format('%y year');
        } else {
            $registeredYears = $dateDiff->format('%y years');
        }

        $registrationPeriod = $registeredYears . ' ' . $registeredMonth . ' ' . $registeredDays;

        if(empty(trim($registrationPeriod))) {
            return false;
        } else {
            return $registrationPeriod;
        }
    }

    public function getName()
    {
        return 'twig_extension';
    }
}