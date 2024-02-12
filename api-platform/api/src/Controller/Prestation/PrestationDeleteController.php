<?php

namespace App\Controller\Prestation;

use App\Entity\Prestation;
use App\Repository\PrestationRepository;
use App\Security\Voter\PrestationVoter;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[AsController]
class PrestationDeleteController
{

    public function __construct(
        protected Security $security,
        private readonly PrestationRepository $prestationRepository,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    /**
     * @throws ORMException
     */
    public function __invoke(Request $request, int $id): Prestation
    {

        $prestation = $this->prestationRepository->find($id);

        if (!$prestation) {
            throw new NotFoundHttpException('Prestation not found');
        }

        if (!$this->security->isGranted(PrestationVoter::DELETE, $prestation)) {
            throw new AccessDeniedException('You do not have permission to delete this prestation.');
        }

        $this->entityManager->remove($prestation);
        $this->entityManager->flush();

        return $prestation;
    }
}
