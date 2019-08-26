<?php

namespace UserBundle\Controller;

use FOS\UserBundle\Event\FilterUserResponseEvent;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Event\GetResponseNullableUserEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Model\UserInterface;
use FOS\UserBundle\Util\TokenGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use FOS\UserBundle\Controller\ResettingController as BaseController;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\User;
use UserBundle\Form\Type\RestoreType;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Controller managing the resetting of the password.
 *
 * @author Thibault Duplessis <thibault.duplessis@gmail.com>
 * @author Christophe Coevoet <stof@notk.org>
 */
class ResettingController extends BaseController
{
    /**
     * Request reset user password: show form.
     */
    public function requestAction()
    {
        $form = $this->createForm(new RestoreType());

        return new JsonResponse([
                'form' => $this->renderView(
                    'FOSUserBundle:Resetting:request.html.twig', [
                        'form' => $form->createView(),
                    ]
                ),
            ]
        );
    }

    /**
     * Request reset user password: submit form and send email.
     *
     * @param Request $request
     *
     * @return Response
     */
    public function sendEmailAction(Request $request)
    {
        $form = $this->createForm(new RestoreType());

        $form->handleRequest($request);
        if ($request->isXmlHttpRequest()) {
            $username = $form->get('email')->getData();

            $user = null;
            $reseller = $this->get('reseller.manager')->getResellerFromRequest($request);
            if ($reseller && $username === $reseller->getEmail())
                $user = $reseller;
            if (!$user) {
                /** @var User $user */
                $user = $this->get('fos_user.user_manager')->findUserBy([
                    'email' => $username,
                    'reseller' => $reseller,
                ]);
            }

            if ($user == null) {
                $form->get('email')->addError(new FormError('This email is not found'));


                return new JsonResponse([
                        'message' => 'fail',
                        'form' => $this->renderView(
                            'FOSUserBundle:Resetting:request.html.twig', [
                                'form' => $form->createView(),
                            ]
                        ),
                    ]
                );
            }

            /** @var $dispatcher EventDispatcherInterface */
            $dispatcher = $this->get('event_dispatcher');

            /* Dispatch init event */
            $event = new GetResponseNullableUserEvent($user, $request);
            $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_INITIALIZE, $event);

            if (null !== $event->getResponse()) {
                return $event->getResponse();
            }

            $ttl = $this->container->getParameter('fos_user.resetting.token_ttl');

            $event = new GetResponseUserEvent($user, $request);
            $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_REQUEST, $event);

            if (null !== $event->getResponse()) {
                return $event->getResponse();
            }

            if (null === $user->getConfirmationToken()) {
                /** @var $tokenGenerator TokenGeneratorInterface */
                $tokenGenerator = $this->get('fos_user.util.token_generator');
                $user->setConfirmationToken($tokenGenerator->generateToken());
            }

            /* Dispatch confirm event */
            $event = new GetResponseUserEvent($user, $request);
            $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_CONFIRM, $event);

            if (null !== $event->getResponse()) {
                return $event->getResponse();
            }

            $this->get('fos_user.mailer')->sendResettingEmailMessage($user);
            $user->setPasswordRequestedAt(new \DateTime());
            $this->get('fos_user.user_manager')->updateUser($user);

            /* Dispatch completed event */
            $event = new GetResponseUserEvent($user, $request);
            $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_COMPLETED, $event);

            if (null !== $event->getResponse()) {
                return $event->getResponse();
            }

            $confirmation = $this->renderView('UserBundle:Resetting:check_email.html.twig', [
                'user' => $user,
            ]);

            return new JsonResponse([
                    'message' => 'success',
                    'confirmation' => $confirmation,
                ]
            );
        }

        return $this->render('FOSUserBundle:Resetting:request.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * Reset user password.
     *
     * @param Request $request
     * @param string  $token
     *
     * @return Response
     */
    public function resetAction(Request $request, $token)
    {
        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.resetting.form.factory');
        /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');
        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        /** @var User $user */
        $user = $userManager->findUserByConfirmationToken($token);
        if ($user) {
            $reseller = $this->get('reseller.manager')->getResellerFromRequest($request);
            $userReseller = $user instanceof Reseller ? $user : $user->getReseller();
            if ($reseller !== $userReseller)
                $user = null;
        }

        if (null === $user) {
            throw new NotFoundHttpException(sprintf('The user with "confirmation token" does not exist for value "%s"', $token));
        }

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        $form = $formFactory->createForm();
        $form->setData($user);

        $form->handleRequest($request);

        if ($form->isValid()) {
            $event = new FormEvent($form, $request);
            $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_SUCCESS, $event);

            $userManager->updateUser($user);

            if (null === $response = $event->getResponse()) {
                $url = $this->generateUrl('homepage');
                $response = new RedirectResponse($url);
            }

            $dispatcher->dispatch(
                FOSUserEvents::RESETTING_RESET_COMPLETED,
                new FilterUserResponseEvent($user, $request, $response)
            );

            $session = $this->get('session');
            $session->set('userStateIsChanged', true);

            return $response;
        }

        return $this->render('FOSUserBundle:Resetting:reset.html.twig', [
            'token' => $token,
            'form' => $form->createView(),
        ]);
    }
}
