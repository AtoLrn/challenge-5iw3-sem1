<?php

namespace App\Controller\Studio;

use App\Entity\Studio;
use App\Repository\StudioRepository;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use App\Utils\Files;

#[AsController]
class PostStudioController
{
    public function __construct(
        private Security $security,
        private StudioRepository $studioRepository,
        private Files $files,
    ) {
    }

    public function __invoke(Request $request): Studio
    {
        $user = $this->security->getUser();

        $name = $request->request->get('name');
        $openingTime = $request->request->get('openingTime');
        $closingTime = $request->request->get('closingTime');
        $maxCapacity = $request->request->get('maxCapacity');
        $location = $request->request->get('location');
        $description = $request->request->get('description');
        $monday = $request->request->get('monday') ?? '0';
        $tuesday = $request->request->get('tuesday')  ?? '0';
        $wednesday = $request->request->get('wednesday')  ?? '0';
        $thursday = $request->request->get('thursday')  ?? '0';
        $friday = $request->request->get('friday')  ?? '0';
        $saturday = $request->request->get('saturday')  ?? '0';
        $sunday = $request->request->get('sunday')  ?? '0';

        // Checks if the studio already exists
        if ($this->studioRepository->findOneBy(["name" => $name])) {
            throw new \Exception("The studio named " . $name . " already exists");
        }

        $openingMoment = explode(":", $openingTime);
        $closingMoment = explode(":", $closingTime);
        if (
            intval($openingMoment[0]) > intval($closingMoment[0]) ||
            intval($openingMoment[0]) === intval($closingMoment[0]) && intval($openingMoment[1]) >= intval($closingMoment[1])

        ) {
            throw new \Exception("The opening time must be before the closing time");
        }


        $pictureFile = $request->files->get('picture');

        if (!$pictureFile) {
            throw new UnprocessableEntityHttpException('File needed');
        }


        $pictureFileUrl = $this->files->upload($pictureFile);

        $studio = new Studio();

        $studio->setOwner($user);
        $studio->setName($name);
        $studio->setMaxCapacity($maxCapacity);
        $studio->setLocation($location);
        $studio->setStatus("PENDING");
        $studio->setDescription($description);
        $studio->setOpeningTime($openingTime);
        $studio->setClosingTime($closingTime);
        $studio->setMonday($monday);
        $studio->setTuesday($tuesday);
        $studio->setWednesday($wednesday);
        $studio->setThursday($thursday);
        $studio->setFriday($friday);
        $studio->setSaturday($saturday);
        $studio->setSunday($sunday);
        $studio->setTakenSeats(0);
        $studio->setPicture($pictureFileUrl);

        return $studio;
    }
}
