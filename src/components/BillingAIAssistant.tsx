import React, { useState } from "react";
import { 
  Sparkles, Send, HelpCircle, AlertTriangle, MessageSquare, Calendar, ChevronRight, Zap, RefreshCw, BarChart3, PieChart, Activity, UserCheck
} from "lucide-react";

interface DefaulterAccount {
  id: string;
  companyName: string;
  planName: string;
  daysLate: number;
  dueAmount: number;
  riskLevel: 'Crítico' | 'Médio' | 'Baixo';
  phone: string;
  contactDraft?: string;
}

export default function BillingAIAssistant() {
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'ai'; text: string; attachment?: React.ReactNode }[]>([
    { 
      sender: 'ai', 
      text: 'Olá Super Administrador! Sou o agente de IA Financeira da NexoraField. Posso analisar inadimplência, prever faturamento de MRR/ARR, calcular margens de planos, segmentar receitas geográficas e criar estratégias para mitigação de Churn. Como posso ajudar hoje?' 
    }
  ]);

  // Priority collections list
  const [defaulters, setDefaulters] = useState<DefaulterAccount[]>([
    { 
      id: "def-1", 
      companyName: "SolarSol Soluções S.A.", 
      planName: "Nexora Gold", 
      daysLate: 15, 
      dueAmount: 449.00, 
      riskLevel: "Crítico", 
      phone: "(31) 97777-6666",
      contactDraft: "Prezada Elisa Guimarães (SolarSol), identificamos que a fatura de mensalidade do plano Nexora Gold (vencimento em 10/06, R$ 449,00) encontra-se pendente. Solicitamos a regularização para evitar a suspensão programada do portal NexoraField no dia 25/06. Chave PIX copia-e-cola em anexo."
    },
    { 
      id: "def-2", 
      companyName: "Amazon Secur Tecnologia", 
      planName: "Nexora Start", 
      daysLate: 6, 
      dueAmount: 299.00, 
      riskLevel: "Médio", 
      phone: "(92) 95555-4444",
      contactDraft: "Olá Thiago Rocha (Amazon Secur), passamos para avisar que a mensalidade do Nexora Start de R$ 299,00 venceu há 6 dias. Para manter seu painel operando normalmente e despachar ordens de serviço, regularize via PIX. Link de pagamento em anexo."
    }
  ]);

  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

  // Quick inquiry queries
  const quickQuestions = [
    { q: "Qual empresa possui maior inadimplência?", key: "inadimplencia" },
    { q: "Qual plano possui maior margem?", key: "margem" },
    { q: "Quanto faturaremos no próximo mês?", key: "faturamento" },
    { q: "Qual estado gera maior receita?", key: "estado" },
    { q: "Quais empresas apresentam risco de cancelamento?", key: "churn" }
  ];

  // AI response engine (Rule-based calculated responses for high fidelity simulation)
  const handleSendQuestion = (questionText: string) => {
    if (!questionText.trim()) return;

    // Add user question to log
    setChatLog(prev => [...prev, { sender: 'user', text: questionText }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      let aiText = "";
      let attachment: React.ReactNode = null;

      const qLower = questionText.toLowerCase();

      if (qLower.includes("inadimplencia") || qLower.includes("inadimplente") || qLower.includes("devedor")) {
        aiText = "A empresa com maior inadimplência acumulada é a SolarSol Soluções S.A., com 15 dias de atraso na fatura vencida em 10/06, no valor de R$ 449,00. O risco de Churn técnico desta conta está em nível 'Crítico'. Recomendo acionar o dunning inteligente abaixo com desconto de multa para quitação rápida via PIX.";
        attachment = (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-xs mt-2 text-rose-400 font-mono">
            <span className="block font-bold">⚠️ ANÁLISE DE RISCO - SOLARSOL</span>
            <span>Probabilidade Churn: 82% | Dias de Atraso: 15 | Contato Prioritário: Elisa Guimarães</span>
          </div>
        );
      } else if (qLower.includes("margem") || qLower.includes("plano") || qLower.includes("lucro")) {
        aiText = "O plano com maior margem de contribuição líquida é o Nexora Platinum (Corporate). Devido ao ticket elevado de R$ 1.499,00/mês e a menor incidência de custos operacionais com suporte por conta de atendimento integrado. O plano Start (R$ 299,00) possui maior volume de usuários mas margem 35% menor devido a demandas elevadas de servidores para alta quantidade de fotos de evidências.";
        attachment = (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-xs mt-2 space-y-1.5">
            <span className="block font-bold text-white">📈 EFICIÊNCIA DE MARGEM POR CATEGORIA:</span>
            <div className="flex justify-between font-mono"><span>Platinum:</span> <span className="text-emerald-400 font-bold">92.5%</span></div>
            <div className="flex justify-between font-mono"><span>Gold:</span> <span className="text-cyan-400 font-bold">81.0%</span></div>
            <div className="flex justify-between font-mono"><span>Start:</span> <span className="text-amber-400 font-bold">60.2%</span></div>
          </div>
        );
      } else if (qLower.includes("faturar") || qLower.includes("proximo") || qLower.includes("previsão") || qLower.includes("mrr")) {
        aiText = "Com base em dados históricos consolidados e taxas compostas de crescimento mensal de 12%, a previsão de MRR para o próximo mês é de R$ 34.500,00 reais. Estimando que 100% das assinaturas ativas se renovem de forma automática e deduzindo o churn médio projetado de 1.5%.";
        attachment = (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-xs mt-2 font-mono">
            <span className="block font-bold text-cyan-400">📊 PREVISÃO DE EXPANSÃO SAAS</span>
            <span>MRR Atual: R$ 30.500,00 | Projeção Julho: R$ 34.500,00 | Margem de Erro: ±3%</span>
          </div>
        );
      } else if (qLower.includes("estado") || qLower.includes("região") || qLower.includes("localidade")) {
        aiText = "O estado que lidera a geração de receita na plataforma NexoraField é São Paulo (SP), concentrando 65% de todo o faturamento da plataforma (R$ 22.400,00). Em segundo lugar está o Paraná (PR) com 18%, impulsionado pelo segmento de telecomunicações e operadoras de fibra regional.";
      } else if (qLower.includes("risco") || qLower.includes("cancelar") || qLower.includes("cancelamento") || qLower.includes("churn")) {
        aiText = "Identifiquei 1 empresa sob alto risco de cancelamento (Churn): a SolarSol Soluções S.A.. O fator principal é o silêncio de interações no chat nas últimas duas semanas combinado com a fatura atrasada. Recomendo intervenção comercial ativa via telefone ou oferta de plano temporariamente reduzido.";
      } else {
        aiText = "Compreendo a pergunta. Analisando as tabelas financeiras da NexoraField, verifico um ticket médio sólido de R$ 345,00 por empresa e uma retenção de receita líquida (NRR) de 105%. Gostaria de elaborar uma projeção detalhada para os próximos trimestres ou rascunhar um lembrete inteligente?";
      }

      setChatLog(prev => [...prev, { sender: 'ai', text: aiText, attachment: attachment }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHAT INTERACTIVE PANEL (7 COLS) */}
        <div className="lg:col-span-7 bg-[#0b0e1a] border border-[#1d2440] p-5 rounded-3xl flex flex-col h-[520px] justify-between">
          
          {/* Header */}
          <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Assistente Financeiro Nexora IA</h4>
                <p className="text-[10px] text-slate-400">IA Generativa integrada aos balanços e fluxos do SaaS.</p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded-lg">Online</span>
          </div>

          {/* Chat log messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
            {chatLog.map((chat, idx) => (
              <div key={idx} className={`flex gap-2.5 ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {chat.sender !== 'user' && (
                  <div className="h-7 w-7 rounded-full bg-indigo-950 border border-indigo-900/50 flex items-center justify-center text-indigo-400">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed ${chat.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-950 border border-slate-900 text-slate-300 rounded-tl-none'}`}>
                  <p>{chat.text}</p>
                  {chat.attachment}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="h-7 w-7 rounded-full bg-indigo-950 flex items-center justify-center text-indigo-400 animate-pulse">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 text-slate-400 rounded-tl-none font-mono text-[10px]">
                  IA analisando os balanços financeiros...
                </div>
              </div>
            )}
          </div>

          {/* Prompt chips and input */}
          <div className="space-y-3 pt-2 border-t border-slate-900">
            {/* Quick Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800">
              {quickQuestions.map((chip, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSendQuestion(chip.q)}
                  className="text-[9px] bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-indigo-400 font-mono font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors"
                >
                  {chip.q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Pergunte sobre receitas de SP, faturamento de Julho, inadimplência..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion(chatInput)}
                className="flex-1 bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-white"
              />
              <button 
                onClick={() => handleSendQuestion(chatInput)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

        {/* COBRANÇA INTELIGENTE CONSOLE (5 COLS) */}
        <div className="lg:col-span-5 bg-[#0b0e1a] border border-[#1d2440] p-5 rounded-3xl flex flex-col justify-between h-[520px]">
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
              Cobranças Inteligentes & Régua de Dunning
            </h4>
            <p className="text-[11px] text-slate-400">IA rastreia inadimplentes, prioriza pelo risco de cancelamento e sugere acordos de pagamento personalizados.</p>

            <div className="space-y-3 pt-2">
              {defaulters.map(def => (
                <div key={def.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-900 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-200 block">{def.companyName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Plano: {def.planName}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${def.riskLevel === 'Crítico' ? 'bg-rose-950 text-rose-400 border-rose-900/60' : 'bg-amber-950 text-amber-400 border-amber-900/60'}`}>
                      {def.riskLevel}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] font-mono border-t border-slate-900/60 pt-2 text-slate-400">
                    <span>Atraso: <span className="text-rose-400 font-bold">{def.daysLate} dias</span></span>
                    <span>Valor: <span className="text-white font-bold">R$ {def.dueAmount}</span></span>
                  </div>

                  <div className="flex justify-end gap-2 pt-1 text-[11px]">
                    <button 
                      onClick={() => setActiveDraftId(def.id)}
                      className="bg-slate-900 hover:bg-slate-800 text-indigo-400 font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Gerar Mensagem IA
                    </button>
                    <a 
                      href={`https://wa.me/55${def.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Acionar WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-900 text-[10px] text-slate-400 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <span>Notificações automáticas via WhatsApp/E-mail de lembrete de vencimento configuradas para 5, 2 e 1 dia antes.</span>
          </div>

        </div>

      </div>

      {/* DRAFT MODAL DISPLAY */}
      {activeDraftId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b0e1a] border border-[#1d2440] text-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h4 className="font-bold text-sm">Notificação Personalizada Recomendada pela IA</h4>
              <button 
                onClick={() => setActiveDraftId(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                Fechar
              </button>
            </div>

            <p className="text-xs text-slate-400">Texto formatado amigavelmente com dunning estratégico de cobrança nexora:</p>
            
            <textarea 
              className="w-full text-xs p-3.5 bg-slate-950 border border-slate-900 rounded-xl text-slate-200 font-mono leading-relaxed h-36 focus:outline-none focus:border-indigo-500"
              value={defaulters.find(d => d.id === activeDraftId)?.contactDraft}
              onChange={(e) => {
                const text = e.target.value;
                setDefaulters(prev => prev.map(d => d.id === activeDraftId ? { ...d, contactDraft: text } : d));
              }}
            />

            <div className="flex justify-end gap-2 text-xs font-bold pt-2 border-t border-slate-900">
              <button 
                onClick={() => setActiveDraftId(null)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  alert("Mensagem dunning inteligente enviada via régua de mensageria NexoraField!");
                  setActiveDraftId(null);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl cursor-pointer"
              >
                Enviar via Régua Automatizada
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
