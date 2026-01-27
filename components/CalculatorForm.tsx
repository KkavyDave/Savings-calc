'use client';

import React, { useState, useEffect } from 'react';
import { UserScenario, CITY_OPTS, CityName } from '@/lib/calculator';
import { 
  Euro, MapPin, Users, Utensils, 
  Sparkles, ShieldCheck, BriefcaseMedical, Church, ChevronDown, HeartHandshake 
} from 'lucide-react';

interface CalculatorFormProps {
  onUpdate: (data: UserScenario) => void;
}

export default function CalculatorForm({ onUpdate }: CalculatorFormProps) {
  // Income State
  const [role, setRole] = useState<'Nurse' | 'Doctor'>('Nurse');
  const [salary, setSalary] = useState(48000);
  
  // Location
  const [city, setCity] = useState<CityName>('Berlin'); 
  
  // Family & Tax State
  const [married, setMarried] = useState(false);
  const [partnerWorks, setPartnerWorks] = useState(false);
  const [kids, setKids] = useState(0);
  const [church, setChurch] = useState(false);
  
  // Lifestyle State
  const [maid, setMaid] = useState<'None' | 'Weekly (4h)' | 'Regular (10h)'>('None');
  const [eating, setEating] = useState<'Rarely' | 'Weekly' | 'Frequent'>('Weekly');
  const [insurance, setInsurance] = useState<'Public' | 'Private'>('Public');
  const [useCustomFood, setUseCustomFood] = useState(false);
  const [foodBudget, setFoodBudget] = useState(600);

  const minSal = role === 'Nurse' ? 15000 : 55000;
  const maxSal = role === 'Nurse' ? 50000 : 350000;

  useEffect(() => {
    onUpdate({
      role,
      grossAnnualEth: salary,
      // Tax class logic is handled in lib/calculator, but we pass raw state
      taxClass: married ? (partnerWorks ? 4 : 3) : 1, 
      married, 
      partnerWorks, 
      hasChildren: kids > 0,
      numChildren: kids,
      city,
      maidService: maid,
      eatingOut: eating,
      healthInsurance: insurance,
      useCustomFood,      
      customFoodBudget: foodBudget,
      isChurchMember: church 
    });
  }, [salary, city, married, partnerWorks, kids, maid, eating, insurance, role, useCustomFood, foodBudget, church, onUpdate]);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-10">
      
      {/* SECTION 1: INCOME */}
      <section className="space-y-6">
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <BriefcaseMedical className="w-5 h-5 text-blue-600" /> PROFESSIONAL PROFILE
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {['Nurse', 'Doctor'].map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r as any); setSalary(r === 'Nurse' ? 45000 : 75000); }}
              className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                role === r ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-slate-100 text-slate-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div>
          <div className="flex justify-between mb-4">
            <span className="text-sm font-bold text-slate-500 uppercase">Annual Gross Offer</span>
            <span className="text-2xl font-black text-blue-600">€{salary.toLocaleString()}</span>
          </div>
          <input
            type="range" min={minSal} max={maxSal} step={1000} value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </section>

      {/* SECTION 2: LIFESTYLE */}
      <section className="space-y-6 border-t border-slate-50 pt-8">
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" /> LIFESTYLE CHOICES
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target City</label>
            <span className="text-[10px] text-blue-500 font-semibold bg-blue-50 px-2 py-1 rounded">
              *Rent & Childcare scale by city tier
            </span>
          </div>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value as CityName)}
              className="w-full p-4 pr-10 appearance-none bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              {Object.keys(CITY_OPTS).sort().map((c) => (
                 <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* Food Budget */}
        <div className="space-y-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-600" />
              <label className="text-sm font-bold text-orange-800">Custom Food Budget?</label>
            </div>
            <button 
              onClick={() => setUseCustomFood(!useCustomFood)}
              className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${useCustomFood ? 'bg-orange-500' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${useCustomFood ? 'translate-x-4' : ''}`} />
            </button>
          </div>
          {useCustomFood ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-orange-600">
                <span>Monthly Food & Grocery</span>
                <span>€{foodBudget}</span>
              </div>
              <input 
                type="range" min="200" max="2000" step="50"
                value={foodBudget}
                onChange={(e) => setFoodBudget(Number(e.target.value))}
                className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {['Rarely', 'Weekly', 'Frequent'].map((e) => (
                <button
                  key={e} onClick={() => setEating(e as any)}
                  className={`py-2 text-xs rounded-xl font-bold border transition-all ${
                    eating === e ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Maid */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Maid / Domestic Help</label>
          <div className="grid grid-cols-3 gap-2">
            {['None', 'Weekly (4h)', 'Regular (10h)'].map((m) => (
              <button
                key={m} onClick={() => setMaid(m as any)}
                className={`py-2 text-xs rounded-xl font-bold border transition-all ${
                  maid === m ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: TAX & REALITY */}
      <section className="space-y-6 border-t border-slate-50 pt-8">
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" /> TAX & REALITY
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
             {/* Married */}
             <div className="p-3 bg-slate-50 rounded-xl flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500">Married?</span>
                <button 
                  onClick={() => { setMarried(!married); if(married) setPartnerWorks(false); }}
                  className={`w-10 h-6 rounded-full self-end transition-colors flex items-center px-0.5 ${married ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${married ? 'translate-x-4' : ''}`} />
                </button>
             </div>
             
             {/* Kids */}
             <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-500">Children</span>
                <div className="flex items-center justify-between bg-white rounded-lg px-2">
                   <button onClick={() => setKids(Math.max(0, kids - 1))} className="text-lg font-bold text-slate-400">-</button>
                   <span className="font-bold text-slate-800">{kids}</span>
                   <button onClick={() => setKids(kids + 1)} className="text-lg font-bold text-blue-600">+</button>
                </div>
             </div>
        </div>

        {/* Partner Works Toggle */}
        {married && (
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                 <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-blue-900 text-sm">Partner Works?</p>
                <p className="text-[10px] text-blue-700 leading-tight">Switches you to Tax Class 4 (Higher Tax).</p>
              </div>
            </div>
            <button 
              onClick={() => setPartnerWorks(!partnerWorks)}
              className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${partnerWorks ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${partnerWorks ? 'translate-x-4' : ''}`} />
            </button>
          </div>
        )}

        {/* Church Tax */}
        <div className="flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
               <Church className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-rose-900 text-sm">Church Member?</p>
              <p className="text-[10px] text-rose-700 leading-tight">Registers you for extra tax (8-9%).</p>
            </div>
          </div>
          <button 
            onClick={() => setChurch(!church)}
            className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${church ? 'bg-rose-500' : 'bg-slate-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${church ? 'translate-x-4' : ''}`} />
          </button>
        </div>

        {/* Health Insurance */}
        <div className="space-y-2">
           <label className="text-xs font-bold text-slate-400 uppercase">Health Insurance</label>
           <div className="flex bg-slate-100 p-1 rounded-xl">
             {['Public', 'Private'].map((i) => (
               <button
                 key={i} onClick={() => setInsurance(i as any)}
                 className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                   insurance === i ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                 }`}
               >
                 {i}
               </button>
             ))}
           </div>
        </div>
      </section>

    </div>
  );
}