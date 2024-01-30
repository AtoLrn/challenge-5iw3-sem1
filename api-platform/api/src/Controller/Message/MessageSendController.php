<?php

namespace App\Controller\Message;

use App\Entity\Message;
use App\Entity\User;
use App\Repository\ChannelRepository;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use App\Utils\Files;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsController]
class MessageSendController
{
    public function __construct(
        protected Security $security,
        private SerializerInterface $serializer,
        private Files $files,
        private ChannelRepository $channelRepository,
        private MessageRepository $messageRepository,
        private MessageBusInterface $bus
    )
    {}

    public function __invoke(Request $request): Message
    {
        $sender = $this->security->getUser();

        if(!$sender) {
            throw new AccessDeniedHttpException('Not allowed');
        }

        $channelId = $request->request->get('channelId');
        $content = $request->request->get('content');
        $file = $request->files->get('file');

        $channel = $this->channelRepository->find($channelId);

        if(!$channel){
            throw new NotFoundHttpException('Channel not found');
        }

        if(($channel->getRequestingUser() != $sender) && ($channel->getTattooArtist() != $sender)) {
            throw new AccessDeniedHttpException('Not allowed to send on this channel');
        }

        $message = new Message();
        $message->setChannel($channel);
        $message->setSender($sender);
        $message->setContent($content);

        if($file) {
            $fileUrl = $this->files->upload($file);
            $message->setPicture($fileUrl);
        }

        // Serialize message to send on json format
        $messageSerialized = [
            'content' => $message->getContent(),
            'file' => $message->getPicture(),
            'sender' => [
                'id' => $sender->getId(),
                'username' => $sender->getUsername(),
                'profilPicture' => $sender->getPicture(),
            ],
            'createdAt' => $message->getCreatedAt(),
        ];

        $update = new Update("/messages/channel/" . $channel->getId(), json_encode([
            "message" => $messageSerialized,
        ]));
        $this->bus->dispatch($update);

        return $message;
    }
}
