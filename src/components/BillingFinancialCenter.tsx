import React, { useState } from "react";
import { 
  Building2, DollarSign, Wallet, FileText, ArrowUpRight, ArrowDownRight, Search, Filter, Plus, CreditCard, RefreshCw, Eye, CheckCircle2, AlertTriangle, HelpCircle, X, Check, Zap, Landmark
} from "lucide-react";
import { Company, Technician } from "../types";

interface BillingFinancialCenterProps {
  companies: Company[];
  technicians: Technician[];
}

interface FinancialAccount {
  id: string;
  companyId: string;
  companyName: string;
  cnpj: string;
  balance: number;
  blockedBalance: number;
  futureBalance: number;
  bonusBalance: number;
  referralBalance: number;
  ledger: {
    id: string;
    date: string;
    description: string;
    type: 'credito' | 'debito';
    amount: number;
    category: 'mensalidade' | 'comissao' | 'saque' | 'reembolso' | 'estorno' | 'bonus' | 'split';
    status: 'pago' | 'pendente' | 'cancelado';
  }[];
  invoices: {
    id: string;
    dueDate: string;
    amount: number;
    type: 'Mensalidade' | 'Comissão' | 'Adicional';
    method: 'PIX' | 'Cartão' | 'Boleto';
    status: 'Pago' | 'Pendente' | 'Atrasado' | 'Parcelado' | 'Estornado';
    nfeNumber?: string;
    nfeStatus?: 'Emitida' | 'Pendente' | 'Erro';
  }[];
}

