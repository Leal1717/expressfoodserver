-- Sincroniza o histórico de migrations com o schema.prisma (drift achado ao validar o replay do zero).

-- AlterTable
ALTER TABLE `caixa` MODIFY `login_liberado_por_nome` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `cliente` ALTER COLUMN `updated_at` DROP DEFAULT;
