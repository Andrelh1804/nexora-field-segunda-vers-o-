import React, { useState } from "react";
import { Technician, Ticket, ChatMessage } from "../types";
import { 
  HardHat, DollarSign, Calendar, Star, Compass, CheckSquare, 
  ChevronRight, ChevronLeft, MapPin, Sparkles, Upload, 
  Award, ShieldAlert, CheckCircle, ArrowRight, UserCheck, 
  Briefcase, Landmark, BookOpen, Loader2, Trophy, Users, Share2, Coins, Flame
} from "lucide-react";
import { CATEGORIES, SPECIALTIES, EQUIPMENTS } from "../data";

interface TechnicianPortalProps {
  currentTech: Technician;
  technicians: Technician[];
  tickets: Ticket[];
  referrals: any[];
  setReferrals: React.Dispatch<React.SetStateAction<any[]>>;
  onUpdateTicketStatus: (ticketId: string, status: any) => void;
  onAllocateTech: (ticketId: string, techId: string) => void;
  onUpdateChecklist: (ticketId: string, checklist: any[]) => void;
  onAddEvidence: (ticketId: string, photo: string) => void;
  onCompleteService: (ticketId: string, signature: string, laudo: string, fraudAlerts: string[]) => void;
  onAddAuditLog: (log: any) => void;
}

