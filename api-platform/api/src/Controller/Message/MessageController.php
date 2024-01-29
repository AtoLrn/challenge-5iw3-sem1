<?php

namespace App\Controller\Message;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use App\Utils\Files;

#[AsController]
class MessageController
{
    public function __construct(
        protected Security $security,
        private SerializerInterface $serializer,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $userPasswordHasher,
        private UserRepository $userRepository,
        private MailerInterface $mailer,
        private JWTTokenManagerInterface $jwtManager,
        private Files $files,
    )
    {}

    public function __invoke(Request $request): User
    {
        $sender = $this->security->getUser();

        $channelId = $request->request->get('channelId');
        $content = $request->request->get('content');
        $file = $request->request->get('file');

        //TODO check channel repository



        return $sender;
    }
}
