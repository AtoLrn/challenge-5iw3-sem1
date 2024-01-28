<?php

namespace App\Controller\User;

use App\Entity\DayOff;
use App\Entity\User;
use App\Repository\DayOffRepository;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;

#[AsController]
class DayOffController
{
    public function __construct(
        private Security $security,
        private DayOffRepository $dayOffRepository,
        private EntityManagerInterface $entityManager,

    ) {
    }

    public function __invoke(Request $request): DayOff
    {
        $data = json_decode($request->getContent(), true);

        $user = $this->security->getUser();

        $dayOff = new DayOff();

        $dayOff->setUserId($user);

        $dayOff->setStartDate(new \DateTime($data["startDate"]));
        $dayOff->setendDate(new \DateTime($data["endDate"]));

        return $dayOff;
    }
}
