<?php

namespace AdminBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ResellerType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email', EmailType::class, [
                'label' => 'Email',
            ])
            ->add('name', TextType::class, [
                'label' => 'Name',
            ])
            ->add('subdomain', TextType::class, [
                'label' => 'Subdomain',
            ])
            ->add('externalDomain', TextType::class, [
                'label' => 'External domain',
            ])
            ->add('allowSubdomains', CheckboxType::class, [
                'label' => 'Allow subdomains',
                'label_attr' => [
                    'class' => 'blue-check-label',
                ],
            ])
            ->add('maximumUsers', TextType::class, [
                'label' => 'Maximum number of teacher accounts',
            ])
            ->add('maximumPaidUsers', TextType::class, [
                'label' => 'Maximum number of paid teacher accounts',
            ])
            ->add('expirationDate', DateType::class, [
                'label' => 'Expiration date',
                'format' => 'dd.MM.yyyy',
                'widget' => 'single_text',
                'html5' => false,
                'attr' => [
                    'readonly' => true,
                ],
            ])
            ->add('mailgunSenderEmail', TextType::class, [
                'label' => 'Mailgun sender email',
            ])
            ->add('mailgunSenderName', TextType::class, [
                'label' => 'Mailgun sender name',
            ])
            ->add('mailgunDomain', TextType::class, [
                'label' => 'Mailgun domain',
            ])
            ->add('mailgunApiKey', TextType::class, [
                'label' => 'Mailgun api key',
            ])
            ->add('jivochatCode', TextType::class, [
                'label' => 'JivoChat code',
            ])
            ->add('jivochatEnabled', CheckboxType::class, [
                'label' => 'Enable JivoChat',
                'label_attr' => [
                    'class' => 'blue-check-label',
                ],
            ])
            ->add('apiEnabled', CheckboxType::class, [
                'label' => 'Enable API',
                'label_attr' => [
                    'class' => 'blue-check-label',
                ],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => 'UserBundle\Entity\Reseller',
            'attr' => [
                'novalidate' => 'novalidate',
            ],
            'validation_groups' => ['ResellerRegistration', 'SubdomainRegistration'],
        ]);
    }
}
