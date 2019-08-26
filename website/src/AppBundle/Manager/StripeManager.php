<?php

namespace AppBundle\Manager;

use Doctrine\ORM\EntityManager;
use PlanBundle\Entity\Plan;
use UserBundle\Entity\User;

class StripeManager
{
    protected $entityManager;
    protected $planRepository;
    protected $stripePublic;
    protected $stripeSecret;

    public function __construct(EntityManager $entityManager, $stripePublic, $stripeSecret)
    {
        $this->entityManager = $entityManager;
        $this->planRepository = $this->entityManager->getRepository('PlanBundle:Plan');
        $this->stripePublic = $stripePublic;
        $this->stripeSecret = $stripeSecret;

        \Stripe\Stripe::setApiKey($stripeSecret);
    }

    /**
     * @param User      $user
     * @param Plan|null $plan
     *
     * @return \Stripe\Customer
     */
    public function createCustomerForUser(User $user, Plan $plan = null)
    {
        $customer = \Stripe\Customer::create([
            "email" => $user->getEmail(),
            "plan" => $plan ? $plan->getStripePlanId() : $user->getPlan()->getStripePlanId(),
        ]);

        $user->setCustomerId($customer->id);

        $subscriptions = $customer->subscriptions;

        if ($subscriptions->total_count == 0) {
            return $customer;
        }

        $subscription = $subscriptions->data[0];

        $user->setSubscriptionId($subscription->id);
        $user->setStripeActive(true);

        return $customer;
    }

    public function updateUserCard(User $user, $stripeToken)
    {
        try {
            $cu = $this->retrieveCustomerFromUser($user);
            $cu->source = $stripeToken;
            $cu->save();

            $last4 = $cu->sources->data[0]->last4;
            $user->setLast4CardCode($last4);

            return $user;
        } catch (\Stripe\Error\Card $e) {
            $body = $e->getJsonBody();
            $err = $body['error'];
            $error = $err['message'];

            return $error;
        }
    }

    public function deleteUserCard(User $user)
    {
        try {
            $cu = $this->retrieveCustomerFromUser($user);
            $cardId = $cu->sources->data[0]->id;
            $cu->sources->retrieve($cardId)->delete();
            $cu->save();

            $user->setLast4CardCode(null);

            return $user;
        } catch (\Stripe\Error\Card $e) {
            $body = $e->getJsonBody();
            $err = $body['error'];
            $error = $err['message'];

            return $error;
        }
    }

    /**
     * @param User   $user
     * @param Plan   $plan
     * @param string $coupon
     */
    public function changeUserPlanTo(User $user, Plan $plan, $coupon = null)
    {
        $customer = $this->retrieveCustomerFromUser($user);
        $subscription = $this->createOrUpdateSubscription($user, $plan, $coupon);

        $user->updatePlan($plan, $subscription->id);

        $this->prorateCustomerNow($customer, $subscription, $plan);
    }

    /**
     * @param User   $user
     * @param Plan   $plan
     * @param string $coupon
     *
     * @return \Stripe\Subscription
     */
    private function createOrUpdateSubscription(User $user, Plan $plan, $coupon)
    {
        $subscription = $this->retrieveSubscriptionFromUser($user, $plan->isApiPlan());
        $customer = $this->retrieveCustomerFromUser($user);

        if (!$subscription)
            return $this->createSubscriptionForCustomer($customer, $plan, $coupon);

        $source = $this->getDefaultSourceFromCustomer($customer);
        $subscription->plan = $plan->getStripePlanId();

        if (!is_null($source))
            $subscription->source = $source;
        if (strlen($coupon))
            $subscription->coupon = $coupon;

        $subscription->save();

        return $subscription;
    }

    private function prorateCustomerNow(\Stripe\Customer $customer, \Stripe\Subscription $subscription, Plan $plan)
    {
        try {
            $invoice = \Stripe\Invoice::create([
                "customer" => $customer->id,
                "subscription" => $subscription->id,
                "description" => "changing plan to '".$plan->getName()."'",
            ]);

            $invoice->pay();

            return true;
        } catch (\Stripe\Error\InvalidRequest $e) {
            return $e->getMessage();
        }
    }

    /**
     * @param \Stripe\Customer $customer
     * @param Plan             $plan
     * @param string           $coupon
     *
     * @return \Stripe\Subscription
     */
    public function createSubscriptionForCustomer(\Stripe\Customer $customer, Plan $plan, $coupon)
    {
        $source = $this->getDefaultSourceFromCustomer($customer);
        $params = [
            "customer" => $customer->id,
            "plan" => $plan->getStripePlanId(),
        ];
        if (strlen($coupon) > 0)
            $params["coupon"] = $coupon;

        if (!is_null($source))
            $params["source"] = $source;

        return \Stripe\Subscription::create($params);
    }

    /**
     * @param User $user
     *
     * @return \Stripe\Customer
     */
    public function retrieveCustomerFromUser(User $user)
    {
        return \Stripe\Customer::retrieve($user->getCustomerId());
    }

    /**
     * @param \Stripe\Customer $customer
     *
     * @return \Stripe\Source|null
     */
    public function getDefaultSourceFromCustomer(\Stripe\Customer $customer)
    {
        if (!$customer->default_source) {
            return null;
        }

        $sourceId = $customer->default_source;

        $sources = $customer->sources->data;


        foreach ($sources as $source) {
            if ($source->id == $sourceId) {
                return $source;
            }
        }

        return null;
    }

    public function cancelUserSubscription(User $user, $atPeriodEnd = true)
    {
        $subscription = $this->retrieveSubscriptionFromUser($user);

        if (is_null($subscription)) {
            return;
        }

        if ($subscription->status === \Stripe\Subscription::STATUS_ACTIVE || $subscription->status === \Stripe\Subscription::STATUS_TRIALING) {
            $subscription->cancel([
                "at_period_end" => $atPeriodEnd,
            ]);

            $user->setStripeActive(false);
            if (!$atPeriodEnd) {
                $user->setSubscriptionId(null);
                $user->setSubscriptionEndsAt(new \DateTime('now'));
            } else {
                $user->setSubscriptionEndsAtMicroseconds($subscription->current_period_end);
            }
        }
    }

    /**
     * @param User $user
     * @param bool $isApiSubscription
     *
     * @return null|\Stripe\Subscription
     */
    public function retrieveSubscriptionFromUser(User $user, $isApiSubscription = false)
    {
        $subscriptionId = $isApiSubscription ? $user->getApiSubscriptionId() : $user->getSubscriptionId();
        if (is_null($subscriptionId))
            return null;

        return \Stripe\Subscription::retrieve($subscriptionId);
    }
}
