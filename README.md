# Payment API — NestJS + Prisma + PostgreSQL + Redis + BullMQ + Mercado Pago

## Introdução
Payment API orquestra a criação e atualização de pagamentos com integrações assíncronas. Funcionalidades principais: criação de pagamento, atualização de status, listagem com filtros, validação de webhook do Mercado Pago e processamento assíncrono via BullMQ. Voltada para aplicações que precisam processar pagamentos de forma segura e escalável.

## Arquitetura do Projeto
- NestJS modular (PaymentModule, PrismaModule, LoggerModule, WorkerModule).
- Repository Pattern com Prisma ORM.
- Fila com BullMQ para callbacks de pagamento.
- Worker dedicado para processamento assíncrono.
- Logger customizado com Pino.
- Pastas seguindo Clean Architecture (domain, application, infra).

## Stack Tecnológica
- NestJS
- Prisma
- PostgreSQL
- Redis
- BullMQ
- Pino Logger
- Docker + Docker Compose
- Mercado Pago REST API

## Como rodar localmente (sem docker)
Pré-requisitos: Node 20+, PostgreSQL 16, Redis 7.

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run start:dev
npm run start:worker
```

## Como rodar com Docker
Serviços: `postgres` (banco), `redis` (fila), `api` (Nest), `worker` (BullMQ), `prisma-migrate` (migrações).

```bash
docker-compose up --build
```

## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| DATABASE_URL | URL de conexão do Postgres | postgres://postgres:postgres@localhost:5432/postgres |
| REDIS_HOST | Host do Redis | localhost |
| REDIS_PORT | Porta do Redis | 6379 |
| PORT | Porta da API HTTP | 3000 |
| MERCADOPAGO_ACCESS_TOKEN | Token de acesso da API Mercado Pago | your_token |
| MERCADOPAGO_WEBHOOK_SECRET | Segredo para validar assinatura do webhook | your_secret |

## Estrutura de Pastas
```
src/
├─ modules/
│  ├─ payment/
│  │  ├─ application/use-cases
│  │  ├─ domain/entities
│  │  ├─ infra/controllers
│  │  ├─ infra/repositories
│  │  ├─ infra/queue
│  │  └─ infra/mercado-pago
│  └─ customer/
├─ shared/
│  └─ infra/
│     ├─ database
│     ├─ logger
│     └─ filters
```

## Endpoints Disponíveis

### POST /payment
- Descrição: cria um pagamento.
- Body: `{ cpf, description, amount, paymentMethod, status?, preferenceId?, externalId? }`.
- 200: pagamento criado.
- 400: validação.
- 500: erro interno.

### GET /payment
- Descrição: lista pagamentos com filtros.
- Query: `cpf?`, `method?`, `status?`.
- 200: lista de pagamentos.
- 400: validação.
- 500: erro interno.

### GET /payment/:id
- Descrição: busca pagamento por ID.
- Params: `id`.
- 200: pagamento encontrado.
- 404/400: não encontrado ou inválido.
- 500: erro interno.

### PUT /payment/:id
- Descrição: atualiza dados e status do pagamento.
- Params: `id`.
- Body: `{ cpf?, description?, amount?, paymentMethod?, status?, preferenceId?, externalId? }`.
- 200: pagamento atualizado.
- 400: validação ou transição inválida.
- 404: não encontrado.
- 500: erro interno.

### POST /payment/mercadopago/webhook
- Descrição: recebe callbacks do Mercado Pago.
- Headers: `x-signature`, `x-request-id`.
- Body: payload do evento com `paymentId`, `status`, `external_id`, `preference_id`.
- 200: `{ received: true }` quando assinatura válida.
- 401: assinatura inválida.
- 500: erro interno.

## Fluxo de Pagamento
1. Criar pagamento via `POST /payment`.
2. Chamada ao Mercado Pago para gerar preferência e iniciar cobrança.
3. Worker atualiza status conforme respostas assíncronas.
4. Auditoria: cada atualização de status persiste dados para rastreabilidade no banco.
5. Webhook valida assinatura e confirma eventos vindos do Mercado Pago.

## Webhook Mercado Pago
- Validação: cabeçalhos `x-signature` e `x-request-id` são usados para calcular HMAC com `MERCADOPAGO_WEBHOOK_SECRET`.
- Exemplo de payload:
```json
{
  "id": "123",
  "paymentId": "pay_abc",
  "status": "paid",
  "data": { "id": "pay_abc", "status": "paid", "external_id": "ext_1", "preference_id": "pref_1" }
}
```
- Fluxo: callback → fila `payment-callback` → worker processa → pagamento atualizado no banco.

## Worker (BullMQ)
- Responsável por processar callbacks assíncronos.
- Jobs do Mercado Pago são enviados para a fila e o worker chama o use case para atualizar status.
- Erros podem ser monitorados via logs do WorkerLogger.

## Comandos úteis
```bash
npm run build
npm run start
npm run start:dev
npm run start:worker
npx prisma studio
docker-compose up --build
docker-compose down -v
```

## Testes
- Testes unitários dos use cases e integrações de domínio.
- Testes de integração podem ser adicionados conforme necessidade.

## Como contribuir
1. Fork
2. Branch `feature/nome-da-feature`
3. Pull request

## Licença
MIT
