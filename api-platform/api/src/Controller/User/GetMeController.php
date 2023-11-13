<?php

namespace App\Controller\User;

use App\Entity\User;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;

#[AsController]
class GetMeController
{
    public function __construct(private Security $security){}

    public function __invoke(): User
    {
        return $this->security->getUser();
    }
}
