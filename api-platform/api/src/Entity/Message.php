<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Controller\Message\MessageSendController;
use App\Repository\MessageRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Channel;
use DateTimeZone;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
#[ORM\Table(name: '`message`')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/send',
            normalizationContext: ['groups' => 'message:send'],
            denormalizationContext: ['groups' => 'message:send'],
            controller: MessageSendController::class,
            //security: 'is_granted("ROLE_USER")',
            deserialize: false,
            openapiContext: [
                'requestBody' => [
                    'content' => [
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'channelId' => [
                                        'type' => 'string',
                                        'default' => 'id',
                                    ],
                                    'content' => [
                                        'type' => 'string',
                                        'default' => 'content',
                                    ],
                                    'file' => [
                                        'type' => 'string',
                                        'format' => 'binary',
                                    ],
                                ],
                                'required' => ['channelId', 'content']
                            ]
                        ]
                    ]
                ]
            ]
        ),
    ]
)]
class Message
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['message:send', 'channel:read'])]
    #[ORM\ManyToOne(inversedBy: 'messages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $sender = null;

    #[Groups(['message:send', 'channel:read'])]
    #[ORM\ManyToOne(inversedBy: 'messages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?channel $channel = null;

    #[Groups(['message:send', 'channel:read'])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $content = null;

    #[Groups(['message:send', 'channel:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $picture = null;

    #[Groups(['message:send', 'channel:read'])]
    #[ORM\Column]
    private ?\DateTime $createdAt = null;

    #[ORM\PrePersist]
    public function prePersist()
    {
        $this->createdAt = new \DateTime('now', new DateTimeZone('Europe/Paris'));
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSender(): ?User
    {
        return $this->sender;
    }

    public function setSender(?User $sender): static
    {
        $this->sender = $sender;

        return $this;
    }

    public function getChannel(): ?channel
    {
        return $this->channel;
    }

    public function setChannel(?channel $channel): static
    {
        $this->channel = $channel;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function setPicture(?string $picture): static
    {
        $this->picture = $picture;

        return $this;
    }

    public function getCreatedAt(): ?\DateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTime $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
