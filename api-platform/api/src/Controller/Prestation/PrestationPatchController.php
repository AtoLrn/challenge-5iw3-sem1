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
        private Files $files,
        private PrestationRepository $prestationRepository
    ) {
    }

    public function __invoke(Request $request, int $id): Prestation
    {
        $prestation = $this->prestationRepository->find($id);

        if (!$prestation) {
            throw new NotFoundHttpException('Prestation not found');
        }

        $nameInput = $request->request->get('name', $prestation->getName());
        $kindInput = $request->request->get('kind', $prestation->getKind()->value);

        try {
            $kind = Kind::from($kindInput);
        } catch (\ValueError $e) {
            throw new UnprocessableEntityHttpException('Invalid kind value');
        }

        $prestation->setName($nameInput);
        $prestation->setKind($kind);

        if ($pictureFile = $request->files->get('picture')) {
            $pictureFileUrl = $this->files->upload($pictureFile);
            $prestation->setPicture($pictureFileUrl);
        }

        return $prestation;
    }
}
