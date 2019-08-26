<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * @Route("/stripe")
 */
class StripeWebhookController extends Controller
{
    /**
     * @Route("/webhook", name="stripe_webhook")
     */
    public function webhookAction(Request $request)
    {
        \Stripe\Stripe::setApiKey($this->container->getParameter('stripe_secret_key'));
        $content = $request->getContent();
        $logger = $this->get('logger');

        if (!empty($content)) {
            $logger->info("webhook received");
            $logger->info($content);

            $event = json_decode($content, true);
            $object = $event['data']['object'];
            $em = $this->getDoctrine()->getManager();

            if ($event['type'] === 'invoice.payment_failed') {
                $logger->info("invoice.payment_failed");

                $customerId = $object['customer'];

                $user = $em->getRepository('UserBundle:User')->findOneBy(['customerId' => $customerId]);

                if ($user) {
                    $this->get('plan.manager')->changePlanToBasic($user);

                    $this->get('user.manager')->persistUser($user);

                    $logger->info("The user subscription is changed to the basic subscription");
                } else {
                    $logger->info("The user is not found");
                }
            }
        }

        return new Response('webhook handled', 200);
    }
}