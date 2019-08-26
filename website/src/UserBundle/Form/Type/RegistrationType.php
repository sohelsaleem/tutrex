<?php

namespace UserBundle\Form\Type;

use libphonenumber\PhoneNumber;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\NotBlank;
use Misd\PhoneNumberBundle\Form\Type\PhoneNumberType;
use libphonenumber\PhoneNumberFormat;

class RegistrationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', 'text', [
                'label' => 'Name'
            ])
            ->add('email', 'email', [
                    'label' => 'Email'
                ]
            )
            ->add('plainPassword', 'repeated', [
                    'type' => 'password',
                    'first_options'  => ['label' => 'Password'],
                    'second_options' => ['label' => 'Confirm password'],
                    'invalid_message' => 'Entered passwords don\'t match',
                ]
            )
            ->add('phone', PhoneNumberType::class, [
                    'label' => 'Phone number',
                    'empty_data' => new PhoneNumber(),
                    'invalid_message' => 'This value is not a valid phone number'
                ]
            );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
                'data_class' => 'UserBundle\Entity\User',
                'cascade_validation' => true,
                'attr' => [
                    'novalidate' => 'novalidate',
                    'class' => 'registration-form'
                ]
            ]
        );
    }

    public function getBlockPrefix()
    {
        return 'user_registration';
    }

    public function getName()
    {
        return $this->getBlockPrefix();
    }
}