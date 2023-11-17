<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;

class RegisterTest extends ApiTestCase
{
    public function testRegister(): void
    {
        static::createClient()->request('POST', '/register', [
            'json' => [
                'email' => 'user-test@example.com',
                'password' => 'password',
                'username' => 'user-test',
                'isProfessional' => true
            ],
            'headers' => [
                'Content-Type' => 'application/ld+json',
            ],
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertJsonContains([
            '@context' => '/contexts/User',
            '@id' => '/users/me',
            '@type' => 'User',
            'email' => 'user-test@example.com',
            'username' => 'user-test',
            'isProfessional' => true
        ]);
    }
}
