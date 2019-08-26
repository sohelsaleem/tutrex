<?php

namespace UserBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class UniqueSubdomain extends Constraint
{
    public $message = 'This subdomain is already used';

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}