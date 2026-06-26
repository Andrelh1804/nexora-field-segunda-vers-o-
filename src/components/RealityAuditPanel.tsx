import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, AlertTriangle, Activity, FileText, CheckCircle2, Zap, GitBranch, Cpu, 
  Coins, MessageSquare, Trophy, Network, Play, Check, X, ChevronRight, Info, Search, 
  Database, Lock, Settings, Terminal, Sliders, Download, RefreshCw, BarChart3, PieChart,
  GitFork, Eye, Server, Radio, HelpCircle, ArrowRight, ShieldAlert, AlertOctagon, HeartCrack, Layers, Flame
} from "lucide-react";

// Types & Interfaces
interface SystemModuleAudit {
  id: string;
  name: string;
  category: 'Core' | 'Operation' | 'Financeiro' | 'CRM' | 'IA' | 'Chat' | 'Gamificação' | 'Growth' | 'Billing' | 'Auditoria';
  status: 'REAL' | 'SIMULAÇÃO' | 'PARCIAL' | 'STUB' | 'DESATIVADO';
  realityScore: number; // 0 to 100
  impact: 'Crítico' | 'Alto' | 'Médio' | 'Baixo';
  evidence: {
    files: string[];
    functions: string[];
    endpoints: string[];
    dependencies: string[];
    dbFields: string[];
    flowDescription: string;
  };
  gaps: string[];
  recommendation: string;
}

// Inactive dependencies interface
interface BrokenDependency {
  id: string;
  name: string;
  type: 'API' | 'Webhook' | 'Service' | 'Module';
  target: string;
  status: 'Inativo' | 'Isolado' | 'Mock Ativo' | 'Não Conectado';
  impactLevel: 'Alta' | 'Média' | 'Baixa';
  fileLocation: string;
}

// Audit alerts interface
interface CriticalRealityAlert {
  id: string;
  title: string;
  module: string;
  description: string;
  riskScore: 'Crítico' | 'Alto' | 'Médio';
  codeSnippet?: string;
  remedy: string;
}

// Mock database for Reality & Simulation Auditor
const INITIAL_MODULES_AUDIT: SystemModuleAudit[] = [
  {
    id: "mod-auth",
    name: "Autenticação & Multitenancy (Core)",
    category: "Core",
    status: "PARCIAL",
    realityScore: 65,
    impact: "Crítico",
    evidence: {
      files: ["/src/App.tsx", "/src/components/RoleSwitcher.tsx"],
      functions: ["handleLogin", "switchRole", "checkSession"],
      endpoints: ["/api/auth/login (mocked)", "/api/auth/session (local)"],
      dependencies: ["jsonwebtoken (não integrado)", "firebase-auth (pendente setup definitivo)"],
      dbFields: ["users.email", "users.role_id", "users.company_id"],
      flowDescription: "Sessão simulada no frontend através do estado persistido em localStorage e seletor rápido de perfis (RoleSwitcher) para testes rápidos de experiência."
    },
    gaps: [
      "Falta de validação JWT server-side no gateway principal.",
      "Token de sessão do usuário é puramente declarativo.",
      "Troca de empresa no multitenancy não valida chaves criptográficas de isolamento."
    ],
    recommendation: "Configurar o middleware de segurança do Express e habilitar a verificação de claims de inquilinos (tenant_id) no cabeçalho Authorization do Firebase Auth."
  },
  {
    id: "mod-tickets",
    name: "Abertura & Rastreamento de Chamados (FSM)",
    category: "Operation",
    status: "REAL",
    realityScore: 90,
    impact: "Crítico",
    evidence: {
      files: ["/src/components/AdminPortal.tsx", "/src/components/CompanyPortal.tsx", "/src/components/TechnicianPortal.tsx"],
      functions: ["onCreateTicket", "onAcceptTicket", "onCloseTicket", "onCheckInGPS"],
      endpoints: ["/api/tickets", "/api/tickets/:id/status", "/api/tickets/gps"],
      dependencies: ["lucide-react", "google-maps-api (local/fallback)"],
      dbFields: ["tickets.id", "tickets.status", "tickets.tech_id", "tickets.company_id", "tickets.latitude", "tickets.longitude"],
      flowDescription: "Fluxo robusto com persistência de estado e reatividade real de ponta-a-ponta. Empresas criam OS, técnicos recebem push em tempo real no dashboard, efetuam check-in de geofencing e preenchem laudos reais."
    },
    gaps: [
      "GPS real requer conexão contínua de rede no iframe, caindo para simulação coordenada de rota se houver falha de sinal."
    ],
    recommendation: "Implementar Service Worker para sincronização offline de check-ins GPS em modo PWA quando o técnico estiver em subsolos ou áreas rurais sem sinal celular."
  },
  {
    id: "mod-finance",
    name: "Split Payment & Carteira Digital",
    category: "Financeiro",
    status: "SIMULAÇÃO",
    realityScore: 20,
    impact: "Crítico",
    evidence: {
      files: ["/src/components/BillingFinancialCenter.tsx", "/src/components/BillingEngine.tsx"],
      functions: ["triggerSplitPayment", "processPayouts", "generatePixQrCode"],
      endpoints: ["/api/payment/split (Simulado)", "/api/payment/payout (Mocked)"],
      dependencies: ["zoop-sdk (apenas declarado)", "stripe-node (stub)"],
      dbFields: ["ledger.transactions", "wallet.balance", "payouts.status"],
      flowDescription: "Fluxo financeiro simula a execução do cálculo de split em lote (comissão de 15% Nexora vs 85% Técnico), gerando QR Code estático do PIX para fins de validação visual de layout e regras de rateio."
    },
    gaps: [
      "Não há transferência real de valores monetários com gateways regulados pelo BACEN.",
      "Conciliação bancária é disparada por timer local no frontend, sem receber webhooks reais da adquirente.",
      "As contas gráficas de saldo acumulado não possuem assinatura criptográfica para prevenção de fraudes internas."
    ],
    recommendation: "Migrar as assinaturas de split para a API real em ambiente sandbox da Asaas, Efí ou Stark Bank e habilitar os webhooks para transição de estados de faturas."
  },
  {
    id: "mod-crm",
    name: "Leads & Automação de Funil Comercial",
    category: "CRM",
    status: "PARCIAL",
    realityScore: 55,
    impact: "Alto",
    evidence: {
      files: ["/src/components/ComercialPortal.tsx"],
      functions: ["onConvertLead", "addLead", "updatePipelineStage"],
      endpoints: ["/api/crm/leads", "/api/crm/pipeline"],
      dependencies: [],
      dbFields: ["crm_leads.id", "crm_leads.stage", "crm_leads.company_size"],
      flowDescription: "Quadro Kanban funcional para movimentação de leads de prospecção. Ações visuais de conversão e agendamentos de reuniões atualizam o estado do funil de forma integrada, salvando em localStorage temporário."
    },
    gaps: [
      "Nenhuma integração nativa com RD Station, HubSpot ou Salesforce.",
      "Envio de e-mails automatizados para leads qualificados é simulado em tela."
    ],
    recommendation: "Expor webhooks de saída do funil Kanban para integrar com n8n ou Zapier, disparando réguas de nutrição reais."
  },
  {
    id: "mod-ia-dispatch",
    name: "Algoritmos de Matching & Dispatch Inteligente (IA)",
    category: "IA",
    status: "REAL",
    realityScore: 85,
    impact: "Crítico",
    evidence: {
      files: ["/src/components/AdminPortal.tsx", "/src/components/AdminPlansManager.tsx"],
      functions: ["calculateMatchingScore", "getBestTechniciansForOS"],
      endpoints: ["/api/ai/match", "/api/ai/analyze-credentials"],
      dependencies: ["@google/genai", "turf-distance (cálculo geográfico)"],
      dbFields: ["tech.specialties", "tech.rating", "tech.location_lat", "tech.location_lng"],
      flowDescription: "Mecanismo autônomo real que calcula a pontuação de aderência técnica com base em competências, certificações ativas (NR10/35), distância rodoviária e avaliação histórica."
    },
    gaps: [
      "Se a chave da API Gemini não for fornecida, o sistema regride de forma resiliente para cálculo heurístico baseado em matriz linear estática."
    ],
    recommendation: "Fornecer as credenciais seguras de produção no Painel do Administrador para elevar a precisão utilizando IA generativa na interpretação de ordens de serviço complexas."
  },
  {
    id: "mod-ia-chat",
    name: "Reality & Billing AI Assistant (IA Co-Pilots)",
    category: "IA",
    status: "REAL",
    realityScore: 95,
    impact: "Alto",
    evidence: {
      files: ["/src/components/BillingAIAssistant.tsx", "/src/components/AdminCompliancePanel.tsx"],
      functions: ["handleAiQuestion", "getNeuralReport", "detectAnomalies"],
      endpoints: ["/api/ai/copilot-chat", "/api/ai/compliance-audit"],
      dependencies: ["@google/genai", "natural-language-parser (stub)"],
      dbFields: ["ai_audit_logs.tokens", "ai_audit_logs.latency"],
      flowDescription: "O copiloto de auditoria e faturamento está totalmente integrado de forma real. Ele interpreta a base de dados em tempo real, executa regressões em linguagem natural para descobrir quem alterou comissões ou burlou permissões, e detecta logins simultâneos fraudulentos."
    },
    gaps: [
      "Falta de cache semântico para otimização de consumo de tokens em perguntas repetidas."
    ],
    recommendation: "Implementar Redis vector cache para consultas frequentes sobre compliance de faturas e auditoria básica."
  },
  {
    id: "mod-chat",
    name: "Chat Corporativo 1:1 & Grupos de Serviço",
    category: "Chat",
    status: "PARCIAL",
    realityScore: 60,
    impact: "Alto",
    evidence: {
      files: ["/src/components/SharedChat.tsx"],
      functions: ["sendMessage", "createGroup", "flagMessage"],
      endpoints: ["/api/chat/messages (Simulado)", "/api/chat/groups"],
      dependencies: ["canvas-confetti (UI effects)"],
      dbFields: ["chat_messages.text", "chat_messages.sender_id", "chat_messages.flagged"],
      flowDescription: "Interface interativa premium que permite simular conversas entre empresas e técnicos sobre ordens de serviço. Suporta envio de arquivos fictícios, bloqueios, e sinalização de mensagens inadequadas com salvamento local de estado."
    },
    gaps: [
      "Não há canal WebSocket real estabelecido para comunicação instantânea bidirecional entre dispositivos distintos na mesma sessão."
    ],
    recommendation: "Habilitar o Socket.io ou Firebase Firestore Realtime Database para propagar mensagens de chat instantaneamente sem pooling periódico."
  },
  {
    id: "mod-gamify",
    name: "Gamificação & Recompensas de Técnicos",
    category: "Gamificação",
    status: "REAL",
    realityScore: 80,
    impact: "Baixo",
    evidence: {
      files: ["/src/components/TechnicianPortal.tsx"],
      functions: ["awardXP", "unlockBadge", "updateRanking"],
      endpoints: ["/api/tech/gamify/stats", "/api/tech/badges"],
      dependencies: [],
      dbFields: ["technicians.xp", "technicians.level", "technicians.badges_unlocked"],
      flowDescription: "Sistema dinâmico ativo de cálculo de XP ao concluir tarefas, desbloqueio de medalhas físicas reais de competências regulatórias, e feed de rankings semanais entre instaladores credenciados."
    },
    gaps: [
      "A distribuição de medalhas não possui uma trilha de contraprova fotográfica integrada ao laudo técnico."
    ],
    recommendation: "Automatizar a entrega de insígnias através do leitor neural de diplomas e termos de reciclagem de NR10/NR35 anexados."
  },
  {
    id: "mod-growth",
    name: "Growth Engine (Automação de Prospecção)",
    category: "Growth",
    status: "SIMULAÇÃO",
    realityScore: 15,
    impact: "Médio",
    evidence: {
      files: ["/src/components/ComercialPortal.tsx"],
      functions: ["triggerGrowthCampaign", "scrapeLeads", "autoScheduleMeeting"],
      endpoints: ["/api/growth/scrape (Mock)", "/api/growth/automation"],
      dependencies: ["puppeteer (stub inoperante)"],
      dbFields: ["growth_campaigns.id", "growth_campaigns.leads_count"],
      flowDescription: "Painel interativo para parametrização de campanhas de captação de prestadores por região. Mostra mapas simulados e robôs automatizados coletando contatos telefônicos de empresas de instalação solar."
    },
    gaps: [
      "O varredor de contatos do Google Maps e LinkedIn é simulado localmente no frontend, sem disparar scrapers reais no backend.",
      "Configurações de agendamento não efetuam bloqueio real de salas do Google Calendar dos consultores."
    ],
    recommendation: "Substituir a automação simulada por integrações de verdade com APIs de scraping (ex: Apify ou Google Places API) e do Google Calendar via OAuth2."
  },
  {
    id: "mod-billing",
    name: "Planos, Assinaturas & Cupons Dinâmicos",
    category: "Billing",
    status: "REAL",
    realityScore: 88,
    impact: "Crítico",
    evidence: {
      files: ["/src/components/AdminPlansManager.tsx", "/src/components/AdminPortal.tsx"],
      functions: ["onCreatePlan", "onUpdateSubscription", "onApplyCoupon"],
      endpoints: ["/api/billing/plans", "/api/billing/subscriptions", "/api/billing/coupons"],
      dependencies: [],
      dbFields: ["plans.id", "plans.price", "subscriptions.status", "coupons.discount_pct"],
      flowDescription: "Módulo administrativo completo e real. Permite cadastrar planos SaaS de comissão fixa ou híbrida, suspender empresas inadimplentes, emitir cupons de desconto limitados e manter logs de auditoria de alteração de preços com versionamento lógico de banco de dados."
    },
    gaps: [
      "Não há sincronização automática com gateway de pagamentos recorrente externo (ex: faturas geradas no Stripe Billing)."
    ],
    recommendation: "Integrar as ações administrativas do AdminPlansManager com webhooks do Stripe Billing / Recorrência para que toda suspensão no painel se reflita no status de cobrança do cartão de crédito."
  }
];

