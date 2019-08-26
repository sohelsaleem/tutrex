<?php

namespace UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;

class SubscriptionController extends Controller
{
    /**
     * @Route("/subscriptions", name="user_show_subscriptions")
     */
    public function showSubscriptionsAction(Reseller $reseller = null)
    {
        $planManager = $this->get('plan.manager');
        $stripeManager = $this->get('stripe.manager');
        $entityManager = $this->get('doctrine.orm.default_entity_manager');

        $plans = $planManager->findAllWebsitePlans();
        if ($reseller)
            $plans = [$plans[0], $plans[2]];

        $apiPlans = $planManager->findAllApiPlans();

        /** @var User $user */
        $user = $this->getUser();
        $subscription = $stripeManager->retrieveSubscriptionFromUser($user);
        $apiSubscription = $stripeManager->retrieveSubscriptionFromUser($user, true);

        if (!$user->getApiKey()) {
            $user->setApiKey(md5(uniqid()));
            $entityManager->flush();
        }

        return $this->render('UserBundle:Subscription:subscriptions.html.twig', [
            'plans' => $plans,
            'stripe_public_key' => $this->getParameter('stripe_public_key'),
            'subscription' => $subscription,
            'apiSubscription' => $apiSubscription,
            'apiPlans' => $apiPlans,
        ]);
    }

    /**
     * @Route("/{id}/change-user-card-ajax", name="user_change_card_ajax", options={"expose"=true})
     */
    public function changeCardAction(Request $request)
    {
        $user = $this->getUser();

        $stripeManager = $this->get('stripe.manager');
        $result = $stripeManager->updateUserCard($user, $request->request->get("stripeToken"));


        if ($result instanceof User) {
            $message = 'success';

            $this->get('user.manager')->persistUser($result);
        } else {
            $message = 'fail';
        }

        return new JsonResponse([
            'message' => $message,
            'result' => $result,
            'cardBlock' => $this->renderView('UserBundle:Subscription:creditCardBlock.html.twig'),
        ]);
    }

    /**
     * @Route("/delete-card-ajax", name="user_delete_card_ajax", options={"expose"=true})
     */
    public function deleteCardAction()
    {
        $stripeManager = $this->get('stripe.manager');
        $result = $stripeManager->deleteUserCard($this->getUser());


        if ($result instanceof User) {
            $message = 'success';

            $this->get('user.manager')->persistUser($result);
        } else {
            $message = 'fail';
        }

        return new JsonResponse([
            'message' => $message,
            'result' => $result,
            'cardBlock' => $this->renderView('UserBundle:Subscription:creditCardBlock.html.twig'),
        ]);
    }

    /**
     * @Route("/subscription/cancelnow", name="user_subscription_cancel_now")
     */
    public function cancelNowSubscription()
    {
        $user = $this->getUser();

        $this->get('stripe.manager')->cancelUserSubscription($user, false);

        $this->get('user.manager')->persistUser($user);

        //$this->get('session')->getFlashBag()->set('success', 'Subscription has been cancelled!');
        //return $this->redirectToRoute('company_show_subscription');
    }

    /**
     * @Route("/get-edit-card-form-ajax", name="user_get_edit_card_from_ajax", options={"expose"=true})
     */
    public function getEditCardForm()
    {
        return new JsonResponse([
            'form' => $this->renderView('UserBundle:Subscription:editCard.html.twig'),
        ]);
    }

    /**
     * @Route("/pre-change-plan-ajax", name="user_pre_change_plan", options={"expose"=true})
     */
    public function preChangePlanAction(Request $request)
    {
        $planManager = $this->get('plan.manager');

        /** @var User $user */
        $user = $this->getUser();
        $stripePlanId = $request->request->get('stripe_plan_id');

        $preChangeData = $planManager->getPreChangePlanData($stripePlanId, $user);

        return new JsonResponse([
            'changePlanModal' => $this->renderView('UserBundle:Subscription:changePlanModal.html.twig', $preChangeData),
        ]);
    }

    /**
     * @Route("/change-plan-ajax", name="user_change_plan", options={"expose"=true})
     */
    public function changePlanAction(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        $planManager = $this->get('plan.manager');

        $plan = $planManager->findOnePlanBy([
            "stripePlanId" => $request->request->get('stripe_plan_id'),
        ]);

        if ($user->isOnPlan($plan))
            return new JsonResponse([
                'status' => 'error',
                'message' => 'This is your current plan',
            ]);

        $stripeManager = $this->get('stripe.manager');
        $userManager = $this->get('user.manager');
        $coupon = $request->get('coupon');

        try {
            $stripeManager->changeUserPlanTo($user, $plan, $coupon);
            $user = $planManager->postChangingPlanActions($user, $plan);

            $userManager->persistUser($user);

            $subscription = $stripeManager->retrieveSubscriptionFromUser($user);
            $apiSubscription = $stripeManager->retrieveSubscriptionFromUser($user, true);

            return new JsonResponse([
                'status' => 'success',
                'message' => 'Your plan has been changed',
                'userSubscriptionInfo' => $this->renderView('UserBundle:Subscription:userSubscriptionInfo.html.twig', [
                    'subscription' => $subscription,
                    'apiSubscription' => $apiSubscription,
                ]),
            ]);

        } catch (\Stripe\Error\InvalidRequest $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => $e->getMessage(),
            ]);
        } catch (\Stripe\Error\Card $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * @Route("/get-plan-by-teachers-and-students", name="user_get_plan_by_teachers_and_students", options={"expose"=true})
     */
    public function getPlanByTeachersAndStudentsAction(Request $request)
    {
        $numberOfStudents = $request->request->get('numberOfStudents');
        $numberOfTeachers = $request->request->get('numberOfTeachers');
        $planName = $request->request->get('planName');
        $period = $request->request->get('period');

        if (!$numberOfTeachers) {
            $numberOfTeachers = 1;
        }

        $planManager = $this->get('plan.manager');

        $plan = $planManager->findOnePlanBy([
            "stripePlanId" => $planName.ucfirst($period).'_'.$numberOfStudents.'_'.$numberOfTeachers,
        ]);

        return new JsonResponse([
            'planPrice' => $plan->getPrice() / 100,
            'stripePlanId' => $plan->getStripePlanId(),
            'period' => $plan->getPeriod() == 'month' ? 'mo' : 'y',
        ]);
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     *
     * @Route(path="/subscription-contact-us", name="subscription_contact_us", options={"expose"=true})
     */
    public function contactUsAction(Request $request)
    {
        $message = $request->request->get('message', '');

        $mailer = $this->get('fos_user.mailer');

        /** @var User $user */
        $user = $this->getUser();
        $subject = 'Change plan to Enterprise';
        if (!$user->getPlan()->isFreePlan())
            $subject = 'Change plan to Basic';
        $mailer->sendContactUsEmail($user, $subject, $message);

        return new JsonResponse([]);
    }
}
