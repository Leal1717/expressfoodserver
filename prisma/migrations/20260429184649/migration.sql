-- CreateTable
CREATE TABLE `Plano` (
    `id` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `qtd_licencas` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Empresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_fantasia` VARCHAR(191) NOT NULL,
    `razao_social` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `logo_url` VARCHAR(191) NULL,
    `tipo_comercio` ENUM('RESTAURANTE', 'PIZZARIA', 'CHURRASCARIA', 'FAST_FOOD', 'LANCHONETE', 'PADARIA', 'CAFE', 'SORVETERIA', 'CANTINA_ESCOLAR', 'CONVENIENCIA', 'DISTRIBUIDORA', 'BAR', 'CASA_NOTURNA', 'FOOD_TRUCK', 'HAMBURGUERIA', 'SUSHI', 'OUTRO') NULL,
    `usa_fiscal` BOOLEAN NOT NULL DEFAULT false,
    `inscricao_estadual` VARCHAR(191) NULL,
    `inscricao_municipal` VARCHAR(191) NULL,
    `crt` ENUM('SIMPLES_NACIONAL', 'SIMPLES_NACIONAL_EXCESSO', 'REGIME_NORMAL') NOT NULL DEFAULT 'SIMPLES_NACIONAL',
    `ambiente_fiscal` ENUM('PRODUCAO', 'HOMOLOGACAO') NOT NULL DEFAULT 'HOMOLOGACAO',
    `serie_nfce` INTEGER NOT NULL DEFAULT 1,
    `proximo_numero_nfce` INTEGER NOT NULL DEFAULT 1,
    `endereco_id` INTEGER NOT NULL,
    `plano_id` INTEGER NOT NULL,

    UNIQUE INDEX `Empresa_cnpj_key`(`cnpj`),
    UNIQUE INDEX `Empresa_endereco_id_key`(`endereco_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Endereco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rua` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `pais` VARCHAR(191) NOT NULL DEFAULT 'Brasil',
    `cliente_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `genero` ENUM('M', 'F', 'O') NULL,
    `empresa_id` INTEGER NOT NULL,

    INDEX `Cliente_empresa_id_idx`(`empresa_id`),
    UNIQUE INDEX `Cliente_cpf_empresa_id_key`(`cpf`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HorarioDeFuncionamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dia_id` INTEGER NOT NULL,
    `hora_abertura` VARCHAR(191) NOT NULL,
    `hora_fechamento` VARCHAR(191) NOT NULL,
    `empresa_id` INTEGER NOT NULL,

    INDEX `HorarioDeFuncionamento_empresa_id_idx`(`empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Impressora` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `tipo` ENUM('COZINHA', 'BALCAO', 'RECIBO') NOT NULL DEFAULT 'COZINHA',
    `empresa_id` INTEGER NOT NULL,

    INDEX `Impressora_empresa_id_idx`(`empresa_id`),
    UNIQUE INDEX `Impressora_nome_empresa_id_key`(`nome`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `role` ENUM('OWNER', 'ADMIN_GERAL', 'ADMIN_SEM_FINANCEIRO', 'OPERADOR_GERAL', 'OPERADOR_SEM_ESTOQUE', 'OPERADOR_COM_FINANCEIRO', 'AUTOATENDIMENTO', 'CONTADOR') NOT NULL DEFAULT 'ADMIN_GERAL',
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `session_id` VARCHAR(191) NULL,
    `ultimo_login_terminal_id` INTEGER NULL,
    `empresa_id` INTEGER NOT NULL,

    INDEX `Usuario_empresa_id_idx`(`empresa_id`),
    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Terminal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `tipo` ENUM('POS', 'ADM', 'PDV', 'DELIVERY', 'ENTRADA', 'SAIDA', 'KDS', 'AUTO_TOTEM', 'AUTO_TABLET') NOT NULL,
    `modelo` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `faz_pagamento` BOOLEAN NOT NULL DEFAULT false,
    `empresa_id` INTEGER NOT NULL,
    `provedor_padrao_id` INTEGER NULL,
    `ultimo_login_data` DATETIME(3) NULL,
    `ultimo_login_usuario_id` INTEGER NULL,

    INDEX `Terminal_empresa_id_idx`(`empresa_id`),
    UNIQUE INDEX `Terminal_nome_empresa_id_key`(`nome`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FormaPagamentoGlobal` (
    `id` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `tipo` ENUM('DINHEIRO', 'PIX', 'CARTAO_DEBITO', 'CARTAO_CREDITO', 'VOUCHER', 'OUTRO') NOT NULL,
    `exige_troco` BOOLEAN NOT NULL DEFAULT false,
    `permite_parcelamento` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmpresaFormaPagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `forma_pagamento_id` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `EmpresaFormaPagamento_empresa_id_forma_pagamento_id_key`(`empresa_id`, `forma_pagamento_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bandeira` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProvedorPagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `nome_normalizado` VARCHAR(191) NOT NULL,
    `empresa_id` INTEGER NOT NULL,

    UNIQUE INDEX `ProvedorPagamento_nome_normalizado_empresa_id_key`(`nome_normalizado`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaxaCartao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provedor_id` INTEGER NOT NULL,
    `bandeira_id` INTEGER NULL,
    `tipo` ENUM('DEBITO', 'CREDITO', 'PIX') NOT NULL,
    `parcelas` INTEGER NOT NULL DEFAULT 1,
    `prazo_recebimento` INTEGER NOT NULL DEFAULT 30,
    `taxa_percentual` DECIMAL(5, 2) NOT NULL,
    `taxa_fixa` DECIMAL(10, 2) NULL,
    `empresa_id` INTEGER NOT NULL,

    INDEX `TaxaCartao_empresa_id_idx`(`empresa_id`),
    UNIQUE INDEX `TaxaCartao_provedor_id_bandeira_id_tipo_parcelas_key`(`provedor_id`, `bandeira_id`, `tipo`, `parcelas`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PedidoPagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` DECIMAL(10, 2) NOT NULL,
    `valor_liquido` DECIMAL(10, 2) NOT NULL,
    `troco_para` DECIMAL(65, 30) NULL,
    `terminal_id` INTEGER NULL,
    `provedor_id` INTEGER NULL,
    `bandeira_id` INTEGER NULL,
    `parcelas` INTEGER NULL,
    `taxa_aplicada` DECIMAL(65, 30) NULL,
    `pedido_id` VARCHAR(191) NOT NULL,
    `empresa_forma_pagamento_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Classe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL DEFAULT 0,
    `empresa_id` INTEGER NOT NULL,

    INDEX `Classe_empresa_id_idx`(`empresa_id`),
    UNIQUE INDEX `Classe_nome_empresa_id_key`(`nome`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subitem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `index` INTEGER NOT NULL DEFAULT 0,
    `unidade_compra` ENUM('UN', 'CX', 'PC', 'KT', 'DZ', 'FD', 'KG', 'G', 'L', 'ML') NULL,
    `unidade_venda` ENUM('UN', 'CX', 'PC', 'KT', 'DZ', 'FD', 'KG', 'G', 'L', 'ML') NULL,
    `fator_conversao` DECIMAL(10, 3) NULL,
    `controla_estoque` BOOLEAN NOT NULL DEFAULT true,
    `empresa_id` INTEGER NOT NULL,

    INDEX `Subitem_empresa_id_idx`(`empresa_id`),
    UNIQUE INDEX `Subitem_nome_empresa_id_key`(`nome`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GrupoFiscal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `ncm` VARCHAR(191) NOT NULL,
    `cfop` VARCHAR(191) NOT NULL,
    `cest` VARCHAR(191) NULL,
    `origem` INTEGER NOT NULL DEFAULT 0,
    `csosn` VARCHAR(191) NULL,
    `cst_icms` VARCHAR(191) NULL,
    `aliquota_icms` DECIMAL(5, 2) NULL,
    `cst_pis` VARCHAR(191) NULL,
    `aliquota_pis` DECIMAL(5, 2) NULL,
    `cst_cofins` VARCHAR(191) NULL,
    `aliquota_cofins` DECIMAL(5, 2) NULL,
    `empresa_id` INTEGER NOT NULL,

    INDEX `GrupoFiscal_empresa_id_idx`(`empresa_id`),
    UNIQUE INDEX `GrupoFiscal_nome_empresa_id_key`(`nome`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `codigo_barras` VARCHAR(191) NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `tipo` ENUM('PRODUTO', 'MERCADORIA', 'COMBO', 'INGRESSO', 'ENTRADA') NOT NULL DEFAULT 'MERCADORIA',
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `index` INTEGER NOT NULL DEFAULT 0,
    `tempo_preparo` INTEGER NOT NULL DEFAULT 0,
    `imagem` VARCHAR(191) NULL,
    `empresa_id` INTEGER NOT NULL,
    `classe_id` INTEGER NULL,
    `grupo_fiscal_id` INTEGER NULL,

    INDEX `Item_empresa_id_idx`(`empresa_id`),
    UNIQUE INDEX `Item_nome_empresa_id_key`(`nome`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemSubitem` (
    `item_id` INTEGER NOT NULL,
    `subitem_id` INTEGER NOT NULL,
    `tipo` ENUM('MATERIA_PRIMA', 'ADICIONAL', 'AMBOS') NOT NULL,
    `quantidade` DECIMAL(10, 3) NOT NULL,
    `preco` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`item_id`, `subitem_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ComboItem` (
    `combo_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `quantidade` DECIMAL(10, 3) NOT NULL,

    PRIMARY KEY (`combo_id`, `item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstoqueMovimentacao` (
    `id` VARCHAR(191) NOT NULL,
    `subitem_id` INTEGER NOT NULL,
    `tipo` ENUM('ENTRADA', 'SAIDA', 'AJUSTE', 'VENDA') NOT NULL DEFAULT 'ENTRADA',
    `quantidade` DECIMAL(10, 3) NOT NULL DEFAULT 0,
    `referencia` VARCHAR(191) NULL,
    `custo_unitario_momento` DECIMAL(10, 2) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `empresa_id` INTEGER NOT NULL,

    INDEX `EstoqueMovimentacao_empresa_id_idx`(`empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstoquePosicao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subitem_id` INTEGER NOT NULL,
    `quantidade_fisica` DECIMAL(10, 3) NOT NULL DEFAULT 0,
    `quantidade_reserva` DECIMAL(10, 3) NOT NULL DEFAULT 0,
    `estoque_minimo` DECIMAL(10, 3) NOT NULL DEFAULT 0,
    `estoque_maximo` DECIMAL(10, 3) NULL,
    `custo_unitario` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `ultima_contagem` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `empresa_id` INTEGER NOT NULL,

    UNIQUE INDEX `EstoquePosicao_subitem_id_key`(`subitem_id`),
    INDEX `EstoquePosicao_empresa_id_idx`(`empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Promocao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `preco_promocional` DECIMAL(10, 2) NOT NULL,
    `hora_inicio` VARCHAR(191) NOT NULL,
    `hora_fim` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `seg` BOOLEAN NOT NULL DEFAULT false,
    `ter` BOOLEAN NOT NULL DEFAULT false,
    `qua` BOOLEAN NOT NULL DEFAULT false,
    `qui` BOOLEAN NOT NULL DEFAULT false,
    `sex` BOOLEAN NOT NULL DEFAULT false,
    `sab` BOOLEAN NOT NULL DEFAULT false,
    `dom` BOOLEAN NOT NULL DEFAULT false,
    `item_id` INTEGER NOT NULL,

    INDEX `Promocao_empresa_id_idx`(`empresa_id`),
    INDEX `Promocao_item_id_idx`(`item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiaDaSemana` (
    `id` INTEGER NOT NULL,
    `nome_completo` VARCHAR(191) NOT NULL,
    `nome_abreviado` VARCHAR(191) NOT NULL,
    `nome_enum` ENUM('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mesa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `pos_x` DOUBLE NULL,
    `pos_y` DOUBLE NULL,
    `status` ENUM('LIVRE', 'OCUPADA', 'CONTA') NOT NULL DEFAULT 'LIVRE',
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Mesa_empresa_id_idx`(`empresa_id`),
    UNIQUE INDEX `Mesa_nome_empresa_id_key`(`nome`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comanda` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NULL,
    `cliente_id` INTEGER NULL,
    `empresa_id` INTEGER NOT NULL,
    `status` ENUM('OCUPADA', 'CONTA', 'PAGA') NOT NULL DEFAULT 'OCUPADA',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Comanda_empresa_id_idx`(`empresa_id`),
    UNIQUE INDEX `Comanda_nome_empresa_id_key`(`nome`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Senha` (
    `id` VARCHAR(191) NOT NULL,
    `numero` INTEGER NULL,
    `nome` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `empresa_id` INTEGER NOT NULL,

    INDEX `Senha_empresa_id_idx`(`empresa_id`),
    UNIQUE INDEX `Senha_numero_empresa_id_key`(`numero`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `inicio` DATETIME(3) NOT NULL,
    `final` DATETIME(3) NOT NULL,
    `imagem` VARCHAR(191) NULL,
    `empresa_id` INTEGER NOT NULL,

    INDEX `Evento_empresa_id_idx`(`empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Motoboy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `empresa_id` INTEGER NOT NULL,

    INDEX `Motoboy_empresa_id_idx`(`empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZonaEntrega` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL DEFAULT '',
    `taxa_base` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `taxa` DECIMAL(10, 2) NOT NULL,
    `tempo_estimado` INTEGER NOT NULL DEFAULT 30,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `empresa_id` INTEGER NOT NULL,

    INDEX `ZonaEntrega_empresa_id_idx`(`empresa_id`),
    UNIQUE INDEX `ZonaEntrega_nome_cidade_empresa_id_key`(`nome`, `cidade`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedido` (
    `id` VARCHAR(191) NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `status` ENUM('PENDENTE', 'PAGA', 'CANCELADA') NOT NULL DEFAULT 'PENDENTE',
    `total` DECIMAL(10, 2) NOT NULL,
    `desconto` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `producao_status` ENUM('AGUARDANDO', 'EM_PREPARO', 'PRONTO') NOT NULL DEFAULT 'AGUARDANDO',
    `observacao` VARCHAR(191) NULL,
    `mesa_id` VARCHAR(191) NULL,
    `comanda_id` VARCHAR(191) NULL,
    `senha_id` INTEGER NULL,
    `senha_pronta` BOOLEAN NOT NULL DEFAULT false,
    `formato` ENUM('BALCAO', 'MESA', 'SENHA', 'COMANDA', 'DELIVERY') NULL,
    `terminal_id` INTEGER NULL,
    `cliente_id` INTEGER NULL,
    `delivery_status` ENUM('RECEBIDO', 'CONFIRMADO', 'EM_PRODUCAO', 'AGUARDANDO_MOTOBOY', 'A_CAMINHO', 'ENTREGUE', 'CANCELADO') NULL,
    `cpf_nota` VARCHAR(191) NULL,
    `canal_origem` ENUM('WHATSAPP', 'TELEFONE', 'APP_PROPRIO', 'BALCAO') NULL,
    `taxa_entrega` DECIMAL(10, 2) NULL,
    `endereco_entrega_id` INTEGER NULL,
    `motoboy_id` INTEGER NULL,
    `zona_entrega_id` INTEGER NULL,
    `producao_inicio_at` DATETIME(3) NULL,
    `producao_fim_at` DATETIME(3) NULL,
    `saiu_at` DATETIME(3) NULL,
    `entregue_at` DATETIME(3) NULL,
    `usuario_id` INTEGER NOT NULL,

    INDEX `Pedido_empresa_id_created_at_idx`(`empresa_id`, `created_at`),
    INDEX `Pedido_empresa_id_status_idx`(`empresa_id`, `status`),
    INDEX `Pedido_empresa_id_terminal_id_idx`(`empresa_id`, `terminal_id`),
    INDEX `Pedido_empresa_id_usuario_id_idx`(`empresa_id`, `usuario_id`),
    INDEX `Pedido_empresa_id_delivery_status_idx`(`empresa_id`, `delivery_status`),
    INDEX `Pedido_empresa_id_producao_status_idx`(`empresa_id`, `producao_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PedidoItem` (
    `id` VARCHAR(191) NOT NULL,
    `pedido_id` VARCHAR(191) NOT NULL,
    `observacao` VARCHAR(191) NULL,
    `item_id` INTEGER NOT NULL,
    `quantidade` DECIMAL(10, 3) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `desconto` DECIMAL(10, 2) NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PedidoItemSubitem` (
    `id` VARCHAR(191) NOT NULL,
    `pedido_item_id` VARCHAR(191) NOT NULL,
    `subitem_id` INTEGER NOT NULL,
    `tipo` ENUM('MATERIA_PRIMA', 'ADICIONAL', 'AMBOS') NOT NULL DEFAULT 'MATERIA_PRIMA',
    `removido` BOOLEAN NOT NULL DEFAULT false,
    `quantidade` DECIMAL(10, 3) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `desconto` DECIMAL(10, 2) NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VendaHistorico` (
    `id` VARCHAR(191) NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('PENDENTE', 'PAGA', 'CANCELADA') NOT NULL DEFAULT 'PENDENTE',
    `total` DECIMAL(10, 2) NOT NULL,
    `desconto` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `itens_json` JSON NOT NULL,
    `pagamento_json` JSON NULL,
    `usuario_id` INTEGER NOT NULL,
    `usuario_nome` VARCHAR(191) NOT NULL,
    `usuario_email` VARCHAR(191) NOT NULL,
    `terminal_id` INTEGER NULL,
    `terminal_nome` VARCHAR(191) NULL,

    INDEX `VendaHistorico_empresa_id_created_at_idx`(`empresa_id`, `created_at`),
    INDEX `VendaHistorico_empresa_id_status_idx`(`empresa_id`, `status`),
    INDEX `VendaHistorico_empresa_id_usuario_id_idx`(`empresa_id`, `usuario_id`),
    INDEX `VendaHistorico_empresa_id_terminal_id_idx`(`empresa_id`, `terminal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VendaHistoricoItem` (
    `id` VARCHAR(191) NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `venda_historico_id` VARCHAR(191) NOT NULL,
    `item_id` INTEGER NULL,
    `nome` VARCHAR(191) NOT NULL,
    `classe_id` INTEGER NULL,
    `classe_nome` VARCHAR(191) NULL,
    `quantidade` DECIMAL(10, 3) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `desconto` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    INDEX `VendaHistoricoItem_empresa_id_created_at_idx`(`empresa_id`, `created_at`),
    INDEX `VendaHistoricoItem_empresa_id_item_id_idx`(`empresa_id`, `item_id`),
    INDEX `VendaHistoricoItem_empresa_id_classe_id_idx`(`empresa_id`, `classe_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VendaHistoricoSubitem` (
    `id` VARCHAR(191) NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `venda_historico_id` VARCHAR(191) NOT NULL,
    `subitem_id` INTEGER NULL,
    `nome` VARCHAR(191) NOT NULL,
    `quantidade` DECIMAL(10, 3) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    INDEX `VendaHistoricoSubitem_empresa_id_created_at_idx`(`empresa_id`, `created_at`),
    INDEX `VendaHistoricoSubitem_empresa_id_subitem_id_idx`(`empresa_id`, `subitem_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VendaHistoricoPagamento` (
    `id` VARCHAR(191) NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `venda_historico_id` VARCHAR(191) NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `valor_liquido` DECIMAL(10, 2) NOT NULL,
    `forma_pagamento` VARCHAR(191) NOT NULL,
    `tipo_pagamento` ENUM('DINHEIRO', 'PIX', 'CARTAO_DEBITO', 'CARTAO_CREDITO', 'VOUCHER', 'OUTRO') NULL,
    `bandeira_cartao` VARCHAR(191) NULL,
    `provedor_nome` VARCHAR(191) NULL,
    `parcelas` INTEGER NULL,
    `taxa_percentual` DECIMAL(5, 2) NULL,
    `taxa_valor` DECIMAL(10, 2) NULL,
    `created_at` DATETIME(3) NOT NULL,

    INDEX `VendaHistoricoPagamento_empresa_id_created_at_idx`(`empresa_id`, `created_at`),
    INDEX `VendaHistoricoPagamento_empresa_id_forma_pagamento_idx`(`empresa_id`, `forma_pagamento`),
    INDEX `VendaHistoricoPagamento_empresa_id_tipo_pagamento_idx`(`empresa_id`, `tipo_pagamento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Empresa` ADD CONSTRAINT `Empresa_endereco_id_fkey` FOREIGN KEY (`endereco_id`) REFERENCES `Endereco`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Empresa` ADD CONSTRAINT `Empresa_plano_id_fkey` FOREIGN KEY (`plano_id`) REFERENCES `Plano`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `Cliente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HorarioDeFuncionamento` ADD CONSTRAINT `HorarioDeFuncionamento_dia_id_fkey` FOREIGN KEY (`dia_id`) REFERENCES `DiaDaSemana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HorarioDeFuncionamento` ADD CONSTRAINT `HorarioDeFuncionamento_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Impressora` ADD CONSTRAINT `Impressora_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Terminal` ADD CONSTRAINT `Terminal_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Terminal` ADD CONSTRAINT `Terminal_provedor_padrao_id_fkey` FOREIGN KEY (`provedor_padrao_id`) REFERENCES `ProvedorPagamento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmpresaFormaPagamento` ADD CONSTRAINT `EmpresaFormaPagamento_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmpresaFormaPagamento` ADD CONSTRAINT `EmpresaFormaPagamento_forma_pagamento_id_fkey` FOREIGN KEY (`forma_pagamento_id`) REFERENCES `FormaPagamentoGlobal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProvedorPagamento` ADD CONSTRAINT `ProvedorPagamento_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaxaCartao` ADD CONSTRAINT `TaxaCartao_provedor_id_fkey` FOREIGN KEY (`provedor_id`) REFERENCES `ProvedorPagamento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaxaCartao` ADD CONSTRAINT `TaxaCartao_bandeira_id_fkey` FOREIGN KEY (`bandeira_id`) REFERENCES `Bandeira`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaxaCartao` ADD CONSTRAINT `TaxaCartao_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoPagamento` ADD CONSTRAINT `PedidoPagamento_terminal_id_fkey` FOREIGN KEY (`terminal_id`) REFERENCES `Terminal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoPagamento` ADD CONSTRAINT `PedidoPagamento_provedor_id_fkey` FOREIGN KEY (`provedor_id`) REFERENCES `ProvedorPagamento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoPagamento` ADD CONSTRAINT `PedidoPagamento_bandeira_id_fkey` FOREIGN KEY (`bandeira_id`) REFERENCES `Bandeira`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoPagamento` ADD CONSTRAINT `PedidoPagamento_pedido_id_fkey` FOREIGN KEY (`pedido_id`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoPagamento` ADD CONSTRAINT `PedidoPagamento_empresa_forma_pagamento_id_fkey` FOREIGN KEY (`empresa_forma_pagamento_id`) REFERENCES `EmpresaFormaPagamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Classe` ADD CONSTRAINT `Classe_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subitem` ADD CONSTRAINT `Subitem_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GrupoFiscal` ADD CONSTRAINT `GrupoFiscal_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_classe_id_fkey` FOREIGN KEY (`classe_id`) REFERENCES `Classe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_grupo_fiscal_id_fkey` FOREIGN KEY (`grupo_fiscal_id`) REFERENCES `GrupoFiscal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemSubitem` ADD CONSTRAINT `ItemSubitem_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemSubitem` ADD CONSTRAINT `ItemSubitem_subitem_id_fkey` FOREIGN KEY (`subitem_id`) REFERENCES `Subitem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComboItem` ADD CONSTRAINT `ComboItem_combo_id_fkey` FOREIGN KEY (`combo_id`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComboItem` ADD CONSTRAINT `ComboItem_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EstoqueMovimentacao` ADD CONSTRAINT `EstoqueMovimentacao_subitem_id_fkey` FOREIGN KEY (`subitem_id`) REFERENCES `Subitem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EstoqueMovimentacao` ADD CONSTRAINT `EstoqueMovimentacao_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EstoquePosicao` ADD CONSTRAINT `EstoquePosicao_subitem_id_fkey` FOREIGN KEY (`subitem_id`) REFERENCES `Subitem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EstoquePosicao` ADD CONSTRAINT `EstoquePosicao_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Promocao` ADD CONSTRAINT `Promocao_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Promocao` ADD CONSTRAINT `Promocao_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mesa` ADD CONSTRAINT `Mesa_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comanda` ADD CONSTRAINT `Comanda_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `Cliente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comanda` ADD CONSTRAINT `Comanda_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Senha` ADD CONSTRAINT `Senha_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Motoboy` ADD CONSTRAINT `Motoboy_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZonaEntrega` ADD CONSTRAINT `ZonaEntrega_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_mesa_id_empresa_id_fkey` FOREIGN KEY (`mesa_id`, `empresa_id`) REFERENCES `Mesa`(`nome`, `empresa_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_comanda_id_fkey` FOREIGN KEY (`comanda_id`) REFERENCES `Comanda`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_senha_id_empresa_id_fkey` FOREIGN KEY (`senha_id`, `empresa_id`) REFERENCES `Senha`(`numero`, `empresa_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_terminal_id_fkey` FOREIGN KEY (`terminal_id`) REFERENCES `Terminal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `Cliente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_endereco_entrega_id_fkey` FOREIGN KEY (`endereco_entrega_id`) REFERENCES `Endereco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_motoboy_id_fkey` FOREIGN KEY (`motoboy_id`) REFERENCES `Motoboy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_zona_entrega_id_fkey` FOREIGN KEY (`zona_entrega_id`) REFERENCES `ZonaEntrega`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoItem` ADD CONSTRAINT `PedidoItem_pedido_id_fkey` FOREIGN KEY (`pedido_id`) REFERENCES `Pedido`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoItem` ADD CONSTRAINT `PedidoItem_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoItemSubitem` ADD CONSTRAINT `PedidoItemSubitem_pedido_item_id_fkey` FOREIGN KEY (`pedido_item_id`) REFERENCES `PedidoItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoItemSubitem` ADD CONSTRAINT `PedidoItemSubitem_subitem_id_fkey` FOREIGN KEY (`subitem_id`) REFERENCES `Subitem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendaHistoricoItem` ADD CONSTRAINT `VendaHistoricoItem_venda_historico_id_fkey` FOREIGN KEY (`venda_historico_id`) REFERENCES `VendaHistorico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendaHistoricoSubitem` ADD CONSTRAINT `VendaHistoricoSubitem_venda_historico_id_fkey` FOREIGN KEY (`venda_historico_id`) REFERENCES `VendaHistorico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendaHistoricoPagamento` ADD CONSTRAINT `VendaHistoricoPagamento_venda_historico_id_fkey` FOREIGN KEY (`venda_historico_id`) REFERENCES `VendaHistorico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
