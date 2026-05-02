# Infraestructura - CSX Service

## Servicios

```txt
API Server      -> Node.js
Database        -> SQL Server
Message Broker  -> Kafka
Storage         -> S3 (futuro)
```

---

# Arquitectura

```txt
Client -> API -> SQL Server
               -> Outbox -> Kafka
```

---

# Local development

Archivo:

```txt
docker-compose.yml
```

Servicios locales:

```txt
SQL Server: localhost:1433
Kafka: localhost:9092
Kafka UI: http://localhost:8080
```

Comando:

```bash
docker compose up -d
```

---

# Deploy recomendado

```txt
Docker
Kubernetes o ECS
CI/CD pipeline
```

Pipeline minimo:

```txt
npm install
npm test
npx prisma validate
npx prisma generate
build image
deploy
```

---

# Backups

```txt
DB: diario
retencion: 7 dias
```

Recomendado:

```txt
backup diario completo
backup incremental si la operacion crece
restore drill mensual
```

---

# Seguridad

```txt
Secrets en env
No exponer DB
API protegida por API key
```

Variables sensibles:

```txt
DATABASE_URL
API_KEY
API_SECRET
KAFKA_BROKERS
*_SERVICE_URL
```

Reglas:

```txt
no commitear .env
rotar API_SECRET si se filtra
separar credenciales por ambiente
limitar acceso directo a SQL Server
```
