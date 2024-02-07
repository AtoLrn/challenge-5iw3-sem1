<?php

namespace App\DataFixtures;

use App\Entity\Studio;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class StudioFixtures extends Fixture
{
    private $userPasswordHasherInterface;

    public function __construct(UserPasswordHasherInterface $userPasswordHasherInterface)
    {
        $this->userPasswordHasherInterface = $userPasswordHasherInterface;
    }

    public function load(ObjectManager $manager): void
    {
        $user = $manager->getRepository(User::class)->findOneBy(['username' => 'artist-1']);

        for ($i = 1; $i < 10; $i++) {
            $studio = new Studio;
            $studio->setName("Studio-" . $i);
            $studio->setDescription("Description of studio-" . $i);

            $studio->setLocation("address.1015526463668908");
            $studio->setMaxCapacity($i + 3);
            $studio->setOwner($user);

            $studio->setStatus("PENDING");

            $manager->persist($studio);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
