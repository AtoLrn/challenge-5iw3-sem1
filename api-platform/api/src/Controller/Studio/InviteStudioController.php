<?php

namespace App\Controller\Studio;

use App\Entity\PartnerShip;
use App\Entity\Studio;
use App\Repository\UserRepository;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use DateTimeZone;

#[AsController]
class InviteStudioController
{
    public function __construct(
        private Security $security,
        private UserRepository $userRepository

    ) {
    }

    public function __invoke(Studio $studio, Request $request): PartnerShip
    {
        $data = json_decode($request->getContent(), true);

        $user = $this->security->getUser();

        $invitedUser = $this->userRepository->findOneBy(["id" => $data["userId"]]);

        if ($studio->getOwner()->getId() !== $user->getId() || !$invitedUser) {
            return null;
        }

        $partnerShip = new PartnerShip();

        $partnerShip->setStatus("PENDING");
        $partnerShip->setFromStudio(true);
        $partnerShip->setStudioId($studio);

        $partnerShip->setUserId($invitedUser);
        $partnerShip->setStartDate(new \DateTime($data["startDate"]));
        $partnerShip->setEndDate(new \DateTime($data["endDate"]));


        return $partnerShip;
    }
}
