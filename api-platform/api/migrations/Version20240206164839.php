<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240206164839 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE post_picture_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE post_picture (id INT NOT NULL, creator_id INT NOT NULL, picture VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_2B33F8BA61220EA6 ON post_picture (creator_id)');
        $this->addSql('ALTER TABLE post_picture ADD CONSTRAINT FK_2B33F8BA61220EA6 FOREIGN KEY (creator_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE post_picture_id_seq CASCADE');
        $this->addSql('ALTER TABLE post_picture DROP CONSTRAINT FK_2B33F8BA61220EA6');
        $this->addSql('DROP TABLE post_picture');
    }
}