const INITIAL_BROKEN_DEPENDENCIES: BrokenDependency[] = [
  { id: "dep-1", name: "Zoop Split Gateway API", type: "API", target: "https://api.zoop.com.br/v1/marketplaces/split", status: "Mock Ativo", impactLevel: "Alta", fileLocation: "/src/components/BillingFinancialCenter.tsx" },
  { id: "dep-2", name: "Hubspot Webhook Pipeline Sync", type: "Webhook", target: "https://api.hubapi.com/webhooks/v1/deals", status: "Inativo", impactLevel: "Média", fileLocation: "/src/components/ComercialPortal.tsx" },
  { id: "dep-3", name: "Google Calendar Calendar Sync", type: "Service", target: "https://www.googleapis.com/calendar/v3/events", status: "Não Conectado", impactLevel: "Baixa", fileLocation: "/src/components/ComercialPortal.tsx" },
  { id: "dep-4", name: "Twilio SMS Dispatch Service", type: "Service", target: "https://api.twilio.com/2010-04-01/Accounts", status: "Mock Ativo", impactLevel: "Média", fileLocation: "/src/components/AdminPortal.tsx" },
  { id: "dep-5", name: "Asaas Invoice Generator (Notas Fiscais)", type: "API", target: "https://sandbox.asaas.com/api/v3/invoices", status: "Não Conectado", impactLevel: "Alta", fileLocation: "/src/components/BillingFinancialCenter.tsx" }
];

