<?php

namespace App\Controller\Channel;

use App\Entity\Channel;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsController]
class ChannelCreateController
{
    public function __construct(
        private UserRepository $userRepository,
    )
    {}

    public function __invoke(Request $request): Channel
    {
        $data = json_decode($request->getContent(), true);

        $tattooArtistId = $data['tattooArtistId'];
        $requestingUserId = $data['requestingUserId'];

        $tattooArtist = $this->userRepository->find($tattooArtistId);
        $requestingUser = $this->userRepository->find($requestingUserId);

        if(!$tattooArtist || !$requestingUser) {
            throw new NotFoundHttpException('User not found');
        }

        $channel = new Channel();
        $channel->setRequestingUser($requestingUser);
        $channel->setTattooArtist($tattooArtist);

        return $channel;
    }
}
