<?php

namespace ApiBundle\Exception;

use Symfony\Component\HttpKernel\Exception\HttpException;

class JsonException extends HttpException
{
    private $errors;

    public function __construct($message, array $errors, $statusCode = 400)
    {
        $this->errors = $errors;

        parent::__construct($statusCode, $message, null, [], 0);
    }

    public function getErrors()
    {
        return $this->errors;
    }
}
