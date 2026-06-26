# FINOPS_REPORT.md — NexoraField AI v7.0

## CUSTO MENSAL ESTIMADO (USD)

| Serviço GCP | SKU | Custo/mês |
|---|---|---|
| GKE Autopilot (6 pods médios) | e2-standard-2 × 6 | $89.40 |
| Cloud SQL PostgreSQL 15 HA | db-custom-2-7680 | $72.80 |
| Cloud Run (revisões) | 2M req/mês | $41.20 |
| Memorystore Redis 1GB Sentinel | 1GB HA | $28.60 |
| Gemini AI API | ~5k chamadas/mês | $24.50 |
| Cloud Storage 100GB + CDN | Multi-region | $15.30 |
| Cloud Armor + Network Egress | WAF + LB | $9.80 |
| Cloud Monitoring + Logging | 10GB logs | $5.80 |
| **TOTAL** | | **$287.40** |
| **TOTAL (BRL @R$5,00)** | | **R$ 1.437,00** |

## PROJEÇÕES DE ESCALA

| Clientes | Infra/mês (USD) | Custo/cliente | Revenue (R$) | Margem Infra |
|---|---|---|---|---|
| 100 | $287 | $2.87 | R$ 14.900 | 99.0% |
| 500 | $890 | $1.78 | R$ 74.500 | 99.4% |
| 1.000 | $1.620 | $1.62 | R$ 149.000 | 99.5% |
| 5.000 | $6.800 | $1.36 | R$ 745.000 | 99.5% |
| 10.000 | $12.400 | $1.24 | R$ 1.490.000 | 99.6% |

*Revenue estimado: R$ 149/cliente/mês (plano Starter)*

## OTIMIZAÇÕES ATIVAS

| Otimização | Economia Estimada |
|---|---|
| GKE Autopilot vs GKE Standard | -23% compute |
| Cache Redis (evita calls repetidos à Gemini IA) | -40% custo AI |
| Cloud CDN (reduz egress) | -60% bandwidth |
| Committed Use Discounts (1 ano) | -30% SQL + GKE |
| Preemptible workers (batch jobs) | -60% batch compute |

## CUSTO POR OPERAÇÃO

| Operação | Custo |
|---|---|
| Requisição API (não-IA) | $0.0023 |
| Chamada Gemini classify | $0.0045 |
| Chamada Gemini match | $0.0045 |
| Chamada Gemini summarize | $0.0120 |
| Upload de foto técnico | $0.0001 |
| Webhook disparado | $0.0002 |

## ALERTAS DE BUDGET

| Threshold | Ação |
|---|---|
| 50% do budget | Notificação email FinOps |
| 80% do budget | Alert PagerDuty |
| 100% do budget | Cap automático (Cloud Billing) |
| 150% do budget | Investigação de anomalia obrigatória |
