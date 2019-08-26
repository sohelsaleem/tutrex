<?php

namespace AppBundle\Util;

class HostnameUtil
{
    /**
     * Method accepts $defaultHost here only to allow testing locally with first-level domains (e.g. "localhost")
     *
     * @param string $hostname
     * @param string $defaultHost
     *
     * @return string
     */
    public static function getDomain($hostname, $defaultHost)
    {
        $parts = self::getParts($hostname);
        $defaultNumberOfParts = count(self::getParts($defaultHost));
        $numberOfParts = count($parts);
        if ($numberOfParts > $defaultNumberOfParts) {
            $domain = '';
            for ($i = 1; $i < $numberOfParts; $i++)
                $domain .= '.'.$parts[$i];

            return substr($domain, 1);
        }

        return $hostname;
    }

    /**
     * Method accepts $defaultHost here only to allow testing locally with first-level domains (e.g. "localhost")
     *
     * @param string $hostname
     * @param string $defaultHost
     *
     * @return null|string
     */
    public static function getSubdomain($hostname, $defaultHost)
    {
        $parts = self::getParts($hostname);
        $defaultNumberOfParts = count(self::getParts($defaultHost));
        if (count($parts) > $defaultNumberOfParts)
            return $parts[0];

        return null;
    }

    /**
     * @param string $uri
     * @param string $newDomain
     * @param string $defaultHost
     *
     * @return string
     */
    public static function replaceDomain($uri, $newDomain, $defaultHost)
    {
        return str_replace($defaultHost, $newDomain, $uri);
    }

    /**
     * @param string $uri
     * @param string $subdomain
     *
     * @return string
     */
    public static function replaceSubdomain($uri, $subdomain)
    {
        return preg_replace('/:\/\/\w+./i', '://'.$subdomain.'.', $uri, 1);
    }

    /**
     * @param string $uri
     * @param string $subdomain
     *
     * @return string
     */
    public static function addSubdomain($uri, $subdomain)
    {
        return preg_replace('/:\/\//i', '://'.$subdomain.'.', $uri, 1);
    }

    /**
     * @param string $uri
     *
     * @return string
     */
    public static function removeSubdomain($uri)
    {
        return preg_replace('/:\/\/\w+./i', '://', $uri, 1);
    }

    /**
     * @param string $hostname
     *
     * @return array
     */
    private static function getParts($hostname)
    {
        return explode('.', $hostname);
    }
}