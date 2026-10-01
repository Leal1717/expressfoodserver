-- AlterTable
ALTER TABLE `pedido` ADD COLUMN `caixa_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `vendahistorico` ADD COLUMN `caixa_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `Caixa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `terminal_id` INTEGER NULL,
    `operador_id` INTEGER NOT NULL,
    `operador_nome` VARCHAR(191) NOT NULL,
    `valor_abertura` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('ABERTO', 'FECHADO') NOT NULL DEFAULT 'ABERTO',
    `aberto_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechado_em` DATETIME(3) NULL,
    `observacao` VARCHAR(191) NULL,

    INDEX `Caixa_empresa_id_status_idx`(`empresa_id`, `status`),
    INDEX `Caixa_empresa_id_terminal_id_idx`(`empresa_id`, `terminal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaixaMovimentacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `caixa_id` INTEGER NOT NULL,
    `tipo` ENUM('SUPRIMENTO', 'SANGRIA') NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `motivo` VARCHAR(191) NULL,
    `criado_por_id` INTEGER NOT NULL,
    `criado_por_nome` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaixaFechamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `caixa_id` INTEGER NOT NULL,
    `valor_contado_dinheiro` DECIMAL(10, 2) NOT NULL,
    `valor_esperado_dinheiro` DECIMAL(10, 2) NOT NULL,
    `diferenca` DECIMAL(10, 2) NOT NULL,
    `total_bruto` DECIMAL(10, 2) NOT NULL,
    `total_liquido` DECIMAL(10, 2) NOT NULL,
    `total_cancelamentos` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `totais_json` JSON NOT NULL,
    `fechado_por_id` INTEGER NOT NULL,
    `fechado_por_nome` VARCHAR(191) NOT NULL,
    `fechado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CaixaFechamento_caixa_id_key`(`caixa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `VendaHistorico_empresa_id_caixa_id_idx` ON `VendaHistorico`(`empresa_id`, `caixa_id`);

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_caixa_id_fkey` FOREIGN KEY (`caixa_id`) REFERENCES `Caixa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendaHistorico` ADD CONSTRAINT `VendaHistorico_caixa_id_fkey` FOREIGN KEY (`caixa_id`) REFERENCES `Caixa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Caixa` ADD CONSTRAINT `Caixa_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Caixa` ADD CONSTRAINT `Caixa_terminal_id_fkey` FOREIGN KEY (`terminal_id`) REFERENCES `Terminal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Caixa` ADD CONSTRAINT `Caixa_operador_id_fkey` FOREIGN KEY (`operador_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaixaMovimentacao` ADD CONSTRAINT `CaixaMovimentacao_caixa_id_fkey` FOREIGN KEY (`caixa_id`) REFERENCES `Caixa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaixaFechamento` ADD CONSTRAINT `CaixaFechamento_caixa_id_fkey` FOREIGN KEY (`caixa_id`) REFERENCES `Caixa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
