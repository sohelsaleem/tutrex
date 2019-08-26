<?php

namespace UserBundle\Controller;

use FOS\UserBundle\Event\GetResponseNullableUserEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\FOSUserEvents;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Filesystem\Exception\FileNotFoundException;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\Request;
use UserBundle\Entity\Teacher;
use UserBundle\Entity\User;
use UserBundle\Form\Type\EditEmailType;
use UserBundle\Form\Type\EditLogoType;
use UserBundle\Form\Type\EditNameType;
use Symfony\Component\HttpFoundation\JsonResponse;
use UserBundle\Form\Type\EditPhoneType;
use UserBundle\Form\Type\EditSubdomainType;
use UserBundle\Form\Type\TeacherType;

class UserController extends Controller
{
    /**
     * @Route("/profile", name="user_show_profile")
     */
    public function showProfileAction()
    {
        $user = $this->getUser();
        $filename = $user->getClassroomLogo();
        $user = $this->transformLogoToFile($user);

        $editNameForm = $this->createForm(EditNameType::class, $user);
        $editEmailForm = $this->createForm(EditEmailType::class, $user);
        $editPhoneForm = $this->createForm(EditPhoneType::class, $user);
        $editSubdomainForm = $this->createForm(EditSubdomainType::class, $user);
        $editLogoForm = $this->createForm(EditLogoType::class, $user);
        $subscription = $this->get('stripe.manager')->retrieveSubscriptionFromUser($this->getUser());
        $session = $this->get('session');
        if ($session->get('userStateIsChanged')) {
            $session->set('userStateIsChanged', false);

            $uniqueIdForNewUserState = uniqid();

            return $this->render('UserBundle:User:profile.html.twig', [
                'user' => $user,
                'userLogo' => $filename,
                'editNameForm' => $editNameForm->createView(),
                'editEmailForm' => $editEmailForm->createView(),
                'editPhoneForm' => $editPhoneForm->createView(),
                'editSubdomainForm' => $editSubdomainForm->createView(),
                'editLogoForm' => $editLogoForm->createView(),
                'subscription' => $subscription,
                'uniqueIdForNewUserState' => $uniqueIdForNewUserState,
            ]);
        }

        return $this->render('UserBundle:User:profile.html.twig', [
            'user' => $user,
            'userLogo' => $filename,
            'subscription' => $subscription,
            'editNameForm' => $editNameForm->createView(),
            'editEmailForm' => $editEmailForm->createView(),
            'editPhoneForm' => $editPhoneForm->createView(),
            'editSubdomainForm' => $editSubdomainForm->createView(),
            'editLogoForm' => $editLogoForm->createView(),
        ]);
    }

    /**
     * @Route("/{id}/get-edit-name-form", name="user_get_edit_name_form_ajax", options={"expose"=true})
     */
    public function getEditNameFormAction(User $user)
    {
        $form = $this->createForm(new EditNameType(), $user);

        return new JsonResponse([
            'form' => $this->renderView(
                'UserBundle:User:editName.html.twig', [
                    'editNameForm' => $form->createView(),
                    'user' => $user
                ]
            )
        ]);
    }

    /**
     * @Route("/{id}/get-edit-email-form", name="user_get_edit_email_form_ajax", options={"expose"=true})
     */
    public function getEditEmailFormAction(User $user)
    {
        $form = $this->createForm(new EditEmailType(), $user);

        return new JsonResponse([
            'form' => $this->renderView(
                'UserBundle:User:editEmail.html.twig', [
                    'editEmailForm' => $form->createView(),
                    'user' => $user
                ]
            )
        ]);
    }

    /**
     * @Route("/{id}/get-edit-phone-form", name="user_get_edit_phone_form_ajax", options={"expose"=true})
     */
    public function getEditPhoneFormAction(User $user)
    {
        $form = $this->createForm(new EditPhoneType(), $user);

        return new JsonResponse([
            'form' => $this->renderView(
                'UserBundle:User:editPhone.html.twig', [
                    'editPhoneForm' => $form->createView(),
                    'user' => $user
                ]
            )
        ]);
    }

