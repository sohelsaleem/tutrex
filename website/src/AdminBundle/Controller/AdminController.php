<?php

namespace AdminBundle\Controller;

use AdminBundle\Form\Type\CapabilitiesEditFormType;
use AdminBundle\Form\Type\CustomizationType;
use AdminBundle\Form\Type\ProfileEditFormType;
use AdminBundle\Form\Type\UserFilterType;
use PlanBundle\Entity\Plan;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\User;
use UserBundle\Exception\ExceededPaidTeachersException;

/**
 * @Route("/admin")
 */
class AdminController extends Controller
{
    /**
     * @param Reseller|null $reseller
     *
     * @return Response
     *
     * @Route("/teachers", name="admin_show_teachers", options={"expose"=true})
     */
    public function showTeachersAction(Reseller $reseller = null)
    {
        $users = $this->get('user.manager')->getIndividualTeachers($reseller);

        $userFilterForm = $this->createForm(new UserFilterType());

        $session = $this->get('session');
        if ($session->get('userStateIsChanged')) {
            $session->set('userStateIsChanged', false);

            $uniqueIdForNewUserState = uniqid();

            return $this->render('AdminBundle::teachers.html.twig', [
                'teachers' => $users,
                'userFilterForm' => $userFilterForm->createView(),
                'uniqueIdForNewUserState' => $uniqueIdForNewUserState,
            ]);
        }

        return $this->render('AdminBundle::teachers.html.twig', [
            'teachers' => $users,
            'userFilterForm' => $userFilterForm->createView(),
        ]);
    }

    /**
     * @Route("/teachers/{id}/delete", name="admin_delete_teacher", options={"expose"=true})
     */
    public function deleteTeacherAction(User $masterTeacher)
    {
        $this->get('user.manager')->deleteUser($masterTeacher);

        return new JsonResponse([
            'status' => 'success',
            'message' => 'The teacher has been deleted',
        ]);
    }

    /**
     * @Route("/teachers/{id}/capabilities", name="admin_show_teacher_capabilities")
     */
    public function showTeacherCapabilities(User $teacher, Reseller $reseller = null)
    {
        $form = $this->createForm(new CapabilitiesEditFormType(), null, [
            'showApiCapabilities' => !$reseller || $reseller->isApiEnabled(),
        ]);
        $profileForm = $this->createForm(new ProfileEditFormType());
        $subscription = $this->get('stripe.manager')->retrieveSubscriptionFromUser($teacher);

        return $this->render('AdminBundle::capabilities.html.twig', [
            'teacher' => $teacher,
            'subscription' => $subscription,
            'capabilitiesEditForm' => $form->createView(),
            'teacherProfileEditForm' => $profileForm->createView(),
            'apiPlans' => $this->get('plan.manager')->findAllApiPlans(),
        ]);
    }

    /**
     * @Route("/ajax-teacher-filter", name="admin_get_filtered_teachers",  options={"expose"=true})
     */
    public function getFilteredStaffAjaxAction(Request $request, Reseller $reseller = null)
    {
        $name = $request->request->get('name');

        $teachers = $this->get('user.manager')->getFilteredTeachers($name, $reseller);

        return new JsonResponse([
            'teachers' => $this->renderView('AdminBundle::teachersTable.html.twig', [
                'teachers' => $teachers,
            ]),
        ]);
    }

    /**
     * @Route("/ajax-ban-user", name="admin_ban_user", options={"expose"=true})
     */
    public function banUserAction(Request $request)
    {
        $userManager = $this->get('user.manager');

        $message = $request->request->get('message');
        $userId = $request->request->get('userId');

        if ($message == 'banned') {
            $userManager->unbanUser($userId);
        } else {
            $userManager->banUser($userId);
        }

        return new JsonResponse(['success' => 'success']);
    }

    /**
     * @param Request $request
     * @param User    $teacher
     *
     * @return JsonResponse
     *
     * @Route("/teachers/{id}/ajax-save-capabilities", name="admin_save_capabilities", options={"expose"=true})
     */
    public function saveCapabilities(Request $request, User $teacher, Reseller $reseller = null)
    {
        $form = $this->createForm(CapabilitiesEditFormType::class, $teacher, [
            'showApiCapabilities' => !$reseller || $reseller->isApiEnabled(),
        ]);

        $form->handleRequest($request);

        $studentsInClassroom = $form->get('studentsInClassroom')->getData();
        $minutesLessonDuration = $form->get('minutesLessonDuration')->getData();
        $numberOfTeachers = $form->get('numberOfTeachers')->getData();
        $storageLimit = $form->get('storageLimit')->getData();
        $planStudentsInClassroom = $teacher->getPlan()->getStudentsInClassroom();
        $planMinutesLessonDuration = $teacher->getPlan()->getMinutesLessonDuration();
        $planNumberOfTeachers = $teacher->getPlan()->getNumberOfTeachers();
        $planStorageLimit = $teacher->getPlanStorageLimit();

        if ($studentsInClassroom < $planStudentsInClassroom[0])
            $form->get('studentsInClassroom')->addError(new FormError('Students in classroom cannot be less than '.$planStudentsInClassroom[0]));
        if ($minutesLessonDuration < $planMinutesLessonDuration)
            $form->get('minutesLessonDuration')->addError(new FormError('Minutes lesson duration cannot be less than '.$planMinutesLessonDuration));
        if ($numberOfTeachers < $planNumberOfTeachers[0])
            $form->get('numberOfTeachers')->addError(new FormError('Number of teachers cannot be less than '.$planNumberOfTeachers[0]));
        if ($planStorageLimit && $planStorageLimit > $storageLimit * 1024 * 1024 * 1024)
            $form->get('storageLimit')->addError(new FormError('Storage limit cannot be less than '.$this->humanFilesize($planStorageLimit)));

        if ($form->isValid()) {
            $teacher->setStorageLimit($storageLimit ?: null);

            $this->get('user.manager')->updateUser();
        }

        return new JsonResponse([
            'success' => $form->isValid(),
            'form' => $this->renderView(
                'AdminBundle::capabilitiesEditForm.html.twig', [
                    'capabilitiesEditForm' => $form->createView(),
                    'teacher' => $teacher,
                ]
            ),
        ]);
    }

