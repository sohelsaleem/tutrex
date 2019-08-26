<?php

namespace UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\NotBlank;

class RestoreType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('email', 'email', [
            'label' => 'Email',
            'constraints' => [
                new NotBlank(),
                new Email()
            ],
        ]);
    }

    public function getBlockPrefix()
    {
        return 'user_restore';
    }

    public function getName()
    {
        return $this->getBlockPrefix();
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
                'attr' => [
                    'novalidate' => 'novalidate',
                    'class' => 'user-restore'
                ]
            ]
        );
    }
}