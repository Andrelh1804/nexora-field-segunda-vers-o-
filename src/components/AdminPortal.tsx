import React, { useState } from "react";
import { 
  Company, Technician, Ticket, FinancialTransaction, AiAuditLog 
} from "../types";
import { 
  TrendingUp, Users, HardHat, FileText, DollarSign, 
  Map, Plus, Edit, Trash2, CheckCircle2, AlertTriangle, 
  RefreshCw, Search, Filter, ShieldCheck, Landmark, ChevronRight, Sparkles, LineChart, Coins, GitMerge, UserCheck, Activity, Loader2
} from "lucide-react";
import { CATEGORIES, SPECIALTIES, EQUIPMENTS } from "../data";
import AdminPlansManager from "./AdminPlansManager";
import AdminCompliancePanel from "./AdminCompliancePanel";
import RealityAuditPanel from "./RealityAuditPanel";
import EnterprisePortal from "./EnterprisePortal";
import InfrastructurePanel from "./InfrastructurePanel";
import UserManagementPanel from "./UserManagementPanel";

interface AdminPortalProps {
  companies: Company[];
  technicians: Technician[];
  tickets: Ticket[];
  transactions: FinancialTransaction[];
  auditLogs: AiAuditLog[];
  referrals: any[];
  leadCompanies: any[];
  leadTechs: any[];
  setReferrals: React.Dispatch<React.SetStateAction<any[]>>;
  setLeadCompanies: React.Dispatch<React.SetStateAction<any[]>>;
  setLeadTechs: React.Dispatch<React.SetStateAction<any[]>>;
  onAddCompany: (comp: Omit<Company, 'id'>) => void;
  onAddTechnician: (tech: Omit<Technician, 'id' | 'completedJobsCount' | 'reviewsCount' | 'rating' | 'documentsApproved' | 'signedContract'>) => void;
  onUpdateTicketStatus: (ticketId: string, status: any) => void;
  onReassignTech: (ticketId: string, techId: string) => void;
  onCancelTicket: (ticketId: string) => void;
  onReopenTicket: (ticketId: string) => void;
}

