# SRE_GUIDE.md — NexoraField AI v7.0

## SLIs, SLAs e SLOs

### SLI — Service Level Indicators
| Indicador | Fórmula | Coleta |
|---|---|---|
| Disponibilidade | Req com sucesso / Total req | Prometheus |
| Latência P95 | 95th percentile response time | Prometheus histogram |
| Taxa de erro | Req 5xx / Total req | Cloud Monitoring |
| Throughput | Req/segundo | Prometheus |

### SLO — Service Level Objectives
| Métrica | Target | Janela |
|---|---|---|
| Disponibilidade | ≥ 99.9% | 30 dias rolling |
| Latência P95 | ≤ 500ms | 1 hora |
| Latência P99 | ≤ 2000ms | 1 hora |
| Taxa de erro | ≤ 0.1% | 1 hora |

### SLA — Service Level Agreement
| Tier | Disponibilidade | Suporte | Crédito SLA |
|---|---|---|---|
| Starter | 99.5% | Business hours | 10% bill |
| Pro | 99.9% | 24x7 | 25% bill |
| Enterprise | 99.99% | 24x7 dedicated | 50% bill |

## ERROR BUDGET

```
Error Budget mensal (30 dias, 99.9% SLO):
  Total minutos = 43.200
  Downtime permitido = 43.200 × 0.001 = 43,2 minutos/mês

Error Budget Policy:
  > 50% consumido → Pausar features, focar reliability
  > 75% consumido → Freeze de deploys não-críticos
  > 100% consumido → Feature freeze total + post-mortem
```

## ALERTAS CONFIGURADOS

| Alerta | Threshold | Severidade | Canal |
|---|---|---|---|
| High error rate | >1% por 5 min | P1 | PagerDuty + Slack |
| High latency P95 | >500ms por 10 min | P2 | Slack |
| Pod crash loop | >3 restarts em 5 min | P1 | PagerDuty |
| Disk usage | >80% | P2 | Email |
| Memory pressure | >85% | P2 | Slack |
| SLO burn rate | >2× normal | P1 | PagerDuty |
| Backup failure | qualquer falha | P1 | Email + Slack |
| Cert expiry | <14 dias | P2 | Email |

## ON-CALL RUNBOOK

### Recebeu alerta P1?
1. Acesse Cloud Console → GKE → Workloads
2. Verifique status dos pods: `kubectl get pods -n nexorafield`
3. Verifique logs: `kubectl logs -f deployment/nexora-api -n nexorafield`
4. Verifique /api/health: `curl https://app.nexorafield.com.br/api/health`
5. Se pod em CrashLoopBackOff: `kubectl describe pod <name>` → ver Events
6. Rollback se necessário: `kubectl rollout undo deployment/nexora-api -n nexorafield`
7. Abrir incidente no PagerDuty com timeline
8. Post-mortem em 48h (template em RUNBOOKS.md)

## CAPACIDADE E PLANEJAMENTO

| Métrica | Atual | 3 meses | 6 meses | 12 meses |
|---|---|---|---|---|
| Usuários simultâneos | 50 | 500 | 2.000 | 10.000 |
| Req/segundo | 10 | 100 | 400 | 2.000 |
| Pods API | 2 | 5 | 10 | 20 |
| PostgreSQL (GB) | 10 | 50 | 150 | 500 |
| Redis (GB) | 0.1 | 0.5 | 2 | 8 |
| Custo (USD/mês) | $287 | $890 | $2.100 | $8.500 |
