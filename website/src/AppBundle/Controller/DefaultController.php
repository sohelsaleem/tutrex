<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\User;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage", options={"expose"=true})
     */
    public function indexAction()
    {
        $planManager = $this->get('plan.manager');

        if ($this->isGranted('ROLE_ADMIN') || $this->isGranted('ROLE_RESELLER')) {
            return $this->redirectToRoute('admin_show_teachers', [], 307);
        }
        if ($this->isGranted('ROLE_CONSULTANT')) {
            return $this->redirectToRoute('lesson_consultant_lesson_start', [], 307);
        }
        if ($this->isGranted('ROLE_USER')) {
            return $this->redirectToRoute('app_lesson_show_lessons', [], 307);
        }

        $plans = $planManager->findAllWebsitePlans();
        $apiPlans = $planManager->findAllApiPlans();

        $templateParams = [
            'plans' => $plans,
            'apiPlans' => $apiPlans,
        ];

        $session = $this->get('session');
        if ($session->get('userStateIsChanged')) {
            $session->set('userStateIsChanged', false);

            $uniqueIdForNewUserState = uniqid();

            $templateParams['uniqueIdForNewUserState'] = $uniqueIdForNewUserState;
        }

        return $this->render('AppBundle:Default:landing.html.twig', $templateParams);
    }

    /**
     * @Route("/privacy-policy", name="app_show_privacy_policy")
     */
    public function showPrivacyPolicyAction()
    {
        return $this->render('AppBundle:Default:privacyPolicy.html.twig');
    }

    /**
     * @Route("/download-browser", name="download_browser", options={"expose"=true})
     * @Template(template="@App/Default/downloadBrowser.html.twig")
     */
    public function downloadBrowserAction(Request $request)
    {
        return [];
    }

    /**
     * @Route("/set-timezone", name="app_set_timezone", options={"expose"=true})
     */
    public function setTimezoneAction(Request $request)
    {
        $timezoneName = $request->request->get('timezoneName');

        $session = $this->get('session');
        $session->set('timezoneName', $timezoneName);

        return new JsonResponse(['success' => true]);
    }

    /**
     * @Route("/get-user-timezone", name="app_get_user_timezone", options={"expose"=true})
     */
    public function getTimeZoneAction()
    {
        return $this->render('AppBundle:Default:timezone.html.twig');
    }

    /**
     * @param Reseller|null $reseller
     * @param User|null     $subdomainUser
     *
     * @return array|RedirectResponse
     *
     * @Route(path="/temporary-problems", name="temporary_problems")
     * @Template()
     */
    public function temporaryProblemsAction(User $subdomainUser = null, Reseller $reseller = null)
    {
        if ($reseller && $reseller->getBanned() || $subdomainUser && $subdomainUser->getBanned())
            return [];

        return $this->redirectToRoute('homepage');
    }

    /**
     * @return array
     *
     * @Route(path="/developer-api", name="developer_api")
     * @Template()
     */
    public function apiDocumentationAction()
    {
        return [];
    }
}
