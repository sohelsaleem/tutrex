<?php

namespace AppBundle\Util;

use FOS\UserBundle\Model\UserInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\User;

class Mailer extends \FOS\UserBundle\Mailer\Mailer
{
    private $container;
    private $mailgunDomain;
    private $mailgunApiKey;
    private $from;

    /**
     * Mailer constructor.
     *
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $mailer = $container->get('mailer');
        $router = $container->get('router');
        $templating = $container->get('templating');
        $this->mailgunDomain = $container->getParameter('mailgun_domain');
        $this->mailgunApiKey = $container->getParameter('mailgun_api_key');
        $this->from = [
            'email' => $container->getParameter('from_email'),
            'name' => $container->getParameter('from_name'),
        ];
        $parameters = [
            'confirmation.template' => $container->getParameter('fos_user.registration.confirmation.template'),
            'resetting.template' => $container->getParameter('fos_user.resetting.email.template'),
            'from_email' => [
                'confirmation' => $container->getParameter('fos_user.registration.confirmation.from_email'),
                'resetting' => $container->getParameter('fos_user.resetting.email.from_email'),
            ],
        ];

        parent::__construct($mailer, $router, $templating, $parameters);
    }

    /**
     * {@inheritdoc}
     */
    public function sendResettingEmailMessage(UserInterface $user)
    {
        $resellerManager = $this->container->get('reseller.manager');
        $defaultHost = $this->container->getParameter('default_host');

        $template = $this->parameters['resetting.template'];
        $url = $this->router->generate('fos_user_resetting_reset', ['token' => $user->getConfirmationToken()], UrlGeneratorInterface::ABSOLUTE_URL);
        if (!$user->isEnabled())
            if ($user instanceof Reseller)
                $url = $resellerManager->updateUrlByReseller($url, $user);
            elseif ($subdomain = $user->getSubdomain()) {
                $defaultRoute = $this->router->generate('homepage');
                if (!HostnameUtil::getSubdomain($defaultRoute, $defaultHost))
                    $url = HostnameUtil::addSubdomain($url, $subdomain);
            }
        $rendered = $this->templating->render($template, [
            'user' => $user,
            'confirmationUrl' => $url,
        ]);
        $reseller = $user instanceof Reseller ? $user : $user->getReseller();
        if ($reseller && $reseller->getMailgunApiKey())
            $this->sendEmailFromReseller($rendered, (string) $user->getEmail(), $reseller);
        else
            $this->sendEmailMessage($rendered, $this->from, (string) $user->getEmail());
    }

    /**
     * @param UserInterface $user
     */
    public function sendConfirmationEmailMessage(UserInterface $user)
    {
        $template = $this->parameters['confirmation.template'];
        $url = $this->router->generate('fos_user_registration_confirm', ['token' => $user->getConfirmationToken()], UrlGeneratorInterface::ABSOLUTE_URL);
        $rendered = $this->templating->render($template, [
            'user' => $user,
            'confirmationUrl' => $url,
        ]);
        $reseller = $user instanceof Reseller ? $user : $user->getReseller();
        if ($reseller && $reseller->getMailgunApiKey())
            $this->sendEmailFromReseller($rendered, (string) $user->getEmail(), $reseller);
        else
            $this->sendEmailMessage($rendered, $this->from, (string) $user->getEmail());
    }

    /**
     * @param User   $teacher
     * @param string $subject
     * @param string $message
     */
    public function sendContactUsEmail(User $teacher, $subject, $message)
    {
        $template = $this->container->getParameter('contact_us_email_template');
        $rendered = $this->templating->render($template, [
            'teacher' => $teacher,
            'subject' => $subject,
            'message' => $message,
        ]);
        $reseller = $teacher->getReseller();
        $resellerEmail = $reseller->getEmail();
        if ($reseller->getMailgunApiKey())
            $this->sendEmailFromReseller($rendered, (string) $resellerEmail, $reseller);
        else
            $this->sendEmailMessage($rendered, $this->from, (string) $resellerEmail);
    }

    /**
     * @param string   $renderedTemplate
     * @param string   $toEmail
     * @param Reseller $reseller
     */
    protected function sendEmailFromReseller($renderedTemplate, $toEmail, Reseller $reseller)
    {
        $renderedLines = explode("\n", trim($renderedTemplate));
        $subject = array_shift($renderedLines);
        $body = implode("<br>", $renderedLines);
        $domain = $reseller->getMailgunDomain();
        $apiKey = $reseller->getMailgunApiKey();
        $from = [
            'name' => $reseller->getMailgunSenderName(),
            'email' => $reseller->getMailgunSenderEmail(),
        ];

        $this->sendEmail($domain, $apiKey, $from, (string) $toEmail, $subject, $body);
    }

    /**
     * @param string $renderedTemplate
     * @param array $fromEmail
     * @param string $toEmail
     */
    protected function sendEmailMessage($renderedTemplate, $fromEmail, $toEmail)
    {
        $renderedLines = explode("\n", trim($renderedTemplate));
        $subject = array_shift($renderedLines);
        $body = implode("<br>", $renderedLines);

        $this->sendEmail($this->mailgunDomain, $this->mailgunApiKey, $this->from, (string) $toEmail, $subject, $body);
    }

    /**
     * @param string $domain
     * @param string $apiKey
     * @param array  $from
     * @param string $to
     * @param string $subject
     * @param string $body
     */
    protected function sendEmail($domain, $apiKey, $from, $to, $subject, $body)
    {
        $guzzle = new \GuzzleHttp\Client();
        $guzzle->request('POST', "https://api.mailgun.net/v3/$domain/messages", [
            'auth' => ['api', $apiKey],
            'form_params' => [
                'from' => "{$from['name']} <{$from['email']}>",
                'to' => $to,
                'subject' => $subject,
                'html' => $body,
            ],
        ]);
    }
}