    /**
     * @param User $user
     *
     * @return JsonResponse
     *
     * @Route(path="/{id}/get-edit-subdomain-form", name="user_get_edit_subdomain_form_ajax", options={"expose"=true})
     */
    public function getEditSubdomainFormAction(User $user)
    {
        $form = $this->createForm(EditSubdomainType::class, $user);

        return new JsonResponse([
            'form' => $this->renderView('UserBundle:User:editSubdomain.html.twig', [
                'editSubdomainForm' => $form->createView(),
                'user' => $user,
            ]),
        ]);
    }

    /**
     * @Route("/{id}/edit-user-name-ajax", name="user_edit_name_ajax", options={"expose"=true})
     */
    public function editNameAction(User $user, Request $request)
    {
        $userName = $user->getName();

        $form = $this->createForm(new EditNameType(), $user);

        $form->handleRequest($request);

        if ($form->isValid() && $request->isXmlHttpRequest()) {
            $userManager = $this->get('fos_user.user_manager');
            $userManager->updateUser($user);

            return new JsonResponse([
                'message' => 'valid',
                'form' => $this->renderView(
                    'UserBundle:User:editName.html.twig', [
                        'editNameForm' => $form->createView(),
                        'user' => $user
                    ]
                )
            ]);
        }

        $user->setName($userName);

        return new JsonResponse([
            'message' => 'invalid',
            'form' => $this->renderView(
                'UserBundle:User:editName.html.twig', [
                    'editNameForm' => $form->createView(),
                    'user' => $user
                ]
            )
        ]);
    }

    /**
     * @Route("/{id}/edit-user-email-ajax", name="user_edit_email_ajax", options={"expose"=true})
     */
    public function editEmailAction(User $user, Request $request)
    {
        $userEmail = $user->getEmail();

        $form = $this->createForm(new EditEmailType(), $user);

        $form->handleRequest($request);

        if ($form->isValid() && $request->isXmlHttpRequest()) {
            $userManager = $this->get('fos_user.user_manager');
            $userManager->updateUser($user);

            return new JsonResponse([
                'message' => 'valid',
                'form' => $this->renderView(
                    'UserBundle:User:editEmail.html.twig', [
                        'editEmailForm' => $form->createView(),
                        'user' => $user
                    ]
                )
            ]);
        }

        $user->setEmail($userEmail);

        return new JsonResponse([
            'message' => 'invalid',
            'form' => $this->renderView(
                'UserBundle:User:editEmail.html.twig', [
                    'editEmailForm' => $form->createView(),
                    'user' => $user
                ]
            )
        ]);
    }

    /**
     * @Route("/{id}/edit-user-phone-ajax", name="user_edit_phone_ajax", options={"expose"=true})
     */
    public function editPhoneAction(User $user, Request $request)
    {
        $userName = $user->getName();

        $form = $this->createForm(new EditPhoneType(), $user);

        $form->handleRequest($request);

        if ($form->get('phone')->isValid()) {
            $this->get('phone_number_validator.util')->validatePhoneNumberLength($form->get('phone'));
        }

        if ($form->isValid() && $request->isXmlHttpRequest()) {
            $userManager = $this->get('fos_user.user_manager');
            $userManager->updateUser($user);

            return new JsonResponse([
                'message' => 'valid',
                'form' => $this->renderView(
                    'UserBundle:User:editPhone.html.twig', [
                        'editPhoneForm' => $form->createView(),
                        'user' => $user
                    ]
                )
            ]);
        }

        $user->setName($userName);

        return new JsonResponse([
            'message' => 'invalid',
            'form' => $this->renderView(
                'UserBundle:User:editPhone.html.twig', [
                    'editPhoneForm' => $form->createView(),
                    'user' => $user
                ]
            )
        ]);
    }

    /**
     * @param User    $user
     * @param Request $request
     *
     * @return JsonResponse
     *
     * @Route(path="/{id}/edit-user-subdomain-ajax", name="user_edit_subdomain_ajax", options={"expose"=true})
     */
    public function editSubdomainAction(User $user, Request $request)
    {
        $subdomain = $user->getSubdomain();

        $form = $this->createForm(EditSubdomainType::class, $user);

        $form->handleRequest($request);
        $message = 'invalid';
        if ($form->isValid() && $request->isXmlHttpRequest()) {
            $userManager = $this->get('fos_user.user_manager');
            $userManager->updateUser($user);
            $message = 'valid';
        } else {
            $user->setSubdomain($subdomain);
        }

        return new JsonResponse([
            'message' => $message,
            'form' => $this->renderView('UserBundle:User:editSubdomain.html.twig', [
                'editSubdomainForm' => $form->createView(),
                'user' => $user,
            ]),
        ]);
    }

