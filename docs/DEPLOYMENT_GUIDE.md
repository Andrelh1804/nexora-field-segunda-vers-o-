# DEPLOYMENT_GUIDE.md — NexoraField AI v7.0

## PRÉ-REQUISITOS

```bash
# Ferramentas necessárias
node >= 20.0.0
npm >= 10.0.0
docker >= 24.0.0
kubectl >= 1.28
gcloud >= 450.0.0
```

## DEPLOY LOCAL (Desenvolvimento)

```bash
# 1. Clone e instale
git clone https://github.com/nexorafield/platform
cd platform
npm install

# 2. Configure secrets
cp .env.example .env
# Edite .env com suas chaves

# 3. Inicie
npm run dev
# Acesse: http://localhost:5000
```

## DEPLOY LOCAL COM DOCKER

```bash
# Build da imagem
docker build -f infra/docker/Dockerfile -t nexorafield/api:local .

# Run completo com docker-compose
cd infra/docker
docker-compose up -d

# Verificar saúde
curl http://localhost:5000/api/health
curl http://localhost:5000/api/metrics
```

## DEPLOY KUBERNETES (GKE)

```bash
# 1. Autenticar no GCP
gcloud auth login
gcloud config set project nexorafield-prod
gcloud container clusters get-credentials nexora-cluster-prod \
  --zone southamerica-east1-a

# 2. Aplicar manifests
kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/configmap.yaml
# Configurar secrets no Secret Manager antes:
kubectl apply -f infra/k8s/secret.yaml
kubectl apply -f infra/k8s/deployment-api.yaml
kubectl apply -f infra/k8s/service.yaml
kubectl apply -f infra/k8s/ingress.yaml
kubectl apply -f infra/k8s/hpa.yaml
kubectl apply -f infra/k8s/pdb.yaml
kubectl apply -f infra/k8s/network-policy.yaml

# 3. Verificar
kubectl get all -n nexorafield
kubectl get ingress -n nexorafield
curl https://app.nexorafield.com.br/api/health
```

## DEPLOY REPLIT (Atual)

```bash
# Build
npm run build

# Start produção
node dist/server.cjs
# Porta: 5000 (configurável via PORT env var)
```

## VARIÁVEIS DE AMBIENTE OBRIGATÓRIAS

| Variável | Descrição | Onde configurar |
|---|---|---|
| `GEMINI_API_KEY` | Chave Google AI Studio | Replit Secrets / Secret Manager |
| `JWT_SECRET` | Chave de assinatura JWT | Replit Secrets / Secret Manager |
| `PORT` | Porta do servidor (default: 5000) | ConfigMap / Replit |

## HEALTH CHECKS

```bash
# Saúde básica
GET /api/health
→ { "status": "healthy", "version": "7.0.0", ... }

# Métricas detalhadas
GET /api/metrics
→ { "memory": {...}, "sla": {...}, "finops": {...}, ... }
```

## VERIFICAÇÃO PÓS-DEPLOY

```bash
# 1. Health check
curl -f https://<URL>/api/health

# 2. Auth test
curl -X POST https://<URL>/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexorafield.com","password":"admin123"}'

# 3. Metrics
curl https://<URL>/api/metrics | jq '.memory'
```
