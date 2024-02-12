<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Controller\Prestation\PrestationCreateController;
use App\Controller\Prestation\PrestationDeleteController;
use App\Controller\Prestation\PrestationPatchController;
use App\Controller\Prestation\PrestationPictureController;
use App\Controller\Prestation\PrestationUserController;
use App\Repository\PrestationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PrestationRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
      new GetCollection(
          controller: PrestationUserController::class,
          normalizationContext: ['groups' => 'prestation:collection'],
          security: 'is_granted("ROLE_USER")'
      ),
      new Post(
          controller: PrestationCreateController::class,
          openapiContext: [
            'requestBody' => [
              'content' => [
                'multipart/form-data' => [
                  'schema' => [
                    'type' => 'object',
                    'properties' => [
                      'name' => [
                        'type' => 'string',
                        'default' => 'John Doe',
                      ],
                      'kind' => [
                        'type' => 'string',
                        'default' => 'Tattoo',
                      ],
                      'picture' => [
                        'type' => 'string',
                        'format' => 'binary',
                      ],
                    ],
                    'required' => [
                      'name',
                      'kind',
                      'picture',
                    ],
                  ],
                ],
              ],
            ],
          ],
          security: 'is_granted("ROLE_USER")',
          deserialize: false
      ),
      new Get(
          normalizationContext: ['groups' => 'prestation:read'],
          denormalizationContext: ['groups' => 'prestation:read'],
          security: 'is_granted("ROLE_USER")'
      ),
      new Patch(
          controller: PrestationPatchController::class,
          normalizationContext: ['groups' => 'prestation:read'],
          denormalizationContext: ['groups' => 'prestation:patch'],
          security: 'is_granted("ROLE_USER")'
      ),
      new Delete(
          controller: PrestationDeleteController::class,
          normalizationContext: ['groups' => 'prestation:read'],
          denormalizationContext: ['groups' => 'prestation:delete'],
          security: 'is_granted("ROLE_USER")'
      ),
        new Post(
            uriTemplate: '/prestations/{id}/update-picture',
            controller: PrestationPictureController::class,
            openapiContext: [
                'summary' => 'Update the picture of a prestation',
                'description' => 'Update the picture of a prestation',
                'parameters' => [
                    [
                        'in' => 'path',
                        'name' => 'id',
                        'required' => true,
                        'type' => 'integer',
                        'description' => 'The id of the prestation to update the picture',
                    ],
                ],
                'requestBody' => [
                    'content' => [
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'picture' => [
                                        'type' => 'string',
                                        'format' => 'binary',
                                    ],
                                ],
                                'required' => ['picture']
                            ]
                        ]
                    ]
                ]
            ],
            normalizationContext: ['groups' => 'prestation:read'],
            security: 'is_granted("ROLE_USER")',
            deserialize: false
        )
    ]
)]
class Prestation
{
    #[Groups(['prestation:collection', 'prestation:read', 'user:read:artist'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['prestation:collection', 'prestation:read', 'prestation:patch', 'user:read:artist'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[Groups(['prestation:collection', 'prestation:read', 'prestation:patch', 'user:read:artist'])]
    #[ORM\Column(length: 255)]
    private ?\App\Enum\Kind $kind = null;

    #[Groups(['prestation:collection', 'prestation:read'])]
    #[ORM\ManyToOne(inversedBy: 'prestations')]
    private ?User $proposedBy = null;

    #[Groups(['prestation:collection', 'user:read:artist', 'prestation:read'])]
    #[ORM\Column(length: 1024, nullable: true)]
    private ?string $picture = null;

    #[Groups(['prestation:collection', 'prestation:read'])]
    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\OneToMany(mappedBy: 'prestation', targetEntity: Feedback::class, orphanRemoval: true)]
    #[Groups(['prestation:collection', 'prestation:read', 'user:read:artist'])]
    private Collection $feedback;

    public function __construct()
    {
        $this->feedback = new ArrayCollection();
    }

    /**
     * @throws \Exception
     */
    #[ORM\PrePersist]
    public function prePersist(): void
    {
        $this->created_at = new \DateTimeImmutable(
            'now',
            new \DateTimeZone('Europe/Paris')
        );
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

    public function getKind(): ?\App\Enum\Kind
    {
        return $this->kind;
    }

    public function setKind(\App\Enum\Kind $kind): self
    {
        $this->kind = $kind;

        return $this;
    }

    public function getProposedBy(): ?User
    {
        return $this->proposedBy;
    }

    public function setProposedBy(?User $proposedBy): static
    {
        $this->proposedBy = $proposedBy;

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

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    /**
     * @return Collection<int, Feedback>
     */
    public function getFeedback(): Collection
    {
        return $this->feedback;
    }

    public function addFeedback(Feedback $feedback): static
    {
        if (!$this->feedback->contains($feedback)) {
            $this->feedback->add($feedback);
            $feedback->setPrestation($this);
        }

        return $this;
    }

    public function removeFeedback(Feedback $feedback): static
    {
        if ($this->feedback->removeElement($feedback)) {
            // set the owning side to null (unless already changed)
            if ($feedback->getPrestation() === $this) {
                $feedback->setPrestation(null);
            }
        }

        return $this;
    }
}
