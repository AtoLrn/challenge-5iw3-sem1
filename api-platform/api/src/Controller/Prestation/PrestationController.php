<?php

namespace App\Controller\Prestation;

use App\Entity\Prestation;
use App\Repository\PrestationRepository;
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
    ) {
    }

    public function __invoke(Request $request): Prestation
    {
        $nameInput = $request->request->get('name');
        $kindInput = $request->request->get('kind');
        $locationInput = $request->request->get('location');
        $proposedByInput = $request->request->get('proposedBy');

        $prestation = new Prestation();

        $prestation->setName($nameInput);
        $prestation->setKind($kindInput);
        $prestation->setLocation($locationInput);
        $prestation->setProposedBy($proposedByInput);

        $roles = ['ROLE_USER'];

        if (!$request->files->get('prestationPicture')) {
            throw new UnprocessableEntityHttpException('File needed');
        }

        $prestationPicture = $request->files->get('prestationPicture');

        $prestationPictureUrl = $this->files->upload($prestationPicture);

        $prestation->setPicture($prestationPictureUrl);

        return $prestation;
    }
}
