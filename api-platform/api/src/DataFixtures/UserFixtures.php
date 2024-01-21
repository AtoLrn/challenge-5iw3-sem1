<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    private $userPasswordHasherInterface;

    public function __construct (UserPasswordHasherInterface $userPasswordHasherInterface)
    {
        $this->userPasswordHasherInterface = $userPasswordHasherInterface;
    }

    public function load(ObjectManager $manager): void
    {
        for ($i = 1; $i < 41; $i++) {
            $user = new User;
            $user->setUsername("user-". $i);
            $user->setEmail("user-". $i . "@gmail.com");
            $user->setPassword(
                $this->userPasswordHasherInterface->hashPassword(
                    $user, "password"
                )
            );
            $user->setIsVerified(true);
        $user->setRoles(["ROLE_USER"]);

            $manager->persist($user);
        }

        $user = new User;
        $user->setUsername("admin");
        $user->setEmail("admin@gmail.com");
        $user->setPassword(
            $this->userPasswordHasherInterface->hashPassword(
                $user, "password"
            )
        );
        $user->setIsVerified(true);
        $user->setRoles(["ROLE_ADMIN"]);

        $manager->persist($user);

        $manager->flush();
    }
}