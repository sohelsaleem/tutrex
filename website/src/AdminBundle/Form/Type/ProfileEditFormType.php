<?php

namespace AdminBundle\Form\Type;

use Misd\PhoneNumberBundle\Form\Type\PhoneNumberType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProfileEditFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Name',
            ])
            ->add('phone', PhoneNumberType::class, [
                'label' => 'Phone number',
                'invalid_message' => 'This value is not a valid phone number',
            ])
            ->add('expirationDate', DateType::class, [
                'label' => false,
                'format' => 'dd.MM.yyyy',
                'widget' => 'single_text',
                'html5' => false,
                'attr' => [
                    'readonly' => true,
                ],
            ]);
    }

    public function getName()
    {
        return 'profileEditForm';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => 'UserBundle\Entity\User',
            'label' => false,
            'csrf_protection' => false,
            'attr' => [
                'class' => 'profile-edit-form',
                'novalidate' => 'novalidate',
            ],
        ]);
    }
}
