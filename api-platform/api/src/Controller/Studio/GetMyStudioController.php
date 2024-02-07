<?php

namespace App\Controller\Studio;

use App\Entity\Studio;
use App\Repository\StudioRepository;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;

#[AsController]
class GetMyStudioController
{
    public function __construct(
        private Security $security,
        private StudioRepository $studioRepository

    ) {
    }

    public function __invoke(): array
    {
        $user = $this->security->getUser();

        return $this->studioRepository->findBy(["owner" => $user->getId()]);
    }
}
