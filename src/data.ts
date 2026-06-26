import { Company, Technician, Ticket, ChatMessage, FinancialTransaction, AiAuditLog, Referral, LeadCompany, LeadTech, Plan, Subscription, PlanCoupon, PlanAuditLog } from "./types";

export const CATEGORIES = [
  "CFTV",
  "Redes",
  "Telecom",
  "Elétrica",
  "Solar",
  "Fibra",
  "TI",
  "Automação",
  "Alarmes",
  "Ar Condicionado",
  "Facilities",
  "Outros"
];

export const SPECIALTIES = [
  "Intelbras",
  "Cisco",
  "Furukawa",
  "Huawei",
  "Hikvision",
  "SolarEdge",
  "WEG",
  "Daikin",
  "Carrier",
  "Schneider Electric",
  "Cablagem Estruturada",
  "Instalação Solar"
];

export const EQUIPMENTS = [
  "Carro",
  "Moto",
  "Notebook",
  "Escada de Fibra",
  "OTDR",
  "Máquina de Fusão",
  "Multímetro",
  "EPIs",
  "Furadeira de Impacto",
  "Ferramentas Manuais",
  "Certificador de Rede",
  "Osciloscópio"
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: "comp-1",
    name: "Telefônica Brasil S.A.",
    email: "infra@telefonica.com.br",
    phone: "(11) 98765-4321",
    cnpj: "02.558.157/0001-62",
    city: "São Paulo",
    state: "SP",
    avatar: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop&crop=faces",
    segment: "Telecom",
    referralCode: "TELEF-9090",
    referralCredits: 200
  },
  {
    id: "comp-2",
    name: "SolarSol Soluções S.A.",
    email: "operacoes@solarsol.com.br",
    phone: "(19) 97654-3210",
    cnpj: "12.345.678/0001-99",
    city: "Campinas",
    state: "SP",
    avatar: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=150&fit=crop&crop=faces",
    segment: "Energia Solar",
    referralCode: "SOLAR-777",
    referralCredits: 100
  },
  {
    id: "comp-3",
    name: "Fortress Segurança Eletrônica",
    email: "chamados@fortress.com",
    phone: "(21) 96543-2109",
    cnpj: "98.765.432/0001-00",
    city: "Rio de Janeiro",
    state: "RJ",
    avatar: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=faces",
    segment: "Segurança Eletrônica",
    referralCode: "FORT-1010",
    referralCredits: 0
  }
];

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: "tech-1",
    name: "Alexandre Silva Santos",
    cpf: "123.456.789-01",
    rg: "12.345.678-9",
    birthDate: "1988-04-12",
    email: "alexandre.tech@gmail.com",
    phone: "(19) 98123-4567",
    whatsapp: "(19) 98123-4567",
    city: "Campinas",
    state: "SP",
    cep: "13010-000",
    address: "Avenida Francisco Glicério, 1200 - Centro",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=faces",
    nr10: true,
    nr35: true,
    nr33: false,
    specialties: ["CFTV", "Alarmes", "Redes", "Intelbras", "Hikvision"],
    equipment: ["Carro", "Escada de Fibra", "Notebook", "Multímetro", "EPIs", "Furadeira de Impacto"],
    availabilityDays: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    availabilityHours: "08:00 - 18:00",
    radiusKm: 35,
    latitude: -22.9068, // Campinas centro
    longitude: -47.0616,
    pixKey: "19981234567",
    pixType: "Celular",
    bankName: "Itaú Unibanco",
    agency: "0192",
    accountNumber: "23456-7",
    rating: 4.9,
    reviewsCount: 28,
    completedJobsCount: 42,
    status: "online",
    documentsApproved: true,
    signedContract: true,
    points: 5400,
    badges: ["Top Performer", "Customer Favorite", "Agilidade Nexora"],
    referralCode: "ALEX-FIELD-99",
    referralCredits: 50,
    responseTimeMin: 12
  },
  {
    id: "tech-2",
    name: "Mariana Costa Oliveira",
    cpf: "234.567.890-12",
    rg: "23.456.789-0",
    birthDate: "1993-08-22",
    email: "mariana.fibra@outlook.com",
    phone: "(19) 98234-5678",
    whatsapp: "(19) 98234-5678",
    city: "Campinas",
    state: "SP",
    cep: "13083-970",
    address: "Rua Albert Einstein, 400 - Barão Geraldo",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    nr10: true,
    nr35: false,
    nr33: true,
    specialties: ["Fibra", "Redes", "Cablagem Estruturada", "Cisco", "Huawei"],
    equipment: ["Moto", "Notebook", "Máquina de Fusão", "OTDR", "EPIs", "Certificador de Rede"],
    availabilityDays: ["Seg", "Ter", "Qua", "Qui", "Sex"],
    availabilityHours: "07:30 - 17:30",
    radiusKm: 40,
    latitude: -22.8173, // Barão Geraldo, Campinas
    longitude: -47.0689,
    pixKey: "23456789012",
    pixType: "CPF",
    bankName: "Banco do Brasil",
    agency: "3123",
    accountNumber: "12543-0",
    rating: 4.8,
    reviewsCount: 15,
    completedJobsCount: 19,
    status: "online",
    documentsApproved: true,
    signedContract: true,
    points: 2450,
    badges: ["Customer Favorite", "Pioneiro"],
    referralCode: "MARI-FIBRA-12",
    referralCredits: 0,
    responseTimeMin: 15
  },
  {
    id: "tech-3",
    name: "Carlos Eduardo Souza",
    cpf: "345.678.901-23",
    rg: "34.567.890-1",
    birthDate: "1985-11-30",
    email: "cadu.solar@gmail.com",
    phone: "(11) 98345-6789",
    whatsapp: "(11) 98345-6789",
    city: "São Paulo",
    state: "SP",
    cep: "01310-100",
    address: "Avenida Paulista, 1000 - Bela Vista",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
    nr10: true,
    nr35: true,
    nr33: false,
    specialties: ["Solar", "Elétrica", "Instalação Solar", "WEG", "SolarEdge"],
    equipment: ["Carro", "Escada de Fibra", "Multímetro", "EPIs", "Furadeira de Impacto", "Osciloscópio"],
    availabilityDays: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    availabilityHours: "08:00 - 19:00",
    radiusKm: 50,
    latitude: -23.5616, // Av Paulista
    longitude: -46.6561,
    pixKey: "cadu.solar@gmail.com",
    pixType: "E-mail",
    bankName: "Nubank",
    agency: "0001",
    accountNumber: "9876543-2",
    rating: 4.95,
    reviewsCount: 34,
    completedJobsCount: 51,
    status: "busy",
    documentsApproved: true,
    signedContract: true,
    points: 6300,
    badges: ["Top Performer", "Sócio Indicator"],
    referralCode: "CADU-SOLAR-03",
    referralCredits: 150,
    responseTimeMin: 10
  },
  {
    id: "tech-4",
    name: "Bruno Gagliardi Filho",
    cpf: "456.789.012-34",
    rg: "45.678.901-2",
    birthDate: "1990-01-15",
    email: "bruno.clima@hotmail.com",
    phone: "(21) 98456-7890",
    whatsapp: "(21) 98456-7890",
    city: "Rio de Janeiro",
    state: "RJ",
    cep: "22021-001",
    address: "Avenida Atlântica, 1700 - Copacabana",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    nr10: true,
    nr35: true,
    nr33: false,
    specialties: ["Ar Condicionado", "Facilities", "Carrier", "Daikin"],
    equipment: ["Carro", "Escada de Fibra", "Multímetro", "EPIs", "Furadeira de Impacto"],
    availabilityDays: ["Seg", "Ter", "Qua", "Qui", "Sex"],
    availabilityHours: "08:00 - 17:00",
    radiusKm: 30,
    latitude: -22.9698, // Copacabana
    longitude: -43.1802,
    pixKey: "456.789.012-34",
    pixType: "CPF",
    bankName: "Banco Inter",
    agency: "0001",
    accountNumber: "1122334-5",
    rating: 4.7,
    reviewsCount: 11,
    completedJobsCount: 15,
    status: "online",
    documentsApproved: true,
    signedContract: true,
    points: 1800,
    badges: ["Agilidade Nexora"],
    referralCode: "BRUNO-CLIMA-44",
    referralCredits: 0,
    responseTimeMin: 18
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: "tick-1",
    title: "Substituição de DVR Intelbras Danificado",
    description: "Necessária a troca emergencial de um DVR Intelbras MHDX 1108 que queimou devido a pico de energia. O novo DVR já está no local, precisa configurar acesso via rede externa, nuvem Intelbras e ajustar as 8 câmeras existentes.",
    category: "CFTV",
    specialty: "Intelbras",
    urgency: "Crítica",
    date: "2026-06-26",
    time: "09:00",
    cep: "13012-100",
    city: "Campinas",
    state: "SP",
    address: "Rua Regente Feijó, 850 - Centro",
    latitude: -22.9034,
    longitude: -47.0582,
    suggestedValue: 320,
    deadline: "2026-06-26T18:00:00",
    photos: ["https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=300&fit=crop"],
    documents: [],
    status: "Convites_Enviados",
    companyId: "comp-2",
    invitedTechIds: ["tech-1", "tech-2"],
    declinedTechIds: [],
    createdAt: "2026-06-25T14:30:00",
    checklist: [
      { item: "Remover DVR queimado do rack", completed: false },
      { item: "Fixar novo DVR Intelbras MHDX", completed: false },
      { item: "Conectar cabos coaxiais e de alimentação", completed: false },
      { item: "Ajustar resolução e gravar por movimento", completed: false },
      { item: "Configurar acesso remoto no app ISIC Lite", completed: false },
      { item: "Fazer check de imagem das 8 câmeras", completed: false }
    ]
  },
  {
    id: "tick-2",
    title: "Fusão de Fibra Óptica GPON Rompida",
    description: "Identificamos rompimento de cabo óptico de 12 FO em poste interno da indústria. Necessário realizar a fusão da caixa de emenda óptica aérea. Altura de aproximadamente 4 metros.",
    category: "Fibra",
    specialty: "Cablagem Estruturada",
    urgency: "Alta",
    date: "2026-06-25",
    time: "10:00",
    cep: "13083-850",
    city: "Campinas",
    state: "SP",
    address: "Avenida Jean Mermoz, 300 - Barão Geraldo",
    latitude: -22.8211,
    longitude: -47.0655,
    suggestedValue: 550,
    deadline: "2026-06-25T19:00:00",
    photos: ["https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=300&fit=crop"],
    documents: [],
    status: "Em_Andamento",
    companyId: "comp-1",
    assignedTechId: "tech-2",
    createdAt: "2026-06-25T08:00:00",
    checklist: [
      { item: "Isolar a área com cones e fita", completed: true },
      { item: "Ancorar escada de fibra com segurança (NR35)", completed: true },
      { item: "Decapar cabo óptico e limpar tubos loose", completed: true },
      { item: "Efetuar fusão de 12 fibras com máquina", completed: false },
      { item: "Testar atenuação com OTDR", completed: false },
      { item: "Fechar e fixar a caixa de emenda aérea", completed: false }
    ],
    evidencePhotos: ["https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=300&fit=crop"]
  },
  {
    id: "tick-3",
    title: "Manutenção Preventiva Inversor Solar Weg",
    description: "Revisão periódica do sistema de geração fotovoltaica de 15kWp. Verificar conexões das stringboxes, reapertar conectores MC4 e fazer leitura de isolamento do inversor Weg de três fases.",
    category: "Solar",
    specialty: "WEG",
    urgency: "Baixa",
    date: "2026-06-23",
    time: "14:00",
    cep: "01311-200",
    city: "São Paulo",
    state: "SP",
    address: "Avenida Paulista, 1500 - Bela Vista",
    latitude: -23.5629,
    longitude: -46.6544,
    suggestedValue: 400,
    deadline: "2026-06-24T18:00:00",
    photos: ["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop"],
    documents: [],
    status: "Finalizado",
    companyId: "comp-2",
    assignedTechId: "tech-3",
    createdAt: "2026-06-22T09:00:00",
    checklist: [
      { item: "Desligar disjuntores CA e CC", completed: true },
      { item: "Limpar cooler de ventilação do inversor", completed: true },
      { item: "Reapertar bornes de entrada CC", completed: true },
      { item: "Medir resistência de aterramento", completed: true },
      { item: "Testar parâmetros de corrente e tensão", completed: true }
    ],
    evidencePhotos: ["https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=300&fit=crop"],
    technicalReport: "### LAUDO TÉCNICO DE MANUTENÇÃO PREVENTIVA\n\n**Data de Execução:** 2026-06-23\n**Equipamento:** Inversor Solar WEG Trifásico 15kW\n**Prestador:** Carlos Eduardo Souza (CREA ativo)\n\n**Laudo:** Realizada a manutenção preventiva programada sem ocorrências. As stringboxes foram limpas e os bornes reapertados com torque nominal de 2.5Nm. A medição de aterramento apresentou valor excelente de 3.2 Ohms. Geração restabelecida e testada com eficiência nominal de 98.2%. Sistema operando em perfeita conformidade técnica.",
    clientSignature: "Carlos E. (Assinado via token NexoraField)",
    ratingByCompany: {
      stars: 5,
      comment: "Excelente profissional. Executou a verificação detalhada com muito capricho."
    }
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    ticketId: "tick-2",
    senderType: "system",
    senderName: "Nexora IA",
    senderId: "system",
    text: "O chamado foi aceito por Mariana Costa Oliveira e aprovado por Telefônica Brasil S.A. O chat está liberado para alinhamento técnico.",
    timestamp: "2026-06-25T08:05:00"
  },
  {
    id: "msg-2",
    ticketId: "tick-2",
    senderType: "company",
    senderName: "Infra Telefônica",
    senderId: "comp-1",
    text: "Olá Mariana, bom dia! O local do poste é bem na entrada principal da fábrica. Você já possui a máquina de fusão calibrada?",
    timestamp: "2026-06-25T08:10:00"
  },
  {
    id: "msg-3",
    ticketId: "tick-2",
    senderType: "tech",
    senderName: "Mariana Costa",
    senderId: "tech-2",
    text: "Bom dia! Sim, máquina de fusão Fujikura calibrada e com eletrodos novos. Estou levando o OTDR também para emitirmos o relatório de atenuação. Chego em 20 minutos.",
    timestamp: "2026-06-25T08:12:00"
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: "trans-1",
    ticketId: "tick-3",
    ticketTitle: "Manutenção Preventiva Inversor Solar Weg",
    companyName: "SolarSol Soluções S.A.",
    techName: "Carlos Eduardo Souza",
    totalAmount: 400.0,
    platformCommission: 15.0, // 15%
    platformEarnings: 60.0,
    techPayout: 340.0,
    paymentMethod: "PIX",
    status: "Pago",
    createdAt: "2026-06-23T16:30:00"
  }
];

