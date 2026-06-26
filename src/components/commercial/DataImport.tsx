import React, { useState } from "react";
import {
  Upload, FileText, CheckCircle, AlertCircle, X, Download,
  Table, Database, Globe, RefreshCw, Zap, Users, Package,
  Clipboard, ChevronDown, Play, Clock, AlertTriangle
} from "lucide-react";

const IMPORT_TYPES = [
  { id: "companies", label: "Empresas Clientes", icon: Database, color: "cyan", fields: ["nome", "cnpj", "email", "telefone", "cidade", "estado", "segmento"] },
  { id: "technicians", label: "Técnicos", icon: Users, color: "emerald", fields: ["nome", "cpf", "email", "telefone", "cidade", "estado", "especialidade", "raio_km"] },
  { id: "tickets", label: "Ordens de Serviço", icon: Clipboard, color: "indigo", fields: ["titulo", "descricao", "categoria", "status", "empresa_id", "data", "cidade"] },
  { id: "equipment", label: "Equipamentos", icon: Package, color: "yellow", fields: ["nome", "tipo", "numero_serie", "empresa_id", "status"] },
  { id: "clients", label: "Clientes Finais", icon: Users, color: "purple", fields: ["nome", "email", "telefone", "endereco", "empresa_id"] },
  { id: "leads", label: "Leads Comerciais", icon: Globe, color: "pink", fields: ["nome_empresa", "contato", "email", "telefone", "segmento", "valor_estimado"] },
];

const IMPORT_FORMATS = [
  { id: "csv", label: "CSV", icon: FileText },
  { id: "excel", label: "Excel (.xlsx)", icon: Table },
  { id: "json", label: "JSON", icon: Database },
  { id: "gsheets", label: "Google Sheets", icon: Globe },
];

const MOCK_HISTORY = [
  { type: "Técnicos", records: 48, errors: 2, date: "2026-06-25 14:32", status: "Concluído" },
  { type: "Empresas", records: 12, errors: 0, date: "2026-06-24 09:15", status: "Concluído" },
  { type: "Ordens de Serviço", records: 200, errors: 8, date: "2026-06-20 11:00", status: "Concluído c/ erros" },
  { type: "Leads", records: 85, errors: 0, date: "2026-06-18 16:45", status: "Concluído" },
];

