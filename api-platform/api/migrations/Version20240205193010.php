<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240205193010 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE studio ADD monday VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE studio ADD tuesday VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE studio ADD wednesday VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE studio ADD thursdat VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE studio ADD friday VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE studio ADD saturday VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE studio ADD sunday VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE studio DROP monday');
        $this->addSql('ALTER TABLE studio DROP tuesday');
        $this->addSql('ALTER TABLE studio DROP wednesday');
        $this->addSql('ALTER TABLE studio DROP thursdat');
        $this->addSql('ALTER TABLE studio DROP friday');
        $this->addSql('ALTER TABLE studio DROP saturday');
        $this->addSql('ALTER TABLE studio DROP sunday');
    }
}
