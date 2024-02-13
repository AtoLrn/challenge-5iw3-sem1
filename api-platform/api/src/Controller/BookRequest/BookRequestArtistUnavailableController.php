<?php

namespace App\Controller\BookRequest;

use App\Entity\BookRequest;
use App\Repository\BookRequestRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use function Aws\filter;

#[AsController]
class BookRequestArtistUnavailableController
{
    public function __construct(
        private BookRequestRepository $bookRequestRepository,
        protected Security $security,
    ) {
    }

    public function __invoke($id): array
    {
        $bookRequests = $this->bookRequestRepository->findBy(["tattooArtist" => $id]);

        return array_filter($bookRequests, function ($bookRequest) {
            return $bookRequest->getTime() !== null;
        });
    }
}
