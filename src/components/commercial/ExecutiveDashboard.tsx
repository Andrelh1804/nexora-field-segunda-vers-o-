import React, { useState } from "react";
import {
  TrendingUp, TrendingDown, DollarSign, Users, Activity, BarChart2,
  Target, Clock, Star, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Zap, Shield, Globe, Package, ChevronRight, RefreshCw
} from "lucide-react";

interface ExecutiveDashboardProps {
  companies: any[];
  technicians: any[];
  tickets: any[];
  transactions: any[];
  auditLogs: any[];
}

function KPICard({ title, value, sub, trend, trendUp, color = "cyan", icon: Icon }: any) {
  return (
    <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{title}</span>
        <div className={`w-8 h-8 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center`}>
          <Icon className={`h-4 w-4 text-${color}-400`} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold font-display text-white">{value}</div>
          {sub && <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? "text-emerald-400" : "text-red-400"}`}>
            {trendUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300 font-semibold">{value.toLocaleString("pt-BR")}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
      </div>
    </div>
  );
}

export default function ExecutiveDashboard({ companies, technicians, tickets, transactions, auditLogs }: ExecutiveDashboardProps) {
  const [activeTab, setActiveTab] = useState<"ceo" | "commercial" | "cs" | "financial" | "revops">("ceo");
  const [period, setPeriod] = useState("30d");

  // Computed metrics
  const totalRevenue = transactions.reduce((s, t) => s + (t.totalAmount || 0), 0);
  const platformEarnings = transactions.reduce((s, t) => s + (t.platformEarnings || 0), 0);
  const activeCompanies = companies.length;
  const activeTechs = technicians.filter(t => t.status === "online").length;
  const completedTickets = tickets.filter(t => t.status === "Finalizado").length;
  const avgTicketValue = completedTickets > 0 ? totalRevenue / Math.max(completedTickets, 1) : 0;
  const churnRate = 2.3;
  const npsScore = 72;
  const mrr = platformEarnings * 30 / Math.max(transactions.length, 1) * 12;
  const arr = mrr * 12;
  const cac = 380;
  const ltv = mrr > 0 ? Math.round((mrr / Math.max(companies.length, 1)) * 24) : 4200;
  const payback = Math.round(cac / (ltv / 24));

  const TABS = [
    { id: "ceo", label: "CEO" },
    { id: "commercial", label: "Comercial" },
    { id: "cs", label: "Customer Success" },
    { id: "financial", label: "Financeiro" },
    { id: "revops", label: "RevOps" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Dashboards Executivos</h2>
          <p className="text-xs text-slate-500 mt-0.5">Métricas em tempo real para liderança · Atualizado agora</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
            {["7d", "30d", "90d", "12m"].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${period === p ? "bg-slate-700 text-white" : "text-slate-500 hover:text-white"}`}>
                {p}
              </button>
            ))}
          </div>
          <button className="p-2 rounded-xl border border-slate-800 text-slate-500 hover:text-white hover:border-slate-600 transition-all">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-1 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${activeTab === t.id ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-white"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* CEO Dashboard */}
      {activeTab === "ceo" && (
        <div className="space-y-6">
          {/* Top KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard title="MRR" value={`R$ ${Math.round(mrr).toLocaleString("pt-BR")}`} sub="Receita Recorrente Mensal" trend="+12.4%" trendUp icon={DollarSign} color="emerald" />
            <KPICard title="ARR" value={`R$ ${Math.round(arr).toLocaleString("pt-BR")}`} sub="Receita Recorrente Anual" trend="+12.4%" trendUp icon={TrendingUp} color="cyan" />
            <KPICard title="Churn Rate" value={`${churnRate}%`} sub="Taxa de cancelamento" trend="-0.8%" trendUp icon={TrendingDown} color="red" />
            <KPICard title="NPS Score" value={npsScore} sub="Net Promoter Score" trend="+5pts" trendUp icon={Star} color="yellow" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard title="CAC" value={`R$ ${cac.toLocaleString("pt-BR")}`} sub="Custo de Aquisição" trend="-8%" trendUp icon={Target} color="purple" />
            <KPICard title="LTV" value={`R$ ${ltv.toLocaleString("pt-BR")}`} sub="Lifetime Value" trend="+15%" trendUp icon={Package} color="indigo" />
            <KPICard title="Payback" value={`${payback} meses`} sub="Retorno do CAC" trend="-1.2m" trendUp icon={Clock} color="orange" />
            <KPICard title="Empresas Ativas" value={activeCompanies} sub="Clientes pagantes" trend="+3" trendUp icon={Globe} color="cyan" />
          </div>

          {/* Charts area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue trend */}
            <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-emerald-400" /> Evolução de Receita
              </h3>
              <div className="flex items-end gap-1.5 h-24">
                {[45, 62, 58, 71, 68, 82, 89, 94, 88, 102, 115, 128].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-sm bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all hover:opacity-80"
                      style={{ height: `${(v / 128) * 100}%`, minHeight: "4px" }} title={`R$ ${(v * 1000).toLocaleString("pt-BR")}`} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-slate-600 mt-2">
                {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map(m => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>

            {/* Funnel */}
            <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" /> Funil de Conversão
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Visitantes", value: 8400, pct: 100, color: "bg-slate-600" },
                  { label: "Leads Gerados", value: 1240, pct: 14.8, color: "bg-indigo-500" },
                  { label: "MQLs", value: 420, pct: 5.0, color: "bg-blue-500" },
                  { label: "Demos Agendadas", value: 186, pct: 2.2, color: "bg-cyan-500" },
                  { label: "Trials Ativos", value: 64, pct: 0.8, color: "bg-emerald-500" },
                  { label: "Convertidos", value: 31, pct: 0.4, color: "bg-yellow-500" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 w-28 shrink-0">{s.label}</span>
                    <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                    </div>
                    <span className="text-xs font-mono text-slate-300 w-12 text-right shrink-0">{s.value.toLocaleString("pt-BR")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Adoção por Módulo</h3>
              <div className="space-y-3">
                <MiniBar label="IA Despacho" value={87} max={100} color="bg-cyan-500" />
                <MiniBar label="App Técnico" value={73} max={100} color="bg-emerald-500" />
                <MiniBar label="Relatório IA" value={65} max={100} color="bg-indigo-500" />
                <MiniBar label="Detecção Fraude" value={54} max={100} color="bg-red-500" />
                <MiniBar label="Webhooks" value={38} max={100} color="bg-yellow-500" />
              </div>
            </div>

            <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Performance Operacional</h3>
              <div className="space-y-3">
                <MiniBar label="Chamados Concluídos" value={completedTickets} max={Math.max(tickets.length, 1)} color="bg-emerald-500" />
                <MiniBar label="Técnicos Online" value={activeTechs} max={Math.max(technicians.length, 1)} color="bg-cyan-500" />
                <MiniBar label="Tx de Resolução" value={92} max={100} color="bg-indigo-500" />
                <MiniBar label="Tempo Médio (min)" value={47} max={120} color="bg-orange-500" />
              </div>
            </div>

            <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Alertas Executivos</h3>
              <div className="space-y-2.5">
                {[
                  { type: "success", msg: "MRR cresceu 12.4% vs mês anterior" },
                  { type: "warn", msg: "3 contratos vencem em 30 dias" },
                  { type: "info", msg: "Trial de NetFibra SP expira em 5 dias" },
                  { type: "success", msg: "NPS subiu 5 pontos este mês" },
                  { type: "warn", msg: "Ticket médio caiu 4% — investigar" },
                ].map((a, i) => (
                  <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-xl text-xs ${
                    a.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" :
                    a.type === "warn" ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400" :
                    "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                  }`}>
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    {a.msg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Commercial Dashboard */}
      {activeTab === "commercial" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard title="Pipeline Total" value="R$ 186k" sub="Oportunidades abertas" trend="+22%" trendUp icon={DollarSign} color="indigo" />
            <KPICard title="SQLs Ativos" value={24} sub="Sales Qualified Leads" trend="+6" trendUp icon={Users} color="cyan" />
            <KPICard title="Taxa de Conversão" value="4.8%" sub="Lead → Cliente" trend="+0.6%" trendUp icon={Target} color="emerald" />
            <KPICard title="Ticket Médio" value={`R$ ${Math.round(avgTicketValue).toLocaleString("pt-BR") || "2.480"}`} sub="Valor médio por contrato" trend="-4%" trendUp={false} icon={BarChart2} color="yellow" />
          </div>

          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4">Pipeline por Estágio</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[
                { stage: "Lead", count: 84, value: "R$ 252k", color: "bg-slate-600" },
                { stage: "MQL", count: 32, value: "R$ 96k", color: "bg-indigo-600" },
                { stage: "SQL", count: 24, value: "R$ 72k", color: "bg-blue-600" },
                { stage: "Proposta", count: 18, value: "R$ 54k", color: "bg-cyan-600" },
                { stage: "Negociação", count: 9, value: "R$ 27k", color: "bg-emerald-600" },
                { stage: "Fechado", count: 4, value: "R$ 12k", color: "bg-yellow-600" },
              ].map((s, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center space-y-2">
                  <div className={`w-full h-1.5 rounded-full ${s.color}`} />
                  <div className="text-xs font-bold text-white">{s.count}</div>
                  <div className="text-[10px] text-slate-500">{s.stage}</div>
                  <div className="text-[10px] font-mono text-slate-400">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Customer Success Dashboard */}
      {activeTab === "cs" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard title="Health Score Médio" value="76/100" sub="Saúde geral dos clientes" trend="+4pts" trendUp icon={Activity} color="emerald" />
            <KPICard title="NPS" value={npsScore} sub="Net Promoter Score" trend="+5" trendUp icon={Star} color="yellow" />
            <KPICard title="CSAT" value="4.6/5" sub="Satisfação do cliente" trend="+0.2" trendUp icon={Star} color="cyan" />
            <KPICard title="Risco de Churn" value={`${Math.round(activeCompanies * 0.12)}`} sub="Empresas em alerta" trend="-2" trendUp icon={AlertTriangle} color="red" />
          </div>

          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4">Health Score por Cliente</h3>
            <div className="space-y-3">
              {companies.slice(0, 5).map((c, i) => {
                const score = [82, 67, 91, 45, 73][i % 5];
                const risk = score < 50 ? "Alto" : score < 70 ? "Médio" : "Baixo";
                const riskColor = score < 50 ? "text-red-400" : score < 70 ? "text-yellow-400" : "text-emerald-400";
                return (
                  <div key={i} className="flex items-center gap-4 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {c.name?.[0] || "E"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{c.name || `Empresa ${i + 1}`}</div>
                      <div className="text-[10px] text-slate-500">{c.segment || "Segmento"}</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${score >= 70 ? "bg-emerald-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${score}%` }} />
                      </div>
                      <span className="text-xs font-bold text-white w-8">{score}</span>
                      <span className={`text-[10px] font-semibold ${riskColor} w-12`}>{risk}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Financial Dashboard */}
      {activeTab === "financial" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard title="Receita Total" value={`R$ ${totalRevenue.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`} sub="Todas as transações" trend="+18%" trendUp icon={DollarSign} color="emerald" />
            <KPICard title="Comissão Plataforma" value={`R$ ${platformEarnings.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`} sub="Receita NexoraField" trend="+18%" trendUp icon={TrendingUp} color="cyan" />
            <KPICard title="Repasse Técnicos" value={`R$ ${(totalRevenue - platformEarnings).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`} sub="Total pago aos técnicos" trend="+18%" trendUp icon={Users} color="indigo" />
            <KPICard title="Tx. Comissão Média" value="15%" sub="Comissão sobre chamados" icon={BarChart2} color="yellow" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Métodos de Pagamento</h3>
              <div className="space-y-3">
                {[{ label: "PIX", pct: 68, color: "bg-emerald-500" }, { label: "Cartão de Crédito", pct: 24, color: "bg-blue-500" }, { label: "Boleto Bancário", pct: 8, color: "bg-yellow-500" }].map(m => (
                  <MiniBar key={m.label} label={m.label} value={m.pct} max={100} color={m.color} />
                ))}
              </div>
            </div>

            <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Últimas Transações</h3>
              <div className="space-y-2.5">
                {transactions.slice(0, 4).map((t, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60 last:border-0">
                    <div>
                      <div className="text-slate-300 font-semibold truncate max-w-[160px]">{t.ticketTitle || `Chamado #${i + 1}`}</div>
                      <div className="text-slate-600">{t.companyName || "Empresa"}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-emerald-400 font-bold">R$ {(t.totalAmount || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                      <div className="text-slate-600 text-[10px]">{t.paymentMethod || "PIX"}</div>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && <p className="text-xs text-slate-600 text-center py-4">Nenhuma transação ainda</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RevOps Dashboard */}
      {activeTab === "revops" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard title="Ciclo de Venda" value="18 dias" sub="Lead → Fechamento" trend="-3 dias" trendUp icon={Clock} color="cyan" />
            <KPICard title="Win Rate" value="34%" sub="Propostas convertidas" trend="+5%" trendUp icon={Target} color="emerald" />
            <KPICard title="Expansão MRR" value="R$ 8.4k" sub="Upsell + Cross-sell" trend="+28%" trendUp icon={TrendingUp} color="indigo" />
            <KPICard title="Renovações" value="94%" sub="Taxa de renovação" trend="+2%" trendUp icon={RefreshCw} color="yellow" />
          </div>

          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4">Jornada do Receita (Revenue Motion)</h3>
            <div className="overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {[
                  { stage: "Lead", bg: "bg-slate-800", count: 84 },
                  { stage: "MQL", bg: "bg-indigo-900/50 border border-indigo-800", count: 32 },
                  { stage: "SQL", bg: "bg-blue-900/50 border border-blue-800", count: 24 },
                  { stage: "Oportunidade", bg: "bg-cyan-900/50 border border-cyan-800", count: 18 },
                  { stage: "Proposta", bg: "bg-teal-900/50 border border-teal-800", count: 12 },
                  { stage: "Negociação", bg: "bg-emerald-900/50 border border-emerald-800", count: 9 },
                  { stage: "Contrato", bg: "bg-green-900/50 border border-green-800", count: 6 },
                  { stage: "Onboarding", bg: "bg-yellow-900/50 border border-yellow-800", count: 4 },
                  { stage: "Ativação", bg: "bg-orange-900/50 border border-orange-800", count: 3 },
                  { stage: "Expansão", bg: "bg-red-900/50 border border-red-800", count: 2 },
                  { stage: "Renovação", bg: "bg-purple-900/50 border border-purple-800", count: 1 },
                ].map((s, i, arr) => (
                  <React.Fragment key={i}>
                    <div className={`${s.bg} rounded-xl p-3 text-center w-24 shrink-0`}>
                      <div className="text-lg font-bold text-white">{s.count}</div>
                      <div className="text-[9px] text-slate-400 leading-tight">{s.stage}</div>
                    </div>
                    {i < arr.length - 1 && <div className="flex items-center text-slate-700"><ChevronRight className="h-4 w-4" /></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
