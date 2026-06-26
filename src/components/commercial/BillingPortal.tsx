import React, { useState } from "react";
import {
  CreditCard, DollarSign, RefreshCw, TrendingUp, AlertTriangle,
  CheckCircle, Clock, FileText, ArrowUpRight, X, Download,
  Zap, Shield, ChevronDown, Plus, Tag
} from "lucide-react";

const MOCK_SUBSCRIPTIONS = [
  { company: "Telefônica Brasil S.A.", plan: "Enterprise", amount: 1497, status: "Ativa", method: "Cartão", next: "2026-07-01", started: "2024-01-15", color: "indigo" },
  { company: "SolarSol S.A.", plan: "Business", amount: 697, status: "Ativa", method: "PIX", next: "2026-07-01", started: "2024-03-01", color: "cyan" },
  { company: "NetFibra SP", plan: "Business", amount: 697, status: "Trial", method: "—", next: "2026-07-10", started: "2026-06-26", color: "cyan" },
  { company: "EletroFast Ltda", plan: "Starter", amount: 297, status: "Atrasada", method: "Boleto", next: "2026-06-15", started: "2025-06-01", color: "slate" },
];

const MOCK_INVOICES = [
  { id: "NF-2026-061", company: "Telefônica Brasil", plan: "Enterprise", amount: 1497, date: "2026-06-01", status: "Paga", method: "Cartão" },
  { id: "NF-2026-060", company: "SolarSol S.A.", plan: "Business", amount: 697, date: "2026-06-01", status: "Paga", method: "PIX" },
  { id: "NF-2026-059", company: "EletroFast Ltda", plan: "Starter", amount: 297, date: "2026-06-15", status: "Atrasada", method: "Boleto" },
  { id: "NF-2026-058", company: "Telefônica Brasil", plan: "Enterprise", amount: 1497, date: "2026-05-01", status: "Paga", method: "Cartão" },
  { id: "NF-2026-057", company: "SolarSol S.A.", plan: "Business", amount: 697, date: "2026-05-01", status: "Paga", method: "PIX" },
];

const MOCK_COUPONS = [
  { code: "NEXORA30", discount: "30%", type: "Percentual", valid: "2026-12-31", used: 12, limit: 50, status: "Ativo" },
  { code: "ANUAL16", discount: "16%", type: "Percentual", valid: "2026-12-31", used: 31, limit: 100, status: "Ativo" },
  { code: "TRIAL60", discount: "60 dias", type: "Trial Estendido", valid: "2026-09-30", used: 5, limit: 20, status: "Ativo" },
  { code: "PARTNER50", discount: "R$ 50", type: "Valor Fixo", valid: "2026-07-31", used: 50, limit: 50, status: "Esgotado" },
];

