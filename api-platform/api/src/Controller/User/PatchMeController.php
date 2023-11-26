<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Serializer\SerializerInterface;

#[AsController]
class PatchMeController
{
    public function __construct(
        private Security $security,
        private UserRepository $userRepository,
        private SerializerInterface $serializer,
    ){}

    public function __invoke(Request $request): User
    {
        $user = $this->security->getUser();

        $data = json_decode($request->getContent(), true);

        if(isset($data['username'])){
            $existingUser = $this->userRepository->findOneBy(['username' => $data['username']]);

            if($existingUser && $existingUser->getId() != $user->getId()) {
                throw new UnprocessableEntityHttpException('This username is already taken');
            }
        }

        if(isset($data['email'])){
            $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);

            if($existingUser && $existingUser->getId() != $user->getId()) {
                throw new UnprocessableEntityHttpException('This email is already taken');
            }
        }

        $this->serializer->deserialize($request->getContent(), User::class, 'json', ['object_to_populate' => $user]);

        return $user;
    }
}
