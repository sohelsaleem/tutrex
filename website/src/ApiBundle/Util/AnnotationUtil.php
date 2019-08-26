<?php

namespace ApiBundle\Util;

use Doctrine\Common\Annotations\AnnotationReader;

class AnnotationUtil
{
    private $annotationReader;

    public function __construct(AnnotationReader $annotationReader)
    {
        $this->annotationReader = $annotationReader;
    }

    /**
     * @param callable $controller
     * @param string   $annotation
     *
     * @return null|object
     */
    public function getMethodAnnotation($controller, $annotation)
    {
        list($controllerObject, $methodName) = $controller;
        $controllerReflectionObject = new \ReflectionObject($controllerObject);
        $reflectionMethod = $controllerReflectionObject->getMethod($methodName);

        return $this->annotationReader->getMethodAnnotation($reflectionMethod, $annotation);
    }

    /**
     * @param callable $controller
     * @param string   $annotation
     *
     * @return null|object
     */
    public function getControllerAnnotation($controller, $annotation)
    {
        list($controllerObject, $methodName) = $controller;
        $controllerReflectionObject = new \ReflectionObject($controllerObject);

        return $this->annotationReader->getClassAnnotation($controllerReflectionObject, $annotation);
    }
}
