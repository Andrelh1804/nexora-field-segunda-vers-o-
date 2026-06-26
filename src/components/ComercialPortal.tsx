import React, { useState } from "react";
import { 
  Briefcase, Calendar, Users, TrendingUp, Sparkles, Plus, 
  ChevronRight, Phone, Mail, DollarSign, Activity, FileText, 
  Clock, CheckCircle, AlertCircle, Award, PlayCircle, Star
} from "lucide-react";
import { LeadCompany, LeadTech, Company, Technician } from "../types";

interface ComercialPortalProps {
  leadCompanies: LeadCompany[];
  leadTechs: LeadTech[];
  companies: Company[];
  technicians: Technician[];
  setLeadCompanies: React.Dispatch<React.SetStateAction<LeadCompany[]>>;
  setLeadTechs: React.Dispatch<React.SetStateAction<LeadTech[]>>;
  onAddCompany: (comp: Omit<Company, 'id'>) => void;
  onAddAuditLog: (log: { type: 'growth'; message: string }) => void;
}

export default function ComercialPortal({
  leadCompanies,
  leadTechs,
  companies,
  technicians,
  setLeadCompanies,
  setLeadTechs,
  onAddCompany,
  onAddAuditLog
}: ComercialPortalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'meetings' | 'growth_engine'>('pipeline');

  // Search/Filters
  const [leadSearch, setLeadSearch] = useState("");
  
  // Forms local state for adding a Lead Company
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadSegment, setNewLeadSegment] = useState("Telecom");
  const [newLeadCity, setNewLeadCity] = useState("");
  const [newLeadState, setNewLeadState] = useState("SP");
  const [newLeadValue, setNewLeadValue] = useState("");
  const [newLeadContact, setNewLeadContact] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadRespName, setNewLeadRespName] = useState("");
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // Proposal Creation state
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [proposalDetails, setProposalDetails] = useState("");
  const [aiProposalText, setAiProposalText] = useState("");
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);

  // Meeting scheduler state
  const [meetingLeadId, setMeetingLeadId] = useState<string | null>(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");

  // Handler: Add a Lead Company
  const handleAddLeadCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadCity || !newLeadContact) return;

    const newLead: LeadCompany = {
      id: `lead-c-${Date.now()}`,
      name: newLeadName,
      segment: newLeadSegment,
      city: newLeadCity,
      state: newLeadState,
      size: 'Média',
      ratingStars: 4,
      contactChannel: 'WhatsApp',
      contactStatus: 'Interessado',
      phone: newLeadContact,
      email: newLeadEmail || "contato@empresa.com.br",
      responsibleName: newLeadRespName || "Gestor de Operações",
      responsibleRole: "Coordenador de TI",
      estimatedValue: Number(newLeadValue) || 3000,
      createdAt: new Date().toISOString(),
      historyLogs: [
        { 
          timestamp: new Date().toISOString(), 
          message: `Lead cadastrado manualmente por usuário Comercial. Potencial estimado: R$ ${Number(newLeadValue) || 3000}.`, 
          type: 'user' 
        }
      ]
    };

    setLeadCompanies(prev => [newLead, ...prev]);
    onAddAuditLog({
      type: 'growth',
      message: `Comercial cadastrou prospecto de empresa: ${newLeadName} em ${newLeadCity}/${newLeadState}.`
    });

    // Reset Form
    setNewLeadName("");
    setNewLeadCity("");
    setNewLeadValue("");
    setNewLeadContact("");
    setNewLeadEmail("");
    setNewLeadRespName("");
    setShowAddLeadModal(false);
  };

  // Handler: Advance a Lead
  const handleAdvanceLead = (leadId: string, currentStatus: LeadCompany['contactStatus']) => {
    const statusSequence: LeadCompany['contactStatus'][] = [
      'Interessado', 
      'Demonstracao_Agendada', 
      'Negociacao', 
      'Cliente'
    ];
    const currentIndex = statusSequence.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === statusSequence.length - 1) return;

    const nextStatus = statusSequence[currentIndex + 1];

    setLeadCompanies(prev => prev.map(l => {
      if (l.id === leadId) {
        const updatedLogs = [...(l.historyLogs || [])];
        updatedLogs.push({
          timestamp: new Date().toISOString(),
          message: `Comercial avançou lead para a etapa: ${nextStatus.replace('_', ' ')}.`,
          type: 'user'
        });
        return { ...l, contactStatus: nextStatus, historyLogs: updatedLogs };
      }
      return l;
    }));

    // If transitioned to Cliente, automatically register it as a Real Company
    if (nextStatus === 'Cliente') {
      const targetLead = leadCompanies.find(l => l.id === leadId);
      if (targetLead) {
        onAddCompany({
          name: targetLead.name,
          email: targetLead.email,
          phone: targetLead.phone,
          cnpj: targetLead.cnpj || "00.000.000/0001-99",
          city: targetLead.city,
          state: targetLead.state,
          avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=150&fit=crop",
          segment: targetLead.segment
        });
      }
    }

    onAddAuditLog({
      type: 'growth',
      message: `Comercial avançou pipeline da empresa para: ${nextStatus}`
    });
  };

  // Handler: Schedule a Meeting
  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingLeadId || !meetingDate || !meetingTime) return;

    setLeadCompanies(prev => prev.map(l => {
      if (l.id === meetingLeadId) {
        const updatedLogs = [...(l.historyLogs || [])];
        updatedLogs.push({
          timestamp: new Date().toISOString(),
          message: `Reunião comercial agendada para ${meetingDate} às ${meetingTime}. Pauta: ${meetingNotes || 'Apresentação institucional'}`,
          type: 'user'
        });
        return {
          ...l,
          contactStatus: 'Demonstracao_Agendada',
          demoDate: `${meetingDate} T ${meetingTime}`,
          historyLogs: updatedLogs
        };
      }
      return l;
    }));

    const targetLead = leadCompanies.find(l => l.id === meetingLeadId);
    onAddAuditLog({
      type: 'growth',
      message: `Comercial agendou reunião comercial com ${targetLead?.name} para dia ${meetingDate} às ${meetingTime}.`
    });

    setMeetingLeadId(null);
    setMeetingDate("");
    setMeetingTime("");
    setMeetingNotes("");
  };

  // Generate AI pre-meeting briefs & pitch proposals using Gemini simulations
  const handleGenerateAiProposal = (lead: LeadCompany) => {
    setIsGeneratingProposal(true);
    setSelectedLeadId(lead.id);
    
    setTimeout(() => {
      const cityTechs = technicians.filter(t => t.city.toLowerCase() === lead.city.toLowerCase());
      const availableTechsCount = cityTechs.length || 3;
      const specialtiesInCity = Array.from(new Set(technicians.flatMap(t => t.specialties))).slice(0, 3).join(", ");
      
      const brief = `⚡ [NEXORA INSIGHTS - PROPOSTA AUTOMÁTICA]
Proposta Comercial Personalizada para: ${lead.name}
Localidade: ${lead.city} - ${lead.state}

Resumo do Potencial Técnico Regional:
• Identificamos ${availableTechsCount} técnicos credenciados ativos na região de ${lead.city} especializados em ${lead.segment}.
• Capacitação de destaque local: NR10 e NR35 certificadas, prontos para SLA em até 4 horas.

Proposta de Operação sob Demanda:
• Valor Estimado por Chamado: R$ 380,00 - R$ 620,00 (dependendo da complexidade do checklist).
• Plataforma: Sem custo fixo mensal. Comissão Nexora inclusa em formato de taxa de intermediação de 15%.
• Diferencial sugerido no Pitch: Demonstrar o laudo técnico automático em PDF gerado por IA que elimina 100% de preenchimento manual do técnico em campo.

Próximos Passos recomendados:
1. Agendar uma videoconferência de 15 min para demonstrar o painel da Empresa.
2. Cadastrar uma primeira ordem de serviço em ambiente Sandbox para o cliente testar o matching automático.`;

      setAiProposalText(brief);
      setIsGeneratingProposal(false);
    }, 1500);
  };

  // Filtered Leads list
  const filteredLeads = leadCompanies.filter(l => 
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.city.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.segment.toLowerCase().includes(leadSearch.toLowerCase())
  );

  // Statistics Computations
  const totalPipelineVal = leadCompanies
    .filter(l => l.contactStatus !== 'Cliente' && l.contactStatus !== 'Sem_Interesse')
    .reduce((sum, l) => sum + (l.estimatedValue || 3000), 0);

  const closedDealsVal = leadCompanies
    .filter(l => l.contactStatus === 'Cliente')
    .reduce((sum, l) => sum + (l.estimatedValue || 4000), 0);

  const conversionRate = Math.round(
    (leadCompanies.filter(l => l.contactStatus === 'Cliente').length / (leadCompanies.length || 1)) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      
      {/* Upper Role Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a0d1e] p-6 rounded-3xl border border-[#172042] text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Painel do Executivo Comercial
            </span>
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Pipeline de Vendas & Prospecção IA
          </h2>
          <p className="text-xs text-slate-400">
            Acompanhe o funil de vendas, gerencie reuniões de demonstração e elabore propostas automatizadas com IA.
          </p>
        </div>

        <div className="flex bg-[#12162a] p-1 rounded-xl border border-[#202952] gap-1 text-xs">
          <button
            onClick={() => setActiveSubTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'pipeline' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Pipeline & CRM
          </button>
          <button
            onClick={() => setActiveSubTab('meetings')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'meetings' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Reuniões & Demonstrações
          </button>
          <button
            onClick={() => setActiveSubTab('growth_engine')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'growth_engine' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Growth Sourcing Engine
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Pipeline */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm text-slate-800">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Pipeline Ativo</span>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-black font-display text-slate-900 mt-1">
            R$ {totalPipelineVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1.5">Estimado em negociações abertas</p>
        </div>

        {/* Closed Deals */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm text-slate-800">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Faturamento Convertido</span>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black font-display text-emerald-600 mt-1">
            R$ {closedDealsVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1.5">Faturamento recorrente anualizado estim.</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm text-slate-800">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Taxa de Conversão</span>
            <Award className="h-4 w-4 text-purple-500" />
          </div>
          <h3 className="text-2xl font-black font-display text-slate-900 mt-1">
            {conversionRate}%
          </h3>
          <p className="text-[10px] text-slate-500 mt-1.5">Média nacional do SaaS Nexora</p>
        </div>

        {/* Pending Meetings */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm text-slate-800">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Demonstrações Agendadas</span>
            <Calendar className="h-4 w-4 text-cyan-500" />
          </div>
          <h3 className="text-2xl font-black font-display text-slate-900 mt-1">
            {leadCompanies.filter(l => l.contactStatus === 'Demonstracao_Agendada').length}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1.5">Videoconferências de ativação esta semana</p>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeSubTab === 'pipeline' && (
        <div className="space-y-6">
          
          {/* Sourcing Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center text-slate-800">
            <div className="relative w-full md:w-72">
              <input 
                type="text" 
                placeholder="Filtrar por nome, cidade, segmento..."
                value={leadSearch}
                onChange={e => setLeadSearch(e.target.value)}
                className="w-full text-xs p-2.5 pl-8 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <TrendingUp className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-3.5" />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => setShowAddLeadModal(true)}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Lead de Empresa</span>
              </button>
            </div>
          </div>

          {/* CRM Kanban Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-slate-800">
            
            {/* COLUMN 1: Interessados / Leads */}
            <div className="bg-slate-50/60 p-4 rounded-3xl border border-slate-200/50 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-2 mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                  Leads Qualificados ({filteredLeads.filter(l => l.contactStatus === 'Interessado').length})
                </h4>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredLeads.filter(l => l.contactStatus === 'Interessado').map(lead => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onAdvance={() => handleAdvanceLead(lead.id, 'Interessado')}
                    onScheduleMeeting={() => setMeetingLeadId(lead.id)}
                    onGenerateProposal={() => handleGenerateAiProposal(lead)}
                  />
                ))}
              </div>
            </div>

            {/* COLUMN 2: Demonstração Agendada */}
            <div className="bg-slate-50/60 p-4 rounded-3xl border border-slate-200/50 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-2 mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-indigo-500 rounded-full"></span>
                  Apresentação / Demo ({filteredLeads.filter(l => l.contactStatus === 'Demonstracao_Agendada').length})
                </h4>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredLeads.filter(l => l.contactStatus === 'Demonstracao_Agendada').map(lead => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onAdvance={() => handleAdvanceLead(lead.id, 'Demonstracao_Agendada')}
                    onScheduleMeeting={() => setMeetingLeadId(lead.id)}
                    onGenerateProposal={() => handleGenerateAiProposal(lead)}
                  />
                ))}
              </div>
            </div>

            {/* COLUMN 3: Em Negociação */}
            <div className="bg-slate-50/60 p-4 rounded-3xl border border-slate-200/50 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-2 mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-purple-500 rounded-full"></span>
                  Negociação Ativa ({filteredLeads.filter(l => l.contactStatus === 'Negociacao').length})
                </h4>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredLeads.filter(l => l.contactStatus === 'Negociacao').map(lead => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onAdvance={() => handleAdvanceLead(lead.id, 'Negociacao')}
                    onScheduleMeeting={() => setMeetingLeadId(lead.id)}
                    onGenerateProposal={() => handleGenerateAiProposal(lead)}
                  />
                ))}
              </div>
            </div>

            {/* COLUMN 4: Convertidos / Contrato Fechado */}
            <div className="bg-slate-50/60 p-4 rounded-3xl border border-slate-200/50 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-2 mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Clientes Ativos ({filteredLeads.filter(l => l.contactStatus === 'Cliente').length})
                </h4>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredLeads.filter(l => l.contactStatus === 'Cliente').map(lead => (
                  <div key={lead.id} className="p-4 bg-emerald-500/5 border border-emerald-200 rounded-2xl space-y-2 relative">
                    <div className="flex justify-between items-start">
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">CONVERTIDO</span>
                      <span className="text-slate-400 font-mono text-[9px]">{lead.city} - {lead.state}</span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 leading-tight">{lead.name}</h5>
                    <p className="text-[10px] text-slate-500">Segmento: {lead.segment} • CNPJ Validado</p>
                    <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between items-center">
                      <p className="text-[10px] font-bold text-emerald-600 font-mono">
                        R$ {(lead.estimatedValue || 3000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <span className="text-[9px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Operando FSM
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* AI Pre-reunião & Proposal Insights box */}
          {selectedLeadId && (
            <div className="bg-[#0b0f1d] border border-indigo-950/80 p-6 rounded-3xl text-white space-y-4 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Sparkles className="h-32 w-32 text-indigo-400" />
              </div>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                    <h4 className="text-sm font-bold font-display text-indigo-200">
                      Nexora AI Pitch Writer & Regional Sourcing Brief
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Sua secretária inteligente de vendas analisa a infraestrutura de técnicos na cidade do lead para subsidiar seu pitch de fechamento.
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedLeadId(null)}
                  className="text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Fechar [X]
                </button>
              </div>

              {isGeneratingProposal ? (
                <div className="flex items-center gap-2 text-xs text-slate-400 justify-center py-8">
                  <div className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>IA analisando base de técnicos disponíveis em {filteredLeads.find(l => l.id === selectedLeadId)?.city}...</span>
                </div>
              ) : (
                <pre className="text-xs bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {aiProposalText}
                </pre>
              )}
            </div>
          )}

        </div>
      )}

      {/* REUNIÕES & DEMONSTRAÇÕES TAB */}
      {activeSubTab === 'meetings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-800">
          
          {/* Scheduling list */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-950 flex items-center gap-1.5">
              <Calendar className="h-4.5 w-4.5 text-indigo-600" />
              Agenda de Videoconferências Ativas
            </h3>
            
            <div className="space-y-3">
              {leadCompanies.filter(l => l.contactStatus === 'Demonstracao_Agendada').length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Nenhuma reunião agendada no pipeline. Vá para a aba Pipeline de Vendas e clique em "Registrar Reunião" para cadastrar.
                </p>
              ) : (
                leadCompanies
                  .filter(l => l.contactStatus === 'Demonstracao_Agendada')
                  .map(lead => (
                    <div key={lead.id} className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900">{lead.name}</h4>
                          <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full font-mono uppercase font-bold">DEMO</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Responsável: {lead.responsibleName} ({lead.responsibleRole})
                        </p>
                        <p className="text-[11px] text-indigo-600 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Agendada: {lead.demoDate ? lead.demoDate.replace('T', ' às ') : 'A definir'}</span>
                        </p>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto justify-end">
                        <button
                          onClick={() => {
                            // Advance directly to negotiation stage
                            handleAdvanceLead(lead.id, 'Demonstracao_Agendada');
                            alert(`Demonstração executada com sucesso! O lead ${lead.name} foi movido para a etapa de "Negociação".`);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Concluir e Ir p/ Negociação</span>
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Schedulers sandbox */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-950 flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-indigo-600" />
              Agendar Nova Videoconferência
            </h3>

            <form onSubmit={handleScheduleMeeting} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Selecione o Lead</label>
                <select
                  required
                  value={meetingLeadId || ""}
                  onChange={e => setMeetingLeadId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 bg-slate-50"
                >
                  <option value="">-- Escolha um prospecto qualificado --</option>
                  {leadCompanies
                    .filter(l => l.contactStatus === 'Interessado')
                    .map(l => (
                      <option key={l.id} value={l.id}>{l.name} ({l.city})</option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Data</label>
                  <input 
                    type="date" 
                    required
                    value={meetingDate}
                    onChange={e => setMeetingDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Horário</label>
                  <input 
                    type="time" 
                    required
                    value={meetingTime}
                    onChange={e => setMeetingTime(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Observações / Pauta</label>
                <textarea 
                  placeholder="Ex: Demonstrar painel multi-unidades, discutir comissões..."
                  value={meetingNotes}
                  onChange={e => setMeetingNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 bg-slate-50 h-20 resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md"
              >
                Registrar Reunião no Pipeline
              </button>
            </form>
          </div>

        </div>
      )}

      {/* AI GROWTH SOURCING ENGINE TAB */}
      {activeSubTab === 'growth_engine' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-800">
          
          {/* Sourcing explanation & triggers */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-gradient-to-br from-[#070b19] to-[#0e1634] p-6 rounded-3xl text-white border border-[#1b2654]/60 shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
                <h3 className="text-md font-bold font-display">Neural Lead Scraping & Verification (Growth Sourcing)</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nossa IA comercial varre periodicamente redes corporativas, mapas e registros de infraestrutura de telecomunicações públicas para detectar operadoras locais, provedores regionais (ISPs), e redes de farmácias, mercados ou usinas solares necessitando de serviços de campo.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/60">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Critério de Filtro para Empresas</span>
                  <p className="text-xs font-semibold text-slate-300">ISPs Regionais, Usinas Solares, Monitoramento Patrimonial</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Critério de Filtro para Técnicos</span>
                  <p className="text-xs font-semibold text-slate-300">Certificados CFTV, Fibra Óptica, Elétrica de Alta Tensão</p>
                </div>
              </div>

              <div className="pt-4 flex flex-col md:flex-row gap-2">
                <button
                  onClick={() => {
                    const currentCount = leadCompanies.length;
                    const mockedScraped = [
                      {
                        id: `lead-scraped-c-${Date.now()}`,
                        name: "Vanguarda Telecom Fibra",
                        segment: "Telecom",
                        city: "Maceió",
                        state: "AL",
                        size: "Média" as const,
                        ratingStars: 4,
                        contactChannel: "WhatsApp",
                        contactStatus: "Interessado" as const,
                        phone: "(82) 99312-7643",
                        email: "compras@vanguardafibra.com.br",
                        responsibleName: "Sérgio Mendes",
                        responsibleRole: "Gerente de Engenharia",
                        estimatedValue: 5500,
                        createdAt: new Date().toISOString(),
                        historyLogs: [
                          { timestamp: new Date().toISOString(), message: "IA detectou infraestrutura de fibra crescendo em Maceió via registros públicos.", type: "system" }
                        ]
                      }
                    ];
                    setLeadCompanies(prev => [...mockedScraped, ...prev]);
                    onAddAuditLog({
                      type: 'growth',
                      message: `Growth Engine: Capturado 1 novo lead de Empresa qualificada em Maceió/AL via Social Sourcing.`
                    });
                    alert("Sucesso! Capturado 1 novo lead em Maceió/AL: Vanguarda Telecom Fibra.");
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-indigo-200 animate-pulse" />
                  <span>Sondar Empresas em Novos Estados 🌐</span>
                </button>

                <button
                  onClick={() => {
                    const mockedScrapedTech = {
                      id: `lead-scraped-t-${Date.now()}`,
                      name: "Ricardo Fonseca Pinheiro",
                      city: "Porto Alegre",
                      state: "RS",
                      specialty: "Solar",
                      experienceYears: 7,
                      phone: "(51) 98321-4567",
                      email: "ricardo.solar@live.com",
                      classification: "Pleno" as const,
                      status: "Encontrado" as const,
                      onboardingPendingDocs: ["Certidão Reg. Técnico"],
                      createdAt: new Date().toISOString()
                    };
                    setLeadTechs(prev => [mockedScrapedTech, ...prev]);
                    onAddAuditLog({
                      type: 'growth',
                      message: `Growth Engine: Localizado profissional técnico certificado em Porto Alegre/RS.`
                    });
                    alert("Sucesso! Localizado técnico certificado em Porto Alegre/RS: Ricardo Fonseca Pinheiro.");
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/10 cursor-pointer"
                >
                  <Users className="h-4 w-4 text-purple-200" />
                  <span>Sondar Técnicos Certificados 🛠️</span>
                </button>
              </div>
            </div>

            {/* Scraped Leads list preview */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
              <h3 className="text-sm font-bold font-display text-slate-950">Histórico de Prospecção Recente</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {leadCompanies.map(l => (
                  <div key={l.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800">{l.name}</h4>
                      <p className="text-[10px] text-slate-400">{l.city}/{l.state} • Responsável: {l.responsibleName || 'Não contatado'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-mono text-slate-800">R$ {(l.estimatedValue || 3000).toLocaleString('pt-BR')}</p>
                      <span className="text-[10px] text-indigo-600 font-bold uppercase">{l.contactStatus.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick onboarding panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-950 flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-indigo-600" />
              Técnicos em Homologação
            </h3>
            
            <p className="text-xs text-slate-500">
              Profissionais prospectados ou indicados que estão na fila de envio e verificação de documentos de compliance técnico.
            </p>

            <div className="space-y-3">
              {leadTechs.filter(t => t.status !== 'Cadastro_Concluido').map(tech => (
                <div key={tech.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-slate-950 leading-tight">{tech.name}</h4>
                    <span className="text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold font-mono">{tech.classification}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{tech.city} - {tech.state} • Exp: {tech.experienceYears} anos</p>
                  
                  {tech.onboardingPendingDocs && tech.onboardingPendingDocs.length > 0 && (
                    <div className="text-[9px] text-red-500 font-semibold bg-red-50 p-1.5 rounded">
                      Documento pendente: {tech.onboardingPendingDocs.join(", ")}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <span className="text-[9px] text-slate-400">Status: {tech.status.replace('_', ' ')}</span>
                    <button
                      onClick={() => {
                        setLeadTechs(prev => prev.map(t => {
                          if (t.id === tech.id) {
                            return { ...t, status: 'Cadastro_Concluido', onboardingPendingDocs: [] };
                          }
                          return t;
                        }));
                        alert(`Sucesso! O técnico ${tech.name} foi validado e homologado para atuar no marketplace.`);
                      }}
                      className="text-[9px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2 py-1 rounded transition-all cursor-pointer"
                    >
                      Aprovar Documentos
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 space-y-4 text-slate-800">
            <h3 className="text-md font-bold font-display text-slate-950">Cadastrar Novo Prospecto Comercial</h3>
            
            <form onSubmit={handleAddLeadCompany} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Nome da Empresa</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Prime Redes Corporativas" 
                  value={newLeadName}
                  onChange={e => setNewLeadName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 mt-1 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Cidade</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Salvador" 
                    value={newLeadCity}
                    onChange={e => setNewLeadCity(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 mt-1 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Estado</label>
                  <select
                    value={newLeadState}
                    onChange={e => setNewLeadState(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 mt-1 bg-slate-50"
                  >
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="MG">MG</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Segmento</label>
                  <select
                    value={newLeadSegment}
                    onChange={e => setNewLeadSegment(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 mt-1 bg-slate-50"
                  >
                    <option value="Telecom">Telecom</option>
                    <option value="Solar">Energia Solar</option>
                    <option value="CFTV">CFTV / Monitoramento</option>
                    <option value="Elétrica">Elétrica</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Valor Estimado (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 5000" 
                    value={newLeadValue}
                    onChange={e => setNewLeadValue(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 mt-1 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">WhatsApp</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: (71) 99876-5432" 
                    value={newLeadContact}
                    onChange={e => setNewLeadContact(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 mt-1 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Nome Responsável</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Marcelo Abreu" 
                    value={newLeadRespName}
                    onChange={e => setNewLeadRespName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 mt-1 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddLeadModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10"
                >
                  Criar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Micro UI component for a Single Lead Card in Kanban Columns
function LeadCard({ 
  lead, 
  onAdvance, 
  onScheduleMeeting, 
  onGenerateProposal 
}: { 
  key?: React.Key;
  lead: LeadCompany; 
  onAdvance: () => void;
  onScheduleMeeting: () => any;
  onGenerateProposal: () => void;
}) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 hover:shadow-md transition-all relative">
      <div className="flex justify-between items-start">
        <span className="bg-indigo-50 text-indigo-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase font-mono tracking-wide">{lead.segment}</span>
        <span className="text-slate-400 font-mono text-[9px]">{lead.city}/{lead.state}</span>
      </div>
      <h5 className="font-bold text-xs text-slate-900 leading-tight">{lead.name}</h5>
      <p className="text-[10px] text-slate-500">Contato: {lead.responsibleName || lead.phone}</p>
      
      <div className="border-t border-slate-100 pt-2.5 mt-2 flex justify-between items-center">
        <p className="text-[10px] font-bold text-indigo-600 font-mono">
          R$ {(lead.estimatedValue || 3000).toLocaleString('pt-BR')}
        </p>
        
        <div className="flex gap-1">
          {/* AI Brief Trigger */}
          <button
            onClick={onGenerateProposal}
            title="Redigir Proposta com IA"
            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
          >
            <Sparkles className="h-4 w-4" />
          </button>

          {/* Meeting Scheduler trigger */}
          <button
            onClick={onScheduleMeeting}
            title="Agendar Reunião de Demonstração"
            className="p-1 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
          >
            <Calendar className="h-4 w-4" />
          </button>

          {/* Advance Step Trigger */}
          <button
            onClick={onAdvance}
            title="Avançar Estágio"
            className="bg-indigo-600 text-white p-1 rounded-lg hover:bg-indigo-700 transition-all cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
