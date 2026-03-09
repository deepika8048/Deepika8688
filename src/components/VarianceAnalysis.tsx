import React from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export function VarianceAnalysis({ companyId }: { companyId: string }) {
  const variances = [
    { category: 'Revenue', actual: 4200000, budget: 4500000, variance: -300000, pct: -6.7, status: 'warning', reason: 'Sales cycle elongation in Enterprise segment.' },
    { category: 'COGS', actual: 1100000, budget: 1250000, variance: 150000, pct: 12.0, status: 'success', reason: 'Infrastructure optimization project completed early.' },
    { category: 'Sales & Marketing', actual: 1800000, budget: 1750000, variance: -50000, pct: -2.8, status: 'info', reason: 'Accelerated hiring of account executives.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-serif italic text-2xl">Variance Analysis (Actual vs Budget)</h3>
        <div className="text-[10px] uppercase tracking-widest font-bold opacity-50">Period: Feb 2026</div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {variances.map((v, i) => (
          <div key={i} className="bg-white border border-[#141414] p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-50">{v.category}</div>
              {v.status === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-500" /> : 
               v.status === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : 
               <Info className="w-4 h-4 text-blue-500" />}
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold tracking-tighter">${(v.actual / 1000000).toFixed(1)}M</div>
              <div className={v.pct < 0 ? "text-red-600 text-[11px] font-bold" : "text-green-600 text-[11px] font-bold"}>
                {v.pct > 0 ? '+' : ''}{v.pct}%
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#141414]/5">
              <div className="text-[9px] uppercase tracking-widest font-bold opacity-30 mb-1">Agent Explanation</div>
              <p className="text-[11px] leading-relaxed italic opacity-80">"{v.reason}"</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#141414] text-[#E4E3E0] p-8 rounded-lg">
        <h4 className="font-serif italic text-xl mb-4">Strategic Recommendation</h4>
        <p className="text-sm opacity-80 leading-relaxed max-w-2xl">
          Based on the revenue shortfall and COGS efficiency, we recommend reallocating $150k of infrastructure savings into the Q2 marketing campaign to bolster the pipeline for the Enterprise segment.
        </p>
        <button className="mt-6 border border-white/20 px-4 py-2 rounded text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-colors">
          Approve Reallocation
        </button>
      </div>
    </div>
  );
}
