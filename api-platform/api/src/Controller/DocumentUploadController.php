<?php

namespace App\Controller;

use App\Entity\ProfessionnalRequest;
use App\Utils\Files;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

#[AsController]
class DocumentUploadController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly Files $files,
    ) {
    }

    public function __invoke(Request $request, ProfessionnalRequest $professionalRequest): ProfessionnalRequest
    {
        $documentFile = $request->files->get('document');

        if (!$documentFile) {
            throw new UnprocessableEntityHttpException('Document file is required');
        }

        $documentFileUrl = $this->files->upload($documentFile, $this->getParameter('kernel.project_dir'));

        $professionalRequest->setDocumentFileUrl($documentFileUrl);

        $this->entityManager->persist($professionalRequest);
        $this->entityManager->flush();

        return $professionalRequest;
    }
}
