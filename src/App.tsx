import React, { useState, useEffect } from "react";
import { 
  Company, Technician, Ticket, ChatMessage, FinancialTransaction, AiAuditLog,
  Referral, LeadCompany, LeadTech
} from "./types";
import { 
  INITIAL_COMPANIES, INITIAL_TECHNICIANS, INITIAL_TICKETS, 
  INITIAL_CHAT_MESSAGES, INITIAL_TRANSACTIONS, INITIAL_AI_AUDIT_LOGS,
  INITIAL_REFERRALS, INITIAL_LEAD_COMPANIES, INITIAL_LEAD_TECHS
} from "./data";

// ---------- API helpers ----------
async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

function mapTechRow(row: any): Technician {
  return {
    ...row,
    specialties: row.specialties ?? [],
    equipment: row.equipment ?? [],
    availabilityDays: row.availabilityDays ?? row.availability_days ?? [],
    availabilityHours: row.availabilityHours ?? row.availability_hours ?? "",
    radiusKm: row.radiusKm ?? row.radius_km ?? 30,
    pixKey: row.pixKey ?? row.pix_key ?? "",
    pixType: row.pixType ?? row.pix_type ?? "",
    bankName: row.bankName ?? row.bank_name ?? "",
    accountNumber: row.accountNumber ?? row.account_number ?? "",
    reviewsCount: row.reviewsCount ?? row.reviews_count ?? 0,
    completedJobsCount: row.completedJobsCount ?? row.completed_jobs_count ?? 0,
    documentsApproved: row.documentsApproved ?? row.documents_approved ?? false,
    signedContract: row.signedContract ?? row.signed_contract ?? false,
    badges: row.badges ?? [],
    birthDate: row.birthDate ?? row.birth_date ?? "",
  };
}

function mapTicketRow(row: any): Ticket {
  return {
    ...row,
    photos: row.photos ?? [],
    documents: row.documents ?? [],
    checklist: row.checklist ?? [],
    evidencePhotos: row.evidencePhotos ?? row.evidence_photos ?? [],
    fraudAlerts: row.fraudAlerts ?? row.fraud_alerts ?? [],
    invitedTechIds: row.invitedTechIds ?? row.invited_tech_ids ?? [],
    declinedTechIds: row.declinedTechIds ?? row.declined_tech_ids ?? [],
    assignedTechId: row.assignedTechId ?? row.assigned_tech_id,
    companyId: row.companyId ?? row.company_id ?? "",
    suggestedValue: row.suggestedValue ?? row.suggested_value ?? 0,
    ratingByCompany: row.ratingByCompany ?? row.rating_by_company ?? undefined,
    ratingByTech: row.ratingByTech ?? row.rating_by_tech ?? undefined,
    technicalReport: row.technicalReport ?? row.technical_report,
    clientSignature: row.clientSignature ?? row.client_signature,
    invoiceUploaded: row.invoiceUploaded ?? row.invoice_uploaded ?? false,
    createdAt: row.createdAt ?? row.created_at ?? new Date().toISOString(),
  };
}

function mapTxRow(row: any): FinancialTransaction {
  return {
    ...row,
    ticketId: row.ticketId ?? row.ticket_id ?? "",
    ticketTitle: row.ticketTitle ?? row.ticket_title ?? "",
    companyName: row.companyName ?? row.company_name ?? "",
    techName: row.techName ?? row.tech_name ?? "",
    totalAmount: row.totalAmount ?? row.total_amount ?? 0,
    platformCommission: row.platformCommission ?? row.platform_commission ?? 15,
    platformEarnings: row.platformEarnings ?? row.platform_earnings ?? 0,
    techPayout: row.techPayout ?? row.tech_payout ?? 0,
    paymentMethod: row.paymentMethod ?? row.payment_method ?? "PIX",
    createdAt: row.createdAt ?? row.created_at ?? new Date().toISOString(),
  };
}

function mapLogRow(row: any): AiAuditLog {
  return {
    ...row,
    ticketId: row.ticketId ?? row.ticket_id,
    timestamp: row.timestamp ?? new Date().toISOString(),
  };
}

// Portals & Components
import RoleSwitcher from "./components/RoleSwitcher";
import AdminPortal from "./components/AdminPortal";
import CompanyPortal from "./components/CompanyPortal";
import TechnicianPortal from "./components/TechnicianPortal";
import ComercialPortal from "./components/ComercialPortal";
import SharedChat from "./components/SharedChat";
import EnterpriseAuthModal from "./components/EnterpriseAuthModal";
import LandingPage from "./components/LandingPage";
import SelfServiceRegister from "./components/SelfServiceRegister";
import OnboardingWizard from "./components/OnboardingWizard";

