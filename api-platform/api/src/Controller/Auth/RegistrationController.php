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

#[AsController]
class RegistrationController
{
    public function __construct(
        protected Security $security,
        private SerializerInterface $serializer,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $userPasswordHasher,
        private UserRepository $userRepository
    )
    {}

    public function __invoke(Request $request): User
    {
        $data = json_decode($request->getContent(), true);

        $user = $this->userRepository->findOneBy(['username' => $data['username']]);

        if ($user){
            throw new UnprocessableEntityHttpException('This username is already taken');
        }

        $user = $this->userRepository->findOneBy(['email' => $data['email']]);

        if ($user){
            throw new UnprocessableEntityHttpException('This email is already taken');
        }

        $passwordLength = strlen($data['password']);
        if($passwordLength < 8 || $passwordLength > 32) {
            throw new UnprocessableEntityHttpException('The password must be between 8 and 32 characters');
        }

        $user = new User();
        $user->setPassword($this->userPasswordHasher->hashPassword($user, $data['password']));
        $user->setEmail($data['email']);
        $user->setUsername($data['username']);
        $user->setIsProfessional($data['isProfessional']);

        return $user;
    }
}
