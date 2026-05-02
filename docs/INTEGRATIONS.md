# Integraciones - CSX Service

## Proposito

Documentar como CSX se comunica con otros servicios sin acoplar el dominio a APIs externas.

CSX coordina acciones, pero no ejecuta directamente procesos de otros dominios.

## Modo de operacion

Variable:

```env
INTEGRATIONS_MODE=mock
```

Valores:

```txt
mock -> usa adaptadores internos con respuestas simuladas
http -> usa adaptadores HTTP hacia servicios reales
```

## Servicios integrados

```txt
OMS
Inventory
Packing
Delivery
Finance
Notification
```

## Estructura

```txt
src/integrations/
  http-client.js
  integration-error.js
  index.js
  oms/
  inventory/
  packing/
  delivery/
  finance/
  notification/
```

Cada integracion tiene:

```txt
*.port.js
*.mock.adapter.js
*.http.adapter.js
```

## Variables HTTP

```env
OMS_SERVICE_URL=http://localhost:3010/api
INVENTORY_SERVICE_URL=http://localhost:3011/api
PACKING_SERVICE_URL=http://localhost:3012/api
DELIVERY_SERVICE_URL=http://localhost:3013/api
FINANCE_SERVICE_URL=http://localhost:3014/api
NOTIFICATION_SERVICE_URL=http://localhost:3015/api
INTEGRATION_TIMEOUT_MS=5000
```

Cuando `INTEGRATIONS_MODE=http`, todas las URLs son obligatorias.

## Responsabilidades por servicio

### OMS

```txt
consultar orden
crear orden de reposicion
registrar reclamo asociado a orden
```

### Inventory

```txt
consultar stock
reservar stock
liberar reserva
```

### Packing

```txt
consultar paquete
registrar incidencia de paquete
```

### Delivery

```txt
consultar despacho por orden
registrar reclamo de entrega
solicitar retiro o devolucion
```

### Finance

```txt
consultar documento
solicitar nota de credito
solicitar devolucion
```

### Notification

```txt
notificar cliente
notificar area
notificar responsable
```

## Regla de dominio

CSX no debe:

```txt
descontar stock directamente
emitir nota de credito directamente
crear despacho directamente
modificar estados internos de OMS directamente
```

CSX si debe:

```txt
registrar reclamo
decidir resolucion
guardar historial
publicar evento
solicitar accion a otro servicio
```

## Manejo de errores

Los errores HTTP externos se transforman en:

```txt
EXTERNAL_SERVICE_ERROR
HTTP 502
```

Ver [ERRORS.md](ERRORS.md).

