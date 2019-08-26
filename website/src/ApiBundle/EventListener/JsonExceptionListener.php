<?php

namespace ApiBundle\EventListener;

use ApiBundle\Exception\JsonException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;

class JsonExceptionListener
{
    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        $configuration = $event->getRequest()->attributes->get('_json_response');
        if (!$configuration)
            return;

        $exception = $event->getException();
        $response = $this->getResponse($exception);

        if (!$response)
            return;

        $event->setResponse($response);
    }

    private function getResponse(\Exception $exception)
    {
        if ($exception instanceof JsonException)
            return new JsonResponse([
                'status' => 'error',
                'body' => [
                    'message' => $exception->getMessage(),
                    'errors' => $exception->getErrors(),
                ],
            ], $exception->getStatusCode());

        if ($exception instanceof HttpException)
            return new JsonResponse([
                'status' => 'error',
                'body' => [
                    'message' => $exception->getMessage(),
                ],
            ], $exception->getStatusCode());
    }
}
