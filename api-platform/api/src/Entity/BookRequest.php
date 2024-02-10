<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Controller\BookRequest\BookRequestCreateController;
use App\Controller\BookRequest\BookRequestDeleteController;
use App\Controller\BookRequest\BookRequestGetMeController;
use App\Controller\BookRequest\BookRequestPatchController;
use App\Repository\BookRequestRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BookRequestRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            security: 'is_granted("ROLE_ADMIN")',
            uriTemplate: '/admin/book-request',
            normalizationContext: ['groups' => 'bookRequest:collection']
        ),
        new Delete(
            security: 'is_granted("ROLE_ADMIN")',
            uriTemplate: '/admin/book-request/{id}',
        ),
        new GetCollection(
            security: 'is_granted("ROLE_USER")',
            uriTemplate: '/me/book-request',
            controller: BookRequestGetMeController::class,
            normalizationContext: ['groups' => 'bookRequest:me:collection']
        ),
        new Post(
            uriTemplate: '/book-request/{id}',
            security: 'is_granted("ROLE_USER")',
            controller: BookRequestCreateController::class,
            denormalizationContext: ['groups' => 'bookRequest:create'],
        ),
        new Patch(
            security: 'is_granted("ROLE_USER")',
            uriTemplate: '/book-request/{id}',
            controller: BookRequestPatchController::class,
            denormalizationContext: ['groups' => 'bookRequest:patch'],
        ),
        new Delete(
            security: 'is_granted("ROLE_USER")',
            uriTemplate: '/book-request/{id}',
            controller: BookRequestDeleteController::class,
        ),
    ],
    paginationEnabled: false,
)]
class BookRequest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['bookRequest:me:collection', 'bookRequest:collection'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['bookRequest:create', 'bookRequest:me:collection', 'bookRequest:patch', 'bookRequest:collection'])]
    private ?string $description = null;

    #[Groups(['bookRequest:me:collection', 'bookRequest:patch', 'bookRequest:collection'])]
    #[ORM\Column(options: ["default" => false])]
    private ?bool $chat = false;

    #[Groups(['bookRequest:me:collection', 'bookRequest:patch', 'bookRequest:collection'])]
    #[ORM\Column(options: ["default" => false])]
    private ?bool $book = false;

    #[ORM\ManyToOne]
    #[Groups(['bookRequest:me:collection', 'bookRequest:collection'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $requestingUser = null;

    #[ORM\ManyToOne]
    #[Groups(['bookRequest:collection'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $tattooArtist = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function isChat(): ?bool
    {
        return $this->chat;
    }

    public function setChat(bool $chat): static
    {
        $this->chat = $chat;

        return $this;
    }

    public function isBook(): ?bool
    {
        return $this->book;
    }

    public function setBook(bool $book): static
    {
        $this->book = $book;

        return $this;
    }

    public function getRequestingUser(): ?User
    {
        return $this->requestingUser;
    }

    public function setRequestingUser(?User $requestingUser): static
    {
        $this->requestingUser = $requestingUser;

        return $this;
    }

    public function getTattooArtist(): ?User
    {
        return $this->tattooArtist;
    }

    public function setTattooArtist(?User $tattooArtist): static
    {
        $this->tattooArtist = $tattooArtist;

        return $this;
    }
}
