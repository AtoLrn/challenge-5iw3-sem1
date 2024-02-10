<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240210132951 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE book_request ADD channel_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE book_request ADD CONSTRAINT FK_A8B7A70972F5A1AA FOREIGN KEY (channel_id) REFERENCES "channel" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_A8B7A70972F5A1AA ON book_request (channel_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE book_request DROP CONSTRAINT FK_A8B7A70972F5A1AA');
        $this->addSql('DROP INDEX UNIQ_A8B7A70972F5A1AA');
        $this->addSql('ALTER TABLE book_request DROP channel_id');
    }
}
