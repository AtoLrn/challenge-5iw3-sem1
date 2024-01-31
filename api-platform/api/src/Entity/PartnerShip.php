<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PartnerShipRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PartnerShipRepository::class)]
#[ApiResource]
class PartnerShip
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'partnerShips')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['studio:invite:create', 'studio:invite:read', 'partnership:read'])]
    private ?User $userId = null;

    #[ORM\ManyToOne(inversedBy: 'partnerShips')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['studio:invite:create', 'studio:invite:read', 'partnership:read'])]
    private ?Studio $studioId = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['studio:invite:create', 'studio:invite:read', 'partnership:read'])]
    private ?\DateTime $startDate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['studio:invite:create', 'studio:invite:read', 'partnership:read'])]
    private ?\DateTime $endDate = null;

    #[ORM\Column(length: 50)]
    #[Groups(['studio:invite:create', 'studio:invite:read', 'partnership:read'])]
    private ?string $status = null;

    #[ORM\Column]
    #[Groups(['studio:invite:create', 'studio:invite:read', 'partnership:read'])]
    private ?bool $fromStudio = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?User
    {
        return $this->userId;
    }

    public function setUserId(?User $userId): static
    {
        $this->userId = $userId;

        return $this;
    }

    public function getStudioId(): ?Studio
    {
        return $this->studioId;
    }

    public function setStudioId(?Studio $studioId): static
    {
        $this->studioId = $studioId;

        return $this;
    }

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeInterface $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTimeInterface $endDate): static
    {
        $this->endDate = $endDate;

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

    public function isFromStudio(): ?bool
    {
        return $this->fromStudio;
    }

    public function setFromStudio(bool $fromStudio): static
    {
        $this->fromStudio = $fromStudio;

        return $this;
    }
}