export const INITIAL_AI_AUDIT_LOGS: AiAuditLog[] = [
  {
    id: "log-1",
    ticketId: "tick-1",
    type: "classification",
    message: "Chamado 'Substituição de DVR Intelbras...' classificado como CFTV/Intelbras. Urgência: Crítica. Valor sugerido sugerido pela IA: R$ 320,00.",
    timestamp: "2026-06-25T14:30:05"
  },
  {
    id: "log-2",
    ticketId: "tick-1",
    type: "matching",
    message: "Matching Inteligente executado: Foram identificados 2 técnicos qualificados num raio de 35km em Campinas. Convites automáticos enviados.",
    timestamp: "2026-06-25T14:30:10"
  }
];

export const INITIAL_REFERRALS: Referral[] = [
  {
    id: "ref-1",
    referrerType: "tech",
    referrerId: "tech-1",
    referredType: "tech",
    referredName: "Giselle Lima de Albuquerque",
    referredEmailOrPhone: "(71) 99876-5432",
    status: "pending",
    rewardPaid: false,
    rewardDetails: "Bônus de R$ 50,00 para ambos após o primeiro chamado concluído.",
    createdAt: "2026-06-24T10:00:00"
  },
  {
    id: "ref-2",
    referrerType: "company",
    referrerId: "comp-1",
    referredType: "company",
    referredName: "Infrasul Redes Ópticas",
    referredEmailOrPhone: "contato@infrasul.com.br",
    status: "completed",
    rewardPaid: true,
    rewardDetails: "Crédito de R$ 100,00 concedido para o primeiro chamado.",
    createdAt: "2026-06-20T09:30:00",
    completedAt: "2026-06-23T16:30:00"
  }
];

