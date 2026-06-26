import React, { useState } from "react";
import { ShieldCheck, Building2, HardHat, Briefcase, Lock, Mail, Eye, EyeOff, Loader2, Key, Info, CheckCircle2 } from "lucide-react";

interface EnterpriseAuthModalProps {
  role: 'admin' | 'company' | 'tech' | 'comercial';
  onLoginSuccess: (token: string, user: { email: string; name: string; role: string; tenantId: string }) => void;
  onCancel?: () => void;
}

export default function EnterpriseAuthModal({ role, onLoginSuccess, onCancel }: EnterpriseAuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const roleMeta = {
    admin: {
      title: "Super Administrador",
      icon: ShieldCheck,
      colorClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      btnClass: "bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500",
      defaultEmail: "admin@nexorafield.com",
      defaultPass: "admin123",
      desc: "Acesso irrestrito a configurações globais, auditorias em tempo real, painel financeiro estruturado e gestão de tenants."
    },
    company: {
      title: "Portal da Empresa (SolarSol)",
      icon: Building2,
      colorClass: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      btnClass: "bg-cyan-600 hover:bg-cyan-500 focus:ring-cyan-500",
      defaultEmail: "operacoes@solarsol.com.br",
      defaultPass: "solarsol123",
      desc: "Gestão operacional de ordens de serviço, aprovação de chamados, controle orçamentário e parametrização de técnicos parceiros."
    },
    tech: {
      title: "Portal do Técnico Credenciado",
      icon: HardHat,
      colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      btnClass: "bg-emerald-600 hover:bg-emerald-500 focus:ring-emerald-500",
      defaultEmail: "alexandre.tech@gmail.com",
      defaultPass: "tech123",
      desc: "Visualização de rotas ativas (geolocalização), preenchimento de checklists de campo, assinatura digital e upload de relatórios."
    },
    comercial: {
      title: "Portal Comercial & Growth",
      icon: Briefcase,
      colorClass: "text-pink-400 bg-pink-500/10 border-pink-500/20",
      btnClass: "bg-pink-600 hover:bg-pink-500 focus:ring-pink-500",
      defaultEmail: "mariana.fibra@outlook.com",
      defaultPass: "comercial123",
      desc: "Enriquecimento automatizado de leads locais, rastreamento de links de indicação (growth loops) e monitoramento de conversão de funil."
    }
  };

  const currentMeta = roleMeta[role];
  const RoleIcon = currentMeta.icon;

  const handlePreFill = () => {
    setEmail(currentMeta.defaultEmail);
    setPassword(currentMeta.defaultPass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, role })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao realizar autenticação.");
      }

      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess(data.token, data.user);
      }, 800);

    } catch (err: any) {
      setError(err.message || "Falha na comunicação com o servidor de autenticação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020306]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b0e17] border border-slate-800/80 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative my-8">
        
        {/* Glow decorative effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-sm" />

        {/* Content Container */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl border ${currentMeta.colorClass}`}>
              <RoleIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase tracking-widest block">
                NEXORA SECURE GATEWAY
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Autenticação JWT — {currentMeta.title}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed bg-[#05070c] p-3 rounded-xl border border-slate-900/60 font-sans">
            {currentMeta.desc}
          </p>

          {/* Preset trigger for fast testing */}
          <div className="bg-slate-950/80 border border-slate-900 p-3.5 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-yellow-500" /> Credenciais Enterprise Homologadas
              </span>
              <button
                type="button"
                onClick={handlePreFill}
                className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 font-mono underline cursor-pointer"
                id="btn-prefill-credentials"
              >
                Auto-preencher
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="text-slate-500 bg-[#07090f] p-1.5 rounded border border-slate-900 overflow-x-auto">
                <span className="text-slate-600 block">E-MAIL</span>
                <span className="text-slate-300 font-semibold">{currentMeta.defaultEmail}</span>
              </div>
              <div className="text-slate-500 bg-[#07090f] p-1.5 rounded border border-slate-900">
                <span className="text-slate-600 block">SENHA</span>
                <span className="text-slate-300 font-semibold">{currentMeta.defaultPass}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="auth-email" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" /> E-mail Corporativo
              </label>
              <div className="relative">
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@nexorafield.com"
                  required
                  disabled={loading || success}
                  className="w-full bg-[#05070c] border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="auth-password" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-400" /> Senha de Acesso
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading || success}
                  className="w-full bg-[#05070c] border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono transition-all outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  title={showPassword ? "Ocultar senha" : "Exibir senha"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="bg-red-950/40 border border-red-900/60 p-3 rounded-xl text-red-400 text-xs font-medium leading-relaxed font-mono">
                ⚠ {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-xl text-emerald-400 text-xs font-medium flex items-center gap-2 font-mono">
                <CheckCircle2 className="h-4 w-4 animate-bounce" />
                Token assinado com sucesso! Redirecionando...
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading || success}
                  className="flex-1 bg-[#0d111c] border border-slate-800 hover:border-slate-700 text-slate-300 py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer"
                  id="btn-cancel-auth"
                >
                  Voltar
                </button>
              )}
              <button
                type="submit"
                disabled={loading || success}
                className={`flex-1 text-white py-2.5 px-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  success ? "bg-emerald-600" : currentMeta.btnClass
                }`}
                id="btn-submit-auth"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Autenticar via JWT"
                )}
              </button>
            </div>

          </form>

          {/* Compliance message footer */}
          <div className="border-t border-slate-900/80 pt-4 flex gap-2.5 text-[10px] text-slate-500 leading-normal font-sans">
            <Info className="h-4 w-4 text-slate-600 shrink-0" />
            <span>
              <strong>LGPD & Zero-Trust Compliance:</strong> Este portal emprega tokens cryptographically assinalados (HMAC-SHA256) com tempo de expiração de 2 horas. Dados pessoais sensíveis são mascarados e logs auditáveis são gerados em tempo de execução.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
