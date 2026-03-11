-- DropForeignKey
ALTER TABLE `materiaprima` DROP FOREIGN KEY `MateriaPrima_classe_id_fkey`;

-- DropForeignKey
ALTER TABLE `produto` DROP FOREIGN KEY `Produto_classe_id_fkey`;

-- DropIndex
DROP INDEX `MateriaPrima_classe_id_fkey` ON `materiaprima`;

-- DropIndex
DROP INDEX `Produto_classe_id_fkey` ON `produto`;

-- AlterTable
ALTER TABLE `materiaprima` MODIFY `codigo_barras` VARCHAR(191) NULL,
    MODIFY `preco` DECIMAL(10, 2) NULL,
    MODIFY `classe_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `produto` MODIFY `descricao` VARCHAR(191) NULL,
    MODIFY `classe_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `produtomateriaprima` MODIFY `tipo` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `MateriaPrima` ADD CONSTRAINT `MateriaPrima_classe_id_fkey` FOREIGN KEY (`classe_id`) REFERENCES `Classe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produto` ADD CONSTRAINT `Produto_classe_id_fkey` FOREIGN KEY (`classe_id`) REFERENCES `Classe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
