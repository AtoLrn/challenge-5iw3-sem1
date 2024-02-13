<?php

namespace App\Controller\BookRequest;

use App\Entity\BookRequest;
use App\Entity\Channel;
use App\Repository\BookRequestRepository;
use App\Repository\ChannelRepository;
use App\Repository\StudioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

#[AsController]
class BookRequestPatchController
{
    public function __construct(
        private BookRequestRepository $bookRequestRepository,
        private ChannelRepository $channelRepository,
        private StudioRepository $studioRepository,
        protected Security $security,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke($id, Request $request): BookRequest
    {
        $user = $this->security->getUser();

        $bookRequest = $this->bookRequestRepository->find($id);

        if (!$bookRequest) {
            throw new NotFoundHttpException('Request not found');
        }

        $data = json_decode($request->getContent(), true);

        if ($user !== $bookRequest->getTattooArtist() && !in_array('ROLE_ADMIN', $user->getRoles())) {
            if ($user !== $bookRequest->getRequestingUser() && !in_array('ROLE_ADMIN', $user->getRoles())) {
                throw new UnprocessableEntityHttpException('You\'re not allowed to do that');
            }

            $studio = $this->studioRepository->findOneBy(["id" => $data['studioId']]);

            $bookRequest->setStudio($studio);
            $bookRequest->setTime(new \DateTime($data["date"]));

            return $bookRequest;
        } else {

            if (isset($data['chat']) && $data['chat']) {
                $channel = new Channel();
                $channel->setRequestingUser($bookRequest->getRequestingUser());
                $channel->setTattooArtist($bookRequest->getTattooArtist());
                $channel->setDescription($bookRequest->getDescription());
                $channel->setBookRequest($bookRequest);

                $this->entityManager->persist($channel);
            }

            if (isset($data['duration']) && $data['duration']) {
                $bookRequest->setBook(true);
                $bookRequest->setDuration($data['duration']);
            }

            return $bookRequest;
        }
    }
}
