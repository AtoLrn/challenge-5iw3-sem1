<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Controller\Channel\ChannelCreateController;
use App\Controller\Channel\ChannelGetController;
use App\Repository\ChannelRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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
            uriTemplate: '/me/channels',
            security: 'is_granted("ROLE_USER")',
            controller: ChannelGetController::class,
            normalizationContext: ['groups' => 'channel:collection']
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
            denormalizationContext: ['groups' => 'channel:read',],
            normalizationContext: ['groups' => 'channel:read'],
        ),

    ],
    paginationEnabled: false,
)]
class Channel
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['channel:collection', 'channel:create', 'channel:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[Assert\NotBlank]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['channel:collection', 'channel:create', 'channel:read'])]
    private ?User $tattooArtist = null;

    #[ORM\ManyToOne]
    #[Assert\NotBlank]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['channel:collection', 'channel:create', 'channel:read'])]
    private ?User $requestingUser = null;

    #[ORM\OneToMany(mappedBy: 'channel', targetEntity: Message::class)]
    #[Groups(['channel:read'])]
    private Collection $messages;

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
}
