<?php

namespace AppBundle\Util;

use Symfony\Component\Process\Process;

class FfmpegUtil
{
    private $ffmpeg;

    public function __construct($ffmpegBinary)
    {
        $this->ffmpeg = $ffmpegBinary;
    }

    /**
     * @param string $command
     */
    private function startSynchronousProcess($command)
    {
        $process = new Process($command);
        $process->mustRun();
    }

    /**
     * @param string $input
     * @param string $output
     */
    public function concatVideos($input, $output)
    {
        $command = $this->ffmpeg.' -f concat -safe 0 -i '.$input.' -c copy '.$output;
        $this->startSynchronousProcess($command);
    }
}