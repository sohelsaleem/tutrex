<?php

namespace AdminBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserFilterType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', 'text', [
                'label' => false,
                'attr' => [
                    'placeholder' => 'Search user'
                ]
            ]);
    }

    public function getName()
    {
        return 'userFilter';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'label' => false,
            'csrf_protection' => false,
            'attr' => [
                'class' => 'user-filter',
                'novalidate' => 'novalidate',
                'autocomplete' => 'off'
            ]
        ]);
    }
}

