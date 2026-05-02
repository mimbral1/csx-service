# Documentacion - CSX Service

Esta carpeta contiene la documentacion funcional, tecnica y operativa del servicio CSX.

La idea es que una persona nueva pueda entender el sistema sin leer codigo desde el primer minuto.

## Lectura recomendada

### 1. Vision rapida

- [USE_CASES.md](USE_CASES.md): casos de uso reales del negocio.
- [BUSINESS_FLOWS.md](BUSINESS_FLOWS.md): flujos Mimbral con payloads, tipos, resoluciones y eventos.

### 2. Operacion de API

- [ENDPOINTS.md](ENDPOINTS.md): contrato HTTP de endpoints, headers, permisos y ejemplos.
- [FIELD_REFERENCE.md](FIELD_REFERENCE.md): significado de campos, sufijos, IDs, JSON serializado y valores permitidos.
- [ERRORS.md](ERRORS.md): contrato de errores para frontend y servicios consumidores.
- [ROLES_AND_PERMISSIONS.md](ROLES_AND_PERMISSIONS.md): roles, permisos y restricciones.

### 3. Desarrollo

- [MODULES.md](MODULES.md): responsabilidad de cada modulo y como se conectan entre ellos.
- [DATABASE.md](DATABASE.md): modelos Prisma, seed inicial y reglas de datos.
- [EVENTS.md](EVENTS.md): eventos Kafka y Outbox Pattern.
- [INTEGRATIONS.md](INTEGRATIONS.md): puertos/adaptadores para OMS, Inventory, Packing, Delivery, Finance y Notification.
- [CONVENTIONS.md](CONVENTIONS.md): reglas de codigo, carpetas, commits, API y eventos.
- [TESTING.md](TESTING.md): estrategia y comandos de pruebas.

### 4. Operacion e infraestructura

- [OBSERVABILITY.md](OBSERVABILITY.md): logs, requestId, metricas, alertas y debugging.
- [INFRASTRUCTURE.md](INFRASTRUCTURE.md): SQL Server, Kafka, Docker, deploy y seguridad.

## Mapa mental

```txt
CSX registra reclamos
CSX clasifica el problema
CSX coordina gestiones internas
CSX controla SLA y estados
CSX publica eventos
Otros servicios ejecutan acciones operativas
```

Para entender la arquitectura por dentro, partir por [MODULES.md](MODULES.md).

Para consumir la API desde frontend, usar [ENDPOINTS.md](ENDPOINTS.md), [FIELD_REFERENCE.md](FIELD_REFERENCE.md), [ERRORS.md](ERRORS.md) y [ROLES_AND_PERMISSIONS.md](ROLES_AND_PERMISSIONS.md).

## Responsabilidad del servicio

CSX no modifica stock, no emite documentos tributarios y no crea despachos directamente.

CSX decide, audita, coordina y emite eventos para que OMS, Inventory, Packing, Delivery, Finance y Notification ejecuten.
