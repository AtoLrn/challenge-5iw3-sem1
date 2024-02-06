<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240201195014 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE prestation_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE prestation (id INT NOT NULL, proposed_by_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, kind VARCHAR(255) NOT NULL, picture VARCHAR(1024) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_51C88FADDAB5A938 ON prestation (proposed_by_id)');
        $this->addSql('COMMENT ON COLUMN prestation.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE prestation ADD CONSTRAINT FK_51C88FADDAB5A938 FOREIGN KEY (proposed_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE prestation_id_seq CASCADE');
        $this->addSql('ALTER TABLE prestation DROP CONSTRAINT FK_51C88FADDAB5A938');
        $this->addSql('DROP TABLE prestation');
    }
}