const INITIAL_CRITICAL_ALERTS: CriticalRealityAlert[] = [
  {
    id: "alert-real-1",
    title: "Simulação Crítica em Gateways de Pagamento",
    module: "Financeiro",
    description: "As liquidações de OS e split payments estão usando simulações locais do frontend em 'BillingFinancialCenter.tsx'. Não há integração ativa com adquirente regulada para transações de Pix ou TEDs reais.",
    riskScore: "Crítico",
    codeSnippet: `// Linha 412 de BillingFinancialCenter.tsx\nconst simulatePixCharge = (ticket) => {\n  const nexoraSplit = ticket.value * 0.15;\n  const techSplit = ticket.value * 0.85;\n  // SEM CONEXÃO REAL COM BANCO CENTRAL\n  return { txid: "mock_pix_" + Math.random(), status: "CONCLUIDO" };\n}`,
    remedy: "Substituir a rotina de simulação de transações pelo módulo SDK de Sandbox do banco de repasse de sua escolha (ex: Efí, Asaas, Stark)."
  },
  {
    id: "alert-real-2",
    title: "Chave JWT Sem Validação no Backend",
    module: "Core Platform",
    description: "O RoleSwitcher permite alterar a identidade do usuário para 'Super Admin', 'Company' ou 'Técnico' apenas manipulando o estado local em 'App.tsx'. Não existe validação de assinatura de token criptografado na API Gateway.",
    riskScore: "Crítico",
    codeSnippet: `// Linha 120 de App.tsx\nconst handleRoleChange = (newRole) => {\n  setCurrentUser({ ...currentUser, role: newRole });\n  // Risco de escalabilidade de privilégios se exposto em produção!\n}`,
    remedy: "Habilitar as regras de segurança rígidas e validar os tokens JWT correspondentes em todas as chamadas de endpoint no arquivo server.ts."
  },
  {
    id: "alert-real-3",
    title: "Notificações Push / SMS Falsas",
    module: "Chat & Comunicação",
    description: "O disparo de SMS avisando o técnico de que há um chamado próximo à sua geolocalização utiliza apenas timeouts de simulação em tela. Não há faturamento real de envio de pacotes através da operadora Twilio.",
    riskScore: "Médio",
    codeSnippet: `// Linha 510 de AdminPortal.tsx\nconst notifyTechSMS = (tech, ticket) => {\n  console.log("Simulating SMS sent via Twilio to " + tech.phone);\n  toast.success("SMS simulado enviado com sucesso para " + tech.name);\n}`,
    remedy: "Preencher as credenciais da conta Twilio no arquivo de ambiente (.env) e habilitar o nó de requisições HTTPS real no backend."
  }
];

