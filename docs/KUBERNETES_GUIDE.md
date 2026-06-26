# KUBERNETES_GUIDE.md — NexoraField AI v7.0

## ESTRUTURA DE NAMESPACES

```
nexorafield          → API, Workers, Gateway, Scheduler
nexorafield-db       → PostgreSQL StatefulSet
nexorafield-cache    → Redis StatefulSet
nexorafield-monitor  → Prometheus, Grafana, Alertmanager
```

## COMANDOS OPERACIONAIS

### Ver status dos pods
```bash
kubectl get pods -n nexorafield -o wide
kubectl get pods -n nexorafield-db
kubectl get pods -n nexorafield-cache
```

### Logs em tempo real
```bash
kubectl logs -f deployment/nexora-api -n nexorafield
kubectl logs -f deployment/nexora-worker-ai -n nexorafield --all-containers
```

### Escalar manualmente
```bash
kubectl scale deployment/nexora-api --replicas=5 -n nexorafield
```

### Rolling update
```bash
kubectl set image deployment/nexora-api \
  api=gcr.io/nexorafield/api:7.1.0 -n nexorafield
kubectl rollout status deployment/nexora-api -n nexorafield
```

### Rollback imediato
```bash
kubectl rollout undo deployment/nexora-api -n nexorafield
kubectl rollout history deployment/nexora-api -n nexorafield
```

### Debug de pod com crash
```bash
kubectl describe pod <pod-name> -n nexorafield
kubectl logs <pod-name> -n nexorafield --previous
kubectl exec -it <pod-name> -n nexorafield -- /bin/sh
```

### Ver HPA em ação
```bash
kubectl get hpa -n nexorafield
kubectl describe hpa nexora-api-hpa -n nexorafield
```

### Verificar recursos
```bash
kubectl top nodes
kubectl top pods -n nexorafield
```

## MANIFESTS CRIADOS

| Arquivo | Conteúdo |
|---|---|
| `infra/k8s/namespace.yaml` | 3 namespaces |
| `infra/k8s/configmap.yaml` | Configurações não-sensíveis |
| `infra/k8s/secret.yaml` | Template de secrets |
| `infra/k8s/deployment-api.yaml` | API + Worker AI deployments |
| `infra/k8s/service.yaml` | ClusterIP + LoadBalancer |
| `infra/k8s/ingress.yaml` | GCE Ingress + FrontendConfig |
| `infra/k8s/hpa.yaml` | Auto-scaling API + Worker |
| `infra/k8s/pdb.yaml` | Pod Disruption Budgets |
| `infra/k8s/network-policy.yaml` | Zero-trust network |

## APLICAR TODOS OS MANIFESTS

```bash
kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/configmap.yaml
kubectl apply -f infra/k8s/secret.yaml
kubectl apply -f infra/k8s/deployment-api.yaml
kubectl apply -f infra/k8s/service.yaml
kubectl apply -f infra/k8s/ingress.yaml
kubectl apply -f infra/k8s/hpa.yaml
kubectl apply -f infra/k8s/pdb.yaml
kubectl apply -f infra/k8s/network-policy.yaml
```

## ESTRATÉGIAS DE DEPLOY

### Blue/Green
```bash
# Deploy green
kubectl apply -f infra/k8s/deployment-api-green.yaml
# Aguardar estabilização
kubectl rollout status deployment/nexora-api-green -n nexorafield
# Comutar tráfego (editar Service selector)
kubectl patch service nexora-api-svc -n nexorafield \
  -p '{"spec":{"selector":{"version":"green"}}}'
# Remover blue após validação
kubectl delete deployment nexora-api-blue -n nexorafield
```

### Canary
```bash
# Manter 80% blue + 20% canary via réplicas proporcionais
kubectl scale deployment/nexora-api --replicas=4 -n nexorafield
kubectl scale deployment/nexora-api-canary --replicas=1 -n nexorafield
```
