import React, { useState, useEffect } from "react";
import {
  Building2, Users, MapPin, Settings, Zap, CheckCircle, ChevronRight,
  Sparkles, Loader2, Plus, X, Check, AlertCircle, ArrowRight, Bot,
  Play, SkipForward
} from "lucide-react";

interface OnboardingWizardProps {
  company: { name: string; segment: string; city: string; state: string };
  user: { name: string; email: string };
  plan: string;
  onComplete: () => void;
}

const STEP_CONFIG = [
  { n: 1, pct: 0, icon: Building2, title: "Perfil da Empresa", desc: "Configure os dados e identidade da sua operação" },
  { n: 2, pct: 25, icon: Users, title: "Departamentos & Equipe", desc: "Crie departamentos e convide seus colaboradores" },
  { n: 3, pct: 50, icon: MapPin, title: "Regiões de Atuação", desc: "Configure as áreas geográficas de cobertura" },
  { n: 4, pct: 75, icon: Settings, title: "Configurações & Integrações", desc: "Personalize notificações e integrações" },
  { n: 5, pct: 100, icon: Zap, title: "Ativação & Primeiro Chamado", desc: "Sua plataforma está pronta! Abra o primeiro chamado" },
];

const DEPT_PRESETS = ["Operações", "Técnico", "Comercial", "Financeiro", "Customer Success", "TI", "Qualidade"];
const REGION_PRESETS = ["Centro", "Zona Norte", "Zona Sul", "Zona Leste", "Zona Oeste", "Grande São Paulo", "Interior"];
const NOTIF_OPTIONS = [
  { key: "whatsapp", label: "WhatsApp (via Evolution API)" },
  { key: "email", label: "E-mail (Resend)" },
  { key: "push", label: "Push Notifications (App)" },
  { key: "webhook", label: "Webhooks em tempo real" },
];

