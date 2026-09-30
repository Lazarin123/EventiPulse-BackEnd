# ⚡ EventPulse API

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=black)](https://neon.tech/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Motor de disparo e gerenciamento assíncrono de webhooks de alta performance, projetado para garantir entregas confiáveis de eventos HTTP com retentativas, controle de falhas e segurança criptográfica.

## </div>

## 📌 Sobre o Projeto

O **EventPulse API** resolve um desafio comum em arquiteturas orientadas a eventos: a entrega garantida de webhooks para sistemas de terceiros. Diferente de um CRUD tradicional, este motor implementa lógica de background para disparo assíncrono, políticas de repetição (_retries_) com backoff exponencial e assinaturas criptográficas (**HMAC SHA-256**) para validação de autenticidade.

---

## 🚀 Tecnologias Utilizadas

- **Runtime:** Node.js
- **Linguagem:** TypeScript
- **Framework Web:** Express
- **Banco de Dados:** PostgreSQL (Serverless via Neon)
- **ORM:** Drizzle ORM
- **Segurança:** Criptografia HMAC SHA-256

---

## 🛠️ Arquitetura e Fluxo

1. **Registro de Endpoint:** O cliente cadastra uma URL de destino para receber os eventos. O sistema gera automaticamente um segredo criptográfico (`secret`).
2. **Disparo de Evento:** Um evento central é publicado na API. O motor identifica todos os endpoints ativos.
3. **Entrega Assíncrona & Retries:** Cada requisição HTTP é disparada de forma assíncrona. Em caso de falha (status diferente de `2xx`), o sistema executa novas tentativas automáticas utilizando backoff exponencial.
4. **Segurança:** O payload enviado inclui o cabeçalho `X-EventPulse-Signature`, permitindo que o receptor valide a integridade dos dados usando o segredo compartilhado.

---

## 📦 Como Executar o Projeto Localmente

### Pré-requisitos

- Node.js instalado (versão 18+ recomendada)
- Uma conta e banco de dados configurados na [Neon](https://neon.tech/)

### 1. Clonar o Repositório

```bash
git clone https://github.com/SEU_USUARIO/EventPulse-BackEnd.git
cd EventPulse-BackEnd
```

### 2. Instalar as Dependências

```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no modelo:

```env
PORT=3333
DATABASE_URL="postgresql://usuario:senha@host.neon.tech/neondb?sslmode=require"
```

### 4. Executar as Migrações do Banco de Dados

```bash
npx drizzle-kit push
```

### 5. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

A API estará rodando em `http://localhost:3333`.

---

## 📡 Documentação da API

### 1. Health Check

`GET /health`

**Descrição:** Verifica se a API está online.

### 2. Cadastrar Endpoint de Webhook

`POST /api/endpoints`

**Body (JSON):**

```json
{
  "url": "https://seu-cliente.com/webhook-receiver",
  "description": "Endpoint do sistema de pagamentos"
}
```

### 3. Disparar Evento

`POST /api/events`

**Body (JSON):**

```json
{
  "event": "order.created",
  "orderId": "987654",
  "amount": 150.0
}
```

---

## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
