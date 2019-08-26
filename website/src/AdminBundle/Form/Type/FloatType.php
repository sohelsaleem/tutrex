<?php
/**
 * Created by PhpStorm.
 * User: Vatrushkin
 * Date: 26.01.2018
 * Time: 14:09
 */

namespace AdminBundle\Form\Type;


use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;

class FloatType extends AbstractType
{
    public function getParent()
    {
        return NumberType::class;
    }
}
