<?php

namespace UserBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use UserBundle\Entity\Reseller;
use UserBundle\Manager\ResellerManager;

class UniqueExternalDomainValidator extends ConstraintValidator
{
    private $resellerManager;

    public function __construct(ResellerManager $resellerManager)
    {
        $this->resellerManager = $resellerManager;
    }

    /**
     * @param Reseller   $reseller
     * @param Constraint $constraint
     */
    public function validate($reseller, Constraint $constraint)
    {
        if ($reseller->getExternalDomain()) {
            $existingReseller = $this->resellerManager->findByExternalDomain($reseller->getExternalDomain());

            if ($existingReseller && $existingReseller !== $reseller) {
                $this->context->buildViolation($constraint->message)
                              ->atPath('externalDomain')
                              ->addViolation();
            }
        }
    }
}