<?php

namespace UserBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class UniqueExternalDomain extends Constraint
{
    public $message = 'This domain is already used';

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}