# Referencia de Campos - CSX Service

## Proposito

Este documento explica los nombres de campos usados por la API, Prisma y eventos.

Sirve para que backend, frontend y QA entiendan lo mismo cuando ven `claimId`, `statusId`, `typeJson`, `dateCreated` o `userModified`.

---

# 1. Regla general de nombres

## API y Prisma

Usan `camelCase`.

Ejemplos:

```txt
claimId
statusId
dateCreated
slaDueDate
userCreated
```

## Tablas fisicas SQL Server

Usan nombres mapeados con prefijo `csx_`.

Ejemplos:

```txt
csx_claims
csx_claim_items
csx_claim_histories
```

El codigo consume Prisma, no nombres fisicos de SQL.

---

# 2. Sufijos importantes

## `Id`

Referencia a otra entidad.

Ejemplos:

```txt
claimId -> Claim.id
channelId -> ClaimChannel.id
motiveId -> ClaimMotive.id
statusId -> ClaimStatus.id
claimTypeId -> ClaimType.id
```

Regla: si un campo termina en `Id`, el frontend debe enviar el ID, no el objeto completo.

---

## `Json`

Campo que guarda JSON serializado como string.

Ejemplos:

```txt
typeJson
metadataJson
membersJson
affectedProcessesJson
compensationsJson
payloadJson
headersJson
responseJson
```

Regla: en DB se guarda como string, pero conceptualmente representa JSON.

Ejemplo:

```json
["type-producto-faltante", "type-producto-danado"]
```

se guarda como:

```txt
"[\"type-producto-faltante\",\"type-producto-danado\"]"
```

---

## `dateCreated` y `dateModified`

Campos de auditoria tecnica.

```txt
dateCreated  -> cuando se creo el registro
dateModified -> cuando se modifico por ultima vez
```

Regla: el frontend normalmente los muestra, pero no deberia enviarlos en creates/updates.

---

## `userCreated` y `userModified`

IDs del usuario que creo o modifico.

Vienen normalmente desde:

```txt
x-user-id
```

Regla: el frontend envia el header `x-user-id`; no envia `userCreated` ni `userModified` en el body.

---

## `status`

Estado administrativo del registro de catalogo.

Valores usados:

```txt
active
inactive
```

Ejemplos:

```txt
ClaimType.status
ClaimChannel.status
Area.status
ClaimCompensation.status
```

No confundir con `Claim.statusId`, que apunta al estado del flujo del reclamo.

---

## `isInitial`, `isFinal`, `isNotifiable`

Booleanos de `ClaimStatus`.

```txt
isInitial    -> estado inicial para crear claims
isFinal      -> estado terminal/cerrado
isNotifiable -> puede gatillar notificacion
```

Regla: debe existir un estado inicial activo para poder crear claims.

---

# 3. Campos principales por entidad

## Claim

| Campo | Tipo | Descripcion | Lo envia frontend |
| --- | --- | --- | --- |
| `id` | string | ID interno UUID | No |
| `displayId` | string | Folio legible del claim | No |
| `channelId` | string | Canal de ingreso | Si |
| `motiveId` | string | Motivo macro | Si |
| `typeJson` | string/null | Tipos asociados serializados | No directo; usar `type` |
| `orderId` | string | Orden asociada | Si |
| `storeId` | string | Tienda asociada | Si |
| `customerId` | string | Cliente asociado | Si |
| `assigneeId` | string/null | Responsable asignado | Opcional |
| `statusId` | string | Estado actual del flujo | No al crear |
| `priority` | string | Prioridad operativa | Opcional |
| `slaDueDate` | Date/null | Vencimiento SLA | No |
| `escalated` | boolean | Indica si fue escalado | No al crear |
| `repetitions` | number | Veces repetido | No |

### Body de creacion

El frontend envia `type` como arreglo:

```json
{
  "type": ["type-producto-faltante"]
}
```

El backend lo guarda en `typeJson`.

---

## ClaimItem

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `claimId` | string | Claim padre |
| `type` | string | Tipo generico del item |
| `typeId` | string | ID del item reclamado, usualmente SKU |
| `orderId` | string/null | Orden del item |
| `claimTypeId` | string | Clasificacion del problema |
| `claimItemResolutionId` | string | Resolucion definida |
| `areaInChargeId` | string/null | Area responsable |
| `quantity` | decimal/null | Cantidad reclamada |
| `price` | decimal/null | Precio referencial |
| `comment` | string/null | Comentario operativo |

---

## ClaimFile

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `claimId` | string | Claim padre |
| `name` | string | Nombre normalizado del archivo |
| `url` | string/null | URL del archivo |
| `fileSource` | string/null | Origen del archivo |
| `mimeType` | string/null | Tipo MIME |
| `type` | string/null | Tipo funcional: image, pdf, document |
| `size` | number/null | Peso en bytes |

