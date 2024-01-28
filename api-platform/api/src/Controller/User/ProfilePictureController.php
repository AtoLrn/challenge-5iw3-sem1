<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;
use App\Utils\Files;

#[AsController]
class ProfilePictureController
{
    public function __construct(
        protected Security $security,
        private SerializerInterface $serializer,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $userPasswordHasher,
        private UserRepository $userRepository,
        private Files $files,
    )
    {}

    public function __invoke(Request $request): User
    {
        $user = $this->security->getUser();

        if(!$request->files->get('profilePictureFile')) {
            throw new UnprocessableEntityHttpException('File needed');
        }

        $pictureFile = $request->files->get('profilePictureFile');

        $pictureFileUrl = $this->files->upload($pictureFile);

        $user->setPicture($pictureFileUrl);

        return $user;
    }
}
