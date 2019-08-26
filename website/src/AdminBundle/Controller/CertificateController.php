<?php

namespace AdminBundle\Controller;

use AppBundle\Util\ApacheUtil;
use AppBundle\Util\NodeUtil;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/admin/certificates")
 */
class CertificateController extends Controller
{
    /**
     * @return array
     *
     * @Route(path="/", name="certificate_list")
     *
     * @Template()
     */
    public function certificateListAction()
    {
        $configManager = $this->get('config.manager');

        $config = $configManager->getConfig();

        return [
            'domains' => $config->getDomains(),
            'certificateFailed' => $config->isCertificateFailed(),
        ];
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     *
     * @Route(path="/prepare", name="certificate_prepare", options={"expose"=true})
     */
    public function certificatePrepareAction(Request $request)
    {
        $configManager = $this->get('config.manager');
        $entityManager = $this->get('doctrine.orm.default_entity_manager');
        $certificateUtil = $this->get('certificate.util');

        $domains = \GuzzleHttp\json_decode($request->request->get('domains'));

        $processedDomains = $certificateUtil->getCodesForDnsChallenge($domains);
        $config = $configManager->getConfig();
        $config->setDomains($processedDomains);
        $config->setCertificateFailed(false);
        $entityManager->flush();

        return new JsonResponse([
            'status' => 'success',
            'domains' => $processedDomains,
        ]);
    }

    /**
     * @return JsonResponse
     *
     * @Route(path="/generate", name="certificate_generate", options={"expose"=true})
     */
    public function certificateGenerateAction()
    {
        $certificateUtil = $this->get('certificate.util');
        $configManager = $this->get('config.manager');
        $entityManager = $this->get('doctrine.orm.default_entity_manager');

        $domains = array_map(function ($domain) {
            return $domain['name'];
        }, $configManager->getConfig()->getDomains());

        $error = null;

        try {
            $certificateUtil->generateNewCertificate($domains);
        } catch (\Exception $exception) {
            $error = $exception->getMessage();
        }

        if ($error) {
            $configManager->getConfig()->setCertificateFailed(true);
            $entityManager->flush();

            return new JsonResponse([
                'status' => 'error',
                'output' => $error,
            ]);
        }

        NodeUtil::restart();
        ApacheUtil::restart();

        return new JsonResponse([
            'status' => 'success',
        ]);
    }
}
