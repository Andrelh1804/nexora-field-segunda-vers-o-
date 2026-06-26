import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, History, Sparkles, AlertTriangle, Activity, FileText, CheckCircle2, 
  TrendingUp, Users, HardHat, DollarSign, Landmark, Copy, Edit3, Search, Filter, 
  Plus, X, Radio, Eye, Download, Database, Clock, Lock, Settings, Layers, ArrowRight,
  Shield, Check, UserCheck, AlertOctagon, Terminal, Server, RefreshCw, Send, Sliders, Laptop, Globe
} from "lucide-react";

// Compliance Audit Log Interface
interface ComplianceAuditLog {
  id: string;
  timestamp: string;
  timezone: string;
  userId: string;
  userName: string;
  userProfile: 'Admin' | 'Company' | 'Tech' | 'System' | 'Comercial';
  userEmail: string;
  sessionId: string;
  ipAddress: string;
  device: string;
  os: string;
  browser: string;
  location: string;
  action: string;
  module: 'Admin' | 'Empresas' | 'Técnicos' | 'Chamados' | 'Financeiro' | 'CRM' | 'IA' | 'Chat' | 'Segurança';
  page: string;
  objectAffected: string;
  objectId?: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  channel: 'Web' | 'API' | 'App' | 'Integration' | 'Webhook';
  latencyMs: number;
  status: 'Sucesso' | 'Falha' | 'Erro';
  riskLevel: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  anomalyDetected?: boolean;
  anomalyType?: string;
  version?: number;
}

