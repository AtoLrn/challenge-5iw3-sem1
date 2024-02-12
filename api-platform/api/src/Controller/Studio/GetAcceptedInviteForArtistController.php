<?php

namespace App\Controller\Studio;

use App\Repository\PartnerShipRepository;
use App\Repository\UserRepository;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;


#[AsController]
class GetAcceptedInviteForArtistController
{
    public function __construct(
        private Security $security,
        private UserRepository $userRepository,
        private PartnerShipRepository $partnerShipRepository
    ) {
    }

    public function __invoke(string $id): array
    {
        $user = $this->security->getUser();

        $artist = $this->userRepository->findOneBy(["id" => $id]);

        if (!$artist || in_array('ROLE_PRO', $user->getRoles()) || !$artist->isVerified()) {
            throw new AccessDeniedHttpException('Artist not found');
        }

        return $this->partnerShipRepository->findBy(["userId" => $artist->getId()]);
    }
}
