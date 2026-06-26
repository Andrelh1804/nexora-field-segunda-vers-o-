import React, { useState } from "react";
import {
  Building2, User, CreditCard, CheckCircle, ArrowRight, ArrowLeft,
  Sparkles, Lock, Mail, Phone, MapPin, Eye, EyeOff, Loader2,
  Shield, Zap, Star, AlertCircle, ChevronDown
} from "lucide-react";

interface SelfServiceRegisterProps {
  onSuccess: (data: { company: any; user: any; plan: string }) => void;
  onBack: () => void;
}

const PLANS_SIMPLE = [
  { id: "starter", name: "Starter", price: 297, color: "border-slate-600", badge: "", trial: 14, features: ["50 chamados/mês", "10 técnicos", "IA básica"] },
  { id: "business", name: "Business", price: 697, color: "border-cyan-500", badge: "Mais Popular", trial: 14, features: ["300 chamados/mês", "50 técnicos", "IA avançada", "API + Webhooks"] },
  { id: "enterprise", name: "Enterprise", price: 1497, color: "border-indigo-500", badge: "", trial: 14, features: ["Ilimitado", "Multi-tenant", "Todas as IAs", "Gerente de conta"] },
];

const STATES = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"];
const SEGMENTS = ["Telecom & ISP","Segurança Eletrônica","Energia Solar","Elétrica & Facilities","Redes & TI","Climatização HVAC","Automação Industrial","Outros"];

