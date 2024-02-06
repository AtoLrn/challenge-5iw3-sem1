<?php

namespace App\Controller\PostPicture;

use App\Entity\PostPicture;
use App\Utils\Files;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

#[AsController]
class PostCreateController
{
    public function __construct(
        protected Security $security,
        private Files $files,
    )
    {}

    public function __invoke(Request $request): PostPicture
    {
        $user = $this->security->getUser();

        if (!$request->files->get('picture')) {
            throw new UnprocessableEntityHttpException('File needed');
        }

        $postPicture = new PostPicture();
        $pictureFile = $request->files->get('picture');

        $pictureFileUrl = $this->files->upload($pictureFile);

        $postPicture->setPicture($pictureFileUrl);
        $postPicture->setCreator($user);

        return $postPicture;
    }
}
