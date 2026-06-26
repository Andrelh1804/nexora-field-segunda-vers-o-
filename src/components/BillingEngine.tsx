import React, { useState } from "react";
import { 
  Settings, Clock, Percent, ArrowLeftRight, Check, Play, HelpCircle, Activity, ChevronRight, Zap, RefreshCw, Sparkles, Sliders, Scale, Trash2, ShieldAlert
} from "lucide-react";

interface BillingEngineProps {
  onLogAudit: (action: string, details: string) => void;
}

interface BillingPeriodConfig {
  id: string;
  name: string;
  days: number;
  multiplier: number;
  gracePeriodDays: number;
  suspendAfterDays: number;
  blockAfterDays: number;
}

interface DynamicCommissionRule {
  id: string;
  name: string;
  targetType: 'Plano' | 'Segmento' | 'Estado' | 'Volume';
  targetValue: string;
  model: 'percentual' | 'fixa' | 'híbrida';
  percentageValue: number;
  flatAmountValue: number;
  status: 'Ativa' | 'Inativa';
}

export default function BillingEngine({ onLogAudit }: BillingEngineProps) {
  // Billing cycle list state
  const [billingPeriods, setBillingPeriods] = useState<BillingPeriodConfig[]>([
    { id: "p-1", name: "Mensal", days: 30, multiplier: 1.0, gracePeriodDays: 5, suspendAfterDays: 10, blockAfterDays: 30 },
    { id: "p-2", name: "Trimestral", days: 90, multiplier: 0.9, gracePeriodDays: 5, suspendAfterDays: 15, blockAfterDays: 45 },
    { id: "p-3", name: "Semestral", days: 180, multiplier: 0.85, gracePeriodDays: 5, suspendAfterDays: 20, blockAfterDays: 60 },
    { id: "p-4", name: "Anual", days: 365, multiplier: 0.8, gracePeriodDays: 7, suspendAfterDays: 30, blockAfterDays: 90 }
  ]);

  // Dynamic commission rules state
  const [commissionRules, setCommissionRules] = useState<DynamicCommissionRule[]>([
    { id: "cr-1", name: "Taxa Reduzida Gold - Sul", targetType: "Estado", targetValue: "PR, SC, RS", model: "percentual", percentageValue: 12.0, flatAmountValue: 0, status: "Ativa" },
    { id: "cr-2", name: "Split Especial Categoria Solar", targetType: "Segmento", targetValue: "Solar", model: "híbrida", percentageValue: 10.0, flatAmountValue: 5.00, status: "Ativa" },
    { id: "cr-3", name: "Faturamento Alto Volume (&gt;R$10k)", targetType: "Volume", targetValue: "Faixa 10k+", model: "percentual", percentageValue: 8.5, flatAmountValue: 0, status: "Ativa" }
  ]);

  // Form states for creating new Commission Rule
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleType, setNewRuleType] = useState<'Plano' | 'Segmento' | 'Estado' | 'Volume'>('Segmento');
  const [newRuleValue, setNewRuleValue] = useState("");
  const [newRuleModel, setNewRuleModel] = useState<'percentual' | 'fixa' | 'híbrida'>('percentual');
  const [newRulePercent, setNewRulePercent] = useState(15);
  const [newRuleFlat, setNewRuleFlat] = useState(0);

  // Split Payment Visual Simulation state
  const [activeSplitStep, setActiveSplitStep] = useState<number>(-1);
  const [simulatedAmount, setSimulatedAmount] = useState<number>(1000);
  const [simSplitLog, setSimSplitLog] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Add new commission rule
  const handleAddCommissionRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName) return;

    const newRule: DynamicCommissionRule = {
      id: `cr-${Date.now()}`,
      name: newRuleName,
      targetType: newRuleType,
      targetValue: newRuleValue || "Geral",
      model: newRuleModel,
      percentageValue: newRulePercent,
      flatAmountValue: newRuleFlat,
      status: "Ativa"
    };

    setCommissionRules(prev => [...prev, newRule]);
    onLogAudit("Create", `Criou regra de comissionamento dinâmica: '${newRuleName}' (${newRuleType}).`);
    setNewRuleName("");
    setNewRuleValue("");
  };

  // Delete commission rule
  const handleDeleteCommissionRule = (id: string, name: string) => {
    if (confirm(`Remover regra de comissão '${name}'?`)) {
      setCommissionRules(prev => prev.filter(r => r.id !== id));
      onLogAudit("Delete", `Excluiu regra de comissão dinâmica '${name}'.`);
    }
  };

  // Run Split Payment Simulation Step-By-Step
  const runSplitSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimSplitLog([]);
    setActiveSplitStep(0);

    const steps = [
      { id: 0, msg: `Empresa inicia pagamento do chamado de R$ ${simulatedAmount.toFixed(2)}.` },
      { id: 1, msg: `Gateway de pagamento processa transação e aloca fundos na conta Escrow NexoraField.` },
      { id: 2, msg: `Nexora aplica regra de comissão híbrida: retém comissão de 12% (R$ ${(simulatedAmount * 0.12).toFixed(2)}) + taxa fixa de R$ 5,00.` },
      { id: 3, msg: `Saldo restante de R$ ${(simulatedAmount * 0.88 - 5).toFixed(2)} é repassado automaticamente para a carteira digital do técnico.` },
      { id: 4, msg: `Gateway emite nota fiscal de serviço para empresa e recibo de repasse para o técnico.` },
      { id: 5, msg: `Sistemas integrados atualizados com sucesso: BI de faturamento, CRM de crescimento e Pontuação de Gamificação (+150 XP).` }
    ];

    for (let i = 0; i < steps.length; i++) {
      setActiveSplitStep(i);
      setSimSplitLog(prev => [...prev, steps[i].msg]);
      await new Promise(resolve => setTimeout(resolve, 1400));
    }
    setIsSimulating(false);
    onLogAudit("Edit", `Simulou transação de Split Payment com valor de R$ ${simulatedAmount}.`);
  };

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. BILLING CYCLES CONFIG */}
        <div className="bg-[#0b0e1a] border border-[#1d2440] p-6 rounded-3xl space-y-4">
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-indigo-400" />
            Configuração de Ciclos & Carências de Faturamento
          </h4>
          <p className="text-xs text-slate-400">Parâmetros operacionais para vencimentos de faturas, dias de tolerância antes da suspensão automática ou bloqueio do portal.</p>

          <div className="space-y-3 pt-2">
            {billingPeriods.map(period => (
              <div key={period.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-indigo-400 font-mono block">Ciclo</span>
                  <span className="font-bold text-slate-200 block">{period.name}</span>
                  <span className="text-slate-500 font-mono text-[10px]">Período: {period.days} dias</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block">Penalidades</span>
                  <span className="text-slate-400 block">Carência: <span className="font-mono font-bold text-amber-500">{period.gracePeriodDays}d</span></span>
                  <span className="text-slate-400 block">Suspensão: <span className="font-mono font-bold text-rose-500">{period.suspendAfterDays}d</span></span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block">Bloqueio Total</span>
                  <span className="text-slate-400 block font-mono">Em {period.blockAfterDays} dias de atraso</span>
                  <span className="text-emerald-400 text-[10px] font-mono block mt-1">✓ Renovação Ativa</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. DYNAMIC COMMISSIONS BUILDER */}
        <div className="bg-[#0b0e1a] border border-[#1d2440] p-6 rounded-3xl space-y-4">
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Percent className="h-4.5 w-4.5 text-cyan-400" />
            Políticas de Comissão Dinâmica (SaaS Revenue-Share)
          </h4>
          <p className="text-xs text-slate-400">Configure comissionamentos personalizados de forma modular, sem alterar o código-fonte.</p>

          {/* List of active rules */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {commissionRules.map(rule => (
              <div key={rule.id} className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-200 block">{rule.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">{rule.targetType}: {rule.targetValue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-cyan-400 font-bold">
                    {rule.model === 'percentual' ? `${rule.percentageValue}%` : rule.model === 'fixa' ? `R$ ${rule.flatAmountValue}` : `${rule.percentageValue}% + R$${rule.flatAmountValue}`}
                  </span>
                  <button 
                    onClick={() => handleDeleteCommissionRule(rule.id, rule.name)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick form */}
          <form onSubmit={handleAddCommissionRule} className="bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-3 text-xs">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-semibold">Nova Regra de Comissionamento</span>
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="Ex: Comissão Solar RS" 
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none"
              />
              <select 
                value={newRuleType}
                onChange={(e) => setNewRuleType(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300"
              >
                <option value="Segmento">Por Segmento</option>
                <option value="Estado">Por Região / Estado</option>
                <option value="Volume">Por Faixa de Volume</option>
              </select>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <input 
                type="text" 
                placeholder="Alvo (Ex: SP)" 
                value={newRuleValue}
                onChange={(e) => setNewRuleValue(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 text-center"
              />
              <input 
                type="number" 
                placeholder="%" 
                value={newRulePercent}
                onChange={(e) => setNewRulePercent(parseInt(e.target.value) || 0)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 text-center"
              />
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer transition-colors"
              >
                Adicionar Regra
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* 3. INTERACTIVE SPLIT PAYMENT RULES VISUALIZER */}
      <div className="bg-[#0e1222] border border-[#1d243a] p-6 rounded-3xl space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-indigo-400" />
              Simulador Visual de Split Payment & Escrow Flow
            </h4>
            <p className="text-xs text-slate-400">Assista o fluxo financeiro de repasse de comissão e liquidação de carteiras em tempo real.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono text-slate-400">Valor Serviço:</span>
            <input 
              type="number" 
              value={simulatedAmount}
              onChange={(e) => setSimulatedAmount(parseFloat(e.target.value) || 0)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 w-24 text-center text-xs text-emerald-400 font-mono font-bold"
            />
            <button 
              onClick={runSplitSimulation}
              disabled={isSimulating}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Play className="h-3.5 w-3.5" /> {isSimulating ? 'Simulando...' : 'Simular Split'}
            </button>
          </div>
        </div>

        {/* Dynamic visual graph steps */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
          
          {[
            { step: 0, label: "1. Pagamento", color: "text-blue-400" },
            { step: 1, label: "2. Conta Escrow", color: "text-amber-400" },
            { step: 2, label: "3. Taxa Nexora", color: "text-cyan-400" },
            { step: 3, label: "4. Repasse Técnico", color: "text-emerald-400" },
            { step: 4, label: "5. Emissão NF-e", color: "text-purple-400" },
            { step: 5, label: "6. BI / CRM Sync", color: "text-pink-400" }
          ].map((item) => (
            <div 
              key={item.step} 
              className={`p-3.5 rounded-2xl border transition-all duration-300 text-center space-y-1.5 ${activeSplitStep === item.step ? 'bg-indigo-950/40 border-indigo-500 shadow-lg scale-105' : activeSplitStep > item.step ? 'bg-slate-950/80 border-emerald-900/60 opacity-80' : 'bg-slate-950/20 border-slate-900 opacity-40'}`}
            >
              <div className="mx-auto h-7 w-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                {activeSplitStep > item.step ? (
                  <Check className="h-4.5 w-4.5 text-emerald-400" />
                ) : (
                  <span>{item.step + 1}</span>
                )}
              </div>
              <span className={`text-[10px] font-bold block ${item.color}`}>{item.label}</span>
            </div>
          ))}

        </div>

        {/* Execution Log */}
        {simSplitLog.length > 0 && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-2 max-h-40 overflow-y-auto">
            <span className="text-[10px] text-slate-500 font-mono uppercase block font-bold">LOG DE EXECUÇÃO GATEWAY SPLIT</span>
            {simSplitLog.map((log, idx) => (
              <div key={idx} className="flex gap-2 text-xs leading-relaxed animate-fade-in">
                <span className="text-emerald-500 font-mono font-bold">[{new Date().toLocaleTimeString()}]</span>
                <p className="text-slate-300 font-mono">{log}</p>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
