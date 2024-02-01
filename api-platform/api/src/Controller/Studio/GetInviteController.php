<?php

namespace App\Controller\Studio;

use App\Entity\PartnerShip;
use App\Entity\Studio;
use App\Repository\PartnerShipRepository;
use App\Repository\UserRepository;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;


#[AsController]
class GetInviteController
{
    public function __construct(
        private Security $security,
        private PartnerShipRepository $partnerShipRepository

    ) {
    }

    public function __invoke(): array
    {

        $user = $this->security->getUser();


        return $this->partnerShipRepository->findBy(["userId" => $user->getId()]);
    }
}
