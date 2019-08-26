<?php

namespace ApiBundle\EventListener;


use ApiBundle\Util\AnnotationUtil;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;

class JsonResponseAnnotationListener
{
    const ANNOTATION = 'ApiBundle\Annotation\JsonResponse';

    protected $annotationUtil;

    public function __construct(AnnotationUtil $annotationUtil)
    {
        $this->annotationUtil = $annotationUtil;
    }

    public function onKernelView(GetResponseForControllerResultEvent $event)
    {
        $configuration = $event->getRequest()->attributes->get('_json_response');
        if (!$configuration) {
            return;
        }

        $event->setResponse(new JsonResponse([
            'status' => 'success',
            'body' => $this->serializeResponse($event->getControllerResult()),
        ], 200));
    }

    /**
     * @param FilterControllerEvent $event
     */
    public function onKernelController(FilterControllerEvent $event)
    {
        $controller = $event->getController();

        if (!is_array($controller))
            return;

        if (!$this->annotationUtil->getMethodAnnotation($controller, self::ANNOTATION))
            return;

        $request = $event->getRequest();
        $contentType = $request->headers->get('Content-Type');
        $request->attributes->set('_json_response', true);

        if ($contentType !== 'application/json')
            throw new HttpException(400, 'Content-Type header should be set to application/json.');

        $request->request->replace($this->deserializeRequest($request->getContent()));
    }

    /**
     * @param string $content
     *
     * @return array
     */
    private function deserializeRequest($content)
    {
        if (!$content)
            return [];

        try {
            $serializedContent = \GuzzleHttp\json_decode($content, true);
        } catch (\InvalidArgumentException $exception) {
            throw new HttpException(400, 'Input data should be a valid JSON.');
        }

        return $serializedContent;
    }

    /**
     * @param mixed $data
     *
     * @return null|array
     */
    private function serializeResponse($data)
    {
        if (!is_array($data) || !count($data))
            return null;

        return $data;
    }
}
