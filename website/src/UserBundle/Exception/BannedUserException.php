<?php

namespace UserBundle\Exception;

use Symfony\Component\Security\Core\Exception\AuthenticationException;


class BannedUserException extends AuthenticationException
{
    /**
     * {@inheritdoc}
     */
    public function getMessageKey()
    {
        return 'Account is disabled';
    }
}