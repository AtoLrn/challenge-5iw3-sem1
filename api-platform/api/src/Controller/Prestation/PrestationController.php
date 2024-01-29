<?php

namespace App\Controller\Prestation;

use App\Entity\Prestation;
use App\Enum\Kind;
use App\Repository\UserRepository;
use App\Utils\Files;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

#[AsController]
class PrestationController
{
    public function __construct(
        protected Security $security,
        private readonly Files $files,
        private readonly UserRepository $userRepository,
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
