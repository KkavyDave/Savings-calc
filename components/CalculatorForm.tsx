'use client';

import { useState, useRef } from 'react';
import { calculateSimpleRange, UserProfile, RangeResult, CITY_OPTS } from '@/lib/calculator';
import { saveLeadAction, LeadContactData } from '@/src/app/actions/save-calculation';
import { 
  Briefcase, 
  Loader2, Lock, Building2, 
  CheckCircle2, X, GraduationCap, Users, Calculator, Wallet, MapPin,
  RefreshCcw, Info, MessageCircle, Share2, AlertCircle
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
  } catch (e) { return ""; }
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
  const [recalculating, setRecalculating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const handleCalculate = () => {
    const freshResult = calculateSimpleRange(profile);
    if (!hasUnlocked) {
      setResult(freshResult);
      setIsModalOpen(true);
    } else {
      setRecalculating(true);
      setTimeout(() => {
        setResult(freshResult);
        setRecalculating(false);
      }, 400);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    const ageNum = parseInt(leadData.age);
    if (ageNum < 18 || ageNum > 50) {
      setValidationError("Age must be between 18 and 50 years.");
      return;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(leadData.phone)) {
      setValidationError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const currentResult = calculateSimpleRange(profile);
    await saveLeadAction(profile, leadData, currentResult.annualSavingsLakhs); 
    setTimeout(() => {
      setLoading(false);
      setHasUnlocked(true);
      setIsModalOpen(false);
    }, 800);
  };

  const handleReset = () => {
    setResult(null);
    setHasUnlocked(false);
    setProfile({
      qualification: 'BSC Nursing',
      yearsExperience: 3,
      married: false,
      numChildren: 0,
      selectedCity: CITY_OPTS[1]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppClick = () => {
    if (!result) return;
    const text = `Hi Taldo! I checked my salary potential for ${result.calculatedCity}. It shows I can save ${result.annualSavingsLakhs}/year. I want to start my Germany journey!`;
    window.open(`https://wa.me/917977905295?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareClick = () => {
    const shareText = `Hey! I just calculated my potential nursing salary in Germany 🇩🇪. Check yours here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans p-4 md:p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#5E72E4]/10 to-transparent pointer-events-none z-0 opacity-40 blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 text-center">
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-6">
                <div className="flex flex-col w-9 h-6 md:w-12 md:h-8 rounded-sm shadow-sm overflow-hidden border border-slate-200 flex-shrink-0">
                    <div className="h-1/3 bg-black w-full"></div>
                    <div className="h-1/3 bg-[#DD0000] w-full"></div>
                    <div className="h-1/3 bg-[#FFCE00] w-full"></div>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#2B3656] tracking-tight leading-tight">
                    Germany Salary Calculator <span className="text-[#5E72E4]">for Nurses</span> 
                </h1>
                <span className="text-3xl md:text-5xl lg:text-6xl flex-shrink-0">🏥</span>
            </div>
            <p className="text-slate-500 text-sm md:text-xl font-bold whitespace-nowrap">
       Calculate your gross salary, take-home salary and potential savings in Germany.
    </p>
        </div>

        <div className="grid lg:grid-cols-[450px_1fr] gap-10 items-start">
          <div className="lg:sticky lg:top-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgb(0,0,0,0.06)] p-8 border border-slate-100">
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <Briefcase className="w-5 h-5 text-[#5E72E4]" />
                  <h3 className="text-lg font-bold text-[#2B3656]">Professional Information</h3>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Qualification</label>
                     <select className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-[#2B3656] text-sm" value={profile.qualification} onChange={(e) => setProfile({...profile, qualification: e.target.value as any})}>
                       <option value="BSC Nursing">B.Sc Nursing</option>
                       <option value="MSC Nursing">M.Sc Nursing</option>
                       <option value="GNM Nursing">GNM Diploma</option>
                       <option value="Post BSC Nursing">Post Basic B.Sc</option>
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Choose Your Lifestyle</label>
                     <select className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-[#2B3656] text-sm" value={profile.selectedCity} onChange={(e) => setProfile({...profile, selectedCity: e.target.value})}>
                       <option value="Tier 1 (Munich, Frankfurt, Stuttgart)">Premium Metros(Frankfrut, Munish)</option>
                       <option value="Tier 2 (Berlin, Hamburg, Cologne)">Big City Life(Berlin, Hamburg)</option>
                       <option value="Tier 3 (Leipzig, Dresden, Halle)">Savings Hotspots(Leipzig, Dresden)</option>
                     </select>
                   </div>
                   <div className="space-y-4 pt-2">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Years of Experience</label>
                          <p className="text-[10px] text-slate-400 font-medium italic">Experience as a Nurse in India (excluding internship)</p>
                        </div>
                        <div className="bg-[#Eef2ff] text-[#5E72E4] px-4 py-1.5 rounded-full font-bold text-sm border border-[#5E72E4]/10">{profile.yearsExperience} Years</div>
                      </div>
                      <input type="range" min="0" max="15" step="1" className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#5E72E4]" value={profile.yearsExperience} onChange={(e) => setProfile({...profile, yearsExperience: parseInt(e.target.value)})} />
                   </div>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-[#5E72E4]" />
                  <h3 className="text-lg font-bold text-[#2B3656]">Personal Information</h3>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* BUTTON TEXT SIZE: text-lg */}
                    <button onClick={() => setProfile({...profile, married: false})} className={`py-4 rounded-xl text-lg font-bold transition-all ${!profile.married ? 'bg-[#5E72E4] text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>Single</button>
                    <button onClick={() => setProfile({...profile, married: true})} className={`py-4 rounded-xl text-lg font-bold transition-all ${profile.married ? 'bg-[#5E72E4] text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>Married</button>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Number of Children</label>
                    <div className="bg-slate-50 p-1.5 rounded-xl flex items-center justify-between px-2">
                      <button onClick={() => setProfile({...profile, numChildren: Math.max(0, profile.numChildren - 1)})} className="w-10 h-10 bg-white rounded-lg shadow-sm font-bold text-lg">-</button>
                      <span className="font-bold text-[#2B3656] text-xl">{profile.numChildren}</span>
                      <button onClick={() => setProfile({...profile, numChildren: profile.numChildren + 1})} className="w-10 h-10 bg-[#5E72E4] rounded-lg shadow-md text-white font-bold text-lg">+</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* MAIN ACTION BUTTON: text-xl */}
              <button onClick={handleCalculate} disabled={recalculating} className="w-full bg-[#5E72E4] text-white font-bold py-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-xl hover:scale-[1.02] active:scale-[0.98]">
                {recalculating ? <Loader2 className="animate-spin w-5 h-5" /> : (hasUnlocked ? 'Recalculate Savings' : 'Calculate My Savings')}
                {!recalculating && <Calculator className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-6 min-h-[600px]">
            {!hasUnlocked ? (
              <div className="bg-white rounded-[2.5rem] h-full flex flex-col items-center justify-center p-8 md:p-12 text-center border border-slate-100 shadow-[0_20px_60px_rgb(0,0,0,0.03)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#5E72E4]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-[#F4F7FE] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm transform -rotate-6">
                    <Lock className="w-8 h-8 text-[#5E72E4]" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#2B3656] mb-4">Unlock Your Germany Potential</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed">Join thousands of Indian nurses building a high-growth career with world-class benefits.</p>
                  <div className="grid gap-4 max-w-sm mx-auto mb-8 text-left">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#5E72E4] flex-shrink-0"><Wallet className="w-5 h-5" /></div>
                      <span className="text-base font-bold text-[#2B3656]">3x Higher Savings than India</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#5E72E4] flex-shrink-0"><MapPin className="w-5 h-5" /></div>
                      <span className="text-base font-bold text-[#2B3656]">Permanent Residency in 3-5 Years</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#5E72E4] flex-shrink-0"><Building2 className="w-5 h-5" /></div>
                      <span className="text-base font-bold text-[#2B3656]">Free Healthcare for your Family</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`transition-opacity duration-300 space-y-8 ${recalculating ? 'opacity-50' : 'opacity-100 animate-in fade-in slide-in-from-right-8'}`}>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Gross</p>
                      {/* VALUE TEXT SIZE: text-2xl */}
                      <div className="text-[#5E72E4] text-2xl font-bold mb-1">{result?.grossRange} <span className="text-xs text-slate-400">/ yr</span></div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Annual Gross Salary</p>
                   </div>
                   <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Net</p>
                      {/* VALUE TEXT SIZE: text-2xl */}
                      <div className="text-emerald-500 text-2xl font-bold mb-1">{result?.netRange} <span className="text-xs text-emerald-600/60">/ yr</span></div>
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Annual Net Salary</p>
                   </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-12 text-center relative overflow-hidden shadow-[0_30px_70px_rgb(0,0,0,0.07)] border border-slate-100">
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-[#Eef2ff] text-[#5E72E4] text-[10px] font-bold px-5 py-2 rounded-full uppercase mb-8 shadow-sm">Savings Goal</div>
                        <h3 className="text-2xl md:text-3xl font-bold text-[#2B3656] mb-4">Your Potential Annual Savings</h3>
                        <p className="text-slate-400 mb-8 text-sm ">After all living expenses (rent, food, transport) and taxes in Germany.</p>
                        {/* EUR RANGE SIZE: text-lg */}
                        <div className="text-lg md:text-xl font-bold text-slate-300 mb-4">{getEurRange(result?.annualSavingsLakhs || "")}</div>
                        <div className="flex items-baseline justify-center w-full mb-12">
                            <div className="flex items-center gap-3">
                                {/* MAIN RESULT SIZE: text-5xl to 7xl */}
                                <span className="text-5xl md:text-7xl font-extrabold text-[#5E72E4] tracking-tight drop-shadow-sm whitespace-nowrap">{result?.annualSavingsLakhs.replace(' Lakhs', '')}</span>
                                <span className="text-2xl md:text-3xl font-bold text-[#5E72E4]/80">Lakhs / yr</span>
                            </div>
                        </div>
                        <button onClick={handleReset} className="flex items-center gap-2 text-slate-400 hover:text-[#5E72E4] transition-colors font-bold text-base"><RefreshCcw className="w-5 h-5" /> Calculate Again</button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* BUTTON TEXT SIZE: text-xl */}
                    <button onClick={handleWhatsAppClick} className="bg-[#25D366] text-white font-bold py-6 px-8 rounded-[2rem] shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4 text-xl">
                        <MessageCircle className="w-6 h-6 fill-current" />
                        <span>Chat with Counsellor</span>
                    </button>
                    {/* BUTTON TEXT SIZE: text-xl */}
                    <button onClick={handleShareClick} className="bg-white text-[#5E72E4] font-bold py-6 px-8 rounded-[2rem] shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-4 border border-slate-100 text-xl">
                        <Share2 className="w-6 h-6" />
                        <span>Share with Friends</span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-[10px] text-slate-400 font-bold pt-4">
                    <div className="flex items-center gap-1.5"><Info className="w-3 h-3" /><span>Estimated conversion rate: 1 EUR = 104 INR</span></div>
                    <span className="hidden md:block opacity-30">•</span>
                    <span>Calculations are based on 2026 German tax projections</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL ACTION BUTTON SIZE: text-xl */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2B3656]/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 relative animate-in zoom-in-95 duration-200">
             <button onClick={() => {setIsModalOpen(false); setValidationError(null);}} className="absolute top-8 right-8 text-slate-300 hover:text-slate-500 transition-colors"><X className="w-6 h-6" /></button>
             <div className="text-center mb-8">
               <div className="w-16 h-16 bg-[#F4F7FE] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm"><Lock className="w-7 h-7 text-[#5E72E4]" /></div>
               <h3 className="text-2xl font-bold text-[#2B3656] mb-2">Unlock Result</h3>
               <p className="text-sm text-slate-500 font-medium">Enter your details to see your future in Germany!</p>
             </div>
             {validationError && (
               <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                 <p className="text-xs font-bold text-red-600">{validationError}</p>
               </div>
             )}
             <form onSubmit={handleFormSubmit} className="space-y-4">
                <input required placeholder="Full Name" value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})} className="w-full p-4 bg-[#F4F7FE] border border-transparent focus:bg-white focus:border-[#5E72E4] rounded-xl outline-none text-base font-bold text-[#2B3656]" />
                <div className="grid grid-cols-2 gap-4">
                   <input required type="number" placeholder="Age" value={leadData.age} onChange={e => setLeadData({...leadData, age: e.target.value})} className="w-full p-4 bg-[#F4F7FE] border border-transparent focus:bg-white focus:border-[#5E72E4] rounded-xl outline-none text-base font-bold text-[#2B3656]" />
                   <input required type="tel" placeholder="Phone" value={leadData.phone} onChange={e => setLeadData({...leadData, phone: e.target.value})} className="w-full p-4 bg-[#F4F7FE] border border-transparent focus:bg-white focus:border-[#5E72E4] rounded-xl outline-none text-base font-bold text-[#2B3656]" />
                </div>
                <input required type="email" placeholder="Email Address" value={leadData.email} onChange={e => setLeadData({...leadData, email: e.target.value})} className="w-full p-4 bg-[#F4F7FE] border border-transparent focus:bg-white focus:border-[#5E72E4] rounded-xl outline-none text-base font-bold text-[#2B3656]" />
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select required value={leadData.state} onChange={e => setLeadData({...leadData, state: e.target.value})} className="w-full p-4 pl-11 bg-[#F4F7FE] border border-transparent focus:bg-white focus:border-[#5E72E4] rounded-xl outline-none text-[#2B3656] appearance-none text-base font-bold cursor-pointer">
                        <option value="" disabled>Select State (India)</option>
                        {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#5E72E4] text-white font-bold py-5 rounded-2xl mt-4 shadow-xl hover:bg-[#4e62cf] transition-all flex items-center justify-center text-xl">
                  {loading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Reveal Results'}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
