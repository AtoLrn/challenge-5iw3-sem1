<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\DayOffRepository;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use App\Controller\User\DayOffController;
use App\Controller\User\DayOffMeController;
use App\Controller\User\DayOffDeleteController;
use Symfony\Component\Serializer\Annotation\Groups;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DayOffRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            security: 'is_granted("ROLE_USER")',
            normalizationContext: ['groups' => 'day-off:read'],
            controller: DayOffMeController::class
        ),
        new Post(
            security: 'is_granted("ROLE_USER")',
            denormalizationContext: ['groups' => 'day-off:create'],
            normalizationContext: ['groups' => 'day-off:read'],
            controller: DayOffController::class
        ),
        new Delete(
            uriTemplate: '/day_offs/{id}',
            security: 'is_granted("ROLE_USER")',
            denormalizationContext: ['groups' => 'day-off:create'],
            normalizationContext: ['groups' => 'day-off:read'],
            controller: DayOffDeleteController::class
        ),
    ]
)]
class DayOff
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['day-off:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['day-off:read'])]
    private ?User $userId = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['day-off:read', 'day-off:create'])]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['day-off:read', 'day-off:create'])]
    private ?\DateTimeInterface $endDate = null;

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
}
