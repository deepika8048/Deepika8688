import React, { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { 
  LayoutDashboard, 
  Building2, 
  TrendingUp, 
  AlertCircle, 
  Activity, 
  ChevronRight,
  PieChart,
  BarChart3,
  FileText,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const { 
    companies, 
    activities, 
    selectedCompanyId, 
    fetchCompanies, 
    fetchActivities, 
    setSelectedCompany 
  } = useStore();

  const [view, setView] = useState<'portfolio' | 'company'>('portfolio');

  useEffect(() => {
    fetchCompanies();
    fetchActivities();
    const interval = setInterval(fetchActivities, 5000);
    return () => clearInterval(interval);
  }, []);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  return (
    <div className="flex h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#141414] flex flex-col">
        <div className="p-6 border-bottom border-[#141414]">
          <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <Activity className="w-6 h-6" />
            SUMMIT FP&A
          </h1>
          <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Autonomous Planning Platform</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => { setView('portfolio'); setSelectedCompany(null); }}
            className={cn(
              "w-full text-left px-4 py-2 rounded flex items-center gap-3 transition-colors",
              view === 'portfolio' ? "bg-[#141414] text-[#E4E3E0]" : "hover:bg-[#141414]/5"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Portfolio Overview
          </button>
          <div className="pt-4 pb-2 px-4 text-[10px] uppercase tracking-widest opacity-50">Portfolio Companies</div>
          {companies.map(company => (
            <button 
              key={company.id}
              onClick={() => { setView('company'); setSelectedCompany(company.id); }}
              className={cn(
                "w-full text-left px-4 py-2 rounded flex items-center justify-between transition-colors",
                selectedCompanyId === company.id ? "bg-[#141414] text-[#E4E3E0]" : "hover:bg-[#141414]/5"
              )}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4" />
                <span className="truncate">{company.name}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-30" />
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#141414]">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50 mb-4">
            <Activity className="w-3 h-3" />
            Agent Activity
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {activities.slice(0, 10).map(activity => (
              <div key={activity.id} className="text-[11px] leading-tight border-l-2 border-[#141414] pl-2 py-1">
                <div className="font-bold uppercase text-[9px] opacity-70">{activity.agent_name}</div>
                <div className="opacity-90">{activity.message}</div>
                <div className="text-[8px] opacity-40 mt-1">{format(new Date(activity.timestamp), 'HH:mm:ss')}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white/50">
        <header className="h-16 border-b border-[#141414] flex items-center justify-between px-8 sticky top-0 bg-[#E4E3E0]/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <h2 className="font-serif italic text-lg capitalize">
              {view === 'portfolio' ? 'Portfolio Performance' : selectedCompany?.name}
            </h2>
            {selectedCompany && (
              <span className="px-2 py-0.5 rounded-full bg-[#141414] text-[#E4E3E0] text-[10px] uppercase tracking-widest">
                {selectedCompany.industry}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#141414]/5 rounded-full transition-colors">
              <Mail className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-[#141414]/5 rounded-full transition-colors">
              <FileText className="w-4 h-4" />
            </button>
            <div className="h-4 w-[1px] bg-[#141414]/20 mx-2" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest">System Active</span>
            </div>
          </div>
        </header>

        {/* Planning Timeline */}
        <div className="px-8 pt-8">
          <div className="bg-[#141414] text-[#E4E3E0] p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-50">Planning Cycle: FY2026</div>
              <div className="flex items-center gap-4">
                {[
                  { label: 'Data Collection', status: 'completed' },
                  { label: 'Budget Assembly', status: 'active' },
                  { label: 'Review', status: 'pending' },
                  { label: 'Approval', status: 'pending' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      step.status === 'completed' ? "bg-green-500" :
                      step.status === 'active' ? "bg-blue-500 animate-pulse" : "bg-white/20"
                    )} />
                    <span className={cn(
                      "text-[10px] uppercase tracking-widest font-bold",
                      step.status === 'pending' ? "opacity-30" : "opacity-100"
                    )}>{step.label}</span>
                    {i < 3 && <div className="w-4 h-[1px] bg-white/10" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[10px] font-mono opacity-50">Next Milestone: Board Review (Mar 25)</div>
          </div>
        </div>

        <div className="p-8">
          {view === 'portfolio' ? (
            <PortfolioDashboard />
          ) : (
            <CompanyDashboard companyId={selectedCompanyId!} />
          )}
        </div>
      </main>
    </div>
  );
}

function PortfolioDashboard() {
  const { companies } = useStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="space-y-8 min-w-0">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Total Portfolio Revenue', value: '$533.0M', change: '+12.4%', icon: TrendingUp },
          { label: 'Aggregate EBITDA', value: '$84.2M', change: '+8.1%', icon: BarChart3 },
          { label: 'Avg. Gross Margin', value: '46.5%', change: '-1.2%', icon: PieChart },
          { label: 'Active Alerts', value: '14', change: 'Critical', icon: AlertCircle, color: 'text-red-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-[#141414] p-6 rounded-lg shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#141414]/5 rounded">
                <stat.icon className="w-4 h-4" />
              </div>
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", stat.color || "text-green-600")}>
                {stat.change}
              </span>
            </div>
            <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1">{stat.label}</div>
            <div className="text-3xl font-bold tracking-tighter">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white border border-[#141414] p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif italic text-lg">Revenue vs Budget (Consolidated)</h3>
            <div className="flex gap-4 text-[10px] uppercase tracking-widest font-bold">
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#141414]" /> Actual</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#141414]/30" /> Budget</div>
            </div>
          </div>
          <div className="h-80 min-h-[320px] w-full relative">
            <div className="absolute inset-0">
              {isReady && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#14141410" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#14141450'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#14141450'}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#141414', border: 'none', borderRadius: '4px', color: '#E4E3E0' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="actual" stroke="#141414" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    <Area type="monotone" dataKey="budget" stroke="#141414" strokeWidth={1} strokeDasharray="5 5" fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#141414] p-6 rounded-lg">
          <h3 className="font-serif italic text-lg mb-6">Portfolio Allocation</h3>
          <div className="space-y-4">
            {companies.map(c => (
              <div key={c.id} className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                  <span>{c.name}</span>
                  <span>{Math.round(c.revenue_base / 533000000 * 100)}%</span>
                </div>
                <div className="h-1.5 bg-[#141414]/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#141414] transition-all duration-1000" 
                    style={{ width: `${(c.revenue_base / 533000000 * 100)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-3 gap-6">
        {companies.map(company => (
          <div key={company.id} className="bg-white border border-[#141414] p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="font-serif italic text-xl group-hover:underline">{company.name}</div>
              <div className="text-[10px] font-mono bg-[#141414]/5 px-2 py-1 rounded uppercase">{company.industry}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <div className="text-[9px] uppercase tracking-widest opacity-50 font-bold">Revenue</div>
                <div className="text-lg font-bold tracking-tighter">${(company.revenue_base / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest opacity-50 font-bold">Growth</div>
                <div className="text-lg font-bold tracking-tighter text-green-600">+{(company.growth_rate * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { ScenarioBuilder } from './components/ScenarioBuilder';
import { VarianceAnalysis } from './components/VarianceAnalysis';
import Markdown from 'react-markdown';

function CompanyDashboard({ companyId }: { companyId: string }) {
  const [financials, setFinancials] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'scenarios' | 'initiatives' | 'variance' | 'reports'>('overview');
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    fetch(`/api/financials/${companyId}`).then(res => res.json()).then(setFinancials);
    fetch(`/api/kpis/${companyId}`).then(res => res.json()).then(setKpis);
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, [companyId]);

  const revenueData = financials
    .filter(f => f.metric === 'revenue')
    .map(f => ({ name: f.period, value: f.value }));

  return (
    <div className="space-y-8">
      {/* Sub-navigation */}
      <div className="flex gap-8 border-b border-[#141414]/10">
        {['overview', 'scenarios', 'initiatives', 'variance', 'reports'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "pb-4 text-[10px] uppercase tracking-widest font-bold transition-all relative",
              activeTab === tab ? "text-[#141414]" : "text-[#141414]/40 hover:text-[#141414]/60"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#141414]" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white border border-[#141414] p-6 rounded-lg min-w-0">
                <h3 className="font-serif italic text-lg mb-6">Monthly Revenue Trend</h3>
                <div className="h-64 min-h-[256px] w-full relative">
                  <div className="absolute inset-0">
                    {isReady && (
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                        <LineChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#14141410" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#14141450'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#14141450'}} />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#141414" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#141414] p-6 rounded-lg">
                <h3 className="font-serif italic text-lg mb-6">Key Performance Indicators</h3>
                <div className="space-y-6">
                  {kpis.slice(-5).map((kpi, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-[#141414]/5 pb-4 last:border-0">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-50">{kpi.kpi_name.replace('_', ' ')}</div>
                        <div className="text-xl font-bold tracking-tighter">
                          {typeof kpi.value === 'number' && kpi.value < 1 ? `${(kpi.value * 100).toFixed(1)}%` : kpi.value.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] uppercase tracking-widest font-bold opacity-30">Target</div>
                        <div className="text-[11px] font-mono">
                          {typeof kpi.target === 'number' && kpi.target < 1 ? `${(kpi.target * 100).toFixed(1)}%` : kpi.target.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#141414] rounded-lg overflow-hidden">
              <div className="p-6 border-b border-[#141414] bg-[#141414]/5">
                <h3 className="font-serif italic text-lg">Financial Statement (LTM)</h3>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#141414] text-[#E4E3E0] text-[10px] uppercase tracking-widest">
                    <th className="px-6 py-3">Metric</th>
                    {financials.filter(f => f.metric === 'revenue').slice(-6).map(f => (
                      <th key={f.period} className="px-6 py-3">{f.period}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[12px]">
                  {['revenue', 'cogs', 'gross_profit', 'ebitda', 'net_income'].map(metric => (
                    <tr key={metric} className="border-b border-[#141414]/10 hover:bg-[#141414]/5 transition-colors">
                      <td className="px-6 py-4 font-bold uppercase tracking-tight opacity-70">{metric.replace('_', ' ')}</td>
                      {financials.filter(f => f.metric === metric).slice(-6).map((f, i) => (
                        <td key={i} className="px-6 py-4 font-mono">${(f.value / 1000).toFixed(0)}k</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'scenarios' && (
          <motion.div
            key="scenarios"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ScenarioBuilder companyId={companyId} />
          </motion.div>
        )}

        {activeTab === 'initiatives' && (
          <motion.div
            key="initiatives"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-[#141414] p-8 rounded-lg"
          >
            <h3 className="font-serif italic text-2xl mb-8">Strategic Initiative Tracker</h3>
            <div className="space-y-6">
              {[
                { name: 'Project Phoenix', status: 'On Track', budget: '$2.4M', progress: 65 },
                { name: 'Enterprise Tier Launch', status: 'Delayed', budget: '$1.8M', progress: 40 },
                { name: 'Factory Automation', status: 'Completed', budget: '$5.0M', progress: 100 },
              ].map((initiative, i) => (
                <div key={i} className="p-6 border border-[#141414]/10 rounded-lg flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-lg font-bold">{initiative.name}</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">Budget: {initiative.budget}</div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">Status</div>
                      <div className={cn(
                        "text-[11px] font-bold",
                        initiative.status === 'On Track' ? "text-green-600" : 
                        initiative.status === 'Delayed' ? "text-red-600" : "text-blue-600"
                      )}>{initiative.status}</div>
                    </div>
                    <div className="w-48 space-y-2">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span>Progress</span>
                        <span>{initiative.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-[#141414]/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#141414]" style={{ width: `${initiative.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'variance' && (
          <motion.div
            key="variance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <VarianceAnalysis companyId={companyId} />
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-4 gap-6">
              {[
                { title: 'Monthly Board Pack', date: 'Feb 2026', type: 'PDF' },
                { title: 'Quarterly Review', date: 'Q4 2025', type: 'PDF' },
                { title: 'Budget vs Actual', date: 'Jan 2026', type: 'XLSX' },
                { title: 'Strategic Plan', date: 'FY2026', type: 'PDF' },
              ].map((report, i) => (
                <div key={i} className="bg-white border border-[#141414] p-6 rounded-lg hover:shadow-lg transition-all cursor-pointer group">
                  <FileText className="w-8 h-8 mb-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                  <div className="text-sm font-bold mb-1">{report.title}</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">{report.date} • {report.type}</div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-[#141414] p-8 rounded-lg">
              <h3 className="font-serif italic text-2xl mb-6">Executive Summary (AI Generated)</h3>
              <div className="prose prose-sm max-w-none text-[#141414]/80">
                <Markdown>
{`### Financial Performance Overview
**CloudCRM Inc** has demonstrated resilient growth in Q1, with revenue tracking at **$8.4M** (102% of budget). EBITDA margins have improved by **150bps** due to lower-than-expected cloud infrastructure costs.

### Areas of Concern
* **Churn Rate:** We observed a slight uptick in churn among mid-market customers (3.2% vs 2.8% target).
* **Sales Velocity:** Enterprise deal cycles have extended from 65 to 78 days on average.

### Strategic Recommendations
1. **Customer Success:** Re-allocate two account managers to the mid-market segment to address churn.
2. **Pricing Strategy:** Evaluate a "Starter" tier to capture lower-end market demand and reduce sales friction.`}
                </Markdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



const mockChartData = [
  { name: 'Jan', actual: 4000, budget: 4200 },
  { name: 'Feb', actual: 3000, budget: 3200 },
  { name: 'Mar', actual: 2000, budget: 2500 },
  { name: 'Apr', actual: 2780, budget: 2600 },
  { name: 'May', actual: 1890, budget: 2100 },
  { name: 'Jun', actual: 2390, budget: 2400 },
  { name: 'Jul', actual: 3490, budget: 3200 },
];
