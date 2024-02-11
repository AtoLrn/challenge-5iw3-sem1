<?php

namespace App\Controller\BookRequest;

use App\Entity\BookRequest;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

#[AsController]
class BookRequestCreateController
{
    public function __construct(
        private UserRepository $userRepository,
        protected Security $security,
    )
    {}

    public function __invoke($id, Request $request): BookRequest
    {
        $requestingUser = $this->security->getUser();

        if(!$requestingUser) {
            throw new AccessDeniedHttpException('Not allowed');
        }

        if($requestingUser->getId() == $id) {
            throw new UnprocessableEntityHttpException('You can\'t book yourself');
        }

        $tattooArtist = $this->userRepository->find($id);

        if(!$tattooArtist || !in_array('ROLE_PRO', $tattooArtist->getRoles())) {
            throw new NotFoundHttpException('User not found');
        }

        $data = json_decode($request->getContent(), true);

        $bookRequest = new BookRequest();
        $bookRequest->setDescription($data['description']);
        $bookRequest->setRequestingUser($requestingUser);
        $bookRequest->setTattooArtist($tattooArtist);

        return $bookRequest;
    }
}
