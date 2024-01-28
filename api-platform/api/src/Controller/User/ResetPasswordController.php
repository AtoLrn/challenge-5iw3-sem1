<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;

#[AsController]
class ResetPasswordController
{
    public function __construct(
        private Security $security,
        private UserRepository $userRepository,
        private SerializerInterface $serializer,
        private UserPasswordHasherInterface $userPasswordHasher,
        private JWTTokenManagerInterface $jwtManager,
    ){}

    public function __invoke(Request $request): User
    {
        $jwt = $request->query->get('token');

        if (!$jwt){
            throw new UnprocessableEntityHttpException('A token is needed');
        }

        $decodedToken = $this->jwtManager->parse($jwt);

        $user = $this->userRepository->findOneBy(['email' => $decodedToken['email']]);

        $data = json_decode($request->getContent(), true);

        $passwordLength = strlen($data['password']);
        if($passwordLength < 8 || $passwordLength > 32) {
            throw new UnprocessableEntityHttpException('The password must be between 8 and 32 characters');
        }

        $user->setPassword($this->userPasswordHasher->hashPassword($user, $data['password']));

        return $user;
    }
}
