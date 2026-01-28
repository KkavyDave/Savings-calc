'use client';

import { useState } from 'react';
import Image from 'next/image';
import { calculateSimpleRange, UserProfile, RangeResult, CITY_OPTS } from '@/lib/calculator';
// Fixed import path to match standard Next.js alias
import { saveLeadAction, LeadContactData } from '@/src/app/actions/save-calculation';
import { 
  GraduationCap, Briefcase, 
  Loader2, Lock, Wallet, Building2, 
  CheckCircle2, X, ArrowRight 
} from 'lucide-react';

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
    name: '', age: '', email: '', phone: ''
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

    setLoading(true);

    // 1. Calculate the result right now so we have the data to save
    const currentResult = calculateSimpleRange(profile);
    
    // 2. Send the REAL savings string (e.g., "₹11.6 - ₹18.3 Lakhs")
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
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-20">
      
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-4 py-8 pt-12">
        <div className="bg-[#7282F3] rounded-[2.5rem] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              German Nursing Salary Check
            </h1>
            <p className="text-lg text-white/90 font-medium">
              Calculate your exact earning potential in 2026 based on your experience.
            </p>
          </div>
        </div>
      </div>

      {/* CALCULATOR INPUT CARD */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-10">
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Qualification */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7282F3]">
                <GraduationCap className="w-4 h-4" /> Qualification
              </label>
              <select 
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#7282F3] outline-none font-bold text-slate-700 appearance-none"
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
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7282F3]">
                <Building2 className="w-4 h-4" /> Dream Location
              </label>
              <select 
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#7282F3] outline-none font-bold text-slate-700 appearance-none"
                value={profile.selectedCity}
                onChange={(e) => setProfile({...profile, selectedCity: e.target.value})}
              >
                {CITY_OPTS.map(tier => (
                  <option key={tier} value={tier}>{tier}</option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7282F3]">
                <Briefcase className="w-4 h-4" /> Experience (India)
              </label>
              <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-100">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold text-slate-800">{profile.yearsExperience}</span>
                  <span className="text-xs font-bold text-slate-400 mb-1 uppercase">Years</span>
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
               <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  <button onClick={() => setProfile({...profile, married: false})} className={`flex-1 rounded-lg text-sm font-bold transition-all ${!profile.married ? 'bg-white shadow-sm text-[#7282F3]' : 'text-slate-400'}`}>Single</button>
                  <button onClick={() => setProfile({...profile, married: true})} className={`flex-1 rounded-lg text-sm font-bold transition-all ${profile.married ? 'bg-white shadow-sm text-[#7282F3]' : 'text-slate-400'}`}>Married</button>
               </div>
               <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100 px-4">
                  <span className="text-xs font-bold text-slate-400 uppercase">Kids</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setProfile({...profile, numChildren: Math.max(0, profile.numChildren - 1)})} className="w-8 h-8 bg-white rounded-lg shadow-sm font-bold text-slate-500">-</button>
                    <span className="font-bold text-slate-800">{profile.numChildren}</span>
                    <button onClick={() => setProfile({...profile, numChildren: profile.numChildren + 1})} className="w-8 h-8 bg-white rounded-lg shadow-sm font-bold text-slate-500">+</button>
                  </div>
               </div>
            </div>
          </div>

          <button 
            onClick={handleInitialClick}
            className="w-full bg-[#1F2536] text-white font-bold py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-lg hover:scale-[1.01]"
          >
            Calculate My Potential
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* --- RESULT SECTION --- */}
        {result && (isModalOpen || hasUnlocked) && (
          <div className="mt-12 px-4 relative">
            
            <div className={`transition-all duration-700 ease-in-out ${isModalOpen ? 'blur-lg grayscale opacity-50 select-none pointer-events-none scale-95' : 'blur-0 opacity-100 scale-100 animate-in fade-in slide-in-from-bottom-8'}`}>
              
              <div className="bg-white rounded-[2.5rem] border border-[#7282F3]/20 shadow-2xl overflow-hidden relative max-w-5xl mx-auto">
                
                {/* Top Banner */}
                <div className="bg-[#Eef2ff] p-6 text-center border-b border-[#7282F3]/10">
                  <h2 className="text-xl font-bold text-[#1F2536]">
                    Your Potential in <span className="text-[#7282F3]">{result.calculatedCity.split('(')[0]}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{result.calculatedCity.split('(')[1]?.replace(')', '')}</p>
                </div>

                <div className="p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
                    
                    {/* Left: Salary Ranges */}
                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Wallet className="w-5 h-5 text-[#7282F3]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Annual Gross Salary</span>
                        </div>
                        <div className="flex items-baseline gap-2 flex-nowrap">
                          <span className="text-2xl md:text-4xl font-extrabold text-[#1F2536] whitespace-nowrap">
                            {result.grossRange}
                          </span>
                          <span className="text-lg text-slate-400 font-medium whitespace-nowrap">/ yr</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Total package before tax</p>
                      </div>

                      <div className="h-px bg-slate-100 w-full"></div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Annual Net Salary</span>
                        </div>
                        <div className="flex items-baseline gap-2 flex-nowrap">
                          <span className="text-2xl md:text-4xl font-extrabold text-emerald-600 whitespace-nowrap">
                            {result.netRange}
                          </span>
                          <span className="text-lg text-emerald-400 font-medium whitespace-nowrap">/ yr</span>
                        </div>
                        <p className="text-xs text-emerald-400/80 mt-1">Cash in hand after all taxes</p>
                      </div>
                    </div>

                    {/* Right: The Dream (ANNUAL SAVINGS) */}
                    <div className="bg-[#1F2536] rounded-3xl p-8 text-white text-center relative overflow-hidden flex flex-col justify-center min-h-[250px]">
                      <div className="absolute top-0 left-0 w-full h-full bg-[#7282F3]/10"></div>
                      <div className="relative z-10">
                        <p className="text-sm font-medium text-white/60 uppercase tracking-widest mb-4">Potential Annual Savings</p>
                        
                        <div className="text-4xl md:text-5xl font-bold mb-2 text-[#7282F3]">
                          {result.annualSavingsLakhs}
                        </div>
                        
                        {/* Fixed Spacing: mb-6 instead of mb-8 */}
                        <p className="text-sm text-white/80 opacity-75 mb-6">
                          (Total Savings per Year)
                        </p>
                        
                        {/* SIMPLE WHATSAPP BUTTON (Fixed Spacing: added mb-4, added !) */}
                        <button 
                          onClick={handleWhatsAppClick}
                          className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold py-4 px-6 rounded-2xl hover:from-[#20bd5a] hover:to-[#0e7a6e] transition-all duration-300 text-center text-lg shadow-xl shadow-[#25D366]/20 hover:shadow-[#25D366]/40 hover:-translate-y-1 mb-4"
                        >
                          Chat with our Career Counsellor on WhatsApp!
                        </button>
                        
                        {/* HIGH ENERGY BOLD TEXT (Fixed Spacing: removed mt-4, added !) */}
                        <p className="text-xs md:text-sm font-extrabold text-white uppercase tracking-wider animate-pulse drop-shadow-md">
                           START YOUR GERMANY JOURNEY NOW!
                        </p>
                      </div>
                    </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-[10px] md:text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
                  *Disclaimer: These figures are estimates based on projected 2026 TVöD-P tariffs and optimized living costs (thrifty lifestyle). 
                  Actual savings will vary based on your specific tax class, lifestyle choices, and exact hospital location. 
                  This tool provides a simulation for planning purposes only.
                </p>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* LEAD GEN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1F2536]/60 backdrop-blur-[2px] animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200">
             <button onClick={handleCloseModal} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500"><X className="w-6 h-6" /></button>
             
             <div className="text-center mb-6">
               <div className="w-12 h-12 bg-[#Eef2ff] rounded-full flex items-center justify-center mx-auto mb-3">
                 <Lock className="w-6 h-6 text-[#7282F3]" />
               </div>
               <h3 className="text-2xl font-bold text-slate-800">Unlock Result</h3>
               <p className="text-sm text-slate-500 mt-1">Enter details to see your 2026 forecast.</p>
             </div>

             <form onSubmit={handleFormSubmit} className="space-y-4">
                <input required placeholder="Full Name" value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7282F3]" />
                <div className="grid grid-cols-2 gap-4">
                   <input 
                      required 
                      type="number" 
                      min="18" 
                      max="65" 
                      placeholder="Age" 
                      value={leadData.age} 
                      onChange={e => setLeadData({...leadData, age: e.target.value})} 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7282F3]" 
                   />
                   <input required type="tel" placeholder="Phone" value={leadData.phone} onChange={e => setLeadData({...leadData, phone: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7282F3]" />
                </div>
                <input required type="email" placeholder="Email Address" value={leadData.email} onChange={e => setLeadData({...leadData, email: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7282F3]" />
                <button type="submit" disabled={loading} className="w-full bg-[#7282F3] text-white font-bold py-4 rounded-xl mt-2 shadow-lg shadow-blue-500/20">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Reveal Results'}
                </button>
             </form>
          </div>
        </div>
      )}

    </div>
  );
}