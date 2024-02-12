<?php

namespace App\Controller\Feedback;

use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class FeedbackGetController
{
    public function __construct(
        private Security $security
    )
    {
    }

    public function __invoke(): array
    {

        $user = $this->security->getUser();
        return $user->getPrestations()->map(fn($prestation) => $prestation->getFeedback())->toArray();
    }
}
