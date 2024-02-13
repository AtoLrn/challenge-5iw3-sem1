<?php

namespace App\Controller\Feedback;

use App\Entity\Feedback;
use App\Entity\Prestation;
use App\Repository\PrestationRepository;
use Exception;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class FeedbackCreateController
{
    public function __construct(
        private Security $security,
        private PrestationRepository $prestationRepository
    ) {

    }

    /**
     * @throws Exception
     */
    public function __invoke($id, $data): Feedback
    {
        $user = $this->security->getUser();

        $prestation = $this->prestationRepository->find($id);
        if (!$prestation) {
            throw new Exception("Prestation not found");
        }

        $feedback = new Feedback();
        $feedback->setRating($data->getRating());
        $feedback->setComment($data->getComment());
        $feedback->setSubmittedBy($user);
        $feedback->setPrestation($prestation);

        return $feedback;
    }
}
