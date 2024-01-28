<?php

namespace App\Controller\Prestation;

use App\Entity\Prestation;
use App\Utils\Files;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

#[AsController]
class PrestationPictureController
{
    public function __construct(
        private readonly Files $files,
    ) {
    }

    public function __invoke(Request $request): Prestation
    {
        $prestation = $request->attributes->get('data');

        if (!$request->files->get('prestationPictureFile')) {
            throw new UnprocessableEntityHttpException('File needed');
        }

        $pictureFile = $request->files->get('prestationPictureFile');

        $pictureFileUrl = $this->files->upload($pictureFile);

        $prestation->setPicture($pictureFileUrl);

        return $prestation;
    }
}
