<?php

namespace App\Controller\Auth;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
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
    )
    {}

    public function __invoke(Request $request): User
    {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setPassword($this->userPasswordHasher->hashPassword($user, $data['password']));
        $user->setEmail($data['email']);
        $user->setUsername($data['username']);
        $user->setIsProfessional($data['isProfessional']);

        return $user;
    }
}
