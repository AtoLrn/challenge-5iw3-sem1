<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Controller\Feedback\FeedbackCreateController;
use App\Controller\Feedback\FeedbackGetController;
use App\Repository\FeedbackRepository;
use DateTimeZone;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Exception;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: FeedbackRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/admin/feedbacks',
            description: 'Get all feedbacks',
            normalizationContext: ['groups' => 'feedback:collections'],
            security: 'is_granted("ROLE_ADMIN")'
        ),
        new GetCollection(
            uriTemplate: '/artists/{id}/feedbacks',
            controller: FeedbackGetController::class,
            description: 'Get feedbacks for a specific artist',
            normalizationContext: ['groups' => 'feedback:read'],
            security: 'is_granted("ROLE_USER")'
        ),
        new Post(
            controller: FeedbackCreateController::class,
            normalizationContext: ['groups' => 'feedback:read'],
            denormalizationContext: ['groups' => 'feedback:create'],
            security: 'is_granted("ROLE_USER")'
        ),
        new Patch(
            normalizationContext: ['groups' => 'feedback:read'],
            denormalizationContext: ['groups' => 'feedback:create'],
            security: 'is_granted("ROLE_ADMIN")'
        ),
        new Delete(
            normalizationContext: ['groups' => 'feedback:read'],
            denormalizationContext: ['groups' => 'feedback:create'],
            security: 'is_granted("ROLE_ADMIN")'
        ),
    ]
)]
class Feedback
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['feedback:read', 'feedback:collections'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Groups(['feedback:read', 'feedback:create', 'user:read:artist', 'feedback:collections'])]
    #[Assert\Range(notInRangeMessage: 'The rating must be between 1 and 5', min: 1, max: 5)]
    private ?int $rating = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['feedback:read', 'feedback:create', 'user:read:artist', 'feedback:collections'])]
    private ?string $comment = null;

    #[ORM\ManyToOne(inversedBy: 'feedback')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['feedback:read', 'feedback:create', 'admin:collection', 'admin:read', 'feedback:collections'])]
    private ?Prestation $prestation = null;

    #[ORM\Column]
    #[Groups(['feedback:read', 'feedback:collections'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'feedback')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['feedback:read', 'user:read:artist', 'admin:collection', 'admin:read', 'feedback:collections'])]
    private ?User $submittedBy = null;

    /**
     * @throws Exception
     */
    #[ORM\PrePersist]
    public function prePersist(): void
    {
        $this->createdAt = new \DateTimeImmutable('now', new DateTimeZone('Europe/Paris'));
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRating(): ?int
    {
        return $this->rating;
    }

    public function setRating(int $rating): static
    {
        $this->rating = $rating;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(string $comment): static
    {
        $this->comment = $comment;

        return $this;
    }

    public function getPrestation(): ?Prestation
    {
        return $this->prestation;
    }

    public function setPrestation(?Prestation $prestation): static
    {
        $this->prestation = $prestation;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getSubmittedBy(): ?User
    {
        return $this->submittedBy;
    }

    public function setSubmittedBy(?User $submittedBy): static
    {
        $this->submittedBy = $submittedBy;

        return $this;
    }
}
