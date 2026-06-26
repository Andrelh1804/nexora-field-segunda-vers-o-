import React, { useState, useEffect, useCallback } from "react";
import {
  Users, UserPlus, KeyRound, Trash2, ShieldCheck, Shield,
  HardHat, Briefcase, RefreshCw, Eye, EyeOff, Search,
  CheckCircle2, AlertTriangle, XCircle, Loader2, Edit2, Lock
} from "lucide-react";

interface DbUser {
  id: string;
  email: string;
  role: string;
  name: string;
  tenantId: string;
  createdAt: string;
}

const ROLE_META: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  admin: {
    label: "Super Admin",
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
    color: "text-indigo-400",
    bg: "bg-indigo-900/30 border-indigo-700/40",
  },
  company: {
    label: "Empresa",
    icon: <Briefcase className="h-3.5 w-3.5" />,
    color: "text-emerald-400",
    bg: "bg-emerald-900/30 border-emerald-700/40",
  },
  tech: {
    label: "Técnico",
    icon: <HardHat className="h-3.5 w-3.5" />,
    color: "text-amber-400",
    bg: "bg-amber-900/30 border-amber-700/40",
  },
  comercial: {
    label: "Comercial",
    icon: <Shield className="h-3.5 w-3.5" />,
    color: "text-purple-400",
    bg: "bg-purple-900/30 border-purple-700/40",
  },
};

type Toast = { id: number; type: "success" | "error"; msg: string };

