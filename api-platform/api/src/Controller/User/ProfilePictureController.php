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
use Ramsey\Uuid\Uuid;

#[AsController]
class ProfilePictureController
{
    public function __construct(
        protected Security $security,
        private SerializerInterface $serializer,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $userPasswordHasher,
        private UserRepository $userRepository,
    )
    {}

    public function __invoke(Request $request): User
    {
        $user = $this->security->getUser();

        if(!$request->files->get('profilePictureFile')) {
            throw new UnprocessableEntityHttpException('File needed');
        }

        $idGenerator = Uuid::uuid4();
        $pictureFileId = $idGenerator->toString();

        // TODO : UPLOAD FILE TO S3 + check file

        $user->setPicture('https://dummy-s3-host.fr/'.$pictureFileId);

        return $user;
    }
}
