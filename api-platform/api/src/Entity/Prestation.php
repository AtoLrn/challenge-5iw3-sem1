<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Controller\Prestation\PrestationController;
use App\Repository\PrestationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PrestationRepository::class)]
#[ApiResource(
    operations: [
      new GetCollection(
          normalizationContext: ['groups' => 'prestation:collection']
      ),
      new Post(
          controller: PrestationController::class,
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
                      'location' => [
                        'type' => 'string',
                        'default' => 'Paris',
                      ],
                      'proposedBy' => [
                        'type' => 'string',
                        'format' => 'iri-reference',
                        'default' => '43',
                      ],
                      'picture' => [
                        'type' => 'string',
                        'format' => 'binary',
                      ],
                    ],
                    'required' => [
                      'name',
                      'kind',
                      'location',
                      'proposedBy',
                    ],
                  ],
                ],
              ],
            ],
          ],
          deserialize: false
      ),
      new Get(
          normalizationContext: ['groups' => 'prestation:read'],
          denormalizationContext: ['groups' => 'prestation:read']
      ),
      new Patch(
          normalizationContext: ['groups' => 'prestation:read'],
          denormalizationContext: ['groups' => 'prestation:patch']
      ),
      new Delete(
          normalizationContext: ['groups' => 'prestation:read'],
          denormalizationContext: ['groups' => 'prestation:delete']
      ),
    ]
)]
class Prestation
{
    #[Groups(['prestation:collection', 'prestation:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['prestation:collection', 'prestation:read'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[Groups(['prestation:collection', 'prestation:read'])]
    #[ORM\Column(length: 255)]
    private ?\App\Enum\Kind $kind = null;

    #[Groups(['prestation:collection', 'prestation:read'])]
    #[ORM\Column(length: 255)]
    private ?string $location = null;

    #[Groups(['prestation:collection', 'prestation:read'])]
    #[ORM\ManyToOne(inversedBy: 'prestations')]
    private ?User $proposedBy = null;


    #[Groups(['prestation:collection', 'prestation:read'])]
    #[ORM\Column(length: 1024, nullable: true)]
    private ?string $picture = null;

    #[Groups(['prestation:collection', 'prestation:read'])]
    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

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

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;

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
}