export default function DataImport() {
  const [selectedType, setSelectedType] = useState(IMPORT_TYPES[0]);
  const [selectedFormat, setSelectedFormat] = useState(IMPORT_FORMATS[0]);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<"select" | "preview" | "validating" | "done">("select");
  const [validationResult, setValidationResult] = useState<{ total: number; valid: number; errors: string[] } | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); setStep("preview"); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) { setFile(selected); setStep("preview"); }
  };

  const handleValidate = async () => {
    setStep("validating");
    await new Promise(r => setTimeout(r, 2000));
    setValidationResult({
      total: 48,
      valid: 45,
      errors: [
        "Linha 12: CPF inválido — '000.000.000-00'",
        "Linha 27: E-mail duplicado — 'joao@email.com' já existe",
        "Linha 34: Campo 'especialidade' obrigatório — vazio",
      ],
    });
    setStep("done");
  };

  const resetImport = () => { setFile(null); setStep("select"); setValidationResult(null); };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white font-display">Importação de Dados</h2>
        <p className="text-xs text-slate-500 mt-0.5">Importe registros em massa via CSV, Excel, JSON ou Google Sheets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Config */}
        <div className="space-y-4">
          {/* Type selector */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-4 space-y-3">
            <label className="text-xs font-bold text-slate-400">Tipo de Dados</label>
            <div className="space-y-1.5">
              {IMPORT_TYPES.map(t => {
                const Icon = t.icon;
                return (
                  <button key={t.id} onClick={() => setSelectedType(t)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all text-xs font-semibold ${
                      selectedType.id === t.id ? `bg-${t.color}-500/10 border border-${t.color}-500/30 text-${t.color}-400` : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}>
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format selector */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-4 space-y-3">
            <label className="text-xs font-bold text-slate-400">Formato do Arquivo</label>
            <div className="grid grid-cols-2 gap-2">
              {IMPORT_FORMATS.map(f => {
                const Icon = f.icon;
                return (
                  <button key={f.id} onClick={() => setSelectedFormat(f)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedFormat.id === f.id ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400" : "border-slate-800 text-slate-500 hover:text-white hover:border-slate-600"
                    }`}>
                    <Icon className="h-4 w-4" />
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required fields */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-4 space-y-2">
            <label className="text-xs font-bold text-slate-400">Campos Obrigatórios</label>
            <div className="flex flex-wrap gap-1.5">
              {selectedType.fields.map(f => (
                <span key={f} className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2 py-1 rounded-lg">
                  {f}
                </span>
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-[10px] text-cyan-400 hover:text-cyan-300 transition-all mt-1">
              <Download className="h-3 w-3" /> Baixar template {selectedFormat.label}
            </button>
          </div>
        </div>

        {/* Right: Upload area */}
        <div className="lg:col-span-2 space-y-4">
          {step === "select" && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                dragOver ? "border-cyan-500 bg-cyan-500/5" : "border-slate-700 hover:border-slate-500 hover:bg-slate-900/30"
              }`}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input id="file-input" type="file" accept=".csv,.xlsx,.json" className="hidden" onChange={handleFileSelect} />
              <Upload className={`h-12 w-12 mx-auto mb-4 transition-all ${dragOver ? "text-cyan-400" : "text-slate-600"}`} />
              <h3 className="font-bold text-white mb-2">Arraste o arquivo aqui ou clique para selecionar</h3>
              <p className="text-xs text-slate-500 mb-4">CSV, Excel (.xlsx), JSON · Máximo 50MB · Até 50.000 registros</p>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all">
                <Upload className="h-3.5 w-3.5" /> Selecionar Arquivo
              </button>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-xs text-slate-600">ou</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-xs font-semibold transition-all">
                <Globe className="h-3.5 w-3.5" /> Conectar Google Sheets
              </button>
            </div>
          )}

          {step === "preview" && file && (
            <div className="space-y-4">
              <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                <FileText className="h-8 w-8 text-cyan-400 shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-sm text-white">{file.name}</div>
                  <div className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB · {selectedType.label} · {selectedFormat.label}</div>
                </div>
                <button onClick={resetImport} className="text-slate-500 hover:text-red-400 transition-all"><X className="h-4 w-4" /></button>
              </div>

              <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white">Pré-visualização</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-800">
                        {selectedType.fields.slice(0, 4).map(f => (
                          <th key={f} className="text-left text-[10px] font-mono text-slate-500 uppercase pb-2 pr-4">{f}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(3)].map((_, i) => (
                        <tr key={i} className="border-b border-slate-800/50">
                          {selectedType.fields.slice(0, 4).map(f => (
                            <td key={f} className="py-2 pr-4 text-slate-400">—</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-slate-600">Visualização simulada. O arquivo será processado na importação.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={resetImport} className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-all">
                  Cancelar
                </button>
                <button onClick={handleValidate}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all">
                  <Zap className="h-3.5 w-3.5" /> Validar e Importar
                </button>
              </div>
            </div>
          )}

          {step === "validating" && (
            <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto">
                <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
              </div>
              <h3 className="font-bold text-white">Validando registros...</h3>
              <p className="text-xs text-slate-500">Verificando duplicidade, campos obrigatórios e integridade referencial</p>
              <div className="space-y-2 text-xs text-slate-600">
                {["✓ Verificando estrutura do arquivo...", "✓ Validando campos obrigatórios...", "⟳ Checando duplicatas no banco..."].map((s, i) => (
                  <div key={i}>{s}</div>
                ))}
              </div>
            </div>
          )}

          {step === "done" && validationResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-white font-display">{validationResult.total}</div>
                  <div className="text-xs text-slate-500">Total de Registros</div>
                </div>
                <div className="bg-[#0b0e17] border border-emerald-500/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400 font-display">{validationResult.valid}</div>
                  <div className="text-xs text-slate-500">Válidos</div>
                </div>
                <div className="bg-[#0b0e17] border border-red-500/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-red-400 font-display">{validationResult.errors.length}</div>
                  <div className="text-xs text-slate-500">Com Erros</div>
                </div>
              </div>

              {validationResult.errors.length > 0 && (
                <div className="bg-[#0b0e17] border border-red-500/20 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Erros de Validação
                  </h3>
                  {validationResult.errors.map((e, i) => (
                    <div key={i} className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">{e}</div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={resetImport} className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-all">
                  Cancelar
                </button>
                <button onClick={resetImport}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all">
                  <CheckCircle className="h-3.5 w-3.5" /> Importar {validationResult.valid} Registros Válidos
                </button>
              </div>
            </div>
          )}

          {/* History */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Clock className="h-4 w-4 text-slate-500" /> Histórico de Importações</h3>
            <div className="space-y-2">
              {MOCK_HISTORY.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl text-xs">
                  <div>
                    <span className="font-semibold text-slate-300">{h.type}</span>
                    <span className="text-slate-600 ml-2">{h.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{h.records} registros</span>
                    {h.errors > 0 && <span className="text-red-400">{h.errors} erros</span>}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      h.status === "Concluído" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}>{h.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
