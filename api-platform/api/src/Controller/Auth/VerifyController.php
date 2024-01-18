<?php

namespace App\Controller\Auth;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

#[AsController]
class VerifyController
{
    public function __construct(
        private UserRepository $userRepository,
        private JWTTokenManagerInterface $jwtManager,
    )
    {}

    public function __invoke(Request $request): User
    {
        $user = $this->userRepository->findOneBy(['id'  => 1]);
        $jwt = $request->query->get('token');

        if (!$jwt){
            throw new UnprocessableEntityHttpException('A token is needed');
        }

        $decodedToken = $this->jwtManager->parse($jwt);

        $user = $this->userRepository->findOneBy(['email' => $decodedToken['email']]);

        $user->setIsVerified(true);

        return $user;
    }
}