// Initial Mock Database
const INITIAL_LOGS_DATABASE: ComplianceAuditLog[] = [
  {
    id: "log-101",
    timestamp: "2026-06-25T11:06:12-03:00",
    timezone: "GMT-3 (São Paulo)",
    userId: "adm-01",
    userName: "André Luis (Super Admin)",
    userProfile: "Admin",
    userEmail: "andre.luishenr91@gmail.com",
    sessionId: "sess-8893djd82",
    ipAddress: "189.120.45.102",
    device: "MacBook Pro M3",
    os: "macOS Sonoma",
    browser: "Chrome v124",
    location: "Campinas, SP",
    action: "Aprovar Split Payment",
    module: "Financeiro",
    page: "Painel Financeiro",
    objectAffected: "Repasse Ordem de Serviço #OS-8890",
    objectId: "OS-8890",
    oldValue: "Retido em garantia (R$ 850,00)",
    newValue: "Repassado para o Técnico Alexandre Silva Santos (R$ 722,50) | Retido Nexora 15% (R$ 127,50)",
    reason: "Fechamento automático pós-homologação de laudo técnico",
    channel: "Web",
    latencyMs: 145,
    status: "Sucesso",
    riskLevel: "Baixo"
  },
  {
    id: "log-102",
    timestamp: "2026-06-25T11:05:01-03:00",
    timezone: "GMT-3 (São Paulo)",
    userId: "system-ai",
    userName: "Nexora IA Dispatcher",
    userProfile: "System",
    userEmail: "ai-dispatcher@nexorafield.com",
    sessionId: "sess-ai-dispatcher-99",
    ipAddress: "104.18.23.11",
    device: "Google Cloud Run Linux Node",
    os: "Linux Debian 11",
    browser: "Node-Fetch v3.3",
    location: "São Paulo, SP",
    action: "Aprovação Automática de Laudo Técnico por IA",
    module: "IA",
    page: "Análise de Evidências",
    objectAffected: "Relatório de Evidências OS-8890",
    objectId: "OS-8890",
    oldValue: "Pendente Aprovação",
    newValue: "Aprovado (Confiança Neural: 98.4%)",
    reason: "Correspondência perfeita de fotos térmicas de inversores e inversor operando com LED verde",
    channel: "API",
    latencyMs: 912,
    status: "Sucesso",
    riskLevel: "Baixo"
  },
  {
    id: "log-103",
    timestamp: "2026-06-25T10:30:15-03:00",
    timezone: "GMT-3 (São Paulo)",
    userId: "tech-1",
    userName: "Alexandre Silva Santos",
    userProfile: "Tech",
    userEmail: "alexandre.tech@gmail.com",
    sessionId: "sess-tech-9281a",
    ipAddress: "177.34.89.21",
    device: "iPhone 15 Pro Max",
    os: "iOS 17.2",
    browser: "Nexora Mobile App v4.5",
    location: "Campinas, SP",
    action: "Finalizar Execução & Enviar Checklist",
    module: "Técnicos",
    page: "Execução de Chamado",
    objectAffected: "Checklist de Ativação OS-8890",
    objectId: "OS-8890",
    oldValue: "Em Andamento",
    newValue: "Concluído & Evidências Enviadas",
    reason: "Serviço encerrado com sucesso em campo",
    channel: "App",
    latencyMs: 230,
    status: "Sucesso",
    riskLevel: "Baixo"
  },
  {
    id: "log-104",
    timestamp: "2026-06-25T09:45:00-03:00",
    timezone: "GMT-3 (São Paulo)",
    userId: "tech-1",
    userName: "Alexandre Silva Santos",
    userProfile: "Tech",
    userEmail: "alexandre.tech@gmail.com",
    sessionId: "sess-tech-9281a",
    ipAddress: "177.34.89.21",
    device: "iPhone 15 Pro Max",
    os: "iOS 17.2",
    browser: "Nexora Mobile App v4.5",
    location: "Campinas, SP",
    action: "Registrar Chegada no Local (Check-in GPS)",
    module: "Técnicos",
    page: "Mapa de Rotas",
    objectAffected: "Status de Deslocamento OS-8890",
    objectId: "OS-8890",
    oldValue: "A Caminho",
    newValue: "Chegou ao Destino (Diferença de GPS: 4.2 metros)",
    reason: "Check-in acionado pelo raio geográfico da OS",
    channel: "App",
    latencyMs: 180,
    status: "Sucesso",
    riskLevel: "Baixo"
  },
  {
    id: "log-105",
    timestamp: "2026-06-25T09:10:33-03:00",
    timezone: "GMT-3 (São Paulo)",
    userId: "tech-1",
    userName: "Alexandre Silva Santos",
    userProfile: "Tech",
    userEmail: "alexandre.tech@gmail.com",
    sessionId: "sess-tech-9281a",
    ipAddress: "177.34.89.21",
    device: "iPhone 15 Pro Max",
    os: "iOS 17.2",
    browser: "Nexora Mobile App v4.5",
    location: "Campinas, SP",
    action: "Aceitar Convite de Chamado",
    module: "Técnicos",
    page: "Convites Disponíveis",
    objectAffected: "Atribuição de Técnico OS-8890",
    objectId: "OS-8890",
    oldValue: "Convites Enviados",
    newValue: "Aceito por Alexandre Santos",
    reason: "Aceite imediato via aplicativo do técnico",
    channel: "App",
    latencyMs: 110,
    status: "Sucesso",
    riskLevel: "Baixo"
  },
  {
    id: "log-106",
    timestamp: "2026-06-25T09:08:10-03:00",
    timezone: "GMT-3 (São Paulo)",
    userId: "system-ai",
    userName: "Nexora IA Matcher",
    userProfile: "System",
    userEmail: "ai-matcher@nexorafield.com",
    sessionId: "sess-ai-matcher-55",
    ipAddress: "104.18.23.12",
    device: "Google Cloud Run Linux Node",
    os: "Linux Debian 11",
    browser: "Node-Fetch v3.3",
    location: "São Paulo, SP",
    action: "Disparar Convites Inteligentes (Matching)",
    module: "IA",
    page: "Motor de Classificação",
    objectAffected: "Fila de Convites OS-8890",
    objectId: "OS-8890",
    oldValue: "Processando IA",
    newValue: "Convites Enviados para Técnicos Alexandre Silva, Mariana Costa e 3 outros",
    reason: "Técnicos compatíveis com categoria Solar, NR10/NR35 e distância < 20km",
    channel: "API",
    latencyMs: 712,
    status: "Sucesso",
    riskLevel: "Baixo"
  },
  {
    id: "log-107",
    timestamp: "2026-06-25T09:05:22-03:00",
    timezone: "GMT-3 (São Paulo)",
    userId: "comp-2",
    userName: "Elisa Guimarães (SolarSol)",
    userProfile: "Company",
    userEmail: "operacoes@solarsol.com.br",
    sessionId: "sess-comp-solarsol-1",
    ipAddress: "200.189.43.12",
    device: "Dell Latitude 5430",
    os: "Windows 11",
    browser: "Edge v121",
    location: "Campinas, SP",
    action: "Criar Nova Ordem de Serviço",
    module: "Chamados",
    page: "Novo Chamado",
    objectAffected: "Título: Manutenção Corretiva de Inversor Solar S.A.",
    objectId: "OS-8890",
    oldValue: "Vazio",
    newValue: "Manutenção Corretiva de Inversor Solar | Categoria Solar | Urgência Alta | Valor R$ 850,00",
    reason: "Abertura emergencial por queda de rendimento do painel solar",
    channel: "Web",
    latencyMs: 310,
    status: "Sucesso",
    riskLevel: "Baixo"
  },
  {
    id: "log-108",
    timestamp: "2026-06-25T09:01:05-03:00",
    timezone: "GMT-3 (São Paulo)",
    userId: "comp-2",
    userName: "Elisa Guimarães (SolarSol)",
    userProfile: "Company",
    userEmail: "operacoes@solarsol.com.br",
    sessionId: "sess-comp-solarsol-1",
    ipAddress: "200.189.43.12",
    device: "Dell Latitude 5430",
    os: "Windows 11",
    browser: "Edge v121",
    location: "Campinas, SP",
    action: "Login na Plataforma",
    module: "Admin",
    page: "Login",
    objectAffected: "Autenticação por MFA",
    objectId: "usr-solarsol-elisa",
    oldValue: "Não Autenticado",
    newValue: "Sessão Ativa com Token JWT & Autenticação de Dois Fatores (MFA)",
    reason: "Início do expediente comercial",
    channel: "Web",
    latencyMs: 420,
    status: "Sucesso",
    riskLevel: "Baixo"
  },
  {
    id: "log-109",
    timestamp: "2026-06-25T03:15:22-03:00",
    timezone: "GMT-3 (São Paulo)",
    userId: "tech-2",
    userName: "Mariana Costa Oliveira",
    userProfile: "Tech",
    userEmail: "mariana.fibra@outlook.com",
    sessionId: "sess-tech-mar-unknown",
    ipAddress: "45.190.221.78",
    device: "Motorola Moto G84",
    os: "Android 13",
    browser: "Chrome Mobile v119",
    location: "Fortaleza, CE",
    action: "Tentativa de login fora do horário habitual",
    module: "Segurança",
    page: "Login",
    objectAffected: "Sessão Técnica Mariana Oliveira",
    objectId: "tech-2",
    oldValue: "Inativo",
    newValue: "Bloqueio Temporário Preventivo",
    reason: "Acesso suspeito de outro estado às 03:15 AM de dispositivo não homologado",
    channel: "App",
    latencyMs: 290,
    status: "Falha",
    riskLevel: "Alto",
    anomalyDetected: true,
    anomalyType: "Acesso em Horário Atípico & Geolocalização Discrepante"
  },
  {
    id: "log-110",
    timestamp: "2026-06-24T18:40:11-03:00",
    timezone: "GMT-3 (São Paulo)",
    userId: "adm-02",
    userName: "Eduardo Camargo (Compliance Manager)",
    userProfile: "Admin",
    userEmail: "eduardo.compliance@nexora.com.br",
    sessionId: "sess-compliance-edu",
    ipAddress: "189.120.45.110",
    device: "MacBook Air",
    os: "macOS Sonoma",
    browser: "Firefox v123",
    location: "Campinas, SP",
    action: "Alteração de Comissão de Plano do Cliente",
    module: "Financeiro",
    page: "Gestão de Comissões",
    objectAffected: "Plano Especial SolarSol Soluções S.A.",
    objectId: "comp-2",
    oldValue: "Comissão Nexora: 15%",
    newValue: "Comissão Nexora Especial: 8.5% (Preço Fixo R$ 25,00 por repasse)",
    reason: "Acordo de parceria comercial homologado pela diretoria (Requer Dupla Aprovação)",
    channel: "Web",
    latencyMs: 190,
    status: "Sucesso",
    riskLevel: "Alto",
    version: 2
  },
  {
    id: "log-111",
    timestamp: "2026-06-24T15:22:45-03:00",
    timezone: "GMT-3 (São Paulo)",
    userId: "tech-3",
    userName: "Bruno Henrique Dias",
    userProfile: "Tech",
    userEmail: "bruno.dias.fibra@gmail.com",
    sessionId: "sess-bruno-repeat",
    ipAddress: "179.44.111.10",
    device: "Samsung Galaxy S23 Ultra",
    os: "Android 14",
    browser: "Nexora Mobile App v4.5",
    location: "São Paulo, SP",
    action: "Alteração Consecutiva de Chave PIX e Dados Bancários",
    module: "Segurança",
    page: "Perfil Financeiro Técnico",
    objectAffected: "Dados de Saque e Chave PIX Bruno Henrique",
    objectId: "tech-3",
    oldValue: "Chave Celular (11999998888) | Itaú Ag: 0200 C/C: 11223-4",
    newValue: "Chave CPF (222.333.444-55) | Banco Inter Ag: 0001 C/C: 998811-0",
    reason: "Usuário atualizou chaves 3 vezes nos últimos 40 minutos",
    channel: "App",
    latencyMs: 340,
    status: "Sucesso",
    riskLevel: "Crítico",
    anomalyDetected: true,
    anomalyType: "Alteração de Dados Bancários Repetidas Vezes"
  },
  {
    id: "log-112",
    timestamp: "2026-06-24T14:10:02-03:00",
    timezone: "GMT-3 (São Paulo)",
    userId: "attacker-ip",
    userName: "Tentativa de Autenticação Bruteforce",
    userProfile: "System",
    userEmail: "unknown@anonymous.org",
    sessionId: "sess-bruteforce-x",
    ipAddress: "203.0.113.1",
    device: "Servidor Virtual Privado (VPS)",
    os: "Linux CentOS",
    browser: "Python Requests library v2.31",
    location: "Zuric, Suíça",
    action: "Tentativa de login com senha inválida",
    module: "Segurança",
    page: "Login Admin Portal",
    objectAffected: "Acesso de Login Administrativo 'andre.luishenr91@gmail.com'",
    objectId: "adm-01",
    oldValue: "Não autenticado",
    newValue: "Endereço IP Temporariamente Bloqueado no Firewall WAF por 24h",
    reason: "5 tentativas de login consecutivas com senhas erradas em menos de 1 minuto",
    channel: "API",
    latencyMs: 95,
    status: "Erro",
    riskLevel: "Crítico",
    anomalyDetected: true,
    anomalyType: "Ataque de Força Bruta Detectado"
  },
  {
    id: "log-113",
    timestamp: "2026-06-24T11:45:10-03:00",
    timezone: "GMT-3 (São Paulo)",
    userId: "sales-01",
    userName: "Carolina Viana (Comercial)",
    userProfile: "Comercial",
    userEmail: "carol.viana@nexora.com.br",
    sessionId: "sess-comercial-carol",
    ipAddress: "189.120.45.105",
    device: "iPad Pro",
    os: "iOS 17.1",
    browser: "Safari v17",
    location: "Campinas, SP",
    action: "Conversão de Lead em Cliente SaaS",
    module: "CRM",
    page: "Pipeline Comercial",
    objectAffected: "Lead: Amazon Secur Tecnologia",
    objectId: "lead-amazon-secur",
    oldValue: "Status: Negociação Avançada",
    newValue: "Status: Cliente Ativo (Plano Start Contratado - R$ 299,00/mês)",
    reason: "Assinatura do contrato digital finalizada via Docusign",
    channel: "Web",
    latencyMs: 160,
    status: "Sucesso",
    riskLevel: "Baixo"
  },
  {
    id: "log-114",
    timestamp: "2026-06-23T16:15:00-03:00",
    timezone: "GMT-3 (São Paulo)",
    userId: "adm-01",
    userName: "André Luis (Super Admin)",
    userProfile: "Admin",
    userEmail: "andre.luishenr91@gmail.com",
    sessionId: "sess-8893djd82",
    ipAddress: "189.120.45.102",
    device: "MacBook Pro M3",
    os: "macOS Sonoma",
    browser: "Chrome v124",
    location: "Campinas, SP",
    action: "Exclusão Lógica de Técnico por Baixo Rendimento",
    module: "Admin",
    page: "Painel de Técnicos",
    objectAffected: "Técnico Rogério Siqueira",
    objectId: "tech-rog-siq",
    oldValue: "Status: Ativo",
    newValue: "Status: Desativado Preventivamente (Exclusão Lógica)",
    reason: "Múltiplas recusas de chamados de urgência e reclamações de clientes",
    channel: "Web",
    latencyMs: 140,
    status: "Sucesso",
    riskLevel: "Médio"
  }
];

