<?php

namespace AdminBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Range;

class CapabilitiesEditFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $showApiCapabilities = $options['showApiCapabilities'];

        $builder
            ->add('studentsInClassroom', 'integer', [
                'label' => false,
                'constraints' => [
                    new NotBlank(['message' => 'This value is not valid']),
                    new Range([
                        'min' => 1,
                        'max' => 500,
                        'minMessage' => 'This value must be at least {{ limit }}',
                        'maxMessage' => 'This value cannot be larger than {{ limit }}',
                    ]),

                ],
            ])
            ->add('minutesLessonDuration', 'integer', [
                'label' => false,
                'constraints' => [
                    new NotBlank(['message' => 'This value is not valid']),
                    new Range([
                        'min' => 1,
                        'max' => 500,
                        'minMessage' => 'This value must be at least {{ limit }}',
                        'maxMessage' => 'This value cannot be larger than {{ limit }}',
                    ]),
                ],
            ])
            ->add('numberOfTeachers', 'integer', [
                'label' => false,
                'constraints' => [
                    new NotBlank(['message' => 'This value is not valid']),
                    new Range([
                        'min' => 1,
                        'max' => 25,
                        'minMessage' => 'This value must be at least {{ limit }}',
                        'maxMessage' => 'This value cannot be larger than {{ limit }}',
                    ]),

                ],
            ])
            ->add('storageLimit', FloatType::class, [
                'label' => false,
            ]);

        if ($showApiCapabilities) {
            $builder
                ->add('apiConcurrentLessons', IntegerType::class, [
                    'label' => false,
                    'constraints' => [
                        new NotBlank(['message' => 'This value is not valid']),
                        new Range([
                            'min' => 1,
                            'max' => 500,
                            'minMessage' => 'This value must be at least {{ limit }}',
                            'maxMessage' => 'This value cannot be larger than {{ limit }}',
                        ]),
                    ],
                ])
                ->add('apiStudentsInClassroom', IntegerType::class, [
                    'label' => false,
                    'constraints' => [
                        new NotBlank(['message' => 'This value is not valid']),
                        new Range([
                            'min' => 1,
                            'max' => 500,
                            'minMessage' => 'This value must be at least {{ limit }}',
                            'maxMessage' => 'This value cannot be larger than {{ limit }}',
                        ]),
                    ],
                ])
                ->add('apiMinutesLessonDuration', IntegerType::class, [
                    'label' => false,
                    'constraints' => [
                        new NotBlank(['message' => 'This value is not valid']),
                        new Range([
                            'min' => 1,
                            'max' => 500,
                            'minMessage' => 'This value must be at least {{ limit }}',
                            'maxMessage' => 'This value cannot be larger than {{ limit }}',
                        ]),
                    ],
                ]);
        }
    }

    public function getName()
    {
        return 'capabilitiesEditForm';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => 'UserBundle\Entity\User',
            'label' => false,
            'csrf_protection' => false,
            'attr' => [
                'class' => 'capabilities-edit-form',
                'novalidate' => 'novalidate',
            ],
            'validation_groups' => ['Capabilities'],
            'showApiCapabilities' => false,
        ]);

        $resolver->setRequired('showApiCapabilities');
    }
}

