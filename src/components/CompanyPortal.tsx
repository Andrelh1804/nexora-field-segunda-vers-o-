import React, { useState } from "react";
import { Company, Technician, Ticket, FinancialTransaction } from "../types";
import { 
  Building2, Plus, Sparkles, MapPin, Calendar, Clock, DollarSign, 
  FileText, CheckCircle2, ChevronRight, Play, CheckSquare, 
  Star, Image, ShieldCheck, Loader2, AlertTriangle, Eye 
} from "lucide-react";
import { CATEGORIES } from "../data";

interface CompanyPortalProps {
  currentCompany: Company;
  tickets: Ticket[];
  technicians: Technician[];
  transactions: FinancialTransaction[];
  referrals?: any[];
  setReferrals?: React.Dispatch<React.SetStateAction<any[]>>;
  companies?: Company[];
  onAddTicket: (ticket: Ticket) => void;
  onUpdateTicketStatus: (ticketId: string, status: any) => void;
  onApproveTicketClose: (ticketId: string, stars: number, comment: string) => void;
  onAddAuditLog: (log: any) => void;
}

export default function CompanyPortal({
  currentCompany,
  tickets,
  technicians,
  transactions,
  referrals,
  setReferrals,
  companies,
  onAddTicket,
  onUpdateTicketStatus,
  onApproveTicketClose,
  onAddAuditLog
}: CompanyPortalProps) {
  const [activeTab, setActiveTab] = useState<'dash' | 'novo_chamado' | 'acompanhar'>('dash');
  const [loadingAi, setLoadingAi] = useState(false);

  // Form Fields
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("CFTV");
  const [specialty, setSpecialty] = useState("");
  const [urgency, setUrgency] = useState<'Baixa' | 'Média' | 'Alta' | 'Crítica'>("Média");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("Campinas");
  const [state, setState] = useState("SP");
  const [address, setAddress] = useState("");
  const [suggestedValue, setSuggestedValue] = useState<number>(200);

  // Closing / Review state
  const [reviewingTicketId, setReviewingTicketId] = useState<string | null>(null);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("Serviço excelente, técnico extremamente profissional e atencioso.");

  // Filter tickets of this company
  const compTickets = tickets.filter(t => t.companyId === currentCompany.id);
  const activeCompTickets = compTickets.filter(t => t.status !== 'Finalizado' && t.status !== 'Cancelado');

  // AI Fill Classify integration
  const handleAiAutoFill = async () => {
    if (!desc.trim()) {
      alert("Escreva uma breve descrição no campo antes de acionar a Inteligência Artificial!");
      return;
    }
    setLoadingAi(true);

    try {
      const res = await fetch("/api/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: desc })
      });

      const data = await res.json();
      if (res.ok) {
        setTitle(data.title || "Manutenção Corretiva");
        setCategory(data.category || "CFTV");
        setSpecialty(data.specialty || "Geral");
        setUrgency(data.urgency || "Média");
        setSuggestedValue(data.suggestedValue || 250);
        
        onAddAuditLog({
          type: 'classification',
          ticketId: "temp-draft",
          message: `IA interpretou a descrição e auto-classificou o chamado: ${data.category} / ${data.specialty}. Urgência: ${data.urgency}.`
        });
      } else {
        alert("Erro na classificação da IA: " + (data.error || "Erro desconhecido"));
      }
    } catch (err: any) {
      alert("Servidor indisponível para classificação de IA. Utilizando fallback local.");
      // Fallback local matching
      if (desc.toLowerCase().includes("fibra")) {
        setCategory("Fibra");
        setSpecialty("Fusão de Fibra");
        setSuggestedValue(450);
      } else if (desc.toLowerCase().includes("solar")) {
        setCategory("Solar");
        setSpecialty("Inversor");
        setSuggestedValue(350);
      }
    } finally {
      setLoadingAi(false);
    }
  };

  // Submit / create ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc || !city || !address) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const ticketId = `tick-${Date.now()}`;
    const newTicket: Ticket = {
      id: ticketId,
      title,
      description: desc,
      category,
      specialty: specialty || "Geral",
      urgency,
      date: date || new Date().toISOString().split('T')[0],
      time: time || "09:00",
      cep: cep || "13010-000",
      city,
      state,
      address,
      latitude: city.toLowerCase() === 'são paulo' ? -23.5505 : -22.9068, // center coords SP or Campinas
      longitude: city.toLowerCase() === 'são paulo' ? -46.6333 : -47.0616,
      suggestedValue: suggestedValue || 250,
      deadline: `${date || '2026-06-27'}T18:00:00`,
      photos: ["https://images.unsplash.com/photo-1558486012-817176f84c6d?w=500&h=300&fit=crop"],
      documents: [],
      status: 'IA_Processando', // triggers active loading alocation simulation
      companyId: currentCompany.id,
      invitedTechIds: [],
      declinedTechIds: [],
      createdAt: new Date().toISOString(),
      checklist: [
        { item: "Verificar integridade do local e isolamento", completed: false },
        { item: "Efetuar testes iniciais de alimentação", completed: false },
        { item: "Substituir peças ou cabos avariados", completed: false },
        { item: "Registrar fotos de conformidade das conexões", completed: false },
        { item: "Validar funcionamento com o cliente", completed: false }
      ]
    };

    onAddTicket(newTicket);
    setActiveTab('acompanhar');

    // Simulate AI match process after a short timeout to show the flow
    setTimeout(async () => {
      onAddAuditLog({
        type: 'matching',
        ticketId: ticketId,
        message: `Buscando técnicos qualificados para chamado de ${newTicket.category} num raio de 35 km...`
      });

      try {
        const res = await fetch("/api/ai/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticket: newTicket, technicians })
        });
        const data = await res.json();
        
        if (res.ok && data.matches && data.matches.length > 0) {
          // invite the top matched technicians
          const topTechs = data.matches.slice(0, 2).map((m: any) => m.techId);
          
          // Print details to audit log
          data.matches.slice(0, 3).forEach((match: any) => {
            const tObj = technicians.find(t => t.id === match.techId);
            onAddAuditLog({
              type: 'matching',
              ticketId: ticketId,
              message: `IA calculou adequação de ${tObj?.name || 'Técnico'}: Compatibilidade ${match.score}% • Razão: ${match.explanation}`
            });
          });

          // update state
          onUpdateTicketStatus(ticketId, 'Convites_Enviados');
          tickets.find(t => t.id === ticketId)!.invitedTechIds = topTechs;
        } else {
          // Local basic matching fallback
          onUpdateTicketStatus(ticketId, 'Convites_Enviados');
          tickets.find(t => t.id === ticketId)!.invitedTechIds = ["tech-1", "tech-2"];
        }
      } catch (err) {
        // Fallback
        onUpdateTicketStatus(ticketId, 'Convites_Enviados');
        tickets.find(t => t.id === ticketId)!.invitedTechIds = ["tech-1", "tech-2"];
      }
    }, 1500);

    // Reset form
    setTitle("");
    setDesc("");
    setCep("");
    setAddress("");
  };

  const handleApproveAndPay = (ticketId: string) => {
    onApproveTicketClose(ticketId, stars, comment);
    setReviewingTicketId(null);
    alert("Serviço homologado com sucesso! Split de pagamento processado e repasse PIX enviado ao técnico.");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Portal Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0c14] border border-slate-800/80 text-white p-6 rounded-3xl shadow-xl shadow-black/30">
        <div className="flex items-center gap-3">
          <img src={currentCompany.avatar} alt={currentCompany.name} className="h-12 w-12 rounded-2xl object-cover border border-slate-800/80 shadow-md" />
          <div>
            <h2 className="text-lg font-bold font-display">{currentCompany.name}</h2>
            <p className="text-xs text-slate-400">Segmento: {currentCompany.segment} • CNPJ: {currentCompany.cnpj}</p>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex bg-[#121622] p-1.5 rounded-xl border border-slate-800/80 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('dash')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${activeTab === 'dash' ? 'bg-cyan-600 text-white shadow shadow-cyan-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('novo_chamado')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${activeTab === 'novo_chamado' ? 'bg-cyan-600 text-white shadow shadow-cyan-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Novo Chamado +
          </button>
          <button
            onClick={() => setActiveTab('acompanhar')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${activeTab === 'acompanhar' ? 'bg-cyan-600 text-white shadow shadow-cyan-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Acompanhar Serviços ({activeCompTickets.length})
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------------------- */}
      {/* 1. DASHBOARD VIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {activeTab === 'dash' && (
        <div className="space-y-6">
          {/* Stats overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#0e111a] p-5 rounded-3xl border border-slate-800/80 shadow-lg shadow-black/20 flex items-center gap-3.5">
              <div className="bg-cyan-950/60 text-cyan-400 border border-cyan-900/40 p-2.5 rounded-xl">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Chamados Totais</span>
                <span className="text-xl font-bold text-white font-display">{compTickets.length}</span>
              </div>
            </div>
            <div className="bg-[#0e111a] p-5 rounded-3xl border border-slate-800/80 shadow-lg shadow-black/20 flex items-center gap-3.5">
              <div className="bg-yellow-950/60 text-yellow-400 border border-yellow-900/40 p-2.5 rounded-xl">
                <Play className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Em Execução</span>
                <span className="text-xl font-bold text-white font-display">
                  {compTickets.filter(t => t.status === 'Em_Andamento' || t.status === 'A_Caminho' || t.status === 'Chegou').length}
                </span>
              </div>
            </div>
            <div className="bg-[#0e111a] p-5 rounded-3xl border border-slate-800/80 shadow-lg shadow-black/20 flex items-center gap-3.5">
              <div className="bg-orange-950/60 text-orange-400 border border-orange-900/40 p-2.5 rounded-xl">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Aguardando Fechamento</span>
                <span className="text-xl font-bold text-orange-400 font-display">
                  {compTickets.filter(t => t.status === 'Aguardando_Aprovacao').length}
                </span>
              </div>
            </div>
            <div className="bg-[#0e111a] p-5 rounded-3xl border border-slate-800/80 shadow-lg shadow-black/20 flex items-center gap-3.5">
              <div className="bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 p-2.5 rounded-xl">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Concluídos e Pagos</span>
                <span className="text-xl font-bold text-emerald-400 font-display">
                  {compTickets.filter(t => t.status === 'Finalizado').length}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Tickets List shortcut */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
              <h4 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">Serviços Ativos em Campo</h4>
              {activeCompTickets.length === 0 ? (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <Building2 className="h-10 w-10 text-slate-300 mx-auto" />
                  <p className="text-xs">Sua empresa não possui chamados ativos no momento.</p>
                  <button
                    onClick={() => setActiveTab('novo_chamado')}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] px-3.5 py-1.5 rounded-lg font-semibold"
                  >
                    Abrir Primeiro Chamado Técnico
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {activeCompTickets.map(ticket => {
                    const tech = technicians.find(t => t.id === ticket.assignedTechId);
                    return (
                      <div key={ticket.id} className="border border-slate-150 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
                              {ticket.category}
                            </span>
                            <span className="text-xs font-bold text-slate-800">{ticket.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 max-w-md truncate">{ticket.description}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {ticket.address}, {ticket.city} - {ticket.state}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {tech ? (
                            <div className="flex items-center gap-2 text-xs">
                              <img src={tech.avatar} alt={tech.name} className="h-8 w-8 rounded-full object-cover border border-slate-300" />
                              <div>
                                <span className="font-bold block text-slate-700">{tech.name}</span>
                                <span className="text-[10px] text-slate-400">Class: {tech.rating}★</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200">
                              Buscando Técnico...
                            </span>
                          )}
                          
                          <button
                            onClick={() => {
                              setActiveTab('acompanhar');
                              if (ticket.status === 'Aguardando_Aprovacao') {
                                setReviewingTicketId(ticket.id);
                              }
                            }}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all"
                          >
                            <span>Acompanhar</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Financial escrow / deposit check */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">Escrow / Garantia de Pagamento</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                  Ao criar um chamado, o valor sugerido de <strong>R$ {suggestedValue}</strong> é retido na conta de garantia Nexora. O repasse técnico e o split só ocorrem de forma 100% segura quando você revisar e homologar o laudo enviado de campo.
                </p>
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Garantias Depositadas:</span>
                    <strong className="text-slate-800">
                      R$ {activeCompTickets.reduce((acc, t) => acc + t.suggestedValue, 0).toFixed(2)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Repasses Concluídos:</span>
                    <strong className="text-slate-800 text-emerald-600 font-mono">
                      R$ {transactions.filter(t => t.companyName === currentCompany.name).reduce((acc, t) => acc + t.totalAmount, 0).toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-50 border border-cyan-100 p-3.5 rounded-xl text-[10px] text-cyan-800 flex gap-2 mt-4">
                <ShieldCheck className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                <p><strong>Diferencial Nexora IA:</strong> O checklist de encerramento do chamado é auditado e o laudo técnico gerado via Inteligência Artificial garante que as diretrizes foram cumpridas antes do pagamento.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* 2. CREATE TICKET VIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {activeTab === 'novo_chamado' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main creation Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Criar Novo Chamado Técnico</h4>
                <p className="text-[11px] text-slate-400">Escreva o chamado. Você pode acionar a IA para auto-completar com precisão!</p>
              </div>
              <button
                type="button"
                onClick={handleAiAutoFill}
                disabled={loadingAi}
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white text-[11px] px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/10 disabled:opacity-50"
              >
                {loadingAi ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span>Preencher com Inteligência Artificial</span>
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Descrição Detalhada do Serviço *</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Escreva livremente. Ex: 'Preciso de um técnico em Campinas amanhã de manhã para trocar 3 painéis solares Weg que estão com rachaduras na moldura de alumínio. É preciso levar escada de fibra de no mínimo 6 metros e multímetro.'"
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Título do Chamado *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Troca de Painéis Solares Weg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Categoria</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Especialidade / Marca</label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="Ex: Intelbras, Weg..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Urgência</label>
                  <select
                    value={urgency}
                    onChange={(e: any) => setUrgency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-bold"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica 🚨</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Data Agendamento</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Horário</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">CEP *</label>
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="13000-000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Endereço Completo *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número, bairro..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Cidade Sede</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Valor Sugerido para Mão-de-Obra (R$) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">R$</span>
                  <input
                    type="number"
                    value={suggestedValue}
                    onChange={(e) => setSuggestedValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md shadow-cyan-600/15 flex items-center justify-center gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>Criar Chamado e Disparar IA de Busca</span>
              </button>
            </form>
          </div>

          {/* Side Tip panel */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Como funciona o Fluxo IA?</h4>
            <ul className="text-xs text-slate-600 space-y-3">
              <li className="flex gap-2">
                <span className="h-5 w-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0">1</span>
                <span><strong>Interpretação e Tagging:</strong> A IA lê a sua descrição livre, corrige e preenche Categoria, Fabricante, Especialidade e NRs regulamentares exigidas automaticamente.</span>
              </li>
              <li className="flex gap-2">
                <span className="h-5 w-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0">2</span>
                <span><strong>Busca de Cobertura GPS:</strong> Filtramos a nossa base nacional calculando as distâncias exatas de cada técnico e avaliamos sua compatibilidade e rating.</span>
              </li>
              <li className="flex gap-2">
                <span className="h-5 w-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0">3</span>
                <span><strong>Disparo de Convites:</strong> O técnico mais qualificado no ranking da região recebe um convite instantâneo via Push e WhatsApp com a oportunidade.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* 3. TRACKING & APPROVAL VIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {activeTab === 'acompanhar' && (
        <div className="space-y-6">
          {activeCompTickets.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400">
              Nenhum chamado ativo em execução. Crie um novo chamado para começar!
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Ticket Selection Panel */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-[500px] overflow-y-auto space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Selecione o Serviço para Acompanhar</h4>
                {activeCompTickets.map(t => {
                  const isSelected = t.id === reviewingTicketId || (!reviewingTicketId && activeCompTickets[0].id === t.id);
                  const tech = technicians.find(tec => tec.id === t.assignedTechId);
                  
                  return (
                    <button
                      key={t.id}
                      onClick={() => setReviewingTicketId(t.id)}
                      className={`w-full text-left p-3.5 rounded-xl border flex flex-col gap-2 transition-all ${
                        isSelected 
                          ? 'bg-cyan-50/60 border-cyan-400 shadow-sm' 
                          : 'border-slate-150 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-xs font-bold text-slate-800 truncate block max-w-[150px]">{t.title}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          t.status === 'Aguardando_Aprovacao' ? 'bg-orange-100 text-orange-800' : 'bg-cyan-100 text-cyan-800'
                        }`}>
                          {t.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 w-full">
                        <span>{t.city} - {t.state}</span>
                        <span>R$ {t.suggestedValue}</span>
                      </div>
                      {tech && (
                        <div className="flex items-center gap-2 border-t border-slate-150/50 pt-2 w-full">
                          <img src={tech.avatar} alt={tech.name} className="h-5 w-5 rounded-full object-cover" />
                          <span className="text-[10px] text-slate-600 truncate">{tech.name}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Live execution tracker details */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-6">
                {(() => {
                  const selTicket = tickets.find(t => t.id === reviewingTicketId) || activeCompTickets[0];
                  if (!selTicket) return null;
                  
                  const selTech = technicians.find(t => t.id === selTicket.assignedTechId);
                  const flowSteps = [
                    { key: 'Aberto', label: 'Chamado Aberto' },
                    { key: 'Convites_Enviados', label: 'Convites Enviados' },
                    { key: 'Aprovado', label: 'Técnico Alocado' },
                    { key: 'Em_Andamento', label: 'Em Execução' },
                    { key: 'Aguardando_Aprovacao', label: 'Laudo Enviado' }
                  ];

                  const getStepIndex = (status: string) => {
                    if (status === 'IA_Processando') return 0;
                    if (status === 'Aceito') return 1;
                    if (status === 'A_Caminho' || status === 'Chegou') return 3;
                    const idx = flowSteps.findIndex(s => s.key === status);
                    return idx === -1 ? 4 : idx;
                  };

                  const currentStepIdx = getStepIndex(selTicket.status);

                  return (
                    <>
                      <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">{selTicket.title}</h4>
                          <p className="text-[11px] text-slate-500">Local: {selTicket.address}, {selTicket.city} - {selTicket.state}</p>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-600 font-bold bg-cyan-50 px-2 py-1 rounded">
                          REF ID: {selTicket.id}
                        </span>
                      </div>

                      {/* Visual Flow Tracker Stepper */}
                      <div className="flex justify-between items-center relative py-4">
                        <div className="absolute left-0 right-0 h-1 bg-slate-100 top-1/2 -translate-y-1/2 z-0"></div>
                        <div 
                          className="absolute left-0 h-1 bg-cyan-500 top-1/2 -translate-y-1/2 transition-all duration-500 z-0"
                          style={{ width: `${(currentStepIdx / (flowSteps.length - 1)) * 100}%` }}
                        ></div>

                        {flowSteps.map((step, idx) => {
                          const isCompleted = idx < currentStepIdx || selTicket.status === 'Finalizado';
                          const isCurrent = idx === currentStepIdx;
                          return (
                            <div key={step.key} className="flex flex-col items-center relative z-10">
                              <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-[10px] border-2 transition-all ${
                                isCompleted ? 'bg-cyan-600 border-cyan-600 text-white' :
                                isCurrent ? 'bg-white border-cyan-500 text-cyan-600 ring-4 ring-cyan-100 animate-pulse' :
                                'bg-white border-slate-200 text-slate-400'
                              }`}>
                                {idx + 1}
                              </div>
                              <span className={`text-[9px] mt-1.5 font-bold whitespace-nowrap ${
                                isCurrent ? 'text-cyan-600' : 'text-slate-400'
                              }`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Alocation Status details */}
                      {selTicket.status === 'IA_Processando' && (
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center space-y-2">
                          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                          <h5 className="text-xs font-bold text-slate-800">IA Inteligente Rodando Matching...</h5>
                          <p className="text-[11px] text-slate-500 max-w-sm">O motor neural Nexora está examinando a descrição e disparando notificações aos técnicos mais próximos da sua região.</p>
                        </div>
                      )}

                      {selTicket.status === 'Convites_Enviados' && (
                        <div className="bg-cyan-50/50 border border-cyan-100 rounded-xl p-4 space-y-3">
                          <h5 className="text-xs font-bold text-cyan-800 flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4 text-cyan-600 animate-pulse" />
                            <span>Convites Inteligentes Enviados</span>
                          </h5>
                          <p className="text-[11px] text-cyan-900 leading-relaxed">
                            A nossa IA identificou os técnicos com maior compatibilidade na região de {selTicket.city} e disparou notificações via WhatsApp e Push. Aguarde o aceite dos prestadores.
                          </p>
                        </div>
                      )}

                      {/* ACTIVE ALOCATION TRACKER */}
                      {selTech && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-150 rounded-xl p-4 bg-slate-50/40">
                          <div className="space-y-3">
                            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Técnico Alocado</span>
                            <div className="flex gap-3">
                              <img src={selTech.avatar} alt={selTech.name} className="h-12 w-12 rounded-xl object-cover border border-slate-200" />
                              <div>
                                <h5 className="text-xs font-bold text-slate-800">{selTech.name}</h5>
                                <span className="text-[10px] text-slate-500 block">Cel: {selTech.whatsapp}</span>
                                <span className="text-[10px] text-emerald-600 font-bold block">★ {selTech.rating} de Avaliação</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t md:border-t-0 md:border-l border-slate-150 pt-3 md:pt-0 md:pl-4 space-y-2">
                            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Acompanhamento GPS</span>
                            <div className="text-xs space-y-1 text-slate-600 font-mono text-[11px]">
                              <div>Status Técnico: <strong className="text-slate-800 uppercase text-[10px]">{selTicket.status.replace("_", " ")}</strong></div>
                              {selTicket.status === 'A_Caminho' && <div className="text-cyan-600 animate-pulse">● Deslocamento ativado: visualizando trajeto GPS remoto</div>}
                              {selTicket.status === 'Chegou' && <div className="text-emerald-600">● Técnico chegou ao endereço do chamado técnico</div>}
                              {selTicket.status === 'Em_Andamento' && <div className="text-indigo-600">● Executando as etapas do check-list técnico no local</div>}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* APPROVAL STAGE */}
                      {selTicket.status === 'Aguardando_Aprovacao' && (
                        <div className="border-2 border-orange-200 bg-orange-50/20 rounded-2xl p-5 space-y-4">
                          <div className="border-b border-orange-100 pb-3 flex justify-between items-center">
                            <h5 className="text-xs font-bold text-orange-800 flex items-center gap-1.5">
                              <CheckSquare className="h-5 w-5 text-orange-600 animate-pulse" />
                              <span>Revisar Laudo e Homologar Serviço</span>
                            </h5>
                            <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full border border-orange-200">
                              PENDENTE SEU ACEITE
                            </span>
                          </div>

                          <div className="space-y-3 text-xs">
                            <p className="text-slate-600 leading-relaxed">
                              O técnico concluiu o chamado e anexou as evidências e o check-list. A nossa IA de Compliance gerou o seguinte **Laudo Técnico de Encerramento** automático:
                            </p>

                            {/* Markdown-like rich box for report */}
                            <div className="bg-white border border-slate-200 rounded-xl p-4 text-[11px] font-mono leading-relaxed text-slate-700 max-h-[160px] overflow-y-auto whitespace-pre-wrap shadow-inner">
                              {selTicket.technicalReport || "Nenhum laudo técnico gerado para este chamado."}
                            </div>

                            {/* Fraud Compliance check indicators */}
                            {selTicket.fraudAlerts && selTicket.fraudAlerts.length > 0 && (
                              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-[10px] text-red-800 space-y-1">
                                <span className="font-bold flex items-center gap-1">
                                  <AlertTriangle className="h-4 w-4 text-red-600" />
                                  <span>Alertas de Compliance Operacional Detectados</span>
                                </span>
                                {selTicket.fraudAlerts.map((al, idx) => <li key={idx} className="list-disc ml-3">{al}</li>)}
                              </div>
                            )}

                            {/* Checklist evidence check */}
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Métricas de Evidência Técnica</span>
                              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-150">
                                <div className="text-[11px]">
                                  <span className="text-slate-500">Checklist Concluído:</span>
                                  <strong className="block text-slate-800">
                                    {selTicket.checklist?.filter(c => c.completed).length} de {selTicket.checklist?.length} etapas
                                  </strong>
                                </div>
                                <div className="text-[11px]">
                                  <span className="text-slate-500">Mídia / Evidências:</span>
                                  <strong className="block text-slate-800 flex items-center gap-1">
                                    <Image className="h-3.5 w-3.5 text-slate-500" />
                                    <span>{selTicket.evidencePhotos?.length || 0} Fotos Carregadas</span>
                                  </strong>
                                </div>
                              </div>
                            </div>

                            {/* ESCROW SLOTS PAYOUT ACTION */}
                            <div className="border-t border-slate-150 pt-4 space-y-3.5">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Homologação e Nota para o Técnico</span>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[11px] font-bold text-slate-600 block">Estrelas (Avaliação) *</label>
                                  <div className="flex gap-1.5 text-amber-400">
                                    {[1,2,3,4,5].map(st => (
                                      <button type="button" key={st} onClick={() => setStars(st)}>
                                        <Star className={`h-6 w-6 cursor-pointer ${stars >= st ? 'fill-amber-400' : 'text-slate-300'}`} />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[11px] font-bold text-slate-600 block">Comentário Público *</label>
                                  <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Escreva um comentário sobre o atendimento técnico..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                                    required
                                  />
                                </div>
                              </div>

                              <button
                                onClick={() => handleApproveAndPay(selTicket.id)}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Homologar Serviço & Liberar Payout PIX Escrow (R$ {selTicket.suggestedValue.toFixed(2)})</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
