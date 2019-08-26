<?php

namespace AdminBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ConsultantType extends AbstractType
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
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
                'data_class' => 'UserBundle\Entity\Consultant',
                'attr' => [
                    'novalidate' => 'novalidate',
                    'class' => 'add-consultant-form'
                ],
                'validation_groups' => ['ConsultantRegistration']
            ]
        );
    }

    public function getBlockPrefix()
    {
        return 'add_consultant_form';
    }

    public function getName()
    {
        return $this->getBlockPrefix();
    }
}