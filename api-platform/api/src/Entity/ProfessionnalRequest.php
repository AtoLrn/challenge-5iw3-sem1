<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ProfessionnalRequestRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProfessionnalRequestRepository::class)]
#[ApiResource]
class ProfessionnalRequest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToMany(mappedBy: 'professionnalRequest', targetEntity: MediaObject::class, orphanRemoval: true)]
    private Collection $mediaObject;

    public function __construct()
    {
        $this->mediaObject = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, MediaObject>
     */
    public function getMediaObject(): Collection
    {
        return $this->mediaObject;
    }

    public function addMediaObject(MediaObject $mediaObject): static
    {
        if (!$this->mediaObject->contains($mediaObject)) {
            $this->mediaObject->add($mediaObject);
            $mediaObject->setProfessionnalRequest($this);
        }

        return $this;
    }

    public function removeMediaObject(MediaObject $mediaObject): static
    {
        if ($this->mediaObject->removeElement($mediaObject)) {
            // set the owning side to null (unless already changed)
            if ($mediaObject->getProfessionnalRequest() === $this) {
                $mediaObject->setProfessionnalRequest(null);
            }
        }

        return $this;
    }
}
