import React, { useState, useEffect } from "react";
import {
  Sparkles, Zap, Shield, BarChart2, Users, Map, Bot, CheckCircle, 
  ChevronDown, ChevronRight, Star, TrendingUp, Clock, DollarSign,
  ArrowRight, Play, Globe, Cpu, Award, Phone, Mail, X,
  Building2, HardHat, Briefcase, Lock, Menu, BarChart,
  MessageSquare, FileText, Layers, Settings, Package, Activity
} from "lucide-react";

interface LandingPageProps {
  onGoToRegister: () => void;
  onGoToLogin: () => void;
}

const PLANS = [
  {
    name: "Starter",
    price: 297,
    yearlyPrice: 249,
    color: "from-slate-600 to-slate-500",
    badge: "",
    description: "Para equipes que estão começando a digitalizar operações",
    features: [
      "Até 50 chamados/mês",
      "10 técnicos ativos",
      "3 usuários",
      "IA de Classificação",
      "Chat colaborativo",
      "App técnico",
      "Relatórios básicos",
      "Suporte por e-mail",
    ],
    limits: false,
  },
  {
    name: "Business",
    price: 697,
    yearlyPrice: 590,
    color: "from-cyan-600 to-blue-600",
    badge: "Mais Popular",
    description: "Para empresas que precisam de automação e IA avançada",
    features: [
      "Até 300 chamados/mês",
      "50 técnicos ativos",
      "15 usuários",
      "IA de Matching Geográfico",
      "Despacho automático",
      "Dashboard executivo",
      "API + Webhooks",
      "Programa de indicação",
      "Relatório técnico IA",
      "Suporte prioritário",
    ],
    limits: false,
  },
  {
    name: "Enterprise",
    price: 1497,
    yearlyPrice: 1249,
    color: "from-indigo-600 to-purple-600",
    badge: "Melhor Custo-Benefício",
    description: "Para grandes operações com múltiplas filiais e regiões",
    features: [
      "Chamados ilimitados",
      "Técnicos ilimitados",
      "Usuários ilimitados",
      "Todas as IAs ativas",
      "Detecção de fraudes",
      "Multi-tenant",
      "ERP Integration",
      "RevOps & CRM completo",
      "Customer Success IA",
      "SLA garantido 99.9%",
      "Gerente de conta",
    ],
    limits: false,
  },
  {
    name: "White Label",
    price: 3997,
    yearlyPrice: 3497,
    color: "from-yellow-600 to-orange-600",
    badge: "Revenda",
    description: "Plataforma completa com a sua marca para revender",
    features: [
      "Tudo do Enterprise",
      "Sua própria marca",
      "Domínio personalizado",
      "Gestão de sub-tenants",
      "Comissão sobre revendas",
      "API white-label",
      "Onboarding dedicado",
      "Suporte 24/7 VIP",
    ],
    limits: false,
  },
];

const SEGMENTS = [
  { icon: "📡", name: "Telecom & ISP", desc: "Gestão de instalações de fibra, GPON, FTTH e infraestrutura de rede" },
  { icon: "🔒", name: "Segurança Eletrônica", desc: "CFTV, controle de acesso, alarmes e monitoramento remoto" },
  { icon: "☀️", name: "Energia Solar", desc: "Instalação, manutenção preventiva e corretiva de sistemas fotovoltaicos" },
  { icon: "⚡", name: "Elétrica & Facilities", desc: "Manutenção predial, laudos NR10/NR35, gestão de ativos" },
  { icon: "🌐", name: "Redes & TI", desc: "Cabeamento estruturado, datacenter, switches Cisco e infraestrutura" },
  { icon: "❄️", name: "Climatização", desc: "HVAC, ar condicionado Daikin/Carrier, manutenção preventiva" },
];

