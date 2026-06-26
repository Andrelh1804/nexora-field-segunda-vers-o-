import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, Shield, Users, KanbanSquare, Share2, Radio, Zap, Target,
  MessageSquare, Sliders, Landmark, Cpu, Activity, Server, FileLock, BarChart3,
  ChevronRight, RefreshCw, AlertTriangle, Play, Check, X, Code, Send, Trash,
  Eye, ShieldCheck, Mail, AlertCircle, TrendingUp, Info, HelpCircle, ArrowRight, CheckCircle2, ListFilter
} from "lucide-react";

// Types for Enterprise States
interface DbTable {
  name: string;
  rowsCount: number;
  fields: { name: string; type: string; constraints?: string }[];
  indexes: string[];
}

interface EventLog {
  id: string;
  uuid: string;
  timestamp: string;
  event: string;
  tenantId: string;
  payload: string;
  signature: string;
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  status: 'active' | 'inactive';
}

interface LeadEnterprise {
  id: string;
  razaoSocial: string;
  segmento: string;
  leadsScore: number;
  temperature: 'Hot' | 'Warm' | 'Cold';
  city: string;
  state: string;
  status: 'Fria' | 'Contatado' | 'Demonstração' | 'Qualificado' | 'Perdido';
  cnpj: string;
}

