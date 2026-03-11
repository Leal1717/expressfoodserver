/*
  Warnings:

  - You are about to alter the column `preco` on the `plano` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `plano` MODIFY `preco` DECIMAL(10, 2) NOT NULL;

-- CreateTable
CREATE TABLE `Classe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `empresa_id` INTEGER NOT NULL,

    INDEX `Classe_empresa_id_idx`(`empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MateriaPrima` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `codigo_barras` VARCHAR(191) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `classe_id` INTEGER NOT NULL,

    INDEX `MateriaPrima_empresa_id_idx`(`empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `classe_id` INTEGER NOT NULL,

    INDEX `Produto_empresa_id_idx`(`empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProdutoMateriaPrima` (
    `produto_id` INTEGER NOT NULL,
    `materia_prima_id` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `quantidade` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`produto_id`, `materia_prima_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Classe` ADD CONSTRAINT `Classe_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MateriaPrima` ADD CONSTRAINT `MateriaPrima_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MateriaPrima` ADD CONSTRAINT `MateriaPrima_classe_id_fkey` FOREIGN KEY (`classe_id`) REFERENCES `Classe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produto` ADD CONSTRAINT `Produto_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produto` ADD CONSTRAINT `Produto_classe_id_fkey` FOREIGN KEY (`classe_id`) REFERENCES `Classe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProdutoMateriaPrima` ADD CONSTRAINT `ProdutoMateriaPrima_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProdutoMateriaPrima` ADD CONSTRAINT `ProdutoMateriaPrima_materia_prima_id_fkey` FOREIGN KEY (`materia_prima_id`) REFERENCES `MateriaPrima`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `usuario` RENAME INDEX `Usuario_empresa_id_fkey` TO `Usuario_empresa_id_idx`;
