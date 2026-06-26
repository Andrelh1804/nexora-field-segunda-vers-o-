import React, { useState } from "react";
import { 
  FileText, ShieldCheck, Award, HelpCircle, ChevronRight, CheckCircle2, User, Landmark, Plus, Trash2, Tag, Calendar
} from "lucide-react";

interface BillingContractsProps {
  onLogAudit: (action: string, details: string) => void;
}

interface SaaSContract {
  id: string;
  companyName: string;
  planName: string;
  version: string;
  signedAt: string;
  status: 'Vigente' | 'Aguardando Assinatura' | 'Cancelado';
  ipAddress: string;
  electronicHash: string;
}

interface CommercialCampaign {
  id: string;
  name: string;
  type: 'Cashback' | 'Bônus Indicações' | 'Campanha Regional';
  value: number; // e.g. 5 for 5% cashback or 100 for R$100 bonus
  target: 'Empresa' | 'Técnico' | 'Ambos';
  states: string[];
  status: 'Ativa' | 'Pausada';
}

export default function BillingContracts({ onLogAudit }: BillingContractsProps) {
  // Mock sSaaS Contracts
  const [contracts, setContracts] = useState<SaaSContract[]>([
    { id: "con-1", companyName: "Telefônica Brasil S.A.", planName: "Nexora Platinum", version: "v2.4 (Enterprise)", signedAt: "2026-06-10T09:30:00Z", status: "Vigente", ipAddress: "186.221.45.10", electronicHash: "sha256-a9b8c7d6..." },
    { id: "con-2", companyName: "SolarSol Soluções S.A.", planName: "Nexora Gold", version: "v2.1", signedAt: "2026-06-10T14:45:00Z", status: "Vigente", ipAddress: "201.55.192.122", electronicHash: "sha256-f5e4d3c2..." },
    { id: "con-3", companyName: "Infrasul Redes Ópticas", planName: "Nexora Start", version: "v1.9", signedAt: "2026-06-15T11:15:00Z", status: "Vigente", ipAddress: "177.82.100.4", electronicHash: "sha256-4b5c6d7e..." }
  ]);

  // Mock Commercial Campaigns
  const [campaigns, setCampaigns] = useState<CommercialCampaign[]>([
    { id: "cp-1", name: "Cashback Primeiras 5 Ordens", type: "Cashback", value: 5, target: "Empresa", states: ["SP", "RJ", "MG"], status: "Ativa" },
    { id: "cp-2", name: "Indique um Técnico Sênior", type: "Bônus Indicações", value: 100, target: "Ambos", states: ["Nacional"], status: "Ativa" },
    { id: "cp-3", name: "Incentivo Inverno Sul Fibra", type: "Campanha Regional", value: 15, target: "Técnico", states: ["PR", "SC", "RS"], status: "Pausada" }
  ]);

  // Selected contract for legal terms modal preview
  const [activeContractPreviewId, setActiveContractPreviewId] = useState<string | null>(null);

  // New campaign state
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState<'Cashback' | 'Bônus Indicações' | 'Campanha Regional'>('Cashback');
  const [campaignValue, setCampaignValue] = useState(10);
  const [campaignTarget, setCampaignTarget] = useState<'Empresa' | 'Técnico' | 'Ambos'>('Empresa');

  // Add Campaign
  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName) return;

    const newCamp: CommercialCampaign = {
      id: `cp-${Date.now()}`,
      name: campaignName,
      type: campaignType,
      value: campaignValue,
      target: campaignTarget,
      states: ["Nacional"],
      status: "Ativa"
    };

    setCampaigns(prev => [...prev, newCamp]);
    onLogAudit("Create", `Criou campanha financeira comercial: '${campaignName}' (${campaignType}).`);
    setCampaignName("");
  };

  const handleToggleCampaign = (id: string, name: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'Ativa' ? 'Pausada' as const : 'Ativa' as const;
        onLogAudit("Edit", `Alterou status da campanha '${name}' para '${nextStatus}'.`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const selectedContract = contracts.find(c => c.id === activeContractPreviewId);

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CONTRACTS COLUMN */}
        <div className="lg:col-span-2 bg-[#0b0e1a] border border-[#1d2440] p-6 rounded-3xl space-y-4">
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-indigo-400" />
            Centro de Contratos SaaS & Termos Legais
          </h4>
          <p className="text-xs text-slate-400">Verifique os contratos ativos vigentes, versões de termos aceitos eletronicamente e assinaturas digitais por IP.</p>

          <div className="space-y-3 pt-2">
            {contracts.map(contract => (
              <div key={contract.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-200">{contract.companyName}</span>
                    <span className="bg-emerald-950 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded border border-emerald-900/60 font-mono font-bold">Vigente</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">Plano: {contract.planName} | Versão Contrato: {contract.version}</span>
                  <span className="text-[9px] text-indigo-400 font-mono block mt-0.5">Assinado via IP: {contract.ipAddress} | Hash: {contract.electronicHash}</span>
                </div>
                <button 
                  onClick={() => setActiveContractPreviewId(contract.id)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
                >
                  Visualizar Termos
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CAMPAIGNS COLUMN */}
        <div className="bg-[#0b0e1a] border border-[#1d2440] p-6 rounded-3xl space-y-4">
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Award className="h-4.5 w-4.5 text-cyan-400" />
            Incentivos & Cashback
          </h4>
          <p className="text-xs text-slate-400">Crie campanhas para alavancar a atração de novos assinantes ou técnicos qualificados.</p>

          <div className="space-y-2.5 max-h-48 overflow-y-auto">
            {campaigns.map(cp => (
              <div key={cp.id} className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-200 block">{cp.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">{cp.type} | Alvo: {cp.target}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-bold mr-1">{cp.type === 'Cashback' ? `${cp.value}%` : `R$ ${cp.value}`}</span>
                  <button 
                    onClick={() => handleToggleCampaign(cp.id, cp.name)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${cp.status === 'Ativa' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-slate-400'}`}
                  >
                    {cp.status}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add Campaign Form */}
          <form onSubmit={handleAddCampaign} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-900 space-y-3.5 text-xs pt-4">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold">Nova Campanha</span>
            <input 
              type="text" 
              placeholder="Ex: Cashback Verão 10%" 
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <select 
                value={campaignType}
                onChange={(e) => setCampaignType(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-300"
              >
                <option value="Cashback">Cashback</option>
                <option value="Bônus Indicações">Bônus Indicação</option>
                <option value="Campanha Regional">Campanha Regional</option>
              </select>
              <input 
                type="number" 
                value={campaignValue}
                onChange={(e) => setCampaignValue(parseInt(e.target.value) || 0)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 text-center"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-xl cursor-pointer"
            >
              Criar Campanha Comercial
            </button>
          </form>
        </div>

      </div>

      {/* CONTRACT TERM MODAL PREVIEW */}
      {selectedContract && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b0e1a] border border-[#1d2440] text-white rounded-3xl max-w-2xl w-full p-6 space-y-5">
            <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest block font-bold">TERMOS ELETRÔNICOS ACEITOS</span>
                <h3 className="font-bold text-base">Visualização Contrato: {selectedContract.companyName}</h3>
              </div>
              <button 
                onClick={() => setActiveContractPreviewId(null)}
                className="bg-slate-900 p-1 rounded hover:bg-slate-800 cursor-pointer text-slate-400 hover:text-white"
              >
                Fechar
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl max-h-72 overflow-y-auto text-xs text-slate-300 font-mono space-y-3 leading-relaxed">
              <h5 className="font-bold text-slate-100 text-center uppercase">CONTRATO DE ADESÃO DE SERVIÇOS SAAS NEXORAFIELD AI</h5>
              <p>**CLÁUSULA PRIMEIRA - DO OBJETO:** O presente instrumento tem por objeto licenciar o uso da plataforma NexoraField AI para gestão empresarial de ordens de serviço externa e automação de técnicos em campo...</p>
              <p>**CLÁUSULA SEGUNDA - DA REMUNERAÇÃO:** O contratante pagará a mensalidade conforme plano selecionado ({selectedContract.planName}) com faturamento automatizado e vencimentos pré-programados...</p>
              <p>**CLÁUSULA TERCEIRA - DA PRIVACIDADE E DADOS (LGPD):** A plataforma NexoraField atua em estrito cumprimento da Lei Geral de Proteção de Dados, criptografando todas as informações sensíveis de chamados técnicos e faturamento...</p>
              <p className="text-emerald-400 font-bold text-center">✓ Aceite eletrônico coletado via IP {selectedContract.ipAddress} no dia {new Date(selectedContract.signedAt).toLocaleDateString()}. Hash eletrônico sha256 validado.</p>
            </div>

            <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-2 border-t border-slate-900">
              <span>Assinante: <span className="text-white font-bold">{selectedContract.companyName}</span></span>
              <span>Versão: {selectedContract.version}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
