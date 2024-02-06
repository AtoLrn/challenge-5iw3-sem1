<?php

namespace App\Controller\Channel;

use App\Repository\ChannelRepository;
use App\Repository\MessageRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

#[AsController]
class ChannelGetMeController
{
    public function __construct(
        private ChannelRepository $channelRepository,
        private MessageRepository $messageRepository,
        private Security $security,
    )
    {}

    public function __invoke(Request $request): array
    {
        $user = $this->security->getUser();

        $as = $request->query->get('as');

        if($as !== "requestingUser" && $as !== "tattooArtist"){
            throw new UnprocessableEntityHttpException("Query parameter with good value needed");
        }

        $channels = [];

        if($as === "requestingUser") {
            $channels = $this->channelRepository->findBy(['requestingUser' => $user->getId()]);
        } else if ($as === "tattooArtist") {
            $channels = $this->channelRepository->findBy(['tattooArtist' => $user->getId()]);
        }

        return $channels;
    }
}
