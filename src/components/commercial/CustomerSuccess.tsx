import React, { useState } from "react";
import {
  Heart, AlertTriangle, Star, TrendingUp, TrendingDown, Activity,
  MessageSquare, CheckCircle, Clock, Users, Zap, Target, ChevronRight,
  Bot, Send, BarChart2, Plus, RefreshCw, Bell
} from "lucide-react";

interface CustomerSuccessProps {
  companies: any[];
  tickets: any[];
  transactions: any[];
}

const PLAYBOOKS = [
  { name: "Alerta de Churn", trigger: "Health Score < 40", action: "E-mail + WhatsApp automático + Reunião agendada", status: "Ativo" },
  { name: "Onboarding Passivo", trigger: "Trial > 7 dias sem 1º chamado", action: "Sequência de e-mails + Convite para demo", status: "Ativo" },
  { name: "Upsell Trigger", trigger: "Uso > 80% do limite do plano", action: "Notificação de upgrade + Proposta automática", status: "Ativo" },
  { name: "Renovação Antecipada", trigger: "30 dias antes do vencimento", action: "Proposta de renovação com desconto de fidelidade", status: "Ativo" },
  { name: "NPS Baixo", trigger: "NPS < 6", action: "Contato imediato do CSM + Pesquisa de causa raiz", status: "Ativo" },
  { name: "Inatividade", trigger: "Sem login há 14 dias", action: "E-mail de reengajamento + Novidades da plataforma", status: "Pausado" },
];

const NPS_DATA = [
  { label: "Promotores (9-10)", count: 18, pct: 58, color: "bg-emerald-500" },
  { label: "Neutros (7-8)", count: 9, pct: 29, color: "bg-yellow-500" },
  { label: "Detratores (0-6)", count: 4, pct: 13, color: "bg-red-500" },
];

