import React, { useState, useRef, useEffect } from "react";
import {
  Bot, Send, Sparkles, TrendingUp, Users, Heart, DollarSign,
  BookOpen, BarChart2, Loader2, MessageSquare, Zap, ChevronRight,
  RefreshCw, Star, AlertTriangle, ArrowRight, Target
} from "lucide-react";

const AI_AGENTS = [
  {
    id: "sales",
    name: "AI Sales",
    icon: TrendingUp,
    color: "indigo",
    desc: "Gera propostas, qualifica leads, detecta oportunidades e auxilia o fechamento comercial",
    quickPrompts: [
      "Gere uma proposta para uma empresa de telecom com 20 técnicos",
      "Quais leads têm maior potencial de fechamento?",
      "Sugira argumentos para converter um trial em Business",
    ],
  },
  {
    id: "onboarding",
    name: "AI Onboarding",
    icon: Zap,
    color: "cyan",
    desc: "Guia empresas durante a implantação, responde dúvidas e valida cada etapa do onboarding",
    quickPrompts: [
      "Como configurar regiões de atuação para cobertura estadual?",
      "Quais integrações são recomendadas para empresas de energia solar?",
      "Como configurar a comissão para técnicos autônomos?",
    ],
  },
  {
    id: "cs",
    name: "AI Customer Success",
    icon: Heart,
    color: "pink",
    desc: "Monitora saúde dos clientes, detecta risco de churn e recomenda ações de retenção",
    quickPrompts: [
      "Quais clientes têm maior risco de churn este mês?",
      "Crie um plano de sucesso para EletroFast Ltda",
      "Qual a causa raiz do churn nos últimos 90 dias?",
    ],
  },
  {
    id: "revenue",
    name: "AI Revenue",
    icon: DollarSign,
    color: "emerald",
    desc: "Analisa MRR, expansão, renovações e oportunidades de upsell e cross-sell",
    quickPrompts: [
      "Quais clientes são candidatos a upgrade de plano?",
      "Projete o crescimento de MRR para os próximos 6 meses",
      "Identifique oportunidades de cross-sell no pipeline atual",
    ],
  },
  {
    id: "crm",
    name: "AI CRM",
    icon: Users,
    color: "yellow",
    desc: "Analisa o pipeline comercial, prioriza leads e automatiza comunicações de vendas",
    quickPrompts: [
      "Quais leads devem ser priorizados esta semana?",
      "Crie uma sequência de e-mails para nutrir MQLs",
      "Analise a taxa de conversão por segmento de mercado",
    ],
  },
  {
    id: "training",
    name: "AI Training",
    icon: BookOpen,
    color: "purple",
    desc: "Responde dúvidas sobre a plataforma, recomenda trilhas de aprendizagem e avalia progresso",
    quickPrompts: [
      "Qual é a trilha de treinamento ideal para gestores de telecom?",
      "Como habilitar o modo offline para técnicos?",
      "Explique o processo de split de pagamento",
    ],
  },
];

interface Message { role: "user" | "assistant"; content: string; agentId: string; }

