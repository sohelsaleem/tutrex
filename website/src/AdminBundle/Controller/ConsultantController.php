<?php

namespace AdminBundle\Controller;

use AdminBundle\Form\Type\ConsultantType;
use FOS\UserBundle\Event\GetResponseNullableUserEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\FOSUserEvents;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use UserBundle\Entity\Consultant;
use libphonenumber\PhoneNumber;

/**
 * @Route("/admin")
 */
class ConsultantController extends Controller
{
    /**
     * @Route("/consultants", name="admin_show_consultants", options={"expose"=true})
     */
    public function showConsultantsAction()
    {
        $consultants = $this->getDoctrine()->getManager()->getRepository('UserBundle:Consultant')->findAll();

        return $this->render('AdminBundle::consultants.html.twig', [
            'consultants' => $consultants
        ]);
    }

    /**
     * @Route("/consultants/{id}/get-consultant-form", defaults={"id": "null"}, name="admin_get_consultant_form", options={"expose"=true})
     */
    public function getConsultantFormAction($id)
    {
        if ($id !== 'null') {
            $consultant = $this->getDoctrine()->getManager()->getRepository('UserBundle:Consultant')->find($id);
        } else {
            $consultant = new Consultant();
        }

        $form = $this->createForm(new ConsultantType(), $consultant);

        return new JsonResponse([
            'form' => $this->renderView('AdminBundle::consultantForm.html.twig', [
                'form' => $form->createView()
            ])
        ]);
    }

    /**
     * @Route("/consultants/add", name="admin_add_consultant", options={"expose"=true})
     */
    public function addConsultantAction(Request $request)
    {
        $consultant = new Consultant();

        $form = $this->createForm(new ConsultantType(), $consultant);

        $form->handleRequest($request);
        if ($form->isValid()) {
            $consultant->addRole('ROLE_CONSULTANT');
            $consultant->setRegistrationDate(new \DateTime());
            $consultant->setPlainPassword($this->get('fos_user.util.token_generator')->generateToken());


            $phoneNumber = new PhoneNumber();
            $phoneNumber->setRawInput('+11111');

            $consultant->setPhone($phoneNumber);
            $consultant->setStudentsInClassroom(500);
            $consultant->setMinutesLessonDuration(60 * 24);

            $userManager = $this->get('fos_user.user_manager');

            $userManager->updateUser($consultant);

            $dispatcher = $this->get('event_dispatcher');

            $event = new GetResponseNullableUserEvent($consultant, $request);

            $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_INITIALIZE, $event);

            $event = new GetResponseUserEvent($consultant, $request);
            $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_REQUEST, $event);

            $tokenGenerator = $this->get('fos_user.util.token_generator');
            $consultant->setConfirmationToken($tokenGenerator->generateToken());

            $event = new GetResponseUserEvent($consultant, $request);
            $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_CONFIRM, $event);

            $this->get('fos_user.mailer')->sendResettingEmailMessage($consultant);
            $consultant->setPasswordRequestedAt(new \DateTime());
            $this->get('fos_user.user_manager')->updateUser($consultant);

            $event = new GetResponseUserEvent($consultant, $request);
            $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_COMPLETED, $event);

            return new JsonResponse([
                'status' => 'success',
                'message' => 'The consultant has been added'
            ]);
        }

        return new JsonResponse([
            'status' => 'error',
            'form' => $this->renderView('AdminBundle::consultantForm.html.twig', [
                'form' => $form->createView()
            ])
        ]);
    }

    /**
     * @Route("/consultants/{id}/edit", name="admin_edit_consultant", options={"expose"=true})
     */
    public function editConsultantAction(Request $request, Consultant $consultant)
    {
        $form = $this->createForm(new ConsultantType(), $consultant);

        $form->handleRequest($request);
        if ($form->isValid()) {
            $this->get('user.manager')->persistUser($consultant);

            return new JsonResponse([
                'status' => 'success',
                'message' => 'The consultant has been changed',
            ]);
        }

        return new JsonResponse([
            'status' => 'error',
            'form' => $this->renderView('AdminBundle::consultantForm.html.twig', [
                'form' => $form->createView()
            ])
        ]);
    }

    /**
     * @Route("/consultants/{id}/delete", name="admin_delete_consultant", options={"expose"=true})
     */
    public function deleteConsultantAction(Consultant $consultant)
    {
        $this->get('user.manager')->deleteUser($consultant);

        return new JsonResponse([
            'status' => 'success',
            'message' => 'The consultant has been deleted'
        ]);
    }

    /**
     * @Route("/consultants/{id}/reset-password", name="admin_reset_consultant_password", options={"expose"=true})
     */
    public function resetConsultantPasswordAction(Consultant $consultant, Request $request)
    {
        $user = $consultant;

        /** @var $dispatcher EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        /* Dispatch init event */
        $event = new GetResponseNullableUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_INITIALIZE, $event);

        $ttl = $this->container->getParameter('fos_user.resetting.token_ttl');

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_REQUEST, $event);

        /** @var $tokenGenerator TokenGeneratorInterface */
        $tokenGenerator = $this->get('fos_user.util.token_generator');
        $user->setConfirmationToken($tokenGenerator->generateToken());

        /* Dispatch confirm event */
        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_CONFIRM, $event);

        $this->get('fos_user.mailer')->sendResettingEmailMessage($user);
        $user->setPasswordRequestedAt(new \DateTime());
        $this->get('fos_user.user_manager')->updateUser($user);

        /* Dispatch completed event */
        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_COMPLETED, $event);

        return new JsonResponse([
            'status' => 'success',
            'message' => 'The consultant password reset message has been sent'
        ]);
    }
}