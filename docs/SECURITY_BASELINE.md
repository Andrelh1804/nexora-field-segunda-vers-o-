# SECURITY_BASELINE.md — NexoraField AI v7.0

## CAMADAS DE SEGURANÇA

### Layer 1 — Perímetro (Cloud Armor)
- WAF OWASP Top 10 rules habilitadas
- Proteção DDoS automática (GCP volumetric + protocol)
- Rate limiting: 100 req/min por IP
- Geo-blocking configurável por tenant

### Layer 2 — Transporte (TLS)
- TLS 1.3 obrigatório (TLS 1.2 deprecated)
- HSTS: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- Certificados: Let's Encrypt via Google-managed SSL
- Perfect Forward Secrecy habilitado

### Layer 3 — Aplicação
- JWT HS256, expiração 2h, refresh token implementado
- RBAC por perfil: `admin | company | technician | comercial`
- CORS allowlist explícita (sem wildcard em produção)
- CSP: `default-src 'self'; script-src 'self'`
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY

### Layer 4 — Dados
- Secrets no GCP Secret Manager (rotação automática 90 dias)
- PostgreSQL: dados em repouso criptografados (AES-256)
- Redis: TLS 1.3 em trânsito
- Cloud Storage: CMEK (Customer-Managed Encryption Keys)
- Logs: mascaramento automático de CPF, CNPJ, cartão

### Layer 5 — Webhooks
- HMAC-SHA256 em todos os payloads
- `crypto.timingSafeEqual()` para comparação (anti timing-attack)
- TTL de 5 minutos por evento (replay attack prevention)
- Header: `X-NexoraField-Signature: nexora-sig=<hmac>`

### Layer 6 — Auditoria
- Audit log imutável de toda ação (Cloud Logging)
- Retenção: 90 dias hot, 1 ano cold (Cloud Storage)
- Alertas em tempo real para eventos suspeitos
- LGPD compliance: direito ao esquecimento implementado

## ROTAÇÃO DE CREDENCIAIS

| Credencial | Frequência | Método |
|---|---|---|
| GEMINI_API_KEY | 90 dias | Secret Manager automation |
| JWT_SECRET | 180 dias | Rolling (zero downtime) |
| PostgreSQL password | 90 dias | Cloud SQL IAM auth |
| Redis password | 90 dias | Secret Manager automation |
| Service Account keys | 90 dias | Workload Identity (keyless) |
