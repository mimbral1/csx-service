# Observabilidad - CSX Service

## Proposito

Permitir detectar, diagnosticar y resolver problemas sin depender de terceros.

---

# 1. Logs

## Herramienta

Pino

## Logger

Archivo:

```txt
src/config/logger.js
```

## Formato

```json
{
  "level": "error",
  "time": "2026-05-02T12:00:00.000Z",
  "service": "csx-service",
  "requestId": "uuid",
  "path": "/api/claim",
  "method": "POST",
  "msg": "Request failed"
}
```

---

# 2. Request ID

Cada request tiene:

```txt
x-request-id
```

Se propaga a:

```txt
logs
errores
eventos Kafka
```

El middleware vive en:

```txt
src/shared/middlewares/request-id.middleware.js
```

---

# 3. Que buscar en errores

```txt
requestId
claimId
eventId
userId
```

Orden recomendado:

```txt
1. requestId en logs
2. claimId en payload o path
3. ClaimHistory
4. OutboxEvent
5. Kafka UI
```

---

# 4. Metricas minimas

```txt
requests por minuto
latencia promedio
errores por endpoint
claims creados por dia
claims vencidos
```

Metricas de negocio recomendadas:

```txt
claims por canal
claims por motivo
claims por area responsable
tiempo promedio hasta cierre
porcentaje de reclamos vencidos
```

---

# 5. Kafka observabilidad

```txt
topics activos
mensajes pendientes
DLQ
reintentos
```

Herramienta local:

```txt
Kafka UI: http://localhost:8080
```

---

# 6. Alertas

```txt
Error rate > 5%
SLA expirados > X
Outbox stuck > 100 eventos
Kafka caido
```

Alertas de negocio recomendadas:

```txt
claim urgent sin responsable
claim en espera de cliente por mas de X dias
claim vencido asignado a area critica
compensaciones monetarias sobre umbral
```

---

# 7. Debug

Para seguir un caso:

```txt
1. buscar requestId
2. ver claimId
3. revisar history
4. revisar outbox
5. revisar Kafka
```

## Consultas utiles

```txt
GET /api/claim/{claimId}
GET /api/claim-history?filters[claimId]={claimId}
GET /api/claim/{claimId}/action
```