export default function OnboardingWizard({ company, user, plan, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [aiHint, setAiHint] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  // Step 1 data
  const [companyDesc, setCompanyDesc] = useState("");
  const [techsCount, setTechsCount] = useState("5");
  const [ticketsPerMonth, setTicketsPerMonth] = useState("30");
  const [logoUrl, setLogoUrl] = useState("");

  // Step 2 data
  const [departments, setDepartments] = useState<string[]>(["Operações", "Técnico"]);
  const [inviteEmails, setInviteEmails] = useState<string[]>([""]);

  // Step 3 data
  const [regions, setRegions] = useState<{ name: string; radiusKm: number }[]>([{ name: company.city, radiusKm: 50 }]);

  // Step 4 data
  const [notifications, setNotifications] = useState<string[]>(["email", "push"]);
  const [commission, setCommission] = useState("15");
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [fraudDetection, setFraudDetection] = useState(true);

  // Step 5 data
  const [firstTicketTitle, setFirstTicketTitle] = useState("");
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { setAutoSaved(true); setTimeout(() => setAutoSaved(false), 2000); }, 1500);
    return () => clearTimeout(timer);
  }, [step, departments, regions, notifications]);

  const handleAiSuggest = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Sugira configurações ideais para uma empresa do segmento ${company.segment} localizada em ${company.city}/${company.state} com aproximadamente ${techsCount} técnicos e ${ticketsPerMonth} chamados por mês. Responda de forma curta e prática.`,
          role: "admin"
        })
      });
      const data = await res.json();
      setAiHint(data.response || "Configure seus departamentos de acordo com sua estrutura operacional.");
    } catch {
      setAiHint(`Para o segmento ${company.segment}, recomendamos os departamentos: Operações de Campo, Suporte Técnico e Qualidade. Configure regiões com raio de 30-50km para otimizar deslocamentos.`);
    }
    setLoadingAi(false);
  };

  const addDept = (name: string) => {
    if (!departments.includes(name)) setDepartments(prev => [...prev, name]);
  };
  const removeDept = (name: string) => setDepartments(prev => prev.filter(d => d !== name));

  const addRegion = () => setRegions(prev => [...prev, { name: "", radiusKm: 30 }]);
  const updateRegion = (i: number, field: "name" | "radiusKm", value: string | number) => {
    setRegions(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  };
  const removeRegion = (i: number) => setRegions(prev => prev.filter((_, idx) => idx !== i));

  const addEmail = () => setInviteEmails(prev => [...prev, ""]);
  const updateEmail = (i: number, v: string) => setInviteEmails(prev => prev.map((e, idx) => idx === i ? v : e));
  const removeEmail = (i: number) => setInviteEmails(prev => prev.filter((_, idx) => idx !== i));

  const handleLaunch = async () => {
    setLaunching(true);
    await new Promise(r => setTimeout(r, 3000));
    setLaunching(false);
    setLaunched(true);
    setTimeout(onComplete, 2500);
  };

  const currentStep = STEP_CONFIG[step - 1];
  const StepIcon = currentStep.icon;

  return (
    <div className="min-h-screen bg-[#030712] flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-2 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display text-white">Onboarding NexoraField</h1>
            <p className="text-xs text-slate-500">Bem-vindo, {user.name} · {company.name}</p>
          </div>
          {autoSaved && (
            <div className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
              <Check className="h-3 w-3" /> Salvo automaticamente
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Progresso do Onboarding</span>
            <span className="text-xs font-bold text-cyan-400">{currentStep.pct}% concluído</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${currentStep.pct}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            {STEP_CONFIG.map(s => (
              <div key={s.n} className="flex flex-col items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${step > s.n ? "bg-emerald-400" : step === s.n ? "bg-cyan-400" : "bg-slate-700"}`} />
                <span className={`text-[9px] font-mono ${step === s.n ? "text-cyan-400" : step > s.n ? "text-emerald-400" : "text-slate-600"}`}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Card */}
        <div className="bg-[#0b0e17] border border-slate-800 rounded-3xl overflow-hidden">

          {/* Step Header */}
          <div className="bg-gradient-to-r from-slate-900 to-[#0d1120] border-b border-slate-800 p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <StepIcon className="h-6 w-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-mono text-slate-500 mb-1">ETAPA {step} DE {STEP_CONFIG.length}</div>
              <h2 className="text-lg font-bold text-white font-display">{currentStep.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{currentStep.desc}</p>
            </div>
            {step < 5 && (
              <button onClick={handleAiSuggest} disabled={loadingAi}
                className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition-all shrink-0">
                {loadingAi ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bot className="h-3 w-3" />}
                IA Sugere
              </button>
            )}
          </div>

          {/* AI Hint */}
          {aiHint && (
            <div className="mx-6 mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex gap-3">
              <Bot className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-300 leading-relaxed">{aiHint}</p>
              <button onClick={() => setAiHint("")} className="text-indigo-500 hover:text-indigo-300 shrink-0"><X className="h-3.5 w-3.5" /></button>
            </div>
          )}

          {/* Step Content */}
          <div className="p-6 space-y-5">

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Nº de Técnicos Estimado</label>
                    <input type="number" value={techsCount} onChange={e => setTechsCount(e.target.value)} min={1}
                      className="w-full bg-[#05070c] border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Chamados/Mês Estimado</label>
                    <input type="number" value={ticketsPerMonth} onChange={e => setTicketsPerMonth(e.target.value)} min={1}
                      className="w-full bg-[#05070c] border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Descrição da Operação</label>
                  <textarea value={companyDesc} onChange={e => setCompanyDesc(e.target.value)} rows={3} placeholder={`Descreva como a ${company.name} opera seus serviços de campo...`}
                    className="w-full bg-[#05070c] border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none resize-none transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Logo URL (opcional)</label>
                  <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://suaempresa.com.br/logo.png"
                    className="w-full bg-[#05070c] border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none font-mono transition-all" />
                </div>
                {/* Summary card */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 grid grid-cols-3 gap-3 text-center">
                  <div><div className="font-bold text-cyan-400">{company.name.split(" ")[0]}</div><div className="text-[10px] text-slate-500">Empresa</div></div>
                  <div><div className="font-bold text-indigo-400">{company.segment}</div><div className="text-[10px] text-slate-500">Segmento</div></div>
                  <div><div className="font-bold text-emerald-400">{plan.charAt(0).toUpperCase() + plan.slice(1)}</div><div className="text-[10px] text-slate-500">Plano</div></div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2">Departamentos da Empresa</label>
                  {/* Current */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {departments.map(d => (
                      <span key={d} className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                        {d}
                        <button onClick={() => removeDept(d)} className="hover:text-white"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                  {/* Presets */}
                  <div className="flex flex-wrap gap-1.5">
                    {DEPT_PRESETS.filter(d => !departments.includes(d)).map(d => (
                      <button key={d} onClick={() => addDept(d)}
                        className="text-[10px] px-2.5 py-1 rounded-lg border border-slate-700 text-slate-500 hover:text-white hover:border-slate-500 transition-all flex items-center gap-1">
                        <Plus className="h-2.5 w-2.5" />{d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <label className="text-xs font-semibold text-slate-400 block mb-2">Convidar Colaboradores por E-mail</label>
                  <div className="space-y-2">
                    {inviteEmails.map((email, i) => (
                      <div key={i} className="flex gap-2">
                        <input value={email} onChange={e => updateEmail(i, e.target.value)} placeholder={`colaborador${i + 1}@${company.name.split(" ")[0].toLowerCase()}.com`} type="email"
                          className="flex-1 bg-[#05070c] border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 outline-none font-mono transition-all" />
                        <button onClick={() => removeEmail(i)} className="p-2 text-slate-600 hover:text-red-400 transition-all"><X className="h-4 w-4" /></button>
                      </div>
                    ))}
                    <button onClick={addEmail} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-all">
                      <Plus className="h-3.5 w-3.5" /> Adicionar e-mail
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-400">Regiões de Cobertura</label>
                  <button onClick={addRegion} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-all">
                    <Plus className="h-3.5 w-3.5" /> Adicionar região
                  </button>
                </div>
                <div className="space-y-3">
                  {regions.map((r, i) => (
                    <div key={i} className="flex gap-3 items-center p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                      <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                      <input value={r.name} onChange={e => updateRegion(i, "name", e.target.value)} placeholder="Nome da região/cidade"
                        className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none" />
                      <div className="flex items-center gap-2 shrink-0">
                        <input type="number" value={r.radiusKm} onChange={e => updateRegion(i, "radiusKm", +e.target.value)} min={5} max={500}
                          className="w-16 bg-[#05070c] border border-slate-800 rounded-lg px-2 py-1 text-xs text-white outline-none text-center" />
                        <span className="text-xs text-slate-500">km</span>
                      </div>
                      <button onClick={() => removeRegion(i)} className="text-slate-600 hover:text-red-400 transition-all"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {REGION_PRESETS.filter(r => !regions.find(rg => rg.name === r)).map(r => (
                    <button key={r} onClick={() => setRegions(prev => [...prev, { name: r, radiusKm: 30 }])}
                      className="text-[10px] px-2.5 py-1 rounded-lg border border-slate-700 text-slate-500 hover:text-white hover:border-slate-500 transition-all flex items-center gap-1">
                      <Plus className="h-2.5 w-2.5" />{r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-3">Canais de Notificação</label>
                  <div className="space-y-2">
                    {NOTIF_OPTIONS.map(o => (
                      <label key={o.key} className="flex items-center gap-3 p-3 bg-slate-900/40 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-all">
                        <input type="checkbox" checked={notifications.includes(o.key)} onChange={e => setNotifications(prev => e.target.checked ? [...prev, o.key] : prev.filter(n => n !== o.key))}
                          className="accent-cyan-500" />
                        <span className="text-xs text-slate-300">{o.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Comissão da Plataforma: <span className="text-cyan-400">{commission}%</span></label>
                    <input type="range" min={5} max={25} value={commission} onChange={e => setCommission(e.target.value)} className="w-full accent-cyan-500" />
                    <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>5%</span><span>25%</span></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${autoDispatch ? "border-emerald-500/40 bg-emerald-500/10" : "border-slate-800"}`}>
                      <input type="checkbox" checked={autoDispatch} onChange={e => setAutoDispatch(e.target.checked)} className="accent-emerald-500" />
                      <div>
                        <div className="text-xs font-semibold text-slate-300">Despacho Automático</div>
                        <div className="text-[10px] text-slate-500">IA aloca técnico automaticamente</div>
                      </div>
                    </label>
                    <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${fraudDetection ? "border-red-500/40 bg-red-500/10" : "border-slate-800"}`}>
                      <input type="checkbox" checked={fraudDetection} onChange={e => setFraudDetection(e.target.checked)} className="accent-red-500" />
                      <div>
                        <div className="text-xs font-semibold text-slate-300">Detecção de Fraudes</div>
                        <div className="text-[10px] text-slate-500">IA monitora evidências</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="space-y-5">
                {!launched ? (
                  <>
                    <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-3">
                      <div className="text-4xl">🚀</div>
                      <h3 className="text-lg font-bold text-white font-display">Sua plataforma está pronta!</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Todos os módulos foram configurados. IA de despacho ativa. Banco de dados inicializado com suas {regions.length} região(ões) e {departments.length} departamento(s).
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Departamentos", value: departments.length, color: "text-indigo-400" },
                        { label: "Regiões", value: regions.length, color: "text-emerald-400" },
                        { label: "Técnicos Esperados", value: techsCount, color: "text-cyan-400" },
                        { label: "Chamados/mês", value: ticketsPerMonth, color: "text-yellow-400" },
                      ].map((s, i) => (
                        <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                          <div className={`font-bold text-lg ${s.color}`}>{s.value}</div>
                          <div className="text-[10px] text-slate-500">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1.5">Título do Primeiro Chamado Teste (opcional)</label>
                      <input value={firstTicketTitle} onChange={e => setFirstTicketTitle(e.target.value)}
                        placeholder="Ex: Instalação de câmera CFTV — Cliente Teste"
                        className="w-full bg-[#05070c] border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all" />
                    </div>

                    <div className="flex gap-3">
                      <button onClick={handleLaunch} disabled={launching}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20">
                        {launching ? <><Loader2 className="h-4 w-4 animate-spin" /> Ativando Plataforma...</> : <><Zap className="h-4 w-4" /> Ativar Plataforma!</>}
                      </button>
                      <button onClick={onComplete} className="px-4 py-3.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-sm font-semibold transition-all">
                        <SkipForward className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
                      <CheckCircle className="h-10 w-10 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display">Plataforma Ativada!</h3>
                    <p className="text-sm text-slate-400">Redirecionando para o painel principal...</p>
                    <div className="flex justify-center gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          {step < 5 && (
            <div className="px-6 pb-6 flex justify-between items-center border-t border-slate-800 pt-4">
              <button onClick={() => step > 1 && setStep(s => s - 1)} disabled={step === 1}
                className="text-xs text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-all flex items-center gap-1">
                ← Anterior
              </button>
              <div className="text-[10px] font-mono text-slate-600">Etapa {step} de {STEP_CONFIG.length}</div>
              <button onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all">
                Próximo <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
