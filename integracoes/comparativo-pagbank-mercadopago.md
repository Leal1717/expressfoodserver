# Comparativo: PagBank vs MercadoPago para SaaS Multi-Tenant

> Contexto: análise focada no modelo do **minifood** — plataforma SaaS multi-tenant onde cada restaurante (tenant) processa pagamentos na própria conta do gateway, com comissão da plataforma sobre cada transação.

---

## 1. Modelo Multi-Tenant (OAuth)

Ambos usam **OAuth 2.0** — o restaurante autoriza a plataforma a operar em nome dele, e a plataforma guarda o `access_token` por tenant.

### PagBank — Connect API

```
1. Redirecionar cliente para URL de autorização
   https://connect.pagbank.com.br/oauth2/authorize
     ?response_type=code
     &client_id=SEU_CLIENT_ID
     &redirect_uri=https://seusite.com/pagbank/callback
     &scope=payments.create+payments.read+payments.refund
     &state=TENANT_ID

2. PagBank retorna ?code=XXXXXX no redirect_uri (válido 10 min, uso único)

3. Trocar code por access_token
   POST /oauth2/token
   { "grant_type": "authorization_code", "code": "XXXXXX" }

4. Guardar access_token + refresh_token por tenant no banco
```

**Escopos disponíveis:**

| Escopo | Permissão |
|--------|-----------|
| `payments.create` | Criar cobranças |
| `payments.read` | Consultar pagamentos |
| `payments.refund` | Estornar pagamentos |
| `accounts.read` | Dados da conta |
| `checkout.create` | Criar checkouts |

### MercadoPago — OAuth

Fluxo idêntico via `authorization_code`. Após autorização, usa-se:
- `public_key` do integrador no frontend
- `access_token` do vendedor no backend/header

**Split de pagamento:**
- Checkout Pro → parâmetro `marketplace_fee`
- Checkout API → parâmetro `application_fee`

A comissão do MP é descontada primeiro, depois a comissão da plataforma.

---

## 2. Pagamentos Web

| Recurso | PagBank | MercadoPago |
|---------|---------|-------------|
| PIX | Sim | Sim |
| Cartão de crédito | Sim | Sim |
| Cartão de débito (3DS) | Sim (3DS obrigatório) | Sim |
| Boleto | Sim | Sim |
| Carteira digital | PagBank Wallet | MP Wallet |
| Checkout hospedado | Checkout PagBank | Checkout Pro |
| Checkout transparente (API) | Order API | Checkout API |
| Checkout modular (UI components) | Não tem | **Checkout Bricks** |
| Recorrência / assinaturas | Sim | Sim |
| Split automático | Sim | Sim |
| Tokenização de cartão | Sim | Sim |
| Webhooks | Sim | Sim |

### O que é 3DS (PagBank)
Protocolo de autenticação extra para cartão. Débito **exige** 3DS; crédito é opcional. Quando aprovado pelo 3DS, a responsabilidade por fraude passa para o banco emissor.

---

## 3. Maquininha (Pagamento Presencial)

Esta é a **diferença mais crítica** entre os dois para o modelo do minifood.

| Critério | PagBank SmartPOS | MercadoPago Point |
|----------|-----------------|-------------------|
| **Modelo de integração** | App Android rodando dentro da maquininha | API REST que envia cobranças ao terminal |
| **Parceria comercial** | **Obrigatória** (aprovação prévia pelo time comercial) | **Não precisa** — self-service |
| **SDK necessário** | Android (Java/Kotlin) nativo | Nenhum — REST puro |
| **Processo para começar** | Contato comercial → aprovação → terminal DEBUG → dev → homologação → parceiro revendedor | Criar app no painel → vincular terminal → pronto |
| **Modo self-service** | Não documentado | Sim (`SELF_SERVICE` mode) |
| **Terminais suportados** | P2, PAX A930, PAX A50, SK800 | Point Smart 1/2, Point Pro 2/3 |
| **Métodos aceitos** | Cartão + PIX | Cartão + PIX + QR Code + vouchers alimentação |
| **Multi-tenant** | Cada tenant usa a própria maquininha, mas você precisa ser parceiro revendedor | Cada tenant usa a própria maquininha via OAuth — sem burocracia extra |
| **Complexidade** | Alta | Baixa/Média |

### Como funciona o MP Point na prática

```
Seu backend cria a cobrança via API (com access_token do restaurante)
              ↓
Terminal do restaurante carrega o valor automaticamente
              ↓
Cliente aproxima/insere o cartão
              ↓
Seu backend recebe notificação via webhook
```
O operador não precisa digitar nada na maquininha.

---

## 4. Ecossistema de Desenvolvimento

| Recurso | PagBank | MercadoPago |
|---------|---------|-------------|
| SDKs server-side | Básico | Python, Node, PHP, Java, Ruby, .NET, Go |
| SDK mobile nativo | Não | **Sim (Native SDK)** |
| CLI para devs | Não | **Sim (MP CLI)** |
| MCP Server (IA) | Não | **Sim** |
| Sandbox self-service | Sim | Sim |
| Qualidade da documentação | Boa | Excelente |
| Comunidade / maturidade BR | Alta | Muito alta |
| Homologação obrigatória | Sim (até 4 dias úteis) | Mais ágil (self-service) |

---

## 5. Comparativo Final

| Critério | PagBank | MercadoPago | Vencedor |
|----------|---------|-------------|----------|
| Multi-tenant web | Sim | Sim | Empate |
| Split de pagamento | Sim | Sim | Empate |
| Maquininha sem parceria comercial | Não | **Sim** | **MP** |
| Maquininha multi-tenant simples | Não | **Sim** | **MP** |
| Ecossistema de dev | Básico | **Completo** | **MP** |
| Velocidade para ir ao ar | Média | **Alta** | **MP** |
| Maturidade no Brasil | Alta | Muito alta | **MP** |

---

## 6. Recomendação para o minifood

### Fase 1 — MVP (web)
Usar **MercadoPago** com OAuth por tenant + Checkout Bricks ou Checkout API.
Cobre delivery, pedidos online, PIX e cartão sem burocracia.

### Fase 2 — Maquininha
Usar **MP Point API** (self-service). Cada restaurante compra a Point, você vincula via OAuth e já opera. Sem necessidade de parceria comercial.

### Por que não PagBank agora
A integração web é equivalente, mas a maquininha exige parceria comercial aprovada antes de qualquer desenvolvimento — barreira de entrada alta demais para o estágio inicial.

---

## 7. Links de referência

- [MercadoPago Developers](https://www.mercadopago.com.br/developers/pt)
- [MP OAuth](https://www.mercadopago.com.co/developers/pt/docs/security/oauth)
- [MP Marketplace](https://www.mercadopago.com.co/developers/pt/docs/checkout-pro/how-tos/integrate-marketplace)
- [MP Point API](https://www.mercadopago.cl/developers/pt/docs/mp-point/overview)
- [PagBank Developers](https://developer.pagbank.com.br/)
- [PagBank Connect](https://developer.pagbank.com.br/docs/connect)
- [PagBank Connect Authorization](https://developer.pagbank.com.br/docs/connect-authorization)
- [PagBank SmartPOS](https://developer.pagbank.com.br/docs/integracao-smartpos-1)
