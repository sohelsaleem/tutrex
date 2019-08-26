<?php

namespace AppBundle\Util;

class ApacheUtil
{
    const RESTART_COMMAND = '/etc/init.d/apache2 restart';

    public static function restart()
    {
        exec(self::RESTART_COMMAND);
    }
}