    /**
     * @Route("/{id}/edit-user-logo-ajax", name="user_edit_logo_ajax", options={"expose"=true})
     */
    public function editLogoAction(User $user, Request $request)
    {
        $logoFilename = $user->getClassroomLogo();
        $user = $this->transformLogoToFile($user);
        $classroomLogo = $user->getClassroomLogo();

        $form = $this->createForm(new EditLogoType(), $user);

        $form->handleRequest($request);

        if ($form->isValid() && $request->isXmlHttpRequest()) {
            $userManager = $this->get('fos_user.user_manager');
            $userManager->updateUser($user);
            if ($classroomLogo) {
                $this->deleteLogo($classroomLogo);
            }

            return new JsonResponse([
                'message' => 'valid',
                'form' => $this->renderView(
                    'UserBundle:User:editLogo.html.twig', [
                        'editLogoForm' => $form->createView(),
                        'user' => $user,
                        'userLogo' => $user->getClassroomLogo()
                    ]
                )
            ]);
        }

        $user->setClassroomLogo($classroomLogo);

        return new JsonResponse([
            'message' => 'invalid',
            'form' => $this->renderView(
                'UserBundle:User:editLogo.html.twig', [
                    'editLogoForm' => $form->createView(),
                    'user' => $user,
                    'userLogo' => $logoFilename
                ]
            )
        ]);
    }

    /**
     * @Route("/{id}/delete-user-logo-ajax", name="user_delete_logo_ajax", options={"expose"=true})
     */
    public function deleteLogoAction(User $user)
    {
        $user = $this->transformLogoToFile($user);
        $classroomLogo = $user->getClassroomLogo();
        if ($classroomLogo) {
            $this->deleteLogo($classroomLogo);
        }
        $user->setClassroomLogo(null);
        $userManager = $this->get('fos_user.user_manager');
        $userManager->updateUser($user);

        $form = $this->createForm(new EditLogoType(), $user);


        return new JsonResponse([
            'message' => 'valid',
            'form' => $this->renderView(
                'UserBundle:User:editLogo.html.twig', [
                    'editLogoForm' => $form->createView(),
                    'user' => $user,
                    'userLogo' => ''
                ]
            )
        ]);
    }

    /**
     * @Route("/teachers", name="user_show_teachers")
     */
    public function showTeachersAction()
    {
        $form = $this->createForm(new TeacherType());

        return $this->render('UserBundle:User:teachers.html.twig', [
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route("/teachers/add-teacher-ajax", name="user_add_teacher_ajax", options={"expose"=true})
     */
    public function addTeacherAction(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();

        if ($this->isGranted('ROLE_TEACHER') && $user) {
            $teacher = new Teacher();
            $teacher->setUser($user);
            $teacher->setReseller($user->getReseller());

            $form = $this->createForm(TeacherType::class, $teacher);

            $form->handleRequest($request);
            if ($form->isValid()) {
                $teacher->addRole('ROLE_SUB_TEACHER');
                $teacher->setRegistrationDate(new \DateTime());
                $teacher->setStudentsInClassroom($user->getStudentsInClassroom());
                $teacher->setMinutesLessonDuration($user->getMinutesLessonDuration());

                $tokenGenerator = $this->get('fos_user.util.token_generator');
                $password = $tokenGenerator->generateToken();

                $teacher->setPlainPassword($password);

                $userManager = $this->get('fos_user.user_manager');

                $userManager->updateUser($teacher);

                $dispatcher = $this->get('event_dispatcher');

                $event = new GetResponseNullableUserEvent($teacher, $request);

                $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_INITIALIZE, $event);

                if (null !== $event->getResponse()) {
                    return $event->getResponse();
                }

                $ttl = $this->container->getParameter('fos_user.resetting.token_ttl');

                if (null !== $teacher && !$teacher->isPasswordRequestNonExpired($ttl)) {
                    $event = new GetResponseUserEvent($teacher, $request);
                    $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_REQUEST, $event);

                    if (null !== $event->getResponse()) {
                        return $event->getResponse();
                    }

                    if (null === $teacher->getConfirmationToken()) {
                        $tokenGenerator = $this->get('fos_user.util.token_generator');
                        $teacher->setConfirmationToken($tokenGenerator->generateToken());
                    }

                    $event = new GetResponseUserEvent($teacher, $request);
                    $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_CONFIRM, $event);

                    if (null !== $event->getResponse()) {
                        return $event->getResponse();
                    }

                    $this->get('fos_user.mailer')->sendResettingEmailMessage($teacher);
                    $teacher->setPasswordRequestedAt(new \DateTime());
                    $this->get('fos_user.user_manager')->updateUser($teacher);

                    $event = new GetResponseUserEvent($teacher, $request);
                    $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_COMPLETED, $event);

                    if (null !== $event->getResponse()) {
                        return $event->getResponse();
                    }
                }

                return new JsonResponse([
                    'status' => 'success',
                    'message' => 'The teacher has been added',
                    'teachersTable' => $this->renderView('UserBundle:User:teachersTable.html.twig', [
                        'teachers' => $user->getTeachers()
                    ])
                ]);
            }

            return new JsonResponse([
                'status' => 'error',
                'form' => $this->renderView('UserBundle:User:addTeacher.html.twig', [
                    'form' => $form->createView()
                ])
            ]);
        }