type AppView = 'landing' | 'register' | 'onboarding' | 'app';

export default function App() {
  const [dbLoaded, setDbLoaded] = useState(false);
  const [appView, setAppView] = useState<AppView>('landing');
  const [onboardingData, setOnboardingData] = useState<{ company: any; user: any; plan: string } | null>(null);

  // Master state with LocalStorage synchronization
  const [role, setRole] = useState<'admin' | 'company' | 'tech' | 'comercial'>(() => {
    const saved = localStorage.getItem("nexorafield_role");
    return (saved as any) || 'admin';
  });

  // Real JWT authentication states
  const [tokens, setTokens] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("nexorafield_tokens");
    return saved ? JSON.parse(saved) : {};
  });

  const [authenticatedUsers, setAuthenticatedUsers] = useState<Record<string, { email: string; name: string; role: string; tenantId: string }>>(() => {
    const saved = localStorage.getItem("nexorafield_auth_users");
    return saved ? JSON.parse(saved) : {};
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem("nexorafield_companies");
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    const saved = localStorage.getItem("nexorafield_technicians");
    return saved ? JSON.parse(saved) : INITIAL_TECHNICIANS;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem("nexorafield_tickets");
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("nexorafield_messages");
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem("nexorafield_transactions");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AiAuditLog[]>(() => {
    const saved = localStorage.getItem("nexorafield_audit_logs");
    return saved ? JSON.parse(saved) : INITIAL_AI_AUDIT_LOGS;
  });

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const saved = localStorage.getItem("nexorafield_referrals");
    return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
  });

  const [leadCompanies, setLeadCompanies] = useState<LeadCompany[]>(() => {
    const saved = localStorage.getItem("nexorafield_lead_companies");
    return saved ? JSON.parse(saved) : INITIAL_LEAD_COMPANIES;
  });

  const [leadTechs, setLeadTechs] = useState<LeadTech[]>(() => {
    const saved = localStorage.getItem("nexorafield_lead_techs");
    return saved ? JSON.parse(saved) : INITIAL_LEAD_TECHS;
  });

  // Hydrate state from PostgreSQL API on mount
  useEffect(() => {
    async function loadFromDB() {
      try {
        const [compsRaw, techsRaw, ticketsRaw, txsRaw, logsRaw] = await Promise.all([
          apiFetch<any[]>("/api/companies"),
          apiFetch<any[]>("/api/technicians"),
          apiFetch<any[]>("/api/tickets"),
          apiFetch<any[]>("/api/transactions"),
          apiFetch<any[]>("/api/audit-logs"),
        ]);
        if (compsRaw.length > 0) setCompanies(compsRaw);
        if (techsRaw.length > 0) setTechnicians(techsRaw.map(mapTechRow));
        if (ticketsRaw.length > 0) setTickets(ticketsRaw.map(mapTicketRow));
        if (txsRaw.length > 0) setTransactions(txsRaw.map(mapTxRow));
        if (logsRaw.length > 0) setAuditLogs(logsRaw.map(mapLogRow));
        setDbLoaded(true);
      } catch (err) {
        console.warn("API hydration failed (using localStorage fallback):", err);
        setDbLoaded(true);
      }
    }
    loadFromDB();
  }, []);

  // Save states to local storage on changes
  useEffect(() => {
    localStorage.setItem("nexorafield_role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("nexorafield_tokens", JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem("nexorafield_auth_users", JSON.stringify(authenticatedUsers));
  }, [authenticatedUsers]);

  useEffect(() => {
    localStorage.setItem("nexorafield_companies", JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem("nexorafield_technicians", JSON.stringify(technicians));
  }, [technicians]);

  useEffect(() => {
    localStorage.setItem("nexorafield_tickets", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem("nexorafield_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("nexorafield_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("nexorafield_audit_logs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem("nexorafield_referrals", JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem("nexorafield_lead_companies", JSON.stringify(leadCompanies));
  }, [leadCompanies]);

  useEffect(() => {
    localStorage.setItem("nexorafield_lead_techs", JSON.stringify(leadTechs));
  }, [leadTechs]);

  // -------------------------------------------------------------
  // Global Action Handlers
  // -------------------------------------------------------------

  const handleAddCompany = async (newComp: Omit<Company, 'id'>) => {
    const comp: Company = { ...newComp, id: `comp-${Date.now()}` };
    setCompanies(prev => [...prev, comp]);
    try {
      await apiFetch("/api/companies", { method: "POST", body: JSON.stringify(comp) });
    } catch (e) { console.warn("Failed to persist company:", e); }
  };

  const handleAddTechnician = async (newTech: Omit<Technician, 'id' | 'completedJobsCount' | 'reviewsCount' | 'rating' | 'documentsApproved' | 'signedContract'>) => {
    const tech: Technician = {
      ...newTech,
      id: `tech-${Date.now()}`,
      completedJobsCount: 0,
      reviewsCount: 0,
      rating: 5.0,
      documentsApproved: true,
      signedContract: true
    };
    setTechnicians(prev => [...prev, tech]);
    try {
      await apiFetch("/api/technicians", { method: "POST", body: JSON.stringify(tech) });
    } catch (e) { console.warn("Failed to persist technician:", e); }
  };

  const handleAddTicket = async (ticket: Ticket) => {
    setTickets(prev => [...prev, ticket]);
    try {
      await apiFetch("/api/tickets", { method: "POST", body: JSON.stringify(ticket) });
    } catch (e) { console.warn("Failed to persist ticket:", e); }
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: any) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    try {
      await apiFetch(`/api/tickets/${ticketId}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    } catch (e) { console.warn("Failed to persist ticket status:", e); }
  };

  const handleAllocateTech = async (ticketId: string, techId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assignedTechId: techId } : t));
    try {
      await apiFetch(`/api/tickets/${ticketId}/status`, { method: "PATCH", body: JSON.stringify({ assignedTechId: techId }) });
    } catch (e) { console.warn("Failed to persist tech allocation:", e); }
  };

  const handleUpdateChecklist = (ticketId: string, checklist: any[]) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, checklist };
      }
      return t;
    }));
  };

  const handleAddEvidence = (ticketId: string, photoUrl: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const evidencePhotos = t.evidencePhotos ? [...t.evidencePhotos, photoUrl] : [photoUrl];
        return { ...t, evidencePhotos };
      }
      return t;
    }));
  };

  const handleCompleteService = (ticketId: string, signature: string, laudo: string, fraudAlerts: string[]) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { 
          ...t, 
          status: 'Aguardando_Aprovacao',
          clientSignature: signature,
          technicalReport: laudo,
          fraudAlerts
        };
      }
      return t;
    }));
  };

  const handleApproveTicketClose = (ticketId: string, stars: number, comment: string) => {
    // 1. Get Ticket & Tech
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const tech = technicians.find(tec => tec.id === ticket.assignedTechId);
    const comp = companies.find(c => c.id === ticket.companyId);

    // 2. Process split finances
    const totalAmount = ticket.suggestedValue;
    const platformCommission = 15; // 15%
    const platformEarnings = totalAmount * (platformCommission / 100);
    const techPayout = totalAmount - platformEarnings;

    const transaction: FinancialTransaction = {
      id: `trans-${Date.now()}`,
      ticketId,
      ticketTitle: ticket.title,
      companyName: comp?.name || "Empresa Parceira",
      text: "", // satisfied by interface
      techName: tech?.name || "Prestador",
      totalAmount,
      platformCommission,
      platformEarnings,
      techPayout,
      paymentMethod: 'PIX',
      status: 'Pago',
      createdAt: new Date().toISOString()
    } as any;

    setTransactions(prev => [...prev, transaction]);
    apiFetch("/api/transactions", { method: "POST", body: JSON.stringify(transaction) })
      .catch(e => console.warn("Failed to persist transaction:", e));

    // 3. Update Technician metrics (ratings, jobs completed, points, badges, referrals)
    if (tech) {
      const isFirstJob = tech.completedJobsCount === 0;
      setTechnicians(prev => prev.map(t => {
        if (t.id === tech.id) {
          const totalReviews = t.reviewsCount + 1;
          const currentRatingTotal = t.rating * t.reviewsCount;
          const newRating = parseFloat(((currentRatingTotal + stars) / totalReviews).toFixed(2));
          const newCompletedJobs = t.completedJobsCount + 1;

          // Points: 120 points for completing, +50 points if rating is 5 stars
          const extraPoints = 120 + (stars === 5 ? 50 : 0);
          const currentPoints = t.points || 0;
          const newPoints = currentPoints + extraPoints;

          // Badge computation
          const currentBadges = t.badges || [];
          const updatedBadges = [...currentBadges];
          if (newCompletedJobs >= 20 && !updatedBadges.includes("Top Performer")) {
            updatedBadges.push("Top Performer");
          }
          if (newRating >= 4.8 && totalReviews >= 10 && !updatedBadges.includes("Customer Favorite")) {
            updatedBadges.push("Customer Favorite");
          }
          if (newCompletedJobs >= 5 && (t.responseTimeMin || 15) < 15 && !updatedBadges.includes("Agilidade Nexora")) {
            updatedBadges.push("Agilidade Nexora");
          }

          return {
            ...t,
            reviewsCount: totalReviews,
            completedJobsCount: newCompletedJobs,
            rating: newRating,
            status: 'online', // available again
            points: newPoints,
            badges: updatedBadges
          };
        }
        return t;
      }));

      // Check referral reward for technician's first job!
      if (isFirstJob) {
        // Look up pending referrals for this tech
        const matchedRefIndex = referrals.findIndex(ref => 
          ref.status === 'pending' &&
          ref.referredType === 'tech' &&
          (ref.referredEmailOrPhone === tech.email || 
           ref.referredEmailOrPhone === tech.phone || 
           ref.referredName.toLowerCase() === tech.name.toLowerCase())
        );

        if (matchedRefIndex !== -1) {
          const matchedRef = referrals[matchedRefIndex];
          
          // Complete the referral status
          setReferrals(prev => prev.map(ref => {
            if (ref.id === matchedRef.id) {
              return { ...ref, status: 'completed', completedAt: new Date().toISOString(), rewardPaid: true };
            }
            return ref;
          }));

          // Credit R$ 50 to referred tech
          setTechnicians(prev => prev.map(t => {
            if (t.id === tech.id) {
              return { ...t, referralCredits: (t.referralCredits || 0) + 50, points: (t.points || 0) + 500 }; // 500 bonus points
            }
            // Credit R$ 50 to referrer (could be tech or company)
            if (matchedRef.referrerType === 'tech' && t.id === matchedRef.referrerId) {
              return { ...t, referralCredits: (t.referralCredits || 0) + 50, points: (t.points || 0) + 500 };
            }
            return t;
          }));

          if (matchedRef.referrerType === 'company') {
            setCompanies(prev => prev.map(c => {
              if (c.id === matchedRef.referrerId) {
                return { ...c, referralCredits: (c.referralCredits || 0) + 100 }; // Companies get R$ 100
              }
              return c;
            }));
          }

          // Log and chat message
          const referralMsg: ChatMessage = {
            id: `msg-ref-${Date.now()}`,
            ticketId,
            senderType: 'system',
            senderName: 'Nexora Growth IA',
            senderId: 'system',
            text: `🎉 INDICAÇÃO PREMIADA! Alexandre concluiu seu 1º chamado técnico! O indicador (${matchedRef.referrerType === 'tech' ? 'técnico' : 'empresa'}) e o indicado receberam R$ 50,00 de bônus!`,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, referralMsg]);

          handleAddAuditLog({
            type: 'growth',
            ticketId,
            message: `Programa de Indicação: Indicação ${matchedRef.id} completada com sucesso. Recompensas pagas.`
          });
        }
      }
    }

    // Check referral reward for company's first completed ticket!
    if (comp) {
      const isFirstCompanyJob = tickets.filter(t => t.companyId === comp.id && t.status === 'Finalizado').length === 0;
      if (isFirstCompanyJob) {
        const matchedRefIndex = referrals.findIndex(ref => 
          ref.status === 'pending' &&
          ref.referredType === 'company' &&
          (ref.referredEmailOrPhone === comp.email || 
           ref.referredName.toLowerCase() === comp.name.toLowerCase())
        );

        if (matchedRefIndex !== -1) {
          const matchedRef = referrals[matchedRefIndex];

          setReferrals(prev => prev.map(ref => {
            if (ref.id === matchedRef.id) {
              return { ...ref, status: 'completed', completedAt: new Date().toISOString(), rewardPaid: true };
            }
            return ref;
          }));

          // Credit R$ 100 to both companies
          setCompanies(prev => prev.map(c => {
            if (c.id === comp.id) {
              return { ...c, referralCredits: (c.referralCredits || 0) + 100 };
            }
            if (matchedRef.referrerType === 'company' && c.id === matchedRef.referrerId) {
              return { ...c, referralCredits: (c.referralCredits || 0) + 100 };
            }
            return c;
          }));

          if (matchedRef.referrerType === 'tech') {
            setTechnicians(prev => prev.map(t => {
              if (t.id === matchedRef.referrerId) {
                return { ...t, referralCredits: (t.referralCredits || 0) + 50, points: (t.points || 0) + 500 };
              }
              return t;
            }));
          }

          // Chat message and audit log
          const companyReferralMsg: ChatMessage = {
            id: `msg-ref-c-${Date.now()}`,
            ticketId,
            senderType: 'system',
            senderName: 'Nexora Growth IA',
            senderId: 'system',
            text: `🎉 INDICAÇÃO DE EMPRESA! ${comp.name} concluiu seu 1º chamado técnico! Ambas as empresas receberam R$ 100,00 de bônus!`,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, companyReferralMsg]);

          handleAddAuditLog({
            type: 'growth',
            ticketId,
            message: `Programa de Indicação Empresa: Indicação ${matchedRef.id} concluída. Bônus de R$ 100,00 creditado.`
          });
        }
      }
    }

    // 4. Update Ticket with final status & reviews
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'Finalizado',
          ratingByCompany: {
            stars,
            comment
          }
        };
      }
      return t;
    }));

    // 5. Send message log
    const systemMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      ticketId,
      senderType: 'system',
      senderName: 'Nexora IA',
      senderId: 'system',
      text: `O chamado foi finalizado e homologado pelo contratante. Repasse de R$ ${techPayout.toFixed(2)} liberado para a chave PIX do técnico.`,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, systemMsg]);

    handleAddAuditLog({
      type: 'report',
      ticketId,
      message: `Split de pagamento concluído: R$ ${platformEarnings.toFixed(2)} de comissão NexoraField e R$ ${techPayout.toFixed(2)} creditados ao técnico.`
    });
  };

  const handleSendMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAddAuditLog = async (log: Omit<AiAuditLog, 'id' | 'timestamp'>) => {
    const newLog: AiAuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [...prev, newLog]);
    try {
      await apiFetch("/api/audit-logs", { method: "POST", body: JSON.stringify(newLog) });
    } catch (e) { console.warn("Failed to persist audit log:", e); }
  };

  const handleLogout = (targetRole: 'admin' | 'company' | 'tech' | 'comercial') => {
    setTokens(prev => {
      const next = { ...prev };
      delete next[targetRole];
      return next;
    });
    setAuthenticatedUsers(prev => {
      const next = { ...prev };
      delete next[targetRole];
      return next;
    });
    handleAddAuditLog({
      type: 'assist',
      message: `Usuário desconectou do portal de ${targetRole}. Token JWT revogado.`
    });
  };

  const handleLoginSuccess = (token: string, user: { email: string; name: string; role: string; tenantId: string }) => {
    setTokens(prev => ({ ...prev, [user.role]: token }));
    setAuthenticatedUsers(prev => ({ ...prev, [user.role]: user }));
    handleAddAuditLog({
      type: 'assist',
      message: `Autenticação JWT bem-sucedida para o usuário ${user.name} no escopo ${user.role}.`
    });
  };

  const handleReassignTech = (ticketId: string, techId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { 
          ...t, 
          assignedTechId: techId,
          status: 'Aprovado' // returns to approved status for restart
        };
      }
      return t;
    }));
    handleAddAuditLog({
      type: 'matching',
      ticketId,
      message: `Administrador alterou manualmente o técnico alocado para o chamado.`
    });
  };

  const handleCancelTicket = (ticketId: string) => {
    handleUpdateTicketStatus(ticketId, 'Cancelado');
    handleAddAuditLog({
      type: 'matching',
      ticketId,
      message: `Chamado técnico cancelado de forma administrativa.`
    });
  };

  const handleReopenTicket = (ticketId: string) => {
    handleUpdateTicketStatus(ticketId, 'Aprovado');
    handleAddAuditLog({
      type: 'matching',
      ticketId,
      message: `Chamado técnico reaberto para re-execução em campo.`
    });
  };

  // Pre-selected entities for Portals demo
  const currentCompany = companies[1] || companies[0]; // SolarSol S.A.
  const currentTech = technicians[0]; // Alexandre Santos

  // Landing page view
  if (appView === 'landing') {
    return (
      <LandingPage
        onGoToRegister={() => setAppView('register')}
        onGoToLogin={() => setAppView('app')}
      />
    );
  }

  // Self-service registration view
  if (appView === 'register') {
    return (
      <SelfServiceRegister
        onSuccess={(data) => {
          setOnboardingData(data);
          setAppView('onboarding');
        }}
        onBack={() => setAppView('landing')}
      />
    );
  }

  // Onboarding wizard view
  if (appView === 'onboarding' && onboardingData) {
    return (
      <OnboardingWizard
        company={onboardingData.company}
        user={onboardingData.user}
        plan={onboardingData.plan}
        onComplete={() => setAppView('app')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-100 flex flex-col font-sans">
      {/* Dynamic Role Switcher stick to top */}
      <RoleSwitcher 
        currentRole={role} 
        onChangeRole={setRole} 
        onlineCount={technicians.filter(t => t.status === 'online').length} 
        tokens={tokens}
        authenticatedUsers={authenticatedUsers}
        onLogout={handleLogout}
      />

      {/* Main content body */}
      <main className="flex-1 pb-12">
        {!tokens[role] ? (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <EnterpriseAuthModal 
              role={role} 
              onLoginSuccess={handleLoginSuccess} 
            />
          </div>
        ) : (
          <>
            {role === 'admin' && (
              <AdminPortal
                companies={companies}
                technicians={technicians}
                tickets={tickets}
                transactions={transactions}
                auditLogs={auditLogs}
                referrals={referrals}
                leadCompanies={leadCompanies}
                leadTechs={leadTechs}
                setReferrals={setReferrals}
                setLeadCompanies={setLeadCompanies}
                setLeadTechs={setLeadTechs}
                onAddCompany={handleAddCompany}
                onAddTechnician={handleAddTechnician}
                onUpdateTicketStatus={handleUpdateTicketStatus}
                onReassignTech={handleReassignTech}
                onCancelTicket={handleCancelTicket}
                onReopenTicket={handleReopenTicket}
              />
            )}

            {role === 'company' && (
              <CompanyPortal
                currentCompany={currentCompany}
                tickets={tickets}
                technicians={technicians}
                transactions={transactions}
                referrals={referrals}
                setReferrals={setReferrals}
                companies={companies}
                onAddTicket={handleAddTicket}
                onUpdateTicketStatus={handleUpdateTicketStatus}
                onApproveTicketClose={handleApproveTicketClose}
                onAddAuditLog={handleAddAuditLog}
              />
            )}

            {role === 'tech' && (
              <TechnicianPortal
                currentTech={currentTech}
                technicians={technicians}
                tickets={tickets}
                referrals={referrals}
                setReferrals={setReferrals}
                onUpdateTicketStatus={handleUpdateTicketStatus}
                onAllocateTech={handleAllocateTech}
                onUpdateChecklist={handleUpdateChecklist}
                onAddEvidence={handleAddEvidence}
                onCompleteService={handleCompleteService}
                onAddAuditLog={handleAddAuditLog}
              />
            )}

            {role === 'comercial' && (
              <ComercialPortal
                leadCompanies={leadCompanies}
                leadTechs={leadTechs}
                companies={companies}
                technicians={technicians}
                setLeadCompanies={setLeadCompanies}
                setLeadTechs={setLeadTechs}
                onAddCompany={handleAddCompany}
                onAddAuditLog={handleAddAuditLog}
              />
            )}
          </>
        )}

        {/* PERSISTENT BOTTOM MODULES: COLLABORATIVE CHAT & AUDIT LOGS */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 gap-6 mt-4">
          <SharedChat 
            currentRole={role}
            tickets={tickets}
            technicians={technicians}
            companies={companies}
            messages={messages}
            onSendMessage={handleSendMessage}
            systemContext={{
              totalFaturamento: transactions.reduce((acc, t) => acc + t.totalAmount, 0),
              totalCommission: transactions.reduce((acc, t) => acc + t.platformEarnings, 0),
              onlineTechsCount: technicians.filter(t => t.status === 'online').length,
              ticketsCount: tickets.length,
              ticketsCompleted: tickets.filter(t => t.status === 'Finalizado').length
            }}
          />
        </div>
      </main>

      {/* Humble visual footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-4 text-center text-xs font-mono">
        NexoraField • Plataforma FSM de Alta Performance powered by Gemini AI • © 2026
      </footer>
    </div>
  );
}
