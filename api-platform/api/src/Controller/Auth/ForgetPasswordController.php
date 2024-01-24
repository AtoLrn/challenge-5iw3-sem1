<?php

namespace App\Controller\Auth;

use App\Entity\User;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Mime\Email;

#[AsController]
class ForgetPasswordController
{
    public function __construct(
        private Security $security,
        private UserRepository $userRepository,
        private SerializerInterface $serializer,
        private UserPasswordHasherInterface $userPasswordHasher,
        private MailerInterface $mailer,
        private JWTTokenManagerInterface $jwtManager,
    ){}

    public function __invoke(Request $request): User
    {

        $data = json_decode($request->getContent(), true);

        if(!isset($data['email'])) {
            throw new UnprocessableEntityHttpException('You must provide an email');
        }

        $user = $this->userRepository->findOneBy(['email' => $data['email']]);

        if(!$user) {
            throw new NotFoundHttpException('There is no user with this email');
        }

        $jwt = $this->jwtManager->create($user);

        $email = (new Email())
            ->from('inkit@no-reply.fr')
            ->to($user->getEmail())
            ->subject('Inkit: Mot de pass oublié')
            ->text("Vous avez oublié votre mot de passe ? Vous pouvez le reset à cette URL:".$_ENV['FRONT_APP_URL']."/reset-password?token=".$jwt);

        $this->mailer->send($email);

        return $user;
    }
}
