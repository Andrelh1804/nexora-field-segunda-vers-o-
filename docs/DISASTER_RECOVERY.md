# DISASTER_RECOVERY.md — NexoraField AI v7.0

## RTO e RPO

| Cenário | RTO | RPO |
|---|---|---|
| Pod crash | 30s (K8s self-heal) | 0 (stateless) |
| Node failure | 2 min (reschedule) | 0 (stateless) |
| PostgreSQL primary fail | 30s (Cloud SQL auto-failover) | 5 min (PITR) |
| Redis primary fail | 30s (Sentinel election) | 0 (AOF) |
| Zona GCP down | 5 min (multi-zone GKE) | 5 min |
| Região GCP down | 15 min (DR region) | 1h (backup restore) |
| Ransomware / data corruption | 1h | 24h (daily backup) |

**RTO Global: 15 minutos** | **RPO Global: 5 minutos**

## ESTRATÉGIA DE BACKUP

### PostgreSQL
- **Automático:** Cloud SQL daily backup, 03:00 BRT
- **PITR:** Point-in-Time Recovery, granularidade 1 segundo
- **Retenção:** 30 dias
- **Cross-region:** Backup replicado para southamerica-east1 + us-east1
- **Teste de restore:** Mensal automatizado (Cloud Scheduler)

### Redis
- **AOF (Append-Only File):** Persistência em disco
- **RDB snapshot:** A cada 1 hora
- **Retenção:** 7 dias
- **Restore:** `redis-cli --rdb /backup/dump.rdb`

### Cloud Storage (uploads)
- **Versioning:** Habilitado (60 dias)
- **Cross-region replication:** sa-east1 → us-east1
- **Retenção lifecycle:** 90 dias (hot) → Nearline (1 ano) → Coldline (7 anos)

## RUNBOOKS RESUMIDOS

### DR-001: Falha total de zona GCP
1. GKE redireciona pods para zones saudáveis (automático)
2. Cloud SQL failover para replica (automático, <30s)
3. DNS propagação (Cloud DNS, TTL 60s)
4. Verificar /api/health em todas as zonas
5. Notificar stakeholders via PagerDuty

### DR-002: Corrupção de dados PostgreSQL
1. Identificar janela de corrupção nos logs
2. Cloud SQL → Restore to point in time (antes da corrupção)
3. Executar script de validação de integridade
4. Verificar contadores de registros por tabela
5. Liberar acesso após validação

### DR-003: Comprometimento de credenciais
1. Revogar imediatamente no Secret Manager
2. Gerar novas credenciais
3. Rolling update dos pods (sem downtime)
4. Invalidar todos os JWT ativos
5. Audit log de acessos na janela de comprometimento
6. Notificar DPO (LGPD)
