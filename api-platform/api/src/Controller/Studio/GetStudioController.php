<?php

namespace App\Controller\Studio;

use App\Entity\Studio;
use App\Repository\PartnerShipRepository;
use App\Repository\StudioRepository;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;


#[AsController]
class GetStudioController
{
    public function __construct(
        private Security $security,
        private  StudioRepository $studioRepository

    ) {
    }

    public function __invoke(Studio $studio): Studio
    {
        return $this->studioRepository->findOneBy(["id" => $studio->getId()]);
    }
}
