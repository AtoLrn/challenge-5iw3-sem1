<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240210150439 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE feedback_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE created_at_id_seq CASCADE');
        $this->addSql('ALTER TABLE feedback DROP CONSTRAINT fk_d22944589e45c554');
        $this->addSql('ALTER TABLE feedback DROP CONSTRAINT fk_d229445879f7d87d');
        $this->addSql('DROP TABLE created_at');
        $this->addSql('DROP TABLE feedback');
        $this->addSql('ALTER TABLE "user" ADD phone_number VARCHAR(15) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SEQUENCE feedback_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE created_at_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE created_at (id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE feedback (id INT NOT NULL, prestation_id INT NOT NULL, submitted_by_id INT NOT NULL, rating SMALLINT NOT NULL, comment TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX idx_d229445879f7d87d ON feedback (submitted_by_id)');
        $this->addSql('CREATE INDEX idx_d22944589e45c554 ON feedback (prestation_id)');
        $this->addSql('COMMENT ON COLUMN feedback.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE feedback ADD CONSTRAINT fk_d22944589e45c554 FOREIGN KEY (prestation_id) REFERENCES prestation (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE feedback ADD CONSTRAINT fk_d229445879f7d87d FOREIGN KEY (submitted_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" DROP phone_number');
    }
}
