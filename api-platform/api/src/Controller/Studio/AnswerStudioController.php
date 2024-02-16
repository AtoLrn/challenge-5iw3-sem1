<?php

namespace App\Controller\Studio;

use App\Entity\PartnerShip;
use App\Entity\Studio;
use App\Repository\UserRepository;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;


#[AsController]
class AnswerStudioController
{
    public function __construct(
        private Security $security,
        private UserRepository $userRepository

    ) {
    }

    public function __invoke(PartnerShip $partnerShip, Request $request): PartnerShip
    {
        $data = json_decode($request->getContent(), true);

        $user = $this->security->getUser();

        if ($partnerShip->getUserId()->getId() !== $user->getId()) {
            throw new UnprocessableEntityHttpException('This partnership is not for you');
        }

        if ($partnerShip->getStatus() !== "PENDING") {
            throw new UnprocessableEntityHttpException('This request have already been answered');
        }

        if ($data["status"] !== "ACCEPTED" && $data["status"] !== "DENIED") {
            throw new UnprocessableEntityHttpException('Status should be ACCEPTED or DENIED');
        }

        $partnerShip->setStatus($data["status"]);

        return $partnerShip;
    }
}
