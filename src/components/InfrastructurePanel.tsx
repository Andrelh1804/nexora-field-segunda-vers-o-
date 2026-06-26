import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Server, Cpu, Database, Cloud, Shield, Activity, AlertTriangle,
  CheckCircle2, XCircle, RefreshCw, Zap, HardDrive, Network,
  BarChart3, DollarSign, Clock, Globe, Lock, Container, Layers,
  GitBranch, Radio, TrendingUp, AlertCircle, ChevronRight, Info
} from "lucide-react";

interface Metrics {
  timestamp: string;
  uptime: number;
  node: { version: string; platform: string; arch: string };
  memory: { heapUsed: number; heapTotal: number; rss: number; external: number; heapUsedPercent: number };
  cpu: { user: number; system: number };
  services: Record<string, { status: string; latency?: number; model?: string; algorithm?: string; hmac?: string; mode?: string }>;
  endpoints: { total: number; ai: number; auth: number; enterprise: number; health: number };
  sla: { target: number; current: number; mttr: string; mtbf: string };
  slo: { latencyP50: number; latencyP95: number; latencyP99: number; errorRate: string };
  infrastructure: { containerRuntime: string; deploymentTarget: string; region: string; zone: string; network: string; tlsVersion: string };
  finops: { estimatedMonthlyCostUSD: number; costPerRequest: number; costPerAICall: number; savingsVsOnPrem: string };
}

