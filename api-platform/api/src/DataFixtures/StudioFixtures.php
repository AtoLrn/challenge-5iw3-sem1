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
        $user = $manager->getRepository(User::class)->findOneBy(['username' => 'pro-1']);

        for ($i = 1; $i < 10; $i++) {
            $studio = new Studio;
            $studio->setName("Studio-" . $i);
            $studio->setDescription("Description of studio-" . $i);

            $studio->setLocation("2.389355,48.848898");
            $studio->setMaxCapacity($i + 3);
            $studio->setOwner($user);
            $studio->setPicture("https://static.wixstatic.com/media/446e2c_143574ff61174704bb639530b4ee8849~mv2.jpg/v1/fill/w_296,h_380,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/446e2c_143574ff61174704bb639530b4ee8849~mv2.jpg");
            $studio->setOpeningTime("10:00");
            $studio->setClosingTime("20:00");

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
