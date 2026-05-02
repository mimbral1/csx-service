# Testing - CSX Service

## Objetivo

Cubrir los flujos criticos para evitar regresiones en reclamos, transiciones, compensaciones y SLA.

## Stack

```txt
Jest
Supertest
```

## Estructura

```txt
tests/
  e2e/
  utils/
  setup.js
```

## Tests existentes

```txt
claim.e2e.test.js
claim-items.e2e.test.js
claim-transition.e2e.test.js
claim-actions.e2e.test.js
claim-compensation.e2e.test.js
claim-management.e2e.test.js
sla.e2e.test.js
```

## Flujos que deben cubrirse siempre

```txt
crear claim
crear claim duplicado con idempotency-key
agregar items
transicion valida
transicion invalida
asignar responsable
escalar claim
crear gestion
asignar compensacion
detectar SLA vencido
```

## Comandos

```bash
npm test
npm run test:watch
```

## Requisitos antes de correr E2E

```bash
docker compose up -d
cp .env.example .env
npx prisma db push
npm run seed
```

En PowerShell:

```powershell
Copy-Item .env.example .env
```

## Headers de prueba

Los tests usan:

```txt
mimbral-api-key
mimbral-api-secret
x-user-id
x-user-role: CSX_ADMIN
```

