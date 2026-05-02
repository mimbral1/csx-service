# Usuarios, Roles y Permisos - CSX Service

## Proposito

Definir claramente que puede y que no puede hacer cada tipo de usuario dentro del sistema de reclamos.

Esta seccion evita errores criticos en produccion donde usuarios ejecutan acciones que no les corresponden, por ejemplo dar devoluciones sin autorizacion.

---

# 1. Modelo de autorizacion

CSX usa:

```txt
Rol -> conjunto de permisos -> habilita acciones
```

Cada request incluye:

```txt
x-user-id
x-user-role
```

El sistema no valida usuarios contra DB en esta version. Se asume que viene validado desde otro servicio.

---

# 2. Permisos disponibles

```txt
csx:claim:read
csx:claim:write
csx:claim:assign
csx:claim:scale
csx:claim:transition
csx:claim:change-type

csx:claim-items:read
csx:claim-items:write

csx:claim-file:read
csx:claim-file:write
csx:claim-file:delete

csx:claim-compensation:read
csx:claim-compensation:write
csx:claim-compensation:assign

csx:claim-management:read
csx:claim-management:write

csx:claim-config:read
csx:claim-config:write

csx:sla:read
csx:sla:manage
```

---

# 3. Roles

---

## ROL: CSX_ADMIN

### Creacion

Asignado manualmente por sistema o infraestructura.

### Alcance

Acceso total al sistema.

### Puede:

- Ejecutar cualquier accion
- Crear, modificar y eliminar configuraciones
- Asignar compensaciones sin restriccion
- Escalar reclamos
- Forzar transiciones
- Modificar SLA

### Restricciones

Ninguna.

---

## ROL: CSX_MANAGER

### Creacion

Asignado por ADMIN.

### Alcance

Supervision de reclamos y toma de decisiones.

### Puede:

- Ver todos los reclamos
- Asignar responsables
- Escalar reclamos
- Ejecutar transiciones
- Asignar compensaciones
- Crear y gestionar acciones internas
- Ver SLA

### Restricciones

- No deberia modificar configuracion del sistema (statuses, transitions, etc.)
- No deberia eliminar datos

---

## ROL: CSX_SAC

### Creacion

Asignado por Manager o Admin.

### Alcance

Gestion diaria de reclamos.

### Puede:

- Crear reclamos
- Ver reclamos
- Agregar items
- Adjuntar archivos
- Ejecutar transiciones basicas
- Crear gestiones internas
- Repetir reclamos

### Restricciones

- No puede escalar reclamos
- No puede asignar compensaciones monetarias
- No puede modificar configuracion

---

## ROL: CSX_STORE

### Creacion

Asignado por Manager.

### Alcance

Reclamos generados en tienda.

### Puede:

- Crear reclamos
- Agregar items
- Adjuntar archivos

### Restricciones

- No puede ver todos los reclamos
- No puede asignar responsables
- No puede transicionar estados complejos
- No puede asignar compensaciones

---

## ROL: CSX_WAREHOUSE

### Creacion

Asignado por Manager.

### Alcance

Revision de productos y stock.

### Puede:

- Ver reclamos
- Ver y modificar items
- Crear gestiones internas

### Restricciones

- No puede cerrar reclamos
- No puede asignar compensaciones
- No puede escalar

---

## ROL: CSX_DELIVERY

### Creacion

Asignado por Manager.

### Alcance

Reclamos relacionados a despacho.

### Puede:

- Ver reclamos
- Crear gestiones internas
- Ejecutar transiciones relacionadas a despacho

### Restricciones

- No puede modificar items
- No puede asignar compensaciones

---

## ROL: CSX_FINANCE

### Creacion

Asignado por Admin.

### Alcance

Procesos financieros.

### Puede:

- Ver reclamos
- Ver compensaciones
- Ejecutar compensaciones (nota de credito, devolucion)

### Restricciones

- No crea reclamos
- No modifica items
- No ejecuta transiciones operativas

---

## ROL: CSX_READONLY

### Creacion

Asignado por sistema.

### Alcance

Consulta.

### Puede:

- Ver reclamos
- Ver items
- Ver historial
- Ver SLA

### Restricciones

- No puede modificar nada

---

# 4. Permisos por endpoint

Ejemplo simplificado:

```txt
POST /claim                -> csx:claim:write
GET /claim                 -> csx:claim:read
POST /claim/:id/assign     -> csx:claim:assign
POST /claim/:id/scale      -> csx:claim:scale
POST /claim/:id/transition -> csx:claim:transition
POST /claim/:id/change-type -> csx:claim:change-type

POST /claim/:id/items      -> csx:claim-items:write
POST /claim/:id/file       -> csx:claim-file:write

POST /claim/:id/management -> csx:claim-management:write

POST /claim-compensation/... -> csx:claim-compensation:assign
```

---

# 5. Reglas criticas

```txt
Solo Manager, Admin o Finance pueden asignar compensaciones monetarias.
SAC puede sugerir, pero no aprobar montos.
Un claim cerrado no deberia permitir acciones nuevas.
Una transicion solo se ejecuta si el usuario tiene permiso Y la transicion es valida.
```

---

# 6. Manejo de error

Si un usuario intenta una accion sin permiso:

```json
{
  "message": "Missing permission: csx:claim:assign",
  "code": "FORBIDDEN",
  "requestId": "uuid"
}
```

HTTP:

```txt
403 Forbidden
```

---

# 7. Principio final

```txt
No todos pueden hacer todo.
Pero todos deben saber que pueden hacer.
```
