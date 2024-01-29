<?php

namespace App\Controller\Channel;

use App\Entity\Channel;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class ChannelGetController
{
    public function __construct(
        private UserRepository $userRepository,
        private Security $security,
    )
    {}

    public function __invoke(): array
    {
        $user = $this->security->getUser();

        $channels = $this->userRepository->getChannels($user);

        return $channels;
    }
}