Nota: algunos payloads de entrada usan `fileName`; el backend puede transformarlo a `name`.

---

## ClaimHistory

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `claimId` | string | Claim auditado |
| `changeType` | string | Tipo de cambio |
| `oldValue` | string/null | Valor anterior |
| `newValue` | string/null | Valor nuevo |
| `metadataJson` | string/null | Contexto adicional |
| `userCreated` | string/null | Usuario que gatillo el cambio |

Ejemplos de `changeType`:

```txt
claim.created
claim.updated
status
management.created
claimCompensation.assigned
sla.expired
```

---

## ClaimStatus

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `name` | string | Nombre del estado |
| `isInitial` | boolean | Estado inicial |
| `isFinal` | boolean | Estado final |
| `isNotifiable` | boolean | Puede notificar |
| `backgroundColor` | string/null | Color UI |
| `textColor` | string/null | Color texto UI |
| `status` | string | active/inactive |

---

## ClaimStatusTransition

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `name` | string | Nombre de la accion |
| `claimMotiveId` | string/null | Restringe por motivo |
| `statusFromId` | string | Estado origen |
| `statusToId` | string | Estado destino |
| `color` | string/null | Color UI |
| `requiresPermissions` | boolean | Requiere permiso especial |
| `updatesDateSolve` | boolean | Marca resolucion operacional |
| `status` | string | active/inactive |

---

## ClaimType

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `name` | string | Tipo de reclamo |
| `claimMotiveId` | string | Motivo al que pertenece |
| `parentId` | string/null | Tipo padre |
| `areaInChargeId` | string/null | Area responsable sugerida |
| `sla` | number/null | Cantidad de SLA |
| `slaMeasuredIn` | string/null | hours/days/weeks |
| `priority` | string | noPriority/low/medium/high/urgent |
| `affectedProcessesJson` | string/null | Procesos afectados |
| `compensationsJson` | string/null | Compensaciones sugeridas |
| `status` | string | active/inactive |

---

## ClaimItemResolution

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `shouldCreateOrder` | boolean | Puede pedir orden de reposicion |
| `shouldPickItem` | boolean | Puede requerir picking |
| `shouldInvoicedItem` | boolean | Puede requerir facturacion |
| `shouldGenerateCreditNote` | boolean | Puede pedir nota de credito |

---

## ClaimCompensationAssignment

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `claimId` | string | Claim compensado |
| `compensationId` | string | Compensacion aplicada |
| `comment` | string/null | Motivo o detalle |
| `amount` | decimal/null | Monto |
| `currency` | string/null | Moneda, por defecto CLP |

---

## ClaimManagementInstance

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `claimId` | string | Claim asociado |
| `claimManagementId` | string | Tipo de gestion |
| `claimManagementStatusId` | string | Estado de la gestion |
| `comment` | string/null | Comentario |
| `assignedAreaId` | string/null | Area asignada |
| `assignedUserId` | string/null | Usuario asignado |

---

## ClaimSemaphore

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `rangeLow` | decimal | Minimo de horas restantes |
| `rangeHigh` | decimal | Maximo de horas restantes |
| `color` | string | Color UI |
| `alerts` | boolean | Si debe alertar |

---

## OutboxEvent

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `topic` | string | Topic Kafka |
| `eventName` | string | Nombre del evento |
| `aggregateType` | string | Entidad principal |
| `aggregateId` | string | ID de entidad principal |
| `payloadJson` | string | Payload serializado |
| `headersJson` | string/null | Headers/event metadata |
| `status` | string | pending/published/failed |
| `retryCount` | number | Reintentos |
| `publishedAt` | Date/null | Fecha de publicacion |

---

## IdempotencyKey

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `key` | string | Header idempotency-key |
| `scope` | string | Operacion |
| `requestHash` | string | Hash del body |
| `responseJson` | string/null | Respuesta cacheada |
| `status` | string | processing/completed/failed |
| `errorMessage` | string/null | Error si fallo |

---

# 4. Valores de catalogo recomendados

## `priority`

```txt
noPriority
low
medium
high
urgent
```

## `status`

```txt
active
inactive
```

## `slaMeasuredIn`

```txt
hours
days
weeks
```

## `outbox.status`

```txt
pending
published
failed
```

## `idempotency.status`

```txt
processing
completed
failed
```

---

# 5. Reglas para frontend

- Enviar IDs, no objetos completos, en bodies de create/update.
- No enviar campos de auditoria (`dateCreated`, `dateModified`, `userCreated`, `userModified`).
- Enviar `x-user-id` y `x-user-role` como headers.
- Usar `idempotency-key` en operaciones `POST` criticas.
- Usar `/claim/:id/action` para saber que transiciones mostrar como botones.
- Mostrar `displayId` al usuario cuando exista; usar `id` solo para navegacion/API.
- Tratar campos `Json` como estructuras parseables si la API los devuelve como string.

