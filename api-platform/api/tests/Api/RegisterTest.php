<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;

class RegisterTest extends ApiTestCase
{
    public function test(): void
    {
        $this->assertStringEndsWith("t", "test");
    }
}