export const INITIAL_LEAD_COMPANIES: LeadCompany[] = [
  {
    id: "lead-c-1",
    name: "Infrasul Redes Ópticas",
    cnpj: "33.444.555/0001-66",
    segment: "Telecom",
    city: "Curitiba",
    state: "PR",
    size: "Grande",
    ratingStars: 5,
    contactChannel: "WhatsApp",
    contactStatus: "Cliente",
    phone: "(41) 98888-7777",
    email: "suprimentos@infrasul.com.br",
    responsibleName: "Marcos Ribeiro",
    responsibleRole: "Gerente de Operações",
    estimatedValue: 12000,
    historyLogs: [
      { timestamp: "2026-06-20T10:00:00", message: "IA localizou empresa via dados públicos de telecom em Curitiba.", type: "system" },
      { timestamp: "2026-06-21T14:30:00", message: "IA enviou convite inicial via WhatsApp Corporativo.", type: "ai" },
      { timestamp: "2026-06-21T14:35:00", message: "Cliente respondeu: 'Temos interesse, nossa demanda é de 30 chamados/mês.'", type: "user" },
      { timestamp: "2026-06-22T11:00:00", message: "Demonstração automatizada apresentada pela IA e homologada.", type: "ai" },
      { timestamp: "2026-06-23T09:00:00", message: "Cadastro finalizado. Cliente concluiu primeiro chamado teste.", type: "system" }
    ],
    createdAt: "2026-06-20T10:00:00"
  },
  {
    id: "lead-c-2",
    name: "Brasil Sol Soluções Fotovoltaicas",
    cnpj: "44.555.666/0001-77",
    segment: "Solar",
    city: "Belo Horizonte",
    state: "MG",
    size: "Média",
    ratingStars: 4,
    contactChannel: "E-mail",
    contactStatus: "Negociacao",
    phone: "(31) 97777-6666",
    email: "manutencao@brasilsol.com.br",
    responsibleName: "Elisa Guimarães",
    responsibleRole: "Coordenadora de O&M",
    estimatedValue: 4500,
    historyLogs: [
      { timestamp: "2026-06-21T09:00:00", message: "IA prospectou empresa via portal de integradores solares.", type: "system" },
      { timestamp: "2026-06-22T10:15:00", message: "IA enviou e-mail de prospecção sobre redução de O&M em 20%.", type: "ai" },
      { timestamp: "2026-06-22T16:00:00", message: "Elisa respondeu querendo entender a tabela de repasse de comissão.", type: "user" },
      { timestamp: "2026-06-23T10:00:00", message: "IA respondeu detalhando o split financeiro (15% Nexora / 85% Técnico).", type: "ai" }
    ],
    createdAt: "2026-06-21T09:00:00"
  },
  {
    id: "lead-c-3",
    name: "Cerrado Telecom",
    segment: "Telecom",
    city: "Goiânia",
    state: "GO",
    size: "Média",
    ratingStars: 4,
    contactChannel: "WhatsApp",
    contactStatus: "Demonstracao_Agendada",
    phone: "(62) 96666-5555",
    email: "operacoes@cerradotel.com.br",
    responsibleName: "Augusto Cesar",
    responsibleRole: "Diretor Técnico",
    demoDate: "2026-06-29T14:00:00",
    estimatedValue: 6000,
    historyLogs: [
      { timestamp: "2026-06-23T11:00:00", message: "IA identificou desequilíbrio na região de Goiás (alta demanda, poucos chamados). Prospecção ativa.", type: "system" },
      { timestamp: "2026-06-24T14:00:00", message: "Mensagem enviada com proposta de agendamento automático.", type: "ai" },
      { timestamp: "2026-06-24T15:22:00", message: "Augusto selecionou o horário do dia 29 de Junho às 14:00.", type: "user" },
      { timestamp: "2026-06-24T15:23:00", message: "IA agendou demonstração no calendário e gerou link do Google Meet.", type: "ai" }
    ],
    createdAt: "2026-06-23T11:00:00"
  },
  {
    id: "lead-c-4",
    name: "Amazon Secur Tecnologia",
    segment: "CFTV",
    city: "Manaus",
    state: "AM",
    size: "Pequena",
    ratingStars: 3,
    contactChannel: "Formulário de Site",
    contactStatus: "Interessado",
    phone: "(92) 95555-4444",
    email: "suporte@amazonsecur.com.br",
    responsibleName: "Thiago Rocha",
    responsibleRole: "Proprietário",
    estimatedValue: 2000,
    historyLogs: [
      { timestamp: "2026-06-24T08:30:00", message: "Lead recebido através de formulário de contato orgânico do site.", type: "system" },
      { timestamp: "2026-06-24T09:00:00", message: "IA qualificou o lead: Pequeno integrador de CFTV em Manaus.", type: "system" },
      { timestamp: "2026-06-24T11:45:00", message: "IA enviou mensagem explicativa sobre a rede nacional de instaladores credenciados.", type: "ai" }
    ],
    createdAt: "2026-06-24T08:30:00"
  },
  {
    id: "lead-c-5",
    name: "Nordeste Clima Ar Condicionado",
    segment: "Ar Condicionado",
    city: "Recife",
    state: "PE",
    size: "Pequena",
    ratingStars: 2,
    contactChannel: "E-mail",
    contactStatus: "Sem_Interesse",
    phone: "(81) 94444-3333",
    email: "recusado@nordesteclima.com",
    estimatedValue: 0,
    historyLogs: [
      { timestamp: "2026-06-22T13:00:00", message: "Prospecção fria realizada em Pernambuco pela IA.", type: "system" },
      { timestamp: "2026-06-23T10:00:00", message: "E-mail enviado sobre serviços preventivos PMOC.", type: "ai" },
      { timestamp: "2026-06-24T12:00:00", message: "Cliente respondeu solicitando opt-out: 'Não temos interesse. Favor descadastrar de novos contatos.'", type: "user" },
      { timestamp: "2026-06-24T12:01:00", message: "IA ativou regra de OPT-OUT. Contato bloqueado na base (LGPD Compliance).", type: "system" }
    ],
    createdAt: "2026-06-22T13:00:00"
  }
];

