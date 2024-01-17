<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use App\Repository\StudioRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/verify',
            security: 'is_granted("ROLE_ADMIN")',
            denormalizationContext: ['groups' => 'studio:admin:control', 'studio:creation',],
            normalizationContext: ['groups' => 'studio:read'],
        ),
        new Post(
            security: 'is_granted("ROLE_USER")',
            denormalizationContext: ['groups' => 'studio:creation', 'skip_null_values' => false],
            normalizationContext: ['groups' => 'studio:read', 'skip_null_values' => false],
        ),

    ]
)]
#[ORM\Entity(repositoryClass: StudioRepository::class)]
class Studio
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column(length: 255)]
    private ?string $location = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $maxCapacity = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $updatedAt = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\ManyToOne(inversedBy: 'studios')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[Groups(['studio:admin:control', 'studio:read'])]
    #[ORM\Column(length: 255, options: ["default" => "PENDING"])]
    private ?string $status = "PENDING";

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function getMaxCapacity(): ?int
    {
        return $this->maxCapacity;
    }

    public function setMaxCapacity(int $maxCapacity): static
    {
        $this->maxCapacity = $maxCapacity;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status ?? "PENDING";

        return $this;
    }

    public function approve(): static
    {
        $this->status = "APPROVED";

        return $this;
    }

    public function deny(): static
    {
        $this->status = "APPROVED";

        return $this;
    }
}