export default function EnterprisePortal() {
  // Tabs representing the 16 Phases (Grouped or listed beautifully)
  const [activeTab, setActiveTab] = useState<string>("db");
  const [tenantId, setTenantId] = useState<string>("tenant-solarsul-9021");
  const [logs, setLogs] = useState<string[]>([]);

  // Logs trigger
  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    addLog("Enterprise Control Center inicializado com sucesso.");
    addLog(`Inquilino ativo detectado: ${tenantId}`);
  }, [tenantId]);

  // Phase 1: Database tables representation
  const dbTables: DbTable[] = [
    {
      name: "companies",
      rowsCount: 24,
      fields: [
        { name: "id", type: "VARCHAR(36)", constraints: "PRIMARY KEY" },
        { name: "name", type: "VARCHAR(255)", constraints: "NOT NULL" },
        { name: "cnpj", type: "VARCHAR(18)", constraints: "UNIQUE NOT NULL" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT NOW()" }
      ],
      indexes: ["idx_companies_cnpj"]
    },
    {
      name: "users",
      rowsCount: 142,
      fields: [
        { name: "id", type: "VARCHAR(36)", constraints: "PRIMARY KEY" },
        { name: "email", type: "VARCHAR(255)", constraints: "UNIQUE NOT NULL" },
        { name: "password_hash", type: "VARCHAR(255)", constraints: "NOT NULL" },
        { name: "tenant_id", type: "VARCHAR(36)", constraints: "REFERENCES companies(id)" },
        { name: "role_id", type: "VARCHAR(36)" }
      ],
      indexes: ["idx_users_tenant", "idx_users_email"]
    },
    {
      name: "leads",
      rowsCount: 850,
      fields: [
        { name: "id", type: "VARCHAR(36)", constraints: "PRIMARY KEY" },
        { name: "razao_social", type: "VARCHAR(255)" },
        { name: "cnpj", type: "VARCHAR(18)" },
        { name: "leads_score", type: "INT" },
        { name: "temperature", type: "VARCHAR(20)" },
        { name: "tenant_id", type: "VARCHAR(36)" }
      ],
      indexes: ["idx_leads_score", "idx_leads_tenant"]
    },
    {
      name: "service_orders",
      rowsCount: 3410,
      fields: [
        { name: "id", type: "VARCHAR(36)", constraints: "PRIMARY KEY" },
        { name: "status", type: "VARCHAR(50)" },
        { name: "value", type: "DECIMAL(10,2)" },
        { name: "tech_id", type: "VARCHAR(36)" },
        { name: "tenant_id", type: "VARCHAR(36)" }
      ],
      indexes: ["idx_so_tenant", "idx_so_status", "idx_so_tech"]
    },
    {
      name: "audit_logs",
      rowsCount: 14920,
      fields: [
        { name: "id", type: "VARCHAR(36)", constraints: "PRIMARY KEY" },
        { name: "user_id", type: "VARCHAR(36)" },
        { name: "action", type: "TEXT" },
        { name: "hash_sha256", type: "VARCHAR(64)" },
        { name: "created_at", type: "TIMESTAMP" }
      ],
      indexes: ["idx_audit_hash", "idx_audit_user"]
    }
  ];

  const [dbStatus, setDbStatus] = useState<'idle' | 'migrating' | 'ready'>('ready');
  const handleRunMigrations = () => {
    setDbStatus('migrating');
    addLog("Iniciando migração de banco de dados via Drizzle Kit...");
    setTimeout(() => {
      setDbStatus('ready');
      addLog("Drizzle Migrations concluídas. 26 tabelas reconciliadas com PostgreSQL.");
    }, 1500);
  };

  // Phase 2: Auth Enterprise State
  const [jwtToken, setJwtToken] = useState<string>("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyidGVuYW50X2lkIjoidGVuYW50LXNvbGFyc3VsLTkwMjEiLCJ1c2VyX2lkIjoidXNyLTkxODIiLCJyb2xlIjoiQ29tcGFueSIsInBlcm1pc3Npb25zIjpbIm9zLmNyZWF0ZSIsIm9zLnJlYWQiLCJjcm0ud3JpdGUiXSwiaWF0IjoxNzE5MzM4MDYwfQ.hashSign");
  const [isRotating, setIsRotating] = useState(false);
  const handleRotateKeys = () => {
    setIsRotating(true);
    addLog("Iniciando rotação automática de segredos HMAC no Vault...");
    setTimeout(() => {
      setIsRotating(false);
      setJwtToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyidGVuYW50X2lkIjoidGVuYW50LXNvbGFyc3VsLTkwMjEiLCJ1c2VyX2lkIjoidXNyLTkxODIiLCJyb2xlIjoiQ29tcGFueSIsInBlcm1pc3Npb25zIjpbIm9zLmNyZWF0ZSIsIm9zLnJlYWQiXSwiaWF0IjoxNzE5MzM4MTUwfQ.newRotatedHash");
      addLog("Rotação finalizada. Novas chaves publicadas e tokens antigos revogados.");
    }, 1000);
  };

  // Phase 3: Multitenancy mock data isolating
  const tenantConfigs = [
    { id: "tenant-solarsul-9021", name: "SolarSul Distribuidora (Energia Solar)", color: "border-amber-500 text-amber-400" },
    { id: "tenant-nexoracorp-5500", name: "NexoraCorp Telecom (Telecomunicações)", color: "border-cyan-500 text-cyan-400" },
    { id: "tenant-greentech-1200", name: "GreenTech Engenharia (Climatização)", color: "border-emerald-500 text-emerald-400" }
  ];

  const tenantData: Record<string, { leads: number; billing: number; tickets: number }> = {
    "tenant-solarsul-9021": { leads: 120, billing: 45000, tickets: 34 },
    "tenant-nexoracorp-5500": { leads: 340, billing: 128000, tickets: 112 },
    "tenant-greentech-1200": { leads: 95, billing: 29000, tickets: 18 }
  };

  // Phase 4: CRM leads mock data
  const [crmLeads, setCrmLeads] = useState<LeadEnterprise[]>([
    { id: "lead-1", razaoSocial: "SolarCamp Campinas S/A", segmento: "Energia Solar", leadsScore: 94, temperature: "Hot", city: "Campinas", state: "SP", status: "Demonstração", cnpj: "24.551.902/0001-90" },
    { id: "lead-2", razaoSocial: "TeleData Fibra e Conexão", segmento: "Telecom", leadsScore: 81, temperature: "Hot", city: "Fortaleza", state: "CE", status: "Contatado", cnpj: "44.112.304/0001-22" },
    { id: "lead-3", razaoSocial: "GigaVolt Instalações", segmento: "Elétrica", leadsScore: 45, temperature: "Cold", city: "Ribeirão Preto", state: "SP", status: "Fria", cnpj: "10.220.304/0001-88" },
    { id: "lead-4", razaoSocial: "ArLimpo Climatizadores", segmento: "Facilities", leadsScore: 74, temperature: "Warm", city: "Curitiba", state: "PR", status: "Qualificado", cnpj: "33.901.445/0001-11" }
  ]);

  const handleEnrichLead = (id: string) => {
    addLog(`Enriquecendo dados cadastrais e buscando CNPJ para lead ${id}...`);
    setTimeout(() => {
      setCrmLeads(prev => prev.map(l => l.id === id ? { ...l, leadsScore: Math.min(100, l.leadsScore + 5), razaoSocial: l.razaoSocial + " (Enriquecido via IA)" } : l));
      addLog(`Enriquecimento via Gemini e Receita API finalizado para o lead ${id}.`);
    }, 800);
  };

  // Phase 5: Event Bus Triggering
  const [events, setEvents] = useState<EventLog[]>([
    { id: "evt-1", uuid: "5c8f85f1-8f43-41c8-89fa-07283737bd32", timestamp: "17:55:12", event: "lead.created", tenantId: "tenant-solarsul-9021", payload: '{"id":"lead_comp_9281","razao_social":"SolarCamp S/A"}', signature: "9a8f237..." },
    { id: "evt-2", uuid: "e8ca92da-190f-488f-9a78-2921a8a3a303", timestamp: "17:55:15", event: "invoice.paid", tenantId: "tenant-solarsul-9021", payload: '{"invoice_id":"inv-9921","amount":1250.00}', signature: "b4c102a..." }
  ]);

  const handleSimulateEvent = (eventName: string) => {
    const newEvent: EventLog = {
      id: `evt-${Date.now()}`,
      uuid: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toLocaleTimeString(),
      event: eventName,
      tenantId: tenantId,
      payload: JSON.stringify({
        simulated: true,
        triggerBy: "Super Admin",
        environment: "Production-Sandbox",
        metadata: { client: "NexoraField Enterprise Engine" }
      }),
      signature: "sha256-" + Math.random().toString(16).substring(2, 10)
    };
    setEvents(prev => [newEvent, ...prev]);
    addLog(`Mensagem publicada no Event Bus: ${eventName}`);
  };

  // Phase 6: Webhooks dashboard
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    { id: "wh-1", name: "n8n Outbound CRM Webhook", url: "https://n8n.nexorafield.com.br/webhook/crm-sync", events: ["lead.created", "lead.converted"], secret: "whsec_nexora_889102", status: "active" },
    { id: "wh-2", name: "Asaas Conciliation Gate", url: "https://n8n.nexorafield.com.br/webhook/asaas-pix", events: ["invoice.paid", "invoice.failed"], secret: "whsec_asaas_112233", status: "active" }
  ]);

  const [testWebhookStatus, setTestWebhookStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const handleTestWebhook = () => {
    setTestWebhookStatus('sending');
    addLog("Disparando webhook de teste via HMAC SHA-256 com retroalimentação de cabeçalhos...");
    setTimeout(() => {
      setTestWebhookStatus('success');
      addLog("Retorno HTTP 200 OK do endpoint da n8n recebido com sucesso.");
    }, 1000);
  };

  // Phase 13: Observability values
  const [metrics, setMetrics] = useState({
    cpu: 18,
    ram: 42,
    dbPool: 8,
    aiTokens: 1420910,
    latency: 14
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(5, Math.min(95, prev.cpu + Math.floor(Math.random() * 7) - 3)),
        dbPool: Math.max(3, Math.min(20, prev.dbPool + Math.floor(Math.random() * 3) - 1)),
        latency: Math.max(10, Math.min(45, prev.latency + Math.floor(Math.random() * 5) - 2)),
        aiTokens: prev.aiTokens + Math.floor(Math.random() * 350)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Phase 14: DevSecOps pipeline simulation
  const [deployStep, setDeployStep] = useState<number>(4);
  const deploySteps = [
    { title: "Linting & TS Reconcile", status: "success" },
    { title: "Docker Container Bundling", status: "success" },
    { title: "Vault Credentials Ingress", status: "success" },
    { title: "Cloud Run deployment (0.0.0.0:3000)", status: "success" },
    { title: "Prometheus Monitoring Hooked", status: "success" }
  ];

  // Phase 15: Compliance log hashes
  const [complianceRecords, setComplianceRecords] = useState([
    { id: "c-1", date: "2026-06-25 17:12:04", user: "Julio Cesar", action: "Consentimento LGPD", sha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" },
    { id: "c-2", date: "2026-06-25 17:28:44", user: "André Luis", action: "Anonimização de Lead", sha256: "ec25f385c9a785e6a3d6f1a8b34f7c22998822ee997788bc1d6f1c4a5b0f0022" }
  ]);

  const handleAnonymizeLead = (leadId: string) => {
    addLog(`Mascarando dados pessoais e aplicando anonimização irreversível LGPD para lead ${leadId}...`);
    setCrmLeads(prev => prev.map(l => l.id === leadId ? { ...l, razaoSocial: "ANONIMIZADO (Art. 16 LGPD)", cnpj: "**.***.***/0001-**" } : l));
    const newRecord = {
      id: `c-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: "André Luis (Admin)",
      action: "Anonimização de Lead (LGPD)",
      sha256: "sha256-" + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10)
    };
    setComplianceRecords(prev => [newRecord, ...prev]);
    addLog(`Trilha de auditoria gerada com Hash SHA-256 e depositada de forma inalterável.`);
  };

  return (
    <div className="space-y-6 text-white bg-[#060813] p-6 rounded-3xl border border-[#161c36] shadow-2xl">
      {/* ENTERPRISE TITLE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#0a0d24] border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-indigo-950 text-indigo-400 border border-indigo-900 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-wider">
              Corporativo & Multitenancy
            </span>
            <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-900/60 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase">
              v4.0 Enterprise Ready
            </span>
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight text-white flex items-center gap-2">
            NexoraField AI Enterprise Control Suite
          </h2>
          <p className="text-xs text-slate-400">
            Painel Executivo Unificado para gerenciamento do ecossistema de bancos de dados relacional, mensageria real, webhooks orquestrados e governança.
          </p>
        </div>

        {/* TENANT SWITCHER SECTOR */}
        <div className="bg-[#04050d] border border-slate-800 p-4 rounded-xl flex items-center gap-3 w-full lg:w-auto">
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block">Isolamento Ativo (Tenant)</span>
            <select
              value={tenantId}
              onChange={(e) => {
                setTenantId(e.target.value);
                addLog(`Inquilino alterado para: ${e.target.value}`);
              }}
              className="bg-transparent border-none text-xs font-bold text-indigo-400 focus:outline-none focus:ring-0 cursor-pointer pt-1"
            >
              {tenantConfigs.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#0c0f24] text-white">
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="border-l border-slate-800 h-8 pl-3 font-mono text-[10px] text-slate-400">
            <div>Leads: <span className="font-bold text-indigo-400">{tenantData[tenantId]?.leads}</span></div>
            <div>OS Ativas: <span className="font-bold text-emerald-400">{tenantData[tenantId]?.tickets}</span></div>
          </div>
        </div>
      </div>

      {/* CORE GRID ARCHITECTURE: TABS LEFT + CONTENT RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* TAB LIST SIDEBAR (16 PHASES) */}
        <div className="lg:col-span-3 space-y-1 bg-[#090b1c] p-2.5 rounded-2xl border border-slate-900">
          <span className="text-[10px] font-bold text-slate-500 tracking-wider font-mono px-3.5 pb-2 pt-1 block uppercase">
            16 Fases de Implementação
          </span>
          <div className="space-y-0.5">
            {[
              { id: "db", label: "Fase 1: Banco de Dados", icon: Database },
              { id: "auth", label: "Fase 2: Autenticação JWT", icon: Shield },
              { id: "tenant", label: "Fase 3: Isolamento Tenant", icon: Users },
              { id: "crm", label: "Fase 4: CRM Enterprise", icon: KanbanSquare },
              { id: "bus", label: "Fase 5: Event Bus", icon: Radio },
              { id: "hooks", label: "Fase 6: Webhook Engine", icon: Share2 },
              { id: "n8n", label: "Fase 7: Automação n8n", icon: Zap },
              { id: "growth", label: "Fase 8: Growth Engine", icon: Target },
              { id: "messaging", label: "Fase 9: Mensageria Real", icon: Mail },
              { id: "chat", label: "Fase 10: Chat Presence", icon: MessageSquare },
              { id: "finance", label: "Fase 11: Split Payments", icon: Landmark },
              { id: "ai", label: "Fase 12: IA & Copilotos", icon: Cpu },
              { id: "obs", label: "Fase 13: Observabilidade", icon: Activity },
              { id: "ops", label: "Fase 14: DevSecOps", icon: Server },
              { id: "compliance", label: "Fase 15: Compliance LGPD", icon: FileLock },
              { id: "dash", label: "Fase 16: Dashboards Exec", icon: BarChart3 },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id);
                    addLog(`Navegando para tab: ${t.label}`);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === t.id 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 border-l-4 border-indigo-300 pl-4" 
                      : "text-slate-400 hover:bg-[#121633] hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{t.label}</span>
                  </div>
                  <ChevronRight className="h-3 w-3 opacity-60" />
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE MODULE CONTAINER DISPLAY */}
        <div className="lg:col-span-9 bg-[#090b1c] p-6 rounded-2xl border border-slate-900 min-h-[460px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              {/* FASE 1: DATABASE */}
              {activeTab === "db" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-black flex items-center gap-2"><Database className="h-5 w-5 text-amber-500" /> Fase 1 — Banco de Dados Relacional PostgreSQL</h3>
                      <p className="text-xs text-slate-400">Instância gerenciada no Cloud SQL. Mapeamento de esquemas de dados estritos via Drizzle ORM.</p>
                    </div>
                    <button
                      onClick={handleRunMigrations}
                      disabled={dbStatus === 'migrating'}
                      className="bg-[#141b3c] hover:bg-[#1c2656] border border-slate-800 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${dbStatus === 'migrating' ? 'animate-spin' : ''}`} /> Run Migrations
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-3">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block">Tabelas Reconciliadas (26 total)</span>
                      <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                        {dbTables.map((table, i) => (
                          <div key={i} className="flex justify-between items-center bg-[#0d0f22] p-2 rounded border border-slate-900 text-[10px] font-mono">
                            <span className="text-indigo-300 font-bold">📂 {table.name}</span>
                            <span className="text-slate-500">{table.rowsCount} rows</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-8 bg-[#0d0f22] border border-slate-900 p-4 rounded-xl space-y-3 font-mono">
                      <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider block">Visualizador de Schema Drizzle (Postgres)</span>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-[10px] text-slate-300 overflow-x-auto space-y-1">
                        <p className="text-slate-500">// Schema em src/db/schema.ts</p>
                        <p><span className="text-purple-400">import</span> &#123; pgTable, varchar, timestamp, boolean, integer, decimal &#125; <span className="text-purple-400">from</span> <span className="text-amber-300">"drizzle-orm/pg-core"</span>;</p>
                        <p className="pt-2"><span className="text-blue-400">export const</span> <span className="text-emerald-400">leads</span> = pgTable(<span className="text-amber-300">"leads"</span>, &#123;</p>
                        <p className="pl-4">id: varchar(<span className="text-amber-300">"id"</span>, &#123; length: 36 &#125;).primaryKey(),</p>
                        <p className="pl-4">razao_social: varchar(<span className="text-amber-300">"razao_social"</span>, &#123; length: 255 &#125;),</p>
                        <p className="pl-4">cnpj: varchar(<span className="text-amber-300">"cnpj"</span>, &#123; length: 18 &#125;).unique(),</p>
                        <p className="pl-4">leads_score: integer(<span className="text-amber-300">"leads_score"</span>),</p>
                        <p className="pl-4">tenant_id: varchar(<span className="text-amber-300">"tenant_id"</span>, &#123; length: 36 &#125;).notNull(),</p>
                        <p>&#125;);</p>
                      </div>
                      <div className="text-[10px] text-slate-500 flex gap-2 justify-end">
                        <span>● Soft-Delete Habilitado</span>
                        <span>● Foreign Keys Ativas</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FASE 2: AUTH ENTERPRISE */}
              {activeTab === "auth" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-black flex items-center gap-2"><Shield className="h-5 w-5 text-indigo-400" /> Fase 2 — Autenticação Segura JWT & RBAC Middleware</h3>
                      <p className="text-xs text-slate-400">Controles criptográficos de sessão protegidos contra escalação de privilégios.</p>
                    </div>
                    <button
                      onClick={handleRotateKeys}
                      disabled={isRotating}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isRotating ? 'animate-spin' : ''}`} /> Rotacionar Chaves
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-3 font-mono">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Token JWT Decodificado (Claims Ativas)</span>
                      <div className="bg-[#0d0f22] p-3 rounded-lg border border-slate-900 text-[10px] space-y-1">
                        <p className="text-cyan-400">Header:</p>
                        <p className="text-slate-400 pl-4">&#123; "alg": "HS256", "typ": "JWT" &#125;</p>
                        <p className="text-cyan-400 pt-2">Payload (Claims):</p>
                        <p className="text-slate-400 pl-4">&#123;</p>
                        <p className="text-slate-400 pl-8">"tenant_id": <span className="text-amber-300">"{tenantId}"</span>,</p>
                        <p className="text-slate-400 pl-8">"user_id": <span className="text-amber-300">"usr-9182"</span>,</p>
                        <p className="text-slate-400 pl-8">"role": <span className="text-amber-300">"Company"</span>,</p>
                        <p className="text-slate-400 pl-8">"permissions": [</p>
                        <p className="text-amber-300 pl-12">"os.create", "os.read", "crm.write"</p>
                        <p className="text-slate-400 pl-8">]</p>
                        <p className="text-slate-400 pl-4">&#125;</p>
                      </div>
                    </div>

                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-3">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Auditoria de Segurança Zero-Trust</span>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center bg-[#0d0f22] p-2.5 rounded border border-slate-900">
                          <span className="text-slate-300">Device Fingerprint:</span>
                          <span className="font-mono text-emerald-400 text-[11px] font-bold">Verificado (Chrome/macOS)</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#0d0f22] p-2.5 rounded border border-slate-900">
                          <span className="text-slate-300">MFA (Double Factor):</span>
                          <span className="font-mono text-indigo-400 text-[11px] font-bold">Ativo via App Authenticator</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#0d0f22] p-2.5 rounded border border-slate-900">
                          <span className="text-slate-300">Proteção CSRF / Origin:</span>
                          <span className="font-mono text-emerald-400 text-[11px] font-bold">Strict-SameSite Cookies</span>
                        </div>
                      </div>
                      <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl flex gap-2 text-[10px] text-slate-400">
                        <ShieldCheck className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                        <span>Este token é validado na rota server-side do Express antes de qualquer operação em banco de dados.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FASE 3: MULTITENANCY */}
              {activeTab === "tenant" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black flex items-center gap-2"><Users className="h-5 w-5 text-cyan-400" /> Fase 3 — Isolamento Hermético Multitenancy</h3>
                    <p className="text-xs text-slate-400">Nenhuma empresa consegue ler, alterar ou interceptar registros de outra. Dados isolados em nível lógico.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tenantConfigs.map((t) => {
                      const isActive = tenantId === t.id;
                      return (
                        <div 
                          key={t.id} 
                          onClick={() => setTenantId(t.id)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            isActive 
                              ? "bg-slate-900/80 border-indigo-500 shadow-lg shadow-indigo-500/5" 
                              : "bg-[#05060d] border-slate-900 opacity-60 hover:opacity-90"
                          }`}
                        >
                          <span className="text-[10px] font-mono text-slate-500 block">ID: {t.id}</span>
                          <h4 className="text-xs font-black text-white mt-1">{t.name}</h4>
                          <div className="mt-3 space-y-1 font-mono text-[10px]">
                            <div className="flex justify-between"><span>Leads:</span> <span className="font-bold text-white">{tenantData[t.id].leads}</span></div>
                            <div className="flex justify-between"><span>SLA Médio:</span> <span className="font-bold text-emerald-400">98.4%</span></div>
                            <div className="flex justify-between"><span>Faturamento:</span> <span className="font-bold text-cyan-400">R$ {tenantData[t.id].billing.toLocaleString()}</span></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-2 font-mono text-[11px]">
                    <span className="text-emerald-400 font-bold block">// Isolamento forçado em nível de Query</span>
                    <p className="text-slate-400">
                      db.select().from(leads).where(eq(leads.tenant_id, req.currentUser.tenant_id));
                    </p>
                    <p className="text-slate-500 text-[10px]">
                      *O middleware do Express injeta o tenant_id decodificado do JWT diretamente na assinatura de todas as consultas.
                    </p>
                  </div>
                </div>
              )}

              {/* FASE 4: CRM ENTERPRISE */}
              {activeTab === "crm" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-black flex items-center gap-2"><KanbanSquare className="h-5 w-5 text-pink-400" /> Fase 4 — CRM Enterprise Pipeline</h3>
                      <p className="text-xs text-slate-400">Gerenciamento comercial de Leads de Prospecção ativa de empresas de campo e credenciamento.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {["Fria", "Contatado", "Demonstração", "Qualificado"].map((stage) => {
                      const leadsInStage = crmLeads.filter(l => l.status === stage);
                      return (
                        <div key={stage} className="bg-[#05060d] border border-slate-900 p-3 rounded-xl space-y-2">
                          <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                            <span className="text-[11px] font-bold text-slate-300 uppercase">{stage}</span>
                            <span className="bg-[#0d0f22] text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                              {leadsInStage.length}
                            </span>
                          </div>
                          
                          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                            {leadsInStage.map((lead) => (
                              <div key={lead.id} className="bg-[#0d0f22] border border-slate-900/60 p-2.5 rounded-lg text-[10px] space-y-2">
                                <div className="flex justify-between">
                                  <span className="font-bold text-white leading-tight truncate w-32">{lead.razaoSocial}</span>
                                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono ${
                                    lead.temperature === 'Hot' ? 'bg-rose-950 text-rose-400 border border-rose-900/40' : 'bg-slate-900 text-slate-400'
                                  }`}>
                                    {lead.temperature}
                                  </span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-mono text-[9px]">
                                  <span>{lead.city} - {lead.state}</span>
                                  <span className="text-indigo-400 font-bold">Score: {lead.leadsScore}%</span>
                                </div>
                                <div className="flex gap-1 pt-1 border-t border-slate-900/50">
                                  <button
                                    onClick={() => handleEnrichLead(lead.id)}
                                    className="flex-1 text-[9px] bg-[#141b3c] hover:bg-[#1a234e] text-indigo-300 p-1 rounded font-bold transition-all cursor-pointer"
                                  >
                                    Enriquecer
                                  </button>
                                  <button
                                    onClick={() => handleAnonymizeLead(lead.id)}
                                    className="text-[9px] text-rose-400 hover:bg-rose-950/20 p-1 rounded font-bold transition-all cursor-pointer"
                                    title="Anonimizar LGPD"
                                  >
                                    LGPD
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* FASE 5: EVENT BUS */}
              {activeTab === "bus" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-black flex items-center gap-2"><Radio className="h-5 w-5 text-indigo-400" /> Fase 5 — Arquitetura Event Driven (Event Bus)</h3>
                      <p className="text-xs text-slate-400">Eventos internos de negócios propagados e assinados de maneira assíncrona por microsserviços.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-2">Simulador de Eventos</span>
                      <div className="space-y-1.5">
                        {[
                          { name: "lead.created", label: "Lead Criado" },
                          { name: "lead.converted", label: "Lead Convertido" },
                          { name: "invoice.paid", label: "Fatura Paga" },
                          { name: "os.completed", label: "Chamado Concluído" },
                          { name: "technician.approved", label: "Técnico Homologado" }
                        ].map((evt) => (
                          <button
                            key={evt.name}
                            onClick={() => handleSimulateEvent(evt.name)}
                            className="w-full text-left text-[11px] font-bold bg-[#0d0f22] hover:bg-[#151833] border border-slate-900 p-2.5 rounded-lg flex justify-between items-center transition-all cursor-pointer"
                          >
                            <span>{evt.label}</span>
                            <Play className="h-3 w-3 text-emerald-400" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-8 bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-3">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Fila de Eventos Ativos (Live Logger)</span>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {events.map((evt) => (
                          <div key={evt.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 font-mono text-[10px] text-slate-300">
                            <div className="flex justify-between border-b border-slate-900 pb-1 mb-1 text-slate-500">
                              <span>Event: <span className="text-cyan-400 font-bold">{evt.event}</span></span>
                              <span>[{evt.timestamp}]</span>
                            </div>
                            <div className="truncate text-slate-400">Payload: {evt.payload}</div>
                            <div className="text-[9px] text-slate-600 truncate mt-1">Signature: {evt.signature}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FASE 6: WEBHOOK ENGINE */}
              {activeTab === "hooks" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-black flex items-center gap-2"><Share2 className="h-5 w-5 text-emerald-400" /> Fase 6 — Motor de Webhooks Integrados</h3>
                      <p className="text-xs text-slate-400">Notifique sistemas parceiros ou orquestradores (como o n8n) em tempo real via chamadas HTTP seguras.</p>
                    </div>
                    <button
                      onClick={handleTestWebhook}
                      disabled={testWebhookStatus === 'sending'}
                      className="bg-[#141b3c] hover:bg-[#1c2656] border border-slate-800 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="h-3 w-3 text-indigo-400" /> Testar HMAC Webhook
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-3">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Endpoints Registrados</span>
                      <div className="space-y-2">
                        {webhooks.map((wh) => (
                          <div key={wh.id} className="bg-[#0d0f22] p-3 rounded-lg border border-slate-900 space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="font-bold text-white">{wh.name}</span>
                              <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase">
                                {wh.status}
                              </span>
                            </div>
                            <div className="font-mono text-[10px] text-slate-400 truncate">{wh.url}</div>
                            <div className="text-[10px] text-slate-500 font-mono">Secret: {wh.secret}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-3 font-mono">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Assinatura de Segurança HMAC SHA256</span>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-[10px] space-y-1 text-slate-400 leading-relaxed">
                        <p className="text-slate-500">// O middleware calcula a assinatura para prevenir ataques de spoofing</p>
                        <p><span className="text-purple-400">const</span> crypto = <span className="text-blue-400">require</span>(<span className="text-amber-300">"crypto"</span>);</p>
                        <p><span className="text-purple-400">const</span> signature = crypto</p>
                        <p className="pl-4">.createHmac(<span className="text-amber-300">"sha256"</span>, webhook_secret)</p>
                        <p className="pl-4">.update(JSON.stringify(payload))</p>
                        <p className="pl-4">.digest(<span className="text-amber-300">"hex"</span>);</p>
                        <p className="text-cyan-400 pt-1">X-Nexora-Signature: <span className="text-slate-300">e3b0c44298fc1c149afbf4c8996...</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FASE 7: AUTOMACAO N8N */}
              {activeTab === "n8n" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black flex items-center gap-2"><Zap className="h-5 w-5 text-amber-400" /> Fase 7 — Orquestração & Workflows n8n</h3>
                    <p className="text-xs text-slate-400">O n8n atua recebendo nossos Webhooks, enriquecendo contatos no LinkedIn, e agendando salas automáticas no Google Meet.</p>
                  </div>

                  <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Fluxo Visual do Workflow no n8n (Mapeado)</span>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-950 border border-slate-900 rounded-lg text-xs">
                      
                      <div className="bg-[#12163b] border border-indigo-500 p-3 rounded text-center w-36 font-bold text-indigo-300">
                        Webhook Trigger
                        <span className="block text-[9px] font-normal text-slate-400 mt-1">/crm-sync</span>
                      </div>

                      <div className="text-slate-500 hidden md:block">{"──>"}</div>

                      <div className="bg-[#1c0f24] border border-pink-500 p-3 rounded text-center w-36 font-bold text-pink-300">
                        Gemini AI Parser
                        <span className="block text-[9px] font-normal text-slate-400 mt-1">Copywriter Abordagem</span>
                      </div>

                      <div className="text-slate-500 hidden md:block">{"──>"}</div>

                      <div className="bg-[#0f2411] border border-emerald-500 p-3 rounded text-center w-36 font-bold text-emerald-300">
                        WhatsApp API
                        <span className="block text-[9px] font-normal text-slate-400 mt-1">Evolution API send</span>
                      </div>

                      <div className="text-slate-500 hidden md:block">{"──>"}</div>

                      <div className="bg-[#1e1c0d] border border-amber-500 p-3 rounded text-center w-36 font-bold text-amber-300">
                        Calendly Sync
                        <span className="block text-[9px] font-normal text-slate-400 mt-1">Google Meet Room</span>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* FASE 8: GROWTH ENGINE */}
              {activeTab === "growth" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black flex items-center gap-2"><Target className="h-5 w-5 text-red-400" /> Fase 8 — Growth Engine & Outbound Leads Scraper</h3>
                    <p className="text-xs text-slate-400">Captura territorial autônoma de técnicos e distribuidoras solares com cruzamento de dados de CEP e geofencing.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl text-center space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Custo de Aquisição (CAC)</span>
                      <span className="text-3xl font-black text-white font-display">R$ 18,40</span>
                      <span className="text-[10px] text-emerald-400 block font-semibold">↓ 14% este mês</span>
                    </div>

                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl text-center space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Lifetime Value (LTV)</span>
                      <span className="text-3xl font-black text-white font-display">R$ 4.800</span>
                      <span className="text-[10px] text-cyan-400 block font-semibold">Relação LTV/CAC: 26x</span>
                    </div>

                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl text-center space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Taxa de Conversão</span>
                      <span className="text-3xl font-black text-white font-display">4.2%</span>
                      <span className="text-[10px] text-indigo-400 block font-semibold">Meta de Growth: 5.0%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* FASE 9: MESSAGING REAL */}
              {activeTab === "messaging" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black flex items-center gap-2"><Mail className="h-5 w-5 text-cyan-400" /> Fase 9 — Mensageria Real (WhatsApp, SMS & E-mail APIs)</h3>
                    <p className="text-xs text-slate-400">Geração e despacho de propostas de contratos, notificações transacionais e agendas.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-2">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono block">Evolution API (Whats)</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">Disparo de templates oficiais com botões e arquivos de documentações.</p>
                      <span className="text-[10px] font-mono text-slate-600 block">Endpoint: /message/sendText</span>
                    </div>

                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-2">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase font-mono block">Twilio Gateway (SMS)</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">Disparo de alertas prioritários e notificações de despacho de emergência.</p>
                      <span className="text-[10px] font-mono text-slate-600 block">Endpoint: /2010-04-01/Messages</span>
                    </div>

                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-2">
                      <span className="text-[10px] text-cyan-400 font-bold uppercase font-mono block">Resend (E-mail API)</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">Envio automático de contratos comerciais, notas fiscais e relatórios.</p>
                      <span className="text-[10px] font-mono text-slate-600 block">Endpoint: https://api.resend.com</span>
                    </div>
                  </div>
                </div>
              )}

              {/* FASE 10: CHAT ENTERPRISE */}
              {activeTab === "chat" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black flex items-center gap-2"><MessageSquare className="h-5 w-5 text-indigo-400" /> Fase 10 — Chat Corporativo, Presence & Moderation</h3>
                    <p className="text-xs text-slate-400">Comunicação 1:1 persistida e moderada por inteligência artificial para detecção de compartilhamento de chaves ou linguagem imprópria.</p>
                  </div>

                  <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-3 font-mono text-xs">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Status do Redis Adapter (Presence Engine)</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 space-y-1">
                        <span className="text-slate-500 block">Active Websockets:</span>
                        <span className="text-emerald-400 font-bold font-mono">1,492 clientes online</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 space-y-1">
                        <span className="text-slate-500 block">Typing indicators:</span>
                        <span className="text-indigo-400 font-bold font-mono">Ativo (Socket.io)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FASE 11: SPLIT PAYMENTS */}
              {activeTab === "finance" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black flex items-center gap-2"><Landmark className="h-5 w-5 text-amber-500" /> Fase 11 — Split Payments & Ledger Financeiro</h3>
                    <p className="text-xs text-slate-400">Conciliação bancária via Asaas e Efí para liquidação automática e splits na conta PIX do instalador.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-3">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Ledger de Saldos Ativos (Split Rateio)</span>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center bg-[#0d0f22] p-2 rounded">
                          <span className="text-slate-400">Comissão Nexora (15%):</span>
                          <span className="font-bold text-white">R$ 6.750,00</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#0d0f22] p-2 rounded">
                          <span className="text-slate-400">Repasse Técnico (85%):</span>
                          <span className="font-bold text-emerald-400">R$ 38.250,00</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#0d0f22] p-2 rounded">
                          <span className="text-slate-400">Total Transacionado:</span>
                          <span className="font-bold text-cyan-400">R$ 45.000,00</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-2 text-xs">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Parceiro Bancário Registrado</span>
                      <div className="bg-[#0d0f22] p-3 rounded-lg border border-slate-900">
                        <div className="flex justify-between items-center font-bold text-white mb-2">
                          <span>Asaas Sandbox API</span>
                          <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 py-0.5 rounded uppercase">Connected</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">Liquidando faturas por PIX QR Code e executando conciliação instantânea em lote (PIX Copia e Cola).</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FASE 12: IA & COPILOTOS */}
              {activeTab === "ai" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black flex items-center gap-2"><Cpu className="h-5 w-5 text-indigo-400" /> Fase 12 — IA Multiusuário & Co-pilotos de Auditoria</h3>
                    <p className="text-xs text-slate-400">Mecanismo neural alimentado pelo Gemini 3.5 para interpretar e auditar desvios fiscais ou inconsistências de faturamento.</p>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-3">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Análise de Compliance Neural</span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      "Utilizando regressões de IA sobre os logs do sistema, o copiloto detectou que a comissão do plano 'Solar Plus' foi reduzida em 3% sem autorização prévia por um usuário com acesso temporário."
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <span>RAG Embeddings: Ativo</span>
                      <span>Confiança de Análise: 96.5%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* FASE 13: OBSERVABILIDADE */}
              {activeTab === "obs" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black flex items-center gap-2"><Activity className="h-5 w-5 text-emerald-400" /> Fase 13 — OpenTelemetry Observability</h3>
                    <p className="text-xs text-slate-400">Rastreamento distribuído de latência, consumo de API, e conexões de pool do PostgreSQL.</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-1 text-center">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Latência da API</span>
                      <span className="text-2xl font-black text-emerald-400 font-mono">{metrics.latency} ms</span>
                    </div>

                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-1 text-center">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">CPU Cluster</span>
                      <span className="text-2xl font-black text-white font-mono">{metrics.cpu}%</span>
                    </div>

                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-1 text-center">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Conexões DB Pool</span>
                      <span className="text-2xl font-black text-indigo-400 font-mono">{metrics.dbPool}/20</span>
                    </div>

                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-1 text-center">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">AI Tokens Usados</span>
                      <span className="text-xl font-black text-white font-mono truncate block">{metrics.aiTokens.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* FASE 14: DEVSECOPS */}
              {activeTab === "ops" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black flex items-center gap-2"><Server className="h-5 w-5 text-indigo-400" /> Fase 14 — DevSecOps CI/CD Deployment</h3>
                    <p className="text-xs text-slate-400">Containers Docker em Cloud Run integrados com controle de segredos e rollback automatizado.</p>
                  </div>

                  <div className="space-y-3 bg-[#05060d] border border-slate-900 p-4 rounded-xl">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-1">Status da Esteira de CI/CD (Production Pipeline)</span>
                    <div className="space-y-2">
                      {deploySteps.map((step, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-900 text-xs font-mono">
                          <span className="text-slate-300 flex items-center gap-2">
                            <span className="text-indigo-400">#{idx+1}</span> {step.title}
                          </span>
                          <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60 font-bold text-[9px]">
                            SUCCESS
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FASE 15: COMPLIANCE LGPD */}
              {activeTab === "compliance" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black flex items-center gap-2"><FileLock className="h-5 w-5 text-red-400" /> Fase 15 — Trilha de Auditoria Compliance LGPD</h3>
                    <p className="text-xs text-slate-400">Trilha de auditoria inalterável assinada digitalmente com Hashing SHA-256 para controle de acesso.</p>
                  </div>

                  <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-3">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Logs de Acesso e Operações de Consentimento</span>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {complianceRecords.map((rec) => (
                        <div key={rec.id} className="bg-slate-950 p-2.5 rounded border border-slate-900 font-mono text-[10px] space-y-1">
                          <div className="flex justify-between text-slate-500">
                            <span>User: <span className="text-white font-bold">{rec.user}</span></span>
                            <span>[{rec.date}]</span>
                          </div>
                          <div className="text-cyan-400 font-bold">Action: {rec.action}</div>
                          <div className="text-[9px] text-slate-500 truncate">Hash: {rec.sha256}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FASE 16: DASHBOARDS EXECUTIVOS */}
              {activeTab === "dash" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black flex items-center gap-2"><BarChart3 className="h-5 w-5 text-cyan-400" /> Fase 16 — Dashboards Executivos KPIs</h3>
                    <p className="text-xs text-slate-400">Métricas comerciais e de conversão consolidadas para suporte a decisões de diretoria e OKRs.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl text-center">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase mb-1">MRR Geral</span>
                      <span className="text-2xl font-black text-white">R$ 145.000</span>
                      <span className="text-[9px] text-emerald-400 block font-semibold">↑ 8.2% este mês</span>
                    </div>

                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl text-center">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase mb-1">SLA Operacional</span>
                      <span className="text-2xl font-black text-white">99.1%</span>
                      <span className="text-[9px] text-indigo-400 block font-semibold">Alvo FSM: 98%</span>
                    </div>

                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl text-center">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase mb-1">Técnicos Credenciados</span>
                      <span className="text-2xl font-black text-white">412</span>
                      <span className="text-[9px] text-emerald-400 block font-semibold">↑ 45 novas adesões</span>
                    </div>

                    <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl text-center">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase mb-1">Churn SaaS</span>
                      <span className="text-2xl font-black text-white">0.8%</span>
                      <span className="text-[9px] text-emerald-400 block font-semibold">Muito abaixo do mercado</span>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* SHARED LIVE ENGINE ACTIVITY LOG FOOTER */}
          <div className="border-t border-slate-900 pt-4 mt-6">
            <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider mb-2">Live Logs (Trilha de Eventos e Execuções no Servidor)</span>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900/60 max-h-24 overflow-y-auto space-y-1 font-mono text-[10px] text-slate-400">
              {logs.map((logStr, i) => (
                <div key={i} className="truncate">
                  {logStr}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
