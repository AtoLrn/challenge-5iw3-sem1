<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Controller\Auth\RegistrationController;
use App\Controller\User\GetMeController;
use App\Controller\User\PatchMeController;
use App\Repository\UserRepository;
use DateTimeZone;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
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
            uriTemplate: '/register',
            normalizationContext: ['groups' => 'user:register'],
            denormalizationContext: ['groups' => 'user:register'],
            controller: RegistrationController::class
        ),
        new Post(
            security: 'is_granted("ROLE_ADMIN")',
            denormalizationContext: ['groups' => 'user:create'],
            normalizationContext: ['groups' => 'user:read']
        ),
        new Get(
            security: 'is_granted("ROLE_USER")',
            uriTemplate: '/users/me',
            normalizationContext: ['groups' => 'user:read:me'],
            controller: GetMeController::class
        ),
        new Get(
            normalizationContext: ['groups' => 'user:read']
        ),
        new Patch(
            security: 'is_granted("ROLE_USER")',
            uriTemplate: '/users/me',
            denormalizationContext: ['groups' => 'user:patch:me'],
            controller: PatchMeController::class
        ),
        new Patch(
            security: 'is_granted("ROLE_ADMIN")',
            denormalizationContext: ['groups' => 'user:patch'],
            normalizationContext: ['groups' => 'user:read']
        ),
        new Delete(
            security: 'is_granted("ROLE_ADMIN")',
        )
    ],
    paginationEnabled: false
)]
//#[ApiFilter(SearchFilter::class, properties: ['username' => 'partial'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[Groups(['user:read', 'user:collection', 'user:read:me'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['user:read', 'user:register', 'user:login', 'user:patch', 'user:read:me'])]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    #[Groups(['user:register', 'user:login', 'user:patch'])]
    #[Assert\NotBlank]
    #[ORM\Column]
    private ?string $password = null;

    #[Assert\NotBlank]
    #[Groups(['user:read', 'user:register', 'user:patch', 'user:collection', 'user:read:me'])]
    #[ORM\Column(length: 255, unique: true)]
    private ?string $username = null;

    #[Groups(['user:read', 'user:patch', 'user:collection', 'user:read:me'])]
    #[ORM\Column(length: 255, options: ["default" => 'https://www.gravatar.com/avatar/?d=identicon'])]
    private ?string $picture = 'https://www.gravatar.com/avatar/?d=identicon';

    #[Groups(['user:read', 'user:register', 'user:patch', 'user:read:me'])]
    #[ORM\Column]
    private ?bool $isProfessional = null;

    #[Groups(['user:read', 'user:patch', 'user:read:me'])]
    #[ORM\Column(options: ["default" => false])]
    private ?bool $isBanned = false;

    #[Groups(['user:read', 'user:patch', 'user:read:me'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $instagramToken = null;

    #[Groups(['user:read', 'user:patch', 'user:read:me'])]
    #[ORM\Column(options: ["default" => false])]
    private ?bool $isVerified = false;

    #[Groups(['user:read', 'user:read:me'])]
    #[ORM\Column]
    private ?\DateTime $createdAt = null;

    #[Groups(['user:read', 'user:read:me'])]
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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
