<?php

namespace UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EditNameType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', 'text', [
                'label' => 'Name'
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
                'data_class' => 'UserBundle\Entity\User',
                'cascade_validation' => true,
                'attr' => [
                    'novalidate' => 'novalidate',
                    'class' => 'edit-name-form'
                ],
                'validation_groups' => ['UserEdit'],
            ]
        );
    }

    public function getBlockPrefix()
    {
        return 'user_edit_name';
    }

    public function getName()
    {
        return $this->getBlockPrefix();
    }
}