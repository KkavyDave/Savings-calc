'use client';

import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce'; 
import CalculatorForm from '@/components/CalculatorForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { calculateGermanReality, UserScenario } from '@/lib/calculator';
import { saveCalculationAction } from '@/src/app/actions/save-calculation';

export default function RealityCheckPage() {
  // 1. Initial Default State
  const [scenario, setScenario] = useState<UserScenario>({
    role: 'Nurse',
    grossAnnualEth: 48000,
    taxClass: 1, 
    married: false,
    partnerWorks: false,
    hasChildren: false,
    numChildren: 0,
    city: 'Berlin',
    maidService: 'None',
    eatingOut: 'Weekly',
    healthInsurance: 'Public',
    useCustomFood: false,
    customFoodBudget: 600,
    isChurchMember: false
  });

  // 2. Real-time Calculation
  const result = calculateGermanReality(scenario);

  // 3. Debounce for DB Saving (1.5s delay)
  const [debouncedScenario] = useDebounce(scenario, 1500);

  // 4. Auto-Save Effect
  useEffect(() => {
    async function saveData() {
      if (debouncedScenario.grossAnnualEth > 0) {
        console.log("Syncing scenario to Neon DB...");
        await saveCalculationAction(debouncedScenario, result.savingsEur);
      }
    }
    saveData();
  }, [debouncedScenario]); 

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-blue-200">
      
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-lg">DE</div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Reality<span className="text-blue-600">Check</span></h1>
          </div>
          <div className="text-xs font-semibold text-slate-400 hidden md:block">
            Updated for 2026 Tax Rules
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
        
        {/* Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            The <span className="text-rose-500 underline decoration-4 decoration-rose-200">No-Sugar-Coating</span><br />
            Financial Simulator.
          </h2>
          <p className="text-lg text-slate-600">
            Most calculators show you Gross vs. Net. We show you <span className="font-bold text-slate-900">Life</span>.
            <br className="hidden md:block"/>
            Factoring in hidden utilities, childcare costs, and your real 3-year wealth potential.
          </p>
        </div>

        {/* The App Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input Form */}
          <div className="lg:col-span-7">
            <CalculatorForm onUpdate={setScenario} />
          </div>

          {/* Right: Dashboard */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <ResultsDisplay result={result} />
            
            <div className="mt-8 text-center space-y-2">
               <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Data Privacy</p>
               <p className="text-xs text-slate-400 max-w-xs mx-auto">
                 Calculations are processed in real-time. Anonymous scenarios are saved to improve our estimation models.
               </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}