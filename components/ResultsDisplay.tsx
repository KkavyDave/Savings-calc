'use client';

import React from 'react';
import { 
  Wallet, Home, UserCheck, 
  Utensils, Zap, Church, AlertCircle, Baby, TrendingUp 
} from 'lucide-react';

interface ResultProps {
  result: any; 
}

export default function ResultsDisplay({ result }: ResultProps) {
  const savingsClass = result.savingsEur > 1000 ? 'text-emerald-400' : (result.savingsEur > 0 ? 'text-orange-400' : 'text-rose-500');
  const isBroke = result.savingsEur <= 0;
  const highChildcare = result.expenseBreakdown.childcare > 300;

  return (
    <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-2xl space-y-8 sticky top-24">
      
      {/* 1. SAVINGS HEADER */}
      <div className="text-center space-y-2 pb-6 border-b border-slate-800">
        <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Net Monthly Savings</h3>
        <div className={`text-5xl md:text-6xl font-black transition-colors duration-500 ${savingsClass}`}>
          €{result.savingsEur.toLocaleString()}
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-800/50 rounded-full text-emerald-400 font-bold text-sm border border-emerald-500/20">
          <Wallet className="w-3 h-3" />
          ₹{result.savingsInr.toLocaleString('en-IN')}
        </div>
      </div>

      {/* 2. DEDUCTIONS */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Deductions</h4>
             <span className="text-xs text-rose-400 font-mono">-€{(result.tax + result.socialSecurity).toLocaleString()}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Income Tax</p>
            <p className="text-white font-bold">€{result.tax.toLocaleString()}</p>
            {result.meta.churchTax > 0 && (
                <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-400">
                    <Church className="w-3 h-3" /> Includes Church Tax
                </div>
            )}
            {result.meta.taxClass === 4 && (
                <div className="mt-1 text-[9px] text-blue-400 font-mono">Tax Class 4 (Partner Works)</div>
            )}
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Social Security</p>
            <p className="text-white font-bold">€{result.socialSecurity.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 3. LIFESTYLE REALITY */}
      <div className="space-y-4 pt-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reality Costs</h4>
        <div className="space-y-3">
          <BreakdownRow icon={<Home className="w-3 h-3"/>} label="Rent" value={result.expenseBreakdown.rent} color="bg-blue-500" />
          <BreakdownRow icon={<Baby className="w-3 h-3"/>} label="Childcare" value={result.expenseBreakdown.childcare} color="bg-pink-500" />
          <BreakdownRow icon={<Utensils className="w-3 h-3"/>} label="Food" value={result.expenseBreakdown.food} color="bg-orange-500" />
          <BreakdownRow icon={<UserCheck className="w-3 h-3"/>} label="Maid" value={result.expenseBreakdown.maid} color="bg-purple-500" />
          <BreakdownRow icon={<Zap className="w-3 h-3"/>} label="Fixed" value={result.expenseBreakdown.other} color="bg-yellow-500" />
        </div>
      </div>

      {/* 4. WEALTH PROJECTION */}
      {!isBroke && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                    <h5 className="text-emerald-400 font-bold text-sm">3-Year Wealth</h5>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Projected Savings</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-2xl font-black text-white">₹{result.wealth3Year} L</p>
                <p className="text-[10px] text-slate-500">Excluding Interest</p>
            </div>
        </div>
      )}

      {/* 5. WARNING */}
      {isBroke && (
          <div className="bg-rose-500/10 border border-rose-500/50 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <p className="text-xs text-rose-200 leading-relaxed">
                  <span className="font-bold text-rose-400">Reality Check:</span> Expenses exceed income. 
                  {highChildcare ? " Childcare costs are the main factor." : " Try reducing Rent or Lifestyle costs."}
              </p>
          </div>
      )}
    </div>
  );
}

function BreakdownRow({ icon, label, value, color }: any) {
  if (!value || value === 0) return null; 
  return (
    <div className="flex items-center gap-3 group">
      <div className={`p-2 rounded-lg ${color} bg-opacity-20 text-white shrink-0`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-300 truncate pr-2">{label}</span>
          <span className="font-mono text-slate-200">€{value}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color} opacity-80 group-hover:opacity-100 transition-all`} style={{ width: `${Math.min((value / 2500) * 100, 100)}%` }}></div>
        </div>
      </div>
    </div>
  );
}