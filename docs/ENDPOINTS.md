# Endpoints - CSX Service

## Base URL local

```txt
http://localhost:3022/api
```

## Headers obligatorios

Todas las rutas bajo `/api` requieren:

```txt
mimbral-api-key: mimbral-csx-api-key
mimbral-api-secret: mimbral-csx-api-secret
mimbral-client: mimbral
x-user-id: user-id
x-user-role: CSX_ADMIN
```

Para operaciones `POST` criticas se recomienda:

```txt
idempotency-key: csx:{operation}:{unique-business-id}
```

## Indice

```txt
1. Claims
2. Claim Items
3. Claim Files
4. Claim History
5. Claim Status
6. Claim Status Transition
7. Claim Type
8. Claim Motive
9. Claim Channel
10. Claim Item Resolution
11. Claim Compensation
12. Claim Management
13. Claim Management Status
14. Claim Management Instance
15. Claim Process
16. Claim Semaphore
17. Area
18. Healthcheck
19. Convencion de respuestas
20. Convencion de errores
```

---

# 1. Claims

## `POST /claim`

Crea un reclamo.

Rol minimo: `CSX_SAC`
Permiso: `csx:claim:write`

Body:

```json
{
  "channelId": "channel-web",
  "motiveId": "motive-despacho",
  "type": ["type-producto-faltante"],
  "orderId": "order-123",
  "storeId": "store-san-javier",
  "customerId": "customer-123",
  "assigneeId": "user-sac-1",
  "priority": "high"
}
```

Respuesta 200:

```json
{
  "id": "claim-id"
}
```

Errores:

| HTTP | Codigo                | Causa               |
| ---- | --------------------- | ------------------- |
| 400  | VALIDATION_ERROR      | Body invalido       |
| 401  | UNAUTHORIZED          | Faltan credenciales |
| 403  | FORBIDDEN             | Rol sin permiso     |
| 500  | INTERNAL_SERVER_ERROR | Error inesperado    |

---

## `GET /claim`

Lista reclamos.

Rol minimo: `CSX_READONLY`
Permiso: `csx:claim:read`

Headers de paginacion:

```txt
x-mimbral-page: 1
x-mimbral-page-size: 60
```

Query opcional:

```txt
sortBy=dateCreated
sortDirection=desc
```

Filtros soportados:

```txt
id
displayId
channelId
motiveId
orderId
customerId
storeId
assigneeId
statusId
priority
escalated
dateCreatedRange
slaDueDateRange
```

Respuesta 200:

```json
[
  {
    "id": "claim-id",
    "displayId": "CSX-260502-ABC123",
    "orderId": "order-123",
    "customerId": "customer-123",
    "priority": "high",
    "statusId": "status-nuevo"
  }
]
```

---

## `GET /claim/:id`

Obtiene un reclamo por ID.

Rol minimo: `CSX_READONLY`
Permiso: `csx:claim:read`

Respuesta 200:

```json
{
  "id": "claim-id",
  "displayId": "CSX-260502-ABC123",
  "channel": {},
  "motive": {},
  "status": {},
  "items": [],
  "files": [],
  "managements": [],
  "compensations": []
}
```

---

## `PUT /claim/:id`

Actualiza campos basicos del reclamo.

Rol minimo: `CSX_SAC`
Permiso: `csx:claim:write`

Body:

```json
{
  "assigneeId": "user-sac-2",
  "priority": "urgent"
}
```

Respuesta 200:

```json
{
  "id": "claim-id"
}
```

Regla:

No usar este endpoint para cambiar tipo de reclamo. Para eso usar:

```txt
POST /claim/:id/change-type
```

---

## `POST /claim/:id/change-type`

Cambia el tipo del reclamo, recalcula SLA y prioridad.

Rol minimo: `CSX_MANAGER`
Permiso: `csx:claim:change-type`

Body:

```json
{
  "typeIds": [
    "type-producto-faltante",
    "type-producto-danado"
  ]
}
```

Respuesta 200:

```json
{
  "id": "claim-id"
}
```

---

## `POST /claim/:id/assign`

Asigna responsable.

Rol minimo: `CSX_MANAGER`
Permiso: `csx:claim:assign`

Body:

```json
{
  "assigneeId": "user-sac-1"
}
```

Respuesta 200:

```json
{
  "id": "claim-id"
}
```

---

## `POST /claim/:id/scale`

Escala el reclamo.

