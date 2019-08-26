<?php

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class ApproxDurationLimit extends Constraint
{
    public $message = 'The approximate duration should not be longer than {{ limit }} minutes';

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}