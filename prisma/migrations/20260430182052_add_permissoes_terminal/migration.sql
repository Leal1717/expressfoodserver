-- AlterTable
ALTER TABLE `terminal` ADD COLUMN `pode_abrir_comanda` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pode_abrir_mesa` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pode_cancelar_pedido` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pode_dar_desconto` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `tem_balcao` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `tem_mesa` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `tem_senha` BOOLEAN NOT NULL DEFAULT false;