const CASES = [
  {
    company: "Telefônica Brasil",
    segment: "Telecom",
    metric: "68%",
    desc: "redução no tempo de resposta a chamados críticos",
    avatar: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=60&h=60&fit=crop",
    quote: "A NexoraField transformou nossa operação de campo. O despacho automático por IA eliminou os atrasos de escalonamento manual.",
    name: "Carlos Mendes",
    role: "Diretor de Operações",
  },
  {
    company: "SolarSol S.A.",
    segment: "Energia Solar",
    metric: "3.2x",
    desc: "aumento na produtividade dos técnicos em campo",
    avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=60&h=60&fit=crop",
    quote: "Nunca mais perdi um chamado. O técnico certo, no lugar certo, na hora certa. A IA faz todo o matching geografico.",
    name: "Ana Lima",
    role: "CEO",
  },
  {
    company: "NetFibra SP",
    segment: "ISP",
    metric: "R$ 280k",
    desc: "economia anual com otimização de rotas e redução de deslocamentos",
    avatar: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=60&h=60&fit=crop",
    quote: "O ROI foi visível no primeiro mês. Reduzimos em 45% os custos de deslocamento com o matching geográfico inteligente.",
    name: "Roberto Costa",
    role: "CTO",
  },
];

const FAQS = [
  {
    q: "Quanto tempo leva para implantar a plataforma?",
    a: "O onboarding autônomo leva entre 30 e 60 minutos. Você mesmo configura tudo pelo wizard inteligente, sem precisar de consultores. Nossa IA te guia passo a passo.",
  },
  {
    q: "Preciso de técnicos da Nexora para configurar o sistema?",
    a: "Não. A plataforma é 100% self-service. O assistente de onboarding guiado por IA configura empresa, usuários, regiões, planos e integrações de forma autônoma.",
  },
  {
    q: "Como funciona o matching de técnicos por IA?",
    a: "Nossa IA analisa em tempo real: localização GPS do técnico, especialidade técnica exigida, histórico de rating, disponibilidade e raio de atuação. Em segundos, o técnico ideal é convocado automaticamente.",
  },
  {
    q: "O sistema funciona offline para técnicos em campo?",
    a: "Sim. O app do técnico funciona offline, sincronizando checklists, fotos e assinaturas quando a conexão for restaurada. Disponível nos planos Business e superiores.",
  },
  {
    q: "Como é o faturamento e posso cancelar quando quiser?",
    a: "Faturamento mensal automático via PIX, Cartão ou Boleto. Sem multa de cancelamento. Você cancela quando quiser diretamente no painel, sem burocracia.",
  },
  {
    q: "A plataforma integra com meu ERP/CRM atual?",
    a: "Sim. Oferecemos API REST completa, webhooks em tempo real e integrações nativas com os principais ERPs do mercado. Disponível nos planos Enterprise e White Label.",
  },
];

const FEATURES = [
  {
    icon: Bot,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    title: "IA de Despacho Automático",
    desc: "Matching inteligente de técnicos por geolocalização, especialidade, rating e disponibilidade em tempo real. Zero intervenção humana.",
  },
  {
    icon: Map,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Rastreamento GPS em Tempo Real",
    desc: "Acompanhe a localização de cada técnico, tempos de deslocamento e chegada ao local com precisão geográfica.",
  },
  {
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    title: "Detecção de Fraudes com IA",
    desc: "Análise automática de evidências, fotos, assinaturas e laudos para detectar inconsistências e proteger sua operação.",
  },
  {
    icon: BarChart2,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    title: "Dashboards Executivos",
    desc: "KPIs em tempo real: MRR, ARR, CAC, LTV, churn, NPS, tempo de onboarding e métricas de campo para CEO e gestores.",
  },
  {
    icon: FileText,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    title: "Relatório Técnico com IA",
    desc: "Geração automática de laudos técnicos estruturados, com análise de fotos, diagnóstico e recomendações pelo Gemini AI.",
  },
  {
    icon: DollarSign,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    title: "Split de Pagamento Automático",
    desc: "Divisão automática entre plataforma e técnico com comissão configurável. PIX instantâneo, boleto e cartão.",
  },
  {
    icon: Users,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    title: "Programa de Indicação",
    desc: "Growth loops automáticos: empresas e técnicos ganham bônus por cada indicação convertida. Expansão orgânica.",
  },
  {
    icon: Layers,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    title: "Multi-tenant & White Label",
    desc: "Separe operações por filial, região ou tenant. Revenda a plataforma com sua própria marca e domínio personalizado.",
  },
  {
    icon: Settings,
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
    title: "Webhooks & API REST",
    desc: "Integração com qualquer sistema via API documentada ou webhooks em tempo real para notificações e sincronização.",
  },
];

