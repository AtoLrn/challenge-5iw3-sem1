<?php

namespace App\DataFixtures;

use App\Entity\BookRequest;
use App\Entity\Channel;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class BookingFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $user = $manager->getRepository(User::class)->findOneBy(['username' => 'user-1']);


        for ($i = 1; $i <= 10; ++$i) {
            $pro = $manager->getRepository(User::class)->findOneBy(['username' => 'pro-' . rand(1, 10)]);


            $booking = new BookRequest();
            $booking->setDescription('Prestation-' . $i);
            $booking->setTattooArtist($pro);
            $booking->setRequestingUser($user);

            $validated = rand(1, 2) === 2;
            $isBookable = rand(1, 2) === 2;

            $booking->setChat($validated);
            $booking->setBook($validated && $isBookable);

            if ($validated) {
                $channel = new Channel();
                $channel->setRequestingUser($booking->getRequestingUser());
                $channel->setTattooArtist($booking->getTattooArtist());
                $channel->setDescription($booking->getDescription());
                $channel->setBookRequest($booking);
                $manager->persist($booking);
                $manager->persist($channel);
            } else {
                $manager->persist($booking);
            }
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
