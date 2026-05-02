# Modulos - CSX Service

## Proposito

Este documento explica que hace cada modulo del servicio, que datos controla y como se conecta con los demas.

La regla general es:

```txt
HTTP valida entrada
Controller arma el comando
UseCase aplica reglas de negocio
Repository persiste datos
History audita cambios
Outbox deja eventos pendientes
Jobs publican o monitorean asincronicamente
```

---

# 1. Mapa general

```txt
Claim
  -> ClaimItem
  -> ClaimFile
  -> ClaimHistory
  -> ClaimManagementInstance
  -> ClaimCompensationAssignment
  -> ClaimStatus
  -> ClaimType

ClaimStatus
  -> ClaimStatusTransition

ClaimType
  -> ClaimMotive
  -> Area
  -> SLA
  -> ClaimManagement

SLA
  -> ClaimSemaphore
  -> ClaimSlaEvent

OutboxEvent
  -> Kafka
  -> WebhookDelivery

Integrations
  -> OMS
  -> Inventory
  -> Packing
  -> Delivery
  -> Finance
  -> Notification
```

CSX es el coordinador. Registra, clasifica, audita, calcula SLA y publica eventos. Otros servicios ejecutan acciones operativas.

---

# 2. Modulo `claim`

## Que hace

Es el centro del sistema. Representa el reclamo principal.

Controla:

- cliente, orden y tienda asociada.
- canal y motivo del reclamo.
- estado actual.
- prioridad.
- SLA.
- responsable asignado.
- escalamiento y repeticiones.
- tipos asociados en `typeJson`.

## Se conecta con

- `claim-status`: estado actual del reclamo.
- `claim-status-transition`: acciones permitidas para cambiar de estado.
- `claim-type`: clasificacion del problema y SLA base.
- `claim-item`: productos, servicios o items reclamados.
- `claim-file`: evidencias adjuntas.
- `claim-management-instance`: gestiones internas reales.
- `claim-compensation`: compensaciones aplicadas.
- `claim-history`: auditoria.
- `outbox`: eventos de negocio.

## Acciones principales

```txt
crear claim
actualizar datos basicos
asignar responsable
escalar
repetir
cambiar tipo
transicionar estado
```

## Regla clave

Un claim no deberia cambiar de estado directamente. Debe usar una transicion valida.

---

# 3. Modulo `claim-item`

## Que hace

Registra los elementos especificos reclamados dentro de un claim.

Puede representar:

- producto faltante.
- producto danado.
- servicio.
- despacho.
- cobro.
- otro item operativo.

## Campos clave

- `claimId`: reclamo al que pertenece.
- `type`: tipo generico del item.
- `typeId`: ID externo o interno del item, normalmente SKU o identificador operativo.
- `claimTypeId`: tipo de reclamo asociado.
- `claimItemResolutionId`: resolucion esperada.
- `areaInChargeId`: area responsable.

## Se conecta con

- `claim`: contenedor principal.
- `claim-type`: clasificacion del problema.
- `claim-item-resolution`: que se debe hacer con el item.
- `area`: equipo responsable.
- `claim-history` y `outbox`: auditoria y eventos al crear/actualizar.

---

# 4. Modulo `claim-file`

## Que hace

Guarda evidencias del reclamo.

Ejemplos:

- fotos.
- documentos.
- comprobantes.
- capturas.
- archivos enviados por cliente o SAC.

## Se conecta con

- `claim`: cada archivo pertenece a un reclamo.
- `claim-history`: registra adjuntos o eliminaciones.
- `outbox`: puede emitir eventos como `claim.file.attached`.

## Regla clave

CSX no almacena necesariamente el binario. Guarda metadata y URL del archivo.

---

# 5. Modulo `claim-history`

## Que hace

Audita la historia del reclamo.

Debe registrar cambios importantes como:

- creacion.
- cambio de estado.
- asignacion.
- escalamiento.
- item agregado.
- archivo agregado.
- gestion creada.
- compensacion asignada.
- SLA vencido.

## Se conecta con

Casi todos los modulos operativos escriben en `claim-history`.

## Campos clave

- `changeType`: tipo de cambio, por ejemplo `claim.created`.
- `oldValue`: valor anterior cuando aplica.
- `newValue`: valor nuevo cuando aplica.
- `metadataJson`: contexto adicional en JSON serializado.

---

