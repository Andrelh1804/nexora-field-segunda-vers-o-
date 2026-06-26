import React, { useState } from "react";
import { 
  Plan, Subscription, PlanCoupon, PlanAuditLog, Company, Technician
} from "../types";
import { 
  Building2, Sparkles, ShieldCheck, HardHat, Users, DollarSign, Percent, 
  Award, QrCode, Tag, ArrowLeftRight, History, Shield, Calendar, CreditCard, 
  Play, Check, X, AlertTriangle, Eye, Copy, Trash2, Edit, Edit3, Settings, 
  TrendingUp, Info, HelpCircle, FileText, Gift, Zap, ChevronRight, Search, 
  Filter, Plus, ClipboardList, RefreshCw, BarChart3, PieChart, Activity, CheckCircle2, Landmark, Radio
} from "lucide-react";
import { 
  INITIAL_PLANS, INITIAL_SUBSCRIPTIONS, INITIAL_COUPONS, INITIAL_PLAN_AUDIT_LOGS 
} from "../data";

// Advanced Billing Modular Imports
import BillingDashboard from "./BillingDashboard";
import BillingFinancialCenter from "./BillingFinancialCenter";
import BillingEngine from "./BillingEngine";
import BillingContracts from "./BillingContracts";
import BillingAIAssistant from "./BillingAIAssistant";
import BillingIntegrations from "./BillingIntegrations";

interface AdminPlansManagerProps {
  companies: Company[];
  technicians: Technician[];
}