export const INITIAL_LEAD_TECHS: LeadTech[] = [
  {
    id: "lead-t-1",
    name: "Rafael Oliveira de Souza",
    city: "Porto Alegre",
    state: "RS",
    specialty: "Fibra",
    experienceYears: 7,
    phone: "(51) 98765-1111",
    email: "rafael.fibra.poa@gmail.com",
    classification: "Sênior",
    status: "Cadastro_Concluido",
    onboardingPendingDocs: [],
    createdAt: "2026-06-21T08:00:00"
  },
  {
    id: "lead-t-2",
    name: "Giselle Lima de Albuquerque",
    city: "Salvador",
    state: "BA",
    specialty: "CFTV",
    experienceYears: 4,
    phone: "(71) 99876-5432",
    email: "giselle.cftv@outlook.com",
    classification: "Pleno",
    status: "Cadastro_Iniciado",
    onboardingPendingDocs: ["Certificado NR35", "Comprovante de Residência"],
    createdAt: "2026-06-23T10:00:00"
  },
  {
    id: "lead-t-3",
    name: "Marcos Tulio de Assis",
    city: "Belo Horizonte",
    state: "MG",
    specialty: "Elétrica",
    experienceYears: 10,
    phone: "(31) 96543-2222",
    email: "marcos.eletrica.bh@yahoo.com.br",
    classification: "Especialista",
    status: "Contatado",
    onboardingPendingDocs: ["Assinatura de Contrato", "Diploma Técnico/CREA"],
    createdAt: "2026-06-24T11:00:00"
  },
  {
    id: "lead-t-4",
    name: "Eduardo Paes Neto",
    city: "Brasília",
    state: "DF",
    specialty: "Ar Condicionado",
    experienceYears: 2,
    phone: "(61) 95432-3333",
    email: "edu.refrigeracao@gmail.com",
    classification: "Júnior",
    status: "Encontrado",
    onboardingPendingDocs: ["Todos"],
    createdAt: "2026-06-25T15:00:00"
  }
];

