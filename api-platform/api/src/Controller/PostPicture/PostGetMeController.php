<?php

namespace App\Controller\PostPicture;

use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Doctrine\Common\Collections\Collection;

#[AsController]
class PostGetMeController
{
    public function __construct(
        protected Security $security,
    )
    {}

    public function __invoke(): Collection
    {
        $user = $this->security->getUser();

        $posts = $user->getPostPictures();

        return $posts;
    }
}
