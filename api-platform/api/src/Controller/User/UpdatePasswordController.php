<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;

#[AsController]
class UpdatePasswordController
{
    public function __construct(
        private Security $security,
        private UserRepository $userRepository,
        private SerializerInterface $serializer,
        private UserPasswordHasherInterface $userPasswordHasher,
    ){}

    public function __invoke(Request $request): User
    {
        $user = $this->security->getUser();

        $data = json_decode($request->getContent(), true);

        if(!isset($data['currentPassword']) || !isset($data['newPassword'])) {
            throw new UnprocessableEntityHttpException('You must provide a current and new password');
        }

        if (!$this->userPasswordHasher->isPasswordValid($user, $data['currentPassword'])) {
            throw new AccessDeniedHttpException('Wrong current password');
        }

        $passwordLength = strlen($data['newPassword']);
        if($passwordLength < 8 || $passwordLength > 32) {
            throw new UnprocessableEntityHttpException('The password must be between 8 and 32 characters');
        }

        $user->setPassword($this->userPasswordHasher->hashPassword($user, $data['newPassword']));

        return $user;
    }
}
