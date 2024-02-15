<?php

namespace App\Controller\BookRequest;

use App\Entity\BookRequest;
use App\Repository\BookRequestRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsController]
class BookRequestDeleteController
{
    public function __construct(
        private BookRequestRepository $bookRequestRepository,
        protected Security $security,
    ) {
    }

    public function __invoke($id): BookRequest
    {
        $user = $this->security->getUser();

        $request = $this->bookRequestRepository->find($id);

        if ($request->getTattooArtist() !== $user && $request->getRequestingUser() !== $user) {
            throw new NotFoundHttpException('Not found');
        }

        return $request;
    }
}
