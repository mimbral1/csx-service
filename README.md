# CSX Service - Mimbral

Microservicio para gestion de reclamos, postventa, compensaciones, SLA, semaforos, gestiones internas y eventos Kafka.

## Stack

- Node.js
- JavaScript
- Express
- SQL Server
- Prisma
- Kafka
- Zod
- Pino
- Clean Architecture
- Outbox Pattern

## Requisitos

- Node.js 20+
- Docker Desktop
- Git
- SQL Server local o Docker
- Kafka local o Docker

## Instalacion

```bash
npm install
```

Crear archivo `.env`:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Levantar infraestructura local

```bash
docker compose up -d
```

Servicios:

```txt
SQL Server: localhost:1433
Kafka: localhost:9092
Kafka UI: http://localhost:8080
```

## Crear base de datos

Entrar a SQL Server y crear:

```sql
CREATE DATABASE csx_service;
```

Tambien puedes hacerlo desde DBeaver, Azure Data Studio o SQL Server Management Studio.

## Generar Prisma Client

```bash
npx prisma generate
```

## Crear tablas

```bash
npx prisma db push
```

## Cargar datos iniciales

```bash
node prisma/seed.js
```

O bien:

```bash
npm run seed
```

## Ejecutar proyecto

```bash
npm run dev
```

Healthcheck:

```http
GET http://localhost:3022/health
```

Respuesta esperada:

```json
{
  "service": "csx-service",
  "status": "ok",
  "environment": "development"
}
```

## Headers obligatorios

Todas las rutas `/api` requieren:

```txt
mimbral-api-key: mimbral-csx-api-key
mimbral-api-secret: mimbral-csx-api-secret
mimbral-client: mimbral
x-user-id: user-id-demo
```

## Crear reclamo

```http
POST http://localhost:3022/api/claim
```

```json
{
  "channelId": "channel-web",
  "motiveId": "motive-despacho",
  "type": ["type-producto-faltante"],
  "orderId": "order-123",
  "storeId": "store-san-javier",
  "customerId": "customer-123",
  "priority": "high"
}
```

Respuesta:

```json
{
  "id": "claim-id"
}
```

## Listar reclamos

```http
GET http://localhost:3022/api/claim
```

## Obtener reclamo

```http
GET http://localhost:3022/api/claim/{claimId}
```

## Agregar items al reclamo

```http
POST http://localhost:3022/api/claim/{claimId}/items
```

```json
{
  "type": "item",
  "typeId": "sku-123",
  "orderId": "order-123",
  "claimTypeId": "type-producto-faltante",
  "claimItemResolutionId": "resolution-reponer",
  "areaInChargeId": "area-despacho",
  "comment": "Cliente indica que no recibio el producto",
  "quantity": 1,
  "price": 19990
}
```

## Ver acciones posibles

```http
GET http://localhost:3022/api/claim/{claimId}/action
```

## Transicionar reclamo

```http
POST http://localhost:3022/api/claim/{claimId}/transition
```

```json
{
  "transitionId": "t1"
}
```

## Escalar reclamo

```http
POST http://localhost:3022/api/claim/{claimId}/scale
```

## Repetir reclamo

```http
POST http://localhost:3022/api/claim/{claimId}/repeat
```

## Asignar responsable

```http
POST http://localhost:3022/api/claim/{claimId}/assign
```

```json
{
  "assigneeId": "user-sac-1"
}
```

## Adjuntar archivo

```http
POST http://localhost:3022/api/claim/{claimId}/file
```

```json
{
  "fileName": "foto-producto-danado.jpg",
  "url": "https://storage.mimbral.cl/foto-producto-danado.jpg",
  "mimeType": "image/jpeg",
  "type": "image",
  "size": 1024
}
```

## Crear gestion interna

```http
POST http://localhost:3022/api/claim/{claimId}/management
```

```json
{
  "claimManagementId": "management-contactar-cliente",
  "claimManagementStatusId": "management-status-pendiente",
  "comment": "Se debe llamar al cliente para confirmar direccion",
  "assignedAreaId": "area-sac",
  "assignedUserId": "user-sac-1"
}
```

## Asignar compensacion

```http
POST http://localhost:3022/api/claim-compensation/claim/{claimId}/assign
```

```json
{
  "compensationId": "comp-descuento",
  "comment": "Descuento por atraso en despacho",
  "amount": 5000,
  "currency": "CLP"
}
```

## Kafka

El servicio publica eventos mediante Outbox Pattern.

Topicos principales:

```txt
csx.claim.created
csx.claim.updated
csx.claim.assigned
csx.claim.escalated
csx.claim.repeated
csx.claim.transitioned
csx.claim.item.created
csx.claim.file.attached
csx.claim.management.created
csx.claim.compensation.assigned
csx.claim.sla.expired
```

## Modo integraciones

Por defecto:

```env
INTEGRATIONS_MODE=mock
```

Cuando existan APIs reales:

```env
INTEGRATIONS_MODE=http
```

Y configurar:

```env
OMS_SERVICE_URL=
INVENTORY_SERVICE_URL=
PACKING_SERVICE_URL=
DELIVERY_SERVICE_URL=
FINANCE_SERVICE_URL=
NOTIFICATION_SERVICE_URL=
```

## Scripts

```bash
npm run dev
npm run start
npm run prisma:generate
npm run prisma:push
npm run seed
npm run setup
```

## Orden para levantar todo

```bash
docker compose up -d
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
```

## Estructura principal

```txt
src/
  modules/
  shared/
  integrations/
  routes/
  config/
  app.js
  server.js
```

## Regla arquitectonica

CSX no modifica stock, no genera notas de credito directo y no despacha.

CSX registra, clasifica, gestiona, audita y emite eventos.

Los otros servicios ejecutan:

```txt
OMS
Inventory
Packing
Delivery
Finance
Notification
```

## Documentacion

La documentacion del servicio esta organizada en:

- [docs/README.md](docs/README.md)

Lecturas principales:

- [docs/USE_CASES.md](docs/USE_CASES.md)
- [docs/BUSINESS_FLOWS.md](docs/BUSINESS_FLOWS.md)
- [docs/ENDPOINTS.md](docs/ENDPOINTS.md)
- [docs/MODULES.md](docs/MODULES.md)
- [docs/FIELD_REFERENCE.md](docs/FIELD_REFERENCE.md)
- [docs/DATABASE.md](docs/DATABASE.md)
- [docs/EVENTS.md](docs/EVENTS.md)
- [docs/INTEGRATIONS.md](docs/INTEGRATIONS.md)
- [docs/ERRORS.md](docs/ERRORS.md)
- [docs/ROLES_AND_PERMISSIONS.md](docs/ROLES_AND_PERMISSIONS.md)
