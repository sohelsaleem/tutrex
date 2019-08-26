<?php

namespace UserBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class UniqueEmail extends Constraint
{
    public $message = 'This email is already used';

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}