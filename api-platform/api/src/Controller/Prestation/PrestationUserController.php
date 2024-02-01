<?php

namespace App\Controller\Prestation;

use App\Repository\PrestationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;

class PrestationUserController extends AbstractController
{
    public function __construct(
        private readonly Security $security,
        private readonly PrestationRepository $prestationRepository
    ) {
    }

    public function __invoke(): Response
    {
        $user = $this->security->getUser();
        if (!$user) {
            return $this->json([], Response::HTTP_FORBIDDEN);
        }

        // Verify if the user is an admin
        if ($this->security->isGranted('ROLE_ADMIN')) {
            $prestations = $this->prestationRepository->findAll();
        } else {
            $prestations = $this->prestationRepository->findBy(['proposedBy' => $user]);
        }

        return $this->json($prestations);
    }
}
