<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class GetArtistController
{
    public function __construct(
        private UserRepository $userRepository,
        private SerializerInterface $serializer,
    ) {
    }

    public function __invoke(User $user): User
    {
        return $user;
    }
}
