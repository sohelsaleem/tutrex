<?php

namespace UserBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class TeachersNumber extends Constraint
{
    public $message = 'Sorry, there are already maximum number of teachers on this site.';

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}