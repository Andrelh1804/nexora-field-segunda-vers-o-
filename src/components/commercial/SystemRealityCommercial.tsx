import React, { useState, useEffect } from "react";
import {
  Activity, Users, TrendingUp, DollarSign, Clock, Star, AlertTriangle,
  CheckCircle, Zap, Globe, BarChart2, RefreshCw, ArrowUpRight, Heart,
  Package, Target, Bot, Shield
} from "lucide-react";

interface SystemRealityCommercialProps {
  companies: any[];
  technicians: any[];
  tickets: any[];
  transactions: any[];
  auditLogs: any[];
}

function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
      AO VIVO
    </div>
  );
}

function MetricCard({ title, value, sub, icon: Icon, color = "cyan", trend, alert = false }: any) {
  return (
    <div className={`bg-[#0b0e17] rounded-2xl p-4 border transition-all ${alert ? "border-red-500/40 shadow-red-500/10 shadow-lg" : "border-slate-800"}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">{title}</span>
        <Icon className={`h-4 w-4 text-${color}-400`} />
      </div>
      <div className={`text-xl font-bold font-display text-${color}-400 mb-0.5`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-600 leading-tight">{sub}</div>}
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-1 text-[10px] font-semibold ${trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          <ArrowUpRight className={`h-3 w-3 ${trend < 0 ? "rotate-180" : ""}`} />
          {Math.abs(trend)}% vs ontem
        </div>
      )}
    </div>
  );
}

export default function SystemRealityCommercial({ companies, technicians, tickets, transactions, auditLogs }: SystemRealityCommercialProps) {
  const [tick, setTick] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setLastUpdate(new Date());
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Simulated live metrics that fluctuate
  const newCadastros = 3 + (tick % 4);
  const implantando = 2 + (tick % 3);
  const ativas = companies.length;
  const trials = 4 + (tick % 2);
  const conversaoTrial = 68 + (tick % 8);
  const mrr = 8940 + (tick * 37);
  const arr = mrr * 12;
  const churn = 2.3 - (tick * 0.05 > 0.5 ? 0.5 : tick * 0.05);
  const healthScore = 76 + (tick % 6);
  const avgOnboarding = 42 - (tick % 5);
  const nps = 72 + (tick % 4);
  const activeWorkflows = 14 + (tick % 3);
  const eventsProcessed = 1248 + (tick * 23);
  const riskAlerts = Math.max(0, 3 - (tick % 4 > 2 ? 1 : 0));
  const upsellOps = 5 + (tick % 3);
  const activeTechs = technicians.filter(t => t.status === "online").length;
  const completedTickets = tickets.filter(t => t.status === "Finalizado").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Painel Realidade do Sistema</h2>
          <p className="text-xs text-slate-500 mt-0.5">Comercial & Onboarding — Dados em tempo real</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveBadge />
          <span className="text-[10px] text-slate-600 font-mono">Atualizado: {lastUpdate.toLocaleTimeString("pt-BR")}</span>
          <button onClick={() => { setTick(t => t + 1); setLastUpdate(new Date()); }}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-white hover:border-slate-600 transition-all">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Live pulse bar */}
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full animate-pulse" style={{ width: "100%" }} />
      </div>

      {/* Primary KPIs */}
      <div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">📊 Métricas Principais</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard title="Novos Cadastros (hoje)" value={newCadastros} icon={Users} color="cyan" trend={12} sub="Empresas cadastradas hoje" />
          <MetricCard title="Em Implantação" value={implantando} icon={Zap} color="yellow" sub="Onboardings em andamento" />
          <MetricCard title="Empresas Ativas" value={ativas} icon={CheckCircle} color="emerald" trend={8} sub="Clientes pagantes" />
          <MetricCard title="Trials Ativos" value={trials} icon={Clock} color="indigo" sub="Aguardando conversão" />
        </div>
      </div>

      {/* Revenue metrics */}
      <div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">💰 Receita Recorrente</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard title="Conversão Trial %" value={`${conversaoTrial}%`} icon={Target} color="emerald" trend={5} sub="Trial → Assinante pago" />
          <MetricCard title="MRR Atual" value={`R$ ${mrr.toLocaleString("pt-BR")}`} icon={DollarSign} color="emerald" trend={12} sub="Receita Recorrente Mensal" />
          <MetricCard title="ARR Projetado" value={`R$ ${arr.toLocaleString("pt-BR")}`} icon={TrendingUp} color="cyan" trend={12} sub="Receita Recorrente Anual" />
          <MetricCard title="Churn Rate" value={`${churn.toFixed(1)}%`} icon={AlertTriangle} color="red" trend={-8} alert={churn > 3} sub="Taxa de cancelamento" />
        </div>
      </div>

      {/* Customer success metrics */}
      <div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">❤️ Customer Success</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard title="Health Score Médio" value={`${healthScore}/100`} icon={Heart} color="pink" trend={4} sub="Saúde média dos clientes" />
          <MetricCard title="Tempo Médio Onboarding" value={`${avgOnboarding}min`} icon={Clock} color="cyan" trend={-9} sub="Da ativação ao 1º chamado" />
          <MetricCard title="NPS Score" value={nps} icon={Star} color="yellow" trend={5} sub="Net Promoter Score" />
          <MetricCard title="Adoção Plataforma" value="73%" icon={Activity} color="indigo" sub="Logins últimos 7 dias" />
        </div>
      </div>

      {/* Operations metrics */}
      <div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">⚡ Operações de Campo</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard title="Técnicos Online" value={activeTechs} icon={Users} color="emerald" sub="Disponíveis agora" />
          <MetricCard title="Chamados Concluídos" value={completedTickets} icon={CheckCircle} color="cyan" sub="Total na plataforma" />
          <MetricCard title="IA Despachos" value="Auto" icon={Bot} color="indigo" sub="Matching automático ativo" />
          <MetricCard title="Uptime" value="99.8%" icon={Shield} color="emerald" sub="Disponibilidade plataforma" />
        </div>
      </div>

      {/* Automations & integrations */}
      <div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">🤖 Automações & Integrações</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard title="Workflows Ativos" value={activeWorkflows} icon={Zap} color="yellow" sub="Automações em execução" />
          <MetricCard title="Eventos Processados" value={eventsProcessed.toLocaleString("pt-BR")} icon={Activity} color="cyan" trend={23} sub="Total de eventos hoje" />
          <MetricCard title="Alertas de Risco" value={riskAlerts} icon={AlertTriangle} color={riskAlerts > 2 ? "red" : "yellow"} alert={riskAlerts > 2} sub="Clientes em risco de churn" />
          <MetricCard title="Oportunidades Upsell" value={upsellOps} icon={TrendingUp} color="indigo" sub="Candidatos a upgrade" />
        </div>
      </div>

      {/* Adoção por módulo + Integrações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Package className="h-4 w-4 text-slate-500" /> Adoção por Módulo
          </h3>
          {[
            { name: "IA Despacho Automático", pct: 87, color: "bg-cyan-500" },
            { name: "App Técnico em Campo", pct: 73, color: "bg-emerald-500" },
            { name: "Dashboard Executivo", pct: 61, color: "bg-indigo-500" },
            { name: "Relatório Técnico IA", pct: 54, color: "bg-purple-500" },
            { name: "Detecção de Fraudes", pct: 48, color: "bg-red-500" },
            { name: "API & Webhooks", pct: 32, color: "bg-yellow-500" },
            { name: "Portal do Cliente", pct: 27, color: "bg-orange-500" },
          ].map((m, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">{m.name}</span>
                <span className="text-slate-300 font-semibold">{m.pct}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${m.color} rounded-full transition-all duration-1000`} style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-slate-500" /> Status das Integrações de Cobrança
          </h3>
          {[
            { name: "Asaas (PIX/Boleto)", status: "Operacional", uptime: "99.9%", color: "emerald" },
            { name: "Stripe (Cartão)", status: "Operacional", uptime: "99.7%", color: "emerald" },
            { name: "Efi (Gerencianet)", status: "Configurando", uptime: "—", color: "yellow" },
            { name: "Mercado Pago", status: "Inativo", uptime: "—", color: "slate" },
            { name: "Gemini AI", status: "Operacional", uptime: "99.8%", color: "emerald" },
            { name: "Resend (E-mail)", status: "Operacional", uptime: "100%", color: "emerald" },
            { name: "Evolution API (WhatsApp)", status: "Configurando", uptime: "—", color: "yellow" },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${
                  s.color === "emerald" ? "bg-emerald-400" : s.color === "yellow" ? "bg-yellow-400 animate-pulse" : "bg-slate-600"
                }`} />
                <span className="text-xs text-slate-300">{s.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-500">{s.uptime}</span>
                <span className={`text-[10px] font-semibold text-${s.color}-400`}>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live event feed */}
      <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400" /> Feed de Eventos em Tempo Real
          <LiveBadge />
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {[
            { time: "Agora", event: "Nova empresa cadastrada", detail: "EletroFast Ltda — Trial iniciado (14 dias)", type: "success" },
            { time: "2min", event: "Onboarding concluído", detail: "SolarSol S.A. ativou a plataforma (100%)", type: "success" },
            { time: "5min", event: "Assinatura convertida", detail: "NetFibra SP — Trial → Business (R$ 697/mês)", type: "success" },
            { time: "8min", event: "Alerta de churn detectado", detail: "EletroFast Ltda — Health Score caiu para 45", type: "warn" },
            { time: "12min", event: "Playbook acionado", detail: "E-mail + WhatsApp enviado para EletroFast", type: "info" },
            { time: "15min", event: "NPS recebido", detail: "Telefônica Brasil — Nota 10 ⭐", type: "success" },
            { time: "18min", event: "Upsell identificado", detail: "SolarSol S.A. atingiu 82% do limite do plano", type: "info" },
            { time: "22min", event: "Fatura emitida", detail: "Telefônica Brasil — R$ 1.497,00 via Cartão", type: "info" },
          ].map((ev, i) => (
            <div key={i} className={`flex items-start gap-3 px-3 py-2 rounded-xl text-xs ${
              ev.type === "success" ? "bg-emerald-500/10 border border-emerald-500/10" :
              ev.type === "warn" ? "bg-yellow-500/10 border border-yellow-500/10" :
              "bg-slate-900/60 border border-slate-800/60"
            }`}>
              <span className="text-slate-600 font-mono shrink-0 w-8">{ev.time}</span>
              <div>
                <span className={`font-semibold ${ev.type === "success" ? "text-emerald-400" : ev.type === "warn" ? "text-yellow-400" : "text-slate-300"}`}>{ev.event}</span>
                <span className="text-slate-500 ml-2">{ev.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