export default function AdminPlansManager({ companies, technicians }: AdminPlansManagerProps) {
  // Core datasets as states so Super Admin can update them in real-time
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [coupons, setCoupons] = useState<PlanCoupon[]>(INITIAL_COUPONS);
  const [auditLogs, setAuditLogs] = useState<PlanAuditLog[]>(INITIAL_PLAN_AUDIT_LOGS);

  // Grouped and organized submenu tab navigation
  const [subTab, setSubTab] = useState<
    'dash' | 'companies' | 'techs' | 'partners' | 'subscriptions' | 'finance' | 'billing' | 'contracts' | 'ai_advisor' | 'integrations' | 'coupons' | 'audit'
  >('dash');

  // Search/Filters states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Plan creation / editing modal states
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Upgrade/Downgrade modal states
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [activeSubForChange, setActiveSubForChange] = useState<Subscription | null>(null);
  const [selectedNewPlanId, setSelectedNewPlanId] = useState("");
  const [upgradePreview, setUpgradePreview] = useState<{ proRataAmount: number; isUpgrade: boolean; message: string } | null>(null);

  // Coupon modal states
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<PlanCoupon | null>(null);

  // Audit helper
  const logAudit = (actionType: PlanAuditLog['actionType'], details: string, planId?: string, planName?: string, changes?: PlanAuditLog['changes']) => {
    const newLog: PlanAuditLog = {
      id: `pal-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: "André Luis (Super Admin)",
      actorIp: "189.120.45.102",
      planId,
      planName,
      actionType,
      details,
      changes
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Setup initial template plan structure for creation
  const createEmptyPlan = (type: Plan['type']): Plan => {
    return {
      id: `plan-${Date.now()}`,
      name: `Novo Plano ${type}`,
      code: `NEX-NEW-${type.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      description: "Descreva o propósito deste plano comercial.",
      category: "Bronze",
      type,
      icon: type === "Empresa" ? "Building2" : type === "Técnico" ? "HardHat" : "Sparkles",
      color: "#6366f1",
      displayOrder: plans.length + 1,
      recommended: false,
      status: "Ativo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pricing: {
        monthly: 199,
        monthlyPromo: 149,
        quarterly: 549,
        quarterlyPromo: 449,
        semesterly: 999,
        semesterlyPromo: 849,
        yearly: 1999,
        yearlyPromo: 1499,
        setupFee: 199,
        trialDays: 14,
        minLoyaltyMonths: 0,
        autoRenew: true
      },
      billingConfig: {
        paymentMethods: ["PIX", "Cartão"],
        dueDay: 10,
        lateFeePercentage: 2,
        lateInterestPercentage: 1,
        autoSuspendDays: 5,
        autoBlockDays: 15
      },
      commission: {
        type: "percentual",
        percentage: 12,
        flatAmount: 0
      },
      features: {
        ticketsManual: true,
        chatGroups: true,
        aiDispatcher: false,
        aiTechnical: false,
        aiCrmGrowth: false,
        aiBiAnalytics: false,
        executiveDashboard: true,
        customReports: false,
        gamification: false,
        referrals: true,
        marketplaceAccess: true,
        restApi: false,
        webhooks: false,
        offlineMode: true,
        digitalSignature: true,
        pushNotifications: true,
        whatsappNotifications: false,
        erpIntegration: false,
        crmIntegration: false,
        clientPortal: true,
        techPortal: true,
        companyPortal: true,
        auditingLogs: true,
        excelExport: true,
        pdfExport: true
      },
      limits: {
        maxCompanies: 1,
        maxUsers: 2,
        maxAdmins: 1,
        maxFiliais: 1,
        maxTicketsPerMonth: 15,
        maxTechnicians: 5,
        maxUploadSizeMb: 10,
        maxStorageGb: 2,
        aiTokensPerMonth: 0,
        apiRequestsPerDay: 0,
        webhookEndpoints: 0
      },
      aiLevel: "Básica",
      aiFeatures: {
        aiReports: false,
        aiClassification: false,
        aiMatching: false,
        aiSummary: false,
        aiCopilotTech: false,
        aiCopilotComercial: false
      },
      financialFeatures: {
        splitPayment: true,
        anticipationAllowed: false,
        autoPix: true,
        digitalWallet: true,
        invoiceEmitting: false,
        refunds: true
      },
      gamificationConfig: {
        rankingEnabled: false,
        xpMultiplier: 1.0,
        exclusiveMissions: false,
        specialBadges: false,
        cashbackPercentage: 0
      },
      referralConfig: {
        rewardCompanyAmount: 50,
        rewardTechAmount: 25,
        monthlyLimitAmount: 500
      }
    };
  };

  // Handle plan duplication
  const handleDuplicatePlan = (plan: Plan) => {
    const duplicated: Plan = {
      ...JSON.parse(JSON.stringify(plan)),
      id: `plan-${Date.now()}`,
      name: `${plan.name} (Cópia)`,
      code: `${plan.code}-COPY`,
      recommended: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPlans(prev => [...prev, duplicated]);
    logAudit("Duplicate", `Duplicou o plano '${plan.name}' para criar o plano '${duplicated.name}'.`, duplicated.id, duplicated.name);
  };

  // Handle plan delete
  const handleDeletePlan = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir permanentemente o plano '${name}'?`)) {
      setPlans(prev => prev.filter(p => p.id !== id));
      logAudit("Delete", `Excluiu permanentemente o plano '${name}'.`, id, name);
    }
  };

  // Save Plan modal edits
  const handleSavePlan = (plan: Plan) => {
    const isNew = !plans.some(p => p.id === plan.id);
    let originalPlan: Plan | undefined = undefined;
    if (!isNew) {
      originalPlan = plans.find(p => p.id === plan.id);
    }

    if (isNew) {
      setPlans(prev => [...prev, plan]);
      logAudit("Create", `Criou o novo plano '${plan.name}' (${plan.type}) com sucesso.`, plan.id, plan.name);
    } else {
      setPlans(prev => prev.map(p => p.id === plan.id ? { ...plan, updatedAt: new Date().toISOString() } : p));
      
      const changes: PlanAuditLog['changes'] = [];
      if (originalPlan) {
        if (originalPlan.pricing.monthly !== plan.pricing.monthly) {
          changes.push({ field: "pricing.monthly", oldValue: originalPlan.pricing.monthly, newValue: plan.pricing.monthly });
        }
        if (originalPlan.commission.percentage !== plan.commission.percentage) {
          changes.push({ field: "commission.percentage", oldValue: originalPlan.commission.percentage, newValue: plan.commission.percentage });
        }
        if (originalPlan.status !== plan.status) {
          changes.push({ field: "status", oldValue: originalPlan.status, newValue: plan.status });
        }
      }
      
      logAudit("Edit", `Editou parâmetros e configurações do plano '${plan.name}'.`, plan.id, plan.name, changes);
    }
    setIsPlanModalOpen(false);
    setEditingPlan(null);
  };

  // Open Coupon modal
  const handleOpenCouponModal = (coupon: PlanCoupon | null) => {
    if (coupon) {
      setEditingCoupon(coupon);
    } else {
      setEditingCoupon({
        id: `coupon-${Date.now()}`,
        code: "",
        description: "",
        discountType: "percentage",
        value: 10,
        quantityLimit: 100,
        usedQuantity: 0,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        applicablePlans: [],
        onlyFirstSubscription: true,
        status: "Ativo"
      });
    }
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = (coupon: PlanCoupon) => {
    const isNew = !coupons.some(c => c.id === coupon.id);
    if (isNew) {
      setCoupons(prev => [...prev, coupon]);
      logAudit("Create", `Criou o cupom de desconto promocional '${coupon.code}'.`);
    } else {
      setCoupons(prev => prev.map(c => c.id === coupon.id ? coupon : c));
      logAudit("Edit", `Alterou configurações do cupom de desconto '${coupon.code}'.`);
    }
    setIsCouponModalOpen(false);
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    if (confirm(`Excluir cupom '${code}'?`)) {
      setCoupons(prev => prev.filter(c => c.id !== id));
      logAudit("Delete", `Deletou o cupom de desconto '${code}'.`);
    }
  };

  // Calculate Upgrade/Downgrade pro-rata differences in real time
  const handleUpgradeSelectPlan = (newPlanId: string) => {
    setSelectedNewPlanId(newPlanId);
    if (!activeSubForChange) return;

    const currentPlan = plans.find(p => p.id === activeSubForChange.planId);
    const targetPlan = plans.find(p => p.id === newPlanId);

    if (!currentPlan || !targetPlan) return;

    const currentPrice = currentPlan.pricing.monthly;
    const targetPrice = targetPlan.pricing.monthly;
    
    const isUpgrade = targetPrice > currentPrice;
    
    const daysRemaining = 18;
    const dailyCurrent = currentPrice / 30;
    const dailyTarget = targetPrice / 30;
    
    const currentUnusedValue = dailyCurrent * daysRemaining;
    const targetRequiredValue = dailyTarget * daysRemaining;
    const proRataDiff = Math.max(0, parseFloat((targetRequiredValue - currentUnusedValue).toFixed(2)));

    setUpgradePreview({
      isUpgrade,
      proRataAmount: proRataDiff,
      message: isUpgrade 
        ? `Upgrade imediato de '${currentPlan.name}' para '${targetPlan.name}'. Valor pro-rata a ser faturado agora: R$ ${proRataDiff.toFixed(2)} (referente aos ${daysRemaining} dias restantes). A partir do próximo ciclo, o valor cheio de R$ ${targetPrice.toFixed(2)} será cobrado.`
        : `Downgrade agendado para o próximo ciclo de faturamento (${new Date(activeSubForChange.nextBillingAt).toLocaleDateString('pt-BR')}). Sem cobrança imediata. Limites de recursos do plano '${targetPlan.name}' serão aplicados na data de renovação.`
    });
  };

  // Perform active subscription plan migration (Upgrade/Downgrade)
  const executePlanMigration = () => {
    if (!activeSubForChange || !selectedNewPlanId || !upgradePreview) return;
    const targetPlan = plans.find(p => p.id === selectedNewPlanId);
    if (!targetPlan) return;

    const updatedSub = subscriptions.map(sub => {
      if (sub.id === activeSubForChange.id) {
        const newHistory = [
          {
            timestamp: new Date().toISOString(),
            event: `${upgradePreview.isUpgrade ? "Upgrade" : "Downgrade"} de '${sub.planName}' para '${targetPlan.name}' (Pro-rata: R$ ${upgradePreview.proRataAmount})`,
            amount: upgradePreview.isUpgrade ? upgradePreview.proRataAmount : 0,
            actor: "André Luis (Super Admin)"
          },
          ...sub.history
        ];

        return {
          ...sub,
          planId: targetPlan.id,
          planName: targetPlan.name,
          planColor: targetPlan.color,
          amount: targetPlan.pricing.monthly,
          history: newHistory
        };
      }
      return sub;
    });

    setSubscriptions(updatedSub);
    logAudit(
      upgradePreview.isUpgrade ? "Upgrade" : "Downgrade",
      `Migrou a assinatura da empresa/técnico '${activeSubForChange.targetName}' para o plano '${targetPlan.name}'.`,
      targetPlan.id,
      targetPlan.name
    );

    setIsUpgradeModalOpen(false);
    setActiveSubForChange(null);
    setSelectedNewPlanId("");
    setUpgradePreview(null);
    alert("Assinatura migrada e recalculada com sucesso no sistema financeiro!");
  };

  // Suspend/Reactivate/Cancel subscription helper
  const handleToggleSubscriptionStatus = (subId: string, newStatus: Subscription['status']) => {
    const sub = subscriptions.find(s => s.id === subId);
    if (!sub) return;
    
    setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, status: newStatus } : s));
    logAudit("StatusChange", `Status da assinatura de '${sub.targetName}' alterado de '${sub.status}' para '${newStatus}'.`);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. PLANS MODULE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0e1222] border border-[#1d243a] p-6 rounded-3xl text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-bold font-display tracking-tight text-white">NexoraField Billing & Revenue Platform</h2>
          </div>
          <p className="text-xs text-slate-400">
            Console do Super Administrador para gerenciar faturamento, ciclos de cobrança, intermedições split payment, termos SaaS e inteligência financeira.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              const newPlan = createEmptyPlan("Empresa");
              setEditingPlan(newPlan);
              setIsPlanModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Novo Plano
          </button>
          <button 
            onClick={() => handleOpenCouponModal(null)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Tag className="h-4 w-4 text-cyan-400" /> Novo Cupom
          </button>
        </div>
      </div>

      {/* 2. CATEGORIZED SUB-MENU NAVIGATION */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1 bg-[#121622] p-1.5 rounded-2xl border border-[#1d243a] text-xs font-semibold text-slate-400">
          
          <button 
            onClick={() => setSubTab('dash')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${subTab === 'dash' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'hover:text-white'}`}
          >
            <BarChart3 className="h-4 w-4" /> Dashboard Geral
          </button>

          <div className="h-6 w-px bg-slate-800 self-center"></div>

          <button 
            onClick={() => setSubTab('companies')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${subTab === 'companies' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            <Building2 className="h-4 w-4" /> Planos Empresas
          </button>
          <button 
            onClick={() => setSubTab('techs')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${subTab === 'techs' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            <HardHat className="h-4 w-4" /> Planos Técnicos
          </button>
          <button 
            onClick={() => setSubTab('partners')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${subTab === 'partners' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            <Users className="h-4 w-4" /> Planos Parceiros
          </button>

          <div className="h-6 w-px bg-slate-800 self-center"></div>

          <button 
            onClick={() => setSubTab('subscriptions')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${subTab === 'subscriptions' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            <CreditCard className="h-4 w-4" /> Assinaturas
          </button>
          <button 
            onClick={() => setSubTab('finance')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${subTab === 'finance' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            <Landmark className="h-4 w-4" /> Centro Financeiro
          </button>
          <button 
            onClick={() => setSubTab('billing')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${subTab === 'billing' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            <Settings className="h-4 w-4" /> Ciclos & Split
          </button>
          <button 
            onClick={() => setSubTab('contracts')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${subTab === 'contracts' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            <FileText className="h-4 w-4" /> Contratos SaaS
          </button>

          <div className="h-6 w-px bg-slate-800 self-center"></div>

          <button 
            onClick={() => setSubTab('ai_advisor')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${subTab === 'ai_advisor' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            <Sparkles className="h-4 w-4" /> IA Financeira
          </button>
          <button 
            onClick={() => setSubTab('integrations')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${subTab === 'integrations' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            <Radio className="h-4 w-4" /> Integrações
          </button>
          <button 
            onClick={() => setSubTab('coupons')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${subTab === 'coupons' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            <Tag className="h-4 w-4" /> Cupons
          </button>
          <button 
            onClick={() => setSubTab('audit')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${subTab === 'audit' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            <History className="h-4 w-4" /> Auditoria
          </button>

        </div>
      </div>

      {/* 3. DYNAMIC CONTENT RENDERING */}

      {/* TABS CORRESPONDENCE */}
      {subTab === 'dash' && (
        <BillingDashboard 
          plans={plans}
          subscriptions={subscriptions}
          companies={companies}
          technicians={technicians}
        />
      )}

      {subTab === 'finance' && (
        <BillingFinancialCenter 
          companies={companies}
          technicians={technicians}
        />
      )}

      {subTab === 'billing' && (
        <BillingEngine 
          onLogAudit={(action, details) => logAudit(action as any, details)}
        />
      )}

      {subTab === 'contracts' && (
        <BillingContracts 
          onLogAudit={(action, details) => logAudit(action as any, details)}
        />
      )}

      {subTab === 'ai_advisor' && (
        <BillingAIAssistant />
      )}

      {subTab === 'integrations' && (
        <BillingIntegrations 
          onLogAudit={(action, details) => logAudit(action as any, details)}
        />
      )}

      {/* ORIGINAL CHANNELS (COMPANIES, TECHS, PARTNERS) */}
      {(subTab === 'companies' || subTab === 'techs' || subTab === 'partners') && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Pesquisar planos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs p-2.5 pl-9 rounded-xl border border-slate-800 bg-[#0b0e1a] focus:outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans
              .filter(p => {
                const targetType = subTab === 'companies' ? 'Empresa' : subTab === 'techs' ? 'Técnico' : 'Parceiro';
                if (p.type !== targetType) return false;
                if (searchQuery) {
                  return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase());
                }
                return true;
              })
              .map(plan => (
                <div 
                  key={plan.id}
                  className="bg-[#0b0e1a] border border-[#1d2440] rounded-3xl p-6 relative flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-xl text-white"
                >
                  {plan.recommended && (
                    <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider animate-pulse">
                      ★ Recomendado
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-3 rounded-2xl"
                        style={{ backgroundColor: `${plan.color}25`, border: `1.5px solid ${plan.color}` }}
                      >
                        {plan.icon === 'Building2' && <Building2 className="h-5 w-5" style={{ color: plan.color }} />}
                        {plan.icon === 'Sparkles' && <Sparkles className="h-5 w-5" style={{ color: plan.color }} />}
                        {plan.icon === 'ShieldCheck' && <ShieldCheck className="h-5 w-5" style={{ color: plan.color }} />}
                        {plan.icon === 'HardHat' && <HardHat className="h-5 w-5" style={{ color: plan.color }} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
                          {plan.name}
                          <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${plan.status === 'Ativo' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                            {plan.status}
                          </span>
                        </h3>
                        <span className="text-[10px] text-slate-500 font-mono">Código: {plan.code} | {plan.category}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px]">{plan.description}</p>

                    <div className="bg-[#0a0c16] border border-slate-900 p-4 rounded-2xl flex justify-between items-baseline">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Mensalidade</span>
                        <span className="text-lg font-black text-white">R$ {plan.pricing.monthly}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Setup</span>
                        <span className="text-xs font-semibold text-slate-300">R$ {plan.pricing.setupFee}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs border-b border-slate-900 pb-2">
                      <span className="text-slate-400">Taxa Intermediação:</span>
                      <span className="font-mono font-bold text-indigo-400">
                        {plan.commission.type === 'percentual' ? `${plan.commission.percentage}%` : `R$ ${plan.commission.flatAmount}`}
                      </span>
                    </div>

                    {/* Limits */}
                    <div className="bg-[#0f1326]/60 p-3 rounded-xl space-y-1 text-[11px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Chamados por mês:</span>
                        <span className="font-semibold text-white">{plan.limits.maxTicketsPerMonth === 9999 ? "Ilimitados" : `${plan.limits.maxTicketsPerMonth}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Técnicos suportados:</span>
                        <span className="font-semibold text-white">{plan.limits.maxTechnicians === 999 ? "Ilimitados" : `${plan.limits.maxTechnicians}`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6 border-t border-slate-900 pt-4">
                    <button 
                      onClick={() => {
                        setEditingPlan(plan);
                        setIsPlanModalOpen(true);
                      }}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-indigo-400" /> Configurar
                    </button>
                    <button 
                      onClick={() => handleDuplicatePlan(plan)}
                      className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded-xl cursor-pointer"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeletePlan(plan.id, plan.name)}
                      className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ORIGINAL ACTIVE SUBSCRIPTIONS */}
      {subTab === 'subscriptions' && (
        <div className="space-y-6">
          <div className="bg-[#0b0e1a] border border-[#1d2440] p-6 rounded-3xl space-y-4">
            <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
              <div>
                <h3 className="font-bold text-white text-base">Contrato & Assinaturas Ativas</h3>
                <p className="text-xs text-slate-400">Mapeamento de faturamento recorrente ativo na rede NexoraField.</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="Pesquisar..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-xs p-2.5 rounded-xl border border-slate-800 bg-[#0f1326] text-slate-200"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-900">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0e1222] text-slate-400 font-mono border-b border-slate-900">
                    <th className="p-4">Cliente / Assinante</th>
                    <th className="p-4">Plano</th>
                    <th className="p-4">Valor</th>
                    <th className="p-4">Cobrança</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 bg-slate-950/40 text-slate-300">
                  {subscriptions
                    .filter(s => searchQuery ? s.targetName.toLowerCase().includes(searchQuery.toLowerCase()) : true)
                    .map(sub => (
                      <tr key={sub.id} className="hover:bg-[#0f1326]/40 transition-colors">
                        <td className="p-4 font-bold text-slate-200">
                          {sub.targetName}
                          <span className="block text-[10px] text-slate-500 font-mono font-normal">{sub.targetType}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-900" style={{ color: sub.planColor }}>
                            {sub.planName}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-white">R$ {sub.amount.toFixed(2)}</td>
                        <td className="p-4 font-mono">{new Date(sub.nextBillingAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.status === 'Ativa' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button 
                              onClick={() => {
                                setActiveSubForChange(sub);
                                setSelectedNewPlanId(sub.planId);
                                setIsUpgradeModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer"
                            >
                              Migrar
                            </button>
                            <button 
                              onClick={() => handleToggleSubscriptionStatus(sub.id, sub.status === 'Ativa' ? 'Suspensa' : 'Ativa')}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded-lg cursor-pointer"
                            >
                              {sub.status === 'Ativa' ? 'Suspender' : 'Reativar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ORIGINAL COUPONS */}
      {subTab === 'coupons' && (
        <div className="space-y-6">
          <div className="bg-[#0b0e1a] border border-[#1d2440] p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-base">Cupons de Desconto</h3>
                <p className="text-xs text-slate-400">Códigos promocionais homologados pelo Super Administrador.</p>
              </div>
              <button 
                onClick={() => handleOpenCouponModal(null)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Novo Cupom
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map(coupon => (
                <div key={coupon.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-900 flex flex-col justify-between text-white">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-mono text-xs font-black text-cyan-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        {coupon.code}
                      </span>
                      <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded">{coupon.status}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-bold">{coupon.description}</p>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Desconto: {coupon.discountType === 'percentage' ? `${coupon.value}%` : `R$ ${coupon.value}`} | Utilizações: {coupon.usedQuantity}/{coupon.quantityLimit}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-900">
                    <button 
                      onClick={() => handleOpenCouponModal(coupon)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 rounded-lg cursor-pointer py-1"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                      className="p-1 bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ORIGINAL AUDITOR TRAIL */}
      {subTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-[#0b0e1a] border border-[#1d2440] p-6 rounded-3xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Logs de Auditoria do Sistema</h3>
              <p className="text-xs text-slate-400">Rastreamento inalterável de modificações e concessão de descontos.</p>
            </div>

            <div className="space-y-3">
              {auditLogs.map(log => (
                <div key={log.id} className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex justify-between items-start text-xs text-slate-300">
                  <div>
                    <span className="font-bold text-slate-200">{log.actorName}</span>
                    <p className="mt-1 font-mono">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}

      {/* PLAN MODAL */}
      {isPlanModalOpen && editingPlan && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#0b0e1a] border border-[#1d2440] text-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <h3 className="font-bold text-base">Configurar Parâmetros de Plano</h3>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">NOME PLANO</label>
                  <input type="text" className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white" value={editingPlan.name} onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">MENSALIDADE (R$)</label>
                  <input type="number" className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white" value={editingPlan.pricing.monthly} onChange={(e) => setEditingPlan({ ...editingPlan, pricing: { ...editingPlan.pricing, monthly: parseFloat(e.target.value) || 0 } })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">SETUP FEE (R$)</label>
                  <input type="number" className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white" value={editingPlan.pricing.setupFee} onChange={(e) => setEditingPlan({ ...editingPlan, pricing: { ...editingPlan.pricing, setupFee: parseFloat(e.target.value) || 0 } })} />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">PORCENTAGEM COMISSÃO (%)</label>
                  <input type="number" className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white" value={editingPlan.commission.percentage} onChange={(e) => setEditingPlan({ ...editingPlan, commission: { ...editingPlan.commission, percentage: parseFloat(e.target.value) || 0 } })} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-900 pt-3">
              <button onClick={() => setIsPlanModalOpen(false)} className="bg-slate-900 px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white">Cancelar</button>
              <button onClick={() => handleSavePlan(editingPlan)} className="bg-indigo-600 px-5 py-2 rounded-xl text-xs font-bold text-white hover:bg-indigo-500">Salvar Plano</button>
            </div>
          </div>
        </div>
      )}

      {/* PLAN MIGRATION PRO-RATA MODAL */}
      {isUpgradeModalOpen && activeSubForChange && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b0e1a] border border-[#1d2440] text-white rounded-3xl max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <h3 className="font-bold text-base">Migrar Assinatura (Pro-Rata)</h3>
              <button onClick={() => setIsUpgradeModalOpen(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                <span className="text-[10px] text-slate-500 font-mono block">ASSINANTE</span>
                <span className="font-bold text-white block mt-1">{activeSubForChange.targetName}</span>
                <span className="text-slate-400 block mt-0.5">Plano Atual: {activeSubForChange.planName} (R$ {activeSubForChange.amount}/mês)</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono">SELECIONE O NOVO PLANO</label>
                <select 
                  className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white"
                  value={selectedNewPlanId}
                  onChange={(e) => handleUpgradeSelectPlan(e.target.value)}
                >
                  <option value="" disabled>Selecione...</option>
                  {plans
                    .filter(p => p.type === activeSubForChange.targetType && p.id !== activeSubForChange.planId)
                    .map(p => (
                      <option key={p.id} value={p.id}>{p.name} (R$ {p.pricing.monthly}/mês)</option>
                    ))}
                </select>
              </div>

              {upgradePreview && (
                <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-900/60 text-indigo-300 leading-relaxed font-mono text-[10px]">
                  {upgradePreview.message}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
              <button onClick={() => setIsUpgradeModalOpen(false)} className="bg-slate-900 px-4 py-2 rounded-xl text-xs font-bold text-slate-400">Cancelar</button>
              <button onClick={executePlanMigration} disabled={!selectedNewPlanId} className="bg-indigo-600 disabled:opacity-40 px-5 py-2 rounded-xl text-xs font-bold text-white">Confirmar Transição</button>
            </div>
          </div>
        </div>
      )}

      {/* COUPON MODAL */}
      {isCouponModalOpen && editingCoupon && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b0e1a] border border-[#1d2440] text-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <h3 className="font-bold text-base">Configurar Cupom Promocional</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block">CÓDIGO CUPOM</label>
                <input type="text" className="w-full bg-slate-950 p-2 rounded-xl border border-slate-800 text-white font-mono uppercase" value={editingCoupon.code} onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono block">DESCONTO (%)</label>
                <input type="number" className="w-full bg-slate-950 p-2 rounded-xl border border-slate-800 text-white" value={editingCoupon.value} onChange={(e) => setEditingCoupon({ ...editingCoupon, value: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono block">DESCRIÇÃO</label>
                <input type="text" className="w-full bg-slate-950 p-2 rounded-xl border border-slate-800 text-white" value={editingCoupon.description} onChange={(e) => setEditingCoupon({ ...editingCoupon, description: e.target.value })} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
              <button onClick={() => setIsCouponModalOpen(false)} className="bg-slate-900 px-4 py-2 rounded-xl text-xs font-bold text-slate-400">Cancelar</button>
              <button onClick={() => handleSaveCoupon(editingCoupon)} className="bg-indigo-600 px-5 py-2 rounded-xl text-xs font-bold text-white">Salvar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
