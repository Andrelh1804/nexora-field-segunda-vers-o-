import React, { useState } from "react";
import {
  BookOpen, Play, CheckCircle, Award, Clock, Star, ChevronRight,
  Users, Shield, DollarSign, Briefcase, Bot, Lock, BarChart2,
  Zap, Trophy, Target, FileText, Video, HelpCircle, ArrowRight
} from "lucide-react";

const TRACKS: { role: string; icon: any; color: string; modules: { title: string; duration: string; type: string; done: boolean; locked: boolean }[] }[] = [
  {
    role: "Administrador",
    icon: Shield,
    color: "indigo",
    modules: [
      { title: "Visão Geral da Plataforma", duration: "12min", type: "video", done: true, locked: false },
      { title: "Configuração Inicial do Tenant", duration: "18min", type: "tutorial", done: true, locked: false },
      { title: "Gestão de Usuários e Permissões", duration: "22min", type: "video", done: false, locked: false },
      { title: "Dashboard Executivo e KPIs", duration: "15min", type: "video", done: false, locked: false },
      { title: "Integração com ERP e Webhooks", duration: "30min", type: "tutorial", done: false, locked: true },
      { title: "Segurança, LGPD e Auditoria", duration: "20min", type: "doc", done: false, locked: true },
      { title: "Quiz: Administração Avançada", duration: "10min", type: "quiz", done: false, locked: true },
    ],
  },
  {
    role: "Gestor de Operações",
    icon: BarChart2,
    color: "cyan",
    modules: [
      { title: "Ciclo de Vida do Chamado", duration: "14min", type: "video", done: true, locked: false },
      { title: "Despacho Manual e com IA", duration: "16min", type: "tutorial", done: false, locked: false },
      { title: "Gestão de Técnicos em Campo", duration: "18min", type: "video", done: false, locked: false },
      { title: "Relatórios de Campo com IA", duration: "12min", type: "video", done: false, locked: false },
      { title: "Detecção de Fraudes", duration: "10min", type: "doc", done: false, locked: true },
      { title: "Quiz: Operações Avançadas", duration: "10min", type: "quiz", done: false, locked: true },
    ],
  },
  {
    role: "Técnico de Campo",
    icon: Zap,
    color: "emerald",
    modules: [
      { title: "Usando o App do Técnico", duration: "8min", type: "video", done: true, locked: false },
      { title: "Aceitando e Gerenciando Chamados", duration: "10min", type: "tutorial", done: true, locked: false },
      { title: "Checklist e Execução em Campo", duration: "12min", type: "video", done: false, locked: false },
      { title: "Fotografias e Evidências", duration: "8min", type: "video", done: false, locked: false },
      { title: "Assinatura Digital e Laudo", duration: "10min", type: "tutorial", done: false, locked: false },
      { title: "Gamificação e Pontuação", duration: "6min", type: "video", done: false, locked: true },
      { title: "Quiz: Técnico Certificado", duration: "8min", type: "quiz", done: false, locked: true },
    ],
  },
  {
    role: "Financeiro",
    icon: DollarSign,
    color: "yellow",
    modules: [
      { title: "Split de Pagamento", duration: "10min", type: "video", done: false, locked: false },
      { title: "Dashboard Financeiro", duration: "14min", type: "tutorial", done: false, locked: false },
      { title: "Faturas e Notas Fiscais", duration: "12min", type: "video", done: false, locked: false },
      { title: "Comissões e Cashback", duration: "8min", type: "doc", done: false, locked: true },
      { title: "Quiz: Financeiro", duration: "8min", type: "quiz", done: false, locked: true },
    ],
  },
  {
    role: "Comercial",
    icon: Briefcase,
    color: "pink",
    modules: [
      { title: "Portal Comercial e Pipeline", duration: "12min", type: "video", done: false, locked: false },
      { title: "Geração e Gestão de Leads", duration: "16min", type: "tutorial", done: false, locked: false },
      { title: "Propostas com IA", duration: "10min", type: "video", done: false, locked: false },
      { title: "Programa de Indicação", duration: "8min", type: "video", done: false, locked: false },
      { title: "RevOps e Automações", duration: "20min", type: "doc", done: false, locked: true },
      { title: "Quiz: Comercial Certificado", duration: "10min", type: "quiz", done: false, locked: true },
    ],
  },
];

