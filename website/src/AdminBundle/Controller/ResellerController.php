<?php

namespace AdminBundle\Controller;

use AdminBundle\Form\Type\ResellerType;
use AppBundle\Util\NodeUtil;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Process\Exception\ProcessFailedException;
use UserBundle\Entity\Reseller;
use UserBundle\Entity\User;

/**
 * @Route("/admin/resellers")
 */
class ResellerController extends Controller
{
    /**
     * @return array
     *
     * @Route(path="/", name="reseller_list")
     * @Template()
     */
    public function resellerListAction()
    {
        $resellerManager = $this->get('reseller.manager');

        $resellers = $resellerManager->findAll();

        return [
            'resellers' => $resellers,
        ];
    }

    /**
     * @param Request $request
     *
     * @return array|RedirectResponse
     *
     * @Route(path="/add", name="reseller_add")
     * @Template()
     */
    public function resellerAddAction(Request $request)
    {
        $resellerManager = $this->get('reseller.manager');

        $reseller = new Reseller();
        $resellerForm = $this->createForm(ResellerType::class, $reseller);
        $resellerForm->handleRequest($request);
        if ($resellerForm->isSubmitted() && $resellerForm->isValid()) {
            $resellerManager->addReseller($reseller);

            return $this->redirectToRoute('reseller_list');
        }

        return [
            'form' => $resellerForm->createView(),
        ];
    }

    /**
     * @param Reseller $reseller
     *
     * @return RedirectResponse
     *
     * @Route(path="/{reseller}/delete", name="reseller_delete")
     */
    public function resellerDeleteAction(Reseller $reseller)
    {
        $resellerManager = $this->get('reseller.manager');

        $resellerManager->deleteReseller($reseller);

        return $this->redirectToRoute('reseller_list');
    }

    /**
     * @param Request  $request
     * @param Reseller $reseller
     *
     * @return array|RedirectResponse
     *
     * @Route(path="/{reseller}/edit", name="reseller_edit")
     * @Template()
     */
    public function resellerEditAction(Request $request, Reseller $reseller)
    {
        $entityManager = $this->get('doctrine.orm.entity_manager');

        $oldExternalDomain = $reseller->getExternalDomain();
        $resellerForm = $this->createForm(ResellerType::class, $reseller);
        $resellerForm->handleRequest($request);
        if ($resellerForm->isSubmitted()) {
            if ($reseller->getMaximumUsers() < $reseller->countTeachers())
                $resellerForm->get('maximumUsers')->addError(new FormError('This reseller already has more teacher accounts'));
            if ($reseller->getMaximumPaidUsers() < $reseller->countPaidTeachers())
                $resellerForm->get('maximumPaidUsers')->addError(new FormError('This reseller already has more paid teacher accounts'));
            if ($resellerForm->isValid()) {
                if ($oldExternalDomain !== $reseller->getExternalDomain())
                    $reseller->clearCodeForDnsChallenge();
                if (!$reseller->getExternalDomain())
                    $reseller->setAllowSubdomains(false);
                if (!$reseller->isAllowSubdomains()) {
                    /** @var User $user */
                    foreach ($reseller->getUsers() as $user) {
                        $user->setSubdomain(null);
                    }
                }
                $entityManager->flush();

                return $this->redirectToRoute('reseller_list');
            }
        }

        return [
            'form' => $resellerForm->createView(),
        ];
    }

    /**
     * @param Reseller $reseller
     *
     * @return RedirectResponse
     *
     * @Route(path="/{reseller}/toggle-ban", name="reseller_toggle_ban")
     */
    public function resellerToggleBanAction(Reseller $reseller)
    {
        $resellerManager = $this->get('reseller.manager');

        $resellerManager->toggleBan($reseller);

        return $this->redirectToRoute('reseller_list');
    }
}
