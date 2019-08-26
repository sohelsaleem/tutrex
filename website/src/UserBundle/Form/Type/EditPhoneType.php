<?php

namespace UserBundle\Form\Type;

use libphonenumber\PhoneNumber;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Misd\PhoneNumberBundle\Form\Type\PhoneNumberType;
use libphonenumber\PhoneNumberFormat;

class EditPhoneType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('phone', PhoneNumberType::class, [
                'label' => 'Phone number',
                'empty_data' => new PhoneNumber()
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
                'data_class' => 'UserBundle\Entity\User',
                'cascade_validation' => true,
                'attr' => [
                    'novalidate' => 'novalidate',
                    'class' => 'edit-phone-form'
                ],
                'validation_groups' => ['UserEdit'],
                'invalid_message' => 'This value is not a valid phone number'
            ]
        );
    }

    public function getBlockPrefix()
    {
        return 'user_edit_phone';
    }

    public function getName()
    {
        return $this->getBlockPrefix();
    }
}