const TYPE_ICON: Record<string, any> = {
  video: Video,
  tutorial: FileText,
  doc: BookOpen,
  quiz: HelpCircle,
};

const TYPE_COLOR: Record<string, string> = {
  video: "text-red-400",
  tutorial: "text-blue-400",
  doc: "text-slate-400",
  quiz: "text-yellow-400",
};

export default function TrainingPlatform() {
  const [activeTrack, setActiveTrack] = useState(0);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const track = TRACKS[activeTrack];
  const doneCount = track.modules.filter(m => m.done).length;
  const progress = Math.round((doneCount / track.modules.length) * 100);
  const allDone = progress === 100;

  const handleAiQuestion = async () => {
    if (!aiQuestion.trim()) return;
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Pergunta sobre NexoraField (módulo ${track.role}): ${aiQuestion}`,
          role: "admin"
        })
      });
      const data = await res.json();
      setAiAnswer(data.response || "Consulte a documentação para mais detalhes sobre este tema.");
    } catch {
      setAiAnswer("Nossa plataforma oferece suporte completo via chat, e-mail e WhatsApp. Para dúvidas técnicas avançadas, abra um chamado de suporte pelo menu Ajuda.");
    }
    setLoadingAi(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Plataforma de Treinamento</h2>
          <p className="text-xs text-slate-500 mt-0.5">Trilhas de aprendizagem com IA · Certificados automatizados</p>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-400" />
          <span className="text-xs text-slate-400">2 certificados conquistados</span>
        </div>
      </div>

      {/* Track selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TRACKS.map((t, i) => {
          const Icon = t.icon;
          const done = t.modules.filter(m => m.done).length;
          const pct = Math.round((done / t.modules.length) * 100);
          return (
            <button key={i} onClick={() => setActiveTrack(i)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all whitespace-nowrap ${
                activeTrack === i
                  ? `bg-${t.color}-500/10 border-${t.color}-500/40 text-white`
                  : "bg-[#0b0e17] border-slate-800 text-slate-400 hover:border-slate-600"
              }`}>
              <Icon className={`h-4 w-4 text-${t.color}-400`} />
              <div className="text-left">
                <div className="text-xs font-semibold">{t.role}</div>
                <div className="text-[9px] text-slate-500">{pct}% completo</div>
              </div>
              {pct === 100 && <Trophy className="h-3.5 w-3.5 text-yellow-400" />}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Module List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Progress */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white">Trilha: {track.role}</span>
              <span className={`text-xs font-bold text-${track.color}-400`}>{progress}% completo</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div className={`h-full bg-${track.color}-500 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{doneCount} de {track.modules.length} módulos concluídos</span>
              <span>{track.modules.reduce((s, m) => s + parseInt(m.duration), 0)} min de conteúdo</span>
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-2">
            {track.modules.map((m, i) => {
              const TypeIcon = TYPE_ICON[m.type] || FileText;
              return (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  m.locked ? "border-slate-800/50 opacity-50 cursor-not-allowed" :
                  m.done ? "border-emerald-500/20 bg-emerald-500/5 cursor-pointer hover:border-emerald-500/40" :
                  "border-slate-800 hover:border-slate-600 cursor-pointer bg-[#0b0e17] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
                }`}>
                  {/* Step number / status */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${
                    m.locked ? "bg-slate-800 text-slate-600" :
                    m.done ? "bg-emerald-500/20 text-emerald-400" :
                    `bg-${track.color}-500/10 text-${track.color}-400`
                  }`}>
                    {m.locked ? <Lock className="h-4 w-4" /> : m.done ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${m.locked ? "text-slate-600" : m.done ? "text-slate-300" : "text-white"}`}>{m.title}</span>
                      {m.type === "quiz" && <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-mono uppercase">Quiz</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <TypeIcon className={`h-3 w-3 ${TYPE_COLOR[m.type]}`} />
                      <span className="text-[10px] text-slate-500">{m.type}</span>
                      <Clock className="h-3 w-3 text-slate-600" />
                      <span className="text-[10px] text-slate-500">{m.duration}</span>
                    </div>
                  </div>

                  {!m.locked && (
                    <button className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                      m.done ? "text-emerald-400 bg-emerald-500/10" : `text-${track.color}-400 bg-${track.color}-500/10 hover:bg-${track.color}-500/20`
                    }`}>
                      {m.done ? "Rever" : <><Play className="h-3 w-3" /> Iniciar</>}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Certificate */}
          {allDone && (
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center space-y-3">
              <Trophy className="h-10 w-10 text-yellow-400 mx-auto" />
              <h3 className="font-bold text-white">Parabéns! Trilha concluída!</h3>
              <p className="text-xs text-slate-400">Você completou todos os módulos da trilha de {track.role}.</p>
              <button onClick={() => setShowCertificate(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold text-sm hover:bg-yellow-500/30 transition-all">
                <Award className="h-4 w-4" /> Emitir Certificado
              </button>
            </div>
          )}
        </div>

        {/* Right panel: AI Tutor + Leaderboard */}
        <div className="space-y-4">
          {/* AI Tutor */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Tutor IA NexoraField</div>
                <div className="text-[9px] text-slate-500">Powered by Gemini AI</div>
              </div>
            </div>

            {aiAnswer && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-300 leading-relaxed">
                {aiAnswer}
              </div>
            )}

            <div className="flex gap-2">
              <input value={aiQuestion} onChange={e => setAiQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAiQuestion()}
                placeholder="Tire sua dúvida sobre a plataforma..."
                className="flex-1 bg-[#05070c] border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none transition-all" />
              <button onClick={handleAiQuestion} disabled={loadingAi}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-all">
                {loadingAi ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {["Como criar um chamado?", "Como o despacho IA funciona?", "Como configurar PIX?"].map(q => (
                <button key={q} onClick={() => { setAiQuestion(q); }}
                  className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Progress by role */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white">Progresso por Trilha</h3>
            {TRACKS.map((t, i) => {
              const done = t.modules.filter(m => m.done).length;
              const pct = Math.round((done / t.modules.length) * 100);
              const Icon = t.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <Icon className={`h-3.5 w-3.5 text-${t.color}-400 shrink-0`} />
                  <span className="text-[10px] text-slate-400 w-24 shrink-0">{t.role}</span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-${t.color}-500 rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">{pct}%</span>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 grid grid-cols-2 gap-3">
            {[
              { label: "Certificados", value: "2", icon: Award, color: "text-yellow-400" },
              { label: "Horas Aprendendo", value: "4.2h", icon: Clock, color: "text-cyan-400" },
              { label: "Quizzes Passados", value: "3/5", icon: Target, color: "text-emerald-400" },
              { label: "Módulos Concluídos", value: "6", icon: CheckCircle, color: "text-indigo-400" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-slate-900/60 rounded-xl p-3 text-center">
                  <Icon className={`h-4 w-4 ${s.color} mx-auto mb-1`} />
                  <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[9px] text-slate-500">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Certificate modal */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4" onClick={() => setShowCertificate(false)}>
          <div className="bg-gradient-to-br from-[#0b0e17] to-[#0d1020] border border-yellow-500/30 rounded-3xl p-12 max-w-lg w-full text-center space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <Trophy className="h-16 w-16 text-yellow-400 mx-auto" />
            <div className="text-[10px] font-mono text-yellow-400 tracking-widest uppercase">Certificado de Conclusão</div>
            <h2 className="text-2xl font-bold text-white font-display">Trilha {track.role}</h2>
            <p className="text-slate-400 text-sm">Este certificado atesta que o usuário concluiu com êxito todos os módulos da trilha de treinamento NexoraField.</p>
            <div className="text-xs text-slate-500 font-mono">{new Date().toLocaleDateString("pt-BR")} · NexoraField AI Platform</div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowCertificate(false)} className="px-5 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold text-sm hover:bg-yellow-500/30 transition-all">
                Baixar PDF
              </button>
              <button onClick={() => setShowCertificate(false)} className="px-5 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm transition-all hover:text-white">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
