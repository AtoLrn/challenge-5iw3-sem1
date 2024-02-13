<?php

namespace App\DataFixtures;

use App\Entity\Feedback;
use App\Entity\Prestation;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Random\RandomException;

class FeedbackFixtures extends Fixture implements DependentFixtureInterface
{
    /**
     * @throws RandomException
     */
    public function load(ObjectManager $manager): void
    {
        $prestations = $manager->getRepository(Prestation::class)->findAll();
        $user = $manager->getRepository(User::class)->findOneBy(['username' => 'pro-1']);

        $comments = [
            'Super prestation !',
            'Je recommande !',
            'Je suis très content !',
            'Je suis très déçu...',
            'Je ne recommande pas du tout !',
        ];

        for ($i = 1; $i <= 10; ++$i) {
            $feedback = new Feedback();
            $feedback->setRating(random_int(1, 5));
            $feedback->setComment($comments[array_rand($comments)]);
            $feedback->setPrestation($prestations[array_rand($prestations)]);
            $feedback->setSubmittedBy($user);

            $manager->persist($feedback);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            PrestationFixtures::class,
        ];
    }
}
