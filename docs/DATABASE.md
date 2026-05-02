# Base de Datos - CSX Service

## Motor

```txt
SQL Server
Prisma ORM
```

El datasource esta definido en [prisma/schema.prisma](../prisma/schema.prisma).

## Modelos principales

```txt
Claim
ClaimItem
ClaimFile
ClaimHistory
ClaimStatus
ClaimStatusTransition
ClaimType
ClaimManagement
ClaimManagementStatus
ClaimManagementInstance
ClaimCompensation
ClaimCompensationAssignment
ClaimSemaphore
OutboxEvent
IdempotencyKey
```

Para entender la responsabilidad de cada modelo dentro del sistema, ver [MODULES.md](MODULES.md).

Para entender el significado de campos como `typeJson`, `statusId`, `dateCreated` o `userModified`, ver [FIELD_REFERENCE.md](FIELD_REFERENCE.md).

## Reglas importantes

- SQL Server con Prisma 5 no usa enums nativos; los estados, prioridades y tipos se guardan como `String`.
- Los estados de catalogos usan `active` / `inactive`.
- Los eventos Kafka no se publican directamente desde casos de uso; primero se guardan en `OutboxEvent`.
- Acciones importantes deben crear registros en `ClaimHistory`.
- `Claim.typeJson` guarda los IDs de tipos asociados al reclamo principal.
- El frontend envia `type` como arreglo al crear o reclasificar claims; backend lo serializa a `typeJson`.
- Los campos terminados en `Json` guardan JSON como texto para SQL Server.
- Los campos terminados en `Id` son referencias a otros registros; no se envian objetos completos.

## Seed inicial

El seed esta en:

```txt
prisma/seed.js
```

Incluye:

```txt
areas
canales
motivos
estados
transiciones
tipos de reclamo
resoluciones
compensaciones
semaforos
gestiones base
```

## Comandos

```bash
npx prisma generate
npx prisma db push
npm run seed
```

Validar schema:

```bash
npx prisma@5.22.0 validate
```

## Nota de version

El proyecto declara Prisma `5.22.0`. Evitar usar Prisma 7 con Node `20.16.0`, porque Prisma 7 requiere Node `20.19+`.
