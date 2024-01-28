<?php

namespace App\Controller\Prestation;

use App\Entity\Prestation;
use App\Enum\Kind;
use App\Repository\PrestationRepository;
use App\Repository\UserRepository;
use App\Utils\Files;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;

#[AsController]
class PrestationController
{
    public function __construct(
        protected Security $security,
        private SerializerInterface $serializer,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $userPasswordHasher,
        private PrestationRepository $prestationRepository,
        private readonly Files $files,
        private UserRepository $userRepository,
    ) {
    }

    public function __invoke(Request $request): Prestation
    {
        $nameInput = $request->request->get('name');
        $kindInput = $request->request->get('kind');
        $locationInput = $request->request->get('location');
        $proposedByIri = $request->request->get('proposedBy');

        $user = $this->userRepository->findOneBy(['id' => $proposedByIri]);

        $prestation = new Prestation();

        try {
            $kind = Kind::from($kindInput);
        } catch (\ValueError $e) {
            throw new UnprocessableEntityHttpException('Invalid kind value');
        }

        $prestation->setName($nameInput);
        $prestation->setKind($kind);
        $prestation->setLocation($locationInput);
        $prestation->setProposedBy($user);
        $prestation->setCreatedAt(new \DateTimeImmutable());

        if (!$request->files->get('picture')) {
            throw new UnprocessableEntityHttpException('File needed');
        }

        $pictureFile = $request->files->get('picture');

        $pictureFileUrl = $this->files->upload($pictureFile);

        $user->setPicture($pictureFileUrl);

        return $prestation;
    }
}
