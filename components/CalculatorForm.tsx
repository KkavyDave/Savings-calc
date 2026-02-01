'use client';

import { useState, useRef } from 'react';
import { calculateSimpleRange, UserProfile, RangeResult, CITY_OPTS } from '@/lib/calculator';
// Ensure this path matches your project structure
import { saveLeadAction, LeadContactData } from '@/src/app/actions/save-calculation';
import { 
  Briefcase, 
  Loader2, Lock, Building2, 
  CheckCircle2, X, GraduationCap, Users, Calculator, Wallet, MapPin,
  RefreshCcw, Info, MessageCircle
} from 'lucide-react';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", 
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry"
];

const getEurRange = (inrString: string) => {
  try {
    const matches = inrString.match(/(\d+\.?\d*)/g); 
    if (!matches || matches.length < 2) return "";

    const minLakh = parseFloat(matches[0]);
    const maxLakh = parseFloat(matches[1]);

    const minEur = (minLakh * 100000) / 104;
    const maxEur = (maxLakh * 100000) / 104;

    const fmt = (n: number) => `€${(n / 1000).toFixed(1)}k`;
    return `${fmt(minEur)} - ${fmt(maxEur)}`;
  } catch (e) {
    return "";
  }
};

export default function LeadGenCalculator() {
  const [profile, setProfile] = useState<UserProfile>({
    qualification: 'BSC Nursing',
    yearsExperience: 3,
    married: false,
    numChildren: 0,
    selectedCity: CITY_OPTS[1] 
  });

  const [leadData, setLeadData] = useState<LeadContactData>({
    name: '', age: '', email: '', phone: '', state: '' 
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [result, setResult] = useState<RangeResult | null>(null);
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const resultRef = useRef<HTMLDivElement>(null);

  const handleInitialClick = () => {
    const previewData = calculateSimpleRange(profile);
    setResult(previewData); 
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(leadData.age) < 18 || parseInt(leadData.age) > 65) {
        alert("Please enter a valid working age (18-65).");
        return;
    }
    if (!leadData.state) {
        alert("Please select your state.");
        return;
    }
    setLoading(true);
    const currentResult = calculateSimpleRange(profile);
    await saveLeadAction(profile, leadData, currentResult.annualSavingsLakhs); 
    setTimeout(() => {
      setLoading(false);
      setHasUnlocked(true);
      setIsModalOpen(false);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 800);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleReset = () => {
    setResult(null);
    setHasUnlocked(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppClick = () => {
    if (!result) return;
    const text = `Hi Taldo! I checked my salary potential for ${result.calculatedCity}. It shows I can save ${result.annualSavingsLakhs}/year. I want to start my Germany journey!`;
    window.open(`https://wa.me/917977905295?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans pb-20 flex flex-col items-center p-4 md:p-8 gap-8">
      
      {/* --- INPUT SECTION --- */}
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgb(0,0,0,0.08)] p-8 md:p-12 relative overflow-hidden border border-slate-100">
        <div className="mb-10 text-center md:text-left">
          <div className="flex justify-between items-start mb-4">
             <h1 className="text-2xl md:text-3xl font-bold text-[#2B3656] tracking-tight leading-tight">
               Germany Salary Calculator <br className="hidden md:block" /> for Registered Nurses
             </h1>
          </div>
          <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed max-w-xl">
            Calculate your gross salary, take-home salary and potential savings in Germany.
          </p>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-[#5E72E4]" />
            <h3 className="text-lg font-bold text-[#2B3656]">Professional Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
             <div className="space-y-2">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Qualification</label>
               <div className="relative group">
                 <select 
                   className="w-full p-4 pr-10 bg-slate-50 border-2 border-transparent group-hover:border-[#E8ECF7] focus:border-[#5E72E4]/20 rounded-2xl outline-none font-bold text-[#2B3656] appearance-none transition-all cursor-pointer text-sm"
                   value={profile.qualification}
                   onChange={(e) => setProfile({...profile, qualification: e.target.value as any})}
                 >
                   <option value="BSC Nursing">B.Sc Nursing</option>
                   <option value="MSC Nursing">M.Sc Nursing</option>
                   <option value="GNM Nursing">GNM Diploma</option>
                   <option value="Post BSC Nursing">Post Basic B.Sc</option>
                 </select>
                 <div className="absolute right-2 top-2 bottom-2 w-10 bg-gradient-to-br from-[#E8ECF7] to-white rounded-xl pointer-events-none flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-slate-300" />
                 </div>
               </div>
             </div>
             <div className="space-y-2">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Choose Your Lifestyle</label>
               <div className="relative group">
                 <select 
                   className="w-full p-4 pr-10 bg-slate-50 border-2 border-transparent group-hover:border-[#E8ECF7] focus:border-[#5E72E4]/20 rounded-2xl outline-none font-bold text-[#2B3656] appearance-none transition-all cursor-pointer text-sm"
                   value={profile.selectedCity}
                   onChange={(e) => setProfile({...profile, selectedCity: e.target.value})}
                 >
                   <option value="Tier 1 (Munich, Frankfurt, Stuttgart)">Premium Metros(Frankfrut, Munish)</option>
                   <option value="Tier 2 (Berlin, Hamburg, Cologne)">Big City Life(Berlin, Hamburg)</option>
                   <option value="Tier 3 (Leipzig, Dresden, Halle)">Savings Hotspots(Leipzig, Dresden)</option>
                 </select>
                 <div className="absolute right-2 top-2 bottom-2 w-10 bg-gradient-to-br from-[#E8ECF7] to-white rounded-xl pointer-events-none flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-slate-300" />
                 </div>
               </div>
             </div>
          </div>

          {/* Experience Slider with Sub-heading */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
               <div className="flex flex-col gap-1">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                   Your Years of Experience
                 </label>
                 <p className="text-[10px] text-slate-400 font-medium">
                   Experience as a Nurse in India (excluding internship)
                 </p>
               </div>
               <div className="bg-[#Eef2ff] text-[#5E72E4] px-4 py-1.5 rounded-full font-bold text-sm shadow-sm border border-[#5E72E4]/10">
                 {profile.yearsExperience} Years
               </div>
            </div>
            <div className="relative pt-2 pb-4">
              <input 
                  type="range" min="0" max="15" step="1"
                  className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#5E72E4]"
                  value={profile.yearsExperience}
                  onChange={(e) => setProfile({...profile, yearsExperience: parseInt(e.target.value)})}
              />
              <div className="flex justify-between text-[10px] text-slate-300 font-bold mt-2 uppercase tracking-widest px-1">
                <span>0 Yrs</span>
                <span>15+ Yrs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-[#5E72E4]" />
            <h3 className="text-lg font-bold text-[#2B3656]">Personal Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Marital Status</label>
              <div className="bg-slate-50 p-1.5 rounded-xl flex relative">
                <button 
                  onClick={() => setProfile({...profile, married: false})} 
                  className={`flex-1 py-3.5 rounded-lg text-sm font-bold transition-all duration-200 z-10 ${!profile.married ? 'bg-white shadow-sm text-[#5E72E4]' : 'text-slate-400 hover:text-slate-500'}`}
                >
                  Single
                </button>
                <button 
                  onClick={() => setProfile({...profile, married: true})} 
                  className={`flex-1 py-3.5 rounded-lg text-sm font-bold transition-all duration-200 z-10 ${profile.married ? 'bg-white shadow-sm text-[#5E72E4]' : 'text-slate-400 hover:text-slate-500'}`}
                >
                  Married
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Number of Children</label>
              <div className="bg-slate-50 p-1.5 rounded-xl flex items-center justify-between px-2">
                 <button 
                   onClick={() => setProfile({...profile, numChildren: Math.max(0, profile.numChildren - 1)})}
                   className="w-10 h-10 bg-white rounded-lg shadow-sm text-slate-400 hover:text-[#5E72E4] font-bold flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                 > - </button>
                 <span className="font-bold text-[#2B3656] text-lg">{profile.numChildren}</span>
                 <button 
                   onClick={() => setProfile({...profile, numChildren: profile.numChildren + 1})}
                   className="w-10 h-10 bg-[#5E72E4] rounded-lg shadow-md text-white font-bold flex items-center justify-center transition-all hover:bg-[#4a5ec4] hover:scale-105 active:scale-95"
                 > + </button>
              </div>
            </div>
          </div>
        </div>

        <button 
            onClick={handleInitialClick}
            className="w-full bg-[#5E72E4] text-white font-bold py-5 rounded-2xl shadow-xl shadow-[#5E72E4]/20 transition-all flex items-center justify-center gap-3 text-lg hover:translate-y-[-2px] hover:shadow-2xl active:translate-y-[1px]"
        >
          {hasUnlocked ? 'Recalculate Savings' : 'Calculate My Savings'}
          <Calculator className="w-5 h-5" />
        </button>

        <p className="text-center text-[10px] text-slate-300 mt-6 font-medium">
          * Calculations are estimates based on 2026 German tax projections and average cost of living indices.
        </p>
      </div>


      {/* --- RESULT SECTION --- */}
      {result && (isModalOpen || hasUnlocked) && (
        <div ref={resultRef} className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#2B3656]">
                    Your New Life in <span className="text-[#5E72E4]">Germany</span>
                </h2>
                <p className="text-slate-400 text-sm mt-2">Here is what your financial future could look like.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden h-full">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-12 h-12 bg-[#Eef2ff] rounded-2xl flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-[#5E72E4]" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Gross</p>
                    </div>
                    <div>
                        <div className="text-[#5E72E4] text-2xl md:text-3xl font-bold mb-1 whitespace-nowrap tracking-tight">
                             {result.grossRange} <span className="text-sm text-slate-400 font-medium">/ yr</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Annual Gross Salary</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed">Total salary before taxes and social deductions</p>
                    </div>
                </div>

                <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden h-full">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Net</p>
                    </div>
                    <div>
                        <div className="text-emerald-500 text-2xl md:text-3xl font-bold mb-1 whitespace-nowrap tracking-tight">
                             {result.netRange} <span className="text-sm text-emerald-600/60 font-medium">/ yr</span>
                        </div>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">Annual Net Salary</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed">Total salary after taxes and social deductions</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-slate-100 mb-6">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white z-0"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-[#Eef2ff] text-[#5E72E4] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 border border-[#5E72E4]/10 shadow-sm">
                        Savings Goal
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#2B3656] mb-2">
                        Your Potential Annual Savings
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                        After all living expenses (rent, food, transport) and taxes in Germany.
                    </p>
                    <div className="text-lg md:text-xl font-bold text-slate-400 mb-2">
                        {getEurRange(result.annualSavingsLakhs)}
                    </div>
                    <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 mb-10 w-full">
                        <span className="text-4xl md:text-6xl font-extrabold text-[#5E72E4] tracking-tight drop-shadow-sm whitespace-nowrap">
                            {result.annualSavingsLakhs.replace(' Lakhs', '')}
                        </span>
                        <span className="text-2xl md:text-3xl font-bold text-[#5E72E4]/80">
                            Lakhs / yr
                        </span>
                    </div>
                    <button 
                        onClick={handleReset}
                        className="bg-[#5E72E4] hover:bg-[#4e62cf] text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-[#5E72E4]/30 hover:shadow-xl hover:-translate-y-1 transition-all text-sm flex items-center gap-2 min-w-[200px] justify-center"
                    >
                        <RefreshCcw className="w-4 h-4" /> Calculate Again
                    </button>
                </div>
            </div>

            {/* FULL WIDTH WHATSAPP CTA */}
            <button 
                onClick={handleWhatsAppClick}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-6 px-8 rounded-[2rem] shadow-xl shadow-green-500/20 hover:shadow-green-500/30 transition-all flex items-center justify-center gap-4 mb-6"
            >
                <MessageCircle className="w-6 h-6 fill-current" />
                <span className="text-base md:text-lg">Ready to move to Germany? Chat with our Counsellor</span>
            </button>

            {/* COMPACT FOOTER INFO */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-[10px] text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Info className="w-3 h-3" />
                  <span>1 EUR = 104 INR</span>
                </div>
                <span className="hidden md:block opacity-30">•</span>
                <span>Estimates based on 2026 projections</span>
            </div>

        </div>
      )}

      {/* LEAD GEN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2B3656]/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200">
             <button onClick={handleCloseModal} className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors"><X className="w-5 h-5" /></button>
             <div className="text-center mb-8">
               <div className="w-14 h-14 bg-[#F4F7FE] rounded-full flex items-center justify-center mx-auto mb-4">
                 <Lock className="w-6 h-6 text-[#5E72E4]" />
               </div>
               <h3 className="text-2xl font-bold text-[#2B3656]">Unlock Result</h3>
               <p className="text-sm text-slate-500 mt-2 font-medium">Enter your details to see your future in Germany!</p>
             </div>
             <form onSubmit={handleFormSubmit} className="space-y-4">
                <input required placeholder="Full Name" value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})} className="w-full p-4 bg-[#F4F7FE] border border-transparent focus:bg-white focus:border-[#5E72E4] rounded-xl outline-none transition-all text-sm font-semibold text-[#2B3656]" />
                <div className="grid grid-cols-2 gap-4">
                   <input required type="number" min="18" max="65" placeholder="Age" value={leadData.age} onChange={e => setLeadData({...leadData, age: e.target.value})} className="w-full p-4 bg-[#F4F7FE] border border-transparent focus:bg-white focus:border-[#5E72E4] rounded-xl outline-none transition-all text-sm font-semibold text-[#2B3656]" />
                   <input required type="tel" placeholder="Phone" value={leadData.phone} onChange={e => setLeadData({...leadData, phone: e.target.value})} className="w-full p-4 bg-[#F4F7FE] border border-transparent focus:bg-white focus:border-[#5E72E4] rounded-xl outline-none transition-all text-sm font-semibold text-[#2B3656]" />
                </div>
                <input required type="email" placeholder="Email Address" value={leadData.email} onChange={e => setLeadData({...leadData, email: e.target.value})} className="w-full p-4 bg-[#F4F7FE] border border-transparent focus:bg-white focus:border-[#5E72E4] rounded-xl outline-none transition-all text-sm font-semibold text-[#2B3656]" />
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select required value={leadData.state} onChange={e => setLeadData({...leadData, state: e.target.value})} className="w-full p-4 pl-10 bg-[#F4F7FE] border border-transparent focus:bg-white focus:border-[#5E72E4] rounded-xl outline-none text-[#2B3656] appearance-none text-sm font-semibold cursor-pointer">
                        <option value="" disabled>Select State (India)</option>
                        {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#5E72E4] text-white font-bold py-4 rounded-xl mt-2 shadow-lg hover:bg-[#4e62cf] transition-all">
                  {loading ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : 'Reveal Results'}
                </button>
             </form>
          </div>
        </div>
      )}

    </div>
  );
}