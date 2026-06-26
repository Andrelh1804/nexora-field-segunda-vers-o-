import { db } from "./index";
import { users, companies, technicians, tickets, financialTransactions, aiAuditLogs } from "./schema";
import { sql } from "drizzle-orm";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

const SEED_USERS = [
  { email: "admin@nexorafield.com", password: "admin123", role: "admin", name: "Super Admin" },
  { email: "operacoes@solarsol.com.br", password: "solarsol123", role: "company", name: "SolarSol S.A. (Empresa)" },
  { email: "alexandre.tech@gmail.com", password: "tech123", role: "tech", name: "Alexandre Santos (Técnico)" },
  { email: "mariana.fibra@outlook.com", password: "comercial123", role: "comercial", name: "Mariana Costa (Comercial)" },
];

const SEED_COMPANIES = [
  {
    id: "comp-1", name: "Telefônica Brasil S.A.", email: "infra@telefonica.com.br",
    phone: "(11) 98765-4321", cnpj: "02.558.157/0001-62", city: "São Paulo", state: "SP",
    avatar: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop&crop=faces",
    segment: "Telecom", referralCode: "TELEF-9090", referralCredits: 200
  },
  {
    id: "comp-2", name: "SolarSol Soluções S.A.", email: "operacoes@solarsol.com.br",
    phone: "(19) 97654-3210", cnpj: "12.345.678/0001-99", city: "Campinas", state: "SP",
    avatar: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=150&fit=crop&crop=faces",
    segment: "Energia Solar", referralCode: "SOLAR-777", referralCredits: 100
  },
  {
    id: "comp-3", name: "Fortress Segurança Eletrônica", email: "chamados@fortress.com",
    phone: "(21) 96543-2109", cnpj: "98.765.432/0001-00", city: "Rio de Janeiro", state: "RJ",
    avatar: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=faces",
    segment: "Segurança Eletrônica", referralCode: "FORT-1010", referralCredits: 0
  },
];

const SEED_TECHNICIANS = [
  {
    id: "tech-1", name: "Alexandre Silva Santos", cpf: "123.456.789-01", rg: "12.345.678-9",
    birthDate: "1988-04-12", email: "alexandre.tech@gmail.com", phone: "(19) 98123-4567",
    whatsapp: "(19) 98123-4567", city: "Campinas", state: "SP", cep: "13010-000",
    address: "Avenida Francisco Glicério, 1200 - Centro",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=faces",
    nr10: true, nr35: true, nr33: false,
    specialties: ["CFTV", "Alarmes", "Redes", "Intelbras", "Hikvision"],
    equipment: ["Carro", "Escada de Fibra", "Notebook", "Multímetro", "EPIs", "Furadeira de Impacto"],
    availabilityDays: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    availabilityHours: "08:00 - 18:00", radiusKm: 35,
    latitude: -22.9068, longitude: -47.0616,
    pixKey: "19981234567", pixType: "Celular", bankName: "Itaú Unibanco",
    agency: "0192", accountNumber: "23456-7",
    rating: 4.9, reviewsCount: 28, completedJobsCount: 42,
    status: "online", documentsApproved: true, signedContract: true,
    points: 5400, badges: ["Top Performer", "Customer Favorite", "Agilidade Nexora"],
    referralCode: "ALEX-FIELD-99", referralCredits: 50, responseTimeMin: 12
  },
  {
    id: "tech-2", name: "Mariana Costa Oliveira", cpf: "234.567.890-12", rg: "23.456.789-0",
    birthDate: "1993-08-22", email: "mariana.fibra@outlook.com", phone: "(19) 98234-5678",
    whatsapp: "(19) 98234-5678", city: "Campinas", state: "SP", cep: "13083-970",
    address: "Rua Albert Einstein, 400 - Barão Geraldo",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    nr10: true, nr35: false, nr33: true,
    specialties: ["Fibra", "Redes", "Cablagem Estruturada", "Cisco", "Huawei"],
    equipment: ["Moto", "Notebook", "Máquina de Fusão", "OTDR", "EPIs", "Certificador de Rede"],
    availabilityDays: ["Seg", "Ter", "Qua", "Qui", "Sex"],
    availabilityHours: "07:30 - 17:30", radiusKm: 40,
    latitude: -22.8173, longitude: -47.0689,
    pixKey: "23456789012", pixType: "CPF", bankName: "Banco do Brasil",
    agency: "3123", accountNumber: "12543-0",
    rating: 4.8, reviewsCount: 15, completedJobsCount: 19,
    status: "online", documentsApproved: true, signedContract: true,
    points: 2450, badges: ["Customer Favorite", "Pioneiro"],
    referralCode: "MARI-FIBRA-12", referralCredits: 0, responseTimeMin: 15
  },
  {
    id: "tech-3", name: "Carlos Eduardo Souza", cpf: "345.678.901-23", rg: "34.567.890-1",
    birthDate: "1985-11-30", email: "cadu.solar@gmail.com", phone: "(11) 98345-6789",
    whatsapp: "(11) 98345-6789", city: "São Paulo", state: "SP", cep: "01310-100",
    address: "Avenida Paulista, 1000 - Bela Vista",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
    nr10: true, nr35: true, nr33: false,
    specialties: ["Solar", "Elétrica", "Instalação Solar", "WEG", "SolarEdge"],
    equipment: ["Carro", "Escada de Fibra", "Multímetro", "EPIs", "Furadeira de Impacto", "Osciloscópio"],
    availabilityDays: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    availabilityHours: "08:00 - 19:00", radiusKm: 50,
    latitude: -23.5616, longitude: -46.6561,
    pixKey: "cadu.solar@gmail.com", pixType: "E-mail", bankName: "Nubank",
    agency: "0001", accountNumber: "9876543-2",
    rating: 4.95, reviewsCount: 34, completedJobsCount: 51,
    status: "busy", documentsApproved: true, signedContract: true,
    points: 6300, badges: ["Top Performer", "Sócio Indicator"],
    referralCode: "CADU-SOLAR-03", referralCredits: 150, responseTimeMin: 10
  },
];

