/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  Wallet, 
  TrendingUp, 
  Building2, 
  FileText, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Plus, 
  MoreVertical, 
  TrendingDown, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ChevronRight, 
  ChevronLeft, 
  Mail, 
  Lock, 
  Eye, 
  ArrowRight, 
  ArrowLeft,
  Filter,
  Download,
  Upload,
  MessageSquare,
  History,
  Rocket,
  BarChart3,
  Handshake,
  ShieldCheck,
  UserPlus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Screen = 
  | 'login' 
  | 'dashboard' 
  | 'goals' 
  | 'users' 
  | 'recovery' 
  | 'planning' 
  | 'okrs' 
  | 'finance' 
  | 'revenue' 
  | 'expenses' 
  | 'commercial' 
  | 'leads'
  | 'settings';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  company: string;
  avatar?: string;
  status: string;
}

interface Goal {
  id: number;
  indicator: string;
  target: string;
  current: string;
  progress: number;
  status: string;
}

interface OKR {
  id: number;
  objective: string;
  progress: number;
  quarter: string;
  krs: KR[];
}

interface KR {
  id: number;
  okr_id: number;
  label: string;
  value: string;
  progress: number;
}

interface Transaction {
  id: number;
  client?: string;
  provider?: string;
  date?: string;
  due_date?: string;
  category: string;
  value: number;
  status: string;
}

interface Lead {
  id: number;
  name: string;
  company: string;
  source: string;
  status: string;
  score: number;
}

interface Opportunity {
  id: number;
  name: string;
  sales: number;
  target: number;
  revenue: number;
}

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick,
  badge 
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick: () => void,
  badge?: string 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
      active 
        ? "bg-primary text-white font-bold" 
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    <Icon size={20} />
    <span className="flex-1 text-left">{label}</span>
    {badge && (
      <span className={cn(
        "px-1.5 py-0.5 rounded text-[10px] font-bold",
        active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
      )}>
        {badge}
      </span>
    )}
  </button>
);