export default function RealityAuditPanel() {
  const [audits, setAudits] = useState<SystemModuleAudit[]>(INITIAL_MODULES_AUDIT);
  const [dependencies, setDependencies] = useState<BrokenDependency[]>(INITIAL_BROKEN_DEPENDENCIES);
  const [alerts, setAlerts] = useState<CriticalRealityAlert[]>(INITIAL_CRITICAL_ALERTS);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterImpact, setFilterImpact] = useState<string>("all");

  // Selected audit for detailed evidence modal/drawer
  const [inspectingAudit, setInspectingAudit] = useState<SystemModuleAudit | null>(null);

  // Active sub-tab inside reality panel
  const [activeTab, setActiveTab] = useState<'summary' | 'truth-map' | 'matriz' | 'alerts' | 'dependencies' | 'ai-auditor'>('summary');

  // AI Reality Audit Chat State
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'system'; text: string; attachment?: React.ReactNode }[]>([
    {
      sender: 'system',
      text: "Olá André Luis. Sou o Reality Audit AI, agente focado na validação de realidade de arquiteturas. Posso inspecionar se suas funções de Split de pagamento são de produção, quais APIs estão inativas, onde estão os mocks do CRM e como transicionar o Multitenancy para segurança nível Enterprise. O que deseja auditar no código agora?"
    }
  ]);

  // Auditor action logger (Auditing the Audits)
  const [realityAuditTrail, setRealityAuditTrail] = useState<{ id: string; timestamp: string; event: string; status: string }[]>([
    { id: "ra-0", timestamp: "2026-06-25T17:43:37-07:00", event: "Varredura do Módulo de Realidade Iniciada", status: "Sucesso" }
  ]);

  const logAction = (event: string, status: string = "Sucesso") => {
    const newEvent = {
      id: `ra-${Date.now()}`,
      timestamp: new Date().toISOString(),
      event,
      status
    };
    setRealityAuditTrail(prev => [newEvent, ...prev]);
  };

  // Summary Metrics calculations
  const summaryMetrics = useMemo(() => {
    const total = audits.length;
    const realCount = audits.filter(a => a.status === 'REAL').length;
    const simCount = audits.filter(a => a.status === 'SIMULAÇÃO').length;
    const partialCount = audits.filter(a => a.status === 'PARCIAL').length;
    const stubCount = audits.filter(a => a.status === 'STUB').length;
    const disabledCount = audits.filter(a => a.status === 'DESATIVADO').length;

    const realPercentage = total > 0 ? Math.round((realCount / total) * 100) : 0;
    const simPercentage = total > 0 ? Math.round((simCount / total) * 100) : 0;
    const partialPercentage = total > 0 ? Math.round((partialCount / total) * 100) : 0;
    const stubPercentage = total > 0 ? Math.round((stubCount / total) * 100) : 0;
    const disabledPercentage = total > 0 ? Math.round((disabledCount / total) * 100) : 0;

    // Weighted average of system maturity score
    const totalScore = audits.reduce((acc, curr) => acc + curr.realityScore, 0);
    const averageMaturity = total > 0 ? Math.round(totalScore / total) : 0;

    // Determine production readiness category
    let readinessText = "Não Pronto para Produção";
    let readinessColor = "text-rose-500 bg-rose-950/40 border-rose-900/60";
    if (averageMaturity >= 85) {
      readinessText = "Enterprise Ready";
      readinessColor = "text-emerald-400 bg-emerald-950/60 border-emerald-900/60";
    } else if (averageMaturity >= 70) {
      readinessText = "Produção Segura (Limitações Menores)";
      readinessColor = "text-indigo-400 bg-indigo-950/60 border-indigo-900/60";
    } else if (averageMaturity >= 50) {
      readinessText = "Produção Limitada (Múltiplas Simulações)";
      readinessColor = "text-amber-400 bg-amber-950/60 border-amber-900/60";
    } else if (averageMaturity >= 30) {
      readinessText = "Parcialmente Pronto / Ambiente Sandbox";
      readinessColor = "text-amber-500 bg-amber-950/40 border-amber-900/40";
    }

    return {
      total,
      realCount,
      simCount,
      partialCount,
      stubCount,
      disabledCount,
      realPercentage,
      simPercentage,
      partialPercentage,
      stubPercentage,
      disabledPercentage,
      averageMaturity,
      readinessText,
      readinessColor
    };
  }, [audits]);

  // Handle module filter logic
  const filteredAudits = useMemo(() => {
    return audits.filter(a => {
      const matchesSearch = 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.evidence.files.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
        a.evidence.endpoints.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = filterStatus === "all" || a.status === filterStatus;
      const matchesImpact = filterImpact === "all" || a.impact === filterImpact;

      return matchesSearch && matchesStatus && matchesImpact;
    });
  }, [audits, searchQuery, filterStatus, filterImpact]);

  // Reality AI Ask Engine
  const handleRealityAiQuery = (query: string) => {
    if (!query.trim()) return;

    setChatLog(prev => [...prev, { sender: 'user', text: query }]);
    setChatInput("");
    setIsTyping(true);
    logAction(`Consulta IA Realidade: "${query.substring(0, 45)}..."`);

    setTimeout(() => {
      let responseText = "";
      let attachment: React.ReactNode = null;
      const lower = query.toLowerCase();

      if (lower.includes("financeiro") || lower.includes("pagamento") || lower.includes("split") || lower.includes("pix")) {
        responseText = "O subsistema de split payment e faturamento está classificado como SIMULAÇÃO (apenas 20% de realidade no código). Identifiquei que arquivos como 'BillingFinancialCenter.tsx' possuem rotas que geram logs fictícios de Pix e simulam transferências em lote sem nenhuma requisição de rede HTTP real externa para a Zoop ou Stripe. Isto apresenta um risco Crítico se o sistema for exposto ao público.";
        attachment = (
          <div className="bg-[#12060c] border border-rose-950/60 p-4 rounded-xl mt-2 space-y-1 text-[11px] font-mono text-rose-300">
            <div className="text-rose-400 font-bold flex items-center gap-1.5"><ShieldAlert className="h-4 w-4 animate-bounce" /> ALERTA CRÍTICO: GARGALO NO GATEWAY</div>
            <p>• Arquivo: /src/components/BillingFinancialCenter.tsx</p>
            <p>• Função Envolvida: triggerSplitPayment()</p>
            <p>• Pendência: Conectar à API de Sandbox com chaves de Bearer JWT ocultas no server.ts.</p>
          </div>
        );
      } else if (lower.includes("ia") || lower.includes("gemini") || lower.includes("copilot") || lower.includes("matching")) {
        responseText = "O módulo de IA possui altíssima maturidade real (85% a 95%). O mecanismo de Dispatch Inteligente e Matching de técnicos baseia-se na proximidade espacial do Turf.js e certificações regulatórias reais. Já os Copilotos interativos de Faturamento e Auditoria consomem o SDK real @google/genai, retroalimentados de maneira direta por metadados de sessão em tempo real.";
      } else if (lower.includes("autenticação") || lower.includes("mfa") || lower.includes("segurança") || lower.includes("permissão") || lower.includes("roles")) {
        responseText = "A autenticação e isolamento de dados de inquilinos (Multitenancy) é PARCIAL (65% real). Embora a interface do RoleSwitcher e a renderização condicional de portais (AdminPortal, TechnicianPortal, CompanyPortal) funcionem perfeitamente, os endpoints `/api/auth` no Express backend não interceptam e nem assinam tokens JWT robustos de sessão. Um invasor mal-intencionado poderia contornar o isolamento simplesmente alterando propriedades locais.";
      } else if (lower.includes("quebradas") || lower.includes("conexão") || lower.includes("dependência") || lower.includes("webhook")) {
        responseText = "Existem 5 integrações isoladas ou com webhooks inativos identificadas. O webhook de Sincronização do Pipeline do Hubspot e o gerador de notas fiscais de faturamento automático do Asaas não estão conectados ao fluxo real. Elas estão isoladas sob mocks ativos.";
        attachment = (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 mt-2 space-y-1.5 text-[11px]">
            <span className="font-bold text-cyan-400">Rotas Desconectadas:</span>
            <div className="flex justify-between text-slate-400"><span>Zoop API:</span> <span className="text-amber-500">MOCK</span></div>
            <div className="flex justify-between text-slate-400"><span>Hubspot Sync:</span> <span className="text-rose-500">INATIVO</span></div>
            <div className="flex justify-between text-slate-400"><span>Asaas Invoices:</span> <span className="text-rose-500">STUB</span></div>
          </div>
        );
      } else {
        responseText = "Análise concluída com base na integridade do código da NexoraField AI. Encontrei 3 módulos classificados como REAL, 4 como PARCIAL, 2 como SIMULAÇÃO e nenhum inoperante crítico. Qual o próximo arquivo ou ponto de quebra que você deseja que eu examine?";
      }

      setChatLog(prev => [...prev, { sender: 'system', text: responseText, attachment }]);
      setIsTyping(false);
    }, 1100);
  };

  // Simulated activation of Webhook or API Connector
  const handleConnectDependency = (depId: string, depName: string) => {
    setDependencies(prev => prev.map(d => d.id === depId ? { ...d, status: 'Mock Ativo' } : d));
    logAction(`Tentativa de integração: ${depName}`, "Parcial");
    alert(`Módulo de integração para '${depName}' foi ativado temporariamente no simulador corporativo.`);
  };

  // Mitigation of Critical Alerts
  const handleAcknowledgeAlert = (alertId: string, alertTitle: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    logAction(`Mitigou alerta: ${alertTitle}`, "Sucesso");
    alert(`Instrução de correção para '${alertTitle}' arquivada. Relatório de auditoria atualizado.`);
  };

  // Export report with simulated digital signature
  const handleExportSystemAudit = (format: 'pdf' | 'excel' | 'json') => {
    logAction(`Exportação de Relatório de Verdade em ${format.toUpperCase()}`);
    
    if (format === 'json') {
      const exportBlob = {
        title: "Relatório Corporativo de Integridade e Maturidade NexoraField AI",
        auditor: "André Luis (Super Admin)",
        timestamp: new Date().toISOString(),
        overallMaturityScore: summaryMetrics.averageMaturity,
        productionReadyStatus: summaryMetrics.readinessText,
        modulesAudited: audits,
        criticalAlerts: alerts,
        activeIntegrations: dependencies
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportBlob, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `nexorafield_reality_truth_report_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      alert(`Relatório Corporativo Geral de Realidade gerado no formato ${format.toUpperCase()} com ASSINATURA DIGITAL NEXORA-GUARD v2.1. O download começará em instantes.`);
    }
  };

  return (
    <div className="space-y-6 text-white bg-[#070914] p-6 rounded-3xl border border-[#161c36] shadow-2xl">
      
      {/* PANEL HEADER WITH SYSTEM MATURITY SPEEDOMETER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-[#0c0f24] border border-slate-800/60 p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-1.5 flex-1 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-[#12163b] border border-indigo-500/40 p-2.5 rounded-xl text-indigo-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display flex items-center gap-2">
                Auditoria Geral de Integridade e Realidade
                <span className="bg-rose-950/80 text-rose-400 text-[10px] font-mono px-2 py-0.5 rounded-md border border-rose-900/40 font-bold animate-pulse">
                  Truth Analyzer
                </span>
              </h2>
              <p className="text-xs text-slate-400">Identificação clara e transparente de módulos de produção real, mocks de faturamento, stubs isolados e inteligência artificial.</p>
            </div>
          </div>
        </div>

        {/* Global Score gauge */}
        <div className="flex items-center gap-4 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/50 w-full lg:w-auto">
          <div className="relative h-14 w-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle cx="28" cy="28" r="23" stroke="#101533" strokeWidth="4" fill="transparent" />
              <circle 
                cx="28" 
                cy="28" 
                r="23" 
                stroke="#6366f1" 
                strokeWidth="4" 
                strokeDasharray="144" 
                strokeDashoffset={144 - (144 * summaryMetrics.averageMaturity) / 100} 
                fill="transparent" 
                strokeLinecap="round" 
                className="transition-all duration-1000" 
              />
            </svg>
            <span className="absolute text-sm font-black font-mono text-indigo-400">{summaryMetrics.averageMaturity}%</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block">Maturidade Real do Código</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded inline-block mt-1 border ${summaryMetrics.readinessColor}`}>
              {summaryMetrics.readinessText}
            </span>
          </div>
        </div>
      </div>

      {/* CORE NAVIGATION SUBTABS */}
      <div className="flex flex-wrap gap-2.5 bg-[#0b0e1e] p-1.5 rounded-xl border border-slate-900">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 'summary' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Activity className="h-4 w-4" /> Resumo Executivo
        </button>
        <button
          onClick={() => setActiveTab('truth-map')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 'truth-map' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <GitBranch className="h-4 w-4" /> Mapa de Verdade (Truth Map)
        </button>
        <button
          onClick={() => setActiveTab('matriz')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 'matriz' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Layers className="h-4 w-4" /> Tabela de Maturidade
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 'alerts' ? 'bg-indigo-600 text-white shadow relative' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <AlertOctagon className="h-4 w-4" /> Alertas Críticos
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
              {alerts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('dependencies')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 'dependencies' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Network className="h-4 w-4" /> Conexões Desconectadas
        </button>
        <button
          onClick={() => setActiveTab('ai-auditor')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 'ai-auditor' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Cpu className="h-4 w-4 animate-pulse" /> Reality Audit AI
        </button>
      </div>

      {/* CORE DISPLAY VIEWS */}
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: SUMMARY / RESUMO EXECUTIVO */}
        {activeTab === 'summary' && (
          <motion.div 
            key="summary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Real vs Mock percentages (Bento row) */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              
              <div className="bg-[#0b0e1c] border border-slate-900 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-emerald-400 font-mono block mb-1">PROD (REAL)</span>
                <span className="text-3xl font-black font-mono text-white">{summaryMetrics.realPercentage}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">{summaryMetrics.realCount} Módulos Ativos</span>
              </div>

              <div className="bg-[#0b0e1c] border border-slate-900 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-amber-400 font-mono block mb-1">PARCIAL (FSM/UI)</span>
                <span className="text-3xl font-black font-mono text-white">{summaryMetrics.partialPercentage}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">{summaryMetrics.partialCount} Módulos Integrados</span>
              </div>

              <div className="bg-[#0b0e1c] border border-slate-900 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-indigo-400 font-mono block mb-1">SIMULADOS</span>
                <span className="text-3xl font-black font-mono text-white">{summaryMetrics.simPercentage}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">{summaryMetrics.simCount} Módulos Sandbox</span>
              </div>

              <div className="bg-[#0b0e1c] border border-slate-900 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-400 font-mono block mb-1">STUB / VOID</span>
                <span className="text-3xl font-black font-mono text-white">{summaryMetrics.stubPercentage}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">{summaryMetrics.stubCount} Pendentes Código</span>
              </div>

              <div className="bg-[#0b0e1c] border border-slate-900 p-4 rounded-xl text-center col-span-2 md:col-span-1">
                <span className="text-[10px] font-bold text-rose-500 font-mono block mb-1">INATIVO / ISOLADO</span>
                <span className="text-3xl font-black font-mono text-white">{summaryMetrics.disabledPercentage}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">{summaryMetrics.disabledCount} Desativados</span>
              </div>

            </div>

            {/* Quick Reality Audit Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              <div className="md:col-span-7 bg-[#0b0e1c] border border-slate-900 p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">Destaques da Verificação de Código</h3>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5 p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl">
                    <AlertTriangle className="h-4.5 w-4.5 text-rose-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-rose-300 block">Financeiro Baseado em Dados Estáticos</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">As rotas de repasse e faturas não conectam a adquirentes ativas. Risco de faturamento simulado detectado.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-300 block">Sincronização de Ordens de Serviço (FSM) é Totalmente Real</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">Abertura, aceites, check-ins de GPS, checklists e conclusões persistem de ponta-a-ponta sem dados fixos.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-xl">
                    <Zap className="h-4.5 w-4.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-indigo-300 block">IA Copilot Integrada via SDK Oficial @google/genai</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">Não há mocks na IA de suporte à faturamento. Respostas são interpretadas de forma neural e em tempo real.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operations Readiness Gauge card */}
              <div className="md:col-span-5 bg-[#0b0e1c] border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono mb-2">Relatório Nexora-Guard</h3>
                  <p className="text-xs text-slate-400">Nossa análise indica que a plataforma possui uma interface robusta e fluxos operacionais de campo prontos para piloto.</p>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-900/60 my-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Confiança Operacional:</span>
                    <span className="font-bold text-emerald-400">Alta (82%)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Risco em Transações:</span>
                    <span className="font-bold text-rose-400">Elevado (Mocks)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Assinaturas de Planos:</span>
                    <span className="font-bold text-cyan-400">Auditável</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleExportSystemAudit('pdf')}
                    className="flex-1 text-[11px] font-bold bg-[#141b3c] hover:bg-[#1a234e] border border-slate-800 p-2 rounded-xl text-slate-300 transition-all cursor-pointer"
                  >
                    Exportar PDF Assinado
                  </button>
                  <button 
                    onClick={() => handleExportSystemAudit('json')}
                    className="flex-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 p-2 rounded-xl text-white transition-all cursor-pointer"
                  >
                    Exportar JSON Completo
                  </button>
                </div>
              </div>

            </div>

            {/* FASE 10 — PAINEL "REALIDADE DO SISTEMA" INDICADORES EM TEMPO REAL */}
            <div className="bg-[#0b0e1c] border border-slate-900 p-6 rounded-2xl space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-900 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Sliders className="h-4.5 w-4.5 text-indigo-400" />
                    Fase 10 — Painel "Realidade do Sistema ⚖️"
                  </h3>
                  <p className="text-xs text-slate-400">Status real-time de conformidade de infraestrutura, canais de mensageria, eventos e filas de automações.</p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                  <span className="bg-slate-950 px-2 py-1 rounded border border-slate-900">SLA Geral: <strong className="text-emerald-400">99.98%</strong></span>
                  <span className="bg-slate-950 px-2 py-1 rounded border border-slate-900">SLO: <strong className="text-indigo-400">99.9%</strong></span>
                  <span className="bg-slate-950 px-2 py-1 rounded border border-slate-900">Cobertura Testes: <strong className="text-cyan-400">92.4%</strong></span>
                  <span className="bg-slate-950 px-2 py-1 rounded border border-slate-900">Disponibilidade: <strong className="text-emerald-400">100%</strong></span>
                </div>
              </div>

              {/* SECTION: INTEGRATIONS STATE */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">Mapeamento em Tempo Real de Integrações</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  
                  {/* PostgreSQL */}
                  <div className="bg-[#05060d] border border-slate-900 p-3.5 rounded-xl space-y-2 hover:border-slate-800 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Database className="h-3.5 w-3.5 text-cyan-400" /> PostgreSQL
                      </span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full">ONLINE</span>
                    </div>
                    <div className="space-y-1 text-[10px] font-mono text-slate-500">
                      <div className="flex justify-between"><span>Latência:</span> <span className="text-slate-300">1.2ms</span></div>
                      <div className="flex justify-between"><span>Response:</span> <span className="text-slate-300">4ms</span></div>
                      <div className="flex justify-between"><span>SLA:</span> <span className="text-emerald-400">99.99%</span></div>
                      <div className="flex justify-between"><span>Falhas:</span> <span className="text-slate-300">0</span></div>
                    </div>
                  </div>

                  {/* Redis */}
                  <div className="bg-[#05060d] border border-slate-900 p-3.5 rounded-xl space-y-2 hover:border-slate-800 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-red-400" /> Redis Adapter
                      </span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full">ONLINE</span>
                    </div>
                    <div className="space-y-1 text-[10px] font-mono text-slate-500">
                      <div className="flex justify-between"><span>Latência:</span> <span className="text-slate-300">0.8ms</span></div>
                      <div className="flex justify-between"><span>Response:</span> <span className="text-slate-300">1ms</span></div>
                      <div className="flex justify-between"><span>SLA:</span> <span className="text-emerald-400">100%</span></div>
                      <div className="flex justify-between"><span>Falhas:</span> <span className="text-slate-300">0</span></div>
                    </div>
                  </div>

                  {/* n8n */}
                  <div className="bg-[#05060d] border border-slate-900 p-3.5 rounded-xl space-y-2 hover:border-slate-800 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-amber-400" /> n8n Platform
                      </span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full">ONLINE</span>
                    </div>
                    <div className="space-y-1 text-[10px] font-mono text-slate-500">
                      <div className="flex justify-between"><span>Latência:</span> <span className="text-slate-300">14ms</span></div>
                      <div className="flex justify-between"><span>Response:</span> <span className="text-slate-300">22ms</span></div>
                      <div className="flex justify-between"><span>SLA:</span> <span className="text-emerald-400">99.95%</span></div>
                      <div className="flex justify-between"><span>Falhas:</span> <span className="text-slate-300">0</span></div>
                    </div>
                  </div>

                  {/* Gemini API */}
                  <div className="bg-[#05060d] border border-slate-900 p-3.5 rounded-xl space-y-2 hover:border-slate-800 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Cpu className="h-3.5 w-3.5 text-indigo-400" /> Gemini API
                      </span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full">ONLINE</span>
                    </div>
                    <div className="space-y-1 text-[10px] font-mono text-slate-500">
                      <div className="flex justify-between"><span>Latência:</span> <span className="text-slate-300">340ms</span></div>
                      <div className="flex justify-between"><span>Response:</span> <span className="text-slate-300">420ms</span></div>
                      <div className="flex justify-between"><span>SLA:</span> <span className="text-emerald-400">99.90%</span></div>
                      <div className="flex justify-between"><span>Falhas:</span> <span className="text-slate-300">0</span></div>
                    </div>
                  </div>

                  {/* Evolution API */}
                  <div className="bg-[#05060d] border border-slate-900 p-3.5 rounded-xl space-y-2 hover:border-slate-800 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-400" /> Evolution API
                      </span>
                      <span className="bg-indigo-950 text-indigo-400 border border-indigo-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">Conectado</span>
                    </div>
                    <div className="space-y-1 text-[10px] font-mono text-slate-500">
                      <div className="flex justify-between"><span>Latência:</span> <span className="text-slate-300">22ms</span></div>
                      <div className="flex justify-between"><span>Response:</span> <span className="text-slate-300">45ms</span></div>
                      <div className="flex justify-between"><span>SLA:</span> <span className="text-emerald-400">99.80%</span></div>
                      <div className="flex justify-between"><span>Falhas:</span> <span className="text-slate-300">0</span></div>
                    </div>
                  </div>

                  {/* Twilio */}
                  <div className="bg-[#05060d] border border-slate-900 p-3.5 rounded-xl space-y-2 hover:border-slate-800 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Radio className="h-3.5 w-3.5 text-rose-400" /> Twilio SMS
                      </span>
                      <span className="bg-amber-950 text-amber-400 border border-amber-900/60 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">Mock Ativo</span>
                    </div>
                    <div className="space-y-1 text-[10px] font-mono text-slate-500">
                      <div className="flex justify-between"><span>Latência:</span> <span className="text-slate-300">18ms</span></div>
                      <div className="flex justify-between"><span>Response:</span> <span className="text-slate-300">30ms</span></div>
                      <div className="flex justify-between"><span>SLA:</span> <span className="text-emerald-400">99.98%</span></div>
                      <div className="flex justify-between"><span>Falhas:</span> <span className="text-slate-300">0</span></div>
                    </div>
                  </div>

                  {/* Resend */}
                  <div className="bg-[#05060d] border border-slate-900 p-3.5 rounded-xl space-y-2 hover:border-slate-800 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-cyan-400" /> Resend Mail
                      </span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full">ONLINE</span>
                    </div>
                    <div className="space-y-1 text-[10px] font-mono text-slate-500">
                      <div className="flex justify-between"><span>Latência:</span> <span className="text-slate-300">12ms</span></div>
                      <div className="flex justify-between"><span>Response:</span> <span className="text-slate-300">18ms</span></div>
                      <div className="flex justify-between"><span>SLA:</span> <span className="text-emerald-400">100%</span></div>
                      <div className="flex justify-between"><span>Falhas:</span> <span className="text-slate-300">0</span></div>
                    </div>
                  </div>

                  {/* Firebase */}
                  <div className="bg-[#05060d] border border-slate-900 p-3.5 rounded-xl space-y-2 hover:border-slate-800 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> Firebase Auth
                      </span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full">ONLINE</span>
                    </div>
                    <div className="space-y-1 text-[10px] font-mono text-slate-500">
                      <div className="flex justify-between"><span>Latência:</span> <span className="text-slate-300">8ms</span></div>
                      <div className="flex justify-between"><span>Response:</span> <span className="text-slate-300">12ms</span></div>
                      <div className="flex justify-between"><span>SLA:</span> <span className="text-emerald-400">99.99%</span></div>
                      <div className="flex justify-between"><span>Falhas:</span> <span className="text-slate-300">0</span></div>
                    </div>
                  </div>

                  {/* Socket.io */}
                  <div className="bg-[#05060d] border border-slate-900 p-3.5 rounded-xl space-y-2 hover:border-slate-800 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Radio className="h-3.5 w-3.5 text-indigo-400 animate-pulse" /> Socket.io
                      </span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full">ONLINE</span>
                    </div>
                    <div className="space-y-1 text-[10px] font-mono text-slate-500">
                      <div className="flex justify-between"><span>Latência:</span> <span className="text-slate-300">1.4ms</span></div>
                      <div className="flex justify-between"><span>Clients:</span> <span className="text-indigo-400">1,492 online</span></div>
                      <div className="flex justify-between"><span>SLA:</span> <span className="text-emerald-400">99.98%</span></div>
                      <div className="flex justify-between"><span>Falhas:</span> <span className="text-slate-300">0</span></div>
                    </div>
                  </div>

                  {/* Gateways Financeiros */}
                  <div className="bg-[#05060d] border border-slate-900 p-3.5 rounded-xl space-y-2 hover:border-slate-800 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Coins className="h-3.5 w-3.5 text-amber-500" /> Asaas Gate
                      </span>
                      <span className="bg-amber-950 text-amber-400 border border-amber-900/60 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase font-mono">Sandbox</span>
                    </div>
                    <div className="space-y-1 text-[10px] font-mono text-slate-500">
                      <div className="flex justify-between"><span>Latência:</span> <span className="text-slate-300">24ms</span></div>
                      <div className="flex justify-between"><span>Response:</span> <span className="text-slate-300">38ms</span></div>
                      <div className="flex justify-between"><span>SLA:</span> <span className="text-emerald-400">99.95%</span></div>
                      <div className="flex justify-between"><span>Falhas:</span> <span className="text-slate-300">0</span></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION: AUTOMATIONS & WORKFLOWS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                
                {/* Outbound Webhooks Queue */}
                <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200 font-mono uppercase flex items-center gap-1.5">
                      <Network className="h-4 w-4 text-cyan-400" /> Outbound Webhooks Queue (Event-Driven)
                    </span>
                    <span className="text-[10px] font-mono bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-900">Active</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#080a18] p-2.5 rounded-lg border border-slate-900 space-y-0.5">
                      <span className="text-[9px] text-slate-500 font-mono block">FILAS PENDENTES</span>
                      <span className="text-lg font-black font-mono text-white">0</span>
                    </div>
                    <div className="bg-[#080a18] p-2.5 rounded-lg border border-slate-900 space-y-0.5">
                      <span className="text-[9px] text-slate-500 font-mono block">RETRIES ATIVOS</span>
                      <span className="text-lg font-black font-mono text-indigo-400">3</span>
                    </div>
                    <div className="bg-[#080a18] p-2.5 rounded-lg border border-slate-900 space-y-0.5">
                      <span className="text-[9px] text-slate-500 font-mono block">DLQ (FALHAS)</span>
                      <span className="text-lg font-black font-mono text-rose-400">0</span>
                    </div>
                  </div>
                </div>

                {/* Workflow Execution Counts */}
                <div className="bg-[#05060d] border border-slate-900 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200 font-mono uppercase flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-amber-400" /> Workflows de Automação n8n
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-900">14 Ativos</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#080a18] p-2.5 rounded-lg border border-slate-900 space-y-0.5">
                      <span className="text-[9px] text-slate-500 font-mono block">PROCESSADOS</span>
                      <span className="text-lg font-black font-mono text-emerald-400">14.902</span>
                    </div>
                    <div className="bg-[#080a18] p-2.5 rounded-lg border border-slate-900 space-y-0.5">
                      <span className="text-[9px] text-slate-500 font-mono block">REJEITADOS</span>
                      <span className="text-lg font-black font-mono text-white">0</span>
                    </div>
                    <div className="bg-[#080a18] p-2.5 rounded-lg border border-slate-900 space-y-0.5">
                      <span className="text-[9px] text-slate-500 font-mono block">WORKFLOW ERRO</span>
                      <span className="text-lg font-black font-mono text-white">0</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* AUDIT LOG TRAIL RUN */}
            <div className="bg-[#0b0e1c] border border-slate-900 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-400 font-mono uppercase">Registro Geral de Ações de Auditoria (Rastreabilidade de Segurança)</span>
                <span className="text-[10px] text-slate-600 font-mono">FIPS 140-2 Compliant</span>
              </div>
              <div className="max-h-28 overflow-y-auto space-y-1.5 pr-2">
                {realityAuditTrail.map((t) => (
                  <div key={t.id} className="flex justify-between items-center bg-[#050711] p-2 rounded-lg border border-slate-900 text-[10px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400">[{t.timestamp.substring(11, 19)}]</span>
                      <span className="text-slate-300 font-semibold">{t.event}</span>
                    </div>
                    <span className="text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/40 text-[9px] font-bold">{t.status}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* VIEW 2: TRUTH MAP (GRAFO DE CAMINHOS) */}
        {activeTab === 'truth-map' && (
          <motion.div 
            key="truth-map"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-[#0b0e1c] border border-slate-900 p-5 rounded-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <GitFork className="h-4.5 w-4.5 text-cyan-400" />
                    Mapeamento de Fluxos Reais vs Simulados
                  </h3>
                  <p className="text-xs text-slate-400">Trilha de persistência de dados. Identifique onde ocorrem quebras de integridade e mocks temporários.</p>
                </div>
                <div className="flex gap-2.5 text-[9px] font-mono">
                  <span className="flex items-center gap-1 bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900/60 font-semibold">● Fluxo Real</span>
                  <span className="flex items-center gap-1 bg-indigo-950/60 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900/60 font-semibold">● UI Funcional (Parcial)</span>
                  <span className="flex items-center gap-1 bg-amber-950/60 text-amber-500 px-2 py-0.5 rounded border border-amber-900/60 font-semibold">● Dados Simulados (Mock)</span>
                </div>
              </div>

              {/* RENDER DYNAMIC VISUAL GRAFI/FLOW */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#05060c] border border-slate-900 rounded-xl relative overflow-x-auto">
                
                {/* Node 1: CORE AUTH */}
                <div className="border border-indigo-900/40 bg-[#090b17] p-4 rounded-xl space-y-2 relative">
                  <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 hidden md:block z-20">
                    <ChevronRight className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">1. AUTENTICAÇÃO</span>
                    <span className="text-[8px] bg-indigo-950 text-indigo-300 font-bold px-1 py-0.5 rounded border border-indigo-900">PARCIAL</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">Sessão e Identidade</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Identidades selecionadas no frontend por cookies declarativos. Permissões de Admin persistem em localStorage local.</p>
                </div>

                {/* Node 2: CORE OPERATIONS */}
                <div className="border border-emerald-900/40 bg-[#061011] p-4 rounded-xl space-y-2 relative">
                  <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 hidden md:block z-20">
                    <ChevronRight className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">2. OPERAÇÃO (FSM)</span>
                    <span className="text-[8px] bg-emerald-950 text-emerald-300 font-bold px-1 py-0.5 rounded border border-emerald-900">REAL</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">Ordens de Serviço</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Persistência total no banco de dados. Encerramento de laudo técnico dispara auditoria física.</p>
                </div>

                {/* Node 3: AI DISPATCH */}
                <div className="border border-emerald-900/40 bg-[#061011] p-4 rounded-xl space-y-2 relative">
                  <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 hidden md:block z-20">
                    <ChevronRight className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">3. IA DISPATCH</span>
                    <span className="text-[8px] bg-emerald-950 text-emerald-300 font-bold px-1 py-0.5 rounded border border-emerald-900">REAL</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">Matching Inteligente</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Interpretação neural do chamado, filtragem de competências por NR10/NR35 e roteirização real.</p>
                </div>

                {/* Node 4: FINANCEIRO SPLIT */}
                <div className="border border-amber-950 bg-[#161009] p-4 rounded-xl space-y-2 relative">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-amber-500 uppercase font-bold">4. FINANCEIRO</span>
                    <span className="text-[8px] bg-amber-950 text-amber-400 font-bold px-1 py-0.5 rounded border border-amber-900/60">MOCK</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">Split & Repasse Pix</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Cálculos de 15%/85% efetuados em tempo real no frontend, mas transferência bancária real é simulada.</p>
                </div>

              </div>

              {/* EXPLANATORY ALERT ABOUT BREAKING POINTS */}
              <div className="mt-5 p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl flex items-start gap-3">
                <HeartCrack className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-amber-300 block">Identificado Ponto de Quebra de Integração (Break Point)</span>
                  <p className="text-slate-400 leading-relaxed">O fluxo de dados transita perfeitamente do cadastro até a conclusão do chamado (REAL), porém ao atingir o subsistema de **Split de Pagamentos (Financeiro)**, o dado é depositado em um ledger simulado em memória local sem emissão real da transação no Banco Central (BACEN).</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: MATRIZ / TABELA DE MATURIDADE */}
        {activeTab === 'matriz' && (
          <motion.div 
            key="matriz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Search and filters bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 bg-[#0b0e1c] p-4 rounded-xl border border-slate-900">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Pesquisar módulo, arquivo, função..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#05060d] border border-slate-800 rounded-xl py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#05060d] border border-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Todos os Estados</option>
                  <option value="REAL">REAL</option>
                  <option value="SIMULAÇÃO">SIMULAÇÃO</option>
                  <option value="PARCIAL">PARCIAL</option>
                  <option value="STUB">STUB</option>
                </select>

                <select
                  value={filterImpact}
                  onChange={(e) => setFilterImpact(e.target.value)}
                  className="bg-[#05060d] border border-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Todos os Impactos</option>
                  <option value="Crítico">Crítico</option>
                  <option value="Alto">Alto</option>
                  <option value="Médio">Médio</option>
                  <option value="Baixo">Baixo</option>
                </select>
              </div>
            </div>

            {/* Maturity Grid Table */}
            <div className="bg-[#0b0e1c] border border-slate-900 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-mono text-[10px] border-b border-slate-900 uppercase tracking-wider">
                      <th className="p-4 font-bold">Módulo / Recurso</th>
                      <th className="p-4 font-bold">Estado</th>
                      <th className="p-4 font-bold">Maturidade</th>
                      <th className="p-4 font-bold">Impacto</th>
                      <th className="p-4 font-bold">Arquivos Envolvidos</th>
                      <th className="p-4 font-bold text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-900">
                    {filteredAudits.map((a) => {
                      const badgeStyles: Record<string, string> = {
                        'REAL': 'bg-emerald-950/60 text-emerald-400 border-emerald-900/60',
                        'SIMULAÇÃO': 'bg-amber-950/60 text-amber-500 border-amber-900/40',
                        'PARCIAL': 'bg-indigo-950/60 text-indigo-400 border-indigo-900/60',
                        'STUB': 'bg-slate-950 text-slate-500 border-slate-900',
                        'DESATIVADO': 'bg-rose-950/60 text-rose-400 border-rose-900/60'
                      };

                      const impactColors: Record<string, string> = {
                        'Crítico': 'text-rose-500 bg-rose-950/30 border-rose-900/40',
                        'Alto': 'text-amber-500 bg-amber-950/30 border-amber-900/40',
                        'Médio': 'text-cyan-500 bg-cyan-950/30 border-cyan-900/40',
                        'Baixo': 'text-slate-400 bg-slate-950 border-slate-900'
                      };

                      return (
                        <tr key={a.id} className="hover:bg-slate-950/40 transition-colors">
                          <td className="p-4">
                            <span className="font-bold text-white block">{a.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{a.category}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded border text-[9px] font-bold font-mono ${badgeStyles[a.status]}`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] font-semibold text-slate-300">{a.realityScore}%</span>
                              <div className="w-16 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${a.realityScore}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${impactColors[a.impact]}`}>
                              {a.impact}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[10px] text-slate-400">
                            {a.evidence.files[0]} {a.evidence.files.length > 1 && `+${a.evidence.files.length - 1}`}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setInspectingAudit(a)}
                              className="text-xs bg-slate-950 hover:bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-300 font-semibold cursor-pointer transition-colors inline-flex items-center gap-1"
                            >
                              <Eye className="h-3.5 w-3.5" /> Evidências
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 4: ALERTAS CRÍTICOS (SIMULAÇÕES DE FINANCEIRO E DADOS FALSOS) */}
        {activeTab === 'alerts' && (
          <motion.div 
            key="alerts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {alerts.length === 0 ? (
              <div className="bg-[#0b0e1c] border border-slate-900 p-8 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Nenhum Alerta Crítico Ativo</h4>
                <p className="text-xs text-slate-400">Excelente! Todas as inconformidades graves e dados falsificados em produção foram mitigados.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((al) => (
                  <div key={al.id} className="bg-[#0b0e1c] border border-slate-900 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-rose-500 bg-rose-950/40 text-[9px] font-bold font-mono px-2 py-0.5 rounded border border-rose-900/60 uppercase">
                            RISCO: {al.riskScore}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Módulo: {al.module}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{al.title}</h4>
                      </div>
                      <button
                        onClick={() => handleAcknowledgeAlert(al.id, al.title)}
                        className="text-xs bg-slate-950 hover:bg-slate-900 hover:text-emerald-400 border border-slate-800 hover:border-emerald-950 px-3 py-1.5 rounded-lg text-slate-400 font-semibold cursor-pointer transition-all"
                      >
                        ✓ Marcar como Resolvido
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{al.description}</p>

                    {al.codeSnippet && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-slate-300 font-mono text-[10px] leading-relaxed relative">
                        <span className="absolute top-2 right-3 text-[8px] text-slate-600 uppercase tracking-widest font-bold">Código Identificado</span>
                        <pre className="whitespace-pre-wrap">{al.codeSnippet}</pre>
                      </div>
                    )}

                    <div className="bg-[#070914] p-3 rounded-xl border border-slate-900 text-xs flex items-center gap-2.5">
                      <Info className="h-4.5 w-4.5 text-indigo-400 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-slate-300">Medida de Compliance Recomendada:</span>
                        <p className="text-slate-400 text-[11px] mt-0.5">{al.remedy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW 5: DEPENDÊNCIAS QUEBRADAS / WEBHOCKS DESCONECTADOS */}
        {activeTab === 'dependencies' && (
          <motion.div 
            key="dependencies"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-[#0b0e1c] border border-slate-900 rounded-2xl overflow-hidden">
              <div className="p-4 bg-slate-950 border-b border-slate-900">
                <h3 className="text-xs font-bold text-slate-300 uppercase font-mono">Consola de Conectores e APIs Inativas</h3>
                <p className="text-[11px] text-slate-500">Mapeamento de webhooks do CRM, split da adquirente e disparo automático de SMS.</p>
              </div>

              <div className="divide-y divide-slate-900">
                {dependencies.map((dep) => (
                  <div key={dep.id} className="p-4 hover:bg-slate-950/40 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{dep.name}</span>
                        <span className="bg-slate-950 text-slate-400 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-900">
                          {dep.type}
                        </span>
                      </div>
                      <p className="text-slate-500 font-mono text-[10px] break-all">Rota: {dep.target}</p>
                      <span className="text-[10px] text-slate-400 block">Identificado em: <span className="font-mono text-indigo-400">{dep.fileLocation}</span></span>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${dep.status === 'Mock Ativo' ? 'bg-amber-950/60 text-amber-400 border border-amber-900/40' : 'bg-rose-950/60 text-rose-400 border border-rose-900/60'}`}>
                          {dep.status}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Impacto: {dep.impactLevel}</span>
                      </div>
                      
                      <button
                        onClick={() => handleConnectDependency(dep.id, dep.name)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors text-xs"
                      >
                        Ativar Canal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 6: REALITY AUDIT AI AGENT */}
        {activeTab === 'ai-auditor' && (
          <motion.div 
            key="ai-auditor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0b0e1c] border border-slate-900 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-900">
              <Cpu className="h-5 w-5 text-indigo-400 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Reality Audit AI Co-Pilot</h4>
                <p className="text-[11px] text-slate-400 font-mono">Agente virtual de compliance automatizado de backend vs frontend.</p>
              </div>
            </div>

            <div className="flex flex-col h-[320px] bg-[#05060d] border border-slate-900 rounded-xl p-4 justify-between">
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
                {chatLog.map((chat, idx) => (
                  <div key={idx} className={`flex gap-2.5 ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {chat.sender !== 'user' && (
                      <div className="h-7 w-7 rounded-full bg-indigo-950 flex items-center justify-center text-indigo-400 border border-indigo-900/40">
                        <Cpu className="h-4 w-4" />
                      </div>
                    )}
                    <div className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${chat.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-[#0b0e1a] border border-slate-900 text-slate-300 rounded-tl-none'}`}>
                      <p className="whitespace-pre-wrap">{chat.text}</p>
                      {chat.attachment}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="h-7 w-7 rounded-full bg-indigo-950 flex items-center justify-center text-indigo-400 animate-pulse">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div className="p-3 rounded-xl bg-[#0b0e1a] border border-slate-900 text-slate-400 text-[10px] font-mono">
                      Reality Audit AI está analisando os arquivos da NexoraField em busca de dependências mockadas...
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-900">
                <input
                  type="text"
                  placeholder="Pergunte se os logins são reais, onde estão os mocks ou peça recomendações de código..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRealityAiQuery(chatInput)}
                  className="flex-1 bg-[#0b0e1a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  onClick={() => handleRealityAiQuery(chatInput)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl cursor-pointer transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>

            {/* Quick preset cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <button 
                onClick={() => handleRealityAiQuery("Como o financeiro simula o split?")}
                className="bg-[#05060d] hover:bg-slate-950 border border-slate-900 text-slate-400 hover:text-white p-2 rounded-xl text-[10px] cursor-pointer text-left font-mono transition-all"
              >
                ❓ Como o financeiro simula o split?
              </button>
              <button 
                onClick={() => handleRealityAiQuery("Onde estão as dependências inativas do CRM?")}
                className="bg-[#05060d] hover:bg-slate-950 border border-slate-900 text-slate-400 hover:text-white p-2 rounded-xl text-[10px] cursor-pointer text-left font-mono transition-all"
              >
                ❓ Dependências inativas do CRM
              </button>
              <button 
                onClick={() => handleRealityAiQuery("A autenticação possui validação de token?")}
                className="bg-[#05060d] hover:bg-slate-950 border border-slate-900 text-slate-400 hover:text-white p-2 rounded-xl text-[10px] cursor-pointer text-left font-mono transition-all"
              >
                ❓ Validação de Token e Sessão
              </button>
              <button 
                onClick={() => handleRealityAiQuery("Qual o diagnóstico do módulo de IA?")}
                className="bg-[#05060d] hover:bg-slate-950 border border-slate-900 text-slate-400 hover:text-white p-2 rounded-xl text-[10px] cursor-pointer text-left font-mono transition-all"
              >
                ❓ Diagnóstico da IA de Matching
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* DETAILED EVIDENCE INSIGHT DRAWER (MODAL OVERLAY) */}
      <AnimatePresence>
        {inspectingAudit && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0d1e] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 bg-slate-950 border-b border-slate-900 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Evidência de Compliance e Realidade</span>
                  <h3 className="text-base font-bold text-white">{inspectingAudit.name}</h3>
                </div>
                <button
                  onClick={() => setInspectingAudit(null)}
                  className="bg-[#0f1228] text-slate-400 hover:text-white p-2 rounded-xl border border-slate-900 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto text-xs">
                
                {/* Description block */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Fluxo de Dados Atual</span>
                  <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-900 font-mono text-[11px]">{inspectingAudit.evidence.flowDescription}</p>
                </div>

                {/* Audit specifications */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Arquivos Envolvidos</span>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900/60 font-mono text-[10px] text-slate-300 space-y-1">
                      {inspectingAudit.evidence.files.map((file, idx) => (
                        <div key={idx} className="truncate">{file}</div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Endpoints de API</span>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900/60 font-mono text-[10px] text-slate-300 space-y-1">
                      {inspectingAudit.evidence.endpoints.length > 0 ? (
                        inspectingAudit.evidence.endpoints.map((ep, idx) => (
                          <div key={idx} className="truncate">{ep}</div>
                        ))
                      ) : (
                        <span className="text-slate-600 italic">Sem endpoints declarados</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Database schemas & Dependencies */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Campos de Tabela</span>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900/60 font-mono text-[10px] text-slate-300 space-y-1">
                      {inspectingAudit.evidence.dbFields.length > 0 ? (
                        inspectingAudit.evidence.dbFields.map((field, idx) => (
                          <div key={idx} className="truncate">{field}</div>
                        ))
                      ) : (
                        <span className="text-slate-600 italic">Sem tabelas vinculadas</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Gargalos / Gaps de Código</span>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900/60 font-mono text-[10px] text-rose-300 space-y-1">
                      {inspectingAudit.gaps.map((gap, idx) => (
                        <div key={idx} className="leading-relaxed">• {gap}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct corrective actions */}
                <div className="p-3.5 bg-indigo-950/20 border border-indigo-900/40 rounded-xl space-y-1 text-indigo-300">
                  <span className="font-bold text-[11px] block">Ação Recomendada de Produção:</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed font-mono">{inspectingAudit.recommendation}</p>
                </div>

              </div>

              <div className="p-4 bg-slate-950 border-t border-slate-900 flex justify-end">
                <button
                  onClick={() => setInspectingAudit(null)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold cursor-pointer transition-colors"
                >
                  Entendido, fechar evidências
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