export default function BillingFinancialCenter({ companies, technicians }: BillingFinancialCenterProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [accountFilter, setAccountFilter] = useState<'all' | 'positive' | 'debtor'>('all');

  // Interactive details modals
  const [detailAccountId, setDetailAccountId] = useState<string | null>(null);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [selectedAccountForInvoice, setSelectedAccountForInvoice] = useState<FinancialAccount | null>(null);

  // New Invoice form state
  const [newInvoiceAmount, setNewInvoiceAmount] = useState(299);
  const [newInvoiceType, setNewInvoiceType] = useState<'Mensalidade' | 'Comissão' | 'Adicional'>('Mensalidade');
  const [newInvoiceMethod, setNewInvoiceMethod] = useState<'PIX' | 'Cartão' | 'Boleto'>('PIX');

  // Simulated static/state datasets
  const [financialAccounts, setFinancialAccounts] = useState<FinancialAccount[]>([
    {
      id: "fa-1",
      companyId: "comp-1",
      companyName: "Telefônica Brasil S.A.",
      cnpj: "02.558.157/0001-62",
      balance: 14500.00,
      blockedBalance: 4200.00,
      futureBalance: 12800.00,
      bonusBalance: 500.00,
      referralBalance: 200.00,
      ledger: [
        { id: "led-1", date: "2026-06-25", description: "Mensalidade Plano Platinum", type: "debito", amount: 1499.00, category: "mensalidade", status: "pago" },
        { id: "led-2", date: "2026-06-24", description: "Comissão Retida Chamado #tick-2", type: "credito", amount: 120.00, category: "comissao", status: "pago" },
        { id: "led-3", date: "2026-06-23", description: "Split Transferência Liberada Técnico", type: "debito", amount: 880.00, category: "split", status: "pago" },
        { id: "led-4", date: "2026-06-21", description: "Bônus Campanha Indicação Ativa", type: "credito", amount: 100.00, category: "bonus", status: "pago" }
      ],
      invoices: [
        { id: "inv-101", dueDate: "2026-06-10", amount: 1499.00, type: "Mensalidade", method: "PIX", status: "Pago", nfeNumber: "NF-e 45292", nfeStatus: "Emitida" },
        { id: "inv-102", dueDate: "2026-07-10", amount: 1499.00, type: "Mensalidade", method: "PIX", status: "Pendente", nfeNumber: "NF-e 45890", nfeStatus: "Pendente" },
        { id: "inv-103", dueDate: "2026-06-15", amount: 450.00, type: "Adicional", method: "Boleto", status: "Pago", nfeNumber: "NF-e 45311", nfeStatus: "Emitida" }
      ]
    },
    {
      id: "fa-2",
      companyId: "comp-2",
      companyName: "SolarSol Soluções S.A.",
      cnpj: "44.111.222/0001-99",
      balance: 1200.00,
      blockedBalance: 1200.00,
      futureBalance: 4500.00,
      bonusBalance: 0,
      referralBalance: 100.00,
      ledger: [
        { id: "led-5", date: "2026-06-22", description: "Mensalidade Plano Gold", type: "debito", amount: 449.00, category: "mensalidade", status: "pago" },
        { id: "led-6", date: "2026-06-20", description: "Reembolso Amigável Taxa de Cancelamento", type: "credito", amount: 150.00, category: "reembolso", status: "pago" }
      ],
      invoices: [
        { id: "inv-201", dueDate: "2026-06-10", amount: 449.00, type: "Mensalidade", method: "Cartão", status: "Pago", nfeNumber: "NF-e 45180", nfeStatus: "Emitida" },
        { id: "inv-202", dueDate: "2026-06-25", amount: 200.00, type: "Adicional", method: "Boleto", status: "Atrasado", nfeNumber: "NF-e 45802", nfeStatus: "Erro" }
      ]
    },
    {
      id: "fa-3",
      companyId: "comp-3",
      companyName: "Infrasul Redes Ópticas",
      cnpj: "33.444.555/0001-66",
      balance: 450.00,
      blockedBalance: 0,
      futureBalance: 1800.00,
      bonusBalance: 50.00,
      referralBalance: 0,
      ledger: [
        { id: "led-7", date: "2026-06-24", description: "Estorno de Cobrança Duplicada", type: "credito", amount: 299.00, category: "estorno", status: "pago" }
      ],
      invoices: [
        { id: "inv-301", dueDate: "2026-06-15", amount: 299.00, type: "Mensalidade", method: "Boleto", status: "Pago", nfeNumber: "NF-e 45398", nfeStatus: "Emitida" }
      ]
    }
  ]);

  // Handle invoice generation
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountForInvoice) return;

    const newInv = {
      id: `inv-${Date.now()}`,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: newInvoiceAmount,
      type: newInvoiceType,
      method: newInvoiceMethod,
      status: 'Pendente' as const,
      nfeNumber: `NF-e ${Math.floor(45000 + Math.random() * 900)}`,
      nfeStatus: 'Pendente' as const
    };

    setFinancialAccounts(prev => prev.map(acc => {
      if (acc.id === selectedAccountForInvoice.id) {
        return {
          ...acc,
          invoices: [newInv, ...acc.invoices],
          ledger: [
            {
              id: `led-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              description: `Cobrança de ${newInvoiceType} emitida`,
              type: 'debito',
              amount: newInvoiceAmount,
              category: newInvoiceType === 'Mensalidade' ? 'mensalidade' as const : 'comissao' as const,
              status: 'pendente' as const
            },
            ...acc.ledger
          ]
        };
      }
      return acc;
    }));

    setIsNewInvoiceOpen(false);
    setSelectedAccountForInvoice(null);
  };

  // Perform Refund Action
  const handlePerformRefund = (accId: string, invId: string, amount: number) => {
    if (confirm(`Deseja realmente aprovar o reembolso/estorno de R$ ${amount.toFixed(2)} para esta empresa?`)) {
      setFinancialAccounts(prev => prev.map(acc => {
        if (acc.id === accId) {
          return {
            ...acc,
            balance: acc.balance + amount,
            invoices: acc.invoices.map(inv => inv.id === invId ? { ...inv, status: 'Estornado' as const } : inv),
            ledger: [
              {
                id: `led-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                description: `Estorno/Reembolso de fatura ${invId}`,
                type: 'credito',
                amount: amount,
                category: 'reembolso',
                status: 'pago'
              },
              ...acc.ledger
            ]
          };
        }
        return acc;
      }));
      alert("Fatura estornada e saldo estornado para a conta financeira do assinante!");
    }
  };

  const selectedAccount = financialAccounts.find(acc => acc.id === detailAccountId);

  return (
    <div className="space-y-6">
      
      {/* SECTION TITLE & META */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h3 className="text-base font-bold text-white font-display tracking-tight flex items-center gap-2">
            <Landmark className="h-5 w-5 text-indigo-400" />
            Centro Financeiro & Carteiras Digitais
          </h3>
          <p className="text-xs text-slate-400">Gerenciamento completo das contas escrow, wallets de técnicos e faturamento de clientes.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setSelectedCompanyId("all")}
            className="text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Limpar Filtro
          </button>
        </div>
      </div>

      {/* WALLETS OVERVIEW STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
          <span className="text-[10px] text-slate-500 font-mono block">SALDO DISPONÍVEL GERAL</span>
          <span className="text-lg font-black text-white mt-1 block">R$ {financialAccounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span className="text-[9px] text-indigo-400 font-mono block mt-1">SaaS + Contas Escrow</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
          <span className="text-[10px] text-slate-500 font-mono block">SALDO RETIDO / ESCROW</span>
          <span className="text-lg font-black text-amber-500 mt-1 block">R$ {financialAccounts.reduce((sum, a) => sum + a.blockedBalance, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span className="text-[9px] text-slate-400 block mt-1">Garantias de chamados em aberto</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
          <span className="text-[10px] text-slate-500 font-mono block">SALDO RECORRÊNTE FUTURO</span>
          <span className="text-lg font-black text-cyan-400 mt-1 block">R$ {financialAccounts.reduce((sum, a) => sum + a.futureBalance, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span className="text-[9px] text-emerald-400 block mt-1">Previsão de cobranças</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
          <span className="text-[10px] text-slate-500 font-mono block">SALDO DE BÔNUS ACUMULADOS</span>
          <span className="text-lg font-black text-pink-400 mt-1 block">R$ {financialAccounts.reduce((sum, a) => sum + a.bonusBalance, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span className="text-[9px] text-slate-400 block mt-1">Créditos promocionais ativos</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
          <span className="text-[10px] text-slate-500 font-mono block">CRÉDITOS DE INDICAÇÃO</span>
          <span className="text-lg font-black text-purple-400 mt-1 block">R$ {financialAccounts.reduce((sum, a) => sum + a.referralBalance, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span className="text-[9px] text-purple-400 block mt-1">Programa Member-Get-Member</span>
        </div>

      </div>

      {/* CORE FINANCIAL ACCOUNTS TABLE */}
      <div className="bg-[#0b0e1a] border border-[#1d2440] rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-900 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">Contas Financeiras dos Clientes</span>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Pesquisar por cliente..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs bg-slate-950 border border-slate-900 rounded-xl p-2 focus:outline-none focus:border-indigo-500 text-white w-48"
            />
            <select 
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value as any)}
              className="text-xs bg-slate-950 border border-slate-900 rounded-xl p-2 text-slate-300"
            >
              <option value="all">Todas</option>
              <option value="positive">Saldo Disponível &gt; 0</option>
              <option value="debtor">Inadimplentes / Atrasados</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0e1222] text-slate-400 font-mono border-b border-slate-900">
                <th className="p-4">Assinante / CNPJ</th>
                <th className="p-4">Saldo Disponível</th>
                <th className="p-4">Saldo Bloqueado (Escrow)</th>
                <th className="p-4">Saldo de Bônus</th>
                <th className="p-4">Última Fatura</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 bg-slate-950/20">
              {financialAccounts
                .filter(acc => {
                  if (searchQuery && !acc.companyName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                  if (accountFilter === 'positive' && acc.balance <= 0) return false;
                  if (accountFilter === 'debtor' && !acc.invoices.some(i => i.status === 'Atrasado')) return false;
                  return true;
                })
                .map(acc => {
                  const lateInvoice = acc.invoices.find(i => i.status === 'Atrasado');
                  return (
                    <tr key={acc.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-indigo-950 text-indigo-400 rounded-xl">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-200 block">{acc.companyName}</span>
                            <span className="text-[10px] text-slate-500 font-mono block">CNPJ: {acc.cnpj}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        R$ {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 font-mono text-amber-400">
                        R$ {acc.blockedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 font-mono text-pink-400">
                        R$ {acc.bonusBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4">
                        {lateInvoice ? (
                          <span className="bg-rose-950 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-900/60 flex items-center gap-1 w-fit">
                            <AlertTriangle className="h-3 w-3" /> Atrasada (R$ {lateInvoice.amount})
                          </span>
                        ) : (
                          <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-900/60 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="h-3 w-3" /> Regular
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              setSelectedAccountForInvoice(acc);
                              setIsNewInvoiceOpen(true);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-400 text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                          >
                            Nova Cobrança
                          </button>
                          <button 
                            onClick={() => setDetailAccountId(acc.id)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="h-3.5 w-3.5" /> Ver Extrato
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED EXTRATO & LEDGER MODEL DIALOG */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#0b0e1a] border border-[#1d2440] text-white rounded-3xl max-w-4xl w-full p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <div>
                <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-widest">RASTREADOR DE CONTAS EM TEMPO REAL</span>
                <h3 className="font-bold text-lg text-white font-display">Conta de Faturamento: {selectedAccount.companyName}</h3>
              </div>
              <button 
                onClick={() => setDetailAccountId(null)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Balances detailed cards inside dialog */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">SALDO DISPONÍVEL</span>
                <span className="text-sm font-black text-white block mt-0.5">R$ {selectedAccount.balance.toFixed(2)}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">GARANTIAS (ESCROW)</span>
                <span className="text-sm font-black text-amber-500 block mt-0.5">R$ {selectedAccount.blockedBalance.toFixed(2)}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">FATURAMENTO FUTURO</span>
                <span className="text-sm font-black text-cyan-400 block mt-0.5">R$ {selectedAccount.futureBalance.toFixed(2)}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">CRÉDITOS BÔNUS</span>
                <span className="text-sm font-black text-pink-400 block mt-0.5">R$ {selectedAccount.bonusBalance.toFixed(2)}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">INDICAÇÕES (REWARDS)</span>
                <span className="text-sm font-black text-purple-400 block mt-0.5">R$ {selectedAccount.referralBalance.toFixed(2)}</span>
              </div>
            </div>

            {/* Tabs layout for Ledger (Extrato) vs Invoices (Faturamento) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* LEDGER EXTRACT */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">Histórico de Transações (Ledger)</span>
                  <span className="text-[9px] text-slate-500 font-mono">Simulado via Escrow</span>
                </div>
                <div className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden divide-y divide-slate-900 max-h-60 overflow-y-auto">
                  {selectedAccount.ledger.map(log => (
                    <div key={log.id} className="p-3 flex justify-between items-center text-xs hover:bg-slate-900/35 transition-colors">
                      <div>
                        <span className="font-bold text-slate-300 block">{log.description}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{log.date} | Categoria: {log.category}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-bold block ${log.type === 'credito' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {log.type === 'credito' ? '+' : '-'} R$ {log.amount.toFixed(2)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono block">{log.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* INVOICES AND NF-E CONTROLS */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">Centro de Faturas & Notas Fiscais (NF-e)</span>
                  <span className="text-[9px] text-slate-500 font-mono">Automação de Receita</span>
                </div>
                <div className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden divide-y divide-slate-900 max-h-60 overflow-y-auto">
                  {selectedAccount.invoices.map(inv => (
                    <div key={inv.id} className="p-3 flex justify-between items-center text-xs hover:bg-slate-900/35 transition-colors">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-300">{inv.type}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${inv.status === 'Pago' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/60' : inv.status === 'Atrasado' ? 'bg-rose-950 text-rose-400 border border-rose-900/60 animate-pulse' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                            {inv.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block mt-1">
                          Vencimento: {inv.dueDate} | Método: {inv.method}
                        </span>
                        {inv.nfeNumber && (
                          <span className="text-[10px] text-indigo-400 font-mono flex items-center gap-1 mt-0.5">
                            <FileText className="h-3 w-3" /> {inv.nfeNumber} ({inv.nfeStatus})
                          </span>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        <span className="font-mono font-bold text-white block">R$ {inv.amount.toFixed(2)}</span>
                        {inv.status !== 'Estornado' && inv.status !== 'Pago' && (
                          <button 
                            onClick={() => handlePerformRefund(selectedAccount.id, inv.id, inv.amount)}
                            className="text-[9px] font-bold text-rose-400 hover:text-rose-300 block"
                          >
                            Estornar Fatura
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-2 border-t border-slate-900 pt-4 text-xs font-bold">
              <button 
                onClick={() => setDetailAccountId(null)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Fechar Painel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW COBRANÇA MODAL */}
      {isNewInvoiceOpen && selectedAccountForInvoice && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateInvoice} className="bg-[#0b0e1a] border border-[#1d2440] text-white rounded-3xl max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h3 className="font-bold text-base">Nova Cobrança Manual</h3>
              <button 
                type="button"
                onClick={() => {
                  setIsNewInvoiceOpen(false);
                  setSelectedAccountForInvoice(null);
                }}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                <span className="text-[10px] text-slate-500 font-mono block">CLIENTE DESTINO</span>
                <span className="font-bold text-slate-200 block mt-1">{selectedAccountForInvoice.companyName}</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-mono">Valor da Cobrança (R$)</label>
                <input 
                  type="number"
                  value={newInvoiceAmount}
                  onChange={(e) => setNewInvoiceAmount(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono">Tipo de Cobrança</label>
                  <select 
                    value={newInvoiceType}
                    onChange={(e) => setNewInvoiceType(e.target.value as any)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-300"
                  >
                    <option value="Mensalidade">Mensalidade</option>
                    <option value="Comissão">Comissão</option>
                    <option value="Adicional">Taxa Adicional</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono">Forma de Pagamento</label>
                  <select 
                    value={newInvoiceMethod}
                    onChange={(e) => setNewInvoiceMethod(e.target.value as any)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-300"
                  >
                    <option value="PIX">PIX Dinâmico</option>
                    <option value="Cartão">Cartão de Crédito</option>
                    <option value="Boleto">Boleto Registrado</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="flex gap-2 justify-end border-t border-slate-900 pt-4 text-xs font-bold">
              <button 
                type="button"
                onClick={() => {
                  setIsNewInvoiceOpen(false);
                  setSelectedAccountForInvoice(null);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Zap className="h-4 w-4" /> Emitir Cobrança
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
