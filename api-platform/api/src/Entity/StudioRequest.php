<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\StudioRequestRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource(
    operations: [
      new GetCollection(
          security: "is_granted('ROLE_USER')"
      ),
      new Post(
          security: "is_granted('ROLE_USER')"
      ),
      new Get(
          security: "is_granted('ROLE_USER')"
      ),
      new Patch(
          security: "is_granted('ROLE_USER')"
      ),
      new Delete(
          security: "is_granted('ROLE_USER')"
      ),
    ],
    paginationEnabled: false
)]
#[ORM\Entity(repositoryClass: StudioRequestRepository::class)]
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

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: Types::STRING, length: 255)]
    private string $status;

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

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        if (!in_array($status, self::VALID_STATUSES)) {
            throw new \InvalidArgumentException('Invalid status value');
        }

        $this->status = $status;

        return $this;
    }
}
