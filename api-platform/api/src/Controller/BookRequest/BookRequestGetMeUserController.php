<?php

namespace App\Controller\BookRequest;

use App\Repository\BookRequestRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsController]
class BookRequestGetMeUserController
{
    public function __construct(
        private BookRequestRepository $bookRequestRepository,
        protected Security $security,
    ) {
    }

    public function __invoke(): array
    {
        $user = $this->security->getUser();

        $bookRequest = $this->bookRequestRepository->findBy(['requestingUser' => $user->getId()]);

        return $bookRequest;
    }
}
