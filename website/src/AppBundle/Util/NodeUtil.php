<?php

namespace AppBundle\Util;

use Symfony\Component\Process\Process;

class NodeUtil
{
    const PATH_TO_RESTART_SCRIPT = '/var/node/restart.sh';

    /**
     * @return string
     */
    public static function restart()
    {
        $process = new Process(self::PATH_TO_RESTART_SCRIPT);
        $process->run();

        return $process->getOutput();
    }
}