export default function BillingPortal({ companies, transactions }: { companies: any[]; transactions: any[] }) {
  const [activeTab, setActiveTab] = useState<"subscriptions" | "invoices" | "coupons" | "settings">("subscriptions");
  const [showAddCoupon, setShowAddCoupon] = useState(false);

  const totalMRR = MOCK_SUBSCRIPTIONS.filter(s => s.status === "Ativa").reduce((s, sub) => s + sub.amount, 0);
  const trialCount = MOCK_SUBSCRIPTIONS.filter(s => s.status === "Trial").length;
  const overdueCount = MOCK_SUBSCRIPTIONS.filter(s => s.status === "Atrasada").length;

  const TABS = [
    { id: "subscriptions", label: "Assinaturas" },
    { id: "invoices", label: "Faturas" },
    { id: "coupons", label: "Cupons" },
    { id: "settings", label: "Configurações" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Billing & Assinaturas SaaS</h2>
          <p className="text-xs text-slate-500 mt-0.5">Gestão completa de faturamento recorrente</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Asaas · Stripe · Efi conectados
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "MRR Ativo", value: `R$ ${totalMRR.toLocaleString("pt-BR")}`, icon: DollarSign, color: "emerald", sub: "Receita recorrente mensal" },
          { label: "Trials Ativos", value: trialCount, icon: Clock, color: "yellow", sub: "Aguardando conversão" },
          { label: "Inadimplentes", value: overdueCount, icon: AlertTriangle, color: "red", sub: "Assinaturas em atraso" },
          { label: "Próx. Cobranças", value: "01/07", icon: RefreshCw, color: "cyan", sub: "Data do próximo ciclo" },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{k.label}</span>
                <Icon className={`h-4 w-4 text-${k.color}-400`} />
              </div>
              <div className={`text-2xl font-bold font-display text-${k.color}-400`}>{k.value}</div>
              <div className="text-[10px] text-slate-600">{k.sub}</div>
            </div>
          );
        })}
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

      {/* Subscriptions */}
      {activeTab === "subscriptions" && (
        <div className="space-y-3">
          {MOCK_SUBSCRIPTIONS.map((sub, i) => (
            <div key={i} className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl bg-${sub.color}-500/10 border border-${sub.color}-500/20 flex items-center justify-center font-bold text-${sub.color}-400 text-sm shrink-0`}>
                  {sub.company[0]}
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{sub.company}</div>
                  <div className="text-xs text-slate-500">Plano {sub.plan} · Desde {new Date(sub.started).toLocaleDateString("pt-BR")}</div>
                </div>
              </div>

              <div className="flex items-center gap-6 flex-wrap">
                <div className="text-center">
                  <div className="text-sm font-bold text-white">R$ {sub.amount.toLocaleString("pt-BR")}</div>
                  <div className="text-[9px] text-slate-500">por mês</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-slate-300">{sub.method}</div>
                  <div className="text-[9px] text-slate-500">método</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-slate-300">{new Date(sub.next).toLocaleDateString("pt-BR")}</div>
                  <div className="text-[9px] text-slate-500">próx. cobrança</div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  sub.status === "Ativa" ? "bg-emerald-500/20 text-emerald-400" :
                  sub.status === "Trial" ? "bg-yellow-500/20 text-yellow-400" :
                  sub.status === "Atrasada" ? "bg-red-500/20 text-red-400" :
                  "bg-slate-700 text-slate-400"
                }`}>{sub.status}</span>
              </div>

              <div className="flex gap-2 shrink-0">
                {sub.status === "Atrasada" && (
                  <button className="text-xs px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 font-semibold transition-all">
                    Cobrar
                  </button>
                )}
                {sub.status === "Trial" && (
                  <button className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-semibold transition-all">
                    Converter
                  </button>
                )}
                <button className="text-xs px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 font-semibold transition-all flex items-center gap-1">
                  Gerenciar <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoices */}
      {activeTab === "invoices" && (
        <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Histórico de Faturas</h3>
            <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all">
              <Download className="h-3.5 w-3.5" /> Exportar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/30">
                  <th className="text-left text-[10px] font-mono text-slate-500 uppercase px-5 py-3">ID</th>
                  <th className="text-left text-[10px] font-mono text-slate-500 uppercase px-5 py-3">Empresa</th>
                  <th className="text-left text-[10px] font-mono text-slate-500 uppercase px-5 py-3">Plano</th>
                  <th className="text-left text-[10px] font-mono text-slate-500 uppercase px-5 py-3">Valor</th>
                  <th className="text-left text-[10px] font-mono text-slate-500 uppercase px-5 py-3">Data</th>
                  <th className="text-left text-[10px] font-mono text-slate-500 uppercase px-5 py-3">Status</th>
                  <th className="text-left text-[10px] font-mono text-slate-500 uppercase px-5 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_INVOICES.map((inv, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-all">
                    <td className="px-5 py-3.5 text-xs font-mono text-slate-500">{inv.id}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-300 font-semibold">{inv.company}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{inv.plan}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-white">R$ {inv.amount.toLocaleString("pt-BR")}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{new Date(inv.date).toLocaleDateString("pt-BR")}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inv.status === "Paga" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                      }`}>{inv.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-all">
                        <Download className="h-3 w-3" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Coupons */}
      {activeTab === "coupons" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowAddCoupon(true)}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg transition-all">
              <Plus className="h-3.5 w-3.5" /> Criar Cupom
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_COUPONS.map((c, i) => (
              <div key={i} className={`bg-[#0b0e17] border rounded-2xl p-5 space-y-3 ${c.status === "Esgotado" ? "border-slate-800/50 opacity-60" : "border-slate-800"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-yellow-400" />
                    <span className="font-mono font-bold text-white text-sm">{c.code}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    c.status === "Ativo" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-500"
                  }`}>{c.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-slate-500">Desconto:</span> <span className="text-yellow-400 font-bold">{c.discount}</span></div>
                  <div><span className="text-slate-500">Tipo:</span> <span className="text-slate-300">{c.type}</span></div>
                  <div><span className="text-slate-500">Usos:</span> <span className="text-slate-300">{c.used}/{c.limit}</span></div>
                  <div><span className="text-slate-500">Válido até:</span> <span className="text-slate-300">{new Date(c.valid).toLocaleDateString("pt-BR")}</span></div>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(c.used / c.limit) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === "settings" && (
        <div className="space-y-4">
          {/* Payment gateways */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Gateways de Pagamento</h3>
            {[
              { name: "Asaas", desc: "PIX, Boleto, Cartão — Gateway principal Brasil", status: true, color: "emerald" },
              { name: "Stripe", desc: "Cartão internacional, Pagamentos globais", status: true, color: "indigo" },
              { name: "Efi (Gerencianet)", desc: "PIX nativo, Cobrança recorrente", status: false, color: "yellow" },
              { name: "Mercado Pago", desc: "PIX, Cartão, Financiamento", status: false, color: "slate" },
            ].map((gw, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div>
                  <div className="font-bold text-sm text-white">{gw.name}</div>
                  <div className="text-xs text-slate-500">{gw.desc}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-semibold ${gw.status ? "text-emerald-400" : "text-slate-600"}`}>
                    {gw.status ? "● Conectado" : "○ Desconectado"}
                  </span>
                  <button className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all ${gw.status ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"}`}>
                    {gw.status ? "Config." : "Conectar"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Billing config */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Configurações de Cobrança</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Dia do Vencimento", value: "1º de cada mês", editable: true },
                { label: "Multa por Atraso", value: "2%", editable: true },
                { label: "Juros Mensais", value: "1% ao mês", editable: true },
                { label: "Suspensão Automática", value: "5 dias de atraso", editable: true },
                { label: "Renovação Automática", value: "Ativa", editable: false },
                { label: "Trial Padrão", value: "14 dias", editable: true },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl">
                  <span className="text-xs text-slate-400">{s.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{s.value}</span>
                    {s.editable && <button className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-all">Editar</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
