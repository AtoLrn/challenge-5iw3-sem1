<?php

namespace App\Controller\BookRequest;

use App\Entity\BookRequest;
use App\Repository\BookRequestRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsController]
class BookRequestGetMeByIdController
{
    public function __construct(
        private BookRequestRepository $bookRequestRepository,
        protected Security $security,
    ) {
    }

    public function __invoke(BookRequest $bookRequest): BookRequest
    {
        $user = $this->security->getUser();

        if ($bookRequest->getRequestingUser() !== $user) {
            throw new NotFoundHttpException('User not found');
        }

        return $bookRequest;
    }
}
