<?php

namespace ApiBundle\Util;

class ValidationResult
{
    /** @var array */
    private $errors;

    public function __construct(array  $errors)
    {
        $this->errors = $errors;
    }

    public function getErrors()
    {
        return array_filter($this->errors, function ($error) {
            return !is_null($error);
        });
    }

    public function hasErrors()
    {
        return count($this->getErrors());
    }
}
