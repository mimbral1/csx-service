# Errores - CSX Service

## Proposito

Definir el contrato de errores de la API.

Esto evita inconsistencias entre frontend, backend y microservicios.

---

# 1. Formato estandar

Todas las respuestas de error deben seguir:

```json
{
  "message": "Error descriptivo",
  "code": "ERROR_CODE",
  "details": {},
  "requestId": "uuid"
}
```

## Campos

| Campo     | Tipo        | Descripcion          |
| --------- | ----------- | -------------------- |
| message   | string      | Mensaje legible      |
| code      | string      | Codigo de error      |
| details   | object/null | Informacion adicional |
| requestId | string      | ID unico del request |

---

# 2. Codigos de error

## 400 - VALIDATION_ERROR

Body invalido o parametros incorrectos.

Ejemplo:

```json
{
  "message": "Invalid request data",
  "code": "VALIDATION_ERROR",
  "details": {
    "body": {
      "channelId": ["Required"]
    }
  }
}
```

---

## 401 - UNAUTHORIZED

Faltan credenciales o son invalidas.

```json
{
  "message": "API key and API secret are required",
  "code": "UNAUTHORIZED"
}
```

---

## 403 - FORBIDDEN

Usuario no tiene permisos.

```json
{
  "message": "Missing permission: csx:claim:assign",
  "code": "FORBIDDEN"
}
```

---

## 404 - NOT_FOUND

Recurso no existe.

```json
{
  "message": "Claim not found",
  "code": "NOT_FOUND"
}
```

---

## 409 - DUPLICATE_RECORD

Conflicto en datos.

Ejemplo:

```json
{
  "message": "Duplicate record",
  "code": "DUPLICATE_RECORD"
}
```

---

## 409 - IDEMPOTENCY_CONFLICT

Idempotency key usada con payload distinto.

```json
{
  "message": "Idempotency key was already used with a different payload",
  "code": "IDEMPOTENCY_CONFLICT"
}
```

---

## 422 - INVALID_TRANSITION

Cambio de estado no permitido.

```json
{
  "message": "Transition is not allowed from current claim status",
  "code": "INVALID_TRANSITION"
}
```

---

## 409 - INSUFFICIENT_DATA

Falta contexto de negocio.

```json
{
  "message": "type and typeId are required",
  "code": "VALIDATION_ERROR"
}
```

---

## 502 - EXTERNAL_SERVICE_ERROR

Error en integracion externa.

```json
{
  "message": "Integration request failed",
  "code": "EXTERNAL_SERVICE_ERROR",
  "details": {
    "service": "finance",
    "status": 500
  }
}
```

---

## 500 - INTERNAL_SERVER_ERROR

Error inesperado.

```json
{
  "message": "Internal server error",
  "code": "INTERNAL_SERVER_ERROR"
}
```

---

# 3. Reglas de errores

```txt
Siempre devolver JSON
Nunca devolver HTML
Nunca exponer stack trace en produccion
Siempre incluir requestId
Nunca devolver error generico sin code
```

---

# 4. Mapeo Prisma

| Prisma Code | Error            |
| ----------- | ---------------- |
| P2002       | DUPLICATE_RECORD |
| P2025       | NOT_FOUND        |

---

# 5. Idempotencia

Estados posibles:

```txt
processing
completed
failed
```

Errores:

```txt
IDEMPOTENCY_CONFLICT
REQUEST_IN_PROGRESS
```

---

# 6. Buenas practicas

```txt
Errores deben ser predecibles
Frontend nunca debe parsear texto libre
Siempre usar code
```
