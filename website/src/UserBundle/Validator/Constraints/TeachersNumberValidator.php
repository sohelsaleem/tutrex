<?php

namespace UserBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\User;
use UserBundle\Manager\ResellerManager;

class TeachersNumberValidator extends ConstraintValidator
{
    /**
     * @param User       $user
     * @param Constraint $constraint
     */
    public function validate($user, Constraint $constraint)
    {
        $reseller = $user->getReseller();

        if ($reseller) {
            if ($reseller->countTeachers() >= $reseller->getMaximumUsers())
                $this->context->buildViolation($constraint->message)
                              ->addViolation();
        }
    }
}