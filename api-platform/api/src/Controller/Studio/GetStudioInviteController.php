<?php

namespace App\Controller\Studio;

use App\Entity\PartnerShip;
use App\Entity\Studio;
use App\Repository\PartnerShipRepository;
use App\Repository\UserRepository;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;


#[AsController]
class GetStudioInviteController
{
    public function __construct(
        private Security $security,
        private PartnerShipRepository $partnerShipRepository

    ) {
    }

    public function __invoke(Studio $studio): array
    {
        $user = $this->security->getUser();

        if ($studio->getOwner()->getId() !== $user->getId()) {
            throw new AccessDeniedHttpException('You do not possess this studio');
        }


        return $this->partnerShipRepository->findBy(["studioId" => $studio->getId()]);
    }
}