export const INITIAL_PLANS: Plan[] = [
  {
    id: "plan-start",
    name: "Nexora Start",
    code: "NEX-START-C",
    description: "Ideal para pequenas empresas que estão começando a organizar sua equipe técnica externa de campo.",
    category: "Bronze",
    type: "Empresa",
    icon: "Building2",
    color: "#a78bfa", // Purple 400
    displayOrder: 1,
    recommended: false,
    status: "Ativo",
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-06-20T14:30:00Z",
    pricing: {
      monthly: 299,
      monthlyPromo: 249,
      quarterly: 799,
      quarterlyPromo: 699,
      semesterly: 1499,
      semesterlyPromo: 1299,
      yearly: 2999,
      yearlyPromo: 2499,
      setupFee: 499,
      trialDays: 14,
      minLoyaltyMonths: 3,
      autoRenew: true
    },
    billingConfig: {
      paymentMethods: ["PIX", "Cartão", "Boleto"],
      dueDay: 10,
      lateFeePercentage: 2,
      lateInterestPercentage: 1,
      autoSuspendDays: 5,
      autoBlockDays: 15
    },
    commission: {
      type: "percentual",
      percentage: 15,
      flatAmount: 0
    },
    features: {
      ticketsManual: true,
      chatGroups: true,
      aiDispatcher: false,
      aiTechnical: false,
      aiCrmGrowth: false,
      aiBiAnalytics: false,
      executiveDashboard: true,
      customReports: false,
      gamification: false,
      referrals: true,
      marketplaceAccess: true,
      restApi: false,
      webhooks: false,
      offlineMode: true,
      digitalSignature: true,
      pushNotifications: true,
      whatsappNotifications: false,
      erpIntegration: false,
      crmIntegration: false,
      clientPortal: true,
      techPortal: true,
      companyPortal: true,
      auditingLogs: true,
      excelExport: true,
      pdfExport: true
    },
    limits: {
      maxCompanies: 1,
      maxUsers: 3,
      maxAdmins: 1,
      maxFiliais: 1,
      maxTicketsPerMonth: 30,
      maxTechnicians: 10,
      maxUploadSizeMb: 10,
      maxStorageGb: 5,
      aiTokensPerMonth: 0,
      apiRequestsPerDay: 0,
      webhookEndpoints: 0
    },
    aiLevel: "Básica",
    aiFeatures: {
      aiReports: false,
      aiClassification: false,
      aiMatching: false,
      aiSummary: false,
      aiCopilotTech: false,
      aiCopilotComercial: false
    },
    financialFeatures: {
      splitPayment: true,
      anticipationAllowed: false,
      autoPix: true,
      digitalWallet: true,
      invoiceEmitting: false,
      refunds: true
    },
    gamificationConfig: {
      rankingEnabled: false,
      xpMultiplier: 1.0,
      exclusiveMissions: false,
      specialBadges: false,
      cashbackPercentage: 0
    },
    referralConfig: {
      rewardCompanyAmount: 50,
      rewardTechAmount: 25,
      monthlyLimitAmount: 500
    }
  },
  {
    id: "plan-business",
    name: "Nexora Business",
    code: "NEX-BIZ-C",
    description: "Nossa opção mais vendida. Inteligência artificial completa com dispatcher dinâmico e suporte corporativo.",
    category: "Gold",
    type: "Empresa",
    icon: "Sparkles",
    color: "#06b6d4", // Cyan 500
    displayOrder: 2,
    recommended: true,
    status: "Ativo",
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-06-25T11:20:00Z",
    pricing: {
      monthly: 799,
      monthlyPromo: 699,
      quarterly: 2199,
      quarterlyPromo: 1999,
      semesterly: 4199,
      semesterlyPromo: 3799,
      yearly: 7999,
      yearlyPromo: 6999,
      setupFee: 999,
      trialDays: 14,
      minLoyaltyMonths: 0,
      autoRenew: true
    },
    billingConfig: {
      paymentMethods: ["PIX", "Cartão", "Boleto", "Débito"],
      dueDay: 10,
      lateFeePercentage: 2,
      lateInterestPercentage: 1,
      autoSuspendDays: 5,
      autoBlockDays: 15
    },
    commission: {
      type: "percentual",
      percentage: 12,
      flatAmount: 0
    },
    features: {
      ticketsManual: true,
      chatGroups: true,
      aiDispatcher: true,
      aiTechnical: true,
      aiCrmGrowth: true,
      aiBiAnalytics: true,
      executiveDashboard: true,
      customReports: true,
      gamification: true,
      referrals: true,
      marketplaceAccess: true,
      restApi: true,
      webhooks: true,
      offlineMode: true,
      digitalSignature: true,
      pushNotifications: true,
      whatsappNotifications: true,
      erpIntegration: true,
      crmIntegration: false,
      clientPortal: true,
      techPortal: true,
      companyPortal: true,
      auditingLogs: true,
      excelExport: true,
      pdfExport: true
    },
    limits: {
      maxCompanies: 5,
      maxUsers: 15,
      maxAdmins: 3,
      maxFiliais: 5,
      maxTicketsPerMonth: 150,
      maxTechnicians: 50,
      maxUploadSizeMb: 50,
      maxStorageGb: 30,
      aiTokensPerMonth: 2000000,
      apiRequestsPerDay: 5000,
      webhookEndpoints: 3
    },
    aiLevel: "Avançada",
    aiFeatures: {
      aiReports: true,
      aiClassification: true,
      aiMatching: true,
      aiSummary: true,
      aiCopilotTech: true,
      aiCopilotComercial: false
    },
    financialFeatures: {
      splitPayment: true,
      anticipationAllowed: true,
      autoPix: true,
      digitalWallet: true,
      invoiceEmitting: true,
      refunds: true
    },
    gamificationConfig: {
      rankingEnabled: true,
      xpMultiplier: 1.5,
      exclusiveMissions: true,
      specialBadges: true,
      cashbackPercentage: 1.5
    },
    referralConfig: {
      rewardCompanyAmount: 100,
      rewardTechAmount: 50,
      monthlyLimitAmount: 1000
    }
  },
  {
    id: "plan-enterprise",
    name: "Nexora Enterprise",
    code: "NEX-ENT-C",
    description: "Para grandes redes nacionais que exigem integrações completas, APIs personalizadas e SLA garantido.",
    category: "Platinum",
    type: "Empresa",
    icon: "ShieldCheck",
    color: "#6366f1", // Indigo 500
    displayOrder: 3,
    recommended: false,
    status: "Ativo",
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-06-25T11:20:00Z",
    pricing: {
      monthly: 1999,
      monthlyPromo: 1899,
      quarterly: 5499,
      quarterlyPromo: 5199,
      semesterly: 10499,
      semesterlyPromo: 9999,
      yearly: 19999,
      yearlyPromo: 17999,
      setupFee: 2499,
      trialDays: 0,
      minLoyaltyMonths: 12,
      autoRenew: true
    },
    billingConfig: {
      paymentMethods: ["PIX", "Cartão", "Boleto", "Débito"],
      dueDay: 10,
      lateFeePercentage: 5,
      lateInterestPercentage: 2,
      autoSuspendDays: 10,
      autoBlockDays: 30
    },
    commission: {
      type: "percentual",
      percentage: 10,
      flatAmount: 0
    },
    features: {
      ticketsManual: true,
      chatGroups: true,
      aiDispatcher: true,
      aiTechnical: true,
      aiCrmGrowth: true,
      aiBiAnalytics: true,
      executiveDashboard: true,
      customReports: true,
      gamification: true,
      referrals: true,
      marketplaceAccess: true,
      restApi: true,
      webhooks: true,
      offlineMode: true,
      digitalSignature: true,
      pushNotifications: true,
      whatsappNotifications: true,
      erpIntegration: true,
      crmIntegration: true,
      clientPortal: true,
      techPortal: true,
      companyPortal: true,
      auditingLogs: true,
      excelExport: true,
      pdfExport: true
    },
    limits: {
      maxCompanies: 99,
      maxUsers: 99,
      maxAdmins: 10,
      maxFiliais: 99,
      maxTicketsPerMonth: 9999,
      maxTechnicians: 999,
      maxUploadSizeMb: 200,
      maxStorageGb: 500,
      aiTokensPerMonth: 10000000,
      apiRequestsPerDay: 50000,
      webhookEndpoints: 10
    },
    aiLevel: "Premium",
    aiFeatures: {
      aiReports: true,
      aiClassification: true,
      aiMatching: true,
      aiSummary: true,
      aiCopilotTech: true,
      aiCopilotComercial: true
    },
    financialFeatures: {
      splitPayment: true,
      anticipationAllowed: true,
      autoPix: true,
      digitalWallet: true,
      invoiceEmitting: true,
      refunds: true
    },
    gamificationConfig: {
      rankingEnabled: true,
      xpMultiplier: 2.0,
      exclusiveMissions: true,
      specialBadges: true,
      cashbackPercentage: 3.0
    },
    referralConfig: {
      rewardCompanyAmount: 200,
      rewardTechAmount: 100,
      monthlyLimitAmount: 5000
    }
  },
  {
    id: "plan-tech-premium",
    name: "Técnico Pró",
    code: "NEX-TECH-PRO",
    description: "Acesso total ao marketplace, menor taxa sobre chamados, prioridade na fila de dispatching e bônus em dobro.",
    category: "Gold",
    type: "Técnico",
    icon: "HardHat",
    color: "#10b981", // Emerald 500
    displayOrder: 4,
    recommended: true,
    status: "Ativo",
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-06-25T11:20:00Z",
    pricing: {
      monthly: 49,
      monthlyPromo: 39,
      quarterly: 129,
      quarterlyPromo: 99,
      semesterly: 249,
      semesterlyPromo: 199,
      yearly: 499,
      yearlyPromo: 399,
      setupFee: 0,
      trialDays: 30,
      minLoyaltyMonths: 0,
      autoRenew: true
    },
    billingConfig: {
      paymentMethods: ["PIX", "Cartão"],
      dueDay: 5,
      lateFeePercentage: 2,
      lateInterestPercentage: 1,
      autoSuspendDays: 3,
      autoBlockDays: 10
    },
    commission: {
      type: "percentual",
      percentage: 10, // Menor taxa de intermediação para técnicos pagantes!
      flatAmount: 0
    },
    features: {
      ticketsManual: false,
      chatGroups: true,
      aiDispatcher: true,
      aiTechnical: true,
      aiCrmGrowth: false,
      aiBiAnalytics: false,
      executiveDashboard: false,
      customReports: true,
      gamification: true,
      referrals: true,
      marketplaceAccess: true,
      restApi: false,
      webhooks: false,
      offlineMode: true,
      digitalSignature: true,
      pushNotifications: true,
      whatsappNotifications: true,
      erpIntegration: false,
      crmIntegration: false,
      clientPortal: false,
      techPortal: true,
      companyPortal: false,
      auditingLogs: false,
      excelExport: false,
      pdfExport: true
    },
    limits: {
      maxCompanies: 0,
      maxUsers: 1,
      maxAdmins: 0,
      maxFiliais: 0,
      maxTicketsPerMonth: 999,
      maxTechnicians: 1,
      maxUploadSizeMb: 50,
      maxStorageGb: 10,
      aiTokensPerMonth: 5000000,
      apiRequestsPerDay: 0,
      webhookEndpoints: 0
    },
    aiLevel: "Avançada",
    aiFeatures: {
      aiReports: true,
      aiClassification: false,
      aiMatching: true,
      aiSummary: true,
      aiCopilotTech: true,
      aiCopilotComercial: false
    },
    financialFeatures: {
      splitPayment: true,
      anticipationAllowed: true,
      autoPix: true,
      digitalWallet: true,
      invoiceEmitting: false,
      refunds: false
    },
    gamificationConfig: {
      rankingEnabled: true,
      xpMultiplier: 2.0,
      exclusiveMissions: true,
      specialBadges: true,
      cashbackPercentage: 2.0
    },
    referralConfig: {
      rewardCompanyAmount: 50,
      rewardTechAmount: 50,
      monthlyLimitAmount: 500
    }
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub-1",
    targetId: "c-1", // SolarSol S.A.
    targetName: "SolarSol S.A. (Energia Solar)",
    targetType: "Empresa",
    planId: "plan-enterprise",
    planName: "Nexora Enterprise",
    planColor: "#6366f1",
    billingPeriod: "monthly",
    amount: 1999,
    status: "Ativa",
    paymentMethod: "Cartão",
    startedAt: "2026-01-20T10:00:00Z",
    nextBillingAt: "2026-07-20T10:00:00Z",
    autoRenew: true,
    history: [
      { timestamp: "2026-01-20T10:00:00Z", event: "Assinatura do Plano Enterprise iniciada", amount: 1999, actor: "Sistema" },
      { timestamp: "2026-06-20T10:00:00Z", event: "Cobrança mensal processada com sucesso", amount: 1999, actor: "Sistema" }
    ]
  },
  {
    id: "sub-2",
    targetId: "c-2", // NetVelo Telecom
    targetName: "NetVelo Telecom",
    targetType: "Empresa",
    planId: "plan-business",
    planName: "Nexora Business",
    planColor: "#06b6d4",
    billingPeriod: "monthly",
    amount: 799,
    status: "Ativa",
    paymentMethod: "PIX",
    startedAt: "2026-03-10T14:00:00Z",
    nextBillingAt: "2026-07-10T14:00:00Z",
    autoRenew: true,
    history: [
      { timestamp: "2026-03-10T14:00:00Z", event: "Assinatura do Plano Business iniciada", amount: 799, actor: "Sistema" },
      { timestamp: "2026-06-10T14:00:00Z", event: "Cobrança mensal paga via PIX", amount: 799, actor: "Sistema" }
    ]
  },
  {
    id: "sub-3",
    targetId: "t-1", // Thiago Alencar
    targetName: "Thiago Alencar Santos",
    targetType: "Técnico",
    planId: "plan-tech-premium",
    planName: "Técnico Pró",
    planColor: "#10b981",
    billingPeriod: "monthly",
    amount: 49,
    status: "Ativa",
    paymentMethod: "Cartão",
    startedAt: "2026-02-15T08:30:00Z",
    nextBillingAt: "2026-07-15T08:30:00Z",
    autoRenew: true,
    history: [
      { timestamp: "2026-02-15T08:30:00Z", event: "Assinatura do Técnico Pró iniciada", amount: 49, actor: "Sistema" },
      { timestamp: "2026-06-15T08:30:00Z", event: "Cobrança mensal no cartão de crédito", amount: 49, actor: "Sistema" }
    ]
  }
];

