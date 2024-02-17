<?php

namespace App\Event;


use Symfony\Component\Mailer\MailerInterface;
use App\Repository\UserRepository;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Mime\Email;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use App\Event\UserCreateEvent;

#[AsEventListener(event: UserCreateEvent::class, method: 'onUserCreated')]
final class EmailRegistration
{
    public function __construct(
        private MailerInterface $mailer,
        private UserRepository $userRepository,
        private JWTTokenManagerInterface $jwtManager,
    ) {
    }

    public function onUserCreated(UserCreateEvent $event): void
    {
        $user = $this->userRepository->find($event->getUserId());
        if (!$user) {
            return;
        }

        $jwt = $this->jwtManager->create($user);

        $email = (new Email())
            ->from('inkit@no-reply.fr')
            ->to($user->getEmail())
            ->subject('Inkit: vérifiez votre email')
            ->text("Votre compte a bien été créé, veuillez vérifier votre email à cette url:" . $_ENV['FRONT_APP_URL'] . "/verify?token=" . $jwt);

        $this->mailer->send($email);

        if (in_array('ROLE_PRO', $user->getRoles())) {
            $users = $this->userRepository->findAll();
            $admins = array_filter($users, function ($user) {
                return in_array('ROLE_ADMIN', $user->getRoles());
            });

            foreach ($admins as $admin) {
                $email = (new Email())
                    ->from('inkit@no-reply.fr')
                    ->to($admin->getEmail())
                    ->subject('Inkit: Un nouveau tatoueur arrive !')
                    ->text('Un nouvel utilisateur s\'est inscrit en tant que tatoueur ! Son kbis a besoin d\'être vérifier.');

                $this->mailer->send($email);
            }
        }
    }
}
