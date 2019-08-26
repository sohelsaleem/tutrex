<?php

namespace UserBundle\Exception;

use Throwable;

class ExceededPaidTeachersException extends \Exception
{
    const DEFAULT_MESSAGE = 'Sorry, you already have maximum number of paid teacher accounts';

    public function __construct($message = self::DEFAULT_MESSAGE, $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
