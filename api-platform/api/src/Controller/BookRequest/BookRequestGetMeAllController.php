<?php

namespace App\Controller\BookRequest;

use App\Repository\BookRequestRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsController]
class BookRequestGetMeAllController
{
    public function __construct(
        private BookRequestRepository $bookRequestRepository,
        protected Security $security,
    ) {
    }

    public function __invoke(): array
    {
        $tattooArtist = $this->security->getUser();

        if (!$tattooArtist) {
            throw new NotFoundHttpException('User not found');
        }

        $bookRequest = $this->bookRequestRepository->findBy(['tattooArtist' => $tattooArtist->getId()]);

        return $bookRequest;
    }
}
