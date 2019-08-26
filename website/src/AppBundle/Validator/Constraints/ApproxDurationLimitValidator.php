<?php

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class ApproxDurationLimitValidator extends ConstraintValidator
{
    protected $tokenStorage;

    public function __construct($tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    public function validate($class, Constraint $constraint)
    {
        $approxDurationMinutesLimit = $this->tokenStorage->getToken()->getUser()->getMinutesLessonDuration();
        $approxDurationHours = $class->getDurationHours();
        $approxDurationMinutes = $class->getDurationMinutes() + $approxDurationHours * 60;

        if ($approxDurationMinutes > $approxDurationMinutesLimit) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ limit }}', $approxDurationMinutesLimit)
                ->addViolation();
        }
    }
}