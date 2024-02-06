<?php

namespace App\DataFixtures;

use App\Entity\Prestation;
use App\Entity\User;
use App\Enum\Kind;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class PrestationFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $user = $manager->getRepository(User::class)->findOneBy(['username' => 'user-1']);

        $kinds = Kind::cases();

        for ($i = 1; $i <= 10; ++$i) {
            $prestation = new Prestation();
            $prestation->setName('Prestation-'.$i);

            $randomKind = $kinds[array_rand($kinds)];

            $prestation->setKind($randomKind);
            $prestation->setProposedBy($user);

            $manager->persist($prestation);
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