Rol minimo: `CSX_MANAGER`
Permiso: `csx:claim:scale`

Body: vacio.

Respuesta 200:

```json
{
  "id": "claim-id"
}
```

---

## `POST /claim/:id/repeat`

Incrementa las repeticiones del reclamo.

Rol minimo: `CSX_SAC`
Permiso: `csx:claim:write`

Body: vacio.

Respuesta 200:

```json
{
  "id": "claim-id"
}
```

---

## `GET /claim/:id/action`

Lista acciones/transiciones posibles para el estado actual del reclamo.

Rol minimo: `CSX_READONLY`
Permiso: `csx:claim:read`

Respuesta 200:

```json
[
  {
    "kind": "generic",
    "name": "Iniciar revision",
    "componentAttributes": {
      "icon": "arrow-right",
      "endpoint": {
        "service": "csx",
        "namespace": "claim",
        "method": "transition"
      },
      "transition": {
        "id": "t1",
        "from": {
          "id": "status-nuevo",
          "name": "Nuevo"
        },
        "to": {
          "id": "status-revision",
          "name": "En revision"
        }
      }
    }
  }
]
```

---

## `POST /claim/:id/transition`

Ejecuta una transicion de estado.

Rol minimo: `CSX_SAC`
Permiso: `csx:claim:transition`

Body:

```json
{
  "transitionId": "t1"
}
```

Respuesta 200:

```json
{
  "id": "claim-id"
}
```

Errores:

| HTTP | Codigo           | Causa                        |
| ---- | ---------------- | ---------------------------- |
| 400  | VALIDATION_ERROR | Transicion no permitida      |
| 404  | NOT_FOUND        | Claim o transicion no existe |

---

# 2. Claim Items

## `GET /claim/:id/items`

Lista items de un reclamo.

Permiso: `csx:claim-items:read`

Respuesta 200:

```json
[
  {
    "id": "claim-item-id",
    "type": "item",
    "typeId": "sku-123",
    "orderId": "order-123",
    "quantity": 1,
    "price": 19990
  }
]
```

---

## `POST /claim/:id/items`

Agrega items al reclamo.

Permiso: `csx:claim-items:write`

Body unitario:

```json
{
  "type": "item",
  "typeId": "sku-123",
  "orderId": "order-123",
  "claimTypeId": "type-producto-faltante",
  "claimItemResolutionId": "resolution-reponer",
  "areaInChargeId": "area-despacho",
  "comment": "Cliente indica que no llego el producto",
  "quantity": 1,
  "price": 19990
}
```

Body multiple:

```json
{
  "orderId": "order-123",
  "claimTypeId": "type-producto-faltante",
  "claimItemResolutionId": "resolution-reponer",
  "items": [
    {
      "itemId": "sku-1",
      "quantity": 1,
      "price": 10000
    },
    {
      "itemId": "sku-2",
      "quantity": 2,
      "price": 5000
    }
  ]
}
```

Respuesta 200:

```json
{
  "id": [
    "claim-item-id-1",
    "claim-item-id-2"
  ]
}
```

---

## `GET /claim/:id/items/:claimItemId`

Obtiene un item reclamado.

Permiso: `csx:claim-items:read`

---

## `PUT /claim/:id/items/:claimItemId`

Actualiza un item reclamado.

Permiso: `csx:claim-items:write`

Body:

```json
{
  "claimItemResolutionId": "resolution-credito",
  "comment": "Se cambia resolucion a nota de credito"
}
```

Respuesta 200:

```json
{
  "id": "claim-item-id"
}
```

---

# 3. Claim Files

## `GET /claim/:id/file`

Lista archivos del reclamo.

Permiso: `csx:claim-file:read`

---

## `POST /claim/:id/file`

Adjunta evidencia al reclamo.

Permiso: `csx:claim-file:write`

Body:

```json
{
  "fileName": "foto-producto-danado.jpg",
  "url": "https://storage.mimbral.cl/foto-producto-danado.jpg",
  "mimeType": "image/jpeg",
  "type": "image",
  "size": 1024
}
```

Respuesta 200:

```json
{
  "id": "file-id"
}
```

---

## `GET /claim/:id/file/:fileId`

Obtiene archivo.

Permiso: `csx:claim-file:read`

---

## `DELETE /claim/:id/file/:fileId`

Elimina relacion/evidencia del claim.

Permiso: `csx:claim-file:delete`

Respuesta 200:

```json
{
  "id": "file-id"
}
```

---

# 4. Claim History