const SEED_TICKETS = [
  {
    id: "ticket-1", title: "Instalação de CFTV - 16 Câmeras IP",
    description: "Necessário instalação de sistema de CFTV com 16 câmeras IP Full HD, DVR 16 canais, configuração de acesso remoto e treinamento da equipe.",
    category: "CFTV", specialty: "Hikvision", urgency: "Alta",
    date: "2026-07-01", time: "08:00",
    cep: "13010-000", city: "Campinas", state: "SP",
    address: "Avenida Francisco Glicério, 1200 - Centro",
    latitude: -22.9068, longitude: -47.0616,
    suggestedValue: 3800, deadline: "2026-07-03",
    photos: [], documents: [],
    status: "Em_Andamento", companyId: "comp-1",
    assignedTechId: "tech-1", invitedTechIds: ["tech-1", "tech-2"],
    declinedTechIds: [],
    checklist: [
      { item: "Instalação dos suportes e câmeras", completed: true },
      { item: "Passagem de cabeamento", completed: true },
      { item: "Configuração do DVR", completed: false },
      { item: "Teste de acesso remoto", completed: false },
      { item: "Treinamento do cliente", completed: false }
    ],
    evidencePhotos: [], fraudAlerts: [],
    createdAt: new Date("2026-06-25T14:30:00.000Z"),
    updatedAt: new Date("2026-06-25T14:30:00.000Z"),
  },
  {
    id: "ticket-2", title: "Fusão de Fibra Óptica - 48 Fibras",
    description: "Fusão de 48 fibras ópticas em emenda de passagem e terminais, teste de atenuação com OTDR e entrega do relatório técnico.",
    category: "Fibra", specialty: "Furukawa", urgency: "Crítica",
    date: "2026-06-28", time: "07:30",
    cep: "13083-970", city: "Campinas", state: "SP",
    address: "Rua Albert Einstein, 400 - Barão Geraldo",
    latitude: -22.8173, longitude: -47.0689,
    suggestedValue: 1200, deadline: "2026-06-28",
    photos: [], documents: [],
    status: "Aguardando_Aprovacao", companyId: "comp-2",
    assignedTechId: "tech-2", invitedTechIds: ["tech-2"],
    declinedTechIds: [],
    checklist: [
      { item: "Preparação dos tubetes e bandejas", completed: true },
      { item: "Fusão das 48 fibras", completed: true },
      { item: "Teste OTDR de todas as fusões", completed: true },
      { item: "Montagem do relatório fotográfico", completed: true }
    ],
    evidencePhotos: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    fraudAlerts: [],
    createdAt: new Date("2026-06-24T10:00:00.000Z"),
    updatedAt: new Date("2026-06-24T10:00:00.000Z"),
  },
  {
    id: "ticket-3", title: "Sistema de Alarme Perimetral",
    description: "Instalação de sistema de alarme perimetral com sensores infravermelho, central de monitoramento e integração com CFTV existente.",
    category: "Alarmes", specialty: "Intelbras", urgency: "Média",
    date: "2026-07-05", time: "09:00",
    cep: "22021-001", city: "Rio de Janeiro", state: "RJ",
    address: "Avenida Atlântica, 1700 - Copacabana",
    latitude: -22.9698, longitude: -43.1802,
    suggestedValue: 2500, deadline: "2026-07-08",
    photos: [], documents: [],
    status: "Aberto", companyId: "comp-3",
    assignedTechId: null, invitedTechIds: [],
    declinedTechIds: [], checklist: [], evidencePhotos: [],
    fraudAlerts: [],
    createdAt: new Date("2026-06-26T09:00:00.000Z"),
    updatedAt: new Date("2026-06-26T09:00:00.000Z"),
  },
];

