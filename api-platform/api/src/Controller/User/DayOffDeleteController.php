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
class DayOffDeleteController
{
    public function __construct(
        private Security $security,
        private DayOffRepository $dayOffRepository,
        private EntityManagerInterface $entityManager,

    ) {
    }

    public function __invoke(): DayOff
    {
        $user = $this->security->getUser();

        $dayOff = $this->dayOffRepository->findOneBy(["userId" => $user->getId()]);

        if (!$dayOff) {
            return null;
        }


        return $dayOff;
    }
}
