<?php

namespace App\Command;

use App\Repository\UserRepository;
use App\Service\SmsService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:send-appointment-reminders',
    description: 'Send appointment reminders to users two days before their appointment',
    aliases: ['a:sar', 'sar', 'send-appointment-reminders', 'appointment-reminders'],
)]
class SendAppointmentRemindersCommand extends Command
{
    private UserRepository $userRepository;
    private SmsService $smsService;

    public function __construct(UserRepository $userRepository, SmsService $smsService)
    {
        parent::__construct();
        $this->userRepository = $userRepository;
        $this->smsService = $smsService;
    }

    protected function configure(): void
    {
    }

    /**
     * @throws \Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $date = new \DateTimeImmutable('now', new \DateTimeZone('Europe/Paris'));
        $date->add(new \DateInterval('P2D'));

        $users = $this->userRepository->findUsersWithPhoneNumber();

        foreach ($users as $user) {
            if ($user->getPhoneNumber()) {
                $this->smsService->sendSms(
                    $user->getPhoneNumber(),
                    "Hello {$user->getUsername()}, you have an appointment in two days."
                );
            }
        }

        $io->success('SMS reminders sent to: ' . count($users) . ' users');

        return Command::SUCCESS;
    }
}
