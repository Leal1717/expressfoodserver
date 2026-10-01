-- AlterTable
ALTER TABLE `terminal`
    MODIFY `tipo` ENUM('POS', 'ADM', 'TABLET', 'TOTEM', 'ENTRADA', 'SAIDA', 'KDS', 'MOTOBOY') NOT NULL,
    ADD COLUMN `plataforma` ENUM('ANDROID', 'DESKTOP') NOT NULL,
    ADD COLUMN `tem_impressora` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `autoatendimento` BOOLEAN NOT NULL DEFAULT false;