export const INITIAL_COUPONS: PlanCoupon[] = [
  {
    id: "coupon-bf50",
    code: "BLACKFRIDAY50",
    description: "50% de desconto nos primeiros 3 meses de qualquer plano corporativo.",
    discountType: "percentage",
    value: 50,
    quantityLimit: 200,
    usedQuantity: 142,
    validUntil: "2026-11-30T23:59:59Z",
    applicablePlans: ["plan-start", "plan-business"],
    onlyFirstSubscription: true,
    status: "Ativo"
  },
  {
    id: "coupon-nex20",
    code: "NEXORA20",
    description: "20% de desconto recorrente em qualquer plano de Técnico.",
    discountType: "percentage",
    value: 20,
    quantityLimit: 500,
    usedQuantity: 89,
    validUntil: "2026-12-31T23:59:59Z",
    applicablePlans: ["plan-tech-premium"],
    onlyFirstSubscription: false,
    status: "Ativo"
  },
  {
    id: "coupon-welcome",
    code: "BEMVINDO100",
    description: "R$ 100,00 de desconto fixo na taxa de adesão ou na primeira mensalidade.",
    discountType: "fixed",
    value: 100,
    quantityLimit: 1000,
    usedQuantity: 356,
    validUntil: "2026-08-31T23:59:59Z",
    applicablePlans: ["plan-start", "plan-business", "plan-enterprise"],
    onlyFirstSubscription: true,
    status: "Ativo"
  }
];

