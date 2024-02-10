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
        $artists = $this->userRepository->findBy(['verified' => true, 'kbisVerified' => true]);

        return array_filter($artists, function ($artist) {
            return in_array('ROLE_PRO', $artist->getRoles());
        });
    }
}
