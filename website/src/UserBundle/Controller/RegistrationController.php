<?php

namespace UserBundle\Controller;

use FOS\UserBundle\Controller\RegistrationController as BaseController;
use FOS\UserBundle\Event\FilterUserResponseEvent;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\FOSUserEvents;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;

class RegistrationController extends BaseController
{
    /**
     * @Route("/register", name="register", options={"expose"=true})
     */
    public function registerAction(Request $request, Reseller $reseller = null)
    {
        $formFactory = $this->get('fos_user.registration.form.factory');
        $userManager = $this->get('fos_user.user_manager');
        $dispatcher = $this->get('event_dispatcher');
        $phoneNumberValidator = $this->get('phone_number_validator.util');
        $planManager = $this->get('plan.manager');

        $user = new User();
        $user->setReseller($reseller);

        $form = $formFactory->createForm();
        $form->setData($user);

        $form->handleRequest($request);

        if ($form->get('phone')->isValid()) {
            $phoneNumberValidator->validatePhoneNumberLength($form->get('phone'));
        }

        if ($request->isXmlHttpRequest()) {
            if ($form->isValid()) {
                $event = new FormEvent($form, $request);
                $dispatcher->dispatch(FOSUserEvents::REGISTRATION_SUCCESS, $event);

                $plan = $planManager->findOnePlanBy(['name' => 'Basic']);
                $apiPlan = $planManager->findOnePlanBy(['name' => 'API Basic']);

                $user->setRegistrationDate(new \DateTime());
                $user->setRoles(['ROLE_TEACHER', 'ROLE_ALLOWED_TO_SWITCH']);

                $user->setPlan($plan);
                $user->setStudentsInClassroom($plan->getStudentsInClassroom()[0]);
                $user->setMinutesLessonDuration($plan->getMinutesLessonDuration());
                $user->setNumberOfTeachers($plan->getNumberOfTeachers()[0]);

                $user->setApiPlan($apiPlan);
                $user->setApiStudentsInClassroom($apiPlan->getStudentsInClassroom()[0]);
                $user->setApiMinutesLessonDuration($apiPlan->getMinutesLessonDuration());
                $user->setApiNumberOfTeachers($apiPlan->getNumberOfTeachers()[0]);

                $userManager->updateUser($user);

                if (null === $response = $event->getResponse()) {
                    $url = $this->generateUrl('fos_user_registration_confirmed');
                    $response = new RedirectResponse($url);
                }

                $confirmation = $this->renderView('UserBundle:Registration:check_email.html.twig', [
                        'user' => $user,
                    ]
                );

                $dispatcher->dispatch(FOSUserEvents::REGISTRATION_COMPLETED, new FilterUserResponseEvent($user, $request, $response));

                return new JsonResponse([
                        'message' => 'success',
                        'confirmation' => $confirmation,
                    ]
                );
            }
        }

        return new JsonResponse([
                'message' => 'error',
                'form' => $this->renderView(
                    'UserBundle:Registration:registrationForm.html.twig', [
                        'form' => $form->createView(),
                    ]
                ),
            ]
        );
    }

    public function confirmAction(Request $request, $token)
    {
        $userManager = $this->get('fos_user.user_manager');
        $dispatcher = $this->get('event_dispatcher');
        $stripeManager = $this->get('stripe.manager');

        /** @var User $user */
        $user = $userManager->findUserByConfirmationToken($token);

        if (null === $user) {
            throw new NotFoundHttpException(sprintf('The user with confirmation token "%s" does not exist', $token));
        }

        $user->setConfirmationToken(null);
        $user->setEnabled(true);

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::REGISTRATION_CONFIRM, $event);

        $customer = $stripeManager->createCustomerForUser($user);
        $apiSubscription = $stripeManager->createSubscriptionForCustomer($customer, $user->getApiPlan(), null);
        $user->setApiSubscriptionId($apiSubscription->id);
        $userManager->updateUser($user);

        $this->addFlash(
            'notice',
            'Congrats, your account is now activated!'
        );

        if (null === $response = $event->getResponse()) {
            $url = $this->generateUrl('app_lesson_show_lessons');
            $response = new RedirectResponse($url);
        }

        $dispatcher->dispatch(FOSUserEvents::REGISTRATION_CONFIRMED, new FilterUserResponseEvent($user, $request, $response));

        $session = $this->get('session');
        $session->set('userStateIsChanged', true);

        return $response;
    }

    /**
     * @Route("/get-registration-form", name="user_get_registration_form", options={"expose"=true})
     */
    public function getRegistrationFormAction(Request $request)
    {
        if ($this->isGranted('ROLE_ADMIN') && $request->isXmlHttpRequest()) {
            $redirectRoute = $this->generateUrl('admin_show_teachers');

            return new JsonResponse([
                'message' => 'logged',
                'route' => $redirectRoute,
            ]);

        } elseif ($this->isGranted('ROLE_USER') && $request->isXmlHttpRequest()) {
            $redirectRoute = $this->generateUrl('app_lesson_show_lessons');

            return new JsonResponse([
                'route' => $redirectRoute,
                'message' => 'logged',
            ]);
        }

        $formFactory = $this->get('fos_user.registration.form.factory');

        $user = new User();

        $form = $formFactory->createForm();
        $form->setData($user);

        return new JsonResponse([
                'form' => $this->renderView(
                    'UserBundle:Registration:registrationForm.html.twig', [
                        'form' => $form->createView(),
                    ]
                ),
            ]
        );
    }
}
