<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PartnerShipRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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
    #[Groups(['partnership:read', 'partnership:read'])]
    private ?int $id = null;

    #[Groups(['partnership:read', 'partnership:read'])]
    #[ORM\OneToMany(mappedBy: 'partnerShip', targetEntity: User::class)]
    private Collection $userId;

    #[Groups(['partnership:read', 'partnership:read'])]
    #[ORM\OneToMany(mappedBy: 'partnerShip', targetEntity: Studio::class)]
    private Collection $studioId;

    #[Groups(['partnership:read', 'partnership:read'])]
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $startDate = null;

    #[Groups(['partnership:read', 'partnership:read'])]
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $endDate = null;

    #[Groups(['partnership:read', 'partnership:read'])]
    #[ORM\Column(length: 255)]
    private ?string $status = null;

    #[Groups(['partnership:read', 'partnership:read'])]
    #[ORM\Column]
    private ?bool $fromStudio = null;

    public function __construct()
    {
        $this->userId = new ArrayCollection();
        $this->studioId = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUserId(): Collection
    {
        return $this->userId;
    }

    public function addUserId(User $userId): static
    {
        if (!$this->userId->contains($userId)) {
            $this->userId->add($userId);
            $userId->setPartnerShip($this);
        }

        return $this;
    }

    public function removeUserId(User $userId): static
    {
        if ($this->userId->removeElement($userId)) {
            // set the owning side to null (unless already changed)
            if ($userId->getPartnerShip() === $this) {
                $userId->setPartnerShip(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Studio>
     */
    public function getStudioId(): Collection
    {
        return $this->studioId;
    }

    public function addStudioId(Studio $studioId): static
    {
        if (!$this->studioId->contains($studioId)) {
            $this->studioId->add($studioId);
            $studioId->setPartnerShip($this);
        }

        return $this;
    }

    public function removeStudioId(Studio $studioId): static
    {
        if ($this->studioId->removeElement($studioId)) {
            // set the owning side to null (unless already changed)
            if ($studioId->getPartnerShip() === $this) {
                $studioId->setPartnerShip(null);
            }
        }

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
