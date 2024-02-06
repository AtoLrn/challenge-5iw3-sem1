<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Controller\PostPicture\PostCreateController;
use App\Controller\PostPicture\PostGetMeController;
use App\Repository\PostPictureRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PostPictureRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            //security: 'is_granted("ROLE_ADMIN")',
            uriTemplate: '/posts',
            normalizationContext: ['groups' => 'post:collection']
        ),
        new Post(
            uriTemplate: '/posts',
            security: 'is_granted("ROLE_USER")',
            normalizationContext: ['groups' => 'post:create'],
            controller: PostCreateController::class,
            openapiContext: [
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
            deserialize: false
        ),
        new GetCollection(
            uriTemplate: '/me/posts',
            security: 'is_granted("ROLE_USER")',
            controller: PostGetMeController::class,
            normalizationContext: ['groups' => ['post:read']],
        ),
        new Get(
            security: 'is_granted("ROLE_USER")',
            normalizationContext: ['groups' => ['post:read']],
        ),
        new Delete(
            uriTemplate: '/posts/{id}',
            security: 'is_granted("ROLE_USER")',
        )
    ],
    paginationEnabled: false,
)]
class PostPicture
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['post:create', 'post:collection', 'post:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['post:create', 'post:collection', 'post:read'])]
    private ?string $picture = null;

    #[ORM\ManyToOne(inversedBy: 'postPictures')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['post:create', 'post:collection'])]
    private ?User $creator = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function setCreator(?User $creator): static
    {
        $this->creator = $creator;

        return $this;
    }
}