export default function TechnicianPortal({
  currentTech,
  technicians,
  tickets,
  referrals,
  setReferrals,
  onUpdateTicketStatus,
  onAllocateTech,
  onUpdateChecklist,
  onAddEvidence,
  onCompleteService,
  onAddAuditLog
}: TechnicianPortalProps) {
  const [activeTab, setActiveTab] = useState<'dash' | 'registro' | 'chamado_ativo' | 'gamification' | 'indicacoes'>('dash');
  
  // Referral form local state
  const [refName, setRefName] = useState("");
  const [refContact, setRefContact] = useState("");
  const [refType, setRefType] = useState<'tech' | 'company'>('tech');
  const [refSuccessMsg, setRefSuccessMsg] = useState("");

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refName || !refContact) return;

    const newRef = {
      id: `ref-${Date.now()}`,
      referrerType: 'tech' as const,
      referrerId: currentTech.id,
      referredType: refType,
      referredName: refName,
      referredEmailOrPhone: refContact,
      status: 'pending' as const,
      rewardPaid: false,
      rewardDetails: refType === 'tech'
        ? "Bônus de R$ 50,00 para ambos após o primeiro chamado concluído."
        : "Crédito de R$ 100,00 concedido para o primeiro chamado.",
      createdAt: new Date().toISOString()
    };

    setReferrals(prev => [newRef, ...prev]);
    setRefName("");
    setRefContact("");
    setRefSuccessMsg(`Convite enviado com sucesso para ${refName}! Assim que ele(a) concluir o primeiro chamado técnico, ambos ganharão o bônus.`);
    
    setTimeout(() => {
      setRefSuccessMsg("");
    }, 6000);

    onAddAuditLog({
      type: 'growth',
      message: `Técnico ${currentTech.name} gerou indicação para ${refName} (${refType === 'tech' ? 'Técnico' : 'Empresa'})`
    });
  };
  
  // Registration steps
  const [step, setStep] = useState(1);
  const [signatureText, setSignatureText] = useState("");
  const [evidencePhotoLocal, setEvidencePhotoLocal] = useState("");
  const [completingTicketId, setCompletingTicketId] = useState<string | null>(null);
  const [closingLoader, setClosingLoader] = useState(false);

  // Filter tickets relevant for this technician
  // 1. Invitations (Convites)
  const invitations = tickets.filter(t => t.status === 'Convites_Enviados' && t.invitedTechIds?.includes(currentTech.id));
  
  // 2. Active allocated ticket
  const allocatedTicket = tickets.find(t => t.assignedTechId === currentTech.id && t.status !== 'Finalizado' && t.status !== 'Cancelado');

  // Multi-step profile state (pre-filled with currentTech)
  const [profileName, setProfileName] = useState(currentTech.name);
  const [profileCPF, setProfileCPF] = useState(currentTech.cpf);
  const [profileEmail, setProfileEmail] = useState(currentTech.email);
  const [profilePhone, setProfilePhone] = useState(currentTech.phone);
  const [profileCity, setProfileCity] = useState(currentTech.city);
  const [profileState, setProfileState] = useState(currentTech.state);
  const [profileAddress, setProfileAddress] = useState(currentTech.address);
  const [profileNR10, setProfileNR10] = useState(currentTech.nr10);
  const [profileNR35, setProfileNR35] = useState(currentTech.nr35);
  const [profileNR33, setProfileNR33] = useState(currentTech.nr33);
  const [profileSpecialties, setProfileSpecialties] = useState<string[]>(currentTech.specialties);
  const [profileEquipments, setProfileEquipments] = useState<string[]>(currentTech.equipment);
  const [profilePix, setProfilePix] = useState(currentTech.pixKey);
  const [profileBank, setProfileBank] = useState(currentTech.bankName);
  const [profileAgency, setProfileAgency] = useState(currentTech.agency);
  const [profileAccount, setProfileAccount] = useState(currentTech.accountNumber);

  const handleAcceptOportunity = (ticketId: string) => {
    onUpdateTicketStatus(ticketId, 'Aceito');
    onAllocateTech(ticketId, currentTech.id);
    
    onAddAuditLog({
      type: 'matching',
      ticketId: ticketId,
      message: `Técnico ${currentTech.name} aceitou o convite para o chamado. Aguardando homologação do cliente.`
    });

    alert("Oportunidade aceita! A empresa foi notificada. Assim que ela aprovar, o chamado estará disponível para execução.");
  };

  // Simulate Company Approval shortcut to keep flow interactive
  const handleSimulateCompanyApproval = (ticketId: string) => {
    onUpdateTicketStatus(ticketId, 'Aprovado');
    onAddAuditLog({
      type: 'matching',
      ticketId: ticketId,
      message: `Empresa aprovou a alocação de ${currentTech.name} para o chamado.`
    });
    alert("Simulação de Aprovação concluída! O chamado foi aprovado pela empresa. Chat liberado para alinhamento.");
  };

  const handleStartTravel = (ticketId: string) => {
    onUpdateTicketStatus(ticketId, 'A_Caminho');
    onAddAuditLog({
      type: 'matching',
      ticketId: ticketId,
      message: `Técnico ${currentTech.name} iniciou deslocamento GPS rumo ao endereço do chamado.`
    });
  };

  const handleArrive = (ticketId: string) => {
    onUpdateTicketStatus(ticketId, 'Chegou');
    onAddAuditLog({
      type: 'matching',
      ticketId: ticketId,
      message: `Técnico ${currentTech.name} registrou chegada no local do serviço (Check-in GPS validado).`
    });
  };

  const handleStartService = (ticketId: string) => {
    onUpdateTicketStatus(ticketId, 'Em_Andamento');
    onAddAuditLog({
      type: 'matching',
      ticketId: ticketId,
      message: `Serviço iniciado em campo por ${currentTech.name}. Check-list em execução.`
    });
  };

  const handleToggleChecklistItem = (ticketId: string, idx: number) => {
    if (!allocatedTicket?.checklist) return;
    const updated = allocatedTicket.checklist.map((item, i) => {
      if (i === idx) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    onUpdateChecklist(ticketId, updated);
  };

  const handleAddEvidencePhotoSimulated = (ticketId: string) => {
    const mockPhotos = [
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558486012-817176f84c6d?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=300&fit=crop"
    ];
    // Grab a pseudo random photo from list
    const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    onAddEvidence(ticketId, randomPhoto);
    alert("Foto de evidência anexada ao chamado técnico com sucesso!");
  };

  // Submit and execute server-side AI report + compliance fraud check
  const handleCompleteServiceSubmit = async (ticketId: string) => {
    if (!signatureText.trim()) {
      alert("Por favor, preencha a Assinatura do Cliente para concluir o encerramento.");
      return;
    }

    if (allocatedTicket?.checklist?.some(c => !c.completed)) {
      alert("Atenção: Conclua todas as etapas do checklist antes de finalizar o chamado!");
      return;
    }

    setClosingLoader(true);

    try {
      // 1. Generate Report via server AI
      const sumRes = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket: allocatedTicket,
          checklist: allocatedTicket.checklist,
          durationMinutes: 45
        })
      });
      const sumData = await sumRes.json();
      const reportMarkdown = sumRes.ok && sumData.report ? sumData.report : `### LAUDO PREVENTIVO\n\nServiço executado com sucesso por ${currentTech.name}.`;

      // 2. Run Fraud check via server AI (simulate technical checkout distance of 0.2km - safe)
      const fraudRes = await fetch("/api/ai/fraud-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket: allocatedTicket,
          techLocation: { lat: -22.9068, lng: -47.0616 },
          checkInDistance: 0.2,
          checkOutDistance: 0.1,
          photosCount: allocatedTicket.evidencePhotos?.length || 1,
          timeElapsedSeconds: 1500
        })
      });
      const fraudData = await fraudRes.json();
      const alerts = fraudRes.ok && fraudData.alerts ? fraudData.alerts : [];

      onAddAuditLog({
        type: 'report',
        ticketId: ticketId,
        message: `IA de Encerramento compilou o Laudo Técnico de campo para o chamado '${allocatedTicket.title}'.`
      });

      if (alerts.length > 0) {
        onAddAuditLog({
          type: 'fraud_check',
          ticketId: ticketId,
          message: `IA de Compliance identificou ${alerts.length} alertas operacionais no chamado.`
        });
      } else {
        onAddAuditLog({
          type: 'fraud_check',
          ticketId: ticketId,
          message: `IA de Compliance aprovou integridade do chamado '${allocatedTicket.title}' (Confiabilidade: ${fraudData.trustScore || 100}%).`
        });
      }

      onCompleteService(ticketId, signatureText, reportMarkdown, alerts);
      onUpdateTicketStatus(ticketId, 'Aguardando_Aprovacao');

      // Add payout logs
      alert("Serviço concluído com sucesso! O laudo técnico e os alertas de compliance foram gerados pela IA e enviados para a empresa aprovar.");
      setActiveTab('dash');
      setSignatureText("");
    } catch (err) {
      alert("Ocorreu um erro no servidor de Inteligência Artificial durante a compilação do relatório. Realizando fechamento offline.");
      onCompleteService(ticketId, signatureText, `### LAUDO OFFLINE\n\nLaudo técnico provisório. Assinado por: ${signatureText}`, []);
      onUpdateTicketStatus(ticketId, 'Aguardando_Aprovacao');
      setActiveTab('dash');
    } finally {
      setClosingLoader(false);
    }
  };

  const handleToggleProfileSpecialty = (spec: string) => {
    if (profileSpecialties.includes(spec)) {
      setProfileSpecialties(profileSpecialties.filter(s => s !== spec));
    } else {
      setProfileSpecialties([...profileSpecialties, spec]);
    }
  };

  const handleToggleProfileEquipment = (eq: string) => {
    if (profileEquipments.includes(eq)) {
      setProfileEquipments(profileEquipments.filter(e => e !== eq));
    } else {
      setProfileEquipments([...profileEquipments, eq]);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Technician Portal Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0c14] border border-slate-800/80 text-white p-6 rounded-3xl shadow-xl shadow-black/30">
        <div className="flex items-center gap-3">
          <img src={currentTech.avatar} alt={currentTech.name} className="h-12 w-12 rounded-2xl object-cover border border-slate-800/80 shadow-md" />
          <div>
            <h2 className="text-lg font-bold font-display">{currentTech.name}</h2>
            <p className="text-xs text-slate-400">
              Especialidades: {currentTech.specialties.join(", ")} • CPF: {currentTech.cpf}
            </p>
          </div>
        </div>

        <div className="flex bg-[#121622] p-1.5 rounded-xl border border-slate-800/80 gap-1 text-xs flex-wrap">
          <button
            onClick={() => setActiveTab('dash')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${activeTab === 'dash' ? 'bg-emerald-600 text-white shadow shadow-emerald-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Meu Painel
          </button>
          <button
            onClick={() => setActiveTab('registro')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${activeTab === 'registro' ? 'bg-emerald-600 text-white shadow shadow-emerald-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Cadastro Completo
          </button>
          <button
            onClick={() => setActiveTab('gamification')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${activeTab === 'gamification' ? 'bg-emerald-600 text-white shadow shadow-emerald-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Conquistas & Ranking 🏆
          </button>
          <button
            onClick={() => setActiveTab('indicacoes')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${activeTab === 'indicacoes' ? 'bg-emerald-600 text-white shadow shadow-emerald-600/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Indique e Ganhe! 📣
          </button>
          {allocatedTicket && (
            <button
              onClick={() => setActiveTab('chamado_ativo')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${activeTab === 'chamado_ativo' ? 'bg-emerald-600 text-white shadow shadow-emerald-600/10 animate-pulse' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Chamado Ativo ⚙️
            </button>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------------------------------- */}
      {/* 1. MY DASHBOARD VIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {activeTab === 'dash' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main indicators & earnings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Saldo Carteira (85%)</span>
                  <span className="text-lg font-bold text-emerald-600">R$ 510,00</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="bg-cyan-100 p-2.5 rounded-xl text-cyan-700">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Serviços Feitos</span>
                  <span className="text-lg font-bold text-slate-800">{currentTech.completedJobsCount}</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Minha Avaliação</span>
                  <span className="text-lg font-bold text-slate-800">{currentTech.rating} ★</span>
                </div>
              </div>
            </div>

            {/* Opportunities section (Convites) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
                  <span>Novas Oportunidades por IA ({invitations.length})</span>
                </h4>
                <span className="px-2 py-0.5 rounded text-[8px] font-mono bg-indigo-100 text-indigo-800 font-bold">Matching Geográfico</span>
              </div>

              {invitations.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Não há novos convites na sua região no momento. Fique online para receber.
                </div>
              ) : (
                <div className="space-y-3">
                  {invitations.map(ticket => (
                    <div key={ticket.id} className="border border-slate-150 p-4 rounded-xl space-y-3 bg-slate-50/40">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-indigo-100 text-indigo-800 mr-2 uppercase">
                            {ticket.category}
                          </span>
                          <strong className="text-xs text-slate-800">{ticket.title}</strong>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">
                          Mão-de-Obra: R$ {ticket.suggestedValue}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{ticket.description}</p>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {ticket.address}, {ticket.city} - {ticket.state} (Distância: ~1.2 km)
                      </div>
                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-150/40">
                        <button
                          onClick={() => handleAcceptOportunity(ticket.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                        >
                          Aceitar Oportunidade
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Approvals (Aceitos que precisam de homologação) */}
            {tickets.filter(t => t.assignedTechId === currentTech.id && t.status === 'Aceito').length > 0 && (
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-3">
                <h5 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-amber-600 animate-pulse" />
                  <span>Aguardando Aprovação da Empresa</span>
                </h5>
                <p className="text-[11px] text-amber-900">
                  Você aceitou estas oportunidades. O chamado está em análise pela empresa para liberação da garantia financeira.
                </p>
                <div className="space-y-2">
                  {tickets.filter(t => t.assignedTechId === currentTech.id && t.status === 'Aceito').map(t => (
                    <div key={t.id} className="bg-white border border-amber-200/50 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <strong className="text-xs text-slate-800 block">{t.title}</strong>
                        <span className="text-[10px] text-slate-500">Valor Garantido: R$ {t.suggestedValue}</span>
                      </div>
                      <button
                        onClick={() => handleSimulateCompanyApproval(t.id)}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-[9px] font-bold px-2.5 py-1 rounded shadow-sm"
                      >
                        Simular Aprovação da Empresa
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side stats: bank accounts, availability */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider block mb-2">Dados Bancários para Recebimento PIX</span>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] space-y-1.5 text-slate-600">
                  <div className="flex justify-between"><span>Banco:</span> <strong className="text-slate-800">{currentTech.bankName}</strong></div>
                  <div className="flex justify-between"><span>Chave PIX:</span> <strong className="text-slate-800">{currentTech.pixKey}</strong></div>
                  <div className="flex justify-between"><span>Agência:</span> <strong className="text-slate-800">{currentTech.agency}</strong></div>
                  <div className="flex justify-between"><span>Conta:</span> <strong className="text-slate-800">{currentTech.accountNumber}</strong></div>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider block mb-2">Documentos & Certificações Homologadas</span>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>CNH e Comprovante de Residência</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className={`h-4 w-4 ${currentTech.nr10 ? 'text-emerald-500' : 'text-slate-300'} flex-shrink-0`} />
                    <span>Certificação NR10 (Segurança em Elétrica)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className={`h-4 w-4 ${currentTech.nr35 ? 'text-emerald-500' : 'text-slate-300'} flex-shrink-0`} />
                    <span>Certificação NR35 (Trabalho em Altura)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-slate-50 p-3.5 rounded-xl text-[10px] text-slate-500 flex gap-2">
              <Award className="h-5 w-5 text-indigo-500 flex-shrink-0" />
              <p>A NexoraField garante conformidade técnica. Seus documentos estão aprovados. Você está elegível para receber chamados críticos de até R$ 1.500,00.</p>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* 2. REGISTRATION ENTIRE PROFILE (ETAPAS 1-8) */}
      {/* --------------------------------------------------------------------------------- */}
      {activeTab === 'registro' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Formulário de Cadastro Completo (Etapas 1-8)</h4>
              <p className="text-[11px] text-slate-400">Gerencie sua ficha técnica e garanta o selo de homologação Nexora.</p>
            </div>
            <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl">
              Etapa {step} de 8
            </span>
          </div>

          {/* Wizard step renderer */}
          <div className="min-h-[220px]">
            {step === 1 && (
              <div className="space-y-3.5">
                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> <span>Etapa 1 – Dados Pessoais</span></h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Nome Completo</label>
                    <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">CPF</label>
                    <input type="text" value={profileCPF} onChange={(e) => setProfileCPF(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3.5">
                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> <span>Etapa 2 – Contato</span></h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Celular / WhatsApp</label>
                    <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">E-mail</label>
                    <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3.5">
                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Award className="h-4 w-4" /> <span>Etapa 3 – Documentação & Certificados NRs</span></h5>
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500">Selecione quais normas de segurança e certificações você possui válidas e homologadas:</p>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <button type="button" onClick={() => setProfileNR10(!profileNR10)} className={`p-3 rounded-lg border text-left text-xs ${profileNR10 ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      <strong className="block">NR-10</strong>
                      <span className="text-[9px]">Instalações Elétricas</span>
                    </button>
                    <button type="button" onClick={() => setProfileNR35(!profileNR35)} className={`p-3 rounded-lg border text-left text-xs ${profileNR35 ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      <strong className="block">NR-35</strong>
                      <span className="text-[9px]">Trabalho em Altura</span>
                    </button>
                    <button type="button" onClick={() => setProfileNR33(!profileNR33)} className={`p-3 rounded-lg border text-left text-xs ${profileNR33 ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      <strong className="block">NR-33</strong>
                      <span className="text-[9px]">Espaço Confinado</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3.5">
                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><CheckSquare className="h-4 w-4" /> <span>Etapa 4 – Área de Atuação / Especialidades</span></h5>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(spec => {
                    const isSelected = profileSpecialties.includes(spec);
                    return (
                      <button
                        type="button"
                        key={spec}
                        onClick={() => handleToggleProfileSpecialty(spec)}
                        className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                          isSelected ? 'bg-emerald-600 border-emerald-600 text-white font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-3.5">
                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Compass className="h-4 w-4" /> <span>Etapa 5 – Equipamentos e Ferramental</span></h5>
                <div className="flex flex-wrap gap-2">
                  {EQUIPMENTS.map(eq => {
                    const isSelected = profileEquipments.includes(eq);
                    return (
                      <button
                        type="button"
                        key={eq}
                        onClick={() => handleToggleProfileEquipment(eq)}
                        className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                          isSelected ? 'bg-indigo-600 border-indigo-600 text-white font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {eq}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-3.5">
                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><MapPin className="h-4 w-4" /> <span>Etapa 6 – Disponibilidade & GPS</span></h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Cidade Principal</label>
                    <input type="text" value={profileCity} onChange={(e) => setProfileCity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Estado</label>
                    <input type="text" value={profileState} onChange={(e) => setProfileState(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs" />
                  </div>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-3.5">
                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Landmark className="h-4 w-4" /> <span>Etapa 7 – Dados Bancários para Recebimentos</span></h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Banco</label>
                    <input type="text" value={profileBank} onChange={(e) => setProfileBank(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Chave PIX</label>
                    <input type="text" value={profilePix} onChange={(e) => setProfilePix(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Conta Corrente</label>
                    <input type="text" value={profileAccount} onChange={(e) => setProfileAccount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs" />
                  </div>
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="space-y-3.5">
                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><UserCheck className="h-4 w-4" /> <span>Etapa 8 – Contrato e Termos LGPD</span></h5>
                <div className="bg-slate-50 p-4 rounded border border-slate-200 text-[10px] text-slate-500 leading-relaxed max-h-[120px] overflow-y-auto">
                  De acordo com as leis brasileiras e as diretrizes de privacidade de dados (LGPD), o prestador de serviços autoriza a NexoraField a compartilhar seus dados profissionais e de localização GPS em tempo real com empresas parceiras contratantes estritamente para o propósito de intermediação técnica de serviços em campo.
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="lgpdCheck" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                  <label htmlFor="lgpdCheck" className="text-[11px] text-slate-700 font-semibold">Aceito os termos contratuais e autorizo compartilhamento de dados.</label>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Buttons */}
          <div className="flex justify-between border-t border-slate-100 pt-4">
            <button
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 disabled:opacity-50 text-xs font-bold"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => {
                if (step < 8) {
                  setStep(step + 1);
                } else {
                  alert("Perfil de Cadastro Atualizado com Sucesso!");
                  setActiveTab('dash');
                  setStep(1);
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <span>{step === 8 ? 'Salvar e Concluir' : 'Próxima'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* 3. ACTIVE ALLOCATED TICKET WORKFLOW VIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {activeTab === 'chamado_ativo' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {allocatedTicket ? (
            <>
              {/* Checklist & evidence submission panel */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-5">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{allocatedTicket.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      Local: {allocatedTicket.address}, {allocatedTicket.city} - {allocatedTicket.state}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                    STATUS: {allocatedTicket.status.replace("_", " ")}
                  </span>
                </div>

                {/* Sub-workflow buttons */}
                {allocatedTicket.status === 'Aprovado' && (
                  <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl space-y-3">
                    <span className="text-xs font-bold text-cyan-800 block">A caminho do chamado?</span>
                    <p className="text-[11px] text-cyan-700">Ao sair rumo ao endereço, acione o deslocamento GPS para que a empresa possa acompanhar o seu progresso.</p>
                    <button
                      onClick={() => handleStartTravel(allocatedTicket.id)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm"
                    >
                      Iniciar Deslocamento (Navegação GPS)
                    </button>
                  </div>
                )}

                {allocatedTicket.status === 'A_Caminho' && (
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-3">
                    <span className="text-xs font-bold text-indigo-800 block">Você chegou ao local do cliente?</span>
                    <p className="text-[11px] text-indigo-700">Ao estacionar e entrar no estabelecimento do cliente, realize o check-in.</p>
                    <button
                      onClick={() => handleArrive(allocatedTicket.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm"
                    >
                      Registrar Chegada (Check-in GPS)
                    </button>
                  </div>
                )}

                {allocatedTicket.status === 'Chegou' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-3">
                    <span className="text-xs font-bold text-emerald-800 block">Pronto para iniciar a execução técnica?</span>
                    <p className="text-[11px] text-emerald-700">Após os cumprimentos formais, inicie o trabalho para liberar a visualização do checklist.</p>
                    <button
                      onClick={() => handleStartService(allocatedTicket.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm"
                    >
                      Iniciar Serviço e Liberar Checklist
                    </button>
                  </div>
                )}

                {/* ACTIVE EXECUTION STEPS */}
                {allocatedTicket.status === 'Em_Andamento' && (
                  <div className="space-y-4">
                    {/* Checklist */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Checklist Técnico de Conformidade</span>
                      <div className="space-y-2.5">
                        {allocatedTicket.checklist?.map((item, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleToggleChecklistItem(allocatedTicket.id, idx)}
                            className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-150 rounded-xl cursor-pointer hover:bg-slate-100/55 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => {}} // handled by parent div click
                              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                            />
                            <span className={`text-xs ${item.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
                              {item.item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Evidence and closure upload panel */}
                    <div className="border-t border-slate-100 pt-4 space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Evidências e Laudo Técnico</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50 space-y-2">
                            <Upload className="h-6 w-6 text-slate-400" />
                            <span className="text-xs font-bold text-slate-600">Comprovação por Foto</span>
                            <span className="text-[10px] text-slate-400">Anexe fotos nítidas dos disjuntores, equipamentos ligados e fiação organizada.</span>
                            <button
                              type="button"
                              onClick={() => handleAddEvidencePhotoSimulated(allocatedTicket.id)}
                              className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[10px] font-bold px-3 py-1.5 rounded transition-colors"
                            >
                              Anexar Foto de Câmera
                            </button>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 block">Assinatura Digital do Cliente (Nome) *</label>
                            <input
                              type="text"
                              value={signatureText}
                              onChange={(e) => setSignatureText(e.target.value)}
                              placeholder="Ex: Carlos Eduardo (Gerente)"
                              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none"
                            />
                            <p className="text-[9px] text-slate-400">Ao preencher, o cliente declara que o check-list foi executado e que aprova o encerramento do chamado.</p>
                          </div>
                        </div>

                        {/* Evidences list */}
                        {allocatedTicket.evidencePhotos && allocatedTicket.evidencePhotos.length > 0 && (
                          <div className="mt-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Fotos Anexadas</span>
                            <div className="flex gap-2">
                              {allocatedTicket.evidencePhotos.map((ph, idx) => (
                                <img key={idx} src={ph} alt="Evidência" className="h-14 w-20 object-cover rounded border border-slate-200 shadow-sm" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Finalize submit */}
                      <button
                        onClick={() => handleCompleteServiceSubmit(allocatedTicket.id)}
                        disabled={closingLoader}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        {closingLoader ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        <span>Concluir Chamado e Gerar Laudo Técnico IA</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Technical GPS instructions sidebar */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Diretrizes de Execução Técnica</h4>
                  <ul className="text-xs text-slate-600 space-y-3">
                    <li className="flex gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0"></span>
                      <span><strong>Uso de EPIs obrigatório:</strong> Sempre calce luvas isolantes, botas com biqueira de composite e capacete com jugular se estiver operando postes (NR35) ou circuitos energizados (NR10).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0"></span>
                      <span><strong>Check-out com Foto:</strong> A ausência de foto de comprovação das conexões de cabeamento ou etiquetas identificadoras poderá acionar o alerta de compliance e reter o payout na auditoria.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl text-[10px] text-indigo-800 flex gap-2 mt-4">
                  <Sparkles className="h-5 w-5 text-indigo-600 flex-shrink-0 animate-pulse" />
                  <p><strong>Copiloto IA Técnico:</strong> Se tiver dúvidas técnicas sobre como configurar o equipamento em campo, mude para a aba de **Assistente Virtual** no Chat!</p>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-3 text-center py-10 bg-white border border-slate-200 rounded-2xl text-slate-400">
              Nenhum chamado ativo alocado para você no momento.
            </div>
          )}
        </div>
      )}

      {/* Gamification, Badges and Leaderboard Tab */}
      {activeTab === 'gamification' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-800">
          {/* Left Columns - Stats and Badges */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bento Progress Card */}
            <div className="bg-gradient-to-br from-[#0c0f1d] to-[#141b35] text-white p-6 rounded-3xl border border-slate-800/80 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Trophy className="h-40 w-40 text-amber-400" />
              </div>
              <div className="relative z-10 space-y-4">
                <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Nível Diamante
                </span>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-400 font-mono">Pontos Nexora acumulados</p>
                    <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 mt-1 font-display">
                      {(currentTech.points || 0).toLocaleString()} <span className="text-sm font-normal text-slate-300">PTS</span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Próximo Nível</p>
                    <p className="text-sm font-bold text-amber-300">10.000 PTS</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min(100, ((currentTech.points || 0) / 10000) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Nível Atual</span>
                    <span>{Math.round(Math.min(100, ((currentTech.points || 0) / 10000) * 100))}% completo</span>
                    <span>10k PTS</span>
                  </div>
                </div>

                {/* Gamified stats bar */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/50 text-center">
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono">Jobs Feitos</p>
                    <p className="text-lg font-bold text-emerald-400">{currentTech.completedJobsCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono">Avaliação Média</p>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <p className="text-lg font-bold text-amber-400">{currentTech.rating}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono">Resposta SLA</p>
                    <div className="flex items-center justify-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-orange-400" />
                      <p className="text-lg font-bold text-orange-400">{currentTech.responseTimeMin || 12} min</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Cabinet */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-md font-bold font-display text-slate-900">Armário de Conquistas (Selos Nexora)</h3>
                  <p className="text-xs text-slate-500">Desbloqueie bônus financeiros adicionais e destaque-se no matching automático</p>
                </div>
                <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-bold">
                  {(currentTech.badges || []).length} de 4 desbloqueados
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Badge 1: Top Performer */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  (currentTech.badges || []).includes("Top Performer") || currentTech.completedJobsCount >= 20
                    ? "bg-amber-500/5 border-amber-200" 
                    : "bg-slate-50 border-slate-100 opacity-60"
                }`}>
                  <div className="flex gap-3">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      (currentTech.badges || []).includes("Top Performer") || currentTech.completedJobsCount >= 20
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/20" 
                        : "bg-slate-200 text-slate-400"
                    }`}>
                      <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-950">Top Performer</h4>
                        {((currentTech.badges || []).includes("Top Performer") || currentTech.completedJobsCount >= 20) ? (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">Ativo</span>
                        ) : (
                          <span className="bg-slate-200 text-slate-500 text-[9px] px-1.5 py-0.5 rounded-full">Bloqueado</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Conclua mais de 20 chamados técnicos com sucesso na plataforma.</p>
                      <div className="mt-2 text-[10px] font-mono text-slate-400">
                        Progresso: {currentTech.completedJobsCount}/20 chamados
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge 2: Customer Favorite */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  (currentTech.badges || []).includes("Customer Favorite") || (currentTech.rating >= 4.8 && currentTech.reviewsCount >= 10)
                    ? "bg-pink-500/5 border-pink-200" 
                    : "bg-slate-50 border-slate-100 opacity-60"
                }`}>
                  <div className="flex gap-3">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      (currentTech.badges || []).includes("Customer Favorite") || (currentTech.rating >= 4.8 && currentTech.reviewsCount >= 10)
                        ? "bg-pink-500 text-white shadow-md shadow-pink-500/20" 
                        : "bg-slate-200 text-slate-400"
                    }`}>
                      <Star className="h-6 w-6 fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-950">Favorito dos Clientes</h4>
                        {((currentTech.badges || []).includes("Customer Favorite") || (currentTech.rating >= 4.8 && currentTech.reviewsCount >= 10)) ? (
                          <span className="bg-pink-100 text-pink-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">Ativo</span>
                        ) : (
                          <span className="bg-slate-200 text-slate-500 text-[9px] px-1.5 py-0.5 rounded-full">Bloqueado</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Mantenha nota de avaliação &ge; 4.8 estrelas com mais de 10 avaliações de empresas.</p>
                      <div className="mt-2 text-[10px] font-mono text-slate-400">
                        Progresso: {currentTech.rating} ★ ({currentTech.reviewsCount}/10 avaliações)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge 3: Agilidade Nexora */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  (currentTech.badges || []).includes("Agilidade Nexora") || (currentTech.responseTimeMin && currentTech.responseTimeMin < 15)
                    ? "bg-orange-500/5 border-orange-200" 
                    : "bg-slate-50 border-slate-100 opacity-60"
                }`}>
                  <div className="flex gap-3">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      (currentTech.badges || []).includes("Agilidade Nexora") || (currentTech.responseTimeMin && currentTech.responseTimeMin < 15)
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" 
                        : "bg-slate-200 text-slate-400"
                    }`}>
                      <Flame className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-950">Agilidade Máxima</h4>
                        {((currentTech.badges || []).includes("Agilidade Nexora") || (currentTech.responseTimeMin && currentTech.responseTimeMin < 15)) ? (
                          <span className="bg-orange-100 text-orange-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">Ativo</span>
                        ) : (
                          <span className="bg-slate-200 text-slate-500 text-[9px] px-1.5 py-0.5 rounded-full">Bloqueado</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Tempo médio de aceite e chegada ao chamado inferior a 15 minutos.</p>
                      <div className="mt-2 text-[10px] font-mono text-slate-400">
                        SLA Atual: {currentTech.responseTimeMin || 12} minutos de resposta
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge 4: Sócio Indicator */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  (currentTech.badges || []).includes("Sócio Indicator") || referrals.some(r => r.referrerId === currentTech.id && r.status === 'completed')
                    ? "bg-emerald-500/5 border-emerald-200" 
                    : "bg-slate-50 border-slate-100 opacity-60"
                }`}>
                  <div className="flex gap-3">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      (currentTech.badges || []).includes("Sócio Indicator") || referrals.some(r => r.referrerId === currentTech.id && r.status === 'completed')
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                        : "bg-slate-200 text-slate-400"
                    }`}>
                      <Coins className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-950">Sócio Indicator</h4>
                        {((currentTech.badges || []).includes("Sócio Indicator") || referrals.some(r => r.referrerId === currentTech.id && r.status === 'completed')) ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">Ativo</span>
                        ) : (
                          <span className="bg-slate-200 text-slate-500 text-[9px] px-1.5 py-0.5 rounded-full">Bloqueado</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Indique pelo menos 1 técnico de campo que venha a concluir seu primeiro chamado.</p>
                      <div className="mt-2 text-[10px] font-mono text-slate-400">
                        Indicados Ativos: {referrals.filter(r => r.referrerId === currentTech.id && r.status === 'completed').length} de 1
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Ranking/Leaderboard */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold font-display text-slate-950 uppercase tracking-wider flex items-center gap-2">
                    <Trophy className="h-4.5 w-4.5 text-amber-500" />
                    Ranking Nacional Nexora
                  </h3>
                  <p className="text-xs text-slate-500">Os técnicos com maior desempenho e satisfação no país</p>
                </div>
              </div>

              {/* Leaderboard list sorted by points */}
              <div className="space-y-3">
                {technicians
                  .map(t => {
                    // Make sure they have some score
                    const score = t.points || (t.id === 'tech-1' ? 5400 : t.id === 'tech-2' ? 2450 : t.id === 'tech-3' ? 6300 : t.id === 'tech-4' ? 1800 : 500);
                    return { ...t, score };
                  })
                  .sort((a, b) => b.score - a.score)
                  .map((tech, idx) => {
                    const isSelf = tech.id === currentTech.id;
                    const rank = idx + 1;
                    return (
                      <div 
                        key={tech.id} 
                        className={`p-3 rounded-2xl flex items-center justify-between border transition-all ${
                          isSelf 
                            ? "bg-indigo-600/5 border-indigo-200 shadow-sm" 
                            : "bg-slate-50/60 border-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Rank Medallion */}
                          <div className={`h-6 w-6 text-xs font-mono font-bold flex items-center justify-center rounded-full ${
                            rank === 1 ? "bg-amber-400 text-white" :
                            rank === 2 ? "bg-slate-300 text-slate-700" :
                            rank === 3 ? "bg-amber-600/30 text-amber-800" :
                            "text-slate-400"
                          }`}>
                            {rank}
                          </div>

                          <img src={tech.avatar} alt={tech.name} className="h-8 w-8 rounded-lg object-cover" />

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-slate-900 leading-none">{tech.name}</h4>
                              {isSelf && (
                                <span className="bg-indigo-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">Você</span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {tech.specialties[0]} • {tech.rating} ★
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-black font-mono text-slate-900">
                            {tech.score.toLocaleString()}
                          </p>
                          <p className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">
                            PTS
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Leaderboard footer disclaimer */}
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl mt-4 text-[10px] text-indigo-800">
                🏆 <strong>Prêmio Trimestral Nexora:</strong> O top 1 do ranking do mês receberá um bônus em dinheiro de R$ 500,00 no pix e preferência absoluta no matching de chamados críticos de grandes teles.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Referrals (Indique e Ganhe) Tab */}
      {activeTab === 'indicacoes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-800">
          {/* Main Left - referral rules & input form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Promo Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6 rounded-3xl text-white border border-emerald-500/30 shadow-md">
              <div className="flex items-start gap-4">
                <div className="bg-white/10 h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-emerald-100" />
                </div>
                <div>
                  <h3 className="text-md font-bold font-display">Programa Indique e Ganhe Nexora</h3>
                  <p className="text-xs text-emerald-100/90 mt-1">
                    Indique colegas técnicos de campo ou empresas que contratam serviços de TI, Telecom, CFTV e Elétrica. 
                    Ambos ganham bônus financeiros logo após a homologação do primeiro chamado!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-white/15 rounded-lg flex items-center justify-center text-white text-xs font-bold font-mono">1</div>
                  <p className="text-xs leading-snug">Seu colega indicado se cadastra na plataforma com seu código.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-white/15 rounded-lg flex items-center justify-center text-white text-xs font-bold font-mono">2</div>
                  <p className="text-xs leading-snug">Vocês dois ganham <strong>R$ 50,00</strong> de bônus no ato do 1º chamado concluído.</p>
                </div>
              </div>
            </div>

            {/* Form & Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Promo Code Display */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Seu Código de Indicação</p>
                  <h4 className="text-xl font-bold font-mono text-emerald-400 mt-2 tracking-wide">
                    {currentTech.referralCode || "ALEX-FIELD-99"}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1.5">Compartilhe no WhatsApp ou redes para atrair parceiros.</p>
                </div>

                <div className="border-t border-slate-800/80 pt-4 mt-4">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(currentTech.referralCode || "ALEX-FIELD-99");
                      setRefSuccessMsg("Código copiado para a área de transferência! Envie para seus colegas.");
                      setTimeout(() => setRefSuccessMsg(""), 3000);
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Copiar Código</span>
                  </button>
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md md:col-span-2">
                <h3 className="text-sm font-bold font-display text-slate-950 mb-4 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-emerald-500" />
                  Gerar Novo Convite Comercial
                </h3>

                <form onSubmit={handleCreateReferral} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Nome do Indicado</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Giselle Lima de Albuquerque" 
                        value={refName}
                        onChange={e => setRefName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800 mt-1 bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Contato (WhatsApp/E-mail)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: (71) 99876-5432" 
                        value={refContact}
                        onChange={e => setRefContact(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800 mt-1 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tipo de Indicação</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button" 
                        onClick={() => setRefType('tech')}
                        className={`text-xs py-2.5 rounded-xl font-bold border transition-all ${
                          refType === 'tech' 
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-800" 
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        Técnico de Campo
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setRefType('company')}
                        className={`text-xs py-2.5 rounded-xl font-bold border transition-all ${
                          refType === 'company' 
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-800" 
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        Empresa Contratante
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/10"
                  >
                    Cadastrar Indicação na Plataforma
                  </button>
                </form>

                {refSuccessMsg && (
                  <div className="mt-3 text-xs bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 animate-fade-in">
                    {refSuccessMsg}
                  </div>
                )}
              </div>
            </div>

            {/* Referrals Pipeline Tracker */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
              <h3 className="text-sm font-bold font-display text-slate-950 mb-4">Suas Indicações Ativas</h3>
              
              {referrals.filter(r => r.referrerId === currentTech.id).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Nenhuma indicação cadastrada sob o seu código ainda. Use o formulário acima para começar a lucrar!
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] font-bold font-mono">
                        <th className="pb-2">Indicado</th>
                        <th className="pb-2">Contato</th>
                        <th className="pb-2">Tipo</th>
                        <th className="pb-2">Status do Fluxo</th>
                        <th className="pb-2">Regra de Recompensa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {referrals
                        .filter(r => r.referrerId === currentTech.id)
                        .map(ref => (
                          <tr key={ref.id} className="hover:bg-slate-50/50">
                            <td className="py-3 font-bold text-slate-900">{ref.referredName}</td>
                            <td className="py-3 text-slate-500 font-mono">{ref.referredEmailOrPhone}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                                ref.referredType === 'tech' ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                              }`}>
                                {ref.referredType === 'tech' ? "Técnico" : "Empresa"}
                              </span>
                            </td>
                            <td className="py-3">
                              {ref.status === 'completed' ? (
                                <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-1 rounded-full text-[10px] flex items-center gap-1 w-max">
                                  <CheckCircle className="h-3.5 w-3.5" /> Bônus Creditado!
                                </span>
                              ) : (
                                <span className="bg-amber-50 text-amber-800 font-bold px-2 py-1 rounded-full text-[10px] flex items-center gap-1 w-max">
                                  <Loader2 className="h-3 w-3 animate-spin text-amber-600" /> Aguardando 1º Job
                                </span>
                              )}
                            </td>
                            <td className="py-3 text-slate-500">{ref.rewardDetails}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - referral simulation tools */}
          <div className="space-y-6">
            {/* My referral wallet */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
              <h3 className="text-sm font-bold font-display text-slate-950 mb-4 uppercase tracking-wider">
                Sua Carteira de Bônus
              </h3>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono">Bônus Acumulado Disponível</p>
                    <h3 className="text-2xl font-black text-emerald-600 mt-1 font-mono">
                      R$ {(currentTech.referralCredits || 0).toFixed(2)}
                    </h3>
                  </div>
                  <Coins className="h-10 w-10 text-emerald-500 opacity-20" />
                </div>

                <ul className="text-xs text-slate-500 space-y-2 pl-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                    <span>Resgatável via PIX a qualquer momento.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                    <span>Livre de tarifas de intermediação.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interactive Simulation Sandbox */}
            <div className="bg-gradient-to-br from-[#0c0f1d] to-[#141b35] text-white p-6 rounded-3xl border border-slate-800/80 shadow-lg space-y-4">
              <div>
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                  Nexora Sandbox
                </span>
                <h3 className="text-sm font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-100 mt-2">
                  Simulação de Ativação do Indicado
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Para fins de teste, use os botões abaixo para simular que um colega indicado concluiu o primeiro job! Isso ativará o payout de comissões instantaneamente em tempo real.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                {referrals.filter(r => r.referrerId === currentTech.id && r.status === 'pending').length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic text-center py-4 bg-slate-900/60 rounded-xl">
                    Cadastre uma nova indicação ao lado para testar a ativação aqui!
                  </p>
                ) : (
                  referrals
                    .filter(r => r.referrerId === currentTech.id && r.status === 'pending')
                    .map(ref => (
                      <button
                        key={ref.id}
                        onClick={() => {
                          // Complete referral status
                          setReferrals(prev => prev.map(r => {
                            if (r.id === ref.id) {
                              return { ...r, status: 'completed', completedAt: new Date().toISOString(), rewardPaid: true };
                            }
                            return r;
                          }));

                          // Add 50 referral credits and 500 points
                          currentTech.referralCredits = (currentTech.referralCredits || 0) + (ref.referredType === 'tech' ? 50 : 100);
                          currentTech.points = (currentTech.points || 0) + 500;
                          if (!currentTech.badges.includes("Sócio Indicator")) {
                            currentTech.badges.push("Sócio Indicator");
                          }

                          onAddAuditLog({
                            type: 'growth',
                            message: `SIMULAÇÃO: ${ref.referredName} completou sua 1ª tarefa com sucesso na plataforma.`
                          });
                          
                          setRefSuccessMsg(`Sucesso na simulação! Bônus de R$ ${ref.referredType === 'tech' ? '50,00' : '100,00'} adicionado à sua carteira e 500 PTS somados à sua pontuação do ranking!`);
                        }}
                        className="w-full text-left bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-3 rounded-2xl transition-all flex items-center justify-between text-xs hover:bg-[#121626]"
                      >
                        <div>
                          <p className="font-bold text-slate-200">{ref.referredName}</p>
                          <p className="text-[10px] text-slate-500">Status: Pendente de 1º Job</p>
                        </div>
                        <span className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                          Simular Ativação 🚀
                        </span>
                      </button>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
