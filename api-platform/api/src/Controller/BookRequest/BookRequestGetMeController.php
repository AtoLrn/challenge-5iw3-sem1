<?php

namespace App\Controller\BookRequest;

use App\Repository\BookRequestRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsController]
class BookRequestGetMeController
{
    public function __construct(
        private BookRequestRepository $bookRequestRepository,
        protected Security $security,
    )
    {}

    public function __invoke(): array
    {
        $tattooArtist = $this->security->getUser();

        if(!$tattooArtist || !in_array('ROLE_PRO', $tattooArtist->getRoles())) {
            throw new NotFoundHttpException('User not found');
        }

        $bookRequest = $this->bookRequestRepository->findBy(['tattooArtist' => $tattooArtist->getId(), 'chat' => false]);

        return $bookRequest;
    }
}