## `GET /claim-history`

Lista historial.

Permiso: `csx:claim:read`

Filtros:

```txt
claimId
claim
changeType
```

Respuesta 200:

```json
[
  {
    "id": "history-id",
    "claimId": "claim-id",
    "changeType": "claim.created",
    "oldValue": null,
    "newValue": "claim-id",
    "metadataJson": "{}",
    "dateCreated": "2026-05-02T12:00:00.000Z"
  }
]
```

---

# 5. Claim Status

## `GET /claim-status`

Lista estados.

Permiso: `csx:claim-config:read`

## `POST /claim-status`

Crea estado.

Permiso: `csx:claim-config:write`

Body:

```json
{
  "name": "Nuevo",
  "description": "Reclamo recien creado",
  "isInitial": true,
  "isFinal": false,
  "isNotifiable": false,
  "backgroundColor": "#E0E7FF",
  "textColor": "#1E3A8A",
  "status": "active"
}
```

## `GET /claim-status/:id`

Obtiene estado.

## `PUT /claim-status/:id`

Actualiza estado.

---

# 6. Claim Status Transition

## `GET /claim-status-transition`

Lista transiciones.

Permiso: `csx:claim-config:read`

## `POST /claim-status-transition`

Crea transicion.

Permiso: `csx:claim-config:write`

Body:

```json
{
  "name": "Iniciar revision",
  "description": "Pasa de Nuevo a En revision",
  "claimMotiveId": "motive-despacho",
  "statusFromId": "status-nuevo",
  "statusToId": "status-revision",
  "color": "#2563EB",
  "requiresPermissions": false,
  "updatesDateSolve": false,
  "status": "active"
}
```

## `GET /claim-status-transition/:id`

Obtiene transicion.

## `PUT /claim-status-transition/:id`

Actualiza transicion.

---

# 7. Claim Type

## `GET /claim-type`

Lista tipos de reclamo.

Permiso: `csx:claim-config:read`

## `POST /claim-type`

Crea tipo de reclamo.

Permiso: `csx:claim-config:write`

Body:

```json
{
  "name": "Producto faltante",
  "description": "Cliente indica que no recibio uno o mas productos",
  "claimMotiveId": "motive-despacho",
  "parentId": null,
  "areaInChargeId": "area-despacho",
  "sla": 24,
  "slaMeasuredIn": "hours",
  "priority": "high",
  "affectedProcessesJson": "[\"delivery\", \"packing\"]",
  "compensationsJson": "[\"comp-descuento\", \"comp-devolucion\"]",
  "status": "active"
}
```

## `GET /claim-type/:id`

Obtiene tipo.

## `PUT /claim-type/:id`

Actualiza tipo.

---

# 8. Claim Motive

## `GET /claim-motive`

Lista motivos.

## `POST /claim-motive`

Crea motivo.

Body:

```json
{
  "name": "Problema de despacho",
  "description": "Incidencias relacionadas a entrega, transporte o cumplimiento de despacho",
  "status": "active"
}
```

## `GET /claim-motive/:id`

Obtiene motivo.

## `PUT /claim-motive/:id`

Actualiza motivo.

---

# 9. Claim Channel

## `GET /claim-channel`

Lista canales.

## `POST /claim-channel`

Crea canal.

Body:

```json
{
  "name": "Web",
  "description": "Reclamos ingresados desde ecommerce",
  "status": "active"
}
```

## `GET /claim-channel/:id`

Obtiene canal.

## `PUT /claim-channel/:id`

Actualiza canal.

---

# 10. Claim Item Resolution

## `GET /claim-item-resolution`

Lista resoluciones.

## `POST /claim-item-resolution`

Crea resolucion.

Body:

```json
{
  "name": "Reponer producto",
  "description": "Se debe generar reposicion del producto",
  "shouldCreateOrder": true,
  "shouldPickItem": true,
  "shouldInvoicedItem": false,
  "shouldGenerateCreditNote": false,
  "status": "active"
}
```

## `GET /claim-item-resolution/:id`

Obtiene resolucion.

## `PUT /claim-item-resolution/:id`

Actualiza resolucion.

---

# 11. Claim Compensation

## `GET /claim-compensation`

Lista compensaciones.

## `POST /claim-compensation`

Crea compensacion.

Body:

```json
{
  "name": "Descuento",
  "description": "Descuento comercial por incidencia",
  "color": "#F59E0B",
  "hasComment": true,
  "isPublic": true,
  "status": "active"
}
```

