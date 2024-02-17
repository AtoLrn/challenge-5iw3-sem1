<?php

namespace App\Event;

use Symfony\Contracts\EventDispatcher\Event;

class UserCreateEvent extends Event
{
    public const NAME = "user.creation";

    public function __construct(
        protected string $id
    ) {
    }

    public function getUserId()
    {
        return $this->id;
    }
}
