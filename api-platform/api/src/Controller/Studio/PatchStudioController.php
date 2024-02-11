<?php

namespace App\Controller\Studio;

use App\Entity\Studio;
use App\Repository\StudioRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Serializer\SerializerInterface;

#[AsController]
class PatchStudioController
{

    public function __construct(
        private StudioRepository $studioRepository,
        private SerializerInterface $serializer,
    ) {
    }

    public function __invoke($id, Request $request): BookRequest
    {

        $studio = $this->studioRepository->find($id);
        $data = json_decode($request->getContent(), true);

        $name = $request->request->get('name');
        $studio->setName($name);

        $this->entityManager->persist($studio);
    }

}