## `GET /claim-compensation/:id`

Obtiene compensacion.

## `PUT /claim-compensation/:id`

Actualiza compensacion.

---

## `POST /claim-compensation/claim/:claimId/assign`

Asigna compensacion a un claim.

Permiso: `csx:claim-compensation:assign`

Body:

```json
{
  "compensationId": "comp-descuento",
  "comment": "Descuento por atraso de despacho",
  "amount": 5000,
  "currency": "CLP"
}
```

Respuesta 200:

```json
{
  "id": "claim-compensation-assignment-id"
}
```

---

# 12. Claim Management

## `GET /claim-management`

Lista tipos de gestion.

## `POST /claim-management`

Crea tipo de gestion.

Body:

```json
{
  "name": "Contactar cliente",
  "description": "Llamar o escribir al cliente para pedir informacion",
  "claimTypeId": "type-producto-faltante",
  "status": "active"
}
```

## `GET /claim-management/:id`

Obtiene gestion.

## `PUT /claim-management/:id`

Actualiza gestion.

---

# 13. Claim Management Status

## `GET /claim-management-status`

Lista estados de gestion.

## `POST /claim-management-status`

Crea estado de gestion.

Body:

```json
{
  "name": "Pendiente",
  "description": "Gestion pendiente de ejecucion",
  "claimManagementId": "management-contactar-cliente",
  "status": "active"
}
```

## `GET /claim-management-status/:id`

Obtiene estado.

## `PUT /claim-management-status/:id`

Actualiza estado.

---

# 14. Claim Management Instance

## `GET /claim/:claimId/management`

Lista gestiones reales de un claim.

Permiso: `csx:claim-management:read`

---

## `POST /claim/:claimId/management`

Crea gestion real para un claim.

Permiso: `csx:claim-management:write`

Body:

```json
{
  "claimManagementId": "management-contactar-cliente",
  "claimManagementStatusId": "management-status-pendiente",
  "comment": "Llamar al cliente para confirmar direccion",
  "assignedAreaId": "area-sac",
  "assignedUserId": "user-sac-1"
}
```

Respuesta 200:

```json
{
  "id": "claim-management-instance-id"
}
```

---

## `PUT /management/:claimManagementInstanceId`

Actualiza gestion real.

Permiso: `csx:claim-management:write`

Body:

```json
{
  "claimManagementStatusId": "management-status-completado",
  "comment": "Cliente confirma direccion correcta"
}
```

---

# 15. Claim Process

## `GET /claim-process`

Lista procesos afectados.

## `POST /claim-process`

Crea proceso.

Body:

```json
{
  "name": "Despacho",
  "description": "Proceso de transporte y entrega al cliente",
  "color": "#2563EB",
  "status": "active"
}
```

## `GET /claim-process/:id`

Obtiene proceso.

## `PUT /claim-process/:id`

Actualiza proceso.

---

# 16. Claim Semaphore

## `GET /claim-semaphore`

Lista semaforos.

## `POST /claim-semaphore`

Crea semaforo.

Body:

```json
{
  "name": "Proximo a vencer",
  "rangeLow": 2,
  "rangeHigh": 8,
  "color": "#F59E0B",
  "alerts": true,
  "status": "active"
}
```

## `GET /claim-semaphore/:id`

Obtiene semaforo.

## `PUT /claim-semaphore/:id`

Actualiza semaforo.

---

# 17. Area

## `GET /area`

Lista areas.

## `POST /area`

Crea area.

Body:

```json
{
  "name": "Despacho",
  "status": "active",
  "membersJson": "[\"user-1\", \"user-2\"]"
}
```

## `GET /area/:id`

Obtiene area.

## `PUT /area/:id`

Actualiza area.

---

# 18. Healthcheck

## `GET /health`

No requiere `/api`.

```txt
GET http://localhost:3022/health
```

Respuesta:

```json
{
  "service": "csx-service",
  "status": "ok"
}
```

---

# 19. Convencion de respuestas

## Exito creacion/actualizacion

```json
{
  "id": "resource-id"
}
```

## Listas

```json
[
  {}
]
```

Nota: a futuro se recomienda responder con metadata:

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "pageSize": 60,
    "totalPages": 0
  }
}
```

---

# 20. Convencion de errores

```json
{
  "message": "Validation error",
  "code": "VALIDATION_ERROR",
  "details": {},
  "requestId": "uuid"
}
```
