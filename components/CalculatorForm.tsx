'use client';

import { useState } from 'react';
import Image from 'next/image';
import { calculateSimpleRange, UserProfile, RangeResult, CITY_OPTS } from '@/lib/calculator';
// Fixed import path to match standard Next.js alias
import { saveLeadAction, LeadContactData } from '@/src/app/actions/save-calculation';
import { 
  GraduationCap, Briefcase, 
  Loader2, Lock, Wallet, Building2, 
  CheckCircle2, X, ArrowRight, MapPin
} from 'lucide-react';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", 
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry"
];

export default function LeadGenCalculator() {
  // --- STATES ---
  const [profile, setProfile] = useState<UserProfile>({
    qualification: 'BSC Nursing',
    yearsExperience: 3,
    married: false,
    numChildren: 0,
    selectedCity: CITY_OPTS[1] // Default
  });

  const [leadData, setLeadData] = useState<LeadContactData>({
    name: '', age: '', email: '', phone: '', state: '' 
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [result, setResult] = useState<RangeResult | null>(null);
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- HANDLERS ---
  
  const handleInitialClick = () => {
    const previewData = calculateSimpleRange(profile);
    setResult(previewData); 
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (parseInt(leadData.age) < 18 || parseInt(leadData.age) > 65) {
        alert("Please enter a valid working age (18-65).");
        return;
    }
    if (!leadData.state) {
        alert("Please select your state.");
        return;
    }

    setLoading(true);

    // 1. Calculate the result right now
    const currentResult = calculateSimpleRange(profile);
    
    // 2. Send the data (including the new State)
    await saveLeadAction(profile, leadData, currentResult.annualSavingsLakhs); 

    setTimeout(() => {
      setLoading(false);
      setHasUnlocked(true);
      setIsModalOpen(false);
    }, 800);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // WhatsApp Handler
  const handleWhatsAppClick = () => {
    if (!result) return;
    const text = `Hi Taldo! I checked my salary potential for ${result.calculatedCity}. It shows I can save ${result.annualSavingsLakhs}/year. I want to start my Germany journey!`;
    window.open(`https://wa.me/919818956623?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-20 text-slate-600">
      
      {/* HERO (Refined Size) */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-[#7282F3] rounded-3xl p-8 md:p-10 text-center text-white shadow-xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h1 className="text-2xl md:text-4xl font-semibold leading-tight">
              German Nursing Salary Check
            </h1>
            <p className="text-base md:text-lg text-blue-50 font-medium">
              Calculate your exact earning potential in 2026.
            </p>
          </div>
        </div>
      </div>

      {/* CALCULATOR INPUT CARD */}
      <div className="max-w-3xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Qualification */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <GraduationCap className="w-4 h-4 text-[#7282F3]" /> Qualification
              </label>
              <select 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#7282F3] focus:ring-1 focus:ring-[#7282F3] outline-none font-medium text-slate-700 appearance-none transition-colors"
                value={profile.qualification}
                onChange={(e) => setProfile({...profile, qualification: e.target.value as any})}
              >
                <option value="BSC Nursing">B.Sc Nursing</option>
                <option value="MSC Nursing">M.Sc Nursing</option>
                <option value="GNM Nursing">GNM Diploma</option>
                <option value="Post BSC Nursing">Post Basic B.Sc</option>
              </select>
            </div>

            {/* City Selection */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Building2 className="w-4 h-4 text-[#7282F3]" /> Dream Location
              </label>
              <select 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#7282F3] focus:ring-1 focus:ring-[#7282F3] outline-none font-medium text-slate-700 appearance-none transition-colors"
                value={profile.selectedCity}
                onChange={(e) => setProfile({...profile, selectedCity: e.target.value})}
              >
                {CITY_OPTS.map(tier => (
                  <option key={tier} value={tier}>{tier}</option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Briefcase className="w-4 h-4 text-[#7282F3]" /> Experience (India)
              </label>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-slate-700">{profile.yearsExperience} Years</span>
                  <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">Drag to adjust</span>
                </div>
                <input 
                  type="range" min="0" max="15" step="1"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: '#7282F3' }}
                  value={profile.yearsExperience}
                  onChange={(e) => setProfile({...profile, yearsExperience: parseInt(e.target.value)})}
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
               <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                  <button onClick={() => setProfile({...profile, married: false})} className={`flex-1 rounded-md text-sm font-semibold transition-all py-2 ${!profile.married ? 'bg-white shadow-sm text-[#7282F3]' : 'text-slate-400'}`}>Single</button>
                  <button onClick={() => setProfile({...profile, married: true})} className={`flex-1 rounded-md text-sm font-semibold transition-all py-2 ${profile.married ? 'bg-white shadow-sm text-[#7282F3]' : 'text-slate-400'}`}>Married</button>
               </div>
               <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 px-4">
                  <span className="text-sm font-medium text-slate-500">Children</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setProfile({...profile, numChildren: Math.max(0, profile.numChildren - 1)})} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm font-bold text-slate-500 hover:text-[#7282F3]">-</button>
                    <span className="font-bold text-slate-700 w-4 text-center">{profile.numChildren}</span>
                    <button onClick={() => setProfile({...profile, numChildren: profile.numChildren + 1})} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm font-bold text-slate-500 hover:text-[#7282F3]">+</button>
                  </div>
               </div>
            </div>
          </div>

          <button 
            onClick={handleInitialClick}
            className="w-full bg-[#1F2536] text-white font-semibold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-base hover:bg-[#2c344a] active:scale-[0.99]"
          >
            Calculate My Potential
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* --- RESULT SECTION --- */}
        {result && (isModalOpen || hasUnlocked) && (
          <div className="mt-8 px-2 relative">
            
            <div className={`transition-all duration-700 ease-in-out ${isModalOpen ? 'blur-md opacity-40 select-none pointer-events-none' : 'blur-0 opacity-100 animate-in fade-in slide-in-from-bottom-4'}`}>
              
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative max-w-4xl mx-auto">
                
                {/* Top Banner (Classy) */}
                <div className="bg-slate-50/50 p-5 text-center border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Your Potential in <span className="text-[#7282F3]">{result.calculatedCity.split('(')[0]}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">{result.calculatedCity.split('(')[1]?.replace(')', '')}</p>
                </div>

                <div className="p-6 md:p-10 grid md:grid-cols-2 gap-10 items-center">
                    
                    {/* Left: Salary Ranges */}
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Wallet className="w-4 h-4 text-slate-400" />
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Annual Gross</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          {/* ADDED 'whitespace-nowrap' HERE */}
                          <span className="text-2xl md:text-3xl font-bold text-slate-800 whitespace-nowrap">
                            {result.grossRange}
                          </span>
                          <span className="text-sm text-slate-400 font-medium whitespace-nowrap">/ year</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Total package before tax</p>
                      </div>

                      <div className="h-px bg-slate-100 w-full"></div>

                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Annual Net</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          {/* ADDED 'whitespace-nowrap' HERE */}
                          <span className="text-2xl md:text-3xl font-bold text-emerald-600 whitespace-nowrap">
                            {result.netRange}
                          </span>
                          <span className="text-sm text-emerald-600/60 font-medium whitespace-nowrap">/ year</span>
                        </div>
                        <p className="text-xs text-emerald-600/60 mt-1">Cash in hand after all taxes</p>
                      </div>
                    </div>

                    {/* Right: The Dream (Refined Dark Card) */}
                    <div className="bg-[#1F2536] rounded-2xl p-8 text-white text-center relative overflow-hidden flex flex-col justify-center">
                      <div className="relative z-10">
                        <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-4">Potential Annual Savings</p>
                        
                        <div className="text-3xl md:text-4xl font-bold mb-2 text-[#7282F3] tracking-tight">
                          {result.annualSavingsLakhs}
                        </div>
                        
                        <p className="text-xs text-white/60 mb-6">
                          (Total Savings per Year)
                        </p>
                        
                        {/* BUTTON */}
                        <button 
                          onClick={handleWhatsAppClick}
                          className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold py-3.5 px-6 rounded-xl hover:brightness-110 transition-all duration-200 text-center text-sm shadow-lg mb-4"
                        >
                          Chat with our Career Counsellor
                        </button>
                        
                        {/* CTA Text */}
                        <p className="text-[10px] md:text-xs font-bold text-white/90 uppercase tracking-wide">
                           Start your Germany journey now!
                        </p>
                      </div>
                    </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-[10px] text-slate-400 max-w-xl mx-auto leading-relaxed px-4">
                  *Disclaimer: These figures are estimates based on projected 2026 TVöD-P tariffs and optimized living costs. 
                  Actual savings will vary based on specific tax class and location.
                </p>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* LEAD GEN MODAL (Cleaner Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1F2536]/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
             <button onClick={handleCloseModal} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500"><X className="w-5 h-5" /></button>
             
             <div className="text-center mb-6">
               <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
                 <Lock className="w-5 h-5 text-[#7282F3]" />
               </div>
               <h3 className="text-xl font-bold text-slate-800">Unlock Your Result</h3>
               <p className="text-sm text-slate-500 mt-1">Enter your details to see the 2026 forecast.</p>
             </div>

             <form onSubmit={handleFormSubmit} className="space-y-3">
                <input required placeholder="Full Name" value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-[#7282F3] transition-all text-sm" />
                
                <div className="grid grid-cols-2 gap-3">
                   <input 
                      required 
                      type="number" 
                      min="18" 
                      max="65" 
                      placeholder="Age" 
                      value={leadData.age} 
                      onChange={e => setLeadData({...leadData, age: e.target.value})} 
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-[#7282F3] transition-all text-sm" 
                   />
                   <input required type="tel" placeholder="Phone" value={leadData.phone} onChange={e => setLeadData({...leadData, phone: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-[#7282F3] transition-all text-sm" />
                </div>

                <input required type="email" placeholder="Email Address" value={leadData.email} onChange={e => setLeadData({...leadData, email: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-[#7282F3] transition-all text-sm" />
                
                {/* STATE DROPDOWN */}
                <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select 
                        required 
                        value={leadData.state} 
                        onChange={e => setLeadData({...leadData, state: e.target.value})} 
                        className="w-full p-3.5 pl-10 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-[#7282F3] text-slate-700 appearance-none text-sm"
                    >
                        <option value="" disabled>Select State (India)</option>
                        {INDIAN_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#7282F3] text-white font-semibold py-3.5 rounded-lg mt-2 shadow-md hover:bg-[#5f72eb] transition-colors">
                  {loading ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : 'Reveal Results'}
                </button>
             </form>
          </div>
        </div>
      )}

    </div>
  );
}