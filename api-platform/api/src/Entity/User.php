<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Controller\Auth\ForgetPasswordController;
use App\Controller\Auth\RegistrationController;
use App\Controller\User\ArtistController;
use App\Controller\User\GetArtistController;
use App\Controller\Auth\VerifyController;
use App\Controller\User\ArtistWaitingController;
use App\Controller\User\GetMeController;
use App\Controller\User\PatchMeController;
use App\Controller\User\ProfilePictureController;
use App\Controller\User\ResetPasswordController;
use App\Controller\User\UpdatePasswordController;
use App\Repository\UserRepository;
use DateTimeZone;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
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
            security: 'is_granted("ROLE_ADMIN")',
            uriTemplate: '/admin/users',
            normalizationContext: ['groups' => 'admin:collection']
        ),
        new Patch(
            security: 'is_granted("ROLE_ADMIN")',
            uriTemplate: '/admin/users/{id}',
            denormalizationContext: ['groups' => 'admin:patch'],
        ),
        new Get(
            security: 'is_granted("ROLE_ADMIN")',
            uriTemplate: '/admin/users/{id}',
            normalizationContext: ['groups' => 'admin:read']
        ),
        new GetCollection(
            security: 'is_granted("ROLE_ADMIN")',
            uriTemplate: '/admin/artist/waiting',
            normalizationContext: ['groups' => 'admin:collection'],
            controller: ArtistWaitingController::class,
        ),
        new Delete(
            security: 'is_granted("ROLE_ADMIN")',
            uriTemplate: '/admin/users/{id}',
        ),
        new GetCollection(
            normalizationContext: ['groups' => 'user:collection']
        ),
        new Post(
            uriTemplate: '/verify',
            normalizationContext: ['groups' => 'user:register:read'],
            controller: VerifyController::class,
            deserialize: false,
            openapiContext: [
                'parameters' => [
                    [
                        'name' => 'token',
                        'in' => 'query',
                        'description' => 'token to validate email',
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
            uriTemplate: '/register',
            normalizationContext: ['groups' => 'user:register:read'],
            denormalizationContext: ['groups' => 'user:register'],
            controller: RegistrationController::class,
            deserialize: false,
            openapiContext: [
                'requestBody' => [
                    'content' => [
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'email' => [
                                        'type' => 'string',
                                        'default' => 'user@example.com'
                                    ],
                                    'password' => [
                                        'type' => 'string',
                                        'default' => 'password'
                                    ],
                                    'username' => [
                                        'type' => 'string',
                                        'default' => 'string'
                                    ],
                                    'isProfessional' => [
                                        'type' => 'boolean',
                                        'default' => 'false'
                                    ],
                                    'kbisFile' => [
                                        'type' => 'string',
                                        'format' => 'binary',
                                    ],
                                ],
                                'required' => ['email', 'password', 'username', 'isProfessional']
                            ]
                        ]
                    ]
                ]
            ]
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
            controller: GetMeController::class,
            read: false
        ),
        new GetCollection(
            uriTemplate: '/artists',
            normalizationContext: ['groups' => 'user:read:artist'],
            controller: ArtistController::class,
            read: false
        ),
        new Get(
            uriTemplate: '/artists/{id}',
            normalizationContext: ['groups' => 'user:read:artist'],
            controller: GetArtistController::class,
            read: false
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
        new Post(
            uriTemplate: '/forget-password',
            normalizationContext: ['groups' => 'user:forget-password'],
            denormalizationContext: ['groups' => 'user:forget-password'],
            controller: ForgetPasswordController::class,
        ),
        new Patch(
            uriTemplate: '/reset-password',
            denormalizationContext: ['groups' => 'user:patch:password'],
            normalizationContext: ['groups' => 'user:read:me'],
            controller: ResetPasswordController::class,
            openapiContext: [
                'parameters' => [
                    [
                        'name' => 'token',
                        'in' => 'query',
                        'description' => 'token to reset password',
                        'required' => true,
                        'type' => 'string'
                    ]
                ]
            ]
        ),
        new Patch(
            security: 'is_granted("ROLE_USER")',
            uriTemplate: '/users/me/update-password',
            denormalizationContext: ['groups' => 'user:patch:password'],
            normalizationContext: ['groups' => 'user:read:me'],
            controller: UpdatePasswordController::class,
            openapiContext: [
                'requestBody' => [
                    'content' => [
                        'application/merge-patch+json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'currentPassword' => [
                                        'description' => 'Current password of User',
                                        'type' => 'string'
                                    ],
                                    'newPassword' => [
                                        'description' => 'New password to use for User',
                                        'type' => 'string'
                                    ]
                                ],
                                'required' => ['currentPassword', 'newPassword']
                            ]
                        ]
                    ]
                ]
            ]
        ),
        // single POST route needed because of PATCH don't support form-data files
        new Post(
            uriTemplate: '/users/me/update-profil-picture',
            normalizationContext: ['groups' => 'user:read:me'],
            controller: ProfilePictureController::class,
            deserialize: false,
            openapiContext: [
                'requestBody' => [
                    'content' => [
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'profilePictureFile' => [
                                        'type' => 'string',
                                        'format' => 'binary',
                                    ],
                                ],
                                'required' => ['profilePictureFile']
                            ]
                        ]
                    ]
                ]
            ]
        )
    ],
    paginationEnabled: false
)]
//#[ApiFilter(SearchFilter::class, properties: ['username' => 'partial'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[Groups(['admin:collection', 'admin:read', 'post:collection', 'user:read', 'message:channel:read', 'channel:read', 'user:collection', 'user:read:me', 'channel:collection', 'user:read:artist', 'partnership:read', 'studio:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['admin:read', 'admin:collection', 'post:collection', 'user:read', 'user:forget-password', 'user:collection', 'user:register', 'user:register:read', 'user:login', 'admin:patch', 'user:read:me', 'user:patch:me'])]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[Groups(['admin:read', 'admin:collection', 'admin:patch', 'user:read', 'user:collection', 'user:read:me'])]
    #[ORM\Column]
    # Possible roles : ROLE_USER, ROLE_ADMIN, ROLE_PRO, ROLE_STUDIO
    private array $roles = [];

    #[Groups(['user:register', 'user:login', 'user:patch:password'])]
    #[Assert\NotBlank]
    #[ORM\Column]
    private ?string $password = null;

    #[Assert\NotBlank]
    #[Groups(['admin:read', 'admin:collection', 'post:collection', 'channel:collection', 'channel:read', 'user:read', 'user:read:artist',  'user:register', 'user:register:read', 'admin:patch', 'user:collection', 'user:read:me', 'user:patch:me', 'studio:invite:read', 'partnership:read', 'studio:read'])]
    #[Assert\Length(min: 4, max: 32)]
    #[ORM\Column(length: 255, unique: true)]
    private ?string $username = null;

    #[Groups(['admin:read', 'admin:collection', 'post:collection', 'channel:collection', 'channel:read', 'user:read', 'user:read:artist', 'admin:patch', 'user:collection', 'user:read:me', 'user:patch:me', 'studio:invite:read', 'partnership:read', 'studio:read'])]
    #[ORM\Column(length: 255, options: ["default" => 'https://www.gravatar.com/avatar/?d=identicon'])]
    private ?string $picture = 'https://www.gravatar.com/avatar/?d=identicon';

    #[Groups(['admin:read', 'admin:collection', 'user:read', 'admin:patch'])]
    #[ORM\Column(options: ["default" => false])]
    private ?bool $isBanned = false;

    #[Groups(['admin:read', 'admin:collection', 'user:read', 'admin:patch', 'user:read:me'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $instagramToken = null;

    #[Groups(['admin:read', 'admin:collection', 'user:read', 'user:read:me'])]
    #[ORM\Column]
    private ?\DateTime $createdAt = null;

    #[Groups(['admin:read', 'admin:collection', 'user:read', 'user:read:me'])]
    #[ORM\Column]
    private ?\DateTime $updatedAt = null;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Studio::class)]
    private Collection $studios;

    #[Groups(['admin:read', 'admin:collection', 'user:patch:me', 'user:read', 'admin:patch', 'user:collection', 'user:read:me', 'user:patch:me'])]
    #[ORM\Column(type: Types::TEXT, nullable: true, options: ["default" => "Hello this is me"])]
    private ?string $description = "Hello this is me";

    #[Groups(['admin:read', 'admin:collection', 'user:read', 'user:read:me'])]
    #[ORM\Column(length: 1024, nullable: true)]
    private ?string $kbisFileUrl = null;

    #[ORM\OneToMany(mappedBy: 'proposedBy', targetEntity: Prestation::class)]
    private Collection $prestations;

    #[ORM\OneToMany(mappedBy: 'userId', targetEntity: PartnerShip::class, orphanRemoval: true)]
    private Collection $partnerShips;
    #
    #[ORM\OneToMany(mappedBy: 'sender', targetEntity: Message::class)]
    private Collection $messages;

    #[Groups(['admin:read', 'admin:collection', 'user:read', 'admin:patch', 'user:read:me'])]
    #[ORM\Column(options: ["default" => false])]
    private ?bool $kbisVerified = false;

    #[ORM\OneToMany(mappedBy: 'creator', targetEntity: PostPicture::class, orphanRemoval: true)]
    private Collection $postPictures;

    #[Groups(['admin:read', 'admin:collection', 'user:read', 'user:collection', 'admin:patch', 'user:read:me'])]
    #[ORM\Column(options: ["default" => false])]
    private ?bool $verified = false;

    public function __construct()
    {
        $this->studios = new ArrayCollection();
        $this->prestations = new ArrayCollection();
        $this->partnerShips = new ArrayCollection();
        $this->messages = new ArrayCollection();
        $this->postPictures = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, Studio>
     */
    public function getStudios(): Collection
    {
        return $this->studios;
    }

    public function addStudio(Studio $studio): static
    {
        if (!$this->studios->contains($studio)) {
            $this->studios->add($studio);
            $studio->setOwner($this);
        }

        return $this;
    }

    public function removeStudio(Studio $studio): static
    {
        if ($this->studios->removeElement($studio)) {
            // set the owning side to null (unless already changed)
            if ($studio->getOwner() === $this) {
                $studio->setOwner(null);
            }
        }
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

    public function getKbisFileUrl(): ?string
    {
        return $this->kbisFileUrl;
    }

    public function setKbisFileUrl(?string $kbisFileUrl): static
    {
        $this->kbisFileUrl = $kbisFileUrl;

        return $this;
    }

    /**
     * @return Collection<int, Prestation>
     */
    public function getPrestations(): Collection
    {
        return $this->prestations;
    }

    public function addPrestation(Prestation $prestation): static
    {
        if (!$this->prestations->contains($prestation)) {
            $this->prestations->add($prestation);
            $prestation->setProposedBy($this);
        }

        return $this;
    }

    public function removePrestation(Prestation $prestation): static
    {
        if ($this->prestations->removeElement($prestation)) {
            // set the owning side to null (unless already changed)
            if ($prestation->getProposedBy() === $this) {
                $prestation->setProposedBy(null);
            }
        }

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
            $message->setSender($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            // set the owning side to null (unless already changed)
            if ($message->getSender() === $this) {
                $message->setSender(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, PartnerShip>
     */
    public function getPartnerShips(): Collection
    {
        return $this->partnerShips;
    }

    public function addPartnerShip(PartnerShip $partnerShip): static
    {
        if (!$this->partnerShips->contains($partnerShip)) {
            $this->partnerShips->add($partnerShip);
            $partnerShip->setUserId($this);
        }

        return $this;
    }

    public function removePartnerShip(PartnerShip $partnerShip): static
    {
        if ($this->partnerShips->removeElement($partnerShip)) {
            // set the owning side to null (unless already changed)
            if ($partnerShip->getUserId() === $this) {
                $partnerShip->setUserId(null);
            }
        }

        return $this;
    }

    public function isKbisVerified(): ?bool
    {
        return $this->kbisVerified;
    }

    public function setKbisVerified(bool $kbisVerified): static
    {
        $this->kbisVerified = $kbisVerified;

        return $this;
    }

    /**
     * @return Collection<int, PostPicture>
     */
    public function getPostPictures(): Collection
    {
        return $this->postPictures;
    }

    public function addPostPicture(PostPicture $postPicture): static
    {
        if (!$this->postPictures->contains($postPicture)) {
            $this->postPictures->add($postPicture);
            $postPicture->setCreator($this);
        }

        return $this;
    }

    public function removePostPicture(PostPicture $postPicture): static
    {
        if ($this->postPictures->removeElement($postPicture)) {
            // set the owning side to null (unless already changed)
            if ($postPicture->getCreator() === $this) {
                $postPicture->setCreator(null);
            }
        }

        return $this;
    }

    public function isVerified(): ?bool
    {
        return $this->verified;
    }

    public function setVerified(bool $verified): static
    {
        $this->verified = $verified;

        return $this;
    }
}