# 6. Modulos de configuracion

Estos modulos son catalogos. Definen opciones que luego usa `claim`.

## `area`

Define equipos responsables.

Ejemplos:

```txt
SAC
Bodega
Despacho
Finanzas
```

Se usa en:

- `claim-type.areaInChargeId`.
- `claim-item.areaInChargeId`.
- `claim-management-instance.assignedAreaId`.

## `claim-channel`

Define el origen del reclamo.

Ejemplos:

```txt
Web
Tienda
Marketplace
SAC
```

Se usa en:

- `claim.channelId`.

## `claim-motive`

Define el motivo macro.

Ejemplos:

```txt
Problema de despacho
Problema de producto
Cobro incorrecto
Devolucion
```

Se usa en:

- `claim.motiveId`.
- `claim-type.claimMotiveId`.
- `claim-status-transition.claimMotiveId` cuando una transicion depende del motivo.

## `claim-process`

Define procesos afectados.

Ejemplos:

```txt
Despacho
Packing
Venta
Finanzas
```

Se referencia normalmente desde `ClaimType.affectedProcessesJson`.

---

# 7. Modulo `claim-type`

## Que hace

Define la clasificacion fina del reclamo.

Ejemplos:

```txt
Producto faltante
Producto danado
Atraso de despacho
Cobro incorrecto
Devolucion
```

## Controla reglas importantes

- motivo al que pertenece.
- area responsable sugerida.
- SLA.
- prioridad.
- procesos afectados.
- compensaciones posibles.
- jerarquia padre/hijo.

## Se conecta con

- `claim`: se guarda como arreglo en `typeJson`.
- `claim-item`: cada item puede tener su propio `claimTypeId`.
- `claim-motive`: motivo padre.
- `area`: area en cargo.
- `sla`: fecha de vencimiento calculada desde `sla` y `slaMeasuredIn`.
- `claim-management`: gestiones sugeridas por tipo.

## Regla clave

Cambiar el tipo de un claim no es una actualizacion simple. Puede recalcular SLA, prioridad y area responsable.

---

# 8. Modulos de estados

## `claim-status`

Define los estados posibles del flujo.

Ejemplos:

```txt
Nuevo
En revision
Esperando bodega
Resuelto
Cerrado
Rechazado
```

Campos clave:

- `isInitial`: estado usado al crear claims.
- `isFinal`: estado que cierra el flujo.
- `isNotifiable`: indica si el estado puede gatillar notificacion.

## `claim-status-transition`

Define movimientos permitidos entre estados.

Ejemplo:

```txt
Nuevo -> En revision
En revision -> Esperando bodega
Resuelto -> Cerrado
```

Campos clave:

- `statusFromId`: estado origen.
- `statusToId`: estado destino.
- `claimMotiveId`: opcional, restringe la transicion a un motivo.
- `requiresPermissions`: indica si la accion requiere control especial.
- `updatesDateSolve`: indica si la transicion resuelve operacionalmente el claim.

## Se conecta con

- `claim.statusId`.
- `claim.transition`.
- `GET /claim/:id/action`.

---

# 9. Modulo `claim-item-resolution`

## Que hace

Define que resolucion operativa tiene un item reclamado.

Ejemplos:

```txt
Reponer producto
Generar nota de credito
Solicitar nuevo picking
Solo registrar incidencia
```

## Campos clave

- `shouldCreateOrder`: puede pedir reposicion a OMS.
- `shouldPickItem`: puede involucrar picking/bodega.
- `shouldInvoicedItem`: puede involucrar facturacion.
- `shouldGenerateCreditNote`: puede pedir nota de credito a Finance.

## Se conecta con

- `claim-item.claimItemResolutionId`.
- `integrations`: segun flags, un caso de uso futuro puede solicitar acciones a OMS, Inventory o Finance.

---

# 10. Modulo `claim-compensation`

## Que hace

Define compensaciones comerciales disponibles.

Ejemplos:

```txt
Descuento
Devolucion dinero
Despacho gratis
Gift card
```

## Catalogo vs operacion

- `claim-compensation`: catalogo de compensaciones.
- `claim-compensation-assignment`: compensacion aplicada a un claim.

## Se conecta con

- `claim`.
- `claim-history`.
- `outbox`.
- `finance` cuando hay devolucion, nota de credito o dinero involucrado.

## Regla clave

