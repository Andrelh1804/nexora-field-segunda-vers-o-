# RUNBOOKS.md — NexoraField AI v7.0
**Procedimentos operacionais detalhados para resposta a incidentes**

---

## RB-001: Pod da API em CrashLoopBackOff

**Severidade:** P1 | **RTO:** 5 min

```bash
# 1. Identificar pod com problema
kubectl get pods -n nexorafield

# 2. Ver detalhes e eventos
kubectl describe pod <pod-name> -n nexorafield

# 3. Ver logs do crash anterior
kubectl logs <pod-name> -n nexorafield --previous

# 4. Reiniciar deployment
kubectl rollout restart deployment/nexora-api -n nexorafield

# 5. Monitorar rollout
kubectl rollout status deployment/nexora-api -n nexorafield

# 6. Verificar saúde
curl https://app.nexorafield.com.br/api/health

# Se não resolver em 3 min → Rollback
kubectl rollout undo deployment/nexora-api -n nexorafield
```

---

## RB-002: Alta Taxa de Erros 5xx (>1%)

**Severidade:** P1 | **RTO:** 10 min

```bash
# 1. Ver métricas em tempo real
curl https://app.nexorafield.com.br/api/metrics

# 2. Checar logs de erro
kubectl logs deployment/nexora-api -n nexorafield | grep ERROR | tail -50

# 3. Verificar dependências externas
# Gemini API status: https://status.cloud.google.com
# → Se Gemini down, o app tem fallback rule-based automático

# 4. Verificar banco de dados
kubectl exec -it <pod-name> -n nexorafield -- \
  node -e "console.log('DB check')"

# 5. Se rate limiting ativado por Cloud Armor:
gcloud compute security-policies list --project nexorafield-prod

# 6. Escalar horizontalmente se for sobrecarga
kubectl scale deployment/nexora-api --replicas=10 -n nexorafield
```

---

## RB-003: Failover PostgreSQL

**Severidade:** P1 | **RTO:** 30s (automático)

```bash
# Cloud SQL failover é AUTOMÁTICO (<30s)
# Mas caso precise acionar manualmente:

# 1. Verificar status da instância
gcloud sql instances describe nexora-db-prod \
  --project nexorafield-prod

# 2. Forçar failover manual (se necessário)
gcloud sql instances failover nexora-db-prod \
  --project nexorafield-prod

# 3. Verificar conexão pós-failover
# PgBouncer reconecta automaticamente

# 4. Validar integridade dos dados
# Executar queries de contagem em tabelas críticas

# 5. Notificar stakeholders com timeline
```

---

## RB-004: Restore de Backup PostgreSQL (PITR)

**Severidade:** P2 | **RTO:** 15 min

```bash
# 1. Identificar ponto de restore (antes da corrupção)
gcloud sql backups list --instance nexora-db-prod

# 2. Criar instância de restore
gcloud sql instances clone nexora-db-prod \
  nexora-db-restore \
  --point-in-time "2026-06-26T03:00:00Z"

# 3. Validar dados na instância de restore
# Executar queries de validação

# 4. Promover restore para produção (com janela de manutenção)
# Atualizar DATABASE_URL no Secret Manager

# 5. Reiniciar pods para reconectar
kubectl rollout restart deployment/nexora-api -n nexorafield

# 6. Documentar incident e RCA
```

---

## RB-005: Comprometimento de Credenciais

**Severidade:** P1 | **RTO:** Imediato

```bash
# GEMINI_API_KEY comprometida:
# 1. Revogar no Google AI Studio (imediato)
gcloud secrets versions disable <version> \
  --secret GEMINI_API_KEY \
  --project nexorafield-prod

# 2. Gerar nova chave e salvar
gcloud secrets versions add GEMINI_API_KEY \
  --data-file=new-key.txt \
  --project nexorafield-prod

# 3. Rolling restart (sem downtime)
kubectl rollout restart deployment/nexora-api -n nexorafield
kubectl rollout restart deployment/nexora-worker-ai -n nexorafield

# JWT_SECRET comprometido (invalida TODOS os tokens):
# 1. Rotacionar no Secret Manager
# 2. Rolling restart dos pods
# 3. Todos os usuários precisam re-autenticar
# 4. Notificar DPO (LGPD — possível breach)
# 5. Audit log da janela de comprometimento
```

---

## RB-006: Ataque DDoS em Curso

**Severidade:** P1 | **RTO:** Imediato (Cloud Armor automático)

```bash
# 1. Cloud Armor detecta e mitiga automaticamente
# Verificar regras ativas:
gcloud compute security-policies describe cloud-armor-policy-nexora

# 2. Analisar tráfego anômalo
gcloud logging read \
  'resource.type="http_load_balancer" AND httpRequest.status>=400' \
  --limit 100 --project nexorafield-prod

# 3. Banir IP específico se necessário
gcloud compute security-policies rules create 100 \
  --security-policy cloud-armor-policy-nexora \
  --src-ip-ranges "1.2.3.4/32" \
  --action deny-403

# 4. Aumentar rate limiting temporariamente
# Alterar regra de 100 req/min para 10 req/min

# 5. Escalar GKE se tráfego legítimo aumentou
kubectl scale deployment/nexora-api --replicas=20 -n nexorafield
```

---

## RB-007: Simulação de Disaster Recovery (Mensal)

**Agendado:** Primeira segunda-feira do mês, 03:00 BRT

```bash
# Teste 1: Failover do PostgreSQL
gcloud sql instances failover nexora-db-prod
# Verificar reconexão automática em <30s

# Teste 2: Restore de backup para instância temporária
gcloud sql instances clone nexora-db-prod nexora-db-dr-test \
  --point-in-time "$(date -d '2 hours ago' -u +%Y-%m-%dT%H:%M:%SZ)"

# Teste 3: Simular node failure no GKE
kubectl cordon <node-name>
kubectl drain <node-name> --ignore-daemonsets
# Verificar que pods foram rescheduleados
kubectl uncordon <node-name>

# Teste 4: Rollback de deploy
kubectl rollout undo deployment/nexora-api -n nexorafield
# Verificar versão anterior restaurada

# Documentar: RTO real, RPO real, ações necessárias
```
