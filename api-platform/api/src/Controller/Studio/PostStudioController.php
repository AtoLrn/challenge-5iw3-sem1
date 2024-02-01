<?php

namespace App\Controller\Studio;

use App\Entity\Studio;
use App\Repository\StudioRepository;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use DateTimeZone;

#[AsController]
class PostStudioController
{
    public function __construct(
        private Security $security,
        private StudioRepository $studioRepository

    ) {
    }

    public function __invoke(Request $request): Studio
    {
        $data = json_decode($request->getContent(), true);

        $user = $this->security->getUser();

        $studio = new Studio();

        $studio->setOwner($user);

        $studio->setName($data["name"]);
        $studio->setMaxCapacity($data["maxCapacity"]);
        $studio->setLocation($data["location"]);
        $studio->setStatus("pending");

        return $studio;
    }
}