export default function AdminPortal({
  companies,
  technicians,
  tickets,
  transactions,
  auditLogs,
  referrals,
  leadCompanies,
  leadTechs,
  setReferrals,
  setLeadCompanies,
  setLeadTechs,
  onAddCompany,
  onAddTechnician,
  onUpdateTicketStatus,
  onReassignTech,
  onCancelTicket,
  onReopenTicket
}: AdminPortalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'dash' | 'cadastro' | 'chamados' | 'financeiro' | 'logs' | 'growth' | 'bi' | 'plans' | 'compliance' | 'reality' | 'enterprise' | 'infra'>('dash');
  
  // Search & Filter state for tickets
  const [ticketFilterSearch, setTicketFilterSearch] = useState("");
  const [ticketFilterStatus, setTicketFilterStatus] = useState("all");
  const [ticketFilterUrgency, setTicketFilterUrgency] = useState("all");

  // Registration Form State (Company)
  const [newCompName, setNewCompName] = useState("");
  const [newCompSegment, setNewCompSegment] = useState("Telecom");
  const [newCompCNPJ, setNewCompCNPJ] = useState("");
  const [newCompCity, setNewCompCity] = useState("");
  const [newCompState, setNewCompState] = useState("SP");
  const [newCompEmail, setNewCompEmail] = useState("");
  const [newCompPhone, setNewCompPhone] = useState("");

  // Registration Form State (Technician)
  const [newTechName, setNewTechName] = useState("");
  const [newTechCPF, setNewTechCPF] = useState("");
  const [newTechEmail, setNewTechEmail] = useState("");
  const [newTechPhone, setNewTechPhone] = useState("");
  const [newTechCity, setNewTechCity] = useState("Campinas");
  const [newTechState, setNewTechState] = useState("SP");
  const [newTechSpecialties, setNewTechSpecialties] = useState<string[]>([]);
  const [newTechEquipments, setNewTechEquipments] = useState<string[]>([]);
  const [newTechRadius, setNewTechRadius] = useState(30);

  // Reassignment active ticket modal
  const [reassignTicketId, setReassignTicketId] = useState<string | null>(null);

  // Stats calculation
  const totalFaturamento = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
  const totalCommission = transactions.reduce((acc, t) => acc + t.platformEarnings, 0);
  const totalTechPayout = transactions.reduce((acc, t) => acc + t.techPayout, 0);
  const openTickets = tickets.filter(t => t.status !== 'Finalizado' && t.status !== 'Cancelado').length;
  const closedTickets = tickets.filter(t => t.status === 'Finalizado').length;
  const onlineTechs = technicians.filter(t => t.status === 'online').length;

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName || !newCompCNPJ) return;
    onAddCompany({
      name: newCompName,
      email: newCompEmail || "contato@empresa.com",
      phone: newCompPhone || "(11) 9000-0000",
      cnpj: newCompCNPJ,
      city: newCompCity || "São Paulo",
      state: newCompState,
      avatar: `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop`,
      segment: newCompSegment
    });
    // Reset
    setNewCompName("");
    setNewCompCNPJ("");
    setNewCompCity("");
    setNewCompEmail("");
    setNewCompPhone("");
    alert("Empresa cadastrada com sucesso!");
  };

  const handleCreateTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName || !newTechCPF) return;
    onAddTechnician({
      name: newTechName,
      cpf: newTechCPF,
      rg: "MG-12.345.678",
      birthDate: "1992-05-15",
      email: newTechEmail || "tecnico@email.com",
      phone: newTechPhone || "(19) 9999-9999",
      whatsapp: newTechPhone || "(19) 9999-9999",
      city: newTechCity,
      state: newTechState,
      cep: "13000-000",
      address: "Rua das Flores, 100",
      avatar: `https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop`,
      nr10: true,
      nr35: true,
      nr33: false,
      specialties: newTechSpecialties.length > 0 ? newTechSpecialties : ["CFTV"],
      equipment: newTechEquipments.length > 0 ? newTechEquipments : ["EPIs", "Ferramentas Manuais"],
      availabilityDays: ["Seg", "Ter", "Qua", "Qui", "Sex"],
      availabilityHours: "08:00 - 18:00",
      radiusKm: newTechRadius,
      latitude: -22.9068,
      longitude: -47.0616,
      pixKey: newTechCPF.replace(/\D/g, ""),
      pixType: "CPF",
      bankName: "Nubank",
      agency: "0001",
      accountNumber: "1234567-8",
      status: "online"
    });
    // Reset
    setNewTechName("");
    setNewTechCPF("");
    setNewTechEmail("");
    setNewTechPhone("");
    setNewTechSpecialties([]);
    setNewTechEquipments([]);
    alert("Técnico cadastrado com sucesso!");
  };

  const handleToggleSpecialty = (spec: string) => {
    if (newTechSpecialties.includes(spec)) {
      setNewTechSpecialties(newTechSpecialties.filter(s => s !== spec));
    } else {
      setNewTechSpecialties([...newTechSpecialties, spec]);
    }
  };

  const handleToggleEquipment = (eq: string) => {
    if (newTechEquipments.includes(eq)) {
      setNewTechEquipments(newTechEquipments.filter(e => e !== eq));
    } else {
      setNewTechEquipments([...newTechEquipments, eq]);
    }
  };

  // Filtered tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(ticketFilterSearch.toLowerCase()) ||
                          ticket.city.toLowerCase().includes(ticketFilterSearch.toLowerCase()) ||
                          ticket.category.toLowerCase().includes(ticketFilterSearch.toLowerCase());
    const matchesStatus = ticketFilterStatus === "all" || ticket.status === ticketFilterStatus;
    const matchesUrgency = ticketFilterUrgency === "all" || ticket.urgency === ticketFilterUrgency;
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Admin header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0c14] border border-slate-800/80 text-white p-6 rounded-3xl shadow-xl shadow-black/30">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-3 rounded-xl text-white shadow-lg shadow-indigo-600/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display">Painel de Administração Geral</h2>
            <p className="text-xs text-slate-400">Controle total da plataforma NexoraField, split financeiro e logs de IA.</p>
          </div>
        </div>
        <div className="flex bg-[#121622] p-1 rounded-xl border border-[#1d243a] gap-1 text-xs flex-wrap">
          <button
            onClick={() => setActiveSubTab('dash')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'dash' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveSubTab('cadastro')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'cadastro' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Cadastro
          </button>
          <button
            onClick={() => setActiveSubTab('chamados')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'chamados' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Chamados ({tickets.length})
          </button>
          <button
            onClick={() => setActiveSubTab('financeiro')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'financeiro' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Financeiro
          </button>
          <button
            onClick={() => setActiveSubTab('growth')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'growth' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            IA Growth CRM ⚡
          </button>
          <button
            onClick={() => setActiveSubTab('bi')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'bi' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Business Intelligence IA 📊
          </button>
          <button
            onClick={() => setActiveSubTab('plans')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'plans' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Planos & Assinaturas 💎
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'logs' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Logs de IA
          </button>
          <button
            onClick={() => setActiveSubTab('compliance')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'compliance' ? 'bg-indigo-600 text-white border border-indigo-500/30 shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Auditoria & Compliance 🛡️
          </button>
          <button
            onClick={() => setActiveSubTab('reality')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'reality' ? 'bg-[#9333ea] text-white border border-purple-500/30 shadow-md shadow-purple-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Realidade do Sistema ⚖️
          </button>
          <button
            onClick={() => setActiveSubTab('enterprise')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'enterprise' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-500/30 shadow-md shadow-emerald-600/10 animate-pulse' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Módulo Enterprise 🌐
          </button>
          <button
            onClick={() => setActiveSubTab('infra')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'infra' ? 'bg-gradient-to-r from-indigo-700 to-blue-700 text-white border border-indigo-500/30 shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Infraestrutura Enterprise ⚡
          </button>
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeSubTab === 'users' ? 'bg-gradient-to-r from-rose-700 to-pink-700 text-white border border-rose-500/30 shadow-md shadow-rose-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Gestão de Usuários 👥
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------------------- */}
      {/* 1. DASHBOARD VIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {activeSubTab === 'dash' && (
        <div className="space-y-6">
          {/* Main indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-[#0e111a] p-5 rounded-3xl border border-slate-800/80 shadow-lg shadow-black/20">
              <div className="flex justify-between items-start text-slate-400 mb-2">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Empresas</span>
                <Users className="h-4 w-4 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white font-display">{companies.length}</h3>
              <p className="text-[10px] text-emerald-400 font-mono mt-1">▲ 100% ativas</p>
            </div>
            <div className="bg-[#0e111a] p-5 rounded-3xl border border-slate-800/80 shadow-lg shadow-black/20">
              <div className="flex justify-between items-start text-slate-400 mb-2">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Técnicos</span>
                <HardHat className="h-4 w-4 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white font-display">{technicians.length}</h3>
              <p className="text-[10px] text-emerald-400 font-mono mt-1">▲ {onlineTechs} online</p>
            </div>
            <div className="bg-[#0e111a] p-5 rounded-3xl border border-slate-800/80 shadow-lg shadow-black/20">
              <div className="flex justify-between items-start text-slate-400 mb-2">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Faturamento</span>
                <DollarSign className="h-4 w-4 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white font-display">R$ {totalFaturamento.toFixed(2)}</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Total transacionado</p>
            </div>
            <div className="bg-[#0e111a] p-5 rounded-3xl border border-slate-800/80 shadow-lg shadow-black/20">
              <div className="flex justify-between items-start text-slate-400 mb-2">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Comissão Nexora</span>
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-indigo-400 font-display">R$ {totalCommission.toFixed(2)}</h3>
              <p className="text-[10px] text-indigo-400 font-mono mt-1">Taxa de 15% retida</p>
            </div>
            <div className="bg-[#0e111a] p-5 rounded-3xl border border-slate-800/80 shadow-lg shadow-black/20 col-span-2 lg:col-span-1">
              <div className="flex justify-between items-start text-slate-400 mb-2">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Chamados Ativos</span>
                <FileText className="h-4 w-4 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white font-display">{openTickets}</h3>
              <p className="text-[10px] text-orange-400 font-semibold mt-1">{closedTickets} concluídos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Live Interactive GPS map mockup */}
            <div className="bg-[#0e111a] p-5 rounded-3xl border border-slate-800/80 shadow-xl col-span-2 flex flex-col h-[350px]">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-200">Mapa de Cobertura Geográfica e Chamados (Campinas/SP)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[8px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-900/60 font-semibold">Atualizado em Tempo Real</span>
              </div>
              {/* Custom SVG Map with real technician positions and ticket coordinates */}
              <div className="flex-1 bg-[#05060a] rounded-xl relative overflow-hidden border border-slate-850 flex items-center justify-center">
                {/* SVG lines mimicking a map grid */}
                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 0,50 L 500,50 M 0,150 L 500,150 M 0,250 L 500,250" stroke="white" strokeWidth="1" />
                  <path d="M 50,0 L 50,350 M 150,0 L 150,350 M 250,0 L 250,350" stroke="white" strokeWidth="1" />
                  <circle cx="200" cy="150" r="80" stroke="cyan" strokeWidth="1" fill="none" />
                </svg>

                {/* Pulsing local hotspots representing active tickets */}
                {tickets.map((t, idx) => {
                  const isCampinas = t.city.toLowerCase() === "campinas";
                  // map coordinates to local relative offsets
                  const top = isCampinas ? (120 + (idx * 25)) : (80 + (idx * 40));
                  const left = isCampinas ? (180 + (idx * 30)) : (220 - (idx * 20));
                  const statusColors: Record<string, string> = {
                    'Aberto': 'bg-blue-500',
                    'Em_Andamento': 'bg-yellow-500 animate-pulse',
                    'Finalizado': 'bg-emerald-500',
                    'Convites_Enviados': 'bg-purple-500'
                  };
                  const color = statusColors[t.status] || 'bg-slate-400';

                  return (
                    <div 
                      key={t.id} 
                      className="absolute group cursor-pointer"
                      style={{ top: `${top}px`, left: `${left}px` }}
                    >
                      <span className={`absolute -inset-1.5 ${color} rounded-full opacity-40 animate-ping`}></span>
                      <span className={`h-3.5 w-3.5 ${color} rounded-full border border-white block`}></span>
                      {/* Tooltip */}
                      <div className="absolute left-5 -top-4 bg-[#0a0d16] border border-slate-800 text-white rounded p-2 text-[9px] w-44 hidden group-hover:block z-10 shadow-lg">
                        <strong className="block">{t.title}</strong>
                        <span className="block text-slate-300">Status: {t.status}</span>
                        <span className="block text-slate-300">Urgência: {t.urgency}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Technicians dots on map */}
                {technicians.map((tech, idx) => {
                  const top = 140 - (idx * 35) + 60;
                  const left = 130 + (idx * 55);
                  return (
                    <div 
                      key={tech.id} 
                      className="absolute group cursor-pointer"
                      style={{ top: `${top}px`, left: `${left}px` }}
                    >
                      <span className="absolute -inset-2 bg-emerald-500 rounded-full opacity-20 animate-pulse"></span>
                      <img 
                        src={tech.avatar} 
                        alt={tech.name} 
                        className="h-6 w-6 rounded-full border-2 border-emerald-500 object-cover" 
                      />
                      {/* Tooltip */}
                      <div className="absolute left-7 -top-4 bg-[#0a0d16] border border-slate-800 text-white rounded p-2 text-[9px] w-40 hidden group-hover:block z-10 shadow-lg">
                        <strong className="block text-emerald-400">{tech.name}</strong>
                        <span className="block text-slate-300">Class: {tech.rating} ★ ({tech.completedJobsCount} serviços)</span>
                        <span className="block text-slate-300">Espec: {tech.specialties[0]}</span>
                      </div>
                    </div>
                  );
                })}

                <div className="absolute bottom-3 left-3 bg-[#0a0c14]/95 border border-slate-800 text-white p-2.5 rounded-lg text-[9px] space-y-1">
                  <span className="font-bold block uppercase tracking-wider text-slate-400">LEGENDA DO MAPA</span>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block"></span> Chamado Aberto</div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-yellow-500 inline-block"></span> Serviço Em Andamento</div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block"></span> Chamado Finalizado</div>
                  <div className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-full border-2 border-emerald-500 inline-block"></span> Técnico Online</div>
                </div>
              </div>
            </div>

            {/* Platform rules / summary */}
            <div className="bg-[#0e111a] p-5 rounded-3xl border border-slate-800/80 shadow-xl flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 mb-3 uppercase tracking-wider font-mono">Regras de Split & Comissões</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5">
                    <div className="bg-indigo-950/60 text-indigo-400 border border-indigo-900/40 p-1.5 rounded-lg mt-0.5">
                      <Landmark className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">Taxa de Intermediação Fixa</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">A NexoraField retém 15% de comissão operacional de todos os chamados faturados. O repasse técnico de 85% é depositado via PIX ou conta digital de forma instantânea após a aprovação de laudo.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="bg-cyan-950/60 text-cyan-400 border border-cyan-900/40 p-1.5 rounded-lg mt-0.5">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">Segurança de Pagamento Retido</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">O valor acordado do chamado é transferido pela empresa contratante no ato de aprovação da alocação e retido pela plataforma de forma segura até que o técnico envie as evidências fotográficas e de check-out.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick statistics */}
              <div className="bg-[#07090e] p-3.5 rounded-xl border border-slate-800/80 mt-4 text-xs font-mono space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Taxa de Aceite:</span>
                  <span className="font-bold text-slate-200">92.4%</span>
                </div>
                <div className="flex justify-between">
                  <span>Média de Resposta IA:</span>
                  <span className="font-bold text-slate-200">1.2 segundos</span>
                </div>
                <div className="flex justify-between">
                  <span>Auditorias de Fraude Ativas:</span>
                  <span className="font-bold text-red-600">{tickets.filter(t => t.fraudAlerts && t.fraudAlerts.length > 0).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* 2. REGISTRATION (CADASTRO) VIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {activeSubTab === 'cadastro' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company form */}
          <div className="bg-[#0e111a] p-5 rounded-3xl border border-slate-800/80 shadow-xl space-y-4">
            <div className="border-b border-slate-800/60 pb-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span>Cadastrar Nova Empresa Parceira (SaaS)</span>
              </h4>
              <p className="text-[11px] text-slate-400">Insira empresas nacionais que precisam abrir chamados operacionais.</p>
            </div>
            <form onSubmit={handleCreateCompany} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Razão Social / Nome Fantasia *</label>
                <input
                  type="text"
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  placeholder="Ex: Vivo Telefônica Brasil"
                  className="w-full bg-[#07090e] border border-slate-800/85 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">CNPJ *</label>
                  <input
                    type="text"
                    value={newCompCNPJ}
                    onChange={(e) => setNewCompCNPJ(e.target.value)}
                    placeholder="00.000.000/0000-00"
                    className="w-full bg-[#07090e] border border-slate-800/85 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Segmento Principal</label>
                  <select
                    value={newCompSegment}
                    onChange={(e) => setNewCompSegment(e.target.value)}
                    className="w-full bg-[#07090e] border border-slate-800/85 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  >
                    <option value="Telecom">Telecom</option>
                    <option value="Energia Solar">Energia Solar</option>
                    <option value="Segurança Eletrônica">Segurança Eletrônica</option>
                    <option value="Manutenção de Climatização">Ar Condicionado</option>
                    <option value="Facilities">Facilities</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={newCompCity}
                    onChange={(e) => setNewCompCity(e.target.value)}
                    placeholder="Campinas"
                    className="w-full bg-[#07090e] border border-slate-800/85 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Estado</label>
                  <input
                    type="text"
                    value={newCompState}
                    onChange={(e) => setNewCompState(e.target.value)}
                    placeholder="SP"
                    className="w-full bg-[#07090e] border border-slate-800/85 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">E-mail Corporativo</label>
                  <input
                    type="email"
                    value={newCompEmail}
                    onChange={(e) => setNewCompEmail(e.target.value)}
                    placeholder="chamados@telefonica.com"
                    className="w-full bg-[#07090e] border border-slate-800/85 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Telefone / Celular</label>
                  <input
                    type="text"
                    value={newCompPhone}
                    onChange={(e) => setNewCompPhone(e.target.value)}
                    placeholder="(11) 98000-1111"
                    className="w-full bg-[#07090e] border border-slate-800/85 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Salvar Cadastro de Empresa</span>
              </button>
            </form>
          </div>

          {/* Technician form */}
          <div className="bg-[#0e111a] p-5 rounded-3xl border border-slate-800/80 shadow-xl space-y-4">
            <div className="border-b border-slate-800/60 pb-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span>Cadastrar Novo Técnico Especialista</span>
              </h4>
              <p className="text-[11px] text-slate-400">Insira técnicos para a base operacional homologada.</p>
            </div>
            <form onSubmit={handleCreateTechnician} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    value={newTechName}
                    onChange={(e) => setNewTechName(e.target.value)}
                    placeholder="Alexandre Goulart"
                    className="w-full bg-[#07090e] border border-slate-800/85 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">CPF *</label>
                  <input
                    type="text"
                    value={newTechCPF}
                    onChange={(e) => setNewTechCPF(e.target.value)}
                    placeholder="111.222.333-44"
                    className="w-full bg-[#07090e] border border-slate-800/85 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={newTechEmail}
                    onChange={(e) => setNewTechEmail(e.target.value)}
                    placeholder="alexandre@gmail.com"
                    className="w-full bg-[#07090e] border border-slate-800/85 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Celular / WhatsApp</label>
                  <input
                    type="text"
                    value={newTechPhone}
                    onChange={(e) => setNewTechPhone(e.target.value)}
                    placeholder="(19) 98000-2222"
                    className="w-full bg-[#07090e] border border-slate-800/85 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Especialidades (Selecione)</label>
                <div className="flex flex-wrap gap-1.5 max-h-[70px] overflow-y-auto border border-slate-800/80 p-1.5 rounded-lg bg-[#07090e]">
                  {CATEGORIES.map(spec => (
                    <button
                      type="button"
                      key={spec}
                      onClick={() => handleToggleSpecialty(spec)}
                      className={`text-[9px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                        newTechSpecialties.includes(spec) 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-[#121622] text-slate-300 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Ferramentas / Equipamentos</label>
                <div className="flex flex-wrap gap-1.5 max-h-[70px] overflow-y-auto border border-slate-800/80 p-1.5 rounded-lg bg-[#07090e]">
                  {EQUIPMENTS.map(eq => (
                    <button
                      type="button"
                      key={eq}
                      onClick={() => handleToggleEquipment(eq)}
                      className={`text-[9px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                        newTechEquipments.includes(eq) 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-[#121622] text-slate-300 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {eq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Cidade Sede</label>
                  <input
                    type="text"
                    value={newTechCity}
                    onChange={(e) => setNewTechCity(e.target.value)}
                    className="w-full bg-[#07090e] border border-slate-800/85 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Estado</label>
                  <input
                    type="text"
                    value={newTechState}
                    onChange={(e) => setNewTechState(e.target.value)}
                    className="w-full bg-[#07090e] border border-slate-800/85 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Raio Atend. (KM)</label>
                  <input
                    type="number"
                    value={newTechRadius}
                    onChange={(e) => setNewTechRadius(Number(e.target.value))}
                    className="w-full bg-[#07090e] border border-slate-800/85 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Salvar Cadastro de Técnico</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* 3. TICKET MANAGEMENT VIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {activeSubTab === 'chamados' && (
        <div className="bg-[#0e111a] rounded-3xl border border-slate-800/80 shadow-xl overflow-hidden space-y-4 p-5">
          {/* Header & filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/60 pb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-200">Controle Operacional de Chamados</h4>
              <p className="text-[11px] text-slate-400">Gerencie todos os chamados abertos pelas empresas parceiras no Brasil.</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={ticketFilterSearch}
                  onChange={(e) => setTicketFilterSearch(e.target.value)}
                  placeholder="Buscar por título, cidade..."
                  className="bg-[#07090e] border border-slate-850 text-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 w-full sm:w-48"
                />
              </div>
              <select
                value={ticketFilterStatus}
                onChange={(e) => setTicketFilterStatus(e.target.value)}
                className="bg-[#07090e] border border-slate-850 text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="all">Todos Status</option>
                <option value="Aberto">Aberto</option>
                <option value="Convites_Enviados">Convites Enviados</option>
                <option value="Em_Andamento">Em Andamento</option>
                <option value="Aguardando_Aprovacao">Aguardando Aprovação</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
              <select
                value={ticketFilterUrgency}
                onChange={(e) => setTicketFilterUrgency(e.target.value)}
                className="bg-[#07090e] border border-slate-850 text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="all">Todas Urgências</option>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>
          </div>

          {/* Reassignment technician popover overlay */}
          {reassignTicketId && (
            <div className="bg-amber-950/20 border border-amber-900/60 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-inner">
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="h-5 w-5 text-amber-500 animate-pulse" />
                <div>
                  <strong className="text-amber-200">Troca Emergencial de Técnico</strong>
                  <p className="text-amber-300 text-[10px]">Escolha um profissional qualificado de forma manual para substituir o técnico atual do chamado.</p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      onReassignTech(reassignTicketId, e.target.value);
                      setReassignTicketId(null);
                    }
                  }}
                  className="bg-[#07090e] border border-slate-800 text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                >
                  <option value="">Selecione novo Técnico...</option>
                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.city} - {t.rating}★)</option>
                  ))}
                </select>
                <button
                  onClick={() => setReassignTicketId(null)}
                  className="text-xs text-amber-400 hover:underline px-2 py-1 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Tickets table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#07090e] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Chamado / Empresa</th>
                  <th className="py-3 px-4">Categoria / Cidade</th>
                  <th className="py-3 px-4">Urgência</th>
                  <th className="py-3 px-4">Técnico Alocado</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações Administrador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs text-slate-300">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500 italic">
                      Nenhum chamado encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map(ticket => {
                    const comp = companies.find(c => c.id === ticket.companyId);
                    const tech = technicians.find(t => t.id === ticket.assignedTechId);
                    return (
                      <tr key={ticket.id} className="hover:bg-[#121622]/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-100">{ticket.title}</div>
                          <div className="text-[10px] text-slate-500">{comp?.name || "Empresa Desconhecida"}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-300">{ticket.category} ({ticket.specialty})</div>
                          <div className="text-[10px] text-slate-500">{ticket.city} - {ticket.state}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                            ticket.urgency === 'Crítica' ? 'bg-red-950/80 text-red-400 border-red-900/40' :
                            ticket.urgency === 'Alta' ? 'bg-orange-950/80 text-orange-400 border-orange-900/40' :
                            'bg-[#121622] text-slate-300 border-slate-800/80'
                          }`}>
                            {ticket.urgency}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {tech ? (
                            <div className="flex items-center gap-2">
                              <img src={tech.avatar} alt={tech.name} className="h-5 w-5 rounded-full object-cover border border-slate-800" />
                              <div>
                                <span className="font-bold block text-slate-300">{tech.name}</span>
                                <span className="text-[9px] text-slate-500">{tech.whatsapp}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">Nenhum alocado</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            ticket.status === 'Finalizado' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-900/40' :
                            ticket.status === 'Em_Andamento' ? 'bg-yellow-950/80 text-yellow-400 border-yellow-900/40' :
                            ticket.status === 'Cancelado' ? 'bg-slate-900/80 text-slate-400 border-slate-800/40' :
                            'bg-blue-950/80 text-blue-400 border-blue-900/40'
                          }`}>
                            {ticket.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                          {/* Admin management action overrides */}
                          <button
                            onClick={() => setReassignTicketId(ticket.id)}
                            title="Trocar Técnico"
                            className="bg-amber-950/80 hover:bg-amber-900/80 text-amber-400 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-amber-900/40 transition-all cursor-pointer"
                          >
                            Trocar Técnico
                          </button>
                          {ticket.status === 'Finalizado' ? (
                            <button
                              onClick={() => onReopenTicket(ticket.id)}
                              className="bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-400 px-2 py-1 rounded-lg text-[10px] font-bold border border-indigo-900/40 transition-all cursor-pointer"
                            >
                              Reabrir
                            </button>
                          ) : ticket.status !== 'Cancelado' ? (
                            <button
                              onClick={() => onCancelTicket(ticket.id)}
                              className="bg-red-950/80 hover:bg-red-900/80 text-red-400 px-2 py-1 rounded-lg text-[10px] font-bold border border-red-900/40 transition-all cursor-pointer"
                            >
                              Cancelar
                            </button>
                          ) : (
                            <span className="text-slate-500 text-[10px] italic">Sem ações</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* 4. FINANCIAL LEDGER (FINANCEIRO) VIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {activeSubTab === 'financeiro' && (
        <div className="bg-[#0e111a] rounded-3xl border border-slate-800/80 shadow-xl overflow-hidden p-5 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-200">Razão Financeiro Geral e Splits de Pagamento</h4>
            <p className="text-[11px] text-slate-400">Demonstrativo das transações de campo nacionais, split automático de 15% retidos pela Nexora e 85% repassados via PIX ao técnico.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#07090e] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Transação ID</th>
                  <th className="py-3 px-4">Chamado Original</th>
                  <th className="py-3 px-4">Empresa (Origem)</th>
                  <th className="py-3 px-4">Técnico (Repasse PIX)</th>
                  <th className="py-3 px-4">Total Pago (100%)</th>
                  <th className="py-3 px-4">Taxa Nexora (15%)</th>
                  <th className="py-3 px-4">Repasse Técnico (85%)</th>
                  <th className="py-3 px-4">Status Split</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs text-slate-300">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-500 italic">
                      Nenhuma transação financeira processada ainda. Conclua chamados para ver os splits automáticos.
                    </td>
                  </tr>
                ) : (
                  transactions.map(t => (
                    <tr key={t.id} className="hover:bg-[#121622]/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-[10px] text-slate-500">{t.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-100">{t.ticketTitle}</td>
                      <td className="py-3 px-4 text-slate-300">{t.companyName}</td>
                      <td className="py-3 px-4 font-semibold text-slate-300">{t.techName}</td>
                      <td className="py-3 px-4 font-bold text-slate-100">R$ {t.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-4 font-bold text-indigo-400">R$ {t.platformEarnings.toFixed(2)}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">R$ {t.techPayout.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                          t.status === 'Pago' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-900/40' :
                          t.status === 'Retido' ? 'bg-amber-950/80 text-amber-400 border-amber-900/40' :
                          'bg-slate-900/80 text-slate-400 border-slate-800/40'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* 5. AI ENGINE LOGS VIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {activeSubTab === 'logs' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-indigo-500 rounded-full animate-ping"></span>
              <h4 className="text-sm font-bold text-slate-100 font-mono">Nexora AI Neural Audit Stream</h4>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Total logs: {auditLogs.length}</span>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto font-mono text-[11px] p-3 bg-slate-900 rounded-xl border border-slate-800">
            {auditLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-600 italic">
                Nenhuma atividade neural registrada no momento. Ative fluxos de chamados ou faça consultas à IA.
              </div>
            ) : (
              auditLogs.slice().reverse().map(log => {
                const logColors: Record<string, string> = {
                  'classification': 'text-cyan-400',
                  'matching': 'text-purple-400',
                  'report': 'text-emerald-400',
                  'fraud_check': 'text-red-400',
                  'assist': 'text-yellow-400',
                  'growth': 'text-pink-400'
                };
                const colorClass = logColors[log.type] || 'text-slate-300';
                return (
                  <div key={log.id} className="border-b border-slate-800/40 pb-2 flex gap-3 items-start">
                    <span className="text-slate-500 text-[10px]">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    <div>
                      <span className={`font-bold uppercase text-[9px] px-1.5 py-0.5 rounded bg-slate-800 ${colorClass} mr-2`}>
                        {log.type}
                      </span>
                      <span className="text-slate-200">{log.message}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 6. AI GROWTH ENGINE & CRM VIEW */}
      {activeSubTab === 'growth' && (
        <div className="space-y-6 text-slate-800 animate-fade-in">
          {/* Top Header Card */}
          <div className="bg-[#0c0f20] border border-[#1b2344] p-6 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="h-44 w-44 text-indigo-400" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <span className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Nexora growth engine v2.4 • Ativo
                </span>
                <h3 className="text-2xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                  CRM de Prospecção Inteligente & Indicações
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  A nossa IA varre registros públicos de empresas e portais técnicos nacionais para qualificar leads quentes, 
                  fazendo contato automatizado via WhatsApp corporativo e gerenciando a rede de indicações cruzadas (Referral Program).
                </p>
              </div>

              {/* Activation trigger button */}
              <button
                onClick={() => {
                  // Simulate executing neural prospecting
                  const currentLogsCount = auditLogs.length;
                  const newCompanyLeads = [
                    {
                      id: `lead-c-new-${Date.now()}-1`,
                      name: "Intelec Redes Integradas",
                      segment: "Telecom",
                      city: "Salvador",
                      state: "BA",
                      size: "Média",
                      ratingStars: 4,
                      contactChannel: "WhatsApp",
                      contactStatus: "Interessado",
                      phone: "(71) 99876-0000",
                      email: "suporte@intelec.com.br",
                      responsibleName: "Mário Ferreira",
                      responsibleRole: "Coordenador de TI",
                      estimatedValue: 4000,
                      historyLogs: [
                        { timestamp: new Date().toISOString(), message: "IA localizou empresa via dados de redes de fibra em Salvador.", type: "system" },
                        { timestamp: new Date().toISOString(), message: "IA enviou proposta de contratação de técnico sob demanda.", type: "ai" }
                      ],
                      createdAt: new Date().toISOString()
                    },
                    {
                      id: `lead-c-new-${Date.now()}-2`,
                      name: "Nordeste Solar S.A.",
                      segment: "Solar",
                      city: "Fortaleza",
                      state: "CE",
                      size: "Grande",
                      ratingStars: 5,
                      contactChannel: "E-mail",
                      contactStatus: "Demonstracao_Agendada",
                      phone: "(85) 98765-1111",
                      email: "om@nordestesolar.com.br",
                      responsibleName: "Cláudio Silva",
                      responsibleRole: "Diretor de Operações",
                      estimatedValue: 9000,
                      historyLogs: [
                        { timestamp: new Date().toISOString(), message: "IA catalogou lead via portfólio de usinas solares do Ceará.", type: "system" }
                      ],
                      createdAt: new Date().toISOString()
                    }
                  ];

                  const newTechLeads = [
                    {
                      id: `lead-t-new-${Date.now()}-1`,
                      name: "Felipe Mendes Cardoso",
                      city: "Curitiba",
                      state: "PR",
                      specialty: "CFTV",
                      experienceYears: 6,
                      phone: "(41) 97654-2222",
                      email: "felipe.cftv@gmail.com",
                      classification: "Pleno",
                      status: "Cadastro_Iniciado",
                      onboardingPendingDocs: ["Certificado NR10"],
                      createdAt: new Date().toISOString()
                    }
                  ];

                  setLeadCompanies(prev => [...newCompanyLeads, ...prev]);
                  setLeadTechs(prev => [...newTechLeads, ...prev]);

                  const newAuditLog: AiAuditLog = {
                    id: `log-growth-${Date.now()}`,
                    type: "growth",
                    message: "Algoritmo Neural de Prospecção executado. Localizados 2 novos leads de Empresas e 1 lead de Técnico qualificado.",
                    timestamp: new Date().toISOString()
                  };
                  // We manually add an audit log
                  auditLogs.push(newAuditLog);

                  alert("Sucesso! A inteligência artificial varreu portais públicos e importou 2 novas empresas interessadas (Salvador e Fortaleza) e 1 técnico certificado para o CRM de expansão comercial.");
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                <Sparkles className="h-4.5 w-4.5 animate-pulse text-indigo-200" />
                <span>Iniciar Prospecção Ativa IA 🚀</span>
              </button>
            </div>
          </div>

          {/* Indicators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Total Leads Empresas</p>
              <h3 className="text-2xl font-black text-slate-900 font-display mt-1">{leadCompanies.length}</h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold mt-2 inline-block">
                SDR Automatizado IA
              </span>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Total Leads Técnicos</p>
              <h3 className="text-2xl font-black text-slate-900 font-display mt-1">{leadTechs.length}</h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold mt-2 inline-block">
                Onboarding Pipeline
              </span>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Indicações Registradas</p>
              <h3 className="text-2xl font-black text-slate-900 font-display mt-1">{referrals.length}</h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold mt-2 inline-block">
                {referrals.filter(r => r.status === 'completed').length} Concluídas
              </span>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Faturamento sob Indicação</p>
              <h3 className="text-2xl font-black text-emerald-600 font-display mt-1">
                R$ {(referrals.filter(r => r.status === 'completed').length * 400).toFixed(2)}
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold mt-2 inline-block">
                Comissão Nexora gerada
              </span>
            </div>
          </div>

          {/* Funnel Layouts & Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Companies Funnel CRM */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold font-display text-slate-950 flex items-center gap-1.5">
                  <Activity className="h-4.5 w-4.5 text-indigo-600" />
                  Funil Comercial de Empresas
                </h4>
                <span className="text-[10px] text-slate-400 font-mono uppercase">Conversão em tempo real</span>
              </div>

              {/* Visual Funnel Bar representation */}
              <div className="space-y-2">
                {[
                  { stage: "Interessado", count: leadCompanies.filter(l => l.contactStatus === 'Interessado').length, width: "w-full", color: "bg-blue-500" },
                  { stage: "Demonstração Agendada", count: leadCompanies.filter(l => l.contactStatus === 'Demonstracao_Agendada').length, width: "w-11/12", color: "bg-indigo-500" },
                  { stage: "Em Negociação", count: leadCompanies.filter(l => l.contactStatus === 'Negociacao').length, width: "w-9/12", color: "bg-purple-500" },
                  { stage: "Convertido (Cliente)", count: leadCompanies.filter(l => l.contactStatus === 'Cliente').length, width: "w-7/12", color: "bg-emerald-500" },
                  { stage: "Sem Interesse / Opt-Out", count: leadCompanies.filter(l => l.contactStatus === 'Sem_Interesse').length, width: "w-3/12", color: "bg-slate-400" }
                ].map((step, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>{step.stage}</span>
                      <span>{step.count} leads</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className={`${step.color} h-full rounded-full ${step.width} opacity-90 transition-all duration-700`}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Leads list and Interactive Advancing tools */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold text-slate-900">Gerenciar Leads de Clientes</h5>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {leadCompanies.map(lead => (
                    <div key={lead.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 leading-none">{lead.name}</span>
                          <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono uppercase">{lead.segment}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {lead.city}/{lead.state} • Responsável: {lead.responsibleName || "A definir"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                          lead.contactStatus === 'Cliente' ? "bg-emerald-100 text-emerald-800" :
                          lead.contactStatus === 'Negociacao' ? "bg-purple-100 text-purple-800" :
                          lead.contactStatus === 'Demonstracao_Agendada' ? "bg-indigo-100 text-indigo-800" :
                          lead.contactStatus === 'Sem_Interesse' ? "bg-slate-200 text-slate-600" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {lead.contactStatus.replace('_', ' ')}
                        </span>

                        {lead.contactStatus !== 'Cliente' && lead.contactStatus !== 'Sem_Interesse' && (
                          <button
                            onClick={() => {
                              const order = ['Interessado', 'Demonstracao_Agendada', 'Negociacao', 'Cliente'];
                              const nextStatusMap: Record<string, string> = {
                                'Interessado': 'Demonstracao_Agendada',
                                'Demonstracao_Agendada': 'Negociacao',
                                'Negociacao': 'Cliente'
                              };
                              const nextStatus = nextStatusMap[lead.contactStatus] || 'Cliente';

                              setLeadCompanies(prev => prev.map(l => {
                                if (l.id === lead.id) {
                                  const updatedLogs = [...(l.historyLogs || [])];
                                  updatedLogs.push({
                                    timestamp: new Date().toISOString(),
                                    message: `Administrador alterou status de prospecção para: ${nextStatus}.`,
                                    type: 'system'
                                  });
                                  return { ...l, contactStatus: nextStatus as any, historyLogs: updatedLogs };
                                }
                                return l;
                              }));

                              // If advanced to 'Cliente', automatically accreditate them as a real company!
                              if (nextStatus === 'Cliente') {
                                onAddCompany({
                                  name: lead.name,
                                  email: lead.email || "suporte@leads.com.br",
                                  phone: lead.phone || "(11) 9999-9999",
                                  cnpj: lead.cnpj || "00.000.000/0001-00",
                                  city: lead.city,
                                  state: lead.state,
                                  avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop",
                                  segment: lead.segment
                                });
                                alert(`Fantástico! O lead ${lead.name} foi qualificado com sucesso e cadastrado como uma Empresa parceira ativa na plataforma!`);
                              }
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg transition-all flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Avançar</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lead Technicians - Onboarding Pipeline */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold font-display text-slate-950 flex items-center gap-1.5">
                  <GitMerge className="h-4.5 w-4.5 text-indigo-600" />
                  Funil de Onboarding de Técnicos
                </h4>
                <span className="text-[10px] text-slate-400 font-mono uppercase">Pipeline de homologação</span>
              </div>

              {/* Visual Funnel Bar representation */}
              <div className="space-y-2">
                {[
                  { stage: "Localizado (Social Sourcing)", count: leadTechs.filter(l => l.status === 'Encontrado').length, width: "w-full", color: "bg-blue-400" },
                  { stage: "Contatado (WhatsApp)", count: leadTechs.filter(l => l.status === 'Contatado').length, width: "w-10/12", color: "bg-indigo-400" },
                  { stage: "Cadastro Iniciado (Documentos)", count: leadTechs.filter(l => l.status === 'Cadastro_Iniciado').length, width: "w-8/12", color: "bg-purple-400" },
                  { stage: "Cadastro Concluído (Aprovado)", count: leadTechs.filter(l => l.status === 'Cadastro_Concluido').length, width: "w-6/12", color: "bg-emerald-400" }
                ].map((step, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>{step.stage}</span>
                      <span>{step.count} técnicos</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className={`${step.color} h-full rounded-full ${step.width} opacity-90 transition-all duration-700`}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lead Tech actions */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold text-slate-900">Gerenciar Homologação de Prestadores</h5>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {leadTechs.map(lead => (
                    <div key={lead.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 leading-none">{lead.name}</span>
                          <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono uppercase">{lead.classification}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {lead.city}/{lead.state} • Especialidade: {lead.specialty} • Exp: {lead.experienceYears} anos
                        </p>
                        {lead.onboardingPendingDocs && lead.onboardingPendingDocs.length > 0 && (
                          <p className="text-[9px] text-red-500 font-semibold mt-1">
                            Pendente: {lead.onboardingPendingDocs.join(", ")}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                          lead.status === 'Cadastro_Concluido' ? "bg-emerald-100 text-emerald-800" :
                          lead.status === 'Cadastro_Iniciado' ? "bg-purple-100 text-purple-800" :
                          lead.status === 'Contatado' ? "bg-indigo-100 text-indigo-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {lead.status.replace('_', ' ')}
                        </span>

                        {lead.status !== 'Cadastro_Concluido' && (
                          <button
                            onClick={() => {
                              const order = ['Encontrado', 'Contatado', 'Cadastro_Iniciado', 'Cadastro_Concluido'];
                              const nextStatusMap: Record<string, string> = {
                                'Encontrado': 'Contatado',
                                'Contatado': 'Cadastro_Iniciado',
                                'Cadastro_Iniciado': 'Cadastro_Concluido'
                              };
                              const nextStatus = nextStatusMap[lead.status] || 'Cadastro_Concluido';

                              setLeadTechs(prev => prev.map(l => {
                                if (l.id === lead.id) {
                                  return { 
                                    ...l, 
                                    status: nextStatus as any,
                                    onboardingPendingDocs: nextStatus === 'Cadastro_Concluido' ? [] : l.onboardingPendingDocs 
                                  };
                                }
                                return l;
                              }));

                              // If advanced to Cadastro_Concluido, automatically accredit them as a real technician!
                              if (nextStatus === 'Cadastro_Concluido') {
                                onAddTechnician({
                                  name: lead.name,
                                  cpf: "000.000.000-00",
                                  email: lead.email || "contato@prestador.com",
                                  phone: lead.phone || "(11) 9999-9999",
                                  city: lead.city,
                                  state: lead.state,
                                  specialties: [lead.specialty],
                                  equipment: ["EPIs", "Ferramentas"],
                                  availabilityDays: ["Seg", "Ter", "Qua", "Qui", "Sex"],
                                  availabilityHours: "08:00 - 18:00",
                                  radiusKm: 40,
                                  latitude: -23.5505,
                                  longitude: -46.6333,
                                  pixKey: "00000000000",
                                  pixType: "CPF",
                                  bankName: "Inter",
                                  agency: "0001",
                                  accountNumber: "999999-9",
                                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                                  status: "online",
                                  nr10: true,
                                  nr35: true,
                                  nr33: false
                                } as any);
                                alert(`Sucesso! O prestador ${lead.name} teve seus documentos aprovados eletronicamente e agora é um técnico ativo para chamados.`);
                              }
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg transition-all flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Aprovar Etapa</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Referral Auditing Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h4 className="text-sm font-bold font-display text-slate-950 flex items-center gap-1.5">
                <Coins className="h-4.5 w-4.5 text-emerald-500" />
                Auditoria de Indicações (Referral Ledger)
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Balanço do programa de indicações cruzadas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] font-bold font-mono">
                    <th className="pb-2">Quem Indicou (Referrer)</th>
                    <th className="pb-2">Parceiro Indicado (Referred)</th>
                    <th className="pb-2">Tipo de Cadastro</th>
                    <th className="pb-2">Data do Convite</th>
                    <th className="pb-2">Status do Fluxo</th>
                    <th className="pb-2">Comissão Concedida</th>
                    <th className="pb-2">Recompensa Paga?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {referrals.map(ref => {
                    const techReferrer = technicians.find(t => t.id === ref.referrerId);
                    const compReferrer = companies.find(c => c.id === ref.referrerId);
                    const referrerName = techReferrer ? `${techReferrer.name} (Técnico)` : compReferrer ? `${compReferrer.name} (Empresa)` : "Administrador";

                    return (
                      <tr key={ref.id} className="hover:bg-slate-50/50">
                        <td className="py-3 font-bold text-slate-900">{referrerName}</td>
                        <td className="py-3">
                          <p className="font-bold text-slate-800">{ref.referredName}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{ref.referredEmailOrPhone}</span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                            ref.referredType === 'tech' ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                          }`}>
                            {ref.referredType === 'tech' ? "Técnico" : "Empresa"}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 font-mono">
                          {new Date(ref.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          {ref.status === 'completed' ? (
                            <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-1 rounded-full text-[10px] flex items-center gap-1 w-max">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Concluído
                            </span>
                          ) : (
                            <span className="bg-amber-50 text-amber-800 font-bold px-2 py-1 rounded-full text-[10px] flex items-center gap-1 w-max">
                              <Loader2 className="h-3 w-3 animate-spin text-amber-600" /> Pendente
                            </span>
                          )}
                        </td>
                        <td className="py-3 font-semibold text-slate-700">
                          {ref.referredType === 'tech' ? "R$ 50,00" : "R$ 100,00"}
                        </td>
                        <td className="py-3">
                          {ref.rewardPaid ? (
                            <span className="text-emerald-600 font-bold">Sim (PIX / Crédito)</span>
                          ) : (
                            <span className="text-slate-400">Não (Aguardando)</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* 7. BUSINESS INTELLIGENCE IA VIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {activeSubTab === 'bi' && <AdminBiDashboard tickets={tickets} technicians={technicians} companies={companies} transactions={transactions} leadCompanies={leadCompanies} />}

      {/* --------------------------------------------------------------------------------- */}
      {/* 8. PLANS & SUBSCRIPTIONS MANAGER VIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {activeSubTab === 'plans' && <AdminPlansManager companies={companies} technicians={technicians} />}

      {/* --------------------------------------------------------------------------------- */}
      {/* 9. AUDITING, COMPLIANCE & TRACEABILITY VIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {activeSubTab === 'compliance' && <AdminCompliancePanel />}

      {/* --------------------------------------------------------------------------------- */}
      {/* 10. REALITY VS SIMULATION AUDITING & TRUTHS PANEL */}
      {/* --------------------------------------------------------------------------------- */}
      {activeSubTab === 'reality' && <RealityAuditPanel />}

      {/* --------------------------------------------------------------------------------- */}
      {/* 11. ENTERPRISE SUITE (V4.0) */}
      {/* --------------------------------------------------------------------------------- */}
      {activeSubTab === 'enterprise' && <EnterprisePortal />}

      {activeSubTab === 'infra' && <InfrastructurePanel />}

      {/* --------------------------------------------------------------------------------- */}
      {/* 13. USER MANAGEMENT */}
      {/* --------------------------------------------------------------------------------- */}
      {activeSubTab === 'users' && (
        <div className="bg-[#0a0c14] border border-slate-800/60 rounded-2xl p-6">
          <UserManagementPanel />
        </div>
      )}
    </div>
  );
}

// Sub-component for Admin BI
interface BiDashboardProps {
  tickets: Ticket[];
  technicians: Technician[];
  companies: Company[];
  transactions: FinancialTransaction[];
  leadCompanies: any[];
}

function AdminBiDashboard({ tickets, technicians, companies, transactions, leadCompanies }: BiDashboardProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [answer, setAnswer] = useState<{ text: string; stats?: { label: string; value: string | number; percentage?: number }[] } | null>(null);

  const presetQuestions = [
    { id: "q1", text: "Qual estado cresce mais?", icon: "📈" },
    { id: "q2", text: "Qual técnico é mais produtivo?", icon: "🏆" },
    { id: "q3", text: "Qual empresa gera maior receita?", icon: "💰" },
    { id: "q4", text: "Qual categoria possui maior demanda?", icon: "⚙️" },
    { id: "q5", text: "Onde faltam técnicos?", icon: "📍" }
  ];

  const handleAsk = (questionId: string, text: string) => {
    setSelectedQuestion(questionId);
    setIsGenerating(true);
    setAnswer(null);

    setTimeout(() => {
      let responseText = "";
      let responseStats: { label: string; value: string | number; percentage?: number }[] = [];

      if (questionId === "q1") {
        const spTickets = tickets.filter(t => t.state === 'SP').length;
        const rjTickets = tickets.filter(t => t.state === 'RJ').length;
        const total = tickets.length || 1;

        responseText = `Análise de Expansão Territorial NexoraField:
O estado de **São Paulo (SP)** lidera de forma absoluta o crescimento de novas operações em campo, impulsionado pela alta densidade urbana e parcerias com ISPs regionais. 

Por outro lado, o **Rio de Janeiro (RJ)** exibe um crescimento firme em manutenção solar. A **Bahia (BA)** é o mercado emergente mais promissor, com alta taxa de conversão comercial no pipeline de prospecção comercial da IA.`;

        responseStats = [
          { label: "São Paulo (SP)", value: `${spTickets} chamados`, percentage: Math.round((spTickets / total) * 100) },
          { label: "Rio de Janeiro (RJ)", value: `${rjTickets} chamados`, percentage: Math.round((rjTickets / total) * 100) },
          { label: "Leads em Prospecção (BA)", value: `${leadCompanies.filter(l => l.state === 'BA').length} empresas`, percentage: 40 }
        ];
      } else if (questionId === "q2") {
        const topTech = technicians.reduce((max, t) => (t.completedJobsCount > max.completedJobsCount ? t : max), technicians[0] || { name: "Nenhum", completedJobsCount: 0, rating: 5 });
        
        responseText = `Relatório de Performance do Marketplace de Técnicos:
O técnico de maior produtividade homologado na plataforma é **${topTech.name}**. 

Ele se destaca pelo volume excepcional de chamados concluídos de forma perfeita (avaliação de **${topTech.rating} estrelas**), baixo índice de refação e SLA exemplar (tempo de resposta médio estimado em apenas 12 minutos). Isso gera alta retenção para as empresas contratantes.`;

        responseStats = [
          { label: `${topTech.name} - Chamados`, value: `${topTech.completedJobsCount} concluídos`, percentage: 100 },
          { label: "SLA Médio de Aceite", value: "11 min", percentage: 95 },
          { label: "Score de Satisfação Geral", value: "99.2%", percentage: 99 }
        ];
      } else if (questionId === "q3") {
        const totalFaturamento = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
        
        responseText = `Raio-X de Faturamento por Contratante:
A empresa de maior geração de receita acumulada é a **SolarSol S.A. (Energia Solar)**, representando a âncora do volume transacionado na NexoraField. 

Em segundo lugar figura a **NetVelo Telecom**, consolidando a importância do setor de infraestrutura de conectividade na demanda diária de técnicos externos.`;

        responseStats = [
          { label: "SolarSol S.A.", value: "R$ 38.450,00", percentage: 65 },
          { label: "NetVelo Telecom", value: "R$ 18.200,00", percentage: 30 },
          { label: "Outros Clientes", value: `R$ ${(totalFaturamento - 56650 > 0 ? totalFaturamento - 56650 : 3500).toFixed(2)}`, percentage: 15 }
        ];
      } else if (questionId === "q4") {
        responseText = `Detalhamento de Categorias de Serviço:
A categoria de **Telecom** (especialmente Fusão de Fibra Óptica, ativação de cliente e cabeamento estruturado) detém a maior parcela de demanda nacional, correspondendo a aproximadamente 50% de todas as aberturas de ordens de serviço. 

A categoria de **Energia Solar** (manutenção corretiva de inversores e limpeza técnica de painéis fotovoltaicos) ocupa o segundo lugar em receita média por chamado (Ticket Médio de R$ 650,00).`;

        responseStats = [
          { label: "Telecom (Infra e Redes)", value: "52% das O.S.", percentage: 52 },
          { label: "Energia Solar (Manutenção)", value: "28% das O.S.", percentage: 28 },
          { label: "CFTV & Monitoramento", value: "20% das O.S.", percentage: 20 }
        ];
      } else if (questionId === "q5") {
        responseText = `Mapeamento de Lacuna Operacional (Gap de Técnicos):
Identificamos uma escassez crítica de técnicos credenciados e homologados nas especialidades de **Energia Solar (Alta Tensão)** e **Fibra Óptica de Longa Distância** no estado da **Bahia (Salvador e Feira de Santana)**. 

Temos um gargalo de atendimento nessa região, onde o pipeline comercial já prospectou novas empresas prontas para iniciar contratos, mas a fila de homologação operacional de novos técnicos ainda está baixa.`;

        responseStats = [
          { label: "Déficit em Salvador (BA)", value: "Faltam 5 técnicos", percentage: 85 },
          { label: "Déficit em Maceió (AL)", value: "Faltam 3 técnicos", percentage: 55 },
          { label: "Déficit em Porto Alegre (RS)", value: "Faltam 2 técnicos", percentage: 30 }
        ];
      } else {
        // Custom Question handler
        responseText = `Análise Inteligente Customizada para: "${text}"
        
Após compilar a base de dados em tempo real contendo ${tickets.length} chamados técnicos e ${technicians.filter(t => t.status === 'online').length} técnicos operando ativamente na rede NexoraField:

• **Consistência de SLA**: Nossos relatórios de compliance de laudo por IA indicam que 94.6% das ordens de serviço foram concluídas rigorosamente dentro do prazo acordado.
• **Recomendação Estratégica**: Expandir a captação de técnicos com NR10 e NR35 em capitais do Nordeste para suportar o pipeline de prospecção comercial ativa.`;
        
        responseStats = [
          { label: "Aderência Geral de SLA", value: "94.6%", percentage: 94 },
          { label: "Taxa de Aceite de Chamados", value: "89.2%", percentage: 89 }
        ];
      }

      setAnswer({ text: responseText, stats: responseStats });
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="bg-[#0b0e1a] border border-[#1d2440] p-6 rounded-3xl text-white space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
            <h3 className="text-lg font-bold font-display tracking-tight text-white">Nexora BI & Neural Advisor</h3>
          </div>
          <p className="text-xs text-slate-400">
            Inteligência Artificial que consolida os indicadores operacionais, financeiros e geográficos da plataforma em linguagem natural.
          </p>
        </div>
        <span className="text-[10px] bg-slate-900 border border-slate-800 font-mono text-cyan-400 px-3 py-1 rounded-full uppercase">
          Neural Analytic Core Online
        </span>
      </div>

      {/* Preset Questions Grid */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Consulte a Inteligência de Negócios</span>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {presetQuestions.map((q) => (
            <button
              key={q.id}
              onClick={() => handleAsk(q.id, q.text)}
              className={`p-3 text-left rounded-2xl border text-xs font-semibold transition-all flex flex-col justify-between h-24 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900/45 ${selectedQuestion === q.id ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-md' : 'bg-[#0f1326] border-slate-800/80 text-slate-300'}`}
            >
              <span className="text-lg">{q.icon}</span>
              <span className="leading-tight">{q.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Question input */}
      <div className="bg-[#0f1326] border border-slate-800/60 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Faça uma pergunta livre sobre a plataforma... (Ex: Qual o ticket médio dos chamados de CFTV?)"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-indigo-500 text-slate-200 pl-10"
          />
          <Sparkles className="h-4 w-4 text-slate-500 absolute left-3 top-3.5" />
        </div>
        <button
          onClick={() => customQuestion.trim() && handleAsk("custom", customQuestion)}
          disabled={!customQuestion.trim() || isGenerating}
          className="w-full md:w-36 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition-all disabled:opacity-50 cursor-pointer text-center"
        >
          Perguntar à IA
        </button>
      </div>

      {/* Answer Panel */}
      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-[#0a0d1d] rounded-2xl border border-slate-900/60">
          <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-indigo-300 animate-pulse">Compilando estatísticas de faturamento, tickets concluídos e taxas de ocupação...</span>
        </div>
      )}

      {answer && !isGenerating && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#090b16] border border-slate-900 p-6 rounded-2xl animate-fade-in">
          
          {/* Answer Text */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-xs uppercase tracking-wide font-mono">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Resposta da IA</span>
            </div>
            <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {answer.text}
            </p>
          </div>

          {/* Answer Metrics visualization */}
          <div className="space-y-4 bg-[#0f1326] border border-slate-800/40 p-4 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block border-b border-slate-800 pb-1.5">Métricas de Suporte</span>
            
            <div className="space-y-3.5">
              {answer.stats?.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">{stat.label}</span>
                    <span className="font-mono text-indigo-300 font-bold">{stat.value}</span>
                  </div>
                  {stat.percentage !== undefined && (
                    <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
