<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240128141601 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE channel_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE message_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE channel (id INT NOT NULL, tattoo_artist_id INT NOT NULL, requesting_user_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_A2F98E4715CC5498 ON channel (tattoo_artist_id)');
        $this->addSql('CREATE INDEX IDX_A2F98E472A841BBC ON channel (requesting_user_id)');
        $this->addSql('CREATE TABLE message (id INT NOT NULL, sender_id INT NOT NULL, channel_id INT NOT NULL, content TEXT NOT NULL, picture VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_B6BD307FF624B39D ON message (sender_id)');
        $this->addSql('CREATE INDEX IDX_B6BD307F72F5A1AA ON message (channel_id)');
        $this->addSql('ALTER TABLE channel ADD CONSTRAINT FK_A2F98E4715CC5498 FOREIGN KEY (tattoo_artist_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE channel ADD CONSTRAINT FK_A2F98E472A841BBC FOREIGN KEY (requesting_user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FF624B39D FOREIGN KEY (sender_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F72F5A1AA FOREIGN KEY (channel_id) REFERENCES channel (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE channel_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE message_id_seq CASCADE');
        $this->addSql('ALTER TABLE channel DROP CONSTRAINT FK_A2F98E4715CC5498');
        $this->addSql('ALTER TABLE channel DROP CONSTRAINT FK_A2F98E472A841BBC');
        $this->addSql('ALTER TABLE message DROP CONSTRAINT FK_B6BD307FF624B39D');
        $this->addSql('ALTER TABLE message DROP CONSTRAINT FK_B6BD307F72F5A1AA');
        $this->addSql('DROP TABLE channel');
        $this->addSql('DROP TABLE message');
    }
}
