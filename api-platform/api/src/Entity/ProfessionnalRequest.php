<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Controller\DocumentUploadController;
use App\Repository\ProfessionnalRequestRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProfessionnalRequestRepository::class)]
#[ApiResource]
#[Post(
    controller: DocumentUploadController::class,
    openapiContext: [
      'requestBody' => [
        'content' => [
          'multipart/form-data' => [
            'schema' => [
              'type' => 'object',
              'properties' => [
                'documentFile' => [
                  'type' => 'string',
                  'format' => 'binary',
                ],
              ],
              'required' => ['documentFile'],
            ],
          ],
        ],
      ],
    ],
    normalizationContext: ['groups' => 'professional_request:read'],
    denormalizationContext: ['groups' => 'professional_request:write'],
    deserialize: false
)]
class ProfessionnalRequest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'professionnalRequests')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $requestedBy = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $date = null;

    #[ORM\Column(length: 255)]
    private ?string $status = null;

    #[ORM\Column(length: 1024)]
    private ?string $documentFileUrl = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRequestedBy(): ?User
    {
        return $this->requestedBy;
    }

    public function setRequestedBy(?User $requestedBy): static
    {
        $this->requestedBy = $requestedBy;

        return $this;
    }

    public function getDate(): ?\DateTimeImmutable
    {
        return $this->date;
    }

    public function setDate(\DateTimeImmutable $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getDocumentFileUrl(): ?string
    {
        return $this->documentFileUrl;
    }

    public function setDocumentFileUrl(string $documentFileUrl): static
    {
        $this->documentFileUrl = $documentFileUrl;

        return $this;
    }
}
