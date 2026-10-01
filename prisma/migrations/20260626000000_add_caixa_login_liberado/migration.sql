-- AlterTable
ALTER TABLE `Caixa` ADD COLUMN `login_liberado` BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN `login_liberado_em` DATETIME(3),
ADD COLUMN `login_liberado_por_id` INTEGER,
ADD COLUMN `login_liberado_por_nome` TEXT;
