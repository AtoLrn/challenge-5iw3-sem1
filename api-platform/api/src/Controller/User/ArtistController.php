<?php

namespace App\Controller\User;

use App\Repository\UserRepository;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class ArtistController
{
    public function __construct(
        private UserRepository $userRepository,
        private SerializerInterface $serializer,
    ) {
    }

    public function __invoke(): array
    {
        $artists = $this->userRepository->findBy(['isProfessional' => true, 'isVerified' => true]);

        return $artists;
    }
}
