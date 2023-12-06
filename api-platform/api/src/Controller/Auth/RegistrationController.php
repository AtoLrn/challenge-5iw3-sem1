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
use Ramsey\Uuid\Uuid;

#[AsController]
class RegistrationController
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

        $usernameInput = $request->request->get('username');
        $emailInput = $request->request->get('email');
        $passwordInput = $request->request->get('password');
        $isProfessionalInput = $request->request->get('isProfessional');
        $kbisFile = $request->request->get('kbisFile');

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

        $roles = ['ROLE_USER'];

        if($isProfessionalInput == 'true') {
            if(!$request->files->get('kbisFile')) {
                throw new UnprocessableEntityHttpException('KBIS file needed if you are a professionnal');
            }

            array_push($roles, 'ROLE_PRO');

            $idGenerator = Uuid::uuid4();
            $kbisFileId = $idGenerator->toString();

            // TODO : UPLOAD FILE TO S3

            $user->setKbisFileUrl('https://dummy-s3-host.fr/'.$kbisFileId);

        } else if ($isProfessionalInput == 'false') {
            if($request->files->get('kbisFile')) {
                throw new UnprocessableEntityHttpException('KBIS file not needed if you are not a professionnal');
            }
        } else {
            throw new UnprocessableEntityHttpException('Error');
        }

        $user->setRoles($roles);

        return $user;
    }
}
