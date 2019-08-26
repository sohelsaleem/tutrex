<?php

namespace UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use UserBundle\Entity\User;

class EditLogoType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('classroomLogo', FileType::class, array('label' => 'Classroom logo'));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => User::class,
            'cascade_validation' => true,
            'attr' => [
                'novalidate' => 'novalidate',
                'class' => 'edit-logo-form'
            ],
            'validation_groups' => ['UserEdit']
        ));
    }

    public function getBlockPrefix()
    {
        return 'user_edit_logo';
    }

    public function getName()
    {
        return $this->getBlockPrefix();
    }
}
