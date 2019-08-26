<?php

namespace AppBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class LessonType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'title',
                'text',
                [
                    'label' => 'Title'
                ]
            )
            ->add(
                'date',
                'date',
                [
                    'label' => false,
                    'format' => 'dd.MM.yyyy',
                    'widget' => 'single_text',
                    'html5' => false,
                    'attr' => [
                        'readonly' => true,
                        'class' => 'new-lesson-date-field'
                    ]
                ]
            )
            ->add(
                'time',
                'text',
                [
                    'label' => false,
                    'attr' => [
                        'readonly' => true,
                        'class' => 'new-lesson-time-field',
                        'data-minute-step' => 5
                    ]
                ]
            )
            ->add(
                'durationHours',
                'integer',
                [
                    'label' => false,
                    'error_bubbling' => true,
                    'attr' => [
                        'min' => 0,
                    ],
                ]
            )
            ->add(
                'durationMinutes',
                'integer',
                [
                    'label' => false,
                    'error_bubbling' => true,
                    'attr' => [
                        'min' => 0
                    ],
                ]
            );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class' => 'AppBundle\Entity\Lesson',
                'attr' => [
                    'novalidate' => 'novalidate'
                ],
                'timezoneName' => 'Europe/Moscow'
            ]
        );
    }

    public function getBlockPrefix()
    {
        return 'lesson_form';
    }

    public function getName()
    {
        return $this->getBlockPrefix();
    }
}