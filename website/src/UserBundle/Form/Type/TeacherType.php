<?php

namespace UserBundle\Form\Type;

use libphonenumber\PhoneNumber;
use Misd\PhoneNumberBundle\Form\Type\PhoneNumberType;
use libphonenumber\PhoneNumberFormat;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TeacherType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email', 'email', [
                    'label' => 'Email'
                ]
            )
            ->add('name', 'text', [
                'label' => 'Name'
            ])
            ->add('phone', PhoneNumberType::class, [
                    'label' => 'Phone number',
                    'empty_data' => new PhoneNumber()
                ]
            );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
                'data_class' => 'UserBundle\Entity\Teacher',
                'cascade_validation' => true,
                'attr' => [
                    'novalidate' => 'novalidate',
                    'class' => 'add-teacher-form'
                ],
                'validation_groups' => ['TeacherRegistration']
            ]
        );
    }

    public function getBlockPrefix()
    {
        return 'add_teacher_form';
    }

    public function getName()
    {
        return $this->getBlockPrefix();
    }
}