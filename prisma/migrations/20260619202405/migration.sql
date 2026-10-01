/*
  Warnings:

  - A unique constraint covering the columns `[usuario_id]` on the table `Motoboy` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `motoboy` ADD COLUMN `usuario_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `pedido` ADD COLUMN `motivo_nao_entrega` ENUM('CLIENTE_AUSENTE', 'ENDERECO_NAO_ENCONTRADO', 'RECUSOU_PEDIDO', 'OUTRO') NULL,
    MODIFY `delivery_status` ENUM('RECEBIDO', 'CONFIRMADO', 'EM_PRODUCAO', 'AGUARDANDO_MOTOBOY', 'A_CAMINHO', 'ENTREGUE', 'NAO_ENTREGUE', 'CANCELADO') NULL;

-- AlterTable
ALTER TABLE `rota` ADD COLUMN `ocorrencia_descricao` VARCHAR(191) NULL,
    ADD COLUMN `ocorrencia_tipo` ENUM('TRANSITO', 'ACIDENTE', 'CLIMA', 'VEICULO', 'OUTRO') NULL;

-- AlterTable
ALTER TABLE `terminal` MODIFY `tipo` ENUM('POS', 'ADM', 'PDV', 'DELIVERY', 'ENTRADA', 'SAIDA', 'KDS', 'AUTO_TOTEM', 'AUTO_TABLET', 'CARDAPIO_DIGITAL', 'MOTOBOY') NOT NULL;

-- AlterTable
ALTER TABLE `usuario` MODIFY `role` ENUM('OWNER', 'ADMIN_GERAL', 'ADMIN_SEM_FINANCEIRO', 'OPERADOR_GERAL', 'OPERADOR_SEM_ESTOQUE', 'OPERADOR_COM_FINANCEIRO', 'AUTOATENDIMENTO', 'CONTADOR', 'MOTOBOY') NOT NULL DEFAULT 'ADMIN_GERAL';

-- CreateIndex
CREATE UNIQUE INDEX `Motoboy_usuario_id_key` ON `Motoboy`(`usuario_id`);

-- AddForeignKey
ALTER TABLE `Motoboy` ADD CONSTRAINT `Motoboy_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
