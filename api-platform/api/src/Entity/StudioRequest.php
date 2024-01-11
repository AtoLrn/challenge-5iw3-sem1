<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\StudioRequestRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: StudioRequestRepository::class)]
#[ApiResource]
class StudioRequest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $professionnal = null;

    #[ORM\Column]
    private ?int $studio = null;

    #[ORM\Column]
    private ?int $documents = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $date = null;

    #[ORM\Column(length: 255)]
    private ?string $status = null;

    public const VALID_STATUSES = ['pending', 'accepted', 'rejected'];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProfessionnal(): ?int
    {
        return $this->professionnal;
    }

    public function setProfessionnal(int $professionnal): static
    {
        $this->professionnal = $professionnal;

        return $this;
    }

    public function getStudio(): ?int
    {
        return $this->studio;
    }

    public function setStudio(int $studio): static
    {
        $this->studio = $studio;

        return $this;
    }

    public function getDocuments(): ?int
    {
        return $this->documents;
    }

    public function setDocuments(int $documents): static
    {
        $this->documents = $documents;

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
        if (!in_array($status, self::VALID_STATUSES)) {
            throw new \InvalidArgumentException('Invalid status value');
        }

        $this->status = $status;

        return $this;
    }
}