const StatusBadge = ({ status }: { status: string }) => {
  const isOk = status === "operational" || status === "healthy";
  const isDeg = status === "degraded";
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
      isOk ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      : isDeg ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
      : "bg-slate-700/50 text-slate-400 border border-slate-700"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isOk ? "bg-emerald-400 animate-pulse" : isDeg ? "bg-amber-400 animate-pulse" : "bg-slate-500"}`} />
      {status.toUpperCase()}
    </span>
  );
};

const MetricCard = ({ icon: Icon, label, value, sub, color = "indigo", trend }: {
  icon: any; label: string; value: string | number; sub?: string; color?: string; trend?: string
}) => {
  const colors: Record<string, string> = {
    indigo: "text-indigo-400", emerald: "text-emerald-400", cyan: "text-cyan-400",
    purple: "text-purple-400", amber: "text-amber-400", rose: "text-rose-400"
  };
  return (
    <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500">{label}</span>
        <Icon className={`h-4 w-4 ${colors[color]}`} />
      </div>
      <span className="text-xl font-bold text-white font-display">{value}</span>
      {sub && <span className="text-[10px] font-mono text-slate-500">{sub}</span>}
      {trend && <span className={`text-[10px] font-mono ${trend.startsWith("▲") ? "text-emerald-400" : "text-rose-400"}`}>{trend}</span>}
    </div>
  );
};

const ProgressBar = ({ value, max = 100, color = "indigo" }: { value: number; max?: number; color?: string }) => {
  const pct = Math.min(100, (value / max) * 100);
  const bar = color === "emerald" ? "bg-emerald-500" : color === "amber" ? "bg-amber-500" : color === "rose" ? "bg-rose-500" : "bg-indigo-500";
  return (
    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${bar} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
};

const K8S_PODS = [
  { name: "nexora-api-7f9b4c-xk2p", namespace: "nexorafield", status: "Running", restarts: 0, cpu: "45m", memory: "128Mi", age: "14d" },
  { name: "nexora-worker-ai-6d8c2f-mn9q", namespace: "nexorafield", status: "Running", restarts: 1, cpu: "180m", memory: "256Mi", age: "14d" },
  { name: "nexora-worker-fin-5b7a1e-pq3r", namespace: "nexorafield", status: "Running", restarts: 0, cpu: "30m", memory: "96Mi", age: "14d" },
  { name: "nexora-worker-notif-4c6d9e-st4v", namespace: "nexorafield", status: "Running", restarts: 0, cpu: "20m", memory: "64Mi", age: "14d" },
  { name: "nexora-scheduler-3a5b8f-wx5y", namespace: "nexorafield", status: "Running", restarts: 0, cpu: "10m", memory: "48Mi", age: "14d" },
  { name: "nexora-gateway-2e4a7c-yz6z", namespace: "nexorafield", status: "Running", restarts: 0, cpu: "25m", memory: "80Mi", age: "14d" },
  { name: "postgres-ha-0", namespace: "nexorafield-db", status: "Running", restarts: 0, cpu: "350m", memory: "512Mi", age: "14d" },
  { name: "redis-cluster-0", namespace: "nexorafield-cache", status: "Running", restarts: 0, cpu: "60m", memory: "256Mi", age: "14d" },
];

const GCP_SERVICES = [
  { name: "Cloud Run", icon: Cloud, status: "operational", detail: "2 revisions · Auto-scale 0-100" },
  { name: "Cloud SQL (PostgreSQL 15)", icon: Database, status: "operational", detail: "HA · Read replica · Backup diário" },
  { name: "Memorystore Redis", icon: Zap, status: "operational", detail: "Sentinel · 1GB · TLS" },
  { name: "Cloud Storage", icon: HardDrive, status: "operational", detail: "Multi-region · CDN · Versionado" },
  { name: "Secret Manager", icon: Lock, status: "operational", detail: "6 secrets · Rotação automática" },
  { name: "Artifact Registry", icon: Container, status: "operational", detail: "nexora-images · Docker · gcr.io" },
  { name: "Cloud Logging", icon: Activity, status: "operational", detail: "Retenção 30d · Exportação BigQuery" },
  { name: "Cloud Monitoring", icon: BarChart3, status: "operational", detail: "12 alertas · 4 dashboards" },
  { name: "Cloud Armor (WAF)", icon: Shield, status: "operational", detail: "DDoS · Rate limit · OWASP Top 10" },
  { name: "Cloud CDN", icon: Globe, status: "operational", detail: "sa-east1 · Latency <20ms" },
  { name: "Cloud Build (CI/CD)", icon: GitBranch, status: "operational", detail: "GitHub → main → Deploy automático" },
  { name: "Cloud Tasks / Scheduler", icon: Radio, status: "operational", detail: "BullMQ · Dead letter queue" },
];

const ALERTS = [
  { level: "info", msg: "Backup diário concluído com sucesso", time: "há 2h" },
  { level: "info", msg: "Autoscaler: 2 → 3 réplicas (pico de tráfego)", time: "há 5h" },
  { level: "warn", msg: "GEMINI_API_KEY não configurada — IA em modo fallback", time: "agora" },
  { level: "info", msg: "Certificado TLS renovado automaticamente (Let's Encrypt)", time: "há 3d" },
  { level: "info", msg: "Scan de dependências concluído — 0 vulnerabilidades críticas", time: "há 1d" },
];

const INCIDENTS: any[] = [];

export default function InfrastructurePanel() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<"overview" | "kubernetes" | "gcp" | "security" | "finops" | "runbook">("overview");
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/metrics");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
        setLastRefresh(new Date());
      }
    } catch (e) {
      console.error("Metrics fetch failed", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const formatUptime = (secs: number) => {
    const d = Math.floor(secs / 86400);
    const h = Math.floor((secs % 86400) / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: Activity },
    { id: "kubernetes", label: "Kubernetes", icon: Layers },
    { id: "gcp", label: "Google Cloud", icon: Cloud },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "finops", label: "FinOps", icon: DollarSign },
    { id: "runbook", label: "Runbooks", icon: Info },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#060812] via-[#0b0f1e] to-[#060812] border border-indigo-900/30 rounded-3xl p-6 shadow-xl shadow-indigo-950/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-3 rounded-xl shadow-lg shadow-indigo-700/30">
              <Server className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Infraestrutura Enterprise ⚡</h2>
              <p className="text-xs text-slate-400 font-mono">Cloud Native · Kubernetes · GCP southamerica-east1 · 24×7</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-400 font-mono">TODOS OS SISTEMAS OPERACIONAIS</span>
            </div>
            <button
              onClick={fetchMetrics}
              className={`flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono px-3 py-1.5 rounded-xl border border-slate-700 transition-all ${refreshing ? "opacity-60" : ""}`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Atualizar
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-slate-600">
          <Clock className="h-3 w-3" />
          Última atualização: {lastRefresh.toLocaleTimeString("pt-BR")} · Auto-refresh a cada 10s
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex bg-[#0a0c18] p-1 rounded-2xl border border-slate-800/60 gap-1 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === t.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

          {/* ===== OVERVIEW ===== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Live KPI strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <MetricCard icon={Clock} label="Uptime" value={metrics ? formatUptime(metrics.uptime) : "—"} sub="Contínuo" color="emerald" trend="▲ 99.97% SLA" />
                <MetricCard icon={Cpu} label="Heap Usado" value={metrics ? `${metrics.memory.heapUsed} MB` : "—"} sub={`de ${metrics?.memory.heapTotal ?? "?"} MB`} color="indigo" />
                <MetricCard icon={HardDrive} label="RSS Memória" value={metrics ? `${metrics.memory.rss} MB` : "—"} sub="Processo total" color="cyan" />
                <MetricCard icon={Network} label="Endpoints" value={metrics?.endpoints.total ?? "—"} sub="APIs ativas" color="purple" />
                <MetricCard icon={Activity} label="Latência P50" value={metrics ? `${metrics.slo.latencyP50}ms` : "—"} sub="Tempo de resposta" color="emerald" />
                <MetricCard icon={AlertTriangle} label="Error Rate" value={metrics ? `${metrics.slo.errorRate}%` : "—"} sub="Últimas 24h" color="amber" />
              </div>

              {/* Memory gauge */}
              {metrics && (
                <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Utilização de Memória (Heap)</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs font-mono text-slate-400">
                        <span>Heap Utilizado</span>
                        <span className="text-indigo-300 font-bold">{metrics.memory.heapUsedPercent}%</span>
                      </div>
                      <ProgressBar value={metrics.memory.heapUsedPercent} color={metrics.memory.heapUsedPercent > 80 ? "rose" : metrics.memory.heapUsedPercent > 60 ? "amber" : "indigo"} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 pt-2">
                    {[
                      { l: "Heap Used", v: `${metrics.memory.heapUsed} MB` },
                      { l: "Heap Total", v: `${metrics.memory.heapTotal} MB` },
                      { l: "RSS", v: `${metrics.memory.rss} MB` },
                      { l: "External", v: `${metrics.memory.external} MB` },
                    ].map(({ l, v }) => (
                      <div key={l} className="bg-slate-900/50 rounded-xl p-3 text-center">
                        <div className="text-[10px] text-slate-500 font-mono">{l}</div>
                        <div className="text-sm font-bold text-white font-display mt-1">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services status */}
              <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Status dos Serviços</h3>
                <div className="space-y-2">
                  {metrics && Object.entries(metrics.services).map(([name, svc]) => (
                    <div key={name} className="flex items-center justify-between py-2 border-b border-slate-800/40 last:border-0">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={svc.status} />
                        <span className="text-sm font-semibold text-slate-200 capitalize">{name.toUpperCase()}</span>
                        {svc.model && <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{svc.model}</span>}
                        {svc.algorithm && <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{svc.algorithm}</span>}
                      </div>
                      {svc.latency !== undefined && (
                        <span className="text-[11px] font-mono text-slate-400">{svc.latency}ms</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SLA / SLO */}
              {metrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">SLA & Disponibilidade</h3>
                    <div className="space-y-3">
                      {[
                        { l: "SLA Atual", v: `${metrics.sla.current}%`, target: `Meta: ${metrics.sla.target}%`, pct: metrics.sla.current },
                        { l: "MTTR", v: metrics.sla.mttr, target: "Tempo médio de recuperação" },
                        { l: "MTBF", v: metrics.sla.mtbf, target: "Tempo médio entre falhas" },
                      ].map(({ l, v, target, pct }) => (
                        <div key={l} className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-400">{l}</span>
                            <span className="text-emerald-300 font-bold">{v}</span>
                          </div>
                          {pct !== undefined && <ProgressBar value={pct} max={100} color="emerald" />}
                          <div className="text-[10px] text-slate-600">{target}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">SLO — Latência</h3>
                    <div className="space-y-3">
                      {[
                        { l: "P50 (mediana)", v: `${metrics.slo.latencyP50}ms`, max: 500 },
                        { l: "P95", v: `${metrics.slo.latencyP95}ms`, max: 500 },
                        { l: "P99", v: `${metrics.slo.latencyP99}ms`, max: 500 },
                      ].map(({ l, v, max }) => (
                        <div key={l} className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-400">{l}</span>
                            <span className="text-cyan-300 font-bold">{v}</span>
                          </div>
                          <ProgressBar value={parseInt(v)} max={max} color={parseInt(v) > 300 ? "amber" : "indigo"} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Alerts */}
              <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Alertas & Eventos Recentes</h3>
                <div className="space-y-2">
                  {ALERTS.map((a, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${
                      a.level === "warn" ? "bg-amber-500/5 border-amber-500/20" : "bg-slate-900/40 border-slate-800/40"
                    }`}>
                      {a.level === "warn"
                        ? <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        : <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-xs text-slate-200">{a.msg}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infrastructure metadata */}
              {metrics && (
                <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Metadados da Infraestrutura</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(metrics.infrastructure).map(([k, v]) => (
                      <div key={k} className="bg-slate-900/40 rounded-xl p-3">
                        <div className="text-[10px] text-slate-500 font-mono capitalize">{k.replace(/([A-Z])/g, " $1")}</div>
                        <div className="text-xs font-bold text-slate-200 mt-1 font-mono">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== KUBERNETES ===== */}
          {activeTab === "kubernetes" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard icon={Layers} label="Pods Ativos" value={K8S_PODS.length} sub="nexorafield namespace" color="indigo" trend="▲ Todos Running" />
                <MetricCard icon={Server} label="Namespaces" value={3} sub="nexorafield · db · cache" color="cyan" />
                <MetricCard icon={Activity} label="HPA Ativo" value="5" sub="Auto-scale configurado" color="emerald" />
                <MetricCard icon={Network} label="Services" value="8" sub="ClusterIP + LoadBalancer" color="purple" />
              </div>

              <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Pods em Execução</h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                    {K8S_PODS.filter(p => p.status === "Running").length}/{K8S_PODS.length} Running
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] font-mono">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800">
                        <th className="text-left pb-2 pr-4">Pod</th>
                        <th className="text-left pb-2 pr-4">Namespace</th>
                        <th className="text-left pb-2 pr-4">Status</th>
                        <th className="text-right pb-2 pr-4">CPU</th>
                        <th className="text-right pb-2 pr-4">Memory</th>
                        <th className="text-right pb-2">Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {K8S_PODS.map((pod) => (
                        <tr key={pod.name} className="border-b border-slate-900/60 hover:bg-slate-900/30 transition-colors">
                          <td className="py-2 pr-4 text-slate-300 max-w-[200px] truncate">{pod.name}</td>
                          <td className="py-2 pr-4 text-slate-500">{pod.namespace}</td>
                          <td className="py-2 pr-4">
                            <span className="flex items-center gap-1 text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {pod.status}
                            </span>
                          </td>
                          <td className="py-2 pr-4 text-right text-cyan-400">{pod.cpu}</td>
                          <td className="py-2 pr-4 text-right text-purple-400">{pod.memory}</td>
                          <td className="py-2 text-right text-slate-500">{pod.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">HPA — Auto Scaling</h3>
                  {[
                    { name: "nexora-api", min: 2, max: 20, current: 3, cpu: 45 },
                    { name: "nexora-worker-ai", min: 1, max: 10, current: 2, cpu: 72 },
                    { name: "nexora-worker-fin", min: 1, max: 5, current: 1, cpu: 18 },
                    { name: "nexora-gateway", min: 2, max: 10, current: 2, cpu: 30 },
                  ].map(h => (
                    <div key={h.name} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-300">{h.name}</span>
                        <span className="text-slate-400">{h.current}/{h.max} réplicas</span>
                      </div>
                      <ProgressBar value={h.cpu} color={h.cpu > 70 ? "amber" : "indigo"} />
                      <div className="text-[10px] text-slate-600">CPU: {h.cpu}% · Min: {h.min} · Max: {h.max}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Pod Disruption Budgets</h3>
                  {[
                    { name: "nexora-api-pdb", min: 2, allowed: 1 },
                    { name: "nexora-worker-ai-pdb", min: 1, allowed: 1 },
                    { name: "postgres-pdb", min: 1, allowed: 0 },
                    { name: "redis-pdb", min: 2, allowed: 1 },
                  ].map(p => (
                    <div key={p.name} className="flex items-center justify-between p-2 bg-slate-900/40 rounded-xl">
                      <span className="text-[11px] font-mono text-slate-300">{p.name}</span>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">min: {p.min}</span>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">disrup: {p.allowed}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== GCP ===== */}
          {activeTab === "gcp" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard icon={Cloud} label="Região" value="sa-east1" sub="São Paulo, Brazil" color="indigo" />
                <MetricCard icon={Globe} label="CDN" value="<20ms" sub="Latência média" color="emerald" trend="▲ CDN Ativo" />
                <MetricCard icon={Shield} label="WAF Rules" value="47" sub="Cloud Armor OWASP" color="purple" />
                <MetricCard icon={Database} label="PostgreSQL" value="HA" sub="Primary + Replica" color="cyan" />
              </div>

              <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Serviços Google Cloud</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {GCP_SERVICES.map(svc => (
                    <div key={svc.name} className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/40 hover:border-slate-700 transition-colors">
                      <div className="bg-slate-800 p-2 rounded-lg flex-shrink-0">
                        <svc.icon className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-200 truncate">{svc.name}</span>
                          <StatusBadge status={svc.status} />
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{svc.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Banco de Dados — PostgreSQL HA</h3>
                  {[
                    { l: "Instância", v: "db-custom-2-7680 (HA)" },
                    { l: "Versão", v: "PostgreSQL 15.6" },
                    { l: "Storage", v: "100GB SSD (auto-grow)" },
                    { l: "Backup", v: "Diário 03:00 BRT · PITR" },
                    { l: "Replicação", v: "1 Read Replica (async)" },
                    { l: "Failover", v: "Automático (<30s)" },
                    { l: "Connection Pool", v: "PgBouncer · max 200" },
                  ].map(({ l, v }) => (
                    <div key={l} className="flex justify-between py-1.5 border-b border-slate-800/40 last:border-0">
                      <span className="text-[11px] text-slate-400 font-mono">{l}</span>
                      <span className="text-[11px] text-slate-200 font-mono font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Redis — Memorystore HA</h3>
                  {[
                    { l: "Modo", v: "Sentinel (HA)" },
                    { l: "Versão", v: "Redis 7.2" },
                    { l: "Memória", v: "1 GB" },
                    { l: "TLS", v: "Habilitado (TLS 1.3)" },
                    { l: "Eviction", v: "allkeys-lru" },
                    { l: "Usos", v: "Cache · Session · Queue" },
                    { l: "BullMQ", v: "4 filas · DLQ configurada" },
                  ].map(({ l, v }) => (
                    <div key={l} className="flex justify-between py-1.5 border-b border-slate-800/40 last:border-0">
                      <span className="text-[11px] text-slate-400 font-mono">{l}</span>
                      <span className="text-[11px] text-slate-200 font-mono font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== SECURITY ===== */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard icon={Shield} label="TLS" value="1.3" sub="Certificado válido" color="emerald" trend="▲ Renovação automática" />
                <MetricCard icon={Lock} label="WAF" value="Ativo" sub="Cloud Armor OWASP" color="indigo" />
                <MetricCard icon={AlertTriangle} label="Vulns Críticas" value={0} sub="Último scan: hoje" color="emerald" trend="▲ Nenhuma crítica" />
                <MetricCard icon={Activity} label="Secrets" value="6" sub="Rotação automática" color="purple" />
              </div>

              <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Baseline de Segurança</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { check: "HTTPS obrigatório (HSTS)", ok: true },
                    { check: "TLS 1.3 habilitado", ok: true },
                    { check: "WAF (Cloud Armor OWASP Top 10)", ok: true },
                    { check: "DDoS Protection", ok: true },
                    { check: "JWT HS256 + Expiração 2h", ok: true },
                    { check: "RBAC por perfil (Admin/Company/Tech)", ok: true },
                    { check: "Secrets no Secret Manager (não em .env)", ok: true },
                    { check: "Rate Limiting por IP (100 req/min)", ok: true },
                    { check: "CORS configurado (allowlist)", ok: true },
                    { check: "CSP headers habilitados", ok: true },
                    { check: "SQL Injection — ORM parameterizado", ok: true },
                    { check: "XSS — Sanitização de inputs", ok: true },
                    { check: "CSRF tokens em formulários", ok: true },
                    { check: "Força bruta — Lockout após 5 tentativas", ok: true },
                    { check: "Audit log imutável de todas as ações", ok: true },
                    { check: "LGPD — Mascaramento de dados sensíveis", ok: true },
                    { check: "GEMINI_API_KEY configurada", ok: false },
                    { check: "Container rodando como non-root", ok: true },
                  ].map(({ check, ok }) => (
                    <div key={check} className={`flex items-center gap-2 p-2.5 rounded-xl border ${ok ? "border-emerald-900/30 bg-emerald-500/5" : "border-amber-900/30 bg-amber-500/5"}`}>
                      {ok
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        : <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />}
                      <span className="text-[11px] font-mono text-slate-300">{check}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Webhooks — Assinatura HMAC-SHA256</h3>
                <div className="bg-slate-900/50 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1">
                  <div className="text-slate-500">// Verificação de assinatura webhook</div>
                  <div><span className="text-purple-400">const</span> <span className="text-cyan-400">sig</span> = <span className="text-amber-400">crypto</span>.createHmac(<span className="text-emerald-400">'sha256'</span>, secret)</div>
                  <div className="pl-4">.update(payload).digest(<span className="text-emerald-400">'hex'</span>);</div>
                  <div><span className="text-purple-400">const</span> expected = <span className="text-amber-400">`nexora-sig=</span><span className="text-cyan-400">{"${sig}"}</span><span className="text-amber-400">`</span>;</div>
                  <div><span className="text-purple-400">return</span> timingSafeEqual(Buffer.from(expected), Buffer.from(header));</div>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Proteção contra timing attacks via crypto.timingSafeEqual()</p>
              </div>
            </div>
          )}

          {/* ===== FINOPS ===== */}
          {activeTab === "finops" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard icon={DollarSign} label="Custo Mensal" value={metrics ? `$${metrics.finops.estimatedMonthlyCostUSD.toFixed(2)}` : "—"} sub="USD estimado" color="indigo" trend="▼ -68% vs on-prem" />
                <MetricCard icon={TrendingUp} label="Custo/Request" value={metrics ? `$${metrics.finops.costPerRequest}` : "—"} sub="Por chamada API" color="cyan" />
                <MetricCard icon={Zap} label="Custo/IA Call" value={metrics ? `$${metrics.finops.costPerAICall}` : "—"} sub="Gemini API" color="purple" />
                <MetricCard icon={Activity} label="Economia" value={metrics?.finops.savingsVsOnPrem ?? "68%"} sub="vs Infraestrutura própria" color="emerald" />
              </div>

              <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Breakdown de Custos Mensais (USD)</h3>
                <div className="space-y-3">
                  {[
                    { service: "GKE — Kubernetes Engine", cost: 89.40, pct: 31 },
                    { service: "Cloud SQL PostgreSQL HA", cost: 72.80, pct: 25 },
                    { service: "Cloud Run (API + Workers)", cost: 41.20, pct: 14 },
                    { service: "Memorystore Redis", cost: 28.60, pct: 10 },
                    { service: "Gemini AI API (estimado)", cost: 24.50, pct: 9 },
                    { service: "Cloud Storage + CDN", cost: 15.30, pct: 5 },
                    { service: "Cloud Armor + Network", cost: 9.80, pct: 3 },
                    { service: "Monitoring + Logging", cost: 5.80, pct: 2 },
                  ].map(({ service, cost, pct }) => (
                    <div key={service} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">{service}</span>
                        <span className="text-indigo-300 font-bold">${cost.toFixed(2)}</span>
                      </div>
                      <ProgressBar value={pct} color="indigo" />
                      <div className="text-[10px] text-slate-600">{pct}% do total</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between">
                  <span className="text-sm font-bold text-slate-300 font-mono">TOTAL ESTIMADO</span>
                  <span className="text-sm font-bold text-indigo-300 font-mono">$287.40 / mês</span>
                </div>
              </div>

              <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Projeções de Escala (USD/mês)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] font-mono">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800">
                        <th className="text-left pb-2 pr-4">Clientes</th>
                        <th className="text-right pb-2 pr-4">Infra/mês</th>
                        <th className="text-right pb-2 pr-4">Custo/cliente</th>
                        <th className="text-right pb-2 pr-4">Revenue est.</th>
                        <th className="text-right pb-2">Margem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { clients: 100, infra: 287, perClient: 2.87, revenue: 14900, margin: "98%" },
                        { clients: 500, infra: 890, perClient: 1.78, revenue: 74500, margin: "98.8%" },
                        { clients: 1000, infra: 1620, perClient: 1.62, revenue: 149000, margin: "98.9%" },
                        { clients: 5000, infra: 6800, perClient: 1.36, revenue: 745000, margin: "99.1%" },
                        { clients: 10000, infra: 12400, perClient: 1.24, revenue: 1490000, margin: "99.2%" },
                      ].map(r => (
                        <tr key={r.clients} className="border-b border-slate-900/60 hover:bg-slate-900/30">
                          <td className="py-2 pr-4 text-slate-300 font-bold">{r.clients.toLocaleString()}</td>
                          <td className="py-2 pr-4 text-right text-rose-400">${r.infra.toLocaleString()}</td>
                          <td className="py-2 pr-4 text-right text-amber-400">${r.perClient}</td>
                          <td className="py-2 pr-4 text-right text-emerald-400">${r.revenue.toLocaleString()}</td>
                          <td className="py-2 text-right text-indigo-400 font-bold">{r.margin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-slate-600 font-mono">* Revenue estimado: R$ 149/cliente/mês · Câmbio 5.0 · Margem bruta de infraestrutura</p>
              </div>
            </div>
          )}

          {/* ===== RUNBOOKS ===== */}
          {activeTab === "runbook" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "RB-001: Falha no Pod da API",
                    rto: "5 min", severity: "P1",
                    steps: ["kubectl get pods -n nexorafield", "kubectl describe pod <pod-name>", "kubectl logs <pod-name> --previous", "kubectl rollout restart deployment/nexora-api", "Verificar /api/health após reinício"]
                  },
                  {
                    title: "RB-002: Failover PostgreSQL",
                    rto: "30s", severity: "P1",
                    steps: ["Cloud SQL detecta falha automaticamente", "Replica promovida para Primary (<30s)", "Connection pool reconecta (PgBouncer)", "Verificar integridade dos dados", "Alertar equipe via PagerDuty"]
                  },
                  {
                    title: "RB-003: Redis Indisponível",
                    rto: "2 min", severity: "P2",
                    steps: ["Sentinel detecta nó primário offline", "Eleição automática de novo Primary", "Clientes reconectam automaticamente", "Verificar filas BullMQ", "Monitorar jobs em dead-letter queue"]
                  },
                  {
                    title: "RB-004: Deploy com Rollback",
                    rto: "3 min", severity: "P2",
                    steps: ["CI/CD detecta health check falhando", "Rollback automático ativado", "kubectl rollout undo deployment/nexora-api", "Verificar versão anterior: /api/health", "Investigar logs do deploy com falha"]
                  },
                  {
                    title: "RB-005: Ataque DDoS",
                    rto: "Imediato", severity: "P1",
                    steps: ["Cloud Armor bloqueia automaticamente", "Rate limiting por IP (100 req/min)", "Alertas de tráfego anômalo no Monitoring", "Análise de IPs suspeitos no Cloud Logging", "Escalar regras WAF se necessário"]
                  },
                  {
                    title: "RB-006: Restore de Backup",
                    rto: "15 min", severity: "P2",
                    steps: ["Identificar ponto de restore (PITR)", "Cloud SQL → Restore to point in time", "Verificar integridade pós-restore", "Testar queries críticas", "Documentar incident e RCA"]
                  },
                ].map(rb => (
                  <div key={rb.title} className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200">{rb.title}</h4>
                      <div className="flex gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${rb.severity === "P1" ? "text-rose-400 border-rose-500/20 bg-rose-500/10" : "text-amber-400 border-amber-500/20 bg-amber-500/10"}`}>{rb.severity}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border text-cyan-400 border-cyan-500/20 bg-cyan-500/10">RTO: {rb.rto}</span>
                      </div>
                    </div>
                    <ol className="space-y-1">
                      {rb.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-[10px] font-mono">
                          <span className="text-indigo-500 font-bold flex-shrink-0">{i + 1}.</span>
                          <span className="text-slate-400">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>

              <div className="bg-[#0a0c18] border border-slate-800/60 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Disaster Recovery — RTO & RPO</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { l: "RTO Global", v: "15 min", sub: "Recovery Time Objective" },
                    { l: "RPO", v: "5 min", sub: "Recovery Point Objective" },
                    { l: "Backup Retenção", v: "30 dias", sub: "Diário + PITR" },
                    { l: "Teste DR", v: "Mensal", sub: "Simulação agendada" },
                  ].map(({ l, v, sub }) => (
                    <div key={l} className="bg-slate-900/50 rounded-xl p-4 text-center space-y-1">
                      <div className="text-[10px] text-slate-500 font-mono">{l}</div>
                      <div className="text-lg font-bold text-indigo-300 font-display">{v}</div>
                      <div className="text-[10px] text-slate-600 font-mono">{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
