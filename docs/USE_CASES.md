# Casos de Uso - CSX Service (Mimbral)

## Proposito

Este documento describe los flujos reales del negocio de Mimbral usando CSX.

No es tecnico. No es codigo.  
Es la conexion entre lo que hace el sistema y por que existe.

Si alguien entiende esta seccion, puede operar el sistema sin leer codigo.

---

# 1. Producto faltante en entrega

## Actor

Cliente / SAC / Despacho

## Flujo principal

1. Cliente recibe pedido incompleto
2. Cliente reclama (web, tienda o SAC)
3. SAC crea claim en CSX
4. CSX registra item faltante
5. CSX asigna area: Despacho
6. SAC o Despacho revisa OMS / Packing / Delivery
7. Se valida que el producto no fue entregado
8. CSX define resolucion: reposicion
9. CSX solicita reposicion a OMS
10. OMS genera orden de reposicion
11. WMS ejecuta picking
12. TMS agenda despacho
13. Cliente recibe producto
14. CSX transiciona a Resuelto
15. CSX cierra reclamo

## Flujo alternativo: error del cliente

6a. Se revisa packing y guia  
6b. Se confirma que el producto si fue entregado  
6c. CSX transiciona a Rechazado  
6d. CSX cierra

---

# 2. Producto danado

## Actor

Cliente / SAC / Bodega / Finanzas

## Flujo principal

1. Cliente recibe producto danado
2. Cliente envia evidencia (foto)
3. SAC crea claim
4. CSX registra archivo
5. CSX asigna area: Bodega
6. Bodega revisa dano
7. Se valida que el producto esta defectuoso
8. CSX define resolucion:
   - reposicion o
   - nota de credito
9. Si reposicion:
   - OMS crea orden
   - WMS hace picking
   - TMS despacha
10. Si credito:
   - Finance solicita nota de credito
   - SAP emite documento
11. Cliente es notificado
12. CSX cierra

## Flujo alternativo: dano no valido

6a. Bodega indica que el dano no es atribuible a Mimbral  
6b. CSX transiciona a Rechazado  
6c. CSX cierra

---

# 3. Atraso de despacho

## Actor

Cliente / SAC / Despacho / Delivery

## Flujo principal

1. Cliente reclama atraso
2. SAC crea claim
3. CSX consulta Delivery Service
4. Se obtiene estado de envio
5. Caso A: en transito
   - SAC informa al cliente
   - CSX mantiene estado En revision
6. Caso B: detenido
   - CSX asigna area Despacho
   - se gestiona internamente
7. Caso C: perdido
   - CSX define reposicion o devolucion
8. Cliente recibe solucion
9. CSX cierra

---

# 4. Cobro incorrecto

## Actor

Cliente / SAC / Finanzas

## Flujo principal

1. Cliente reclama cobro
2. SAC crea claim
3. CSX consulta Finance
4. Finance revisa documento en SAP
5. Caso A: error confirmado
   - se solicita nota de credito o devolucion
6. Caso B: sin error
   - se informa al cliente
7. CSX registra gestion
8. CSX cierra

---

# 5. Cambio de producto

## Actor

Cliente / SAC / Bodega / Inventory / OMS

## Flujo principal

1. Cliente solicita cambio
2. SAC crea claim
3. CSX valida politica comercial
4. Inventory verifica stock del producto nuevo
5. Caso A: hay stock
   - OMS crea nueva orden
   - WMS prepara producto
   - TMS coordina entrega
6. Caso B: no hay stock
   - se ofrece nota de credito
7. CSX cierra

---

# 6. Devolucion con nota de credito

## Actor

Cliente / SAC / Bodega / Finanzas

## Flujo principal

1. Cliente solicita devolucion
2. SAC crea claim
3. CSX registra items
4. SAC aprueba devolucion
5. Cliente entrega producto o se retira
6. Bodega valida estado
7. Finance solicita nota de credito
8. SAP emite documento
9. Cliente recibe confirmacion
10. CSX cierra

---

# 7. Venta empresa con problema

## Actor

Cliente empresa / Vendedor / SAC / Finanzas

## Flujo principal

1. Cliente empresa reclama
2. Vendedor o SAC crea claim
3. CSX consulta OMS y Finance
4. Se valida factura de reserva
5. Caso A: faltante
   - reposicion
6. Caso B: error de facturacion
   - nota de credito
7. Se informa a vendedor responsable
8. CSX cierra

---

# 8. Reclamo Marketplace

## Actor

Marketplace / Integracion / CSX

## Flujo principal

1. Marketplace genera reclamo
2. Integration Service envia evento a CSX
3. CSX crea claim automatico
4. CSX cruza orderId con OMS
5. CSX define tipo/motivo
6. CSX aplica politica del marketplace
7. OMS / Finance / Delivery ejecutan
8. CSX actualiza estado
9. CSX cierra

---

# 9. SLA vencido

## Actor

Sistema / SAC / Manager

## Flujo

1. Job SLA detecta vencimiento
2. CSX registra historial
3. CSX emite evento `csx.claim.sla.expired`
4. Notification alerta:
   - responsable
   - supervisor
5. Manager revisa caso
6. Puede escalar o priorizar
7. CSX continua flujo

---

# 10. Regla transversal

Todos los casos cumplen:

```txt
Crear claim
->
Registrar contexto (items, archivos)
->
Asignar area
->
Gestionar internamente
->
Definir resolucion
->
Solicitar accion a otros servicios
->
Cerrar
```

---

# 11. Que NO hace CSX

```txt
No descuenta stock
No genera nota de credito en SAP
No crea despacho
No modifica OMS directamente
```

---

# 12. Que SI hace CSX

```txt
Centraliza reclamos
Define estados
Gestiona SLA
Registra historial
Coordina acciones
Emite eventos
```
