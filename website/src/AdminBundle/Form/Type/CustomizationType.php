<?php

namespace AdminBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CustomizationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('pageTitle', TextType::class, [
                'label' => 'Page Title',
            ])
            ->add('landingHeader', TextType::class, [
                'label' => 'Header',
            ])
            ->add('landingSubHeader', TextareaType::class, [
                'label' => 'Subheader',
            ])
            ->add('landingHeaderBottom', TextType::class, [
                'label' => 'Header (bottom)',
            ])
            ->add('landingSubHeaderBottom', TextareaType::class, [
                'label' => 'Subheader (bottom)',
            ])
            ->add('landingImage', HiddenType::class)
            ->add('landingImageFile', FileType::class, [
                'mapped' => false,
                'label' => false,
            ])
            ->add('landingImageBottom', HiddenType::class)
            ->add('landingImageBottomFile', FileType::class, [
                'mapped' => false,
                'label' => false,
            ])
            ->add('logo', HiddenType::class)
            ->add('logoFile', FileType::class, [
                'mapped' => false,
                'label' => false,
            ])
            ->add('privacySite', TextType::class, [
                'label' => 'Site',
            ])
            ->add('privacyAddressFirstLine', TextType::class, [
                'label' => 'Address first line',
            ])
            ->add('privacyAddressSecondLine', TextType::class, [
                'label' => 'Address second line',
            ])
            ->add('privacyCountry', TextType::class, [
                'label' => 'Country',
            ])
            ->add('privacyEmail', TextType::class, [
                'label' => 'Email',
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => 'AdminBundle\Entity\CustomizationInterface',
            'attr' => [
                'novalidate' => 'novalidate',
            ],
        ]);
    }
}