<?php

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\ConstraintValidator;

class IsNotEmptyDurationValidator extends ConstraintValidator
{
    protected $validator;

    public function __construct($validator)
    {
        $this->validator = $validator;
    }

    public function validate($class, Constraint $constraint)
    {
        if (
            count($this->validator->validateValue($class->getDurationHours(), new NotBlank())) &&
            count($this->validator->validateValue($class->getDurationMinutes(), new NotBlank()))
        ) {
            $this->context->buildViolation($constraint->message)
                ->addViolation();
        }
    }
}