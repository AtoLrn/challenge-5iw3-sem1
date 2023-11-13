<?php

namespace App\Controller\Auth;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Serializer\SerializerInterface;

#[AsController]
class LoginController
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

        $user = $this->userRepository->findOneBy(['email' => $data['email']]);

        if (!$user) {
            throw new EntityNotFoundException('There is no user with this email');
        }

        if (!isset($data['password']) || !$this->userPasswordHasher->isPasswordValid($user, $data['password'])) {
            throw new BadCredentialsException('Wrong password');
        }

        return $user;
    }
}
