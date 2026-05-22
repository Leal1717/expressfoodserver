# MercadoPago OAuth — Guia do Frontend

Este documento descreve o que o frontend precisa fazer para conectar a conta MercadoPago
de um restaurante (tenant) à plataforma minifood.

---

## Variáveis de ambiente necessárias no backend

Adicionar ao `.env` do server antes de testar:

```env
MP_APP_ID=           # client_id da sua aplicação MP (obtido no painel de developers)
MP_CLIENT_SECRET=    # client_secret da aplicação MP
MP_REDIRECT_URI=     # URL exata cadastrada no painel MP, ex: https://api.seusite.com.br/api/mercadopago/oauth/callback
MP_FRONTEND_SUCCESS_URL=  # URL do frontend após sucesso, ex: https://app.seusite.com.br/configuracoes/pagamentos?mp=sucesso
MP_FRONTEND_ERROR_URL=    # URL do frontend após erro, ex: https://app.seusite.com.br/configuracoes/pagamentos?mp=erro
```

---

## Como registrar a aplicação no MercadoPago

1. Acesse https://www.mercadopago.com.br/developers/pt/docs/your-integrations/dashboard
2. Crie uma nova aplicação
3. Nas configurações, adicione a `redirect_uri` exata (deve ser igual ao `MP_REDIRECT_URI`)
4. Copie o `client_id` e `client_secret` para o `.env`

---

## Como ativar no NestJS

Importar o módulo em `server/src/app.module.ts`:

```typescript
import { MercadoPagoOAuthModule } from '../integracoes/mercadopago/mercadopago-oauth.module';

// dentro do @Module({ imports: [...] })
MercadoPagoOAuthModule,
```

Rodar a migration do Prisma após adicionar o model `MercadoPagoCredencial`:

```bash
npx prisma migrate dev --name add_mercadopago_credencial
```

---

## Fluxo do frontend (passo a passo)

### 1. Verificar se já está conectado

Na página de configurações de pagamentos, ao carregar:

```typescript
GET /api/mercadopago/oauth/status
Authorization: Bearer <token_jwt>
```

Resposta quando **não conectado**:
```json
{ "connected": false }
```

Resposta quando **conectado**:
```json
{
  "connected": true,
  "live_mode": false,
  "mp_user_id": "123456789",
  "expires_at": "2026-11-18T10:00:00.000Z",
  "scope": "read write"
}
```

---

### 2. Iniciar a conexão

Quando o usuário clicar em "Conectar MercadoPago":

```typescript
// 1. Buscar a URL de autorização
const res = await fetch('/api/mercadopago/oauth/connect', {
  headers: { Authorization: `Bearer ${token}` }
});
const { url } = await res.json();

// 2. Redirecionar o usuário para o MercadoPago
window.location.href = url;
```

O usuário será levado para a tela de login do MercadoPago, onde aprovará as permissões.

---

### 3. Retorno após autorização

O MercadoPago redirecionará o navegador para o callback do backend automaticamente.
O backend trocará o código por token e redirecionará para `MP_FRONTEND_SUCCESS_URL` ou `MP_FRONTEND_ERROR_URL`.

O frontend deve tratar esses casos via query string:

```typescript
// Exemplo React: na página de configurações
const params = new URLSearchParams(window.location.search);

if (params.get('mp') === 'sucesso') {
  // mostrar toast de sucesso e recarregar status
  toast.success('MercadoPago conectado com sucesso!');
  recarregarStatus();
}

if (params.get('mp') === 'erro') {
  toast.error('Erro ao conectar MercadoPago. Tente novamente.');
}
```

---

### 4. Desconectar

```typescript
await fetch('/api/mercadopago/oauth/disconnect', {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${token}` }
});
// { "ok": true }
```

---

## Sandbox (testes)

Para testar sem dinheiro real:
1. Crie uma conta de **vendedor de teste** em https://www.mercadopago.com.br/developers/pt/docs/your-integrations/test/accounts
2. Use essa conta para autorizar na tela do MercadoPago
3. O campo `live_mode: false` indica que o token é de sandbox

---

## Endpoints resumidos

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/mercadopago/oauth/connect` | JWT (OWNER/ADMIN_GERAL) | Retorna URL de autorização |
| `GET` | `/api/mercadopago/oauth/callback` | Público (chamado pelo MP) | Processa retorno do OAuth |
| `GET` | `/api/mercadopago/oauth/status` | JWT (OWNER/ADMIN_GERAL) | Status da conexão |
| `DELETE` | `/api/mercadopago/oauth/disconnect` | JWT (OWNER/ADMIN_GERAL) | Remove credencial |
