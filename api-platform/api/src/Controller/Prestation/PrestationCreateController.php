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
class PrestationCreateController
{
    public function __construct(
        protected Security $security,
        private readonly Files $files,
    ) {
    }

    public function __invoke(Request $request): Prestation
    {
        $nameInput = $request->request->get('name');
        $kindInput = $request->request->get('kind');
        $user = $this->security->getUser();

        $prestation = new Prestation();

        try {
            $kind = Kind::from($kindInput);
        } catch (\ValueError $e) {
            throw new UnprocessableEntityHttpException('Invalid kind value');
        }

        $prestation->setName($nameInput);
        $prestation->setKind($kind);
        $prestation->setProposedBy($user);

        if (!$request->files->get('picture')) {
            throw new UnprocessableEntityHttpException('File needed');
        }

        $pictureFile = $request->files->get('picture');

        $pictureFileUrl = $this->files->upload($pictureFile);

        $prestation->setPicture($pictureFileUrl);

        return $prestation;
    }
}