export default function SelfServiceRegister({ onSuccess, onBack }: SelfServiceRegisterProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Step 1: Company
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [segment, setSegment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("SP");
  const [phone, setPhone] = useState("");

  // Step 2: Admin User
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptLgpd, setAcceptLgpd] = useState(false);

  // Step 3: Plan
  const [selectedPlan, setSelectedPlan] = useState("business");

  // Step 4: Payment
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | "boleto">("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const formatCnpj = (v: string) => {
    const n = v.replace(/\D/g, "").slice(0, 14);
    return n.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  const formatPhone = (v: string) => {
    const n = v.replace(/\D/g, "").slice(0, 11);
    if (n.length <= 10) return n.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    return n.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!companyName.trim()) e.companyName = "Nome da empresa obrigatório";
      if (cnpj.replace(/\D/g, "").length < 14) e.cnpj = "CNPJ inválido";
      if (!segment) e.segment = "Selecione o segmento";
      if (!city.trim()) e.city = "Cidade obrigatória";
    }
    if (s === 2) {
      if (!adminName.trim()) e.adminName = "Nome obrigatório";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) e.adminEmail = "E-mail inválido";
      if (adminPassword.length < 8) e.adminPassword = "Senha mínima de 8 caracteres";
      if (adminPassword !== confirmPassword) e.confirmPassword = "Senhas não coincidem";
      if (!acceptTerms) e.terms = "Aceite os Termos de Uso";
      if (!acceptLgpd) e.lgpd = "Aceite a Política de Privacidade (LGPD)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "NEXORA30") {
      setCouponApplied(true);
    } else {
      setErrors({ coupon: "Cupom inválido ou expirado" });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2200));
    setLoading(false);
    setStep(5);
    setTimeout(() => {
      onSuccess({
        company: { name: companyName, cnpj, segment, city, state, phone },
        user: { name: adminName, email: adminEmail, role: "admin" },
        plan: selectedPlan,
      });
    }, 2000);
  };

  const plan = PLANS_SIMPLE.find(p => p.id === selectedPlan)!;
  const discount = couponApplied ? 0.3 : 0;
  const finalPrice = Math.round(plan.price * (1 - discount));

  const STEPS = [
    { n: 1, label: "Empresa", icon: Building2 },
    { n: 2, label: "Usuário", icon: User },
    { n: 3, label: "Plano", icon: Star },
    { n: 4, label: "Pagamento", icon: CreditCard },
    { n: 5, label: "Pronto!", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao site
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-1.5 rounded-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white font-display">NexoraField</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.n;
            const active = step === s.n;
            return (
              <React.Fragment key={s.n}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                    done ? "bg-emerald-500 border-emerald-500" : active ? "bg-cyan-600 border-cyan-500 shadow-lg shadow-cyan-500/30" : "bg-slate-900 border-slate-700"
                  }`}>
                    {done ? <CheckCircle className="h-4 w-4 text-white" /> : <Icon className={`h-4 w-4 ${active ? "text-white" : "text-slate-600"}`} />}
                  </div>
                  <span className={`text-[9px] font-mono uppercase tracking-wide ${active ? "text-cyan-400" : done ? "text-emerald-400" : "text-slate-600"}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${done ? "bg-emerald-500" : "bg-slate-800"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl bg-[#0b0e17] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

        {/* STEP 1: Company */}
        {step === 1 && (
          <div className="p-8 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Dados da Empresa</h2>
              <p className="text-xs text-slate-500 mt-1">Informações do seu CNPJ e operação</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Razão Social / Nome da Empresa *</label>
                <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex: Telefônica Brasil Ltda"
                  className={`w-full bg-[#05070c] border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all ${errors.companyName ? "border-red-500" : "border-slate-800 focus:border-cyan-500"}`} />
                {errors.companyName && <p className="text-red-400 text-[10px] mt-1">{errors.companyName}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">CNPJ *</label>
                <input value={cnpj} onChange={e => setCnpj(formatCnpj(e.target.value))} placeholder="00.000.000/0001-00"
                  className={`w-full bg-[#05070c] border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none font-mono transition-all ${errors.cnpj ? "border-red-500" : "border-slate-800 focus:border-cyan-500"}`} />
                {errors.cnpj && <p className="text-red-400 text-[10px] mt-1">{errors.cnpj}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Telefone *</label>
                <input value={phone} onChange={e => setPhone(formatPhone(e.target.value))} placeholder="(11) 99999-9999"
                  className="w-full bg-[#05070c] border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none font-mono transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Segmento *</label>
                <div className="relative">
                  <select value={segment} onChange={e => setSegment(e.target.value)}
                    className={`w-full bg-[#05070c] border rounded-xl px-3.5 py-2.5 text-sm text-white outline-none appearance-none transition-all ${errors.segment ? "border-red-500" : "border-slate-800 focus:border-cyan-500"}`}>
                    <option value="">Selecionar...</option>
                    {SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
                {errors.segment && <p className="text-red-400 text-[10px] mt-1">{errors.segment}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Cidade *</label>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="São Paulo"
                  className={`w-full bg-[#05070c] border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all ${errors.city ? "border-red-500" : "border-slate-800 focus:border-cyan-500"}`} />
                {errors.city && <p className="text-red-400 text-[10px] mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Estado *</label>
                <div className="relative">
                  <select value={state} onChange={e => setState(e.target.value)}
                    className="w-full bg-[#05070c] border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none appearance-none transition-all">
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Admin User */}
        {step === 2 && (
          <div className="p-8 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Cadastro do Administrador</h2>
              <p className="text-xs text-slate-500 mt-1">Crie o acesso principal da sua conta</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Nome completo *</label>
                <input value={adminName} onChange={e => setAdminName(e.target.value)} placeholder="Seu nome completo"
                  className={`w-full bg-[#05070c] border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all ${errors.adminName ? "border-red-500" : "border-slate-800 focus:border-cyan-500"}`} />
                {errors.adminName && <p className="text-red-400 text-[10px] mt-1">{errors.adminName}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">E-mail corporativo *</label>
                <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="admin@suaempresa.com.br"
                  className={`w-full bg-[#05070c] border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none font-mono transition-all ${errors.adminEmail ? "border-red-500" : "border-slate-800 focus:border-cyan-500"}`} />
                {errors.adminEmail && <p className="text-red-400 text-[10px] mt-1">{errors.adminEmail}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Senha *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Mínimo 8 caracteres"
                    className={`w-full bg-[#05070c] border rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-600 outline-none transition-all ${errors.adminPassword ? "border-red-500" : "border-slate-800 focus:border-cyan-500"}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.adminPassword && <p className="text-red-400 text-[10px] mt-1">{errors.adminPassword}</p>}
                {/* Password strength */}
                <div className="flex gap-1 mt-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                      adminPassword.length > i * 3 ? 
                        (adminPassword.length < 6 ? "bg-red-500" : adminPassword.length < 10 ? "bg-yellow-500" : "bg-emerald-500") 
                        : "bg-slate-800"
                    }`} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Confirmar senha *</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repita a senha"
                  className={`w-full bg-[#05070c] border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all ${errors.confirmPassword ? "border-red-500" : "border-slate-800 focus:border-cyan-500"}`} />
                {errors.confirmPassword && <p className="text-red-400 text-[10px] mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} className="mt-0.5 accent-cyan-500" />
                <span className="text-xs text-slate-400">Li e aceito os <a href="#" className="text-cyan-400 hover:underline">Termos de Uso</a> e o <a href="#" className="text-cyan-400 hover:underline">Contrato de Licença de Software</a></span>
              </label>
              {errors.terms && <p className="text-red-400 text-[10px]">{errors.terms}</p>}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={acceptLgpd} onChange={e => setAcceptLgpd(e.target.checked)} className="mt-0.5 accent-cyan-500" />
                <span className="text-xs text-slate-400">Consinto com o tratamento dos meus dados pessoais conforme a <a href="#" className="text-cyan-400 hover:underline">Política de Privacidade (LGPD)</a></span>
              </label>
              {errors.lgpd && <p className="text-red-400 text-[10px]">{errors.lgpd}</p>}
            </div>
          </div>
        )}

        {/* STEP 3: Plan */}
        {step === 3 && (
          <div className="p-8 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Escolha seu Plano</h2>
              <p className="text-xs text-slate-500 mt-1">14 dias de trial gratuito em todos os planos</p>
            </div>
            <div className="space-y-3">
              {PLANS_SIMPLE.map(p => (
                <label key={p.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === p.id ? `${p.color} bg-slate-900/50` : "border-slate-800 hover:border-slate-700"}`}
                  onClick={() => setSelectedPlan(p.id)}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPlan === p.id ? "border-cyan-500 bg-cyan-500" : "border-slate-600"}`}>
                    {selectedPlan === p.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{p.name}</span>
                      {p.badge && <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-mono">{p.badge}</span>}
                    </div>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {p.features.map(f => (
                        <span key={f} className="text-[10px] text-slate-500">• {f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-white">R$ {p.price.toLocaleString("pt-BR")}</div>
                    <div className="text-[10px] text-slate-500">/mês</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Coupon */}
            <div className="border-t border-slate-800 pt-4">
              <label className="text-xs font-semibold text-slate-400 block mb-2">Cupom de desconto</label>
              <div className="flex gap-2">
                <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Ex: NEXORA30"
                  className="flex-1 bg-[#05070c] border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none font-mono transition-all" />
                <button onClick={handleApplyCoupon} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-semibold transition-all">
                  Aplicar
                </button>
              </div>
              {couponApplied && <p className="text-emerald-400 text-[10px] mt-1">✓ Cupom NEXORA30 aplicado — 30% de desconto!</p>}
              {errors.coupon && <p className="text-red-400 text-[10px] mt-1">{errors.coupon}</p>}
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Plano {plan.name}</span>
                <span>R$ {plan.price.toLocaleString("pt-BR")}/mês</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-xs text-emerald-400 mb-2">
                  <span>Desconto (30%)</span>
                  <span>- R$ {Math.round(plan.price * 0.3).toLocaleString("pt-BR")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white border-t border-slate-800 pt-2 mt-2">
                <span>Total (após trial de {plan.trial} dias)</span>
                <span>R$ {finalPrice.toLocaleString("pt-BR")}/mês</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Payment */}
        {step === 4 && (
          <div className="p-8 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Método de Pagamento</h2>
              <p className="text-xs text-slate-500 mt-1">Você só será cobrado após os {plan.trial} dias de trial</p>
            </div>

            <div className="flex gap-2">
              {[
                { id: "pix", label: "PIX", icon: "💲" },
                { id: "card", label: "Cartão", icon: "💳" },
                { id: "boleto", label: "Boleto", icon: "🔖" },
              ].map(m => (
                <button key={m.id} onClick={() => setPaymentMethod(m.id as any)}
                  className={`flex-1 py-3 rounded-xl border text-xs font-semibold transition-all ${paymentMethod === m.id ? "border-cyan-500 bg-cyan-500/10 text-white" : "border-slate-800 text-slate-400 hover:border-slate-600"}`}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {paymentMethod === "pix" && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-3">
                <div className="text-4xl">💲</div>
                <p className="text-sm font-bold text-emerald-400">PIX — Aprovação em segundos</p>
                <p className="text-xs text-slate-400">Após confirmar, você receberá um QR Code para pagamento. Aprovação automática em tempo real.</p>
                <div className="bg-[#0b0e17] rounded-xl p-3 font-mono text-xs text-slate-500 border border-slate-800">
                  O QR Code será gerado após a confirmação do cadastro
                </div>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Número do Cartão</label>
                  <input value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})/g, "$1 ").trim())} placeholder="0000 0000 0000 0000"
                    className="w-full bg-[#05070c] border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none font-mono transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Nome no Cartão</label>
                  <input value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} placeholder="NOME SOBRENOME"
                    className="w-full bg-[#05070c] border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none font-mono transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Validade</label>
                    <input value={cardExpiry} onChange={e => setCardExpiry(e.target.value.replace(/\D/g, "").replace(/(\d{2})(\d{2})/, "$1/$2").slice(0, 5))} placeholder="MM/AA"
                      className="w-full bg-[#05070c] border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none font-mono transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">CVV</label>
                    <input type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="•••"
                      className="w-full bg-[#05070c] border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none font-mono transition-all" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Dados criptografados com TLS 1.3 · PCI-DSS Compliant</span>
                </div>
              </div>
            )}

            {paymentMethod === "boleto" && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center space-y-3">
                <div className="text-4xl">🔖</div>
                <p className="text-sm font-bold text-yellow-400">Boleto Bancário — Vencimento em 3 dias úteis</p>
                <p className="text-xs text-slate-400">O boleto será gerado automaticamente e enviado para {adminEmail || "seu e-mail"}. Compensação em até 3 dias úteis.</p>
              </div>
            )}

            {/* Summary */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Empresa:</span>
                <span className="text-slate-300 font-semibold">{companyName}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Plano:</span>
                <span className="text-slate-300 font-semibold">{plan.name}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
                <span className="font-bold">Total após trial:</span>
                <span className="text-white font-bold">R$ {finalPrice.toLocaleString("pt-BR")}/mês</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Success */}
        {step === 5 && (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
              {loading ? <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" /> : <CheckCircle className="h-10 w-10 text-emerald-400" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-display mb-2">{loading ? "Configurando sua conta..." : "Conta criada com sucesso!"}</h2>
              <p className="text-sm text-slate-400">{loading ? "Aguarde enquanto configuramos sua conta e banco de dados..." : `Bem-vindo à NexoraField, ${adminName}! Seu trial de ${plan.trial} dias começou agora.`}</p>
            </div>
            {!loading && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Trial gratuito", value: `${plan.trial} dias` },
                  { label: "Plano", value: plan.name },
                  { label: "Status", value: "Ativo" },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                    <div className="font-bold text-sm text-emerald-400">{s.value}</div>
                    <div className="text-[10px] text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-slate-500">Redirecionando para o onboarding...</p>
          </div>
        )}

        {/* Footer buttons */}
        {step < 5 && (
          <div className="px-8 pb-8 flex gap-3">
            {step > 1 && (
              <button onClick={back} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-semibold transition-all">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
            )}
            <button
              onClick={step === 4 ? handleSubmit : next}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-cyan-500/20">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {step === 4 ? "Confirmar e Criar Conta" : "Continuar"}
              {step < 4 && !loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-700 mt-4 text-center">
        🔒 Seus dados são protegidos conforme a LGPD · Criptografia TLS 1.3 · ISO 27001
      </p>
    </div>
  );
}
