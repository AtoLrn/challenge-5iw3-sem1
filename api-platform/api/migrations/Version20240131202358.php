<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240131202358 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE partner_ship_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE partner_ship (id INT NOT NULL, start_date DATE NOT NULL, end_date DATE NOT NULL, status VARCHAR(255) NOT NULL, from_studio BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE studio ADD partner_ship_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE studio ADD CONSTRAINT FK_4A2B07B65BC5260 FOREIGN KEY (partner_ship_id) REFERENCES partner_ship (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_4A2B07B65BC5260 ON studio (partner_ship_id)');
        $this->addSql('ALTER TABLE "user" ADD partner_ship_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D6495BC5260 FOREIGN KEY (partner_ship_id) REFERENCES partner_ship (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_8D93D6495BC5260 ON "user" (partner_ship_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE studio DROP CONSTRAINT FK_4A2B07B65BC5260');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D6495BC5260');
        $this->addSql('DROP SEQUENCE partner_ship_id_seq CASCADE');
        $this->addSql('DROP TABLE partner_ship');
        $this->addSql('DROP INDEX IDX_8D93D6495BC5260');
        $this->addSql('ALTER TABLE "user" DROP partner_ship_id');
        $this->addSql('DROP INDEX IDX_4A2B07B65BC5260');
        $this->addSql('ALTER TABLE studio DROP partner_ship_id');
    }
}