export default function AdminCompliancePanel() {
  const [logs, setLogs] = useState<ComplianceAuditLog[]>(INITIAL_LOGS_DATABASE);
  const [search, setSearch] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedRisk, setSelectedRisk] = useState<string>("all");
  const [selectedProfile, setSelectedProfile] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  // Selection for inspection drawer
  const [inspectingLog, setInspectingLog] = useState<ComplianceAuditLog | null>(null);

  // Version Comparison modal / screen
  const [comparingLogId, setComparingLogId] = useState<string | null>("log-110");

  // Anomaly Alerts list
  const [anomalies, setAnomalies] = useState([
    { id: "anom-1", logId: "log-111", title: "Dados Bancários Alterados Repetidamente", target: "Bruno Henrique (Técnico)", risk: "Crítico", time: "Há 1 dia", status: "Aguardando Resposta", code: "ANOM_BANK_MUTATION" },
    { id: "anom-2", logId: "log-109", title: "Acesso Atípico no Ceará às 3h AM", target: "Mariana Costa (Técnica)", risk: "Alto", time: "Hoje, às 03:15", status: "Aguardando Resposta", code: "ANOM_GEO_TIMING" },
    { id: "anom-3", logId: "log-112", title: "Ataque Força Bruta Detectado", target: "Servidor Zurich (IP: 203.0.113.1)", risk: "Crítico", time: "Há 1 dia", status: "Mitigado Automaticamente", code: "ANOM_BRUTEFORCE" }
  ]);

  // AI Auditor Agent State
  const [aiChatInput, setAiChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiChatLog, setAiChatLog] = useState<{ sender: 'user' | 'system'; text: string; attachment?: React.ReactNode }[]>([
    {
      sender: 'system',
      text: "Olá André Luis! Sou o Auditor Neural Nexora Field AI. Analiso a integridade e compliance de todas as rotas de faturamento, split payments, exclusões lógicas, logins do WAF e alteração de parâmetros em tempo real. Qual auditoria deseja que eu realize agora?"
    }
  ]);

  // Alert Config Triggers state
  const [notifConfig, setNotifConfig] = useState({
    panel: true,
    email: true,
    push: false,
    webhook: true,
    webhookUrl: "https://compliance.nexorafield.com/api/v1/alerts-receiver"
  });

  // Log Retention Policies State
  const [retentionPolicies, setRetentionPolicies] = useState({
    audit: "365",
    financial: "1825", // 5 anos
    auth: "180",
    operational: "90"
  });
  const [policySaved, setPolicySaved] = useState(false);

  // Auditor Actions Trail (Auditing the Auditors)
  const [auditorTrail, setAuditorTrail] = useState<{ id: string; timestamp: string; action: string; details: string }[]>([
    { id: "aud-1", timestamp: "2026-06-25T17:35:45-07:00", action: "Consulta de Painel de Auditoria", details: "Módulo carregado na tela do Super Admin" }
  ]);

  // Logs a new Auditor Audit action dynamically
  const logAuditorAction = (action: string, details: string) => {
    const newAuditorEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      details
    };
    setAuditorTrail(prev => [newAuditorEvent, ...prev]);
  };

  // Predefined AI query suggestions
  const aiPresets = [
    { label: "Quem alterou a comissão?", text: "Quem alterou comissão ou plano do cliente recentemente?" },
    { label: "Técnicos com alterações bancárias?", text: "Quais técnicos alteraram dados bancários nos logs?" },
    { label: "Quem acessou a Fortress Segurança?", text: "Quem acessou ou alterou registros da Fortress Segurança?" },
    { label: "Quais comportamentos anômalos?", text: "Mostre quais usuários tiveram comportamento anômalo ou fraudulento detectado por IA." }
  ];

  // AI response engine for Auditor questions
  const handleAiQuestion = (question: string) => {
    if (!question.trim()) return;
    
    // Add user question and log Auditor consultation
    setAiChatLog(prev => [...prev, { sender: 'user', text: question }]);
    logAuditorAction("Consulta IA Auditoria", `Perguntou à IA de compliance: "${question}"`);
    setAiChatInput("");
    setIsAiTyping(true);

    setTimeout(() => {
      let responseText = "";
      let attachment: React.ReactNode = null;
      const lowerQ = question.toLowerCase();

      if (lowerQ.includes("comissão") || lowerQ.includes("comissao") || lowerQ.includes("plano") || lowerQ.includes("alterou a comissão")) {
        responseText = "O usuário Eduardo Camargo (Compliance Manager), através da sessão 'sess-compliance-edu' do IP 189.120.45.110 (Campinas, SP), alterou a comissão da SolarSol Soluções S.A. (plano Gold) de 15% para 8.5% no dia 24/06 às 18:40. O motivo registrado foi: 'Acordo de parceria comercial homologado pela diretoria'. Esta operação requereu dupla homologação no sistema financeiro.";
        attachment = (
          <div className="bg-[#05070f] border border-indigo-950 p-3 rounded-xl mt-1.5 space-y-1 font-mono text-[10px]">
            <div className="text-indigo-400 font-bold uppercase">✓ DADOS DO EVENTO #log-110</div>
            <div className="flex justify-between text-slate-300"><span>Responsável:</span> <span className="text-white">Eduardo Camargo</span></div>
            <div className="flex justify-between text-slate-300"><span>Campo Alterado:</span> <span className="text-rose-400">commission.percentage</span></div>
            <div className="flex justify-between text-slate-300"><span>Anterior:</span> <span className="text-slate-400">15%</span></div>
            <div className="flex justify-between text-slate-300"><span>Novo Valor:</span> <span className="text-emerald-400">8.5%</span></div>
          </div>
        );
      } else if (lowerQ.includes("banco") || lowerQ.includes("dados bancários") || lowerQ.includes("bancários") || lowerQ.includes("pix")) {
        responseText = "Identifiquei 1 ocorrência crítica de alteração bancária suspeita. O técnico Bruno Henrique Dias (ID: tech-3), operando via smartphone Samsung Galaxy S23 sob o IP 179.44.111.10 (São Paulo, SP), realizou três modificações consecutivas de Chave PIX e conta corrente em menos de 40 minutos no dia 24/06 às 15:22. Esta alteração foi classificada com nível de risco CRÍTICO por alta similaridade com ataques de sequestro de conta (account takeover).";
        attachment = (
          <div className="bg-[#12060c] border border-rose-950/60 p-3 rounded-xl mt-1.5 space-y-1 font-mono text-[10px] text-rose-300">
            <div className="text-rose-400 font-bold uppercase">⚠️ ALERTA CRÍTICO - SUSPEITA DE FRAUDE</div>
            <div>Técnico: Bruno Henrique Dias | Chave antiga: Celular | Chave nova: CPF</div>
            <div>Ação sugerida: Bloqueio imediato de pagamentos automáticos na carteira do técnico até confirmação por chamada telefônica biométrica.</div>
          </div>
        );
      } else if (lowerQ.includes("fortress") || lowerQ.includes("segurança")) {
        responseText = "Pesquisando logs relacionados à Fortress Segurança (ID: comp-3): Verifiquei que não há registros recentes de alteração de dados de faturamento ou comissões para a conta. O último log de atividade para esta empresa foi o login automático efetuado pelo portal do cliente via Web no dia 22/06. Deseja que eu gere uma varredura completa nas ordens de serviço da Fortress?";
      } else if (lowerQ.includes("anômalo") || lowerQ.includes("anomalia") || lowerQ.includes("comportamento") || lowerQ.includes("fraude")) {
        responseText = "Rastreei 3 anomalias ativas no log unificado da NexoraField:\n\n1. **Ataque de Força Bruta (Suíça)**: O IP 203.0.113.1 efetuou 5 tentativas de login inválidas consecutivas contra o usuário Super Admin às 14:10 de 24/06. O WAF baniu o IP automaticamente por 24h.\n2. **Logon de Mariana Costa (Ceará)**: Login efetuado às 03:15 AM de um dispositivo Android não homologado, localizado em Fortaleza (CE), enquanto o endereço cadastrado do técnico é em Campinas (SP).\n3. **Múltiplas Alterações de PIX**: Bruno Henrique Dias alterou dados bancários 3 vezes em 40 minutos.";
        attachment = (
          <div className="space-y-1.5 mt-2">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Status de Investigação</span>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-rose-950/40 border border-rose-900/60 p-2 rounded-lg text-center text-[10px]">
                <span className="text-rose-400 font-bold block">1. Bruteforce</span>
                <span className="text-emerald-400">✓ Bloqueado</span>
              </div>
              <div className="bg-amber-950/40 border border-amber-900/60 p-2 rounded-lg text-center text-[10px]">
                <span className="text-amber-400 font-bold block">2. Mariana C.</span>
                <span className="text-slate-400">Aguardando SMS</span>
              </div>
              <div className="bg-rose-950/40 border border-rose-900/60 p-2 rounded-lg text-center text-[10px]">
                <span className="text-rose-400 font-bold block">3. Bruno H.</span>
                <span className="text-rose-400 animate-pulse">Retido</span>
              </div>
            </div>
          </div>
        );
      } else if (lowerQ.includes("os-8890") || lowerQ.includes("chamado") || lowerQ.includes("repasse")) {
        responseText = "O repasse financeiro do chamado OS-8890 foi aprovado manualmente pelo Super Administrador André Luis às 11:06 do dia 25/06, após o processamento da aprovação de laudo técnico pela Inteligência Artificial às 11:05. A transação envolveu um repasse de R$ 722,50 para o Técnico Alexandre Silva Santos e uma receita de comissão de R$ 127,50 (15%) retida pela NexoraField.";
      } else {
        responseText = "Encontrei dados consistentes nos arquivos de auditoria da NexoraField. Não detectei desvios operacionais fora dos logs assinalados. Deseja que eu analise transações financeiras específicas ou confira as assinaturas de planos registradas?";
      }

      setAiChatLog(prev => [...prev, { sender: 'system', text: responseText, attachment }]);
      setIsAiTyping(false);
    }, 1100);
  };

  // Filter logs for master trail
  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      const matchesSearch = 
        l.userName.toLowerCase().includes(search.toLowerCase()) ||
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.objectAffected.toLowerCase().includes(search.toLowerCase()) ||
        l.ipAddress.includes(search) ||
        l.id.toLowerCase().includes(search.toLowerCase()) ||
        (l.objectId && l.objectId.toLowerCase().includes(search.toLowerCase()));

      const matchesModule = selectedModule === "all" || l.module === selectedModule;
      const matchesRisk = selectedRisk === "all" || l.riskLevel === selectedRisk;
      const matchesProfile = selectedProfile === "all" || l.userProfile === selectedProfile;
      const matchesStatus = selectedStatus === "all" || l.status === selectedStatus;

      return matchesSearch && matchesModule && matchesRisk && matchesProfile && matchesStatus;
    });
  }, [logs, search, selectedModule, selectedRisk, selectedProfile, selectedStatus]);

  // Calculations for charts & indicators
  const stats = useMemo(() => {
    const total = logs.length;
    const criticals = logs.filter(l => l.riskLevel === 'Crítico').length;
    const highRisk = logs.filter(l => l.riskLevel === 'Alto').length;
    const anomaliesCount = logs.filter(l => l.anomalyDetected).length;
    const errorsCount = logs.filter(l => l.status === 'Erro' || l.status === 'Falha').length;
    const successRate = total > 0 ? (((total - errorsCount) / total) * 100).toFixed(1) : "100";

    // Count by module
    const moduleCounts: Record<string, number> = {};
    logs.forEach(l => {
      moduleCounts[l.module] = (moduleCounts[l.module] || 0) + 1;
    });

    return {
      total,
      criticals,
      highRisk,
      anomaliesCount,
      successRate,
      moduleCounts
    };
  }, [logs]);

  // Handle Threat Mitigation action
  const handleMitigateThreat = (anomId: string, alertName: string) => {
    setAnomalies(prev => prev.map(a => a.id === anomId ? { ...a, status: "Mitigado" } : a));
    logAuditorAction("Mitigação de Alerta", `Executou ação corretiva para o alerta '${alertName}'`);
    alert(`Risco mitigado com sucesso. Log de intervenção anexado aos metadados de compliance.`);
  };

  // Export utility simulation
  const handleExportData = (format: 'json' | 'csv' | 'pdf') => {
    logAuditorAction(`Exportação de Auditoria`, `Exportou ${filteredLogs.length} logs filtrados no formato ${format.toUpperCase()}`);

    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `nexorafield_audit_compliance_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      alert(`Relatório Corporativo assinado digitalmente no formato ${format.toUpperCase()} gerado com sucesso para download! (${filteredLogs.length} eventos listados).`);
    }
  };

  // Save Policy retention config
  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    setPolicySaved(true);
    logAuditorAction("Configuração de Política", `Alterou política de retenção (Financeiro: ${retentionPolicies.financial} dias, Auditoria: ${retentionPolicies.audit} dias)`);
    setTimeout(() => setPolicySaved(false), 3000);
  };

  // Interactive timeline logs
  const timelineEvents = [
    { time: "09:01", icon: <UserCheck className="h-3.5 w-3.5 text-indigo-400" />, title: "Login com Sucesso", desc: "Elisa Guimarães efetuou login com MFA do IP 200.189.43.12" },
    { time: "09:05", icon: <Plus className="h-3.5 w-3.5 text-cyan-400" />, title: "OS-8890 Aberta", desc: "Chamado emergencial de manutenção Solar no valor de R$ 850,00" },
    { time: "09:08", icon: <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />, title: "IA Classificou & Matching", desc: "Nexora Matcher classificou e enviou convites a técnicos num raio de 12km" },
    { time: "09:10", icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />, title: "Aceito por Técnico", desc: "Téc. Alexandre Silva Santos aceitou o chamado via app" },
    { time: "09:45", icon: <Globe className="h-3.5 w-3.5 text-indigo-400" />, title: "Check-in GPS Efetuado", desc: "Técnico chegou ao local (divergência geográfica: 4.2m)" },
    { time: "10:30", icon: <FileText className="h-3.5 w-3.5 text-amber-400" />, title: "Serviço Finalizado", desc: "Evidências e checklist fotográfico enviados pelo técnico" },
    { time: "11:05", icon: <Sparkles className="h-3.5 w-3.5 text-purple-400" />, title: "IA Aprovou Evidências", desc: "Modelo neural homologou as fotos do inversor (confiança: 98.4%)" },
    { time: "11:06", icon: <DollarSign className="h-3.5 w-3.5 text-emerald-400" />, title: "Split Payment Liquidado", desc: "Repasse de R$ 722,50 liberado ao Técnico | Nexora reteve R$ 127,50" }
  ];

  return (
    <div className="space-y-6 text-white bg-[#060813] p-5 rounded-3xl border border-[#171c35] shadow-2xl">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a0d1d] border border-slate-800/60 p-6 rounded-3xl shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#101432] border border-indigo-500/30 p-2 rounded-xl text-indigo-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display flex items-center gap-2">
                Auditoria, Compliance e Rastreabilidade 
                <span className="bg-emerald-950/80 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-md border border-emerald-900/60 font-semibold animate-pulse">
                  Guard Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">Rastreabilidade completa de exclusões lógicas, repasses, alteração de comissões e logins sob regência da LGPD.</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 text-xs font-semibold w-full md:w-auto">
          <button 
            onClick={() => handleExportData('json')}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-[#0f132c] hover:bg-[#141a3c] border border-slate-800/80 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all"
          >
            <Download className="h-4 w-4 text-cyan-400" /> Exportar JSON
          </button>
          <button 
            onClick={() => handleExportData('csv')}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-[#0f132c] hover:bg-[#141a3c] border border-slate-800/80 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all"
          >
            <FileText className="h-4 w-4 text-emerald-400" /> Exportar CSV (Assinado)
          </button>
        </div>
      </div>

      {/* BENTO GRID DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-5">
        
        {/* INDICATOR 1: TOTAL EVENTS */}
        <div className="md:col-span-2 lg:col-span-3 bg-[#0a0d1d] border border-slate-800/60 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Eventos Auditados</span>
            <Database className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white font-mono">{stats.total}</h3>
            <p className="text-[10px] text-emerald-400 font-mono mt-1">100% de integridade WAF & DB</p>
          </div>
        </div>

        {/* INDICATOR 2: RISK ALERTS */}
        <div className="md:col-span-2 lg:col-span-3 bg-[#0a0d1d] border border-slate-800/60 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Alertas Críticos / Alto</span>
            <AlertTriangle className="h-4 w-4 text-rose-500 animate-pulse" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-rose-400 font-mono">
              {stats.criticals + stats.highRisk}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono mt-1">
              <span className="text-rose-500 font-bold">{stats.criticals} Críticos</span> | <span className="text-amber-500 font-bold">{stats.highRisk} Alto Risco</span>
            </p>
          </div>
        </div>

        {/* INDICATOR 3: SUCCESS RATE */}
        <div className="md:col-span-2 lg:col-span-3 bg-[#0a0d1d] border border-slate-800/60 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Taxa de Sucesso Operacional</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-emerald-400 font-mono">{stats.successRate}%</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Erros de API/WAF isolados</p>
          </div>
        </div>

        {/* INDICATOR 4: RETENTION STATUS */}
        <div className="md:col-span-2 lg:col-span-3 bg-[#0a0d1d] border border-slate-800/60 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Políticas de Retenção</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-white font-mono">{retentionPolicies.financial} Dias</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Logs Financeiros (Retenção Fiscal de 5 anos)</p>
          </div>
        </div>

        {/* VOLUMETRIA POR MÓDULO WIDGET (6 COLS) */}
        <div className="md:col-span-4 lg:col-span-6 bg-[#0a0d1d] border border-slate-800/60 p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Distribuição de Eventos por Módulo</span>
            <span className="text-[9px] font-mono text-indigo-400">Tempo real</span>
          </div>

          <div className="space-y-3.5 py-1">
            {Object.entries(stats.moduleCounts).map(([modName, count]) => {
              const percentage = Math.min(100, ((count as number) / stats.total) * 100);
              const colorMap: Record<string, string> = {
                'Admin': 'bg-indigo-500',
                'Técnicos': 'bg-emerald-500',
                'IA': 'bg-purple-500',
                'Chamados': 'bg-cyan-500',
                'Segurança': 'bg-rose-500',
                'Financeiro': 'bg-amber-500',
                'CRM': 'bg-teal-500'
              };
              const colorClass = colorMap[modName] || 'bg-slate-500';

              return (
                <div key={modName} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">{modName}</span>
                    <span className="font-mono text-slate-400">{count} logs ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${colorClass} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SEVERIDADE DE RISCO INTERACTIVE (6 COLS) */}
        <div className="md:col-span-4 lg:col-span-6 bg-[#0a0d1d] border border-slate-800/60 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Análise de Severidade & Compliance de Dados</span>
              <span className="text-[10px] font-bold bg-rose-950/60 text-rose-400 px-2 py-0.5 rounded border border-rose-900/60">Controle Crítico</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Mapeamento automatizado de acessos, alterações fiscais e uploads suspeitos por classificação de impacto.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            {/* Styled Custom SVG representation of security rings */}
            <div className="relative flex justify-center items-center h-32">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle cx="56" cy="56" r="44" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                <circle cx="56" cy="56" r="44" stroke="#f43f5e" strokeWidth="6" strokeDasharray="276" strokeDashoffset={276 - (276 * (stats.criticals + stats.highRisk)) / stats.total} fill="transparent" strokeLinecap="round" className="transition-all duration-1000" />
                
                <circle cx="56" cy="56" r="32" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                <circle cx="56" cy="56" r="32" stroke="#eab308" strokeWidth="6" strokeDasharray="201" strokeDashoffset={201 - (201 * logs.filter(l => l.riskLevel === 'Médio').length) / stats.total} fill="transparent" strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-lg font-black text-white font-mono">{(((stats.criticals + stats.highRisk) / stats.total) * 100).toFixed(0)}%</span>
                <span className="text-[8px] text-slate-400 uppercase tracking-widest font-mono">Sensível</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block"></span>
                <div className="flex-1 flex justify-between">
                  <span className="text-slate-400">Crítico/Alto:</span>
                  <span className="font-bold text-white font-mono">{stats.criticals + stats.highRisk} logs</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 inline-block"></span>
                <div className="flex-1 flex justify-between">
                  <span className="text-slate-400">Médio:</span>
                  <span className="font-bold text-white font-mono">{logs.filter(l => l.riskLevel === 'Médio').length} logs</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 inline-block"></span>
                <div className="flex-1 flex justify-between">
                  <span className="text-slate-400">Baixo Risco:</span>
                  <span className="font-bold text-white font-mono">{logs.filter(l => l.riskLevel === 'Baixo').length} logs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* NEURAL AUDITOR CO-PILOT AGENT */}
      <div className="bg-[#0b0e1a] border border-[#1d2440] p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
          <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
          <div>
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">Nexora IA Auditor Agent</h3>
            <p className="text-[10px] text-slate-400">Pergunte sobre alterações de comissão, quem alterou chaves PIX ou logins anômalos em linguagem natural.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[330px]">
          
          {/* Chat log log (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full bg-[#05060c] border border-slate-900 rounded-2xl p-4">
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
              {aiChatLog.map((chat, idx) => (
                <div key={idx} className={`flex gap-2.5 ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {chat.sender !== 'user' && (
                    <div className="h-7 w-7 rounded-full bg-indigo-950 flex items-center justify-center text-indigo-400 border border-indigo-900/40">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${chat.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-[#0b0e1a] border border-slate-900 text-slate-300 rounded-tl-none'}`}>
                    <p className="whitespace-pre-wrap">{chat.text}</p>
                    {chat.attachment}
                  </div>
                </div>
              ))}
              
              {isAiTyping && (
                <div className="flex gap-2.5 justify-start">
                  <div className="h-7 w-7 rounded-full bg-indigo-950 flex items-center justify-center text-indigo-400 animate-pulse">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="p-3 rounded-xl bg-[#0b0e1a] border border-slate-900 text-slate-400 text-[10px] font-mono leading-relaxed">
                    Pesquisando tabelas de repasses, logs de WAF e alterações bancárias no compliance...
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-900">
              <input 
                type="text" 
                placeholder="Ex: Quem alterou a comissão da SolarSol?" 
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiQuestion(aiChatInput)}
                className="flex-1 bg-[#0b0e1a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button 
                onClick={() => handleAiQuestion(aiChatInput)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 rounded-xl cursor-pointer transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Preset question chips (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#0b0e1a] border border-slate-900 rounded-2xl p-4">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">Auditorias Rápidas Sugeridas</span>
              <div className="space-y-2.5">
                {aiPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAiQuestion(preset.text)}
                    className="w-full text-left bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-indigo-500/40 text-slate-300 hover:text-white p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <span>{preset.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900/60 text-[10px] text-slate-500 font-mono flex items-center gap-2">
              <Lock className="h-4 w-4 text-indigo-400" />
              <span>Sua consulta é registrada localmente sob o identificador do auditor de sessão André Luis.</span>
            </div>
          </div>

        </div>
      </div>

      {/* VERSIONING HISTORY COMPARATOR & LOG RETENTION POLICIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* INTERACTIVE COMPARATOR (VERSION CONTROL) */}
        <div className="bg-[#0a0d1d] border border-slate-800/60 p-5 rounded-2xl flex flex-col justify-between h-[420px]">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <History className="h-4.5 w-4.5 text-cyan-400" />
                Histórico de Alteração de Parâmetros (Versionamento)
              </span>
              <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-900/60 font-mono px-2 py-0.5 rounded">LGPD Compliant</span>
            </div>
            <p className="text-xs text-slate-400">Verifique a trilha de modificações de preços, comissões especiais ou alteração de chaves fiscais críticas.</p>

            {/* Version Selectors */}
            <div className="mt-4 flex gap-3">
              <button 
                onClick={() => setComparingLogId("log-110")}
                className={`flex-1 text-xs p-2.5 rounded-xl border font-bold cursor-pointer transition-all ${comparingLogId === "log-110" ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
              >
                Comissão SolarSol (v1 x v2)
              </button>
              <button 
                onClick={() => setComparingLogId("log-111")}
                className={`flex-1 text-xs p-2.5 rounded-xl border font-bold cursor-pointer transition-all ${comparingLogId === "log-111" ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
              >
                PIX Bruno Henrique (v1 x v2)
              </button>
            </div>
          </div>

          {/* Differential layout */}
          <div className="flex-1 bg-slate-950 border border-slate-900 rounded-xl p-4 mt-4 flex flex-col justify-between text-xs font-mono">
            {comparingLogId === "log-110" ? (
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] border-b border-slate-900 pb-2 text-slate-400">
                  <span>Autor: Eduardo Camargo</span>
                  <span>Modificação: 24/06 - 18:40</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg">
                    <span className="text-rose-400 font-bold block mb-1">← VERSÃO ANTERIOR (v1)</span>
                    <span className="text-slate-300 block">Comissão Nexora: 15%</span>
                    <span className="text-[10px] text-slate-500 mt-2 block">Aplicada sobre repasse bruto</span>
                  </div>
                  <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg">
                    <span className="text-emerald-400 font-bold block mb-1">→ VERSÃO ATUAL (v2)</span>
                    <span className="text-emerald-400 font-bold block">Comissão Nexora: 8.5%</span>
                    <span className="text-[10px] text-slate-400 mt-2 block">Acordo especial + R$ 25,00 por transação</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  <strong>Justificativa homologada:</strong> Contrato anual assinado de split payment em volume alto da SolarSol. Homologador secundário: Super Admin André Luis.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] border-b border-slate-900 pb-2 text-slate-400">
                  <span>Autor: Bruno Henrique (Técnico)</span>
                  <span>Modificação: 24/06 - 15:22</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg">
                    <span className="text-rose-400 font-bold block mb-1">← VERSÃO ANTERIOR (v1)</span>
                    <span className="text-slate-300 block">Chave PIX: Celular (11999998888)</span>
                    <span className="text-[10px] text-slate-500 mt-2 block">Itaú Unibanco S.A.</span>
                  </div>
                  <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg">
                    <span className="text-emerald-400 font-bold block mb-1">→ VERSÃO ATUAL (v2)</span>
                    <span className="text-emerald-400 font-bold block">Chave PIX: CPF (222.333.444-55)</span>
                    <span className="text-[10px] text-slate-400 mt-2 block">Banco Inter S.A.</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed font-sans text-rose-300 bg-rose-950/10 p-2 rounded border border-rose-900/30">
                  <strong>⚠️ INVESTIGAÇÃO DE SEGURANÇA:</strong> Alterações consecutivas de dados bancários (3 vezes) em menos de 1 hora originaram bloqueio temporário de recebíveis via PIX preventivo.
                </p>
              </div>
            )}

            <div className="border-t border-slate-900 pt-2 flex justify-between text-[10px] text-slate-500">
              <span>Timezone: America/Sao_Paulo</span>
              <span>SHA-256 Hash Assinado digitalmente</span>
            </div>
          </div>
        </div>

        {/* LOG RETENTION POLICIES & CHANNELS CONFIG */}
        <div className="bg-[#0a0d1d] border border-slate-800/60 p-5 rounded-2xl flex flex-col justify-between h-[420px]">
          <div>
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2 mb-3">
              <Sliders className="h-4.5 w-4.5 text-indigo-400" />
              Políticas de Retenção de Logs & Canais de Alerta
            </h3>
            <p className="text-xs text-slate-400">Configure os prazos de armazenamento legal para relatórios fiscais e canais automáticos para despacho de incidentes.</p>

            <form onSubmit={handleSavePolicy} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">RETENÇÃO AUDITORIA (Dias)</label>
                  <select 
                    value={retentionPolicies.audit} 
                    onChange={(e) => setRetentionPolicies({ ...retentionPolicies, audit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 p-2 rounded-xl text-white font-mono"
                  >
                    <option value="90">90 Dias</option>
                    <option value="180">180 Dias</option>
                    <option value="365">1 Ano (365 Dias)</option>
                    <option value="730">2 Anos (730 Dias)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">LOGS FINANCEIROS (Dias)</label>
                  <select 
                    value={retentionPolicies.financial}
                    onChange={(e) => setRetentionPolicies({ ...retentionPolicies, financial: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 p-2 rounded-xl text-white font-mono"
                  >
                    <option value="365">1 Ano</option>
                    <option value="1095">3 Anos</option>
                    <option value="1825">5 Anos (Exigência Fiscal)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-900 pt-3 space-y-2">
                <span className="text-[10px] font-bold font-mono uppercase text-slate-500 block">Canais de Alerta de Segurança</span>
                
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <label className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-900/60 cursor-pointer">
                    <input type="checkbox" checked={notifConfig.panel} onChange={(e) => setNotifConfig({ ...notifConfig, panel: e.target.checked })} />
                    <span>Notificar Painel</span>
                  </label>
                  <label className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-900/60 cursor-pointer">
                    <input type="checkbox" checked={notifConfig.email} onChange={(e) => setNotifConfig({ ...notifConfig, email: e.target.checked })} />
                    <span>E-mail Compliance</span>
                  </label>
                  <label className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-900/60 cursor-pointer">
                    <input type="checkbox" checked={notifConfig.push} onChange={(e) => setNotifConfig({ ...notifConfig, push: e.target.checked })} />
                    <span>Push Notificação</span>
                  </label>
                  <label className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-900/60 cursor-pointer">
                    <input type="checkbox" checked={notifConfig.webhook} onChange={(e) => setNotifConfig({ ...notifConfig, webhook: e.target.checked })} />
                    <span>Acionar Webhook</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <input 
                  type="text" 
                  value={notifConfig.webhookUrl}
                  onChange={(e) => setNotifConfig({ ...notifConfig, webhookUrl: e.target.value })}
                  placeholder="URL do Webhook"
                  className="w-full bg-slate-950 border border-slate-850 p-2 rounded-xl text-[10px] text-slate-400 font-mono"
                  disabled={!notifConfig.webhook}
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2 rounded-xl cursor-pointer transition-colors">
                  Salvar Políticas
                </button>
              </div>
            </form>
          </div>

          {policySaved && (
            <div className="bg-emerald-950/40 border border-emerald-900/60 p-2.5 rounded-xl text-center text-xs text-emerald-400 font-mono">
              ✓ Parâmetros de retenção e canais de incidentes salvos com sucesso.
            </div>
          )}
        </div>

      </div>

      {/* ANOMALY DETECTION & THREAT MITIGATION PANELS */}
      <div className="bg-[#0b0e1a] border border-[#1d2440] p-6 rounded-3xl space-y-4">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <AlertOctagon className="h-5 w-5 text-rose-500 animate-pulse" />
          Módulo de Detecção de Anomalias & Mitigação de Riscos por IA
        </h3>
        <p className="text-xs text-slate-400">Modelos neurais monitoram sessões simultâneas, saltos de IP, mudanças bancárias excessivas e rejeições sucessivas para mitigar incidentes.</p>

        <div className="space-y-3 pt-2">
          {anomalies.map(anom => (
            <div key={anom.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${anom.risk === 'Crítico' ? 'bg-rose-950 text-rose-400 border-rose-900/60' : 'bg-amber-950 text-amber-400 border-amber-900/60'}`}>
                    {anom.risk}
                  </span>
                  <span className="font-bold text-white">{anom.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Código: {anom.code}</span>
                </div>
                <p className="text-slate-300">Alvo suspeito: <strong className="text-white">{anom.target}</strong> | Detectado: {anom.time}</p>
                <span className="text-[10px] text-slate-500 block">Status Atual: <span className={anom.status.includes('Mitigado') ? 'text-emerald-400' : 'text-amber-400 animate-pulse font-bold'}>{anom.status}</span></span>
              </div>

              {anom.status === "Aguardando Resposta" && (
                <div className="flex gap-2 text-[11px] font-bold w-full sm:w-auto mt-2 sm:mt-0">
                  <button 
                    onClick={() => {
                      setAnomalies(prev => prev.filter(a => a.id !== anom.id));
                      logAuditorAction("Descarte de Alerta", `Descartou alerta falso positivo '${anom.title}'`);
                    }}
                    className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-850 px-3 py-1.5 rounded-xl cursor-pointer text-center"
                  >
                    Falso Positivo
                  </button>
                  <button 
                    onClick={() => handleMitigateThreat(anom.id, anom.title)}
                    className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-500 text-white px-4 py-1.5 rounded-xl cursor-pointer text-center"
                  >
                    Mitigar Risco
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* OPERATIONS TIMELINE */}
      <div className="bg-[#0a0d1d] border border-slate-800/60 p-5 rounded-2xl">
        <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 block mb-4">Trilha de Rastreabilidade Operacional em Tempo Real (Timeline)</span>
        
        {/* Horizontal scroll timeline on large, stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-8 gap-4 pt-1">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="relative bg-slate-950 p-3 rounded-xl border border-slate-900 text-[11px] flex flex-col justify-between h-28 hover:border-indigo-500/30 transition-all">
              <div>
                <div className="flex justify-between items-center text-[10px] text-indigo-400 font-mono mb-1.5">
                  <span>{evt.time}</span>
                  <span>{evt.icon}</span>
                </div>
                <strong className="text-white block text-xs line-clamp-1">{evt.title}</strong>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-3 leading-tight">{evt.desc}</p>
              </div>

              {idx < timelineEvents.length - 1 && (
                <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-slate-700 bg-slate-950 p-0.5 rounded-full border border-slate-900">
                  <ArrowRight className="h-3 w-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MASTER LOG TRAIL DATA */}
      <div className="bg-[#0a0d1d] border border-slate-800/60 p-6 rounded-3xl space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 className="font-bold text-white text-base">Trilha Geral de Auditoria e Logs de Rastreabilidade</h3>
            <p className="text-xs text-slate-400">Total de {filteredLogs.length} eventos encontrados na busca.</p>
          </div>
          
          <div className="flex gap-2 flex-wrap w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 lg:w-60 min-w-[200px]">
              <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Pesquisar por IP, Usuário, OS..." 
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  logAuditorAction("Filtragem de Logs", `Pesquisou por palavra-chave: "${e.target.value}"`);
                }}
                className="w-full text-xs p-2.5 pl-9 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-indigo-500 text-white"
              />
            </div>

            {/* Filter Module */}
            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                logAuditorAction("Filtragem Módulo", `Filtrou por módulo: ${e.target.value}`);
              }}
              className="text-xs bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none"
            >
              <option value="all">Módulos (Todos)</option>
              <option value="Admin">Admin</option>
              <option value="Empresas">Empresas</option>
              <option value="Técnicos">Técnicos</option>
              <option value="Chamados">Chamados</option>
              <option value="Financeiro">Financeiro</option>
              <option value="CRM">CRM</option>
              <option value="IA">IA</option>
              <option value="Chat">Chat</option>
              <option value="Segurança">Segurança</option>
            </select>

            {/* Filter Risk */}
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value);
                logAuditorAction("Filtragem Risco", `Filtrou por risco: ${e.target.value}`);
              }}
              className="text-xs bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none"
            >
              <option value="all">Risco (Todos)</option>
              <option value="Baixo">Baixo</option>
              <option value="Médio">Médio</option>
              <option value="Alto">Alto</option>
              <option value="Crítico">Crítico</option>
            </select>

            {/* Filter Profile */}
            <select
              value={selectedProfile}
              onChange={(e) => {
                setSelectedProfile(e.target.value);
                logAuditorAction("Filtragem Perfil", `Filtrou por perfil: ${e.target.value}`);
              }}
              className="text-xs bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none"
            >
              <option value="all">Perfil (Todos)</option>
              <option value="Admin">Admin</option>
              <option value="Company">Company</option>
              <option value="Tech">Tech</option>
              <option value="System">System</option>
              <option value="Comercial">Comercial</option>
            </select>

            <button 
              onClick={() => {
                setSearch("");
                setSelectedModule("all");
                setSelectedRisk("all");
                setSelectedProfile("all");
                setSelectedStatus("all");
                logAuditorAction("Limpeza de Filtros", "Redefiniu todos os parâmetros de busca");
              }}
              className="text-xs bg-slate-900 border border-slate-800 px-3 py-2.5 rounded-xl cursor-pointer text-slate-400 hover:text-white"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* LOGS TABLE TRAIL */}
        <div className="overflow-x-auto rounded-xl border border-slate-850">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#060813] text-slate-400 font-mono border-b border-slate-850">
                <th className="p-3">Data & Hora</th>
                <th className="p-3">Módulo</th>
                <th className="p-3">Usuário / Perfil</th>
                <th className="p-3">Ação Executada</th>
                <th className="p-3">IP / Localização</th>
                <th className="p-3">Risco</th>
                <th className="p-3">Canal</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 bg-slate-950/20 text-slate-300 font-mono">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3">
                    <span className="text-[11px] block text-white">{new Date(log.timestamp).toLocaleDateString('pt-BR')}</span>
                    <span className="text-[9px] text-slate-500 block">{new Date(log.timestamp).toLocaleTimeString('pt-BR')}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.module === 'Financeiro' ? 'bg-amber-950/60 text-amber-400 border border-amber-900/30' :
                      log.module === 'IA' ? 'bg-purple-950/60 text-purple-400 border border-purple-900/30' :
                      log.module === 'Segurança' ? 'bg-rose-950/60 text-rose-400 border border-rose-900/30' :
                      'bg-slate-900 text-slate-400'
                    }`}>
                      {log.module}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-slate-200 block text-[11px] font-sans">{log.userName}</span>
                    <span className="text-[9px] text-slate-500 block">{log.userProfile} | {log.userEmail}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-slate-200 block text-[11px] font-sans">{log.action}</span>
                    <span className="text-[10px] text-slate-400 block max-w-xs truncate">{log.objectAffected}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-slate-300 block text-[11px]">{log.ipAddress}</span>
                    <span className="text-[9px] text-slate-500 block font-sans">{log.location}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      log.riskLevel === 'Crítico' ? 'bg-rose-950 text-rose-400 animate-pulse border border-rose-900' :
                      log.riskLevel === 'Alto' ? 'bg-amber-950 text-amber-400 border border-amber-900/60' :
                      log.riskLevel === 'Médio' ? 'bg-yellow-950 text-yellow-300 border border-yellow-900/40' :
                      'bg-slate-900 text-slate-400'
                    }`}>
                      {log.riskLevel}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] text-slate-400">{log.channel}</span>
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => {
                        setInspectingLog(log);
                        logAuditorAction("Inspeção de Payload", `Inspecionou os metadados brutos do evento ${log.id}`);
                      }}
                      className="px-2 py-1 bg-slate-900 hover:bg-[#141a3c] border border-slate-800 text-slate-300 hover:text-indigo-400 rounded-lg cursor-pointer transition-colors"
                    >
                      Inspecionar
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-sans text-xs">
                    Nenhum registro de compliance correspondente aos filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AUDIT THE AUDITORS - REAL-TIME TRACKING LIST */}
      <div className="bg-[#05060d] border border-slate-900 p-5 rounded-2xl">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-emerald-400" />
            Auditoria da Auditoria (Auditing the Auditors)
          </span>
          <span className="text-[8px] font-mono text-slate-500">Exigência de Rastreamento LGPD Secundário</span>
        </div>
        <p className="text-[10px] text-slate-500 mb-3">Toda ação executada pelo Auditor nesta tela é registrada de forma imutável para evitar adulteração de relatórios.</p>

        <div className="space-y-1.5 h-24 overflow-y-auto pr-1">
          {auditorTrail.map((at, idx) => (
            <div key={at.id} className="flex justify-between items-center text-[10px] font-mono bg-slate-950 p-2 rounded border border-slate-900/50 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>Super Admin [André Luis]: <strong>{at.action}</strong> - {at.details}</span>
              </div>
              <span className="text-[9px] text-slate-600">{new Date(at.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* INSPECTION PAYLOAD DRAWER / MODAL */}
      <AnimatePresence>
        {inspectingLog && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-[#0a0d1d] border border-[#1d2440] text-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4.5 w-4.5 text-indigo-400" />
                  <h3 className="font-bold text-sm font-mono text-white">Inspeção Detalhada de Metadados JSON — ID: {inspectingLog.id}</h3>
                </div>
                <button 
                  onClick={() => setInspectingLog(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Bento styled payload drawer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                
                {/* General */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Informações de Sessão</span>
                  <div className="flex justify-between"><span>Usuário:</span> <span className="text-white">{inspectingLog.userName}</span></div>
                  <div className="flex justify-between"><span>Perfil:</span> <span className="text-white">{inspectingLog.userProfile}</span></div>
                  <div className="flex justify-between"><span>E-mail:</span> <span className="text-slate-300">{inspectingLog.userEmail}</span></div>
                  <div className="flex justify-between"><span>Sessão:</span> <span className="text-cyan-400">{inspectingLog.sessionId}</span></div>
                </div>

                {/* Technical Environment */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Ambiente Técnico</span>
                  <div className="flex justify-between"><span>Navegador:</span> <span className="text-slate-300">{inspectingLog.browser}</span></div>
                  <div className="flex justify-between"><span>S.O.:</span> <span className="text-slate-300">{inspectingLog.os}</span></div>
                  <div className="flex justify-between"><span>Dispositivo:</span> <span className="text-slate-300">{inspectingLog.device}</span></div>
                  <div className="flex justify-between"><span>Timezone:</span> <span className="text-slate-400">{inspectingLog.timezone}</span></div>
                </div>

                {/* Execution values */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 space-y-1 sm:col-span-2">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Valores Transacionados & Auditáveis</span>
                  <div className="flex justify-between"><span>Módulo:</span> <span className="text-indigo-400">{inspectingLog.module}</span></div>
                  <div className="flex justify-between"><span>Objeto Afetado:</span> <span className="text-amber-400 font-sans">{inspectingLog.objectAffected}</span></div>
                  {inspectingLog.oldValue && (
                    <div className="flex flex-col pt-1.5 border-t border-slate-900/60 mt-1">
                      <span className="text-rose-400 text-[10px] font-bold">← VALOR ANTERIOR:</span>
                      <span className="text-slate-300 p-1.5 bg-slate-900 rounded block mt-0.5 whitespace-pre-wrap">{inspectingLog.oldValue}</span>
                    </div>
                  )}
                  {inspectingLog.newValue && (
                    <div className="flex flex-col pt-1.5">
                      <span className="text-emerald-400 text-[10px] font-bold">→ VALOR NOVO:</span>
                      <span className="text-slate-300 p-1.5 bg-slate-900 rounded block mt-0.5 whitespace-pre-wrap">{inspectingLog.newValue}</span>
                    </div>
                  )}
                </div>

                {/* Execution details */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 space-y-1 sm:col-span-2">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold font-mono">Performance & Resultado de Segurança</span>
                  <div className="flex justify-between"><span>Canal:</span> <span className="text-white">{inspectingLog.channel}</span></div>
                  <div className="flex justify-between"><span>Tempo Execução:</span> <span className="text-cyan-400">{inspectingLog.latencyMs} ms</span></div>
                  <div className="flex justify-between"><span>Geolocalização IP:</span> <span className="text-indigo-300">{inspectingLog.location} ({inspectingLog.ipAddress})</span></div>
                  <div className="flex justify-between"><span>Resultado:</span> <span className="text-emerald-400">{inspectingLog.status}</span></div>
                  {inspectingLog.reason && (
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-900/60 font-sans leading-relaxed">
                      <strong>Motivo/Justificativa:</strong> {inspectingLog.reason}
                    </div>
                  )}
                </div>

              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-900 text-xs">
                <span className="text-slate-500 font-mono text-[9px]">Código criptografado SHA-256 de auditoria inalterável (Block-hash unificado)</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(inspectingLog, null, 2));
                    alert("Payload JSON copiado para a área de transferência!");
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1 font-sans"
                >
                  <Copy className="h-3.5 w-3.5" /> Copiar Metadados
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
