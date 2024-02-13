<?php

namespace App\Controller\Prestation;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class PrestationUserGetController extends AbstractController
{
    public function __construct(
        public UserRepository $userRepository
    ) {
    }

    public function __invoke($id)
    {
        $user = $this->userRepository->find($id);

        if(!$user) {
            throw new NotFoundHttpException('User not exist');
        }

        $prestations = $user->getPrestations();

        return $prestations;
    }
}
