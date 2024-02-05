<?php

namespace App\Controller\Channel;

use App\Entity\Channel;
use App\Repository\ChannelRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsController]
class ChannelGetController
{
    public function __construct(
        private UserRepository $userRepository,
        private Security $security,
        private ChannelRepository $channelRepository,
    )
    {}

    public function __invoke($id, Request $request): Channel
    {
        $user = $this->security->getUser();

        $channel = $this->channelRepository->find($id);

        if($channel->getTattooArtist()->getId() !== $user->getId() && $channel->getRequestingUser()->getId() !== $user->getId()){
            throw new NotFoundHttpException('Not found');
        }

        return $channel;
    }
}
