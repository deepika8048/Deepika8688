import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';

export function ScenarioBuilder({ companyId }: { companyId: string }) {
  const [assumptions, setAssumptions] = useState({
    growth: 0.15,
    margin: 0.75,
    headcount: 10,
    churn: 0.05
  });

  const scenarios = [
    { name: 'Base Case', color: 'bg-blue-500', multiplier: 1 },
    { name: 'Upside Case', color: 'bg-green-500', multiplier: 1.2 },
    { name: 'Downside Case', color: 'bg-red-500', multiplier: 0.8 },
  ];

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="bg-white border border-[#141414] p-6 rounded-lg">
        <h3 className="font-serif italic text-lg mb-6 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Assumption Editor
        </h3>
        <div className="space-y-6">
          {Object.entries(assumptions).map(([key, val]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold opacity-50">
                <span>{key}</span>
                <span>{val < 1 ? `${(val * 100).toFixed(1)}%` : val}</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={key === 'headcount' ? 100 : 1} 
                step={0.01}
                value={val}
                onChange={(e) => setAssumptions(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-[#141414]/10 rounded-lg appearance-none cursor-pointer accent-[#141414]"
              />
            </div>
          ))}
        </div>
        <button className="w-full mt-8 bg-[#141414] text-[#E4E3E0] py-3 rounded text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-[#141414]/90 transition-colors">
          <Zap className="w-4 h-4" />
          Run Scenario Analysis
        </button>
      </div>

      <div className="col-span-2 bg-white border border-[#141414] p-6 rounded-lg">
        <h3 className="font-serif italic text-lg mb-6">Impact Visualizer (EBITDA Projection)</h3>
        <div className="grid grid-cols-3 gap-4">
          {scenarios.map(scenario => (
            <div key={scenario.name} className="border border-[#141414]/10 p-4 rounded bg-[#141414]/5">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${scenario.color}`} />
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">{scenario.name}</span>
              </div>
              <div className="text-2xl font-bold tracking-tighter">
                ${(assumptions.growth * 100 * scenario.multiplier).toFixed(1)}M
              </div>
              <div className="flex items-center gap-1 text-[10px] mt-1 text-green-600 font-bold">
                <TrendingUp className="w-3 h-3" />
                +12.4% vs LY
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 h-48 border-t border-[#141414]/10 pt-6">
          <div className="flex justify-between items-end h-full gap-4">
            {[40, 60, 45, 70, 85, 90, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-[#141414]/10 relative group">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-[#141414] transition-all duration-500" 
                  style={{ height: `${h}%` }}
                />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] uppercase tracking-widest opacity-40 font-bold">
            <span>Q1</span>
            <span>Q2</span>
            <span>Q3</span>
            <span>Q4</span>
            <span>Q1 '27</span>
            <span>Q2 '27</span>
            <span>Q3 '27</span>
          </div>
        </div>
      </div>
    </div>
  );
}
