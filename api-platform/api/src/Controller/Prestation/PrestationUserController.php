<?php

namespace App\Controller\Prestation;

use App\Repository\PrestationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;

class PrestationUserController extends AbstractController
{
    public function __construct(
        private readonly Security $security,
        private readonly PrestationRepository $prestationRepository
    ) {
    }

    public function __invoke(): array
    {
        $user = $this->security->getUser();

        return $this->prestationRepository->findBy(['proposedBy' => $user]);
    }
}
