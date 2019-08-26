<?php

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class IsNotEmptyDuration extends Constraint
{
    public $message = 'The approximate duration should not be blank';

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}