export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnpj: string;
  city: string;
  state: string;
  avatar: string;
  segment: string;
  referralCode?: string;
  referredBy?: string;
  referralCredits?: number;
}

export interface Technician {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  birthDate: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  state: string;
  cep: string;
  address: string;
  avatar: string;
  selfie?: string;
  cnh?: string;
  comprovanteResidencia?: string;
  crea?: string;
  nr10: boolean;
  nr35: boolean;
  nr33: boolean;
  specialties: string[]; // e.g. CFTV, Redes, Solar, Elétrica
  equipment: string[]; // e.g. Carro, Escada, OTDR, Notebook, Multímetro, EPIs
  availabilityDays: string[]; // e.g. ["Seg", "Ter", "Qua", "Qui", "Sex"]
  availabilityHours: string; // e.g. "08:00 - 18:00"
  radiusKm: number;
  latitude: number;
  longitude: number;
  pixKey: string;
  pixType: string;
  bankName: string;
  agency: string;
  accountNumber: string;
  rating: number;
  reviewsCount: number;
  completedJobsCount: number;
  status: 'online' | 'offline' | 'busy';
  documentsApproved: boolean;
  signedContract: boolean;
  points?: number;
  badges?: string[];
  referralCode?: string;
  referredBy?: string;
  referralCredits?: number;
  responseTimeMin?: number;
}

export type TicketStatus =
  | 'Aberto'               // Created, awaiting AI classification/matching
  | 'IA_Processando'       // AI is reading description and matching techs
  | 'Convites_Enviados'    // Invitations sent to matching technicians
  | 'Aceito'               // A technician accepted, company must approve him
  | 'Aprovado'             // Technician approved, waiting to arrive on-site
  | 'A_Caminho'            // Technician is traveling (GPS active)
  | 'Chegou'               // Technician arrived at location
  | 'Em_Andamento'         // Technician started the service, performing checklist
  | 'Aguardando_Aprovacao' // Technician finished, uploaded evidence, waiting for company approval
  | 'Finalizado'           // Approved by company, payment split processed
  | 'Cancelado';           // Cancelled

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  specialty: string;
  urgency: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  date: string;
  time: string;
  cep: string;
  city: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  suggestedValue: number;
  deadline: string;
  photos: string[];
  documents: string[];
  status: TicketStatus;
  companyId: string;
  assignedTechId?: string;
  invitedTechIds?: string[];
  declinedTechIds?: string[];
  checklist?: {
    item: string;
    completed: boolean;
  }[];
  evidencePhotos?: string[];
  evidenceVideo?: string;
  technicalReport?: string; // AI generated
  clientSignature?: string;
  invoiceUploaded?: boolean;
  ratingByCompany?: {
    stars: number;
    comment: string;
  };
  ratingByTech?: {
    stars: number;
    comment: string;
  };
  createdAt: string;
  fraudAlerts?: string[];
}

export interface ChatMessage {
  id: string;
  ticketId: string;
  senderType: 'admin' | 'company' | 'tech' | 'system';
  senderName: string;
  senderId: string;
  text: string;
  timestamp: string;
  fileUrl?: string;
  fileType?: 'image' | 'video' | 'pdf' | 'voice';
  location?: { lat: number; lng: number };
}

export interface FinancialTransaction {
  id: string;
  ticketId: string;
  ticketTitle: string;
  companyName: string;
  techName: string;
  totalAmount: number;
  platformCommission: number; // e.g. 15%
  platformEarnings: number;
  techPayout: number;
  paymentMethod: 'PIX' | 'Cartão' | 'Boleto';
  status: 'Pendente' | 'Retido' | 'Pago' | 'Estornado';
  createdAt: string;
}

export interface AiAuditLog {
  id: string;
  ticketId?: string;
  type: 'classification' | 'matching' | 'report' | 'fraud_check' | 'assist' | 'growth';
  message: string;
  timestamp: string;
  details?: any;
}

export interface Referral {
  id: string;
  referrerType: 'company' | 'tech';
  referrerId: string;
  referredType: 'company' | 'tech';
  referredName: string;
  referredEmailOrPhone: string;
  status: 'pending' | 'completed';
  rewardPaid: boolean;
  rewardDetails: string;
  createdAt: string;
  completedAt?: string;
}

export interface LeadCompany {
  id: string;
  name: string;
  cnpj?: string;
  segment: string;
  city: string;
  state: string;
  size: 'Pequena' | 'Média' | 'Grande';
  ratingStars: number; // 1 to 5 stars
  contactChannel: string; // WhatsApp, E-mail, etc.
  contactStatus: 'Sem_Interesse' | 'Interessado_Futuramente' | 'Interessado' | 'Demonstracao_Agendada' | 'Negociacao' | 'Cliente';
  phone: string;
  email: string;
  responsibleName?: string;
  responsibleRole?: string;
  historyLogs: { timestamp: string; message: string; type: 'system' | 'ai' | 'user' }[];
  demoDate?: string;
  createdAt: string;
  estimatedValue?: number;
}

