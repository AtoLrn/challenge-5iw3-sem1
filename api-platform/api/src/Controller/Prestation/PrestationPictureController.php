<?php

namespace App\Controller\Prestation;

use App\Entity\Prestation;
use App\Repository\PrestationRepository;
use App\Security\Voter\PrestationVoter;
use App\Utils\Files;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[AsController]
class PrestationPictureController
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

        if (!$this->security->isGranted(PrestationVoter::EDIT, $prestation)) {
            throw new AccessDeniedException('You do not have permission to delete this prestation.');
        }

        if (!$request->files->get('picture')) {
            throw new UnprocessableEntityHttpException('File needed');
        }

        $pictureFile = $request->files->get('picture');

        $pictureFileUrl = $this->files->upload($pictureFile);

        $prestation->setPicture($pictureFileUrl);

        return $prestation;
    }
}
