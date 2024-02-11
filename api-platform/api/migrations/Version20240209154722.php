<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240209154722 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE channel DROP CONSTRAINT fk_a2f98e47427eb8a5');
        $this->addSql('DROP INDEX uniq_a2f98e47427eb8a5');
        $this->addSql('ALTER TABLE channel DROP request_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE "channel" ADD request_id INT NOT NULL');
        $this->addSql('ALTER TABLE "channel" ADD CONSTRAINT fk_a2f98e47427eb8a5 FOREIGN KEY (request_id) REFERENCES book_request (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX uniq_a2f98e47427eb8a5 ON "channel" (request_id)');
    }
}
