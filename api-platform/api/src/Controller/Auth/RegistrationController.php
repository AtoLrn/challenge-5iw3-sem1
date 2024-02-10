<?php

namespace App\Controller\Auth;

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
class RegistrationController
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
        $usernameInput = $request->request->get('username');
        $emailInput = $request->request->get('email');
        $passwordInput = $request->request->get('password');
        $isProfessionalInput = $request->request->get('isProfessional');

        $user = $this->userRepository->findOneBy(['email' => $emailInput]);

        if ($user){
            throw new UnprocessableEntityHttpException('This email is already taken');
        }

        $user = $this->userRepository->findOneBy(['username' => $usernameInput]);

        if ($user){
            throw new UnprocessableEntityHttpException('This username is already taken');
        }

        $passwordLength = strlen($passwordInput);
        if($passwordLength < 8 || $passwordLength > 32) {
            throw new UnprocessableEntityHttpException('The password must be between 8 and 32 characters');
        }


        $user = new User();
        $user->setPassword($this->userPasswordHasher->hashPassword($user, $passwordInput));
        $user->setEmail($emailInput);
        $user->setUsername($usernameInput);
        if($request->request->get('phoneNumber')) {
            $user->setPhoneNumber($request->request->get('phoneNumber'));
        }

        $roles = ['ROLE_USER'];

        // hardcode check because form-data return string only
        if($isProfessionalInput == 'true') {
            if(!$request->files->get('kbisFile')) {
                throw new UnprocessableEntityHttpException('KBIS file needed if you are a professionnal');
            }

            array_push($roles, 'ROLE_PRO');

            $kbisFile = $request->files->get('kbisFile');

            $kbisFileUrl = $this->files->upload($kbisFile);

            $user->setKbisFileUrl($kbisFileUrl);

        } else if ($isProfessionalInput == 'false') {
            if($request->files->get('kbisFile')) {
                throw new UnprocessableEntityHttpException('KBIS file not needed if you are not a professionnal');
            }
        } else {
            throw new UnprocessableEntityHttpException('Error');
        }

        $user->setRoles($roles);

        $jwt = $this->jwtManager->create($user);

        $email = (new Email())
            ->from('inkit@no-reply.fr')
            ->to($user->getEmail())
            ->subject('Inkit: vérifiez votre email')
            ->text("Votre compte a bien été créé, veuillez vérifier votre email à cette url:".$_ENV['FRONT_APP_URL']."/verify?token=".$jwt);

        $this->mailer->send($email);

        if(in_array('ROLE_PRO', $user->getRoles())) {
            $users = $this->userRepository->findAll();
            $admins = array_filter($users, function ($user) {
                return in_array('ROLE_ADMIN', $user->getRoles());
            });

            foreach($admins as $admin) {
                $email = (new Email())
                    ->from('inkit@no-reply.fr')
                    ->to($admin->getEmail())
                    ->subject('Inkit: Un nouveau tatoueur arrive !')
                    ->text('Un nouvel utilisateur s\'est inscrit en tant que tatoueur ! Son kbis a besoin d\'être vérifier.');

                $this->mailer->send($email);
            }
        }

        return $user;
    }
}
