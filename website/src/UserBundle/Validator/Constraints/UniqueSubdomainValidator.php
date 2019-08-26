<?php

namespace UserBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\User;
use UserBundle\Manager\ResellerManager;
use UserBundle\Manager\UserManager;

class UniqueSubdomainValidator extends ConstraintValidator
{
    private $userManager;

    public function __construct(UserManager $userManager)
    {
        $this->userManager = $userManager;
    }

    /**
     * @param User       $user
     * @param Constraint $constraint
     */
    public function validate($user, Constraint $constraint)
    {
        if ($user->getSubdomain()) {
            $existingUser = $this->userManager->getUserBy([
                'subdomain' => $user->getSubdomain(),
                'reseller' => $user->getReseller(),
            ]);

            if ($existingUser && $existingUser !== $user) {
                $this->context->buildViolation($constraint->message)
                              ->atPath('subdomain')
                              ->addViolation();
            }
        }
    }
}