const SEED_TRANSACTIONS = [
  {
    id: "trans-1", ticketId: "ticket-2", ticketTitle: "Fusão de Fibra Óptica - 48 Fibras",
    companyName: "SolarSol Soluções S.A.", techName: "Mariana Costa Oliveira",
    totalAmount: 1200, platformCommission: 15, platformEarnings: 180, techPayout: 1020,
    paymentMethod: "PIX", status: "Retido",
    createdAt: new Date("2026-06-26T08:00:00.000Z"),
  },
];

const SEED_AUDIT_LOGS = [
  {
    id: "log-1", ticketId: "ticket-1", type: "classification",
    message: "IA classificou o chamado como CFTV - Alta Urgência. Especialista sugerido: Instalador Hikvision certificado.",
    timestamp: new Date("2026-06-25T14:31:00.000Z"),
  },
  {
    id: "log-2", ticketId: "ticket-1", type: "matching",
    message: "IA selecionou 2 técnicos compatíveis no raio de 35km: Alexandre Santos (4.9★) e Mariana Costa (4.8★).",
    timestamp: new Date("2026-06-25T14:32:00.000Z"),
  },
  {
    id: "log-3", ticketId: "ticket-2", type: "fraud_check",
    message: "Verificação anti-fraude concluída. Evidências fotográficas validadas. Score de autenticidade: 98/100.",
    timestamp: new Date("2026-06-26T07:55:00.000Z"),
  },
];

export async function seedDatabase() {
  try {
    const existingTickets = await db.select().from(tickets).limit(1);
    if (existingTickets.length > 0) {
      console.log("🌱 Database already seeded, skipping...");
      return;
    }

    console.log("🌱 Seeding database with initial data...");

    // Seed users with bcrypt-hashed passwords
    for (const u of SEED_USERS) {
      const passwordHash = await bcrypt.hash(u.password, SALT_ROUNDS);
      await db.insert(users).values({
        email: u.email,
        passwordHash,
        role: u.role,
        name: u.name,
        tenantId: "nexorafield-default",
      }).onConflictDoNothing();
    }
    console.log(`  ✓ ${SEED_USERS.length} users seeded`);

    // Seed companies
    for (const c of SEED_COMPANIES) {
      await db.insert(companies).values(c).onConflictDoNothing();
    }
    console.log(`  ✓ ${SEED_COMPANIES.length} companies seeded`);

    // Seed technicians
    for (const t of SEED_TECHNICIANS) {
      await db.insert(technicians).values(t as any).onConflictDoNothing();
    }
    console.log(`  ✓ ${SEED_TECHNICIANS.length} technicians seeded`);

    // Seed tickets
    for (const t of SEED_TICKETS) {
      await db.insert(tickets).values(t as any).onConflictDoNothing();
    }
    console.log(`  ✓ ${SEED_TICKETS.length} tickets seeded`);

    // Seed transactions
    for (const tx of SEED_TRANSACTIONS) {
      await db.insert(financialTransactions).values(tx as any).onConflictDoNothing();
    }
    console.log(`  ✓ ${SEED_TRANSACTIONS.length} transactions seeded`);

    // Seed audit logs
    for (const log of SEED_AUDIT_LOGS) {
      await db.insert(aiAuditLogs).values(log as any).onConflictDoNothing();
    }
    console.log(`  ✓ ${SEED_AUDIT_LOGS.length} audit logs seeded`);

    console.log("✅ Database seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
