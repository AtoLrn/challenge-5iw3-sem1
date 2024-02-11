<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Controller\Channel\ChannelCreateController;
use App\Controller\Channel\ChannelGetController;
use App\Controller\Channel\ChannelGetMeController;
use App\Repository\ChannelRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ChannelRepository::class)]
#[ORM\Table(name: '`channel`')]
#[ApiResource(
    operations: [
        new GetCollection(
            //security: 'is_granted("ROLE_ADMIN")',
            normalizationContext: ['groups' => 'channel:collection']
        ),
        new GetCollection(
            //security: 'is_granted("ROLE_USER")',
            uriTemplate: '/me/channels',
            security: 'is_granted("ROLE_USER")',
            controller: ChannelGetMeController::class,
            normalizationContext: ['groups' => ['channel:collection', 'message:channel:read']],
            openapiContext: [
                'parameters' => [
                    [
                        'name' => 'as',
                        'in' => 'query',
                        'description' => 'what type of channels you want to retrieve',
                        'required' => true,
                        'type' => 'string'
                    ]
                ],
                'requestBody' => [
                    'required' => false,
                    'content' => []
                ]
            ]
        ),
        new Post(
            //security: 'is_granted("ROLE_ADMIN")',
            normalizationContext: ['groups' => 'channel:create'],
            controller: ChannelCreateController::class,
            openapiContext: [
                'requestBody' => [
                    'content' => [
                        'application/ld+json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'tattooArtistId' => [
                                        'description' => 'ID of the tatto artist',
                                        'type' => 'int'
                                    ],
                                    'requestingUserId' => [
                                        'description' => 'ID of the requesting User',
                                        'type' => 'int'
                                    ]
                                ],
                                'required' => ['tattooArtistId', 'requestingUserId']
                            ]
                        ]
                    ]
                ]
            ]
        ),
        new Get(
            //security: 'is_granted("ROLE_USER")',
            controller: ChannelGetController::class,
            normalizationContext: ['groups' => ['channel:read', 'message:channel:read']],
        ),

    ],
    paginationEnabled: false,
)]
class Channel
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['channel:collection', 'channel:create', 'channel:read', 'bookRequest:me:collection'])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[Assert\NotBlank]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['channel:collection', 'channel:create', 'channel:read', 'bookRequest:me:collection'])]
    private ?User $tattooArtist = null;

    #[ORM\ManyToOne]
    #[Assert\NotBlank]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['channel:collection', 'channel:create', 'channel:read', 'bookRequest:me:collection'])]
    private ?User $requestingUser = null;

    #[ORM\OneToMany(mappedBy: 'channel', targetEntity: Message::class)]
    #[Groups(['channel:read', 'message:channel:read'])]
    private Collection $messages;

    #[Groups(['channel:read', 'message:channel:read', 'bookRequest:me:collection'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[Groups(['channel:read', 'message:channel:read'])]
    #[ORM\OneToOne(mappedBy: 'channel', cascade: ['persist', 'remove'])]
    private ?BookRequest $bookRequest = null;

    public function __construct()
    {
        $this->messages = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getRequestingUser(): ?User
    {
        return $this->requestingUser;
    }

    public function setRequestingUser(?User $requestingUser): static
    {
        $this->requestingUser = $requestingUser;

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): static
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setChannel($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            // set the owning side to null (unless already changed)
            if ($message->getChannel() === $this) {
                $message->setChannel(null);
            }
        }

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getBookRequest(): ?BookRequest
    {
        return $this->bookRequest;
    }

    public function setBookRequest(?BookRequest $bookRequest): static
    {
        // unset the owning side of the relation if necessary
        if ($bookRequest === null && $this->bookRequest !== null) {
            $this->bookRequest->setChannel(null);
        }

        // set the owning side of the relation if necessary
        if ($bookRequest !== null && $bookRequest->getChannel() !== $this) {
            $bookRequest->setChannel($this);
        }

        $this->bookRequest = $bookRequest;

        return $this;
    }
}
