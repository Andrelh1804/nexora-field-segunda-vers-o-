import React, { useState, useEffect, useCallback } from "react";
import {
  Webhook, Plus, Trash2, RefreshCw, Play, CheckCircle2,
  Clock, ChevronDown, ChevronUp, Copy, ToggleLeft,
  ToggleRight, Loader2, AlertTriangle, Activity, Shield, Zap,
  Globe, ListChecks, History
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────
interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  enabled: boolean;
  lastStatus: string | null;
  lastStatusCode: number | null;
  lastDeliveredAt: string | null;
  lastError: string | null;
  deliveryCount: number;
  createdAt: string;
}

interface Delivery {
  id: string;
  webhookId: string;
  event: string;
  statusCode: number | null;
  status: "success" | "error";
  responseBody: string | null;
  error: string | null;
  duration: number | null;
  deliveredAt: string;
}

// ─── Constants ───────────────────────────────────────────────
const ALL_EVENTS = [
  { id: "ticket.created",       label: "Chamado criado",          color: "text-blue-400",   icon: "📋" },
  { id: "ticket.assigned",      label: "Técnico alocado",         color: "text-indigo-400", icon: "👷" },
  { id: "ticket.status_changed",label: "Status atualizado",       color: "text-purple-400", icon: "🔄" },
  { id: "ticket.completed",     label: "Chamado finalizado",      color: "text-emerald-400",icon: "✅" },
  { id: "payment.completed",    label: "Pagamento concluído",     color: "text-green-400",  icon: "💰" },
  { id: "payment.created",      label: "Pagamento gerado",        color: "text-lime-400",   icon: "🧾" },
  { id: "technician.approved",  label: "Técnico aprovado",        color: "text-amber-400",  icon: "🔖" },
  { id: "company.registered",   label: "Empresa cadastrada",      color: "text-cyan-400",   icon: "🏢" },
  { id: "user.created",         label: "Usuário criado",          color: "text-rose-400",   icon: "👤" },
  { id: "test.ping",            label: "Teste de conexão",        color: "text-slate-400",  icon: "🏓" },
];

const STATUS_META: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  success: { label: "Sucesso", cls: "text-emerald-400 bg-emerald-900/30 border-emerald-700/40", icon: <CheckCircle2 className="h-3 w-3" /> },
  error:   { label: "Erro",    cls: "text-red-400 bg-red-900/30 border-red-700/40",             icon: <XCircle className="h-3 w-3" /> },
  pending: { label: "Pendente",cls: "text-amber-400 bg-amber-900/30 border-amber-700/40",       icon: <Clock className="h-3 w-3" /> },
};

type Toast = { id: number; type: "success" | "error"; msg: string };

