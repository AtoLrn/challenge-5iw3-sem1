<?php

namespace App\Controller\User;

use App\Entity\User;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

#[AsController]
class GetMeController
{
    public function __construct(private Security $security){}

    public function __invoke(): User
    {
        $user = $this->security->getUser();

        return $user;
    }
}
