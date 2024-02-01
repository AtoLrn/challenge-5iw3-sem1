<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240131205949 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE partner_ship ADD user_id_id INT NOT NULL');
        $this->addSql('ALTER TABLE partner_ship ADD studio_id_id INT NOT NULL');
        $this->addSql('ALTER TABLE partner_ship ALTER status TYPE VARCHAR(50)');
        $this->addSql('ALTER TABLE partner_ship ADD CONSTRAINT FK_AA04D83C9D86650F FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE partner_ship ADD CONSTRAINT FK_AA04D83C81F17E9A FOREIGN KEY (studio_id_id) REFERENCES studio (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_AA04D83C9D86650F ON partner_ship (user_id_id)');
        $this->addSql('CREATE INDEX IDX_AA04D83C81F17E9A ON partner_ship (studio_id_id)');
        $this->addSql('ALTER TABLE studio DROP CONSTRAINT fk_4a2b07b65bc5260');
        $this->addSql('DROP INDEX idx_4a2b07b65bc5260');
        $this->addSql('ALTER TABLE studio DROP partner_ship_id');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT fk_8d93d6495bc5260');
        $this->addSql('DROP INDEX idx_8d93d6495bc5260');
        $this->addSql('ALTER TABLE "user" DROP partner_ship_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE partner_ship DROP CONSTRAINT FK_AA04D83C9D86650F');
        $this->addSql('ALTER TABLE partner_ship DROP CONSTRAINT FK_AA04D83C81F17E9A');
        $this->addSql('DROP INDEX IDX_AA04D83C9D86650F');
        $this->addSql('DROP INDEX IDX_AA04D83C81F17E9A');
        $this->addSql('ALTER TABLE partner_ship DROP user_id_id');
        $this->addSql('ALTER TABLE partner_ship DROP studio_id_id');
        $this->addSql('ALTER TABLE partner_ship ALTER status TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE studio ADD partner_ship_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE studio ADD CONSTRAINT fk_4a2b07b65bc5260 FOREIGN KEY (partner_ship_id) REFERENCES partner_ship (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_4a2b07b65bc5260 ON studio (partner_ship_id)');
        $this->addSql('ALTER TABLE "user" ADD partner_ship_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT fk_8d93d6495bc5260 FOREIGN KEY (partner_ship_id) REFERENCES partner_ship (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_8d93d6495bc5260 ON "user" (partner_ship_id)');
    }
}
