/**
 * API Contract — minifood auth-server
 *
 * Fonte única de verdade para o agente de IA do frontend.
 * Cada entrada descreve: método HTTP, path, shape do request e shape do response.
 *
 * Convenções:
 *  - Campos com "?" são opcionais
 *  - Enums listados como union de strings
 *  - IDs numéricos vêm do seed / banco (use os retornados pelo login ou pelo GET de listagem)
 *  - Todas as rotas (exceto login) exigem header: Authorization: Bearer <access_token>
 *  - Header obrigatório em todas as rotas autenticadas: empresa-id: <number>
 */

// ─────────────────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────────────────

type Role          = 'OWNER' | 'ADMIN_GERAL' | 'ADMIN_SEM_FINANCEIRO' | 'OPERADOR_GERAL' | 'OPERADOR_SEM_ESTOQUE' | 'OPERADOR_COM_FINANCEIRO' | 'CONTADOR'
type TerminalTipo  = 'POS' | 'ADM' | 'PDV' | 'DELIVERY'
type PedidoStatus  = 'PENDENTE' | 'PAGA' | 'CANCELADA'
type PedidoFormato = 'BALCAO' | 'MESA' | 'SENHA' | 'COMANDA' | 'DELIVERY'
type ComandaStatus = 'OCUPADA' | 'CONTA' | 'PAGA'
type MesaStatus    = 'LIVRE' | 'OCUPADA' | 'CONTA'
type DeliveryStatus = 'RECEBIDO' | 'CONFIRMADO' | 'EM_PRODUCAO' | 'AGUARDANDO_MOTOBOY' | 'A_CAMINHO' | 'ENTREGUE' | 'CANCELADO'
type CanalOrigem   = 'WHATSAPP' | 'TELEFONE' | 'APP_PROPRIO' | 'BALCAO'
type ItemTipo      = 'PRODUTO' | 'MERCADORIA' | 'COMBO'
type ItemSubitemTipo = 'MATERIA_PRIMA' | 'ADICIONAL' | 'AMBOS'

// ─────────────────────────────────────────────────────────────────────────────
// SHAPES REUTILIZÁVEIS
// ─────────────────────────────────────────────────────────────────────────────

type Terminal = {
    id: number
    nome: string
    tipo: TerminalTipo
    modelo: string | null
    ativo: boolean
}

type Usuario = {
    id: number
    nome: string
    email: string
    telefone: string
    role: Role
    ativo: boolean
    empresa_id: number
    ultimo_login_terminal_id: number | null
}

type Comanda = {
    id: string          // UUID
    nome: string | null
    status: ComandaStatus
    created_at: string
    updated_at: string
    empresa_id: number
}

type Mesa = {
    id: number
    nome: string
    status: MesaStatus
    pos_x: number | null
    pos_y: number | null
    empresa_id: number
}

type Subitem = {
    id: number
    nome: string
    ativo: boolean
}

type ItemSubitemJunction = {
    item_id: number
    subitem_id: number
    tipo: ItemSubitemTipo
    quantidade: number
    preco: number | null
    subitem: Subitem
}

type Item = {
    id: number
    nome: string
    descricao: string | null
    preco: number
    tipo: ItemTipo
    ativo: boolean
    index: number
    tempo_preparo: number
    classe_id: number | null
}

type Classe = {
    id: number
    nome: string
    index: number
}

type PedidoItemSubitem = {
    id: string
    subitem_id: number
    tipo: ItemSubitemTipo
    removido: boolean
    quantidade: number
    preco: number
    desconto: number
}

type PedidoItem = {
    id: string
    item_id: number
    quantidade: number
    preco: number
    desconto: number
    observacao: string | null
    item: Item
    subitens: PedidoItemSubitem[]
}

