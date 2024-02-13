<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Controller\BookRequest\BookRequestCreateController;
use App\Controller\BookRequest\BookRequestDeleteController;
use App\Controller\BookRequest\BookRequestArtistUnavailableController;
use App\Controller\BookRequest\BookRequestGetMeController;
use App\Controller\BookRequest\BookRequestGetMeByIdController;
use App\Controller\BookRequest\BookRequestGetMeProController;
use App\Controller\BookRequest\BookRequestGetMeUserController;
use App\Controller\BookRequest\BookRequestPatchController;
use App\Repository\BookRequestRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BookRequestRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/admin/book-request',
            normalizationContext: ['groups' => 'bookRequest:collection'],
            security: 'is_granted("ROLE_ADMIN")'
        ),
        new Delete(
            uriTemplate: '/admin/book-request/{id}',
            security: 'is_granted("ROLE_ADMIN")',
        ),
        new GetCollection(
            uriTemplate: '/pro/book-request',
            controller: BookRequestGetMeController::class,
            normalizationContext: ['groups' => 'bookRequest:me:collection'],
            security: 'is_granted("ROLE_USER")'
        ),
        new Get(
            uriTemplate: '/book-request/{id}',
            controller: BookRequestGetMeByIdController::class,
            normalizationContext: ['groups' => 'bookRequest:me:collection'],
            security: 'is_granted("ROLE_USER")'
        ),
        new GetCollection(
            uriTemplate: '/me/book-request',
            controller: BookRequestGetMeUserController::class,
            normalizationContext: ['groups' => 'bookRequest:me:collection'],
            security: 'is_granted("ROLE_USER")'
        ),
        new Post(
            uriTemplate: '/book-request/{id}',
            controller: BookRequestCreateController::class,
            denormalizationContext: ['groups' => 'bookRequest:create'],
            security: 'is_granted("ROLE_USER")',
        ),
        new Patch(
            uriTemplate: '/book-request/{id}',
            controller: BookRequestPatchController::class,
            denormalizationContext: ['groups' => 'bookRequest:patch'],
            security: 'is_granted("ROLE_USER")',
        ),
        new Delete(
            uriTemplate: '/book-request/{id}',
            controller: BookRequestDeleteController::class,
            security: 'is_granted("ROLE_USER")',
        ),
        new GetCollection(
            uriTemplate: '/book-request/{id}/unavailable',
            controller: BookRequestArtistUnavailableController::class,
            normalizationContext: ['groups' => 'bookRequest:protected', 'skip_null_values' => false],
            security: 'is_granted("ROLE_USER")',
        ),
        new GetCollection(
            uriTemplate: '/pro/me/book-request',
            controller: BookRequestGetMeProController::class,
            normalizationContext: ['groups' => 'bookRequest:me:collection'],
            security: 'is_granted("ROLE_USER")'
        ),
    ],
    paginationEnabled: false,
)]
class BookRequest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['bookRequest:me:collection', 'bookRequest:collection', 'channel:read', 'message:channel:read', 'studio:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['bookRequest:create', 'bookRequest:me:collection', 'bookRequest:patch', 'bookRequest:collection', 'channel:read', 'message:channel:read', 'studio:read'])]
    private ?string $description = null;

    #[Groups(['bookRequest:me:collection', 'bookRequest:patch', 'bookRequest:collection', 'studio:read'])]
    #[ORM\Column(options: ["default" => false])]
    private ?bool $chat = false;

    #[Groups(['bookRequest:me:collection', 'bookRequest:patch', 'bookRequest:collection', 'channel:read', 'message:channel:read', 'studio:read'])]
    #[ORM\Column(options: ["default" => false])]
    private ?bool $book = false;

    #[ORM\ManyToOne]
    #[Groups(['bookRequest:me:collection', 'bookRequest:collection', 'studio:read'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $requestingUser = null;

    #[ORM\ManyToOne]
    #[Groups(['bookRequest:collection', 'bookRequest:me:collection', 'studio:read'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $tattooArtist = null;

    #[Groups(['bookRequest:collection', 'bookRequest:me:collection'])]
    #[ORM\OneToOne(inversedBy: 'bookRequest', cascade: ['persist', 'remove'])]
    private ?Channel $channel = null;

    #[Groups(['bookRequest:me:collection', 'bookRequest:protected', 'bookRequest:patch', 'bookRequest:collection', 'channel:read', 'message:channel:read', 'studio:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $duration = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['bookRequest:me:collection', 'bookRequest:protected', 'bookRequest:patch', 'bookRequest:collection', 'channel:read', 'message:channel:read', 'studio:read'])]
    private ?\DateTimeInterface $time = null;

    #[ORM\ManyToOne(inversedBy: 'bookRequests')]
    #[Groups(['bookRequest:me:collection', 'bookRequest:patch', 'bookRequest:collection', 'channel:read', 'message:channel:read'])]
    private ?Studio $studio = null;

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

    public function getChannel(): ?Channel
    {
        return $this->channel;
    }

    public function setChannel(?Channel $channel): static
    {
        $this->channel = $channel;

        return $this;
    }

    public function getDuration(): ?string
    {
        return $this->duration;
    }

    public function setDuration(?string $duration): static
    {
        $this->duration = $duration;

        return $this;
    }

    public function getTime(): ?\DateTimeInterface
    {
        return $this->time;
    }

    public function setTime(?\DateTimeInterface $time): static
    {
        $this->time = $time;

        return $this;
    }

    public function getStudio(): ?Studio
    {
        return $this->studio;
    }

    public function setStudio(?Studio $studio): static
    {
        $this->studio = $studio;

        return $this;
    }
}
