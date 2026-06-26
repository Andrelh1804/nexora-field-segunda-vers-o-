import React from "react";
import { ShieldCheck, Building2, HardHat, Sparkles, Briefcase, Lock, Unlock, LogOut } from "lucide-react";

interface RoleSwitcherProps {
  currentRole: 'admin' | 'company' | 'tech' | 'comercial';
  onChangeRole: (role: 'admin' | 'company' | 'tech' | 'comercial') => void;
  onlineCount: number;
  tokens: Record<string, string>;
  authenticatedUsers: Record<string, { email: string; name: string; role: string; tenantId: string }>;
  onLogout: (role: 'admin' | 'company' | 'tech' | 'comercial') => void;
}

export default function RoleSwitcher({ 
  currentRole, 
  onChangeRole, 
  onlineCount, 
  tokens, 
  authenticatedUsers, 
  onLogout 
}: RoleSwitcherProps) {
  const currentUser = authenticatedUsers[currentRole];
  const hasToken = !!tokens[currentRole];

  return (
    <div className="bg-[#080a10]/95 backdrop-blur-md border-b border-slate-800/60 py-3.5 px-6 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/10">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              NexoraField
            </h1>
            <p className="text-[10px] font-mono text-cyan-400 tracking-wider">
              AI-POWERED FIELD SERVICE MANAGEMENT
            </p>
          </div>
        </div>

        {/* Portals Toggle & Session Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-[#0e111a] p-1 rounded-xl border border-slate-800/80 gap-1 flex-wrap">
            <button
              onClick={() => onChangeRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Admin</span>
              {tokens['admin'] ? (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="JWT Autenticado"></span>
              ) : (
                <Lock className="h-2.5 w-2.5 text-slate-500" />
              )}
            </button>
            <button
              onClick={() => onChangeRole('company')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                currentRole === 'company'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              <span>Empresa</span>
              {tokens['company'] ? (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="JWT Autenticado"></span>
              ) : (
                <Lock className="h-2.5 w-2.5 text-slate-500" />
              )}
            </button>
            <button
              onClick={() => onChangeRole('tech')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                currentRole === 'tech'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <HardHat className="h-4 w-4 shrink-0" />
              <span>Técnico</span>
              {tokens['tech'] ? (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="JWT Autenticado"></span>
              ) : (
                <Lock className="h-2.5 w-2.5 text-slate-500" />
              )}
            </button>
            <button
              onClick={() => onChangeRole('comercial')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                currentRole === 'comercial'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Briefcase className="h-4 w-4 shrink-0" />
              <span>Comercial</span>
              {tokens['comercial'] ? (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="JWT Autenticado"></span>
              ) : (
                <Lock className="h-2.5 w-2.5 text-slate-500" />
              )}
            </button>
          </div>

          {/* Active Logged In User context */}
          {hasToken && currentUser && (
            <div className="flex items-center gap-2 bg-[#0e111a]/60 px-3 py-1.5 rounded-xl border border-slate-900 text-xs text-slate-400 font-mono">
              <Unlock className="h-3.5 w-3.5 text-emerald-400" />
              <span>
                Sessão JWT: <strong className="text-slate-200">{currentUser.name}</strong>
              </span>
              <button
                onClick={() => onLogout(currentRole)}
                className="ml-1.5 p-1 text-slate-500 hover:text-rose-400 rounded-md hover:bg-slate-950 transition-all cursor-pointer flex items-center justify-center"
                title="Desconectar do Portal"
                id="btn-logout-portal"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Live status */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-mono text-slate-400">
            <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping inline-block"></span>
            <span className="font-semibold text-emerald-400">LIVE SERVER</span>
          </span>
          <div className="h-4 w-px bg-slate-800"></div>
          <span className="text-slate-400 font-mono">
            Técnicos Online: <strong className="text-slate-200">{onlineCount}</strong>
          </span>
        </div>

      </div>
    </div>
  );
}