export default function LandingPage({ onGoToRegister, onGoToLogin }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState("home");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [roiTechs, setRoiTechs] = useState(10);
  const [roiTickets, setRoiTickets] = useState(80);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cookieBanner, setCookieBanner] = useState(true);

  const roiHoursSaved = Math.round(roiTickets * 0.4);
  const roiCostSaved = Math.round(roiHoursSaved * 85 + roiTechs * 120);
  const roiPayback = Math.round((697 / roiCostSaved) * 30);

  const navLinks = [
    { id: "home", label: "Início" },
    { id: "features", label: "Funcionalidades" },
    { id: "segments", label: "Segmentos" },
    { id: "cases", label: "Casos de Sucesso" },
    { id: "pricing", label: "Planos" },
    { id: "roi", label: "Simulador ROI" },
    { id: "faq", label: "FAQ" },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans">
      {/* LGPD Cookie Banner */}
      {cookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[200] bg-[#0b0e17]/95 border-t border-slate-800 p-4 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1 text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">🔒 Privacidade & LGPD:</strong> Utilizamos cookies essenciais para operar a plataforma e cookies analíticos (Google Analytics 4) para melhorar a experiência. Seus dados são tratados conforme a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setCookieBanner(false)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-all">Recusar não essenciais</button>
              <button onClick={() => setCookieBanner(false)} className="text-xs px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all">Aceitar todos</button>
            </div>
            <button onClick={() => setCookieBanner(false)} className="absolute top-3 right-3 text-slate-500 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="sticky top-0 z-[100] bg-[#030712]/90 backdrop-blur-md border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollTo("home")}>
            <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-1.5 rounded-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-base font-bold font-display tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">NexoraField</span>
              <span className="ml-2 text-[9px] font-mono text-cyan-400 hidden md:inline">AI-POWERED FSM</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${activeSection === l.id ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}>
                {l.label}
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <button onClick={onGoToLogin} className="hidden md:block text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all font-medium">
              Entrar
            </button>
            <button onClick={onGoToRegister} className="text-xs px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-cyan-500/20">
              Começar Grátis
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-1.5 text-slate-400 hover:text-white">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#0b0e17] px-4 py-3 space-y-1">
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="block w-full text-left text-sm text-slate-400 hover:text-white py-2 px-2 rounded-lg hover:bg-slate-800 transition-all">
                {l.label}
              </button>
            ))}
            <button onClick={onGoToLogin} className="block w-full text-left text-sm text-slate-400 hover:text-white py-2 px-2">Entrar</button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden pt-24 pb-32 px-4">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/8 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-xs font-mono text-cyan-400 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Powered by Google Gemini AI · Plataforma SaaS #1 em FSM no Brasil
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display leading-tight tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Gestão de Serviços
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              em Campo com IA
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
            A única plataforma FSM que usa <strong className="text-slate-200">Inteligência Artificial</strong> para despachar técnicos automaticamente, gerar laudos, detectar fraudes e maximizar a eficiência operacional da sua equipe em campo.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button onClick={onGoToRegister}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5">
              <Zap className="h-4 w-4" />
              Começar Teste Gratuito
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => scrollTo("cases")}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-sm transition-all hover:bg-slate-900/50">
              <Play className="h-4 w-4" />
              Ver Casos de Sucesso
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: "2.400+", label: "Técnicos ativos" },
              { value: "180k+", label: "Chamados processados" },
              { value: "98.7%", label: "Uptime garantido" },
              { value: "68%", label: "Redução no tempo de resposta" },
            ].map((s, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold font-display text-white mb-1">{s.value}</div>
                <div className="text-xs text-slate-500 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-4 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Funcionalidades</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display mt-3 mb-4">Tudo que sua operação precisa</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Tecnologia de ponta integrada em uma única plataforma. Da abertura do chamado ao pagamento do técnico — automatizado.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="group bg-[#0b0e17] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20">
                  <div className={`w-10 h-10 rounded-xl border ${f.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`h-5 w-5 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-sm text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEGMENTS */}
      <section id="segments" className="py-24 px-4 border-t border-slate-800/50 bg-[#070a0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Segmentos Atendidos</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display mt-3 mb-4">Para quem é a NexoraField</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Desenvolvida para empresas que gerenciam equipes técnicas em campo, em qualquer segmento.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEGMENTS.map((s, i) => (
              <div key={i} className="bg-[#0b0e17] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-black/20 cursor-default">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-sm text-white mb-2">{s.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section id="cases" className="py-24 px-4 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-yellow-400 uppercase tracking-widest">Casos de Sucesso</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display mt-3 mb-4">Resultados comprovados</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Empresas que transformaram suas operações de campo com a NexoraField AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASES.map((c, i) => (
              <div key={i} className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <img src={c.avatar} alt={c.company} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <div className="font-bold text-sm text-white">{c.company}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{c.segment}</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-cyan-400 font-display">{c.metric}</div>
                  <div className="text-xs text-slate-400 mt-1">{c.desc}</div>
                </div>
                <p className="text-xs text-slate-400 italic leading-relaxed">"{c.quote}"</p>
                <div className="text-xs font-semibold text-slate-300">
                  {c.name} <span className="text-slate-600">·</span> <span className="text-slate-500 font-normal">{c.role}</span>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 text-yellow-400 fill-yellow-400" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-4 border-t border-slate-800/50 bg-[#070a0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Planos & Preços</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display mt-3 mb-4">Escolha o plano ideal</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-6">Todos os planos incluem 14 dias de trial gratuito. Sem cartão de crédito.</p>
            {/* Billing toggle */}
            <div className="inline-flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
              <button onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${billingPeriod === "monthly" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-white"}`}>
                Mensal
              </button>
              <button onClick={() => setBillingPeriod("yearly")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${billingPeriod === "yearly" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-white"}`}>
                Anual <span className="text-emerald-400 ml-1">-16%</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {PLANS.map((plan, i) => (
              <div key={i} className={`relative bg-[#0b0e17] border rounded-2xl p-6 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 ${plan.badge === "Mais Popular" ? "border-cyan-500/50 shadow-lg shadow-cyan-500/10" : "border-slate-800"}`}>
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r ${plan.color} text-white whitespace-nowrap`}>
                    {plan.badge}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{plan.description}</p>
                </div>
                <div>
                  <span className="text-3xl font-bold font-display text-white">
                    R$ {billingPeriod === "yearly" ? plan.yearlyPrice.toLocaleString("pt-BR") : plan.price.toLocaleString("pt-BR")}
                  </span>
                  <span className="text-slate-500 text-xs">/mês</span>
                  {billingPeriod === "yearly" && (
                    <div className="text-[10px] text-emerald-400 mt-1">Cobrado anualmente · Economize R$ {((plan.price - plan.yearlyPrice) * 12).toLocaleString("pt-BR")}/ano</div>
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <button onClick={onGoToRegister}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all bg-gradient-to-r ${plan.color} text-white hover:opacity-90 shadow-lg`}>
                  Começar Agora
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-600 mt-8">Aceita PIX, Cartão de Crédito, Boleto Bancário e Débito em Conta. Notas fiscais emitidas automaticamente.</p>
        </div>
      </section>

      {/* ROI SIMULATOR */}
      <section id="roi" className="py-24 px-4 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-green-400 uppercase tracking-widest">Simulador de ROI</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display mt-3 mb-4">Calcule sua economia</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Descubra em tempo real quanto sua empresa pode economizar com a NexoraField AI.</p>
          </div>

          <div className="bg-[#0b0e17] border border-slate-800 rounded-3xl p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-3">
                    Número de Técnicos em Campo: <span className="text-cyan-400 font-bold">{roiTechs}</span>
                  </label>
                  <input type="range" min={2} max={200} value={roiTechs} onChange={e => setRoiTechs(+e.target.value)}
                    className="w-full accent-cyan-500" />
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>2</span><span>200</span></div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-3">
                    Chamados por Mês: <span className="text-cyan-400 font-bold">{roiTickets}</span>
                  </label>
                  <input type="range" min={10} max={2000} step={10} value={roiTickets} onChange={e => setRoiTickets(+e.target.value)}
                    className="w-full accent-cyan-500" />
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>10</span><span>2.000</span></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold font-display text-emerald-400">
                    R$ {roiCostSaved.toLocaleString("pt-BR")}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Economia estimada por mês</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-cyan-400">{roiHoursSaved}h</div>
                    <div className="text-[10px] text-slate-500">Horas poupadas/mês</div>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-yellow-400">{roiPayback < 1 ? "<1" : roiPayback} dias</div>
                    <div className="text-[10px] text-slate-500">Payback estimado</div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-600 text-center leading-relaxed">
                  *Estimativa baseada em redução de 40% no tempo de despacho, otimização de rotas e automação de laudos.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6 text-center">
              <button onClick={onGoToRegister}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20">
                <TrendingUp className="h-4 w-4" />
                Começar a Economizar Agora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 border-t border-slate-800/50 bg-[#070a0f]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">Perguntas Frequentes</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display mt-3 mb-4">Dúvidas frequentes</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[#0b0e17] border border-slate-800 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-slate-200 hover:text-white transition-all">
                  {faq.q}
                  <ChevronDown className={`h-4 w-4 text-slate-500 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-4 border-t border-slate-800/50 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-[#0b0e17] to-[#0d1220] border border-slate-700 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-indigo-500/5 to-transparent pointer-events-none" />
            <Sparkles className="h-12 w-12 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Pronto para transformar sua operação?
            </h2>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              Junte-se a mais de 350 empresas que já automatizaram suas operações de campo com IA. Configuração em 30 minutos, sem precisar de TI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onGoToRegister}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-2xl shadow-cyan-500/25">
                <Zap className="h-4 w-4" />
                Começar Teste Gratuito — 14 dias
              </button>
              <button onClick={onGoToLogin}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-sm font-semibold transition-all">
                Já tenho conta
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-6">Sem cartão de crédito · Cancele quando quiser · LGPD compliant</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-[#030712] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-1.5 rounded-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-white font-display">NexoraField</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">Plataforma SaaS de Field Service Management com Inteligência Artificial. Despacho autônomo, laudos técnicos e gestão completa.</p>
              <div className="flex gap-3">
                {["WhatsApp", "LinkedIn", "Instagram"].map(s => (
                  <div key={s} className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[9px] text-slate-500 font-mono cursor-pointer hover:border-slate-600 hover:text-slate-300 transition-all">{s[0]}</div>
                ))}
              </div>
            </div>
            {[
              { title: "Produto", links: ["Funcionalidades", "Planos", "Roadmap Público", "API", "Status da Plataforma"] },
              { title: "Empresa", links: ["Sobre Nós", "Blog", "Parceiros", "Carreiras", "Contato"] },
              { title: "Legal", links: ["Privacidade", "Termos de Uso", "LGPD", "Cookies", "SLA"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-xs font-bold text-slate-300 mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-all">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-600">
            <span>© 2026 NexoraField AI · CNPJ: 00.000.000/0001-00 · Todos os direitos reservados</span>
            <span className="flex items-center gap-1.5"><Globe className="h-3 w-3" /> Brasil · Português</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
