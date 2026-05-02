# Flujos de Negocio Mimbral - CSX Service

CSX es el lugar donde se ve la historia completa del problema. CSX decide, registra, audita y coordina; otros servicios ejecutan.

Este documento complementa [USE_CASES.md](USE_CASES.md) con payloads, IDs semilla, integraciones y eventos esperados.

## Datos base usados en ejemplos

```txt
channel-web
channel-store
channel-marketplace
channel-sales-rep

motive-despacho
motive-producto
motive-venta
motive-postventa

area-sac
area-bodega
area-despacho
area-finanzas
area-postventa
area-venta-empresa
```

## Producto faltante en entrega

Caso: el cliente compro varios productos, pero recibio menos unidades.

Claim sugerido:

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

Item sugerido:

```json
{
  "type": "item",
  "typeId": "sku-faltante",
  "orderId": "order-123",
  "claimTypeId": "type-producto-faltante",
  "claimItemResolutionId": "resolution-reponer",
  "areaInChargeId": "area-despacho",
  "comment": "Cliente indica que no recibio este producto",
  "quantity": 1,
  "price": 19990
}
```

Flujo:

```txt
Cliente reclama
SAC crea claim
CSX asocia item faltante
CSX asigna Despacho
Se revisa OMS / Packing / Delivery
Si corresponde, se solicita reposicion
CSX transiciona a Resuelto
CSX cierra reclamo
```

Eventos esperados:

```txt
csx.claim.created
csx.claim.item.created
csx.claim.management.created
csx.claim.transitioned
csx.replacement.requested
```

## Producto danado

Caso: el cliente recibe producto quebrado, herramienta danada o falla visible.

Claim type: `type-producto-danado`

Evidencia:

```json
{
  "fileName": "foto-producto-danado.jpg",
  "url": "https://storage.mimbral.cl/foto-producto-danado.jpg",
  "mimeType": "image/jpeg",
  "type": "image",
  "size": 1024
}
```

Resoluciones posibles:

```txt
resolution-reponer
resolution-credito
resolution-devolucion
resolution-garantia-proveedor
```

Flujo: SAC crea claim, adjunta evidencia, bodega/postventa revisa disponibilidad, si hay stock se repone, si no hay stock se solicita nota de credito o devolucion, se notifica al cliente y se cierra.

## Atraso de despacho

Claim type: `type-atraso-despacho`

Flujo: cliente reclama atraso, CSX consulta Delivery, si esta en ruta se informa al cliente, si esta detenido se escala a transporte, si se perdio se genera reposicion o devolucion.

Integracion futura:

```js
await integrations.delivery.getShipmentByOrderId(claim.orderId);
```

## Cobro incorrecto

Claim type: `type-cobro-incorrecto`

Area responsable: `area-finanzas`.

Flujo: cliente reclama cobro, CSX crea claim, Finance consulta documento y pago, si hubo error se solicita nota de credito o devolucion, si no hubo error se informa al cliente.

Integracion futura:

```js
await integrations.finance.getDocumentByOrderId(claim.orderId);
await integrations.finance.requestRefund(payload);
```

## Cambio de producto

Claim type: `type-cambio-producto`

Flujo: cliente solicita cambio, SAC valida politica comercial, Inventory consulta stock del nuevo producto, Finance evalua diferencia de precio, OMS genera nueva orden si corresponde, Delivery coordina retiro/entrega y CSX cierra.

## Devolucion con nota de credito

Claim type: `type-devolucion-nota-credito`

Resolucion principal: `resolution-credito`.

Flujo: cliente solicita devolucion, CSX registra items, SAC aprueba, tienda o TMS recibe producto, bodega valida estado, Finance solicita nota de credito y CSX cierra.

## Venta empresa con problema de despacho

Claim type: `type-venta-empresa-despacho`

Particularidades:

```txt
vendedor asociado
orden de venta
factura de reserva
despacho parcial
cliente empresa
documento tributario
```

Flujo: vendedor o SAC crea claim, CSX consulta OMS y Finance, valida reserva/entrega pendiente, solicita reposicion o nota de credito segun corresponda, informa a vendedor responsable y cierra.

## Reclamo marketplace

Canal: `channel-marketplace`

Claim type: `type-marketplace-no-entregado`

Evento de entrada futuro:

```json
{
  "source": "mercado-libre",
  "externalClaimId": "meli-claim-123",
  "orderId": "oms-order-123",
  "reason": "not_delivered",
  "customerId": "customer-123"
}
```

Flujo: marketplace informa reclamo, integration service envia evento a CSX, CSX cruza orderId con OMS, define tipo/motivo, ejecuta resolucion segun politica del marketplace y coordina OMS/Finance/Delivery.

## Estados principales

```txt
Nuevo
En revision
Esperando informacion del cliente
Esperando bodega
Esperando despacho
Esperando finanzas
Resolucion aprobada
Reposicion solicitada
Nota de credito solicitada
Resuelto
Cerrado
Rechazado
```

## Eventos hacia otros microservicios

```txt
csx.replacement.requested -> OMS
csx.credit_note.requested -> Finance
csx.refund.requested -> Finance
csx.pickup.requested -> Delivery
csx.stock_check.requested -> Inventory
csx.package_claim.created -> Packing
csx.customer_notification.requested -> Notification
```