export default function UserManagementPanel() {
  const [users, setUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("company");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);

  // Edit modal
  const [editUser, setEditUser] = useState<DbUser | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  // Change password modal
  const [pwdUser, setPwdUser] = useState<DbUser | null>(null);
  const [newPwd, setNewPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);

  // Confirm delete
  const [deleteUser, setDeleteUser] = useState<DbUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const addToast = useCallback((type: "success" | "error", msg: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Falha ao buscar usuários.");
      const data = await res.json();
      setUsers(data);
    } catch (e: any) {
      addToast("error", e.message);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName || !newPassword) {
      addToast("error", "Preencha todos os campos obrigatórios.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: newPassword, name: newName, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar usuário.");
      addToast("success", `Usuário ${newName} criado com sucesso!`);
      setShowCreate(false);
      setNewEmail(""); setNewName(""); setNewPassword(""); setNewRole("company");
      fetchUsers();
    } catch (e: any) {
      addToast("error", e.message);
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setEditSaving(true);
    try {
      const res = await fetch(`/api/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, role: editRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao editar usuário.");
      addToast("success", `Usuário atualizado com sucesso!`);
      setEditUser(null);
      fetchUsers();
    } catch (e: any) {
      addToast("error", e.message);
    } finally {
      setEditSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwdUser || !newPwd) return;
    if (newPwd.length < 6) {
      addToast("error", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setPwdSaving(true);
    try {
      const res = await fetch(`/api/users/${pwdUser.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPwd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao alterar senha.");
      addToast("success", `Senha alterada com sucesso!`);
      setPwdUser(null);
      setNewPwd("");
    } catch (e: any) {
      addToast("error", e.message);
    } finally {
      setPwdSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/users/${deleteUser.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao remover usuário.");
      addToast("success", `Usuário ${deleteUser.name} removido.`);
      setDeleteUser(null);
      fetchUsers();
    } catch (e: any) {
      addToast("error", e.message);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 relative">
      {/* Toast notifications */}
      <div className="fixed top-6 right-6 z-50 space-y-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium pointer-events-auto transition-all ${t.type === "success" ? "bg-emerald-900/90 border-emerald-700/50 text-emerald-200" : "bg-red-900/90 border-red-700/50 text-red-200"}`}>
            {t.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
            {t.msg}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-400" /> Gestão de Usuários
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Crie, edite, altere senhas e revogue acessos à plataforma NexoraField.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchUsers}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-white transition-colors"
            title="Atualizar"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/20"
          >
            <UserPlus className="h-4 w-4" /> Novo Usuário
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(ROLE_META).map(([role, meta]) => (
          <div key={role} className={`flex items-center gap-3 p-3 rounded-xl border ${meta.bg}`}>
            <div className={`${meta.color}`}>{meta.icon}</div>
            <div>
              <p className="text-xs text-slate-400">{meta.label}</p>
              <p className={`text-lg font-bold ${meta.color}`}>{roleCounts[role] ?? 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail ou função..."
          className="w-full pl-9 pr-4 py-2.5 bg-[#0d111c] border border-slate-700/60 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
        />
      </div>

      {/* Users Table */}
      <div className="bg-[#0a0c14] border border-slate-800/60 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Carregando usuários...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-500">
            <Users className="h-8 w-8" />
            <p className="text-sm">Nenhum usuário encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Usuário</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">E-mail</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Função</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Criado em</th>
                  <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => {
                  const meta = ROLE_META[u.role] || ROLE_META.company;
                  return (
                    <tr key={u.id} className={`border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${meta.bg} ${meta.color}`}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-200">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 font-mono text-xs">{u.email}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${meta.bg} ${meta.color}`}>
                          {meta.icon} {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs">
                        {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setEditUser(u); setEditName(u.name); setEditRole(u.role); }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-900/20 transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => { setPwdUser(u); setNewPwd(""); setShowPwd(false); }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-900/20 transition-colors"
                            title="Alterar senha"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteUser(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                            title="Revogar acesso"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Total */}
      {!loading && (
        <p className="text-xs text-slate-500 text-right">
          {filtered.length} de {users.length} usuário{users.length !== 1 ? "s" : ""} exibido{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* ─── CREATE MODAL ─── */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)} title="Novo Usuário" icon={<UserPlus className="h-4 w-4 text-indigo-400" />}>
          <form onSubmit={handleCreate} className="space-y-4">
            <FormField label="Nome completo">
              <input
                value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="Ex: João Silva"
                className={inputCls}
                required
              />
            </FormField>
            <FormField label="E-mail corporativo">
              <input
                type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                placeholder="joao@empresa.com"
                className={inputCls}
                required
              />
            </FormField>
            <FormField label="Função / Perfil de acesso">
              <select value={newRole} onChange={e => setNewRole(e.target.value)} className={inputCls}>
                <option value="admin">Super Admin</option>
                <option value="company">Empresa</option>
                <option value="tech">Técnico</option>
                <option value="comercial">Comercial</option>
              </select>
            </FormField>
            <FormField label="Senha inicial">
              <div className="relative">
                <input
                  type={showNewPwd ? "text" : "password"}
                  value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className={inputCls + " pr-10"}
                  required minLength={6}
                />
                <button type="button" onClick={() => setShowNewPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showNewPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowCreate(false)} className={btnSecondary}>Cancelar</button>
              <button type="submit" disabled={creating} className={btnPrimary}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                {creating ? "Criando..." : "Criar Usuário"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ─── EDIT MODAL ─── */}
      {editUser && (
        <Modal onClose={() => setEditUser(null)} title="Editar Usuário" icon={<Edit2 className="h-4 w-4 text-indigo-400" />}>
          <p className="text-xs text-slate-500 mb-4 font-mono">{editUser.email}</p>
          <form onSubmit={handleEdit} className="space-y-4">
            <FormField label="Nome completo">
              <input
                value={editName} onChange={e => setEditName(e.target.value)}
                className={inputCls} required
              />
            </FormField>
            <FormField label="Função / Perfil de acesso">
              <select value={editRole} onChange={e => setEditRole(e.target.value)} className={inputCls}>
                <option value="admin">Super Admin</option>
                <option value="company">Empresa</option>
                <option value="tech">Técnico</option>
                <option value="comercial">Comercial</option>
              </select>
            </FormField>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditUser(null)} className={btnSecondary}>Cancelar</button>
              <button type="submit" disabled={editSaving} className={btnPrimary}>
                {editSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {editSaving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ─── CHANGE PASSWORD MODAL ─── */}
      {pwdUser && (
        <Modal onClose={() => setPwdUser(null)} title="Alterar Senha" icon={<KeyRound className="h-4 w-4 text-amber-400" />}>
          <p className="text-xs text-slate-400 mb-4">
            Alterando senha de <span className="font-semibold text-slate-200">{pwdUser.name}</span>
            <span className="ml-1 font-mono text-slate-500">({pwdUser.email})</span>
          </p>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <FormField label="Nova senha">
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={newPwd} onChange={e => setNewPwd(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className={inputCls + " pr-10"}
                  required minLength={6}
                />
                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>
            <div className="p-3 bg-amber-900/20 border border-amber-700/30 rounded-xl flex items-start gap-2 text-xs text-amber-300">
              <Lock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              A senha será hasheada com bcrypt (12 rounds) antes de armazenar no banco.
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setPwdUser(null)} className={btnSecondary}>Cancelar</button>
              <button type="submit" disabled={pwdSaving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors flex-1 justify-center">
                {pwdSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                {pwdSaving ? "Alterando..." : "Alterar Senha"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ─── DELETE CONFIRM ─── */}
      {deleteUser && (
        <Modal onClose={() => setDeleteUser(null)} title="Revogar Acesso" icon={<XCircle className="h-4 w-4 text-red-400" />}>
          <div className="space-y-4">
            <div className="p-4 bg-red-900/20 border border-red-700/30 rounded-xl">
              <p className="text-sm text-red-200 font-semibold mb-1">⚠️ Ação irreversível</p>
              <p className="text-xs text-slate-400">
                O usuário <span className="font-semibold text-white">{deleteUser.name}</span> (<span className="font-mono">{deleteUser.email}</span>) perderá acesso imediatamente. Esta operação é registrada no log de auditoria.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteUser(null)} className={btnSecondary}>Cancelar</button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-semibold transition-colors flex-1 justify-center"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {deleting ? "Revogando..." : "Revogar Acesso"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Shared sub-components ───

function Modal({ children, onClose, title, icon }: { children: React.ReactNode; onClose: () => void; title: string; icon: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0d111c] border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            {icon}
            <span>{title}</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 bg-[#0a0c14] border border-slate-700/60 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors";
const btnPrimary = "flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors flex-1 justify-center disabled:opacity-60";
const btnSecondary = "px-4 py-2 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-sm font-semibold transition-colors";
