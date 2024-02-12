<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240212103737 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE feedback_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE feedback (id INT NOT NULL, prestation_id INT NOT NULL, submitted_by_id INT NOT NULL, rating SMALLINT NOT NULL, comment TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D22944589E45C554 ON feedback (prestation_id)');
        $this->addSql('CREATE INDEX IDX_D229445879F7D87D ON feedback (submitted_by_id)');
        $this->addSql('COMMENT ON COLUMN feedback.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE feedback ADD CONSTRAINT FK_D22944589E45C554 FOREIGN KEY (prestation_id) REFERENCES prestation (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE feedback ADD CONSTRAINT FK_D229445879F7D87D FOREIGN KEY (submitted_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE studio ADD picture VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE studio DROP opening_time');
        $this->addSql('ALTER TABLE studio DROP closing_time');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE feedback_id_seq CASCADE');
        $this->addSql('ALTER TABLE feedback DROP CONSTRAINT FK_D22944589E45C554');
        $this->addSql('ALTER TABLE feedback DROP CONSTRAINT FK_D229445879F7D87D');
        $this->addSql('DROP TABLE feedback');
        $this->addSql('ALTER TABLE studio ADD opening_time TIME(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE studio ADD closing_time TIME(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE studio DROP picture');
    }
}
