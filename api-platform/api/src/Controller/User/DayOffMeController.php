<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Repository\DayOffRepository;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;


#[AsController]
class DayOffMeController
{
    public function __construct(
        private Security $security,
        private DayOffRepository $dayOffRepository,

    ) {
    }

    public function __invoke(): array
    {
        $user = $this->security->getUser();
        $daysOff = $this->dayOffRepository->findBy(['userId' => $user->getId()]);

        return $daysOff;
    }
}
