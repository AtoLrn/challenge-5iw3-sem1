<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240212194144 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE book_request ADD studio_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE book_request ADD time TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE book_request ADD CONSTRAINT FK_A8B7A709446F285F FOREIGN KEY (studio_id) REFERENCES studio (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_A8B7A709446F285F ON book_request (studio_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE book_request DROP CONSTRAINT FK_A8B7A709446F285F');
        $this->addSql('DROP INDEX IDX_A8B7A709446F285F');
        $this->addSql('ALTER TABLE book_request DROP studio_id');
        $this->addSql('ALTER TABLE book_request DROP time');
    }
}
