<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use App\Controller\Studio\GetStudioInviteController;
use App\Controller\Studio\GetStudioController;
use App\Controller\Studio\PostStudioController;
use App\Controller\Studio\InviteStudioController;
use App\Controller\Studio\GetMyStudioController;
use App\Repository\StudioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use DateTimeZone;

#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => 'studio:read', 'skip_null_values' => false],
        ),
        new GetCollection(
            uriTemplate: '/studio/mine',
            security: 'is_granted("ROLE_USER")',
            controller: GetMyStudioController::class,
            normalizationContext: ['groups' => 'studio:read', 'skip_null_values' => false],
        ),
        new Post(
            uriTemplate: '/verify',
            security: 'is_granted("ROLE_ADMIN")',
            denormalizationContext: ['groups' => 'studio:admin:control', 'studio:creation',],
            normalizationContext: ['groups' => 'studio:read'],
        ),
        new Post(
            uriTemplate: '/studios/add',
            security: 'is_granted("ROLE_USER")',
            denormalizationContext: ['groups' => 'studio:creation'],
            normalizationContext: ['groups' => 'studio:read', 'skip_null_values' => false],
            controller: PostStudioController::class,
            openapiContext: [
                'requestBody' => [
                    'content' => [
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'picture' => [
                                        'type' => 'string',
                                        'format' => 'binary'
                                    ],
                                    'name' => [
                                        'type' => 'string',
                                        'default' => 'string'
                                    ],
                                    'maxCapacity' => [
                                        'type' => 'number',
                                        'default' => '10'
                                    ],
                                    'openingTime' => [
                                        'type' => 'string',
                                        'default' => '10:00'
                                    ],
                                    'closingTime' => [
                                        'type' => 'string',
                                        'default' => '20:00'
                                    ],
                                    'location' => [
                                        'type' => 'string',
                                        'default' => 'string'
                                    ],
                                    'description' => [
                                        'type' => 'string',
                                        'default' => 'string'
                                    ],
                                ],
                                'required' => ['picture']
                            ]
                        ]
                    ]
                ]
            ],
            deserialize: false
        ),
        new Post(
            uriTemplate: '/studio/{id}/invites',
            security: 'is_granted("ROLE_USER")',
            denormalizationContext: ['groups' => 'studio:invite:create'],
            normalizationContext: ['groups' => 'studio:invite:read', 'skip_null_values' => false],
            controller: InviteStudioController::class
        ),
        new GetCollection(
            uriTemplate: '/studio/{id}/invites',
            security: 'is_granted("ROLE_USER")',
            normalizationContext: ['groups' => 'studio:invite:read', 'skip_null_values' => false],
            controller: GetStudioInviteController::class
        ),
        new Get(
            uriTemplate: '/studio/search/{id}',
            normalizationContext: ['groups' => 'studio:read', 'skip_null_values' => false],
            controller: GetStudioController::class
        ),
        new GetCollection(
            uriTemplate: '/studios',
            security: 'is_granted("ROLE_USER")',
            normalizationContext: ['groups' => 'studio:read', 'skip_null_values' => false],
            denormalizationContext: ['groups' => 'studio:read'],
        ),
    ]
)]
#[ORM\Entity(repositoryClass: StudioRepository::class)]
class Studio
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['studio:read', 'partnership:read'])]
    private ?int $id = null;

    #[Groups(['studio:creation', 'studio:read', 'partnership:read'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column(length: 255)]
    private ?string $location = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column]
    private ?int $maxCapacity = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column]
    private ?\DateTime $createdAt = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column]
    private ?\DateTime $updatedAt = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\ManyToOne(inversedBy: 'studios')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[Groups(['studio:admin:control', 'studio:read'])]
    #[ORM\Column(length: 255, options: ["default" => "PENDING"])]
    private ?string $status = null;

    #[Groups(['studio:read'])]
    #[ORM\OneToMany(mappedBy: 'studioId', targetEntity: PartnerShip::class, orphanRemoval: true)]
    private Collection $partnerShips;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[Groups(['studio:creation', 'studio:read'])]
    private ?string $openingTime = null;

    #[Groups(['studio:creation', 'studio:read'])]
    private ?string $closingTime = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $monday = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $tuesday = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $wednesday = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $thursday = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $friday = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $saturday = null;

    #[Groups(['studio:creation', 'studio:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $sunday = null;

    #[ORM\Column]
    #[Groups(['studio:creation', 'studio:read'])]
    private ?int $takenSeats = 0;

    #[ORM\Column(length: 255)]
    #[Groups(['studio:creation', 'studio:read'])]
    private ?string $picture = null;


    public function __construct()
    {
        $this->partnerShips = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function prePersist()
    {
        $this->createdAt = new \DateTime('now', new DateTimeZone('Europe/Paris'));
        $this->updatedAt = new \DateTime('now', new DateTimeZone('Europe/Paris'));
    }


    #[ORM\PreUpdate]
    public function preUpdate()
    {
        $this->updatedAt = new \DateTime('now', new DateTimeZone('Europe/Paris'));
    }

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

    /**
     * @return Collection<int, PartnerShip>
     */
    public function getPartnerShips(): Collection
    {
        return $this->partnerShips;
    }

    public function addPartnerShip(PartnerShip $partnerShip): static
    {
        if (!$this->partnerShips->contains($partnerShip)) {
            $this->partnerShips->add($partnerShip);
            $partnerShip->setStudioId($this);
        }

        return $this;
    }

    public function removePartnerShip(PartnerShip $partnerShip): static
    {
        if ($this->partnerShips->removeElement($partnerShip)) {
            // set the owning side to null (unless already changed)
            if ($partnerShip->getStudioId() === $this) {
                $partnerShip->setStudioId(null);
            }
        }

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getOpeningTime(): ?string
    {
        return $this->openingTime;
    }

    public function setOpeningTime(string $openingTime): static
    {
        $this->openingTime = $openingTime;

        return $this;
    }

    public function getClosingTime(): ?string
    {
        return $this->closingTime;
    }

    public function setClosingTime(string $closingTime): static
    {
        $this->closingTime = $closingTime;

        return $this;
    }

    public function getMonday(): ?string
    {
        return $this->monday;
    }

    public function setMonday(?string $monday): static
    {
        $this->monday = $monday;

        return $this;
    }

    public function getTuesday(): ?string
    {
        return $this->tuesday;
    }

    public function setTuesday(?string $tuesday): static
    {
        $this->tuesday = $tuesday;

        return $this;
    }

    public function getWednesday(): ?string
    {
        return $this->wednesday;
    }

    public function setWednesday(?string $wednesday): static
    {
        $this->wednesday = $wednesday;

        return $this;
    }

    public function getThursday(): ?string
    {
        return $this->thursday;
    }

    public function setThursday(?string $thursday): static
    {
        $this->thursday = $thursday;

        return $this;
    }

    public function getFriday(): ?string
    {
        return $this->friday;
    }

    public function setFriday(?string $friday): static
    {
        $this->friday = $friday;

        return $this;
    }

    public function getSaturday(): ?string
    {
        return $this->saturday;
    }

    public function setSaturday(?string $saturday): static
    {
        $this->saturday = $saturday;

        return $this;
    }

    public function getSunday(): ?string
    {
        return $this->sunday;
    }

    public function setSunday(?string $sunday): static
    {
        $this->sunday = $sunday;

        return $this;
    }

    public function getTakenSeats(): ?int
    {
        return $this->takenSeats;
    }

    public function setTakenSeats(int $takenSeats): static
    {
        $this->takenSeats = $takenSeats;

        return $this;
    }

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function setPicture(string $picture): static
    {
        $this->picture = $picture;

        return $this;
    }
}