export default function CustomerSuccess({ companies, tickets, transactions }: CustomerSuccessProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "health" | "nps" | "playbooks" | "alerts">("overview");
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [npsFilter, setNpsFilter] = useState<"all" | "promoters" | "detractors">("all");

  const healthScores = companies.map((c, i) => ({
    ...c,
    health: [82, 67, 91, 45, 73, 88, 56, 79][i % 8],
    lastActivity: ["2h atrás", "1d atrás", "5min atrás", "3d atrás", "30min atrás", "1h atrás", "5d atrás", "2h atrás"][i % 8],
    ticketCount: tickets.filter(t => t.companyId === c.id).length || (i + 1) * 3,
    nps: [9, 7, 10, 5, 8, 9, 6, 7][i % 8],
    plan: ["Starter", "Business", "Enterprise", "Business", "Starter", "Enterprise", "Business", "Starter"][i % 8],
    risk: [false, false, false, true, false, false, true, false][i % 8],
  }));

  const avgHealth = Math.round(healthScores.reduce((s, c) => s + c.health, 0) / Math.max(healthScores.length, 1));
  const riskCount = healthScores.filter(c => c.health < 60).length;
  const npsScore = 72;

  const TABS = [
    { id: "overview", label: "Visão Geral" },
    { id: "health", label: "Health Scores" },
    { id: "nps", label: "NPS / CSAT" },
    { id: "playbooks", label: "Playbooks" },
    { id: "alerts", label: "Alertas" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Customer Success</h2>
          <p className="text-xs text-slate-500 mt-0.5">Saúde, engajamento e retenção de clientes em tempo real</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all">
          <RefreshCw className="h-3.5 w-3.5" /> Atualizar Scores
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-1 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${activeTab === t.id ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-white"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Health Score Médio", value: `${avgHealth}/100`, color: avgHealth >= 70 ? "text-emerald-400" : avgHealth >= 50 ? "text-yellow-400" : "text-red-400", icon: Heart, sub: "Saúde média dos clientes" },
              { title: "Em Risco de Churn", value: riskCount, color: "text-red-400", icon: AlertTriangle, sub: "Score < 60 pontos" },
              { title: "NPS Global", value: npsScore, color: "text-yellow-400", icon: Star, sub: "Net Promoter Score" },
              { title: "Engajamento", value: "73%", color: "text-cyan-400", icon: Activity, sub: "Logins nos últimos 7 dias" },
            ].map((k, i) => {
              const Icon = k.icon;
              return (
                <div key={i} className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{k.title}</span>
                    <Icon className={`h-4 w-4 ${k.color}`} />
                  </div>
                  <div className={`text-2xl font-bold font-display ${k.color}`}>{k.value}</div>
                  <div className="text-[10px] text-slate-600">{k.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Timeline alerts */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-yellow-400" /> Alertas Recentes de CS</h3>
            <div className="space-y-3">
              {[
                { type: "danger", company: "NetFibra SP", msg: "Health score caiu de 68 para 45. Último login há 3 dias.", time: "30min atrás" },
                { type: "warn", company: "SolarSol S.A.", msg: "Uso do plano acima de 82%. Candidato a upgrade.", time: "2h atrás" },
                { type: "success", company: "Telefônica Brasil", msg: "NPS 10 recebido após conclusão do chamado #TKT-891.", time: "4h atrás" },
                { type: "warn", company: "EletroFast Ltda", msg: "14 dias sem abertura de chamado. Possível abandono.", time: "1d atrás" },
                { type: "success", company: "IguaçuNet ISP", msg: "Primeiro chamado criado após 5 dias de trial.", time: "2d atrás" },
              ].map((a, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border text-xs ${
                  a.type === "danger" ? "bg-red-500/10 border-red-500/20 text-red-300" :
                  a.type === "warn" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-300" :
                  "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                }`}>
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold">{a.company}</span> — {a.msg}
                  </div>
                  <span className="text-slate-600 shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Health Scores */}
      {activeTab === "health" && (
        <div className="space-y-4">
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40">
                    <th className="text-left text-[10px] font-mono text-slate-500 uppercase px-5 py-3">Empresa</th>
                    <th className="text-left text-[10px] font-mono text-slate-500 uppercase px-5 py-3">Plano</th>
                    <th className="text-left text-[10px] font-mono text-slate-500 uppercase px-5 py-3">Health Score</th>
                    <th className="text-left text-[10px] font-mono text-slate-500 uppercase px-5 py-3">Chamados</th>
                    <th className="text-left text-[10px] font-mono text-slate-500 uppercase px-5 py-3">Último Login</th>
                    <th className="text-left text-[10px] font-mono text-slate-500 uppercase px-5 py-3">NPS</th>
                    <th className="text-left text-[10px] font-mono text-slate-500 uppercase px-5 py-3">Risco</th>
                  </tr>
                </thead>
                <tbody>
                  {healthScores.map((c, i) => (
                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-all">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {(c.name || "E")[0]}
                          </div>
                          <span className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">{c.name || `Empresa ${i + 1}`}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">{c.plan}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${c.health >= 70 ? "bg-emerald-500" : c.health >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                              style={{ width: `${c.health}%` }} />
                          </div>
                          <span className={`text-xs font-bold ${c.health >= 70 ? "text-emerald-400" : c.health >= 50 ? "text-yellow-400" : "text-red-400"}`}>{c.health}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">{c.ticketCount}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">{c.lastActivity}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-bold ${c.nps >= 9 ? "text-emerald-400" : c.nps >= 7 ? "text-yellow-400" : "text-red-400"}`}>{c.nps}/10</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {c.risk ? (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">Alto Risco</span>
                        ) : (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Saudável</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {healthScores.length === 0 && <p className="text-xs text-slate-600 text-center py-8">Nenhum cliente cadastrado ainda</p>}
            </div>
          </div>
        </div>
      )}

      {/* NPS / CSAT */}
      {activeTab === "nps" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* NPS Summary */}
            <div className="md:col-span-1 bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 text-center space-y-4">
              <h3 className="text-sm font-bold text-white">Net Promoter Score</h3>
              <div className="text-6xl font-bold font-display text-yellow-400">{npsScore}</div>
              <div className="text-xs text-slate-500">Excelente · Benchmark: 50+</div>
              <div className="space-y-2">
                {NPS_DATA.map(n => (
                  <div key={n.label} className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500 w-28 text-left shrink-0">{n.label}</span>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${n.color} rounded-full`} style={{ width: `${n.pct}%` }} />
                    </div>
                    <span className="text-slate-400 w-6 text-right">{n.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CSAT & CES */}
            <div className="md:col-span-2 grid grid-rows-2 gap-4">
              <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Star className="h-4 w-4 text-cyan-400" /> CSAT — Customer Satisfaction</h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold font-display text-cyan-400">4.6</div>
                  <div>
                    <div className="flex gap-0.5 mb-1">{[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-yellow-400"}`} />)}</div>
                    <div className="text-xs text-slate-500">Baseado em 142 avaliações</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Zap className="h-4 w-4 text-indigo-400" /> CES — Customer Effort Score</h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold font-display text-indigo-400">5.8</div>
                  <div>
                    <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden mb-1"><div className="h-full bg-indigo-500 rounded-full" style={{ width: "83%" }} /></div>
                    <div className="text-xs text-slate-500">Escala 1-7 · Quanto menor, melhor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Playbooks */}
      {activeTab === "playbooks" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-all">
              <Plus className="h-3.5 w-3.5" /> Novo Playbook
            </button>
          </div>
          <div className="space-y-3">
            {PLAYBOOKS.map((p, i) => (
              <div key={i} className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${p.status === "Ativo" ? "bg-emerald-400" : "bg-slate-600"}`} />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white">{p.name}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.status === "Ativo" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>{p.status}</span>
                  </div>
                  <div className="text-xs text-slate-500"><span className="text-yellow-400 font-semibold">Gatilho:</span> {p.trigger}</div>
                  <div className="text-xs text-slate-500"><span className="text-cyan-400 font-semibold">Ação:</span> {p.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts */}
      {activeTab === "alerts" && (
        <div className="space-y-4">
          {healthScores.filter(c => c.risk || c.health < 60).map((c, i) => (
            <div key={i} className="bg-[#0b0e17] border border-red-500/20 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{c.name || `Empresa ${i + 1}`}</h4>
                    <p className="text-[10px] text-red-400">Health Score: {c.health}/100 · Risco de Churn</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg transition-all">
                  <Bot className="h-3.5 w-3.5" /> Acionar Playbook
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Health Score", value: `${c.health}/100`, bad: true },
                  { label: "Último Login", value: c.lastActivity },
                  { label: "Chamados", value: c.ticketCount },
                ].map((m, j) => (
                  <div key={j} className="bg-slate-900/60 rounded-xl p-2.5 text-center">
                    <div className={`text-sm font-bold ${m.bad ? "text-red-400" : "text-slate-300"}`}>{m.value}</div>
                    <div className="text-[10px] text-slate-500">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {healthScores.filter(c => c.risk || c.health < 60).length === 0 && (
            <div className="bg-[#0b0e17] border border-emerald-500/20 rounded-2xl p-10 text-center space-y-3">
              <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-white">Nenhum alerta crítico!</h3>
              <p className="text-xs text-slate-500">Todos os clientes estão com saúde adequada.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
