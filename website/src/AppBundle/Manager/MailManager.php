<?php
namespace AppBundle\Manager;

class MailManager
{
    private $mailer;

    public function __construct($mailer)
    {
        $this->mailer = $mailer;
    }

    private function sendMessage($subject, $from, $to, $body)
    {
        $message = \Swift_Message::newInstance()
            ->setSubject($subject)
            ->setFrom($from)
            ->setTo($to)
            ->setBody($body, 'text/html');

        $this->mailer->send($message);

        return $this;
    }

    public function sendSharedDocuments($lesson, $documentsList, $to)
    {
        $subject = 'Shared documents for lesson '.$lesson->getTitle(). ' from '. $lesson->getDate()->format('m-d-Y H:i');
        $from = 'learnium@test.com';
        $body = '';

        foreach($documentsList as $document) {
            $body .= $document['documentName'] . ': ' . $document['documentUrl'] . '<br>';
        }

        $this->sendMessage($subject, $from, $to, $body);

        return $this;
    }
}