        return new JsonResponse([
            'status' => 'denied'
        ]);
    }

    /**
     * @Route("/get-add-teacher-form", name="user_get_add_teacher-form", options={"expose"=true})
     */
    public function getAddTeacherFormAction()
    {
        $form = $this->createForm(new TeacherType());

        return new JsonResponse([
            'form' => $this->renderView('UserBundle:User:addTeacher.html.twig', [
                'form' => $form->createView()
            ])
        ]);
    }

    /**
     * @Route("/get-delete-teacher-form", name="user_get_delete_teacher_form", options={"expose"=true})
     */
    public function getDeleteTeacherFormAction()
    {
        return new JsonResponse([
            'form' => $this->renderView('UserBundle:User:deleteTeacherForm.html.twig')
        ]);
    }

    /**
     * @Route("/teachers/{id}/delete", name="user_delete_teacher", options={"expose"=true})
     */
    public function deleteTeacherAction(Teacher $teacher)
    {
        $this->get('user.manager')->deleteUser($teacher);

        $user = $this->getUser();

        return new JsonResponse([
            'status' => 'success',
            'message' => 'The teacher has been deleted',
            'teachersTable' => $this->renderView('UserBundle:User:teachersTable.html.twig', [
                'teachers' => $user->getTeachers()
            ])
        ]);
    }

    /**
     * @Route("/teachers/{id}/get-edit-teacher-form", name="user_get_edit_teacher_form", options={"expose"=true})
     */
    public function getEditTeacherFormAction(Teacher $teacher)
    {
        $form = $this->createForm(new TeacherType(), $teacher);

        return new JsonResponse([
            'form' => $this->renderView('UserBundle:User:editTeacher.html.twig', [
                'form' => $form->createView(),
                'teacher' => $teacher
            ])
        ]);
    }

    /**
     * @Route("/teachers/{id}/edit", name="user_edit_teacher", options={"expose"=true})
     */
    public function editTeacherAction(Teacher $teacher, Request $request)
    {
        $form = $this->createForm(new TeacherType(), $teacher);

        $form->handleRequest($request);
        if ($request->isXmlHttpRequest() && $form->isValid()) {
            $this->get('user.manager')->persistUser($teacher);

            $user = $this->getUser();

            return new JsonResponse([
                'status' => 'success',
                'message' => 'The teacher has been changed',
                'teachersTable' => $this->renderView('UserBundle:User:teachersTable.html.twig', [
                    'teachers' => $user->getTeachers()
                ])
            ]);
        }

        return new JsonResponse([
            'status' => 'error',
            'form' => $this->renderView('UserBundle:User:editTeacher.html.twig', [
                'form' => $form->createView()
            ])
        ]);
    }

    private function transformLogoToFile(User $user)
    {
        if ($filename = $user->getClassroomLogo()) {
            $fs = new FileSystem();
            $path = $this->getParameter('logo_directory').'/'.$filename;
            $logo = $fs->exists($path) ? new File($path) : null;
            $user->setClassroomLogo($logo);
        }

        return $user;
    }

    private function deleteLogo(File $logo)
    {
        $fs = new Filesystem();
        $path = $logo->getPath().'/'.$logo->getFilename();
        if ($fs->exists($path))
            $fs->remove($path);
    }
}