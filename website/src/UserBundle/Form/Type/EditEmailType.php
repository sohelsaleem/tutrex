<?php

namespace UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EditEmailType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email', 'email', [
                    'label' => 'Email'
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
                    'class' => 'edit-email-form'
                ],
                'validation_groups' => ['UserEdit']
            ]
        );
    }

    public function getBlockPrefix()
    {
        return 'user_edit_email';
    }

    public function getName()
    {
        return $this->getBlockPrefix();
    }
}