    private function humanFilesize($bytes, $decimals = 1)
    {
        $size = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        $factor = floor((strlen($bytes) - 1) / 3);

        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)).@$size[$factor];
    }

    /**
     * @Route("/consultants", name="admin_show_consultants", options={"expose"=true})
     */
    public function showConsultantsAction()
    {
        return $this->render('AdminBundle::consultants.html.twig', [
            'consultants' => null,
        ]);
    }


    /**
     * @param Request $request
     * @param User    $teacher
     *
     * @return JsonResponse
     *
     * @Route("/teachers/{id}/ajax-save-profile", name="admin_save_teacher_profile", options={"expose"=true})
     */
    public function saveProfile(Request $request, User $teacher)
    {
        $form = $this->createForm(ProfileEditFormType::class, $teacher);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $this->get('user.manager')->updateUser();

            return new JsonResponse([
                'success' => true,
            ]);
        }

        return new JsonResponse([
            'success' => false,
            'form' => $this->renderView(
                'AdminBundle::teacherProfileEditForm.html.twig', [
                    'teacherProfileEditForm' => $form->createView(),
                    'teacher' => $teacher,
                ]
            ),
        ]);
    }

    /**
     * @param Request       $request
     * @param Reseller|null $reseller
     *
     * @return array
     *
     * @Route(path="/customization", name="admin_customization")
     *
     * @Template()
     */
    public function customizationAction(Request $request, Reseller $reseller = null)
    {
        $configManager = $this->get('config.manager');
        $entityManager = $this->get('doctrine.orm.entity_manager');

        $config = $configManager->getConfig();
        $formData = $config;
        if ($reseller) {
            $formData = $reseller;
        }
        $form = $this->createForm(CustomizationType::class, $formData);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();
        }

        return [
            'form' => $form->createView(),
            'logo' => $formData->getLogo(),
            'landingImage' => $formData->getLandingImage(),
            'landingImageBottom' => $formData->getLandingImageBottom(),
        ];
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     *
     * @Route(path="/customization/upload", name="admin_customization_upload_image", options={"expose"=true})
     */
    public function uploadImageAction(Request $request)
    {
        /**
         * @var UploadedFile $file
         */
        $file = $request->files->get('file');
        $type = $request->request->get('type');
        $fileName = substr(md5(uniqid(rand(), 1)), 0, 10).'.'.$file->guessExtension();
        $filePath = $this->getParameter('landing_image_directory');
        if ('logo' === $type)
            $filePath = $this->getParameter('admin_logo_directory');
        $fs = new Filesystem();
        if (!$fs->exists($filePath)) {
            $fs->mkdir($filePath);
        }
        $file->move($filePath, $fileName);

        return new JsonResponse([
            'file' => '/'.$filePath.'/'.$fileName,
        ]);
    }

    /**
     * @param User $user
     *
     * @return RedirectResponse
     *
     * @Route(path="/teachers/{id}/switch-plan", name="admin_switch_teacher_plan")
     */
    public function switchTeacherPlanAction(User $user)
    {
        $planManager = $this->get('plan.manager');

        try {
            $planManager->switchTeacherPlan($user);
        } catch (ExceededPaidTeachersException $exception) {
            $this->addFlash('error', $exception->getMessage());
        }

        return $this->redirectToRoute('admin_show_teacher_capabilities', [
            'id' => $user->getId(),
        ]);
    }

    /**
     * @param User $user
     * @param Plan $plan
     *
     * @return JsonResponse
     *
     * @Route(path="/teachers/{user}/change-plan/{plan}", name="admin_change_teacher_plan", options={"expose"=true})
     */
    public function changeTeacherPlanAction(User $user, Plan $plan)
    {
        $planManager = $this->get('plan.manager');

        try {
            $planManager->changeTeacherPlan($user, $plan);
        } catch (ExceededPaidTeachersException $exception) {
            return new JsonResponse([
                'status' => 'error',
                'message' => $exception->getMessage(),
            ]);
        }

        return new JsonResponse([
            'status' => 'success',
        ]);
    }

    /**
     * @param User $user
     *
     * @return RedirectResponse
     *
     * @Route(path="/teachers/{id}/enable", name="admin_enable_teacher")
     */
    public function enableUserAction(User $user)
    {
        $entityManager = $this->get('doctrine.orm.default_entity_manager');

        $user->setEnabled(true);
        $entityManager->flush();

        return $this->redirectToRoute('admin_show_teachers');
    }
}