export const INITIAL_PLAN_AUDIT_LOGS: PlanAuditLog[] = [
  {
    id: "pal-1",
    timestamp: "2026-06-25T11:20:00Z",
    actorName: "André Luis (Super Admin)",
    actorIp: "172.24.12.98",
    planId: "plan-business",
    planName: "Nexora Business",
    actionType: "Edit",
    details: "Taxa de comissão reduzida de 15% para 12% no Plano Business para atrair novos parceiros de telecomunicações.",
    changes: [
      { field: "commission.percentage", oldValue: 15, newValue: 12 }
    ]
  },
  {
    id: "pal-2",
    timestamp: "2026-06-24T15:45:00Z",
    actorName: "André Luis (Super Admin)",
    actorIp: "172.24.12.98",
    planId: "plan-tech-premium",
    planName: "Técnico Pró",
    actionType: "Create",
    details: "Lançamento do plano especial para técnicos que desejam obter maior pontuação em gamificação e menor taxa sobre serviços de campo."
  },
  {
    id: "pal-3",
    timestamp: "2026-06-20T14:30:00Z",
    actorName: "André Luis (Super Admin)",
    actorIp: "192.168.1.15",
    planId: "plan-start",
    planName: "Nexora Start",
    actionType: "StatusChange",
    details: "Plano Start foi reativado para contratação direta após reajuste na quantidade mensal de chamados suportados.",
    changes: [
      { field: "status", oldValue: "Inativo", newValue: "Ativo" }
    ]
  }
];


