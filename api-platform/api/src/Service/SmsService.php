<?php

namespace App\Service;

use Twilio\Exceptions\ConfigurationException;
use Twilio\Exceptions\TwilioException;
use Twilio\Rest\Client;

class SmsService
{
    private Client $client;

    /**
     * @throws ConfigurationException
     */
    public function __construct(string $sid, string $token)
    {
        $this->client = new Client($sid, $token);
    }

    /**
     * @throws TwilioException
     */
    public function sendSms($to, $message): void
    {
        $this->client->messages->create(
            $to,
            [
                'from' => $_ENV['TWILIO_PHONE_NUMBER'],
                'body' => $message,
            ]
        );
    }
}
