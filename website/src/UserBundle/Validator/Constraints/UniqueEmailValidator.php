<?php

namespace UserBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use UserBundle\Entity\User;
use UserBundle\Manager\UserManager;

class UniqueEmailValidator extends ConstraintValidator
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
        $reseller = $user->getReseller();
        $existingUser = $this->userManager->findAdminByEmail($user->getEmail());
        if (!$existingUser) {
            $existingUser = $this->userManager->getUserBy([
                'email' => $user->getEmail(),
                'reseller' => $reseller,
            ]);
            if ($reseller && $user->getEmail() === $reseller->getEmail())
                $existingUser = $reseller;
        }
        if ($existingUser && $existingUser->getId() !== $user->getId())
            $this->context->buildViolation($constraint->message)
                          ->atPath('email')
                          ->addViolation();
    }
}