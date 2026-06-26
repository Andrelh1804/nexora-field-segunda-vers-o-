import React, { useState } from "react";
import { 
  TrendingUp, BarChart3, CreditCard, DollarSign, Activity, Users, ArrowUpRight, ArrowDownRight, Sparkles, Scale, Percent
} from "lucide-react";
import { Plan, Subscription, Company, Technician } from "../types";

interface BillingDashboardProps {
  plans: Plan[];
  subscriptions: Subscription[];
  companies: Company[];
  technicians: Technician[];
}

export default function BillingDashboard({ plans, subscriptions, companies, technicians }: BillingDashboardProps) {
  // Scenario simulation sliders
  const [mrrGrowthRate, setMrrGrowthRate] = useState(12); // Expected monthly growth %
  const [expectedChurn, setExpectedChurn] = useState(1.5); // Expected monthly churn %
  const [expectedCac, setExpectedCac] = useState(450); // Customer Acquisition Cost (R$)

  // Real-time calculated KPIs
  const activeSubs = subscriptions.filter(s => s.status === 'Ativa');
  const totalSubCount = subscriptions.length;
  
  // Calculate MRR: normalize quarterly, semesterly, yearly and monthly
  const mrr = subscriptions.reduce((sum, s) => {
    if (s.status !== 'Ativa' && s.status !== 'Atrasada') return sum;
    let value = s.amount;
    if (s.billingPeriod === 'quarterly') value = s.amount / 3;
    else if (s.billingPeriod === 'semesterly') value = s.amount / 6;
    else if (s.billingPeriod === 'yearly') value = s.amount / 12;
    return sum + value;
  }, 0);

  const arr = mrr * 12;
  const averageTicket = activeSubs.length > 0 ? mrr / activeSubs.length : 0;
  
  // Commission Calculations
  const totalCommissions = 34500; // Simulated historical value in R$
  const pendingCommission = 8400;
  const settledCommission = 26100;

  // Forecast Metrics based on simulation values
  const currentLtv = expectedChurn > 0 ? (averageTicket / (expectedChurn / 100)) : 0;
  const currentPayback = averageTicket > 0 ? expectedCac / averageTicket : 0;
  const burnRateSimulated = 18000; // Nexora operations cost
  const cashFlowSimulated = mrr - burnRateSimulated;

  return (
    <div className="space-y-6">
      
      {/* 1. EXECUTIVE KPIS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* MRR & ARR */}
        <div className="bg-[#0b0e1a] border border-[#1d2440] p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-indigo-950 p-2 rounded-xl text-indigo-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-mono">Recorrência Mensal (MRR)</span>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-2xl font-black font-display text-white">R$ {mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
              <ArrowUpRight className="h-3 w-3" /> +15.2% vs mês anterior
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between text-[11px] text-slate-400">
            <span>Anualizado (ARR):</span>
            <span className="font-bold text-white font-mono">R$ {arr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* SUBSCRIPTIONS STATUS COHORTS */}
        <div className="bg-[#0b0e1a] border border-[#1d2440] p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-emerald-950 p-2 rounded-xl text-emerald-400">
            <Users className="h-5 w-5" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-mono">Status de Assinaturas</span>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-2xl font-black font-display text-white">{activeSubs.length} <span className="text-xs font-normal text-slate-400">ativas</span></h3>
            <p className="text-[11px] text-slate-400">Total cadastrado: <span className="text-white font-bold">{totalSubCount}</span></p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-900 grid grid-cols-4 gap-1 text-[9px] text-center font-mono">
            <div className="bg-emerald-950/40 text-emerald-400 p-1 rounded border border-emerald-900/40">
              <span className="block font-bold">3 Ativas</span>
            </div>
            <div className="bg-amber-950/40 text-amber-400 p-1 rounded border border-amber-900/40">
              <span className="block font-bold">1 Teste</span>
            </div>
            <div className="bg-rose-950/40 text-rose-400 p-1 rounded border border-rose-900/40">
              <span className="block font-bold">1 Inadim.</span>
            </div>
            <div className="bg-slate-900 text-slate-400 p-1 rounded border border-slate-800">
              <span className="block font-bold">1 Susp.</span>
            </div>
          </div>
        </div>

        {/* PLATFORM COMMISSIONS */}
        <div className="bg-[#0b0e1a] border border-[#1d2440] p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-cyan-950 p-2 rounded-xl text-cyan-400">
            <CreditCard className="h-5 w-5" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-mono">Comissão Intermediação</span>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-2xl font-black font-display text-white">R$ {totalCommissions.toLocaleString('pt-BR')}</h3>
            <p className="text-[11px] text-slate-400">Margem média: <span className="text-cyan-400 font-mono font-bold">12.5% por transação</span></p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between text-[11px] text-slate-400">
            <span>Liquidado: <span className="text-emerald-400 font-mono">R$ {settledCommission}</span></span>
            <span>Previsto: <span className="text-amber-400 font-mono">R$ {pendingCommission}</span></span>
          </div>
        </div>

        {/* REVENUE RETENTION & HEALTH */}
        <div className="bg-[#0b0e1a] border border-[#1d2440] p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-pink-950 p-2 rounded-xl text-pink-400">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-mono">Métricas de Retenção</span>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-2xl font-black font-display text-white">1.2% <span className="text-xs font-normal text-slate-400">churn</span></h3>
            <p className="text-[11px] text-slate-400">Ticket Médio: <span className="text-pink-400 font-mono font-bold">R$ {averageTicket.toFixed(2)}</span></p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between text-[11px] text-slate-400">
            <span>Upgrades: <span className="text-emerald-400">+14</span></span>
            <span>Downgrades: <span className="text-rose-400">-3</span></span>
          </div>
        </div>

      </div>

      {/* 2. ADVANCED DEMAND & GEOGRAPHIC CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Area */}
        <div className="bg-[#0b0e1a] border border-[#1d2440] p-6 rounded-3xl lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Evolução e Origem de Faturamento</h4>
              <p className="text-xs text-slate-400">Detalhamento de faturamento consolidado por canais no mês vigente.</p>
            </div>
            <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-lg font-mono">Moeda: BRL</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900">
              <span className="text-[9px] text-slate-500 font-mono block">RECEITA DIÁRIA</span>
              <span className="text-sm font-bold text-slate-200">R$ 1.450,00</span>
              <span className="text-[9px] text-emerald-400 font-mono block mt-1">↑ 8.2% hoje</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900">
              <span className="text-[9px] text-slate-500 font-mono block">ESTADO LÍDER</span>
              <span className="text-sm font-bold text-slate-200">São Paulo (SP)</span>
              <span className="text-[9px] text-cyan-400 font-mono block mt-1">R$ 22.400,00</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900">
              <span className="text-[9px] text-slate-500 font-mono block">SEGMENTO ÂNCORA</span>
              <span className="text-sm font-bold text-slate-200">Telecom & Solar</span>
              <span className="text-[9px] text-indigo-400 font-mono block mt-1">75% da receita</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900">
              <span className="text-[9px] text-slate-500 font-mono block">CATEGORIA MAIS CONTRATADA</span>
              <span className="text-sm font-bold text-slate-200">Gold / Business</span>
              <span className="text-[9px] text-pink-400 font-mono block mt-1">4 ativos</span>
            </div>
          </div>

          {/* SVG Visual Graph for Monthly Distribution */}
          <div className="relative pt-4">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block mb-2">Histórico de Receita NexoraField</span>
            <svg viewBox="0 0 500 150" className="w-full h-36 overflow-visible">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path 
                d="M 0 150 L 50 130 Q 100 120 150 110 T 250 85 T 350 50 T 450 30 L 500 20 L 500 150 Z" 
                fill="url(#revenueGrad)" 
              />
              <path 
                d="M 0 150 L 50 130 Q 100 120 150 110 T 250 85 T 350 50 T 450 30 L 500 20" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />
              <circle cx="250" cy="85" r="4" fill="#06b6d4" />
              <text x="250" y="70" fontSize="8" fill="#e2e8f0" textAnchor="middle" fontFamily="monospace">R$ 24k</text>

              <circle cx="450" cy="30" r="4" fill="#818cf8" />
              <text x="450" y="15" fontSize="8" fill="#818cf8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">R$ 38k</text>

              <text x="50" y="145" fontSize="8" fill="#64748b" textAnchor="middle">Jan</text>
              <text x="150" y="145" fontSize="8" fill="#64748b" textAnchor="middle">Mar</text>
              <text x="250" y="145" fontSize="8" fill="#64748b" textAnchor="middle">Mai</text>
              <text x="350" y="145" fontSize="8" fill="#64748b" textAnchor="middle">Jul</text>
              <text x="450" y="145" fontSize="8" fill="#64748b" textAnchor="middle">Set</text>
            </svg>
          </div>
        </div>

        {/* REGIONAL REVENUE & PLAN CATEGORIES COHORT */}
        <div className="bg-[#0b0e1a] border border-[#1d2440] p-6 rounded-3xl space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Receita por Plano & Categoria</h4>
          
          <div className="space-y-3.5">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Planos de Empresas (Corporate)</span>
                <span className="font-mono text-cyan-400 font-bold">82% (R$ {(mrr * 0.82).toFixed(2)})</span>
              </div>
              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: "82%" }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Planos de Técnicos Autônomos</span>
                <span className="font-mono text-indigo-400 font-bold">12% (R$ {(mrr * 0.12).toFixed(2)})</span>
              </div>
              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "12%" }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Plano de Parceiros Credenciados</span>
                <span className="font-mono text-purple-400 font-bold">6% (R$ {(mrr * 0.06).toFixed(2)})</span>
              </div>
              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: "6%" }}></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900/60">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-2">Receita por Região Geográfica</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 flex justify-between items-center">
                <span className="text-slate-400">Sudeste (SP, RJ, MG)</span>
                <span className="font-mono font-bold text-emerald-400">65%</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 flex justify-between items-center">
                <span className="text-slate-400">Sul (PR, SC, RS)</span>
                <span className="font-mono font-bold text-cyan-400">18%</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 flex justify-between items-center">
                <span className="text-slate-400">Nordeste (PE, BA, CE)</span>
                <span className="font-mono font-bold text-indigo-400">10%</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 flex justify-between items-center">
                <span className="text-slate-400">Centro-Oeste / Norte</span>
                <span className="font-mono font-bold text-slate-400">7%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. SCENARIO SIMULATOR & BUSINESS FORECAST */}
      <div className="bg-[#0e1222] border border-[#1d243a] p-6 rounded-3xl text-white space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <div>
            <h4 className="font-bold text-sm tracking-tight">Simulador de Expansão & Business Forecast SaaS</h4>
            <p className="text-xs text-slate-400">Parametrizador em tempo real das métricas financeiras do SaaS NexoraField (LTV, CAC, Payback e Fluxo de Caixa livre).</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Sliders Input */}
          <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-900">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block font-bold">Variáveis de Entrada</span>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span>Crescimento de MRR Esperado</span>
                <span className="text-indigo-400 font-bold">+{mrrGrowthRate}% /mês</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={mrrGrowthRate} 
                onChange={(e) => setMrrGrowthRate(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span>Taxa de Churn Esperada</span>
                <span className="text-rose-400 font-bold">{expectedChurn}% /mês</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                step="0.1"
                max="10" 
                value={expectedChurn} 
                onChange={(e) => setExpectedChurn(parseFloat(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span>Custo de Aquisição (CAC)</span>
                <span className="text-emerald-400 font-bold">R$ {expectedCac} por cliente</span>
              </div>
              <input 
                type="range" 
                min="100" 
                step="50"
                max="2000" 
                value={expectedCac} 
                onChange={(e) => setExpectedCac(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          {/* Realtime Outputs */}
          <div className="grid grid-cols-2 gap-3 md:col-span-2">
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 font-mono block">LIFETIME VALUE (LTV)</span>
              <div className="my-1.5">
                <span className="text-xl font-black text-white font-display">R$ {currentLtv.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                <span className="block text-[9px] text-slate-400 mt-1">Tempo de vida médio: {((100 / expectedChurn)).toFixed(0)} meses</span>
              </div>
              <span className="text-[9px] text-indigo-400 font-mono">LTV/CAC Ratio: <span className="font-bold">{(currentLtv / expectedCac).toFixed(1)}x</span> (Ideal &gt; 3x)</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 font-mono block">PAYBACK DA AQUISIÇÃO</span>
              <div className="my-1.5">
                <span className="text-xl font-black text-amber-400 font-display">{currentPayback.toFixed(1)} <span className="text-xs font-normal text-slate-400">meses</span></span>
                <span className="block text-[9px] text-slate-400 mt-1">Meses de assinatura para recuperar o CAC.</span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono">{currentPayback <= 6 ? '⚡ Payback excelente' : '⚠️ Payback moderado'}</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 font-mono block">PREVISÃO DE MRR DEZEMBRO/2026</span>
              <div className="my-1.5">
                {/* Simulated compound growth over 6 months */}
                <span className="text-xl font-black text-cyan-400 font-display">
                  R$ {(mrr * Math.pow(1 + mrrGrowthRate/100, 6)).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
                <span className="block text-[9px] text-slate-400 mt-1">Estimado para 6 meses compostos</span>
              </div>
              <span className="text-[9px] text-emerald-400 font-mono">↑ Crescimento composto</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 font-mono block">FLUXO DE CAIXA LIVRE (FREE CASH FLOW)</span>
              <div className="my-1.5">
                <span className={`text-xl font-black font-display ${cashFlowSimulated >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {cashFlowSimulated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="block text-[9px] text-slate-400 mt-1">MRR acumulado menos custos operacionais de R$ 18k</span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono">Burn rate operacional fixo</span>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
