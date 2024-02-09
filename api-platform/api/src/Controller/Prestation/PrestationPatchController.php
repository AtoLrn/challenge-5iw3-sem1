<?php

namespace App\Controller\Prestation;

use App\Entity\Prestation;
use App\Enum\Kind;
use App\Repository\PrestationRepository;
use App\Utils\Files;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

#[AsController]
class PrestationPatchController
{
    public function __construct(
        protected Security $security,
        private PrestationRepository $prestationRepository
    ) {
    }

    public function __invoke(Request $request, int $id): Prestation
    {
        $prestation = $this->prestationRepository->find($id);
        if (!$prestation) {
            throw new NotFoundHttpException('Prestation not found');
        }

        $data = json_decode($request->getContent(), true);

        $prestation->setName($data['name']);
        $prestation->setKind($data['kind']);

        

        return $prestation;
    }
}