Asignar compensaciones monetarias debe estar limitado por permisos.

---

# 11. Modulos de gestiones internas

## `claim-management`

Define tipos de gestion.

Ejemplos:

```txt
Contactar cliente
Revisar con bodega
Solicitar nota de credito
Escalar a jefatura
```

## `claim-management-status`

Define estados posibles para una gestion.

Ejemplos:

```txt
Pendiente
En proceso
Completada
Cancelada
```

## `claim-management-instance`

Registra una gestion real dentro de un claim.

Ejemplo:

```txt
Claim 123 -> Contactar cliente -> Pendiente -> asignado a user-sac-1
```

## Se conecta con

- `claim`.
- `area`.
- `claim-history`.
- `outbox`.

---

# 12. Modulos SLA

## `claim-semaphore`

Define rangos visuales para saber si un claim esta dentro de plazo, cerca de vencer o critico.

Ejemplo:

```txt
Verde: 8 a 9999 horas
Amarillo: 2 a 8 horas
Rojo: 0 a 2 horas
```

## `sla`

No es necesariamente un CRUD. Es logica interna.

Hace:

- calcula `slaDueDate` al crear o reclasificar claim.
- determina semaforo segun horas restantes.
- detecta claims vencidos con un job.
- registra `ClaimSlaEvent`.
- publica eventos `csx.claim.sla.expired`.

## Se conecta con

- `claim.slaDueDate`.
- `claim-type.sla`.
- `claim-type.slaMeasuredIn`.
- `claim-semaphore`.
- `claim-history`.
- `outbox`.

---

# 13. Modulo `outbox`

## Que hace

Guarda eventos de negocio para publicarlos despues.

La API no deberia publicar Kafka directamente dentro del request.

Flujo:

```txt
UseCase guarda cambios en DB
UseCase crea OutboxEvent
Request responde
Job lee eventos pending
Job publica Kafka
Job marca evento como published o failed
```

## Se conecta con

- todos los casos de uso importantes.
- Kafka.
- `webhook-delivery` si se usan webhooks.

---

# 14. Modulo `idempotency`

## Que hace

Evita duplicar operaciones criticas cuando el frontend o un servicio reintenta.

Se usa con header:

```txt
idempotency-key: csx:{operation}:{unique-business-id}
```

## Se conecta con

- `POST /claim`.
- otros `POST` criticos a medida que se habiliten.
- tabla `IdempotencyKey`.

## Estados

```txt
processing
completed
failed
```

---

# 15. Modulo `integrations`

## Que hace

Define puertos/adaptadores para servicios externos.

Servicios previstos:

- OMS.
- Inventory.
- Packing.
- Delivery.
- Finance.
- Notification.

## Modos

```txt
INTEGRATIONS_MODE=mock
INTEGRATIONS_MODE=http
```

## Regla clave

Los casos de uso hablan con `integrations.finance`, `integrations.delivery`, etc. Nunca quedan amarrados al cliente HTTP real.

---

# 16. Como leer una accion completa

Ejemplo: crear claim.

```txt
POST /api/claim
  -> auth.middleware valida API key
  -> permission.middleware valida csx:claim:write
  -> validate.middleware valida schema
  -> claim.controller.create
  -> CreateClaimUseCase
  -> Claim / ClaimHistory / OutboxEvent en transaccion
  -> response { id }
  -> outbox job publica csx.claim.created
```

Ejemplo: transicionar claim.

```txt
POST /api/claim/:id/transition
  -> valida permiso csx:claim:transition
  -> valida transitionId
  -> busca claim
  -> busca ClaimStatusTransition
  -> valida statusFromId contra claim.statusId
  -> actualiza claim.statusId
  -> crea ClaimHistory
  -> crea OutboxEvent
```

---

# 17. Que modulo tocar segun necesidad

```txt
Agregar un endpoint operativo       -> modules/{domain}/http + application
Agregar regla de negocio            -> application/usecase
Cambiar persistencia                -> infrastructure/repository
Agregar campo de DB                 -> prisma/schema.prisma + schemas + docs
Agregar catalogo simple             -> shared/crud + modulo de catalogo
Agregar evento                      -> OutboxEvent + EVENTS.md
Agregar permiso                     -> permissions.js + routes + ROLES_AND_PERMISSIONS.md
Agregar integracion externa         -> integrations/{service}
```

