<?php

namespace AppBundle\Util;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Process\Process;

class CertificateUtil
{
    private $container;
    private $workDir;
    private $webDir;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->workDir = $container->getParameter('kernel.root_dir').'/../certbot';
        $this->webDir = $container->getParameter('kernel.root_dir').'/../web';
    }

    /**
     * @param array $domains
     *
     * @return array
     */
    public function getCodesForDnsChallenge($domains)
    {
        $process = $this->getProcess($domains);
        $process->start();
        sleep(20);
        $output = $process->getOutput();

        $this->saveOutputToFile($output);

        $domains = $this->splitDomains($domains);

        $regularDomains = array_map(function ($domain) use ($output) {
            $fileData = $this->extractDataForHttpChallengeFromOutput($output, $domain);
            $this->createFileForHttpChallenge($fileData['fileName'], $fileData['fileContent']);

            return [
                'name' => $domain,
                'code' => '',
            ];
        }, $domains['regular']);

        $wildcardDomains = array_map(function ($domain) use ($output) {
            return [
                'name' => $domain,
                'code' => $this->extractCodeFromOutput($output, $domain),
            ];
        }, $domains['wildcard']);

        return array_merge($regularDomains, $wildcardDomains);
    }

    /**
     * @param array $domains
     *
     * @return string
     */
    public function generateNewCertificate($domains)
    {
        $process = $this->getProcess($domains, true);
        $process->mustRun();

        return $process->getOutput();
    }

    /**
     * @param array $domains
     *
     * @return string
     */
    private function getCommand($domains)
    {
        $command = "certbot certonly --cert-name elearning --force-renewal --manual --expand --email dmitry.a@fora-soft.com --server https://acme-v02.api.letsencrypt.org/directory --agree-tos --manual-public-ip-logging-ok --logs-dir {$this->workDir} --work-dir {$this->workDir} --config-dir {$this->workDir}";
        foreach ($domains as $domain) {
            $command .= ' -d '.$domain;
        }

        return $command;
    }

    /**
     * @param array $domains
     * @param bool  $isUpdating
     *
     * @return string
     */
    private function getCommandInput($domains, $isUpdating)
    {
        $input = $isUpdating ? "\n" : '';

        for ($i = 0; $i < count($domains) - 1; $i++) {
            $input .= "\n";
        }

        return $input;
    }

    /**
     * @param array $domains
     * @param bool  $isUpdating
     *
     * @return Process
     */
    private function getProcess($domains, $isUpdating = false)
    {
        $command = $this->getCommand($domains);
        $input = $this->getCommandInput($domains, $isUpdating);
        $process = new Process($command, null, null, $input);
        $process->setPty(true);

        return $process;
    }

    /**
     * @param string $output
     * @param string $domain
     *
     * @return bool|string
     */
    private function extractCodeFromOutput($output, $domain)
    {
        $domain = substr($domain, 2);
        $needle = '_acme-challenge.'.$domain;
        $position = strpos($output, $needle) + 27 + strlen($needle);
        $endPosition = strpos($output, 'Before', $position) - 1;
        $length = $endPosition - $position;

        return trim(substr($output, $position, $length));
    }

    /**
     * @param string $output
     * @param string $domain
     *
     * @return array
     */
    private function extractDataForHttpChallengeFromOutput($output, $domain)
    {
        $needle = 'http://'.$domain.'/.well-known/acme-challenge/';
        $fileNamePosition = strpos($output, $needle) + strlen($needle);
        $fileNameEndPosition = strpos($output, '- - - - -', $fileNamePosition) - 1;
        $fileNameLength = $fileNameEndPosition - $fileNamePosition;
        $fileName = trim(substr($output, $fileNamePosition, $fileNameLength));

        $fileContentPosition = strpos($output, $fileName);
        $fileContentEndPosition = strpos($output, 'And make', $fileContentPosition) - 1;
        $fileContentLength = $fileContentEndPosition - $fileContentPosition;
        $fileContent = trim(substr($output, $fileContentPosition, $fileContentLength));

        return [
            'fileName' => $fileName,
            'fileContent' => $fileContent,
        ];
    }

    /**
     * @param string $fileName
     * @param string $fileContent
     */
    private function createFileForHttpChallenge($fileName, $fileContent)
    {
        $filePath = $this->webDir.'/.well-known/acme-challenge/'.$fileName;
        $file = fopen($filePath, 'w');
        fwrite($file, $fileContent);
        fclose($file);
    }

    /**
     * @param array $domains
     *
     * @return array
     */
    private function splitDomains($domains)
    {
        return [
            'regular' => preg_grep("/^\*\./", $domains, PREG_GREP_INVERT),
            'wildcard' => preg_grep("/^\*\./", $domains),
        ];
    }

    /**
     * @param string $output
     */
    private function saveOutputToFile($output)
    {
        $filePath = $this->webDir.'/cert-output-'.(new \DateTime())->format('H:i_d.m.Y');
        $file = fopen($filePath, 'w');
        fwrite($file, $output);
        fclose($file);
    }
}