const MetricCard = ({ 
  label, 
  value, 
  trend, 
  trendValue, 
  icon: Icon, 
  color = "primary",
  subtitle,
  progress
}: { 
  label: string, 
  value: string, 
  trend?: 'up' | 'down' | 'neutral', 
  trendValue?: string, 
  icon: any, 
  color?: string,
  subtitle?: string,
  progress?: number
}) => (
  <div className="bg-white p-5 rounded-xl border border-border-dark">
    <div className="flex justify-between items-start mb-4">
      <span className={cn("p-2 rounded-lg", `bg-${color}/10 text-${color}`)}>
        <Icon size={20} />
      </span>
      {trendValue && (
        <span className={cn(
          "text-[10px] font-bold px-2 py-1 rounded-full",
          trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : 
          trend === 'down' ? "bg-red-500/10 text-red-500" : "bg-slate-500/10 text-slate-500"
        )}>
          {trendValue}
        </span>
      )}
    </div>
    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
    <h3 className="text-2xl font-extrabold mt-1">{value}</h3>
    {subtitle && <p className="text-[11px] text-slate-500 mt-2 italic">{subtitle}</p>}
    {progress !== undefined && (
      <div className="mt-4">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-slate-400">Progresso Meta</span>
          <span className="text-primary font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-border-dark h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    )}
  </div>
);

const Layout = ({ children, currentScreen, setScreen }: { children: React.ReactNode, currentScreen: Screen, setScreen: (s: Screen) => void }) => {
  const isAuthScreen = currentScreen === 'login' || currentScreen === 'recovery';

  if (isAuthScreen) return <>{children}</>;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-border-dark flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <Building2 size={24} strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-slate-900 text-base font-bold leading-none">Hub Coworking</h1>
            <p className="text-primary text-[10px] font-bold uppercase tracking-wider mt-1">Management Console</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={currentScreen === 'dashboard'} onClick={() => setScreen('dashboard')} />
          <SidebarItem icon={Target} label="Metas" active={currentScreen === 'goals'} onClick={() => setScreen('goals')} />
          <SidebarItem icon={TrendingUp} label="Planejamento" active={currentScreen === 'planning'} onClick={() => setScreen('planning')} />
          <SidebarItem icon={ShieldCheck} label="OKRs" active={currentScreen === 'okrs'} onClick={() => setScreen('okrs')} />
          
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Financeiro</div>
          <SidebarItem icon={Wallet} label="Financeiro" active={currentScreen === 'finance'} onClick={() => setScreen('finance')} />
          <SidebarItem icon={TrendingUp} label="Receitas" active={currentScreen === 'revenue'} onClick={() => setScreen('revenue')} />
          <SidebarItem icon={Wallet} label="Despesas" active={currentScreen === 'expenses'} onClick={() => setScreen('expenses')} />
          
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Comercial</div>
          <SidebarItem icon={Handshake} label="Dashboard" active={currentScreen === 'commercial'} onClick={() => setScreen('commercial')} />
          <SidebarItem icon={Users} label="Leads" active={currentScreen === 'leads'} onClick={() => setScreen('leads')} badge="128" />
          
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin</div>
          <SidebarItem icon={Users} label="Usuários" active={currentScreen === 'users'} onClick={() => setScreen('users')} />
          <SidebarItem icon={Settings} label="Configurações" active={currentScreen === 'settings'} onClick={() => setScreen('settings')} />
        </nav>

        <div className="p-4 border-t border-border-dark">
          <div className="flex items-center gap-3 p-2 mb-4">
            <div className="size-10 rounded-full border-2 border-primary overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7Lues9z7AsCLNlM4VsfAtEo0uiGsHVAFwpAoIpExHH6qVRbrCk0W5U63x90ZLBnSBYUZLcywaxYXT_rihuz2u61U4YggnT8CM9gWrWkbG6oI5NWgn8yfdKYsQU9lnOTfxQ_XL7b08bgjPM2d5LdEUBWs_AxyIKQFoQexQv_bpOogcJ1TMUp3YGgeW2J3Q6-0yoAJTGIkMD14wSNa7AFhCfSElrVtnIb6l7jhHDL7BVGG2AAHBxiHXaV-8b1b5zimfYKa7S-WK5c1K" 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">Ricardo Silva</p>
              <p className="text-[10px] text-slate-500 truncate">CEO & Founder</p>
            </div>
          </div>
          <button 
            onClick={() => setScreen('login')}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded-lg text-sm font-bold transition-all"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-border-dark">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold tracking-tight capitalize text-slate-900">{currentScreen.replace('-', ' ')}</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                className="w-full bg-slate-50 border-border-dark border rounded-lg pl-10 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                placeholder="Buscar..." 
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-dark"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-background-dark/50 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// --- Screens ---

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
    <div className="w-full max-w-md flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-primary rounded-xl p-3 mb-2">
          <Building2 size={40} className="text-white" strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Hub <span className="text-primary">Coworking</span></h1>
        <p className="text-slate-500 font-medium">Acesse sua estação de trabalho</p>
      </div>

      <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-xl">
        <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">E-mail corporativo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900" 
                placeholder="exemplo@empresa.com" 
                type="email"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">Sua senha</label>
              <button type="button" className="text-xs font-bold text-primary hover:underline">Esqueci minha senha</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900" 
                placeholder="Digite sua senha" 
                type="password"
                required
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors" type="button">
                <Eye size={20} />
              </button>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="peer h-5 w-5 rounded border-slate-300 bg-transparent text-primary focus:ring-offset-0 focus:ring-primary" />
            <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">Lembrar de mim neste dispositivo</span>
          </label>

          <button className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 group" type="submit">
            <span>ENTRAR NO HUB</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4">
          <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest">Ou acesse com</p>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiRZfJPA5te8hyq9MkO1hKOlQqr7umhCha21UHPTOMJTKyhCuWxYK_QRIZdVz81yb_rvpWlpj0KXdsReGiYrKy5R77sPHT8t_X3EdHj1LksF1KKS6JTnNv3y-J_s7o3ExxWMxdVnzB1ayu5xhpUdMaZP_rK5or7kP998u3qay5Ywyf17cLuwbcM3SJeXpfSFZ4AbH6SBiFnwyu-NIwQmpRpvfNXkymqIKa4zfGuv-k0wShInNcrJoPx9IDvS1eAmHyRlMu1AyIfuWD" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
              <span className="text-sm font-semibold text-slate-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcBGyIRAiSVG1SMJcBY6tonawe2k99glS6VJz1omm2UOKV8Ux1gPVyxhlTyXfr6mtAZUkeMRYbK5_TfS2jDMwWAdUKv6KcsmqMmX42LfyUNxywb6TmIiiXOx987hMS610VcXcih6fyZzHGos7-2-QLCAuQC9P_yceJFpiRsTTs9HStvunMU77bzxPi4Mo4KTHYx7_ewSNBeC6-0oajy-uyScVbZgOGF-XXn7kPidxLvrVctAoPzeBgDIaoZu2nRK7DAFYU2Lojo_eS" alt="LinkedIn" className="w-5 h-5" referrerPolicy="no-referrer" />
              <span className="text-sm font-semibold text-slate-700">LinkedIn</span>
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-slate-500">
        Não tem uma conta? <button className="text-primary font-bold hover:underline">Solicite seu acesso</button>
      </p>
    </div>
  </div>
);

const DashboardScreen = ({ revenue, expenses, goals, leads }: { revenue: Transaction[], expenses: Transaction[], goals: Goal[], leads: Lead[] }) => {
  const totalRevenue = revenue.reduce((acc, curr) => acc + curr.value, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.value, 0);
  const occupation = goals.find(g => g.indicator === 'Ocupação Média')?.current || '78%';

  const data = [
    { name: 'Jan', mrr: 45000 },
    { name: 'Fev', mrr: 52000 },
    { name: 'Mar', mrr: 48000 },
    { name: 'Abr', mrr: 61000 },
    { name: 'Mai', mrr: 75000 },
    { name: 'Jun', mrr: totalRevenue > 0 ? totalRevenue : 85400 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Receita Total" value={`R$ ${totalRevenue.toLocaleString()}`} trend="up" trendValue="+12.4%" icon={TrendingUp} />
        <MetricCard label="Despesas Totais" value={`R$ ${totalExpenses.toLocaleString()}`} trend="up" trendValue="+8%" icon={Wallet} color="red-500" />
        <MetricCard label="Taxa de Churn" value="4.2%" trend="down" trendValue="+0.5%" icon={Users} subtitle="Abaixo do benchmark (5.0%)" color="red-500" />
        <MetricCard label="Ocupação Geral" value={occupation} trend="neutral" trendValue="-2%" icon={Building2} subtitle="Foco: Unidade Vila Olímpia" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-border-dark">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-bold text-slate-800">Evolução de MRR (Semestral)</h4>
            <select className="bg-slate-50 border-border-dark text-[10px] rounded px-2 py-1 outline-none text-slate-500">
              <option>Últimos 6 meses</option>
              <option>Ano atual</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="mrr" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border-dark">
          <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Rocket size={18} className="text-primary" />
            Alertas Inteligentes
          </h4>
          <div className="space-y-4">
            {[
              { title: 'Risco de Churn Elevado', desc: '3 contas premium reduziram uso em 60% na unidade Pinheiros.', type: 'error' },
              { title: 'Capacidade de Eventos', desc: 'Sala de eventos Jardins atingiu 95% de reserva para Julho.', type: 'warning' },
              { title: 'Oportunidade de Upsell', desc: '15 membros de \'Hot Desk\' podem migrar para \'Dedicated Desk\'.', type: 'success' },
              { title: 'Manutenção Preventiva', desc: 'Ar-condicionado auditório Studio B precisa de revisão.', type: 'info' },
            ].map((alert, i) => (
              <div key={i} className={cn(
                "flex gap-4 p-3 rounded-lg border-l-2",
                alert.type === 'error' ? "bg-red-500/5 border-red-500" :
                alert.type === 'warning' ? "bg-amber-500/5 border-amber-500" :
                alert.type === 'success' ? "bg-emerald-500/5 border-emerald-500" : "bg-blue-500/5 border-blue-500"
              )}>
                <div className="flex-shrink-0">
                  {alert.type === 'error' ? <AlertCircle size={18} className="text-red-500" /> :
                   alert.type === 'warning' ? <AlertCircle size={18} className="text-amber-500" /> :
                   alert.type === 'success' ? <TrendingUp size={18} className="text-emerald-500" /> : <Info size={18} className="text-blue-500" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{alert.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-[10px] text-primary hover:underline font-bold uppercase tracking-widest">Ver todos os insights</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl border border-border-dark">
          <h4 className="text-sm font-bold text-slate-800 mb-8">Receita por Unidade de Negócio</h4>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Coworking', value: 42 },
                    { name: 'Endereço Fiscal', value: 28 },
                    { name: 'Eventos', value: 18 },
                    { name: 'Estúdio', value: 12 },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#f97316" />
                  <Cell fill="#ea580c" />
                  <Cell fill="#fb923c" />
                  <Cell fill="#e2e8f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-slate-900">100%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Market Share</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              { label: 'Coworking', val: '42%', color: 'bg-primary' },
              { label: 'Endereço Fiscal', val: '28%', color: 'bg-orange-600' },
              { label: 'Eventos', val: '18%', color: 'bg-orange-400' },
              { label: 'Estúdio', val: '12%', color: 'bg-slate-200' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={cn("w-3 h-3 rounded-full", item.color)}></span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold leading-none">{item.label}</span>
                  <span className="text-xs font-bold text-slate-900">{item.val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-border-dark">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-bold text-slate-800">Novos Contratos em Negociação</h4>
            <button className="text-primary text-xs font-bold hover:underline">Ver Pipeline</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-500 font-bold uppercase border-b border-border-dark">
                <tr>
                  <th className="pb-3 px-2">Empresa / Cliente</th>
                  <th className="pb-3 px-2">Unidade</th>
                  <th className="pb-3 px-2">Valor</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {leads.slice(0, 4).map((row, i) => (
                  <tr key={i} className="border-b border-border-dark/50 hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className={cn("size-8 rounded flex items-center justify-center text-white font-bold text-xs bg-primary/20 text-primary")}>
                          {row.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-semibold text-slate-900">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-slate-500">{row.company}</td>
                    <td className="py-4 px-2 font-bold text-slate-900">R$ {(row.score * 100).toLocaleString()}</td>
                    <td className="py-4 px-2">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", `bg-primary/10 text-primary`)}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button className="text-slate-400 group-hover:text-primary transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoalsScreen = ({ goals, onAdd, onDelete }: { goals: Goal[], onAdd: (g: Partial<Goal>) => void, onDelete: (id: number) => void }) => (
  <div className="space-y-8">
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Check-in de Metas Semanais</h2>
        <p className="text-slate-500">Acompanhe e atualize os indicadores de performance da unidade.</p>
      </div>
      <button 
        onClick={() => onAdd({ indicator: 'Nova Meta', target: '100%', current: '0%', progress: 0, status: 'Em progresso' })}
        className="bg-primary hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/10"
      >
        <Plus size={20} />
        Iniciar Check-in
      </button>
    </header>

    <div className="border-b border-border-dark overflow-x-auto">
      <div className="flex gap-8 whitespace-nowrap min-w-max">
        <button className="pb-4 text-sm font-bold border-b-2 border-primary text-primary transition-all">Esta Semana</button>
        <button className="pb-4 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-all">Semana Passada</button>
        <button className="pb-4 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-all">Outubro/2023</button>
        <button className="pb-4 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-all">Histórico Completo</button>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-border-dark overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-border-dark">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Indicador</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Meta</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Realizado</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">% Atingimento</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-dark">
            {goals.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Target size={18} />
                    </div>
                    <span className="font-bold text-slate-900">{row.indicator}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-500 font-medium text-sm">{row.target}</td>
                <td className="px-6 py-5 text-slate-500 font-medium text-sm">{row.current}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full", row.progress === 100 ? "bg-green-500" : "bg-primary")} style={{ width: `${row.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-800">{row.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={cn(
                    "px-3 py-1 text-[11px] font-black uppercase rounded-full border",
                    row.status === 'Em progresso' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                    row.status === 'Atenção' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                    row.status === 'Batida' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-primary/20 text-primary border-primary/30"
                  )}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => onDelete(row.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white border border-border-dark rounded-xl shadow-sm">
        <p className="text-sm font-semibold text-slate-500 mb-1">Média de Atingimento</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">91.0%</span>
          <span className="text-xs font-bold text-green-500">+2.4% vs u.s.</span>
        </div>
      </div>
      <div className="p-6 bg-white border border-border-dark rounded-xl shadow-sm">
        <p className="text-sm font-semibold text-slate-500 mb-1">Status da Unidade</p>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-green-500"></span>
          <span className="text-xl font-bold text-slate-900">Performando</span>
        </div>
      </div>
      <div className="p-6 bg-primary border border-primary rounded-xl shadow-lg shadow-primary/20 flex flex-col justify-between">
        <p className="text-sm font-bold text-white mb-1">Dica da Semana</p>
        <p className="text-sm text-white/90 font-medium leading-relaxed">Foque nos leads pendentes para bater a meta de vendas até sexta-feira.</p>
      </div>
    </div>
  </div>
);

const UsersScreen = ({ users, onAdd, onDelete }: { users: User[], onAdd: (u: Partial<User>) => void, onDelete: (id: number) => void }) => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-slate-900 text-4xl font-extrabold tracking-tight">Gestão de Usuários</h1>
        <p className="text-slate-500 text-lg">Gerencie membros da equipe e suas permissões de acesso ao sistema.</p>
      </div>
      <button 
        onClick={() => onAdd({ name: 'Novo Usuário', email: 'novo@email.com', role: 'Membro', company: 'Empresa', status: 'Ativo' })}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-orange-600 text-white px-6 py-3 font-bold transition-all shadow-lg shadow-primary/10"
      >
        <UserPlus size={20} />
        <span>Convidar Novo Usuário</span>
      </button>
    </div>

    <div className="bg-white rounded-xl p-4 border border-border-dark flex flex-col lg:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          className="w-full bg-slate-50 border-border-dark border rounded-lg py-3 pl-11 pr-4 text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400" 
          placeholder="Buscar por nome, cargo ou e-mail..." 
          type="text"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="flex items-center gap-2 bg-slate-50 border border-border-dark rounded-lg px-4 py-3 text-slate-700 hover:border-primary transition-colors text-sm font-medium">
          <Filter size={18} className="text-primary" />
          Cargo: Todos
        </button>
        <button className="flex items-center gap-2 bg-slate-50 border border-border-dark rounded-lg px-4 py-3 text-slate-700 hover:border-primary transition-colors text-sm font-medium">
          <ShieldCheck size={18} className="text-primary" />
          Status: Ativos
        </button>
        <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 px-4 py-3 text-sm transition-colors">
          <History size={18} />
          Limpar Filtros
        </button>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-border-dark overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-border-dark">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nome & E-mail</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Cargo</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Último Acesso</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-dark">
            {users.map((user, i) => (
              <tr key={i} className="hover:bg-primary/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-semibold">{user.name}</span>
                      <span className="text-slate-500 text-xs">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-tighter">{user.role}</span>
                </td>
                <td className="px-6 py-4">
                  <div className={cn("flex items-center gap-2", user.status === 'Ativo' ? "text-emerald-600" : "text-slate-500")}>
                    <span className={cn("size-2 rounded-full", user.status === 'Ativo' ? "bg-emerald-500 animate-pulse" : "bg-slate-300")}></span>
                    <span className="text-sm font-medium">{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-500 text-sm italic">Recente</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors"><FileText size={18} /></button>
                    <button 
                      onClick={() => onDelete(user.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-50 border-t border-border-dark">
        <p className="text-slate-500 text-sm">Mostrando <span className="text-slate-900 font-semibold">1-4</span> de <span className="text-slate-900 font-semibold">28</span> usuários</p>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-30" disabled><ChevronLeft size={18} /></button>
          <button className="size-8 rounded bg-primary text-white font-bold text-sm">1</button>
          <button className="size-8 rounded hover:bg-slate-100 text-slate-600 font-medium text-sm">2</button>
          <button className="size-8 rounded hover:bg-slate-100 text-slate-600 font-medium text-sm">3</button>
          <button className="p-2 rounded hover:bg-slate-100 text-slate-600"><ChevronRight size={18} /></button>
        </div>
      </div>
    </div>
  </div>
);

const PlanningScreen = () => {
  const data = [
    { month: 'Jan', real: 4000, goal: 4200 },
    { month: 'Fev', real: 4500, goal: 4400 },
    { month: 'Mar', real: 4800, goal: 4600 },
    { month: 'Abr', real: 5200, goal: 5000 },
    { month: 'Mai', real: 6100, goal: 5500 },
    { month: 'Jun', real: 7500, goal: 6200 },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Planejamento Estratégico 2026</h2>
          <p className="text-slate-500">Projeções de crescimento e distribuição de metas anuais.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-border-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 text-slate-700 hover:bg-slate-50">
            <Download size={18} /> Exportar PDF
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-600">Editar Plano</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Meta Anual MRR" value="R$ 1.2M" icon={Target} progress={65} />
        <MetricCard label="Crescimento Projetado" value="45%" icon={TrendingUp} subtitle="Baseado no histórico 2025" />
        <MetricCard label="CAC Alvo" value="R$ 450" icon={Users} subtitle="LTV/CAC atual: 4.2x" color="emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-border-dark">
          <h4 className="text-sm font-bold text-slate-800 mb-6">Rampa de Crescimento (Real vs Meta)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="real" stroke="#f97316" fill="#f9731633" strokeWidth={3} />
                <Area type="monotone" dataKey="goal" stroke="#64748b" fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-dark">
          <h4 className="text-sm font-bold text-slate-800 mb-6">Distribuição de Metas por Canal</h4>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Inbound', value: 45 },
                    { name: 'Outbound', value: 25 },
                    { name: 'Indicação', value: 20 },
                    { name: 'Parceiros', value: 10 },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#f97316" />
                  <Cell fill="#ea580c" />
                  <Cell fill="#fb923c" />
                  <Cell fill="#e2e8f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const OKRsScreen = ({ okrs, onAdd, onDelete }: { okrs: OKR[], onAdd: (o: Partial<OKR>) => void, onDelete: (id: number) => void }) => (
  <div className="space-y-8">
    <header className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-black text-slate-900">OKRs & Execução Estratégica</h2>
        <p className="text-slate-500">Objetivos e Resultados Chave para o Q1 2026.</p>
      </div>
      <div className="flex gap-4 items-center">
        <button 
          onClick={() => onAdd({ objective: 'Novo Objetivo Estratégico', progress: 0, quarter: 'Q2 2026' })}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-orange-600"
        >
          <Plus size={18} /> Novo OKR
        </button>
        <div className="bg-white p-1 rounded-lg border border-border-dark flex">
          <button className="px-4 py-1.5 bg-primary text-white rounded-md text-xs font-bold">Q1 2026</button>
          <button className="px-4 py-1.5 text-slate-500 text-xs font-bold hover:text-slate-700">Q2 2026</button>
        </div>
      </div>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {okrs.map((okr, i) => (
        <div key={i} className="bg-white p-6 rounded-xl border border-border-dark space-y-6 relative group shadow-sm">
          <button 
            onClick={() => onDelete(okr.id)}
            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
          >
            <X size={18} />
          </button>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{okr.quarter}</span>
              <h4 className="text-lg font-bold text-slate-900">{okr.objective}</h4>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-primary">{okr.progress}%</span>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Progresso Geral</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${okr.progress}%` }}></div>
          </div>
          <div className="space-y-4 pt-4">
            {okr.krs.map((kr, j) => (
              <div key={j} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">{kr.label}</span>
                  <span className="text-slate-500 font-bold">{kr.value}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-primary/60 h-full rounded-full" style={{ width: `${kr.progress}%` }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{kr.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FinanceScreen = ({ revenue }: { revenue: Transaction[] }) => {
  const totalRevenue = revenue.reduce((acc, curr) => acc + curr.value, 0);
  return (
    <div className="space-y-8">
      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-500" size={24} />
          <div>
            <p className="text-sm font-bold text-slate-100">Alerta de Runway</p>
            <p className="text-xs text-slate-400">Com base nos gastos atuais, o runway projetado é de 14 meses. Considere otimizar despesas operacionais.</p>
          </div>
        </div>
        <button className="text-xs font-bold text-red-500 hover:underline">Ver Detalhes</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard label="Receita Total" value={`R$ ${totalRevenue.toLocaleString()}`} icon={TrendingUp} />
        <MetricCard label="Receita" value="R$ 102k" icon={Wallet} color="emerald-500" />
        <MetricCard label="Projetado" value="R$ 115k" icon={BarChart3} color="blue-500" />
        <MetricCard label="Break-even" value="R$ 72k" icon={CheckCircle2} color="amber-500" />
        <MetricCard label="Margem" value="28%" icon={TrendingUp} color="purple-500" />
        <MetricCard label="Runway" value="14m" icon={History} color="red-500" />
      </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-surface-dark p-6 rounded-xl border border-border-dark">
        <h4 className="text-sm font-bold text-slate-200 mb-6">Receita Mensal vs Meta</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Jan', revenue: 82000, goal: 80000 },
              { name: 'Fev', revenue: 88000, goal: 85000 },
              { name: 'Mar', revenue: 84000, goal: 90000 },
              { name: 'Abr', revenue: 95000, goal: 95000 },
              { name: 'Mai', revenue: 102000, goal: 100000 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3d381a" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis hide />
              <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#23200f', border: '1px solid #3d381a' }} />
              <Bar dataKey="revenue" fill="#ffd900" radius={[4, 4, 0, 0]} />
              <Bar dataKey="goal" fill="#3d381a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-surface-dark p-6 rounded-xl border border-border-dark">
        <h4 className="text-sm font-bold text-slate-200 mb-6">Distribuição por Unidade</h4>
        <div className="space-y-6">
          {[
            { label: 'Pinheiros', val: 'R$ 42.500', perc: 45 },
            { label: 'Vila Olímpia', val: 'R$ 32.200', perc: 35 },
            { label: 'Jardins', val: 'R$ 18.400', perc: 20 },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">{item.label}</span>
                <span className="text-slate-100">{item.val}</span>
              </div>
              <div className="w-full h-1.5 bg-border-dark rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${item.perc}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
};

const LeadsScreen = ({ leads, onAdd, onDelete }: { leads: Lead[], onAdd: (l: Partial<Lead>) => void, onDelete: (id: number) => void }) => (
  <div className="space-y-8">
    <header className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-black text-slate-100">Gestão de Leads</h2>
        <p className="text-slate-400">Acompanhe o funil de vendas e conversão de novos membros.</p>
      </div>
      <button 
        onClick={() => onAdd({ name: 'Novo Lead', company: 'Empresa', source: 'Direto', status: 'Novo', score: 50 })}
        className="bg-primary text-black px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2"
      >
        <Plus size={20} /> Novo Lead
      </button>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { label: 'Total Leads', val: '1,284', trend: '+12%' },
        { label: 'Qualificados', val: '432', trend: '+5%' },
        { label: 'Em Reunião', val: '86', trend: '+24%' },
        { label: 'Taxa Conversão', val: '18.4%', trend: '-2%' },
      ].map((card, i) => (
        <div key={i} className="bg-surface-dark p-4 rounded-xl border border-border-dark">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.label}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-100">{card.val}</span>
            <span className={cn("text-[10px] font-bold", card.trend.startsWith('+') ? "text-emerald-500" : "text-red-500")}>{card.trend}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden">
      <div className="p-4 border-b border-border-dark flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input className="w-full bg-background-dark border-border-dark rounded-lg pl-10 pr-4 py-2 text-sm outline-none" placeholder="Pesquisar leads..." />
        </div>
        <button className="bg-background-dark border border-border-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
          <Filter size={18} /> Filtros
        </button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-white/5 text-[10px] font-bold text-slate-500 uppercase">
          <tr>
            <th className="px-6 py-3">Lead</th>
            <th className="px-6 py-3">Fonte</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Score</th>
            <th className="px-6 py-3 text-right">Ação</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {leads.map((lead, i) => (
            <tr key={i} className="border-b border-border-dark/50 hover:bg-white/5 transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-100">{lead.name}</span>
                  <span className="text-xs text-slate-500">{lead.company}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-400">{lead.source}</td>
              <td className="px-6 py-4">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold",
                  lead.status === 'Novo' ? "bg-blue-500/10 text-blue-500" :
                  lead.status === 'Qualificado' ? "bg-emerald-500/10 text-emerald-500" :
                  lead.status === 'Em Reunião' ? "bg-purple-500/10 text-purple-500" : "bg-red-500/10 text-red-500"
                )}>{lead.status}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 w-16 h-1.5 bg-border-dark rounded-full overflow-hidden">
                    <div className={cn("h-full", lead.score > 80 ? "bg-emerald-500" : lead.score > 60 ? "bg-primary" : "bg-red-500")} style={{ width: `${lead.score}%` }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{lead.score}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => onDelete(lead.id)}
                  className="text-slate-500 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const RevenueScreen = ({ revenue, onAdd, onDelete }: { revenue: Transaction[], onAdd: (r: Partial<Transaction>) => void, onDelete: (id: number) => void }) => {
  const totalRevenue = revenue.reduce((acc, curr) => acc + curr.value, 0);
  const data = [
    { month: 'Jan', revenue: 78000 },
    { month: 'Fev', revenue: 82000 },
    { month: 'Mar', revenue: 85000 },
    { month: 'Abr', revenue: 92000 },
    { month: 'Mai', revenue: 102000 },
    { month: 'Jun', revenue: totalRevenue > 0 ? totalRevenue : 115000 },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-100">Controle de Receitas</h2>
          <p className="text-slate-400">Detalhamento de faturamento por categoria e unidade.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-surface-dark border border-border-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
            <Download size={18} /> Relatório Mensal
          </button>
          <button 
            onClick={() => onAdd({ client: 'Novo Cliente', date: new Date().toISOString().split('T')[0], category: 'Assinatura', value: 1000, status: 'Pago' })}
            className="bg-primary text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
          >
            <Plus size={18} /> Nova Receita
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Faturamento Total" value={`R$ ${totalRevenue.toLocaleString()}`} trend="up" trendValue="+12%" icon={Wallet} />
        <MetricCard label="Ticket Médio" value="R$ 1.250" trend="up" trendValue="+5%" icon={TrendingUp} />
        <MetricCard label="Inadimplência" value="2.1%" trend="down" trendValue="-0.5%" icon={AlertCircle} color="red-500" />
        <MetricCard label="Previsão Próx. Mês" value="R$ 122k" trend="neutral" trendValue="Estável" icon={BarChart3} color="blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-dark p-6 rounded-xl border border-border-dark">
          <h4 className="text-sm font-bold text-slate-200 mb-6">Faturamento Mensal</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3d381a" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#23200f', border: '1px solid #3d381a' }} />
                <Area type="monotone" dataKey="revenue" stroke="#ffd900" fill="#ffd90033" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-surface-dark p-6 rounded-xl border border-border-dark">
          <h4 className="text-sm font-bold text-slate-200 mb-6">Receita por Categoria</h4>
          <div className="space-y-4">
            {[
              { label: 'Assinaturas', val: 'R$ 72.400', perc: 63 },
              { label: 'Salas de Reunião', val: 'R$ 18.200', perc: 16 },
              { label: 'Eventos', val: 'R$ 14.500', perc: 13 },
              { label: 'Outros', val: 'R$ 9.900', perc: 8 },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-slate-100">{item.val}</span>
                </div>
                <div className="w-full h-1.5 bg-border-dark rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${item.perc}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-dark overflow-hidden">
        <div className="p-4 border-b border-border-dark flex justify-between items-center">
          <h4 className="text-sm font-bold text-slate-800">Últimos Lançamentos</h4>
          <button className="text-primary text-xs font-bold hover:underline">Ver Todos</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Categoria</th>
              <th className="px-6 py-3">Valor</th>
              <th className="px-6 py-3 text-right">Status</th>
              <th className="px-6 py-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {revenue.map((item, i) => (
              <tr key={i} className="border-b border-border-dark/50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{item.client}</td>
                <td className="px-6 py-4 text-slate-500">{item.date}</td>
                <td className="px-6 py-4 text-slate-500">{item.category}</td>
                <td className="px-6 py-4 font-bold text-slate-900">R$ {item.value.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold",
                    item.status === 'Pago' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                  )}>{item.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ExpensesScreen = ({ expenses, onAdd, onDelete }: { expenses: Transaction[], onAdd: (e: Partial<Transaction>) => void, onDelete: (id: number) => void }) => {
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.value, 0);
  const data = [
    { month: 'Jan', expense: 42000 },
    { month: 'Fev', expense: 45000 },
    { month: 'Mar', expense: 41000 },
    { month: 'Abr', expense: 48000 },
    { month: 'Mai', expense: 52000 },
    { month: 'Jun', expense: totalExpenses > 0 ? totalExpenses : 55000 },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Gestão de Despesas</h2>
          <p className="text-slate-500">Acompanhamento de custos operacionais e fixos.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-border-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 text-slate-700 hover:bg-slate-50">
            <Upload size={18} /> Importar XML
          </button>
          <button 
            onClick={() => onAdd({ provider: 'Novo Fornecedor', due_date: new Date().toISOString().split('T')[0], category: 'Utilidades', value: 500, status: 'Aberto' })}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-600"
          >
            <Plus size={18} /> Nova Despesa
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Despesas Totais" value={`R$ ${totalExpenses.toLocaleString()}`} trend="up" trendValue="+8%" icon={Wallet} color="red-500" />
        <MetricCard label="Custo por Membro" value="R$ 420" trend="down" trendValue="-2%" icon={Users} />
        <MetricCard label="Contas a Pagar" value="R$ 12.400" trend="neutral" trendValue="3 pendentes" icon={AlertCircle} color="amber-500" />
        <MetricCard label="Economia vs Meta" value="R$ 4.200" trend="up" trendValue="+15%" icon={TrendingUp} color="emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-border-dark">
          <h4 className="text-sm font-bold text-slate-800 mb-6">Evolução de Despesas</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis hide />
                <Tooltip cursor={{ fill: '#00000005' }} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-dark">
          <h4 className="text-sm font-bold text-slate-800 mb-6">Despesas por Categoria</h4>
          <div className="space-y-4">
            {[
              { label: 'Aluguel & Condomínio', val: 'R$ 28.000', perc: 51 },
              { label: 'Equipe', val: 'R$ 15.400', perc: 28 },
              { label: 'Marketing', val: 'R$ 6.200', perc: 11 },
              { label: 'Manutenção', val: 'R$ 5.400', perc: 10 },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="text-slate-900">{item.val}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${item.perc}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-dark overflow-hidden">
        <div className="p-4 border-b border-border-dark flex justify-between items-center">
          <h4 className="text-sm font-bold text-slate-800">Próximos Vencimentos</h4>
          <button className="text-primary text-xs font-bold hover:underline">Ver Todos</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-3">Fornecedor</th>
              <th className="px-6 py-3">Vencimento</th>
              <th className="px-6 py-3">Categoria</th>
              <th className="px-6 py-3">Valor</th>
              <th className="px-6 py-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {expenses.map((item, i) => (
              <tr key={i} className="border-b border-border-dark/50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{item.provider}</td>
                <td className="px-6 py-4 text-slate-500">{item.due_date}</td>
                <td className="px-6 py-4 text-slate-500">{item.category}</td>
                <td className="px-6 py-4 font-bold text-slate-900">R$ {item.value.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold",
                      item.status === 'Pago' ? "bg-emerald-500/10 text-emerald-600" : 
                      item.status === 'Vencendo Hoje' ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"
                    )}>{item.status}</span>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CommercialDashboardScreen = ({ opportunities, leads }: { opportunities: Opportunity[], leads: Lead[] }) => {
  const data = [
    { name: 'Jan', leads: 120, sales: 18 },
    { name: 'Fev', leads: 150, sales: 22 },
    { name: 'Mar', leads: 140, sales: 20 },
    { name: 'Abr', leads: 180, sales: 28 },
    { name: 'Mai', leads: 210, sales: 35 },
    { name: 'Jun', leads: 250, sales: 42 },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Dashboard Comercial</h2>
          <p className="text-slate-500">Performance de vendas, pipeline e conversão.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-border-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 text-slate-700 hover:bg-slate-50">
            <BarChart3 size={18} /> Relatório de Vendas
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-orange-600">
            <Plus size={18} /> Nova Oportunidade
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Novas Vendas (Mês)" value="42" trend="up" trendValue="+24%" icon={Handshake} />
        <MetricCard label="Taxa de Conversão" value="16.8%" trend="up" trendValue="+2.1%" icon={TrendingUp} />
        <MetricCard label="Pipeline Total" value="R$ 450k" trend="neutral" trendValue="85 oportunidades" icon={BarChart3} color="blue-500" />
        <MetricCard label="Ciclo Médio" value="14 dias" trend="down" trendValue="-2 dias" icon={History} color="emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-border-dark">
          <h4 className="text-sm font-bold text-slate-800 mb-6">Leads vs Vendas</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="leads" stroke="#64748b" fill="#64748b22" strokeWidth={2} />
                <Area type="monotone" dataKey="sales" stroke="#f97316" fill="#f9731633" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-dark">
          <h4 className="text-sm font-bold text-slate-800 mb-6">Funil de Vendas</h4>
          <div className="space-y-6">
            {[
              { label: 'Prospecção', val: `${leads.length} leads`, perc: 100 },
              { label: 'Qualificação', val: `${leads.filter(l => l.status === 'Qualificado').length} leads`, perc: 67 },
              { label: 'Proposta', val: '42 leads', perc: 32 },
              { label: 'Fechamento', val: '18 leads', perc: 14 },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="text-slate-900">{item.val}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${item.perc}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-border-dark">
          <h4 className="text-sm font-bold text-slate-800 mb-6">Performance do Time</h4>
          <div className="space-y-4">
            {opportunities.map((person, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-border-dark/50">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-slate-900">{person.name}</span>
                    <span className="text-xs font-bold text-primary">R$ {person.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${(person.sales / person.target) * 100}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{person.sales}/{person.target}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border-dark">
          <h4 className="text-sm font-bold text-slate-800 mb-6">Principais Canais de Aquisição</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Google Ads', value: 35 },
                    { name: 'LinkedIn', value: 25 },
                    { name: 'Indicação', value: 20 },
                    { name: 'Instagram', value: 15 },
                    { name: 'Outros', value: 5 },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#f97316" />
                  <Cell fill="#ea580c" />
                  <Cell fill="#fb923c" />
                  <Cell fill="#e2e8f0" />
                  <Cell fill="#94a3b8" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsScreen = ({ settings, onUpdate }: { settings: any[], onUpdate: (key: string, value: string) => void }) => (
  <div className="space-y-8">
    <header>
      <h2 className="text-3xl font-black text-slate-900">Configurações do Sistema</h2>
      <p className="text-slate-500">Gerencie preferências, integrações e dados da conta.</p>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-2">
        {[
          { icon: Users, label: 'Perfil do Usuário', active: true },
          { icon: Building2, label: 'Dados da Empresa', active: false },
          { icon: ShieldCheck, label: 'Segurança & Acesso', active: false },
          { icon: Bell, label: 'Notificações', active: false },
          { icon: Wallet, label: 'Faturamento & Planos', active: false },
          { icon: MessageSquare, label: 'Suporte & Ajuda', active: false },
        ].map((item, i) => (
          <button key={i} className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all",
            item.active ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          )}>
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="lg:col-span-3 bg-white p-8 rounded-xl border border-border-dark space-y-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="size-24 rounded-full border-4 border-primary overflow-hidden relative group cursor-pointer">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7Lues9z7AsCLNlM4VsfAtEo0uiGsHVAFwpAoIpExHH6qVRbrCk0W5U63x90ZLBnSBYUZLcywaxYXT_rihuz2u61U4YggnT8CM9gWrWkbG6oI5NWgn8yfdKYsQU9lnOTfxQ_XL7b08bgjPM2d5LdEUBWs_AxyIKQFoQexQv_bpOogcJ1TMUp3YGgeW2J3Q6-0yoAJTGIkMD14wSNa7AFhCfSElrVtnIb6l7jhHDL7BVGG2AAHBxiHXaV-8b1b5zimfYKa7S-WK5c1K" 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus size={24} className="text-white" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900">Ricardo Silva</h4>
            <p className="text-slate-500 text-sm">CEO & Founder • Administrador</p>
            <button className="mt-2 text-primary text-xs font-bold hover:underline">Alterar foto de perfil</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
            <input 
              className="w-full bg-slate-50 border-border-dark border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-slate-900" 
              defaultValue={settings.find(s => s.key === 'user_name')?.value || "Ricardo Silva"} 
              onBlur={(e) => onUpdate('user_name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">E-mail</label>
            <input 
              className="w-full bg-slate-50 border-border-dark border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-slate-900" 
              defaultValue={settings.find(s => s.key === 'user_email')?.value || "ricardo@hubcoworking.com"} 
              onBlur={(e) => onUpdate('user_email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Cargo</label>
            <input 
              className="w-full bg-slate-50 border-border-dark border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-slate-900" 
              defaultValue={settings.find(s => s.key === 'user_role')?.value || "CEO & Founder"} 
              onBlur={(e) => onUpdate('user_role', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Telefone</label>
            <input 
              className="w-full bg-slate-50 border-border-dark border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-slate-900" 
              defaultValue={settings.find(s => s.key === 'user_phone')?.value || "+55 (11) 99999-9999"} 
              onBlur={(e) => onUpdate('user_phone', e.target.value)}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-border-dark flex justify-end gap-4">
          <button className="px-6 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Cancelar</button>
          <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-orange-600">Salvar Alterações</button>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [users, setUsers] = useState<User[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [revenue, setRevenue] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [settings, setSettings] = useState<any[]>([]);

  const fetchAll = useCallback(async () => {
    try {
      const [u, g, o, r, e, l, opp, s] = await Promise.all([
        fetch('/api/users').then(res => res.json()),
        fetch('/api/goals').then(res => res.json()),
        fetch('/api/okrs').then(res => res.json()),
        fetch('/api/revenue').then(res => res.json()),
        fetch('/api/expenses').then(res => res.json()),
        fetch('/api/leads').then(res => res.json()),
        fetch('/api/opportunities').then(res => res.json()),
        fetch('/api/settings').then(res => res.json()),
      ]);
      setUsers(u);
      setGoals(g);
      setOkrs(o);
      setRevenue(r);
      setExpenses(e);
      setLeads(l);
      setOpportunities(opp);
      setSettings(s);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  }, []);

  useEffect(() => {
    if (screen !== 'login') {
      fetchAll();
    }
  }, [screen, fetchAll]);

  // Handlers
  const addUser = async (user: Partial<User>) => {
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    fetchAll();
  };

  const deleteUser = async (id: number) => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const addGoal = async (goal: Partial<Goal>) => {
    await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    });
    fetchAll();
  };

  const deleteGoal = async (id: number) => {
    await fetch(`/api/goals/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const addRevenue = async (item: Partial<Transaction>) => {
    await fetch('/api/revenue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    fetchAll();
  };

  const deleteRevenue = async (id: number) => {
    await fetch(`/api/revenue/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const addExpense = async (item: Partial<Transaction>) => {
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    fetchAll();
  };

  const deleteExpense = async (id: number) => {
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const addLead = async (lead: Partial<Lead>) => {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    fetchAll();
  };

  const deleteLead = async (id: number) => {
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const addOKR = async (okr: Partial<OKR>) => {
    await fetch('/api/okrs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(okr),
    });
    fetchAll();
  };

  const deleteOKR = async (id: number) => {
    await fetch(`/api/okrs/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const updateSettings = async (key: string, value: string) => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    fetchAll();
  };

  return (
    <Layout currentScreen={screen} setScreen={setScreen}>
      {screen === 'login' && <LoginScreen onLogin={() => setScreen('dashboard')} />}
      {screen === 'dashboard' && <DashboardScreen revenue={revenue} expenses={expenses} goals={goals} leads={leads} />}
      {screen === 'goals' && <GoalsScreen goals={goals} onAdd={addGoal} onDelete={deleteGoal} />}
      {screen === 'users' && <UsersScreen users={users} onAdd={addUser} onDelete={deleteUser} />}
      {screen === 'planning' && <PlanningScreen />}
      {screen === 'okrs' && <OKRsScreen okrs={okrs} onAdd={addOKR} onDelete={deleteOKR} />}
      {screen === 'finance' && <FinanceScreen revenue={revenue} />}
      {screen === 'leads' && <LeadsScreen leads={leads} onAdd={addLead} onDelete={deleteLead} />}
      {screen === 'revenue' && <RevenueScreen revenue={revenue} onAdd={addRevenue} onDelete={deleteRevenue} />}
      {screen === 'expenses' && <ExpensesScreen expenses={expenses} onAdd={addExpense} onDelete={deleteExpense} />}
      {screen === 'commercial' && <CommercialDashboardScreen opportunities={opportunities} leads={leads} />}
      {screen === 'settings' && <SettingsScreen settings={settings} onUpdate={updateSettings} />}
    </Layout>
  );
}
