<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\UserRepository;
use DateTimeZone;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\HasLifecycleCallbacks]
#[UniqueEntity(fields: ['email', 'username'])]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => 'user:collection']
        ),
        new Post(
            //validationContext: ['groups' => ['Default' => 'user:create']],
            denormalizationContext: ['groups' => 'user:create']
        ),
        new Get(
            normalizationContext: ['groups' => 'user:read']
        ),
        new Put(),
        new Patch(
            denormalizationContext: ['groups' => 'user:patch']
        ),
        new Delete()
    ]
)]
//#[ApiFilter(SearchFilter::class, properties: ['username' => 'partial'])]
class User
{
    #[Groups(['user:read', 'user:collection'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Assert\NotBlank]
    #[Groups(['user:read', 'user:create', 'user:patch', 'user:collection'])]
    #[ORM\Column(length: 255, unique: true)]
    private ?string $username = null;

    #[Groups(['user:create', 'user:patch'])]
    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[Groups(['user:read', 'user:create', 'user:patch'])]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[ORM\Column(length: 255, unique: true)]
    private ?string $email = null;

    #[Groups(['user:read', 'user:patch', 'user:collection'])]
    #[ORM\Column(length: 255, options: ["default" => 'https://www.gravatar.com/avatar/?d=identicon'])]
    private ?string $picture = 'https://www.gravatar.com/avatar/?d=identicon';

    #[Groups(['user:read', 'user:create', 'user:patch'])]
    #[ORM\Column]
    private ?bool $isProfessional = null;

    #[ORM\Column(options: ["default" => false])]
    private ?bool $isAdmin = false;

    #[Groups(['user:read', 'user:patch'])]
    #[ORM\Column(options: ["default" => false])]
    private ?bool $isBanned = false;

    #[Groups(['user:read', 'user:patch'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $instagramToken = null;

    #[Groups(['user:read', 'user:patch'])]
    #[ORM\Column(options: ["default" => false])]
    private ?bool $isVerified = false;

    #[Groups(['user:read'])]
    #[ORM\Column]
    private ?\DateTime $createdAt = null;

    #[Groups(['user:read'])]
    #[ORM\Column]
    private ?\DateTime $updatedAt = null;

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

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

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

    public function isIsProfessional(): ?bool
    {
        return $this->isProfessional;
    }

    public function setIsProfessional(bool $isProfessional): static
    {
        $this->isProfessional = $isProfessional;

        return $this;
    }

    public function isIsAdmin(): ?bool
    {
        return $this->isAdmin;
    }

    public function setIsAdmin(bool $isAdmin): static
    {
        $this->isAdmin = $isAdmin;

        return $this;
    }

    public function isIsBanned(): ?bool
    {
        return $this->isBanned;
    }

    public function setIsBanned(bool $isBanned): static
    {
        $this->isBanned = $isBanned;

        return $this;
    }

    public function getInstagramToken(): ?string
    {
        return $this->instagramToken;
    }

    public function setInstagramToken(?string $instagramToken): static
    {
        $this->instagramToken = $instagramToken;

        return $this;
    }

    public function isIsVerified(): ?bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

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

    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTime $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