type Pedido = {
    id: string          // UUID
    total: number
    desconto: number
    status: PedidoStatus
    formato: PedidoFormato | null
    observacao: string | null
    usuario_id: number
    terminal_id: number | null
    empresa_id: number
    // formato MESA
    mesa_id: string | null
    mesa: Mesa | null
    // formato COMANDA
    comanda_id: string | null
    comanda: Comanda | null
    // formato SENHA
    senha_id: number | null
    senha: { id: string; numero: number; nome: string } | null
    // formato DELIVERY
    cliente_id: number | null
    canal_origem: CanalOrigem | null
    taxa_entrega: number | null
    endereco_entrega_id: number | null
    zona_entrega_id: number | null
    motoboy_id: number | null
    delivery_status: DeliveryStatus | null
    created_at: string
    updated_at: string
    itens: PedidoItem[]
}

// ─────────────────────────────────────────────────────────────────────────────
// API CONTRACT
// ─────────────────────────────────────────────────────────────────────────────

export const API = {

    // ── AUTH ──────────────────────────────────────────────────────────────────

    auth: {

        login: {
            method: 'POST' as const,
            path: '/api/auth/login',
            auth: false,
            request: {} as {
                email: string
                senha: string
            },
            response: {} as {
                access_token: string
                usuario: Omit<Usuario, never>
                terminais: Terminal[]   // apenas os terminais que o role do usuário pode acessar
            },
        },

        me: {
            method: 'GET' as const,
            path: '/api/auth/me',
            auth: true,
            response: {} as {
                sub: number
                sid: string
                usuario_id: number
                usuario_email: string
                empresa_id: number
                role: Role
            },
        },

    },

    // ── PDV — CARDÁPIO ─────────────────────────────────────────────────────────

    pdv: {

        itens: {
            method: 'GET' as const,
            path: '/api/itenspdv/itens',
            auth: true,
            response: {} as Array<Item & { classe: Classe | null; subitens: ItemSubitemJunction[] }>,
        },

        classes: {
            method: 'GET' as const,
            path: '/api/itenspdv/classes',
            auth: true,
            // response: array de classes, cada uma com seus itens e os subitens de cada item
            response: {} as Array<Classe & {
                item: Array<Item & {
                    subitens: ItemSubitemJunction[]
                    combos_as_combo: Array<{ item_id: number; quantidade: number; item: Item }>
                }>
            }>,
        },

    },

    // ── OPERACIONAL — PEDIDOS ─────────────────────────────────────────────────

    operacional: {

        lancarPedido: {
            method: 'POST' as const,
            path: '/api/operacional/salvar',
            auth: true,
            request: {} as {
                usuario_id: number
                terminal_id?: number
                total: number
                desconto?: number
                observacao?: string

                // escolha UM dos formatos abaixo (ou nenhum para BALCAO):
                mesa_id?: string        // nome da mesa  ex: "Mesa 01"
                comanda_id?: string     // UUID da comanda (Comanda.id) retornado por POST /comandas/salvar
                senha_id?: number       // número da senha já existente
                criar_senha?: boolean   // true → gera número automaticamente

                // delivery (preencher junto com canal_origem para detectar formato DELIVERY):
                canal_origem?: CanalOrigem
                cliente_id?: number
                taxa_entrega?: number
                endereco_entrega_id?: number
                zona_entrega_id?: number
                motoboy_id?: number

                itens: Array<{
                    item_id: number
                    quantidade: number
                    preco: number       // preço unitário no momento da venda
                    desconto?: number
                    observacao?: string
                    // Enviar TODOS os subitens do item (snapshot completo):
                    //   MATERIA_PRIMA removido=false → ingrediente consumido normalmente
                    //   MATERIA_PRIMA removido=true  → cliente pediu pra retirar
                    //   ADICIONAL     removido=false → cliente pediu adicional (tem preco)
                    subitens?: Array<{
                        subitem_id: number
                        tipo: ItemSubitemTipo
                        removido?: boolean      // default false
                        quantidade: number
                        preco: number           // 0 para MATERIA_PRIMA, valor real para ADICIONAL
                        desconto?: number
                    }>
                }>
            },
            response: {} as Pedido,
        },

        pedirConta: {
            method: 'PUT' as const,
            path: '/api/operacional/conta',
            auth: true,
            request: {} as {
                mesa?: string       // nome da mesa
                comanda?: string    // UUID da comanda (Comanda.id)
            },
            response: {} as { count: number },
        },

        pagar: {
            method: 'PUT' as const,
            path: '/api/operacional/pagar',
            auth: true,
            request: {} as {
                // escolha UM identificador:
                mesa?: string           // nome da mesa
                comanda?: string        // UUID da comanda (Comanda.id)
                senha?: number
                pedido_id?: string  // para BALCAO e DELIVERY

                pagamentos: Array<{
                    forma_pagamento_id: number
                    valor: number
                    parcelas?: number
                    troco_para?: number
                }>
            },
            // response: VendaHistorico gerado
            response: {} as {
                id: string
                empresa_id: number
                total: number
                desconto: number
                status: 'PAGA'
                usuario_nome: string
                usuario_email: string
                created_at: string
            },
        },

        // ── QUERIES / LISTAS ─────────────────────────────────────────────────

        buscarPorFormato: {
            method: 'GET' as const,
            path: '/api/operacional/formato?tipo=<tipo>',
            auth: true,
            params: {} as { tipo: 'mesa' | 'comanda' | 'senha' | 'balcao' | 'delivery' },
            response: {} as Pedido[],
        },

        kds: {
            method: 'GET' as const,
            path: '/api/operacional/kds',
            auth: true,
            response: {} as Array<Pick<Pedido, 'id' | 'status' | 'created_at' | 'updated_at'> & { itens: PedidoItem[] }>,
        },

        // ── MESA ─────────────────────────────────────────────────────────────

        mapaDeMesas: {
            method: 'GET' as const,
            path: '/api/operacional/mesas/mapa',
            auth: true,
            response: {} as Array<Mesa & { pedidos: Pedido[] }>,
        },

        buscarMesa: {
            method: 'GET' as const,
            path: '/api/operacional/mesa/:nome',
            auth: true,
            params: {} as { nome: string },     // nome da mesa ex: "Mesa 01"
            // retorna apenas pedidos PENDENTE com itens, item detalhado e subitens com nome
            response: {} as Mesa & {
                pedidos: Array<Pedido & {
                    itens: Array<PedidoItem & {
                        item: Item
                        subitens: Array<PedidoItemSubitem & { subitem: { id: number; nome: string } }>
                    }>
                }>
                total: { total: number | null; desconto: number | null }
            },
        },

        // ── COMANDA ───────────────────────────────────────────────────────────

        criarComanda: {
            method: 'POST' as const,
            path: '/api/operacional/comandas/salvar',
            auth: true,
            request: {} as { nome?: string },
            response: {} as Comanda,
        },

        listarComandas: {
            method: 'GET' as const,
            path: '/api/operacional/comandas/todos',
            auth: true,
            response: {} as Comanda[],      // apenas OCUPADA e CONTA
        },

        buscarComanda: {
            method: 'GET' as const,
            path: '/api/operacional/comandas/id/:id',
            auth: true,
            params: {} as { id: string },   // UUID da comanda (Comanda.id)
            // retorna apenas pedidos PENDENTE com itens, item detalhado e subitens com nome
            response: {} as Comanda & {
                pedidos: Array<Pedido & {
                    itens: Array<PedidoItem & {
                        item: Item
                        subitens: Array<PedidoItemSubitem & { subitem: { id: number; nome: string } }>
                    }>
                }>
                total: { total: number | null; desconto: number | null }
            },
        },

        cancelarComanda: {
            method: 'DELETE' as const,
            path: '/api/operacional/comandas/delete/:id',
            auth: true,
            params: {} as { id: string },   // UUID da comanda (Comanda.id)
            response: {} as { count: number },  // número de comandas deletadas (sempre 1)
        },

        // ── SENHA ─────────────────────────────────────────────────────────────

        buscarSenha: {
            method: 'GET' as const,
            path: '/api/operacional/senha/:numero',
            auth: true,
            params: {} as { numero: number },
            response: {} as {
                id: string
                numero: number
                nome: string
                pedidos: Pedido[]
                total: { total: number | null; desconto: number | null }
            },
        },

        // ── DELIVERY ─────────────────────────────────────────────────────────

        alterarStatusDelivery: {
            method: 'PUT' as const,
            path: '/api/operacional/delivery/:pedidoId/status',
            auth: true,
            params: {} as { pedidoId: string },
            request: {} as {
                status: DeliveryStatus
                motoboy_id?: number     // atribuir/trocar motoboy — tipicamente enviado junto com AGUARDANDO_MOTOBOY
            },
            // fluxo: RECEBIDO → CONFIRMADO → EM_PRODUCAO → AGUARDANDO_MOTOBOY → A_CAMINHO → ENTREGUE
            // cancelar a qualquer momento: CANCELADO
            response: {} as Pedido,
        },

        // ── ESTOQUE ───────────────────────────────────────────────────────────

        estoqueAtual: {
            method: 'GET' as const,
            path: '/api/operacional/estoque/atual',
            auth: true,
            response: {} as Array<{
                id: number
                nome: string
                controla_estoque: boolean
                estoque_posicao: {
                    quantidade_fisica: number
                    quantidade_reserva: number
                    estoque_minimo: number
                    custo_unitario: number
                } | null
            }>,
        },

        entradaEstoque: {
            method: 'POST' as const,
            path: '/api/operacional/estoque/entrada',
            auth: true,
            request: {} as {
                subitem_id: number
                quantidade: number
                tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE'
                custo_unitario_momento?: number
                referencia?: string     // ex: "compra:45", "inventario:2026-04-18"
            },
            response: {} as { count: number },
        },

    },

    // ── LOCAIS (CSVs imutáveis — estados, municípios, bairros do Brasil) ──────

    locais: {

        municipios: {
            method: 'GET' as const,
            path: '/api/locais/municipios?estado=<UF>',
            auth: true,
            params: {} as { estado: string },   // ex: "PR", "SP", "RJ"
            response: {} as string[],            // lista de nomes de municípios ordenada
        },

        bairros: {
            method: 'GET' as const,
            path: '/api/locais/bairros?cidade=<nome>&estado=<UF>',
            auth: true,
            params: {} as { cidade: string; estado?: string },
            // se só 1 resultado: retorna o objeto direto
            // se ambiguidade (mesmo nome em vários estados): retorna array
            response: {} as
                | { municipio: string; uf: string; bairros: string[] }
                | Array<{ municipio: string; uf: string; bairros: string[] }>,
        },

    },

    // ── ZONAS DE ENTREGA ──────────────────────────────────────────────────────

    zonasEntrega: {

        salvar: {
            method: 'POST' as const,
            path: '/api/zonas-entrega/salvar',
            auth: true,
            request: {} as { nome: string; taxa_base?: number; taxa: number; tempo_estimado?: number; ativo?: boolean },
            response: {} as { id: number; nome: string; taxa_base: number; taxa: number; tempo_estimado: number; ativo: boolean },
        },

        listar: {
            method: 'GET' as const,
            path: '/api/zonas-entrega/todos',
            auth: true,
            // total cobrado ao cliente = taxa_base + taxa
            response: {} as Array<{ id: number; nome: string; taxa_base: number; taxa: number; tempo_estimado: number; ativo: boolean }>,
        },

        buscarPorId: {
            method: 'GET' as const,
            path: '/api/zonas-entrega/id/:id',
            auth: true,
            params: {} as { id: number },
            response: {} as { id: number; nome: string; taxa_base: number; taxa: number; tempo_estimado: number; ativo: boolean },
        },

        update: {
            method: 'PUT' as const,
            path: '/api/zonas-entrega/update',
            auth: true,
            request: {} as { id: number; nome: string; taxa_base?: number; taxa: number; tempo_estimado?: number; ativo?: boolean },
            response: {} as { id: number; nome: string; taxa_base: number; taxa: number; tempo_estimado: number; ativo: boolean },
        },

        deletar: {
            method: 'DELETE' as const,
            path: '/api/zonas-entrega/delete/:id',
            auth: true,
            params: {} as { id: number },
            response: {} as { id: number },
        },

        atualizarTaxaBase: {
            method: 'PUT' as const,
            path: '/api/zonas-entrega/taxa-base',
            auth: true,
            request: {} as { taxa_base: number },
            response: {} as { count: number },  // número de zonas atualizadas
        },

        importar: {
            method: 'POST' as const,
            path: '/api/zonas-entrega/importar',
            auth: true,
            // fluxo: buscar bairros → user define taxa por bairro → POST aqui
            // upsert por nome: se a zona já existir, atualiza taxa/tempo; se não, cria
            // taxa_base no root é aplicada a todas as zonas do lote (pode ser sobrescrita por zona individualmente)
            request: {} as {
                taxa_base?: number      // taxa fixa da empresa, aplicada a todas as zonas
                zonas: Array<{
                    nome: string
                    taxa: number            // taxa variável por bairro
                    taxa_base?: number      // sobrescreve o taxa_base do root para essa zona
                    tempo_estimado?: number // em minutos, default 30
                }>
            },
            response: {} as { count: number },
        },

    },

    // ── FORMAS DE PAGAMENTO ───────────────────────────────────────────────────
    // EmpresaFormaPagamento: vínculo entre a empresa e as formas globais (Dinheiro, PIX, Crédito...)
    // A lista global é imutável; a empresa só ativa/desativa cada forma.

    formasPagamento: {

        listar: {
            method: 'GET' as const,
            path: '/api/formas-pagamento/todos',
            auth: true,
            response: {} as Array<{
                id: number
                ativo: boolean
                forma_pagamento: {
                    id: number
                    nome: string
                    tipo: 'DINHEIRO' | 'PIX' | 'CARTAO_DEBITO' | 'CARTAO_CREDITO' | 'VOUCHER' | 'OUTRO'
                    exige_troco: boolean
                    permite_parcelamento: boolean
                }
            }>,
        },

        buscarPorId: {
            method: 'GET' as const,
            path: '/api/formas-pagamento/id/:id',
            auth: true,
            params: {} as { id: number },
            response: {} as {
                id: number
                ativo: boolean
                forma_pagamento: { id: number; nome: string; tipo: string; exige_troco: boolean; permite_parcelamento: boolean }
            },
        },

        toggleAtivo: {
            method: 'PUT' as const,
            path: '/api/formas-pagamento/update-ativo',
            auth: true,
            request: {} as { id: number },      // id do EmpresaFormaPagamento
            response: {} as { id: number; ativo: boolean },
        },

    },

    // ── BANDEIRAS DE CARTÃO ───────────────────────────────────────────────────
    // Tabela global (VISA, MASTERCARD, ELO...) — só leitura, sem empresa_id

    bandeirasCartao: {

        listar: {
            method: 'GET' as const,
            path: '/api/bandeiras-cartao/todos',
            auth: true,
            response: {} as Array<{ id: number; nome: string }>,
        },

        buscarPorId: {
            method: 'GET' as const,
            path: '/api/bandeiras-cartao/id/:id',
            auth: true,
            params: {} as { id: number },
            response: {} as { id: number; nome: string },
        },

    },

    // ── PROVEDORES DE PAGAMENTO ───────────────────────────────────────────────
    // Ex: Stone, Cielo, PagSeguro. Cada provedor tem suas taxas por bandeira/tipo/parcelas.

    provedores: {

        salvar: {
            method: 'POST' as const,
            path: '/api/provedores/salvar',
            auth: true,
            request: {} as { nome: string },
            response: {} as { id: number; nome: string; nome_normalizado: string },
        },

        salvarComTaxas: {
            method: 'POST' as const,
            path: '/api/provedores/salvar-com-taxas',
            auth: true,
            request: {} as {
                nome: string
                taxas: Array<{
                    bandeira_id: number
                    tipo: 'DEBITO' | 'CREDITO'
                    parcelas: number            // 1–12
                    prazo_recebimento: number   // dias: 2, 14, 30...
                    taxa_percentual: number
                    taxa_fixa?: number
                }>
            },
            response: {} as { id: number; nome: string },
        },

        updateComTaxas: {
            method: 'PUT' as const,
            path: '/api/provedores/update-com-taxas',
            auth: true,
            request: {} as {
                id: number
                nome: string
                taxas: Array<{
                    id?: number         // se omitido, cria nova taxa
                    bandeira_id: number
                    tipo: 'DEBITO' | 'CREDITO'
                    parcelas: number
                    prazo_recebimento: number
                    taxa_percentual: number
                    taxa_fixa?: number
                }>
            },
            response: {} as { id: number; nome: string },
        },

        listar: {
            method: 'GET' as const,
            path: '/api/provedores/todos',
            auth: true,
            response: {} as Array<{
                id: number
                nome: string
                taxas: Array<{ id: number; bandeira_id: number; tipo: string; parcelas: number; taxa_percentual: number; taxa_fixa: number | null }>
            }>,
        },

        buscarPorId: {
            method: 'GET' as const,
            path: '/api/provedores/id/:id',
            auth: true,
            params: {} as { id: number },
            response: {} as {
                id: number
                nome: string
                taxas: Array<{ id: number; bandeira_id: number; tipo: string; parcelas: number; taxa_percentual: number; taxa_fixa: number | null }>
            },
        },

        deletar: {
            method: 'DELETE' as const,
            path: '/api/provedores/delete/:id',
            auth: true,
            params: {} as { id: number },
            response: {} as { id: number },
        },

    },

    // ── TAXAS DE CARTÃO ───────────────────────────────────────────────────────
    // CRUD individual de taxas (alternativa ao salvarComTaxas do provedor)

    taxasCartao: {

        salvar: {
            method: 'POST' as const,
            path: '/api/taxas-cartao/salvar',
            auth: true,
            request: {} as {
                provedor_id: number
                bandeira_id: number
                tipo: 'DEBITO' | 'CREDITO'
                parcelas: number
                prazo_recebimento: number
                taxa_percentual: number
                taxa_fixa?: number
            },
            response: {} as { id: number },
        },

        listar: {
            method: 'GET' as const,
            path: '/api/taxas-cartao/todos',
            auth: true,
            response: {} as Array<{
                id: number
                provedor_id: number
                bandeira_id: number
                tipo: string
                parcelas: number
                prazo_recebimento: number
                taxa_percentual: number
                taxa_fixa: number | null
            }>,
        },

        buscarPorId: {
            method: 'GET' as const,
            path: '/api/taxas-cartao/id/:id',
            auth: true,
            params: {} as { id: number },
            response: {} as { id: number; provedor_id: number; bandeira_id: number; tipo: string; parcelas: number; taxa_percentual: number; taxa_fixa: number | null },
        },

        update: {
            method: 'PUT' as const,
            path: '/api/taxas-cartao/update',
            auth: true,
            request: {} as {
                id: number
                bandeira_id: number
                tipo: 'DEBITO' | 'CREDITO'
                parcelas: number
                prazo_recebimento: number
                taxa_percentual: number
                taxa_fixa?: number
            },
            response: {} as { id: number },
        },

        deletar: {
            method: 'DELETE' as const,
            path: '/api/taxas-cartao/delete/:id',
            auth: true,
            params: {} as { id: number },
            response: {} as { id: number },
        },

    },

    // ── TERMINAIS ─────────────────────────────────────────────────────────────

    terminais: {

        login: {
            method: 'POST' as const,
            path: '/api/terminais/login',
            auth: true,
            request: {} as { terminal_id: number; usuario_id: number },
            response: {} as Terminal,
        },

        listar: {
            method: 'GET' as const,
            path: '/api/terminais/todos',
            auth: true,
            response: {} as Terminal[],
        },

        buscarPorId: {
            method: 'GET' as const,
            path: '/api/terminais/id/:id',
            auth: true,
            params: {} as { id: number },
            response: {} as Terminal,
        },

    },

} as const
