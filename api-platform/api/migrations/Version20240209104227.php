<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240209104227 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE book_request_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE book_request (id INT NOT NULL, requesting_user_id INT NOT NULL, tattoo_artist_id INT NOT NULL, description TEXT NOT NULL, chat BOOLEAN NOT NULL, book BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_A8B7A7092A841BBC ON book_request (requesting_user_id)');
        $this->addSql('CREATE INDEX IDX_A8B7A70915CC5498 ON book_request (tattoo_artist_id)');
        $this->addSql('ALTER TABLE book_request ADD CONSTRAINT FK_A8B7A7092A841BBC FOREIGN KEY (requesting_user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE book_request ADD CONSTRAINT FK_A8B7A70915CC5498 FOREIGN KEY (tattoo_artist_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE book_request_id_seq CASCADE');
        $this->addSql('ALTER TABLE book_request DROP CONSTRAINT FK_A8B7A7092A841BBC');
        $this->addSql('ALTER TABLE book_request DROP CONSTRAINT FK_A8B7A70915CC5498');
        $this->addSql('DROP TABLE book_request');
    }
}
