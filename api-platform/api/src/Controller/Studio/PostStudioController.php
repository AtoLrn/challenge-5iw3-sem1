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

        // Checks if the studio already exists
        if ($this->studioRepository->findOneBy(["name" => $data["name"]])) {
            throw new \Exception("The studio named " . $data["name"] . " already exists");
        }

        // Checks if the opening time is before the closing time
        if ($data["openingTime"] >= $data["closingTime"]) {
            throw new \Exception("The opening time must be before the closing time");
        }


        $studio = new Studio();

        $studio->setOwner($user);
        $studio->setName($data["name"]);
        $studio->setMaxCapacity($data["maxCapacity"]);
        $studio->setLocation($data["location"]);
        $studio->setStatus("pending");
        $studio->setDescription($data["description"]);
        $studio->setOpeningTime($data["openingTime"]);
        $studio->setClosingTime($data["closingTime"]);
        $studio->setMonday($data["monday"]);
        $studio->setTuesday($data["tuesday"]);
        $studio->setWednesday($data["wednesday"]);
        $studio->setThursday($data["thursday"]);
        $studio->setFriday($data["friday"]);
        $studio->setSaturday($data["saturday"]);
        $studio->setSunday($data["sunday"]);
        $studio->setTakenSeats(0);

        return $studio;
    }
}