export interface LeadTech {
  id: string;
  name: string;
  city: string;
  state: string;
  specialty: string;
  experienceYears: number;
  phone: string;
  email: string;
  classification: 'Especialista' | 'Sênior' | 'Pleno' | 'Júnior' | 'Em treinamento';
  status: 'Encontrado' | 'Contatado' | 'Cadastro_Iniciado' | 'Cadastro_Concluido';
  onboardingPendingDocs: string[];
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string; // e.g. "Bronze", "Silver", "Gold", "Platinum"
  type: 'Empresa' | 'Técnico' | 'Parceiro';
  icon: string;
  color: string;
  displayOrder: number;
  recommended: boolean;
  status: 'Ativo' | 'Inativo';
  createdAt: string;
  updatedAt: string;
  
  // Pricing (Values and billing frequencies)
  pricing: {
    monthly: number;
    monthlyPromo?: number;
    quarterly: number;
    quarterlyPromo?: number;
    semesterly: number;
    semesterlyPromo?: number;
    yearly: number;
    yearlyPromo?: number;
    setupFee: number;
    trialDays: number;
    minLoyaltyMonths: number;
    autoRenew: boolean;
  };

  // Billing & Penalty Configuration
  billingConfig: {
    paymentMethods: ('PIX' | 'Cartão' | 'Boleto' | 'Débito')[];
    dueDay: number;
    lateFeePercentage: number; // Multa %
    lateInterestPercentage: number; // Juros % ao mês
    autoSuspendDays: number; // Dias atraso para suspensão
    autoBlockDays: number; // Dias atraso para bloqueio total
  };

  // Platform Fee / Commission
  commission: {
    type: 'percentual' | 'fixa' | 'híbrida';
    percentage: number; // e.g. 15 for 15%
    flatAmount: number; // e.g. R$ 5,00
  };

  // Features available (Boolean triggers)
  features: {
    ticketsManual: boolean;
    chatGroups: boolean;
    aiDispatcher: boolean;
    aiTechnical: boolean;
    aiCrmGrowth: boolean;
    aiBiAnalytics: boolean;
    executiveDashboard: boolean;
    customReports: boolean;
    gamification: boolean;
    referrals: boolean;
    marketplaceAccess: boolean;
    restApi: boolean;
    webhooks: boolean;
    offlineMode: boolean;
    digitalSignature: boolean;
    pushNotifications: boolean;
    whatsappNotifications: boolean;
    erpIntegration: boolean;
    crmIntegration: boolean;
    clientPortal: boolean;
    techPortal: boolean;
    companyPortal: boolean;
    auditingLogs: boolean;
    excelExport: boolean;
    pdfExport: boolean;
  };

  // Feature limits (Quantitative limits)
  limits: {
    maxCompanies: number;
    maxUsers: number;
    maxAdmins: number;
    maxFiliais: number;
    maxTicketsPerMonth: number;
    maxTechnicians: number;
    maxUploadSizeMb: number;
    maxStorageGb: number;
    aiTokensPerMonth: number;
    apiRequestsPerDay: number;
    webhookEndpoints: number;
  };

  // IA specific
  aiLevel: 'Básica' | 'Avançada' | 'Premium';
  aiFeatures: {
    aiReports: boolean;
    aiClassification: boolean;
    aiMatching: boolean;
    aiSummary: boolean;
    aiCopilotTech: boolean;
    aiCopilotComercial: boolean;
  };

  // Financial Features
  financialFeatures: {
    splitPayment: boolean;
    anticipationAllowed: boolean;
    autoPix: boolean;
    digitalWallet: boolean;
    invoiceEmitting: boolean;
    refunds: boolean;
  };

  // Gamification Features
  gamificationConfig: {
    rankingEnabled: boolean;
    xpMultiplier: number;
    exclusiveMissions: boolean;
    specialBadges: boolean;
    cashbackPercentage: number;
  };

  // Referral Rewards
  referralConfig: {
    rewardCompanyAmount: number;
    rewardTechAmount: number;
    monthlyLimitAmount: number;
  };
}

export interface Subscription {
  id: string;
  targetId: string; // Company ID or Tech ID or Partner ID
  targetName: string;
  targetType: 'Empresa' | 'Técnico' | 'Parceiro';
  planId: string;
  planName: string;
  planColor: string;
  billingPeriod: 'monthly' | 'quarterly' | 'semesterly' | 'yearly';
  amount: number;
  status: 'Ativa' | 'Pendente' | 'Suspensa' | 'Cancelada' | 'Atrasada';
  paymentMethod: 'PIX' | 'Cartão' | 'Boleto' | 'Débito';
  startedAt: string;
  trialEndsAt?: string;
  nextBillingAt: string;
  cancelledAt?: string;
  autoRenew: boolean;
  history: {
    timestamp: string;
    event: string; // e.g. "Upgrade de Start para Business", "Pagamento aprovado", "Cobrança gerada"
    amount?: number;
    actor: string; // Super Admin or System
  }[];
}

export interface PlanCoupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g. 15 for 15% or 50 for R$50 off
  quantityLimit: number;
  usedQuantity: number;
  validUntil: string;
  applicablePlans: string[]; // Plan IDs
  applicableStates?: string[];
  applicableTypes?: ('Empresa' | 'Técnico' | 'Parceiro')[];
  onlyFirstSubscription: boolean;
  status: 'Ativo' | 'Expirado' | 'Esgotado';
}

export interface PlanAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorIp: string;
  planId?: string;
  planName?: string;
  actionType: 'Create' | 'Edit' | 'Delete' | 'Duplicate' | 'Upgrade' | 'Downgrade' | 'StatusChange';
  details: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}


