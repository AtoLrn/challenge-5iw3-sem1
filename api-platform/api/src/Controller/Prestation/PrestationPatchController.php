<?php

namespace App\Controller\Prestation;

use App\Entity\Prestation;
use App\Enum\Kind;
use App\Repository\PrestationRepository;
use App\Security\Voter\PrestationVoter;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[AsController]
class PrestationPatchController
{
    public function __construct(
        protected Security $security,
        private readonly PrestationRepository $prestationRepository
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

        $data = json_decode($request->getContent(), true);

        try {
            $kindEnum = Kind::from($data['kind']);
        } catch (\ValueError $e) {
            throw new UnprocessableEntityHttpException('Invalid kind value');
        }

        $prestation->setName($data['name']);
        $prestation->setKind($kindEnum);

        return $prestation;
    }
}
