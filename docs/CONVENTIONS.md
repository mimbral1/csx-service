# Convenciones - CSX Service

## Proposito

Definir reglas de nombrado, estructura y estilo para que todo el codigo del proyecto sea consistente.

Si alguien agrega codigo nuevo, debe seguir estas reglas sin excepcion.

---

# 1. Convenciones de codigo

## Archivos

```txt
kebab-case
```

Ejemplos:

```txt
claim.controller.js
claim-status-transition.routes.js
create-claim.usecase.js
```

---

## Clases

```txt
PascalCase
```

Ejemplo:

```txt
CreateClaimUseCase
ClaimController
PrismaClaimRepository
```

---

## Funciones

```txt
camelCase
verbo + sustantivo
```

Ejemplos:

```txt
createClaim
updateClaimItem
assignCompensation
calculateSla
```

---

## Variables

```txt
camelCase
```

Ejemplos:

```txt
claimId
userId
slaDueDate
requestId
```

---

## Booleanos

```txt
isX / hasX / canX
```

Ejemplos:

```txt
isFinal
hasComment
canTransition
```

---

## Constantes

```txt
UPPER_SNAKE_CASE
```

Ejemplos:

```txt
MAX_RETRY_COUNT
DEFAULT_PAGE_SIZE
SLA_JOB_INTERVAL_SECONDS
```

---

# 2. Convenciones de base de datos

## Tablas

```txt
snake_case plural con prefijo csx_
```

Ejemplos:

```txt
csx_claims
csx_claim_items
csx_claim_histories
```

---

## Campos

```txt
camelCase en Prisma
```

Ejemplos:

```txt
dateCreated
dateModified
slaDueDate
```

---

## Fechas

```txt
dateCreated / dateModified en Prisma
```

Ejemplos:

```txt
dateCreated
dateModified
```

---

## Booleanos DB

```txt
isX / hasX en Prisma
```

Ejemplos:

```txt
isFinal
hasComment
```

Nota: si una tabla fisica necesita otro nombre, usar `@@map`. Si un campo fisico necesita otro nombre, usar `@map`.

Para una explicacion campo por campo, usar [FIELD_REFERENCE.md](FIELD_REFERENCE.md).

## Sufijos de campos

```txt
Id   -> referencia a otra entidad
Json -> JSON serializado como string
```

Ejemplos:

```txt
claimId
statusId
metadataJson
payloadJson
```

Regla: el frontend envia IDs y estructuras simples. El backend decide que campos se serializan como `Json`.

---

# 3. Convenciones de API

## Rutas

```txt
plural
sustantivos
sin verbos
```

Ejemplos:

```txt
/claim
/claim-items
/claim-compensation
```

Incorrecto:

```txt
/createClaim
/getClaim
/updateClaim
```

---

## Parametros query

```txt
camelCase
```

Ejemplos:

```txt
?sortBy=
?sortDirection=
?claimId=
```

---

## Respuestas

### Exito

```json
{
  "id": "resource-id"
}
```

### Lista

```json
[]
```

### Error

```json
{
  "message": "Error",
  "code": "ERROR_CODE",
  "requestId": "uuid"
}
```

---

# 4. Convenciones de eventos

## Topics Kafka

```txt
dominio.evento
```

Ejemplos:

```txt
csx.claim.created
csx.claim.transitioned
csx.claim.compensation.assigned
```

---

## Payload

```txt
camelCase
JSON plano
sin logica
```

---

# 5. Convenciones de carpetas

```txt
modules/{module}/
```

Cada modulo:

```txt
domain/
application/
infrastructure/
http/
index.js
```

Para entender que responsabilidad tiene cada modulo, usar [MODULES.md](MODULES.md).

---

# 6. Convenciones de commits

```txt
verbo en infinitivo
```

Ejemplos:

```txt
agregar endpoint de claims
corregir calculo de SLA
implementar idempotencia en create claim
```

---

# 7. Convenciones de ramas

```txt
feature/
fix/
release/
hotfix/
```

Ejemplos:

```txt
feature/csx-claim-items
fix/sla-calculation
```

---

# 8. Convenciones internas del proyecto

## Reglas obligatorias

```txt
Controller nunca usa Prisma
Service/UseCase nunca usa req/res
Eventos siempre pasan por outbox
Toda accion importante crea historial
Nunca ejecutar logica de negocio en rutas
```

---

# 9. Convencion clave

```txt
Si un archivo no sigue este patron, esta mal.
```

---

# 10. Regla final

```txt
El codigo debe parecer escrito por una sola persona.
```
