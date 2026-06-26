import React, { useState } from "react";
import { 
  Settings, ShieldAlert, Key, Globe, Radio, RefreshCw, Check, ClipboardCheck, Ban, ShieldCheck, HelpCircle
} from "lucide-react";

interface GatewaySetting {
  id: string;
  name: string;
  provider: string;
  status: 'Conectado' | 'Pendente' | 'Inativo';
  mode: 'Produção' | 'Sandbox';
  apiKeyMasked: string;
}

interface DualApprovalRequest {
  id: string;
  operation: string;
  requester: string;
  time: string;
  details: string;
  status: 'Pendente' | 'Aprovado' | 'Recusado';
}

interface BillingIntegrationsProps {
  onLogAudit: (action: string, details: string) => void;
}

export default function BillingIntegrations({ onLogAudit }: BillingIntegrationsProps) {
  // Gateway Settings state
  const [gateways, setGateways] = useState<GatewaySetting[]>([
    { id: "g-1", name: "Gateway Principal Cartão & Boleto", provider: "Stripe", status: "Conectado", mode: "Produção", apiKeyMasked: "sk_live_...9A3f" },
    { id: "g-2", name: "Recebimentos instantâneos PIX", provider: "Iugu", status: "Conectado", mode: "Produção", apiKeyMasked: "iugu_live_...7x8y" },
    { id: "g-3", name: "Contabilidade Automática ERP", provider: "Omie", status: "Pendente", mode: "Sandbox", apiKeyMasked: "omie_sandbox_...331a" }
  ]);

  // Dual Approval state for critical operations
  const [approvals, setApprovals] = useState<DualApprovalRequest[]>([
    { id: "ap-1", operation: "Alteração de Preço Plano Start", requester: "Luiz Silva (Finanças)", time: "Hoje às 10:30", details: "Aumentar mensalidade de R$ 299,00 para R$ 349,00.", status: "Pendente" },
    { id: "ap-2", operation: "Isenção Multa SolarSol", requester: "Mariana Costa (Suporte)", time: "Ontem às 16:15", details: "Isentar multa de R$ 45,00 por atraso amigável.", status: "Pendente" }
  ]);

  // Save new webhook trigger simulation
  const [webhookUrl, setWebhookUrl] = useState("https://api.empresa.com/nexora-webhook");
  const [testWebhookResult, setTestWebhookResult] = useState<string | null>(null);

  // Toggle mode
  const handleToggleMode = (id: string, name: string) => {
    setGateways(prev => prev.map(g => {
      if (g.id === id) {
        const nextMode = g.mode === 'Produção' ? 'Sandbox' as const : 'Produção' as const;
        onLogAudit("Edit", `Alterou ambiente do gateway '${name}' para '${nextMode}'.`);
        return { ...g, mode: nextMode };
      }
      return g;
    }));
  };

  // Approve Dual Request
  const handleApproveRequest = (id: string, opName: string, action: 'Aprovado' | 'Recusado') => {
    setApprovals(prev => prev.map(ap => {
      if (ap.id === id) {
        onLogAudit("StatusChange", `Super Admin ${action} a operação de dupla aprovação '${opName}'.`);
        return { ...ap, status: action };
      }
      return ap;
    }));
  };

  // Webhook Test trigger simulation
  const handleTestWebhook = () => {
    setTestWebhookResult("Aguardando resposta do servidor...");
    setTimeout(() => {
      setTestWebhookResult("✓ Status 200 OK. Payloads recebidos com sucesso.");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GATEWAY INTEGRATIONS */}
        <div className="bg-[#0b0e1a] border border-[#1d2440] p-6 rounded-3xl space-y-4">
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Key className="h-4.5 w-4.5 text-indigo-400" />
            Credenciais do Gateway de Pagamento & APIs
          </h4>
          <p className="text-xs text-slate-400">Tokens de API de produção, integrações e credenciais seguras para faturamento e liquidações.</p>

          <div className="space-y-3.5 pt-2">
            {gateways.map(g => (
              <div key={g.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-200">{g.name}</span>
                    <span className="bg-indigo-950 text-indigo-400 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">{g.provider}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">Chave Mascarada: {g.apiKeyMasked}</span>
                  <span className="text-[9px] text-emerald-400 font-mono block mt-0.5">Status: {g.status} | Modo: {g.mode}</span>
                </div>
                <button 
                  onClick={() => handleToggleMode(g.id, g.name)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  Alternar Modo
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* WEBHOOKS CONFIG */}
        <div className="bg-[#0b0e1a] border border-[#1d2440] p-6 rounded-3xl space-y-4">
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Globe className="h-4.5 w-4.5 text-cyan-400" />
            Configuração de Webhooks para Eventos Financeiros
          </h4>
          <p className="text-xs text-slate-400">Receba notificações JSON instantâneas sobre faturas pagas, assinaturas atrasadas ou splits liquidados.</p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-mono">URL Destinatária (Payload)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none"
                />
                <button 
                  type="button"
                  onClick={handleTestWebhook}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Testar Envio
                </button>
              </div>
            </div>

            {testWebhookResult && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-xs text-cyan-400 font-mono leading-relaxed">
                {testWebhookResult}
              </div>
            )}

            <div className="pt-2 border-t border-slate-900/60 text-[10px] text-slate-500 font-mono space-y-1">
              <span className="block">Tipos de Eventos Enviados:</span>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-slate-900 px-1.5 py-0.5 rounded">subscription.created</span>
                <span className="bg-slate-900 px-1.5 py-0.5 rounded">invoice.paid</span>
                <span className="bg-slate-900 px-1.5 py-0.5 rounded">split.released</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* DUAL APPROVAL PANEL */}
      <div className="bg-[#0e1222] border border-[#1d243a] p-6 rounded-3xl space-y-4">
        <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rose-500 animate-pulse" />
          Segurança de Dupla Aprovação & Controles Críticos
        </h4>
        <p className="text-xs text-slate-400">Alterações em preços de planos, comissões ou políticas fiscais requerem homologação de um segundo administrador para prevenir fraudes.</p>

        <div className="space-y-3 pt-1">
          {approvals.map(appr => (
            <div key={appr.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-200">{appr.operation}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${appr.status === 'Pendente' ? 'bg-rose-950 text-rose-400 animate-pulse' : appr.status === 'Aprovado' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-slate-500'}`}>
                    {appr.status}
                  </span>
                </div>
                <p className="text-slate-400">{appr.details}</p>
                <span className="text-[10px] text-slate-500 font-mono block">Solicitado por: {appr.requester} | {appr.time}</span>
              </div>

              {appr.status === 'Pendente' && (
                <div className="flex gap-2 text-xs font-bold w-full sm:w-auto">
                  <button 
                    onClick={() => handleApproveRequest(appr.id, appr.operation, 'Recusado')}
                    className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-800 text-slate-400 px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Rejeitar
                  </button>
                  <button 
                    onClick={() => handleApproveRequest(appr.id, appr.operation, 'Aprovado')}
                    className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Aprovar Alteração
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
