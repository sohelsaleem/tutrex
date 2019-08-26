<?php

namespace ApiBundle\EventListener;


use ApiBundle\Util\AnnotationUtil;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use UserBundle\Entity\User;

class LessonAccessAnnotationListener
{
    const ANNOTATION = 'ApiBundle\Annotation\LessonAccess';

    protected $annotationUtil;

    public function __construct(AnnotationUtil $annotationUtil)
    {
        $this->annotationUtil = $annotationUtil;
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
        $lessonId = $request->attributes->getInt('lesson');
        /** @var User $user */
        $user = $request->attributes->get('user');

        if (!$user->hasLessonWithId($lessonId))
            throw new NotFoundHttpException('Lesson not found.');
    }
}
