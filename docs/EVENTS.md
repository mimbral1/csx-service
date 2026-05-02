# Eventos - CSX Service

## Patron

CSX usa Outbox Pattern.

```txt
Caso de uso
DB transaction
OutboxEvent pending
Job publica a Kafka
OutboxEvent published
```

Nunca se debe publicar Kafka directamente dentro de la transaccion de negocio.

## Eventos principales de claims

```txt
csx.claim.created
csx.claim.updated
csx.claim.type.changed
csx.claim.assigned
csx.claim.escalated
csx.claim.repeated
csx.claim.transitioned
csx.claim.sla.expired
```

## Eventos de items, archivos y gestiones

```txt
csx.claim.item.created
csx.claim.item.updated
csx.claim.file.attached
csx.claim.file.deleted
csx.claim.management.created
csx.claim.management.updated
```

## Eventos de compensacion

```txt
csx.claim.compensation.assigned
```

## Eventos de catalogos

Los CRUD configurables publican:

```txt
{topicPrefix}.created
{topicPrefix}.updated
```

Ejemplos:

```txt
csx.claim-status.created
csx.claim-type.updated
csx.claim-compensation.created
csx.area.updated
```

## Payload recomendado

```json
{
  "id": "claim-id",
  "displayId": "CSX-260502-ABC123",
  "eventName": "claim.created",
  "userCreated": "user-id",
  "dateCreated": "2026-05-02T12:00:00.000Z"
}
```

## Operacion

El job de outbox esta en:

```txt
src/shared/outbox/outbox-publisher.job.js
```

Variables relevantes:

```env
KAFKA_CLIENT_ID=csx-service
KAFKA_BROKERS=localhost:9092
OUTBOX_JOB_INTERVAL_SECONDS=10
```