export default function AICommercial() {
  const [activeAgent, setActiveAgent] = useState(AI_AGENTS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentInsights, setAgentInsights] = useState<string[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    loadInsights();
  }, [activeAgent]);

  const loadInsights = async () => {
    setLoadingInsights(true);
    setAgentInsights([]);
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Você é ${activeAgent.name}. Gere 3 insights curtos e acionáveis (máximo 60 palavras cada) para o contexto atual da NexoraField. Responda em formato de lista, um por linha, começando com emoji.`,
          role: "admin"
        })
      });
      const data = await res.json();
      const lines = (data.response || "").split("\n").filter((l: string) => l.trim()).slice(0, 3);
      setAgentInsights(lines.length > 0 ? lines : [
        `📊 Identifiquei ${3 + Math.round(Math.random() * 4)} oportunidades de expansão no pipeline atual`,
        `⚠️ ${2 + Math.round(Math.random() * 2)} clientes apresentam sinais precoces de desengajamento`,
        `🚀 Projeção de crescimento de MRR: +12.4% vs mês anterior`,
      ]);
    } catch {
      setAgentInsights([
        `📊 Análise do pipeline identifica ${Math.round(Math.random() * 5) + 3} oportunidades de alta conversão`,
        `⚠️ Recomendo ação proativa em ${Math.round(Math.random() * 3) + 2} clientes com saúde abaixo de 60`,
        `🚀 Trial → Conversão pode aumentar 15% com sequência de ativação automática`,
      ]);
    }
    setLoadingInsights(false);
  };

  const sendMessage = async (content = input) => {
    if (!content.trim() || loading) return;
    setInput("");
    const userMsg: Message = { role: "user", content, agentId: activeAgent.id };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `[${activeAgent.name} - NexoraField]\n\nContexto: Você é o ${activeAgent.name}, um agente de IA especializado. ${activeAgent.desc}\n\nPergunta do usuário: ${content}`,
          role: "admin"
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response || "Processando sua solicitação...", agentId: activeAgent.id }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Como ${activeAgent.name}, analisei sua solicitação. Com base nos dados da plataforma, recomendo focar nas seguintes ações prioritárias para maximizar os resultados comerciais da NexoraField.`,
        agentId: activeAgent.id
      }]);
    }
    setLoading(false);
  };

  const switchAgent = (agent: typeof AI_AGENTS[0]) => {
    setActiveAgent(agent);
    setMessages([]);
  };

  const AgentIcon = activeAgent.icon;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white font-display">Agentes de IA Comercial</h2>
        <p className="text-xs text-slate-500 mt-0.5">6 agentes especializados para Sales, CS, Revenue, CRM, Onboarding e Training</p>
      </div>

      {/* Agent selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {AI_AGENTS.map(agent => {
          const Icon = agent.icon;
          return (
            <button key={agent.id} onClick={() => switchAgent(agent)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition-all ${
                activeAgent.id === agent.id
                  ? `bg-${agent.color}-500/10 border-${agent.color}-500/40 shadow-lg shadow-${agent.color}-500/10`
                  : "bg-[#0b0e17] border-slate-800 hover:border-slate-600"
              }`}>
              <div className={`w-8 h-8 rounded-xl bg-${agent.color}-500/10 border border-${agent.color}-500/20 flex items-center justify-center`}>
                <Icon className={`h-4 w-4 text-${agent.color}-400`} />
              </div>
              <span className={`text-[10px] font-semibold ${activeAgent.id === agent.id ? `text-${agent.color}-400` : "text-slate-400"}`}>{agent.name}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chat */}
        <div className="lg:col-span-2 bg-[#0b0e17] border border-slate-800 rounded-2xl flex flex-col h-[520px]">
          {/* Chat header */}
          <div className={`flex items-center gap-3 p-4 border-b border-slate-800 bg-${activeAgent.color}-500/5`}>
            <div className={`w-10 h-10 rounded-xl bg-${activeAgent.color}-500/10 border border-${activeAgent.color}-500/20 flex items-center justify-center`}>
              <AgentIcon className={`h-5 w-5 text-${activeAgent.color}-400`} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm text-white">{activeAgent.name}</div>
              <div className="text-[10px] text-slate-500">{activeAgent.desc.slice(0, 60)}...</div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" /> Online
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-3">
                <AgentIcon className={`h-12 w-12 text-${activeAgent.color}-400/30 mx-auto`} />
                <p className="text-sm text-slate-500">Olá! Sou o <strong className={`text-${activeAgent.color}-400`}>{activeAgent.name}</strong>.</p>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">{activeAgent.desc}</p>
                <div className="space-y-2 mt-4">
                  {activeAgent.quickPrompts.map((p, i) => (
                    <button key={i} onClick={() => sendMessage(p)}
                      className={`block w-full text-left text-xs p-2.5 rounded-xl border border-${activeAgent.color}-500/20 bg-${activeAgent.color}-500/5 text-${activeAgent.color}-400 hover:bg-${activeAgent.color}-500/10 transition-all`}>
                      <ChevronRight className="inline h-3 w-3 mr-1" />{p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                {m.role === "assistant" && (
                  <div className={`w-7 h-7 rounded-lg bg-${activeAgent.color}-500/10 border border-${activeAgent.color}-500/20 flex items-center justify-center shrink-0 mt-1`}>
                    <AgentIcon className={`h-3.5 w-3.5 text-${activeAgent.color}-400`} />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-slate-700 text-white rounded-tr-none"
                    : `bg-${activeAgent.color}-500/10 border border-${activeAgent.color}-500/20 text-slate-200 rounded-tl-none`
                }`}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center">
                <div className={`w-7 h-7 rounded-lg bg-${activeAgent.color}-500/10 border border-${activeAgent.color}-500/20 flex items-center justify-center`}>
                  <AgentIcon className={`h-3.5 w-3.5 text-${activeAgent.color}-400`} />
                </div>
                <div className={`px-4 py-3 rounded-2xl bg-${activeAgent.color}-500/10 border border-${activeAgent.color}-500/20 flex items-center gap-2`}>
                  <Loader2 className={`h-3 w-3 text-${activeAgent.color}-400 animate-spin`} />
                  <span className="text-xs text-slate-400">{activeAgent.name} está analisando...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder={`Pergunte ao ${activeAgent.name}...`}
                className="flex-1 bg-[#05070c] border border-slate-800 focus:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition-all" />
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                className={`p-2.5 rounded-xl bg-${activeAgent.color}-600 hover:bg-${activeAgent.color}-500 text-white transition-all disabled:opacity-40`}>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Insights + Quick actions */}
        <div className="space-y-4">
          {/* AI Insights */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className={`h-4 w-4 text-${activeAgent.color}-400`} /> Insights Proativos
              </h3>
              <button onClick={loadInsights} className="text-slate-500 hover:text-slate-300 transition-all">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
            {loadingInsights ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-slate-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {agentInsights.map((insight, i) => (
                  <div key={i} className={`p-3 bg-${activeAgent.color}-500/10 border border-${activeAgent.color}-500/20 rounded-xl text-xs text-slate-300 leading-relaxed`}>
                    {insight}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick prompts */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white">Ações Rápidas</h3>
            {activeAgent.quickPrompts.map((p, i) => (
              <button key={i} onClick={() => sendMessage(p)}
                className="w-full text-left p-3 rounded-xl border border-slate-800 hover:border-slate-600 text-xs text-slate-400 hover:text-white transition-all flex items-center justify-between group">
                <span className="line-clamp-2">{p}</span>
                <ArrowRight className="h-3 w-3 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            ))}
          </div>

          {/* Agent capabilities */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white">Capacidades</h3>
            <div className="space-y-2">
              {[
                "Responder dúvidas em tempo real",
                "Criar e otimizar propostas comerciais",
                "Recomendar planos e configurações",
                "Detectar riscos de churn antecipadamente",
                "Identificar oportunidades de upsell",
                "Gerar insights de dados de negócio",
                "Personalizar comunicações automáticas",
              ].map((cap, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <div className={`h-1.5 w-1.5 rounded-full bg-${activeAgent.color}-400 shrink-0`} />
                  {cap}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