// ─── Main Component ──────────────────────────────────────────
export default function WebhookPanel() {
  const [hooks, setHooks] = useState<WebhookConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", events: [] as string[], enabled: true });

  // Detail panel
  const [selected, setSelected] = useState<WebhookConfig | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loadingDel, setLoadingDel] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  // Edit inline
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", url: "", events: [] as string[], enabled: true });

  const addToast = useCallback((type: "success" | "error", msg: string) => {
    const id = Date.now();
    setToasts(p => [...p, { id, type, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4500);
  }, []);

  const fetchHooks = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/webhooks");
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setHooks(data);
    } catch (e: any) { addToast("error", e.message); }
    finally { setLoading(false); }
  }, [addToast]);

  useEffect(() => { fetchHooks(); }, [fetchHooks]);

  const fetchDeliveries = useCallback(async (id: string) => {
    setLoadingDel(true);
    try {
      const r = await fetch(`/api/webhooks/${id}/deliveries`);
      const data = await r.json();
      setDeliveries(data);
    } catch { setDeliveries([]); }
    finally { setLoadingDel(false); }
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.url || !form.events.length) {
      addToast("error", "Preencha nome, URL e selecione ao menos 1 evento."); return;
    }
    setCreating(true);
    try {
      const r = await fetch("/api/webhooks", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      addToast("success", `Webhook "${form.name}" criado! Secret: ${data.secret}`);
      setShowCreate(false);
      setForm({ name: "", url: "", events: [], enabled: true });
      fetchHooks();
    } catch (e: any) { addToast("error", e.message); }
    finally { setCreating(false); }
  };

  const handleTest = async (id: string) => {
    setTesting(id);
    try {
      const r = await fetch(`/api/webhooks/${id}/test`, { method: "POST" });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      if (data.lastStatus === "success") {
        addToast("success", `✅ Entrega bem-sucedida! HTTP ${data.lastStatusCode}`);
      } else {
        addToast("error", `❌ Entrega falhou! Verifique o URL do endpoint.`);
      }
      fetchHooks();
      if (selected?.id === id) fetchDeliveries(id);
    } catch (e: any) { addToast("error", e.message); }
    finally { setTesting(null); }
  };

  const handleToggle = async (hook: WebhookConfig) => {
    setToggling(hook.id);
    try {
      const r = await fetch(`/api/webhooks/${hook.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !hook.enabled }),
      });
      if (!r.ok) throw new Error("Falha ao alterar status.");
      addToast("success", `Webhook ${!hook.enabled ? "ativado" : "desativado"}.`);
      fetchHooks();
    } catch (e: any) { addToast("error", e.message); }
    finally { setToggling(null); }
  };

  const handleDelete = async (id: string, name: string) => {
    setDeleting(id);
    try {
      const r = await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Falha ao remover.");
      addToast("success", `Webhook "${name}" removido.`);
      if (selected?.id === id) setSelected(null);
      fetchHooks();
    } catch (e: any) { addToast("error", e.message); }
    finally { setDeleting(null); }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    try {
      const r = await fetch(`/api/webhooks/${editId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!r.ok) throw new Error("Falha ao salvar.");
      addToast("success", "Webhook atualizado.");
      setEditId(null);
      fetchHooks();
    } catch (e: any) { addToast("error", e.message); }
  };

  const openDetail = (hook: WebhookConfig) => {
    setSelected(hook);
    fetchDeliveries(hook.id);
  };

  const toggleEvent = (evtId: string, arr: string[], setArr: (v: string[]) => void) => {
    setArr(arr.includes(evtId) ? arr.filter(e => e !== evtId) : [...arr, evtId]);
  };

  const copyToClip = (text: string) => {
    navigator.clipboard.writeText(text).then(() => addToast("success", "Copiado para área de transferência!"));
  };

  const totalDeliveries = hooks.reduce((s, h) => s + (h.deliveryCount || 0), 0);
  const successRate = hooks.length ? Math.round(hooks.filter(h => h.lastStatus === "success").length / hooks.length * 100) : 0;

  return (
    <div className="space-y-6 relative">
      {/* Toasts */}
      <div className="fixed top-6 right-6 z-50 space-y-2 pointer-events-none max-w-xs">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-start gap-2 px-4 py-3 rounded-xl shadow-xl border text-xs font-medium pointer-events-auto ${t.type === "success" ? "bg-emerald-900/90 border-emerald-700/50 text-emerald-200" : "bg-red-900/90 border-red-700/50 text-red-200"}`}>
            {t.type === "success" ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" /> : <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />}
            <span className="break-all">{t.msg}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Webhook className="h-5 w-5 text-violet-400" />
            Sistema de Webhooks
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Receba notificações em tempo real sobre eventos da plataforma em qualquer URL externa.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchHooks} className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-white transition-colors" title="Atualizar">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-violet-600/20">
            <Plus className="h-4 w-4" /> Novo Webhook
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Webhooks", value: hooks.length, icon: <Webhook className="h-4 w-4" />, color: "text-violet-400" },
          { label: "Ativos", value: hooks.filter(h => h.enabled).length, icon: <ToggleRight className="h-4 w-4" />, color: "text-emerald-400" },
          { label: "Entregas Totais", value: totalDeliveries, icon: <Activity className="h-4 w-4" />, color: "text-blue-400" },
          { label: "Taxa Sucesso", value: `${successRate}%`, icon: <CheckCircle2 className="h-4 w-4" />, color: "text-green-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#0d111c] border border-slate-800/60 rounded-xl p-3 flex items-center gap-3">
            <div className={`${s.color} opacity-80`}>{s.icon}</div>
            <div>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Webhook List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm">Carregando...</span>
            </div>
          ) : hooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 bg-[#0a0c14] border border-dashed border-slate-700/60 rounded-2xl text-slate-500">
              <Webhook className="h-8 w-8" />
              <p className="text-sm">Nenhum webhook configurado.</p>
              <button onClick={() => setShowCreate(true)} className="text-xs text-violet-400 hover:underline">Criar primeiro webhook →</button>
            </div>
          ) : (
            hooks.map(hook => {
              const isEditing = editId === hook.id;
              const meta = hook.lastStatus ? STATUS_META[hook.lastStatus] : null;
              return (
                <div key={hook.id} className={`bg-[#0a0c14] border rounded-xl overflow-hidden transition-all ${selected?.id === hook.id ? "border-violet-500/50 shadow-lg shadow-violet-900/20" : "border-slate-800/60 hover:border-slate-700/60"}`}>
                  {/* Hook Header */}
                  <div className="p-3.5 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${hook.enabled ? "bg-emerald-400" : "bg-slate-600"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate">{hook.name}</p>
                      <p className="text-xs text-slate-500 truncate font-mono">{hook.url}</p>
                    </div>
                    {meta && (
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-semibold shrink-0 ${meta.cls}`}>
                        {meta.icon} {meta.label}
                      </span>
                    )}
                  </div>

                  {/* Actions bar */}
                  {!isEditing && (
                    <div className="border-t border-slate-800/60 px-3 py-2 flex items-center gap-1 flex-wrap">
                      <button onClick={() => openDetail(hook)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-violet-900/20 text-xs transition-colors">
                        <History className="h-3 w-3" /> Logs
                      </button>
                      <button
                        onClick={() => handleTest(hook.id)}
                        disabled={testing === hook.id}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 text-xs transition-colors disabled:opacity-50"
                      >
                        {testing === hook.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                        Testar
                      </button>
                      <button
                        onClick={() => handleToggle(hook)}
                        disabled={toggling === hook.id}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors disabled:opacity-50 ${hook.enabled ? "text-amber-400 hover:bg-amber-900/20" : "text-emerald-400 hover:bg-emerald-900/20"}`}
                      >
                        {hook.enabled ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                        {hook.enabled ? "Desativar" : "Ativar"}
                      </button>
                      <button
                        onClick={() => { setEditId(hook.id); setEditForm({ name: hook.name, url: hook.url, events: hook.events, enabled: hook.enabled }); }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-900/20 text-xs transition-colors"
                      >
                        <ListChecks className="h-3 w-3" /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(hook.id, hook.name)}
                        disabled={deleting === hook.id}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 text-xs transition-colors disabled:opacity-50 ml-auto"
                      >
                        {deleting === hook.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                      </button>
                    </div>
                  )}

                  {/* Edit form inline */}
                  {isEditing && (
                    <form onSubmit={handleSaveEdit} className="border-t border-slate-800/60 p-3 space-y-2.5">
                      <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} placeholder="Nome" className={inputSm} />
                      <input value={editForm.url} onChange={e => setEditForm(p => ({ ...p, url: e.target.value }))} placeholder="URL" className={inputSm} />
                      <div>
                        <p className="text-[10px] text-slate-500 mb-1.5">Eventos</p>
                        <div className="grid grid-cols-2 gap-1">
                          {ALL_EVENTS.map(ev => (
                            <label key={ev.id} className="flex items-center gap-1.5 cursor-pointer group">
                              <input type="checkbox" checked={editForm.events.includes(ev.id)}
                                onChange={() => toggleEvent(ev.id, editForm.events, (v) => setEditForm(p => ({ ...p, events: v })))}
                                className="w-3 h-3 rounded accent-violet-500"
                              />
                              <span className={`text-[10px] group-hover:text-slate-200 ${editForm.events.includes(ev.id) ? ev.color : "text-slate-500"}`}>{ev.icon} {ev.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button type="button" onClick={() => setEditId(null)} className="flex-1 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors">Cancelar</button>
                        <button type="submit" className="flex-1 py-1.5 rounded-lg text-xs bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors">Salvar</button>
                      </div>
                    </form>
                  )}

                  {/* Events chips */}
                  {!isEditing && (
                    <div className="px-3 pb-3 flex flex-wrap gap-1">
                      {hook.events.map(evtId => {
                        const ev = ALL_EVENTS.find(e => e.id === evtId);
                        return ev ? (
                          <span key={evtId} className={`text-[10px] px-1.5 py-0.5 rounded bg-slate-800/60 ${ev.color}`}>{ev.icon} {ev.label}</span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full py-16 gap-3 bg-[#0a0c14] border border-dashed border-slate-800/60 rounded-2xl text-slate-600">
              <History className="h-8 w-8" />
              <p className="text-sm">Selecione um webhook para ver o histórico de entregas</p>
            </div>
          ) : (
            <div className="bg-[#0a0c14] border border-slate-800/60 rounded-2xl overflow-hidden h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-slate-800/60">
                <div>
                  <p className="text-sm font-semibold text-white">{selected.name}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{selected.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{selected.deliveryCount} entrega{selected.deliveryCount !== 1 ? "s" : ""}</span>
                  <button onClick={() => { fetchDeliveries(selected.id); fetchHooks(); }} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingDel ? "animate-spin" : ""}`} />
                  </button>
                  <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
                    <XCircle className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40" style={{ maxHeight: 500 }}>
                {loadingDel ? (
                  <div className="flex items-center justify-center py-12 gap-2 text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" /><span className="text-xs">Carregando...</span>
                  </div>
                ) : deliveries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-600">
                    <Activity className="h-6 w-6" />
                    <p className="text-xs">Nenhuma entrega registrada ainda.</p>
                    <button onClick={() => handleTest(selected.id)} className="text-xs text-violet-400 hover:underline">Testar agora →</button>
                  </div>
                ) : (
                  deliveries.map(d => {
                    const ev = ALL_EVENTS.find(e => e.id === d.event);
                    const ok = d.status === "success";
                    return (
                      <DeliveryRow key={d.id} delivery={d} ev={ev} ok={ok} onCopy={copyToClip} />
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event reference */}
      <div className="bg-[#0a0c14] border border-slate-800/60 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-violet-400" />
          <h4 className="text-sm font-semibold text-slate-200">Eventos Disponíveis</h4>
          <span className="text-xs text-slate-500 ml-auto flex items-center gap-1.5">
            <Shield className="h-3 w-3" />
            Assinados com HMAC-SHA256 · Header: <code className="font-mono bg-slate-800 px-1 rounded">X-Nexora-Signature</code>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {ALL_EVENTS.map(ev => (
            <div key={ev.id} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3">
              <p className="text-base mb-1">{ev.icon}</p>
              <p className={`text-xs font-semibold ${ev.color}`}>{ev.label}</p>
              <code className="text-[10px] text-slate-500 mt-1 block font-mono break-all">{ev.id}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Payload example */}
      <div className="bg-[#0a0c14] border border-slate-800/60 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-400" />
            <h4 className="text-sm font-semibold text-slate-200">Exemplo de Payload</h4>
          </div>
          <button onClick={() => copyToClip(EXAMPLE_PAYLOAD)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors">
            <Copy className="h-3 w-3" /> Copiar
          </button>
        </div>
        <pre className="text-xs text-slate-300 bg-[#070910] rounded-xl p-4 overflow-x-auto font-mono leading-relaxed">
          {EXAMPLE_PAYLOAD}
        </pre>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) setShowCreate(false); }}>
          <div className="bg-[#0d111c] border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Webhook className="h-4 w-4 text-violet-400" />
                Novo Webhook
              </div>
              <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-white transition-colors">
                <XCircle className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className={labelCls}>Nome do Webhook</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ex: Notificações Slack" className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>URL do Endpoint</label>
                <input type="url" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                  placeholder="https://sua-api.com/webhooks/nexora" className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Secret (HMAC-SHA256)</label>
                <div className="relative">
                  <input value="Auto-gerado pelo servidor" readOnly className={inputCls + " opacity-50 cursor-not-allowed pr-24"} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-violet-400 font-mono">auto</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">O secret é exibido apenas uma vez após a criação. Use-o para verificar <code className="text-violet-400">X-Nexora-Signature</code>.</p>
              </div>
              <div>
                <label className={labelCls}>Eventos a assinar <span className="text-slate-500">({form.events.length} selecionados)</span></label>
                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                  {ALL_EVENTS.map(ev => (
                    <label key={ev.id} className="flex items-center gap-2 p-2 rounded-lg border border-slate-800/60 cursor-pointer hover:border-violet-500/40 hover:bg-violet-900/10 transition-all">
                      <input type="checkbox" checked={form.events.includes(ev.id)}
                        onChange={() => toggleEvent(ev.id, form.events, (v) => setForm(p => ({ ...p, events: v })))}
                        className="w-3.5 h-3.5 accent-violet-500"
                      />
                      <span className={`text-xs ${form.events.includes(ev.id) ? ev.color : "text-slate-400"}`}>{ev.icon} {ev.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl text-sm bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-colors">Cancelar</button>
                <button type="submit" disabled={creating} className="flex-1 py-2.5 rounded-xl text-sm bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {creating ? "Criando..." : "Criar Webhook"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Delivery Row Sub-component ──────────────────────────────
function DeliveryRow({ delivery: d, ev, ok, onCopy }: { delivery: Delivery; ev: any; ok: boolean; onCopy: (t: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-4 py-3">
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center gap-3 text-left">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-0.5 ${ok ? "bg-emerald-400" : "bg-red-400"}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {ev && <span className={`text-xs font-semibold ${ev.color}`}>{ev.icon} {ev.label}</span>}
            <code className="text-[10px] text-slate-500 font-mono">{d.event}</code>
            {d.statusCode && (
              <span className={`text-[10px] font-mono px-1 rounded ${ok ? "text-emerald-400 bg-emerald-900/30" : "text-red-400 bg-red-900/30"}`}>{d.statusCode}</span>
            )}
            {d.duration && <span className="text-[10px] text-slate-600">{d.duration}ms</span>}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">{new Date(d.deliveredAt).toLocaleString("pt-BR")}</p>
        </div>
        {open ? <ChevronUp className="h-3 w-3 text-slate-500 shrink-0" /> : <ChevronDown className="h-3 w-3 text-slate-500 shrink-0" />}
      </button>
      {open && (
        <div className="mt-2 pl-4 space-y-2">
          {d.responseBody && (
            <div>
              <p className="text-[10px] text-slate-500 mb-0.5">Resposta</p>
              <div className="relative">
                <pre className="text-[10px] text-slate-300 bg-[#070910] rounded-lg p-2 overflow-x-auto font-mono max-h-24">{d.responseBody}</pre>
                <button onClick={() => onCopy(d.responseBody!)} className="absolute top-1 right-1 p-0.5 rounded text-slate-500 hover:text-white transition-colors"><Copy className="h-2.5 w-2.5" /></button>
              </div>
            </div>
          )}
          {d.error && (
            <div className="flex items-start gap-1.5 text-[10px] text-red-300 bg-red-900/20 border border-red-700/30 rounded-lg p-2">
              <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />{d.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Constants ───────────────────────────────────────────────
const EXAMPLE_PAYLOAD = `{
  "event": "ticket.created",
  "timestamp": "2026-06-26T14:30:00.000Z",
  "data": {
    "id": "ticket-123",
    "title": "Instalação de CFTV - 16 Câmeras IP",
    "category": "CFTV",
    "urgency": "Alta",
    "status": "Aberto",
    "companyId": "comp-1",
    "city": "Campinas",
    "state": "SP",
    "suggestedValue": 3800
  }
}

// Headers enviados:
// X-Nexora-Signature: sha256=<hmac-sha256-hex>
// X-Nexora-Event: ticket.created
// X-Nexora-Delivery: <uuid>
// Content-Type: application/json`;

const inputCls = "w-full px-3 py-2.5 bg-[#0a0c14] border border-slate-700/60 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/60 transition-colors";
const inputSm  = "w-full px-2.5 py-2 bg-[#070910] border border-slate-800/60 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/60 transition-colors";
const labelCls = "block text-xs font-semibold text-slate-400 mb-1.5";
