// src/lib/calculator.ts

// 1. DATA TYPES
export type Qualification = 'BSC Nursing' | 'MSC Nursing' | 'GNM Nursing' | 'Post BSC Nursing';

export interface UserProfile {
  qualification: Qualification;
  yearsExperience: number;
  married: boolean;
  numChildren: number;
  selectedCity: string;
}

export interface RangeResult {
  grossRange: string;
  netRange: string;
  monthlySavingsLakhs: string;
  annualSavingsLakhs: string;
  calculatedCity: string;
}

// 2. CONSTANTS
const EXCHANGE_RATE = 105; 

// Simplified Tier Logic 
// ADUSTMENT: Lowered Rents to match the Reference Sheet (€700 range)
const TIER_DATA: Record<string, { allowance: number, colFactor: number, baseRent: number, childcareCost: number }> = {
  'Tier 1 (Munich, Frankfurt, Stuttgart)': { 
    allowance: 250, 
    colFactor: 1.35, 
    baseRent: 1000, // Reduced from 1100
    childcareCost: 300
  },
  'Tier 2 (Berlin, Hamburg, Cologne)': { 
    allowance: 150, 
    colFactor: 1.15, 
    baseRent: 750, // MATCHES REFERENCE SHEET (€700-750 range)
    childcareCost: 150
  },
  'Tier 3 (Leipzig, Dresden, Dortmund)': { 
    allowance: 0,   
    colFactor: 0.85, 
    baseRent: 500, // Very affordable
    childcareCost: 100
  }
};

export const CITY_OPTS = Object.keys(TIER_DATA);

// 3. LOGIC
export function calculateSimpleRange(profile: UserProfile): RangeResult {
  
  // A. Base Tariff 
  let baseEur = 36000; 
  if (profile.yearsExperience > 2) baseEur = 39000;
  if (profile.yearsExperience > 5) baseEur = 42000;
  if (profile.yearsExperience > 10) baseEur = 45000;

  // B. Tier Logic
  const tierInfo = TIER_DATA[profile.selectedCity] || TIER_DATA['Tier 2 (Berlin, Hamburg, Cologne)'];

  let cityAllowance = tierInfo.allowance * 12;
  // Tier 1 Family Bonus Logic
  if (profile.selectedCity.includes('Tier 1')) {
     cityAllowance += (profile.numChildren * 50 * 12);
  }

  const shiftBonus = baseEur * 0.15; 
  
  // C. GROSS RANGE
  const grossMinEur = baseEur + cityAllowance; 
  const grossMaxEur = baseEur + shiftBonus + cityAllowance;

  // D. NET RANGE
  const taxRateMin = profile.married ? 0.30 : 0.36; 
  const taxRateMax = profile.married ? 0.32 : 0.39;

  const netMinEur = grossMinEur * (1 - taxRateMax); 
  const netMaxEur = grossMaxEur * (1 - taxRateMin);

  // E. SAVINGS Calculation (ALIGNED WITH SHEET)
  
  // 1. Rent: Base cost (Assuming shared flat/dorm initially)
  let rentCost = tierInfo.baseRent; 
  if (profile.married) rentCost *= 1.2; 
  if (profile.numChildren > 0) rentCost *= 1.1; 

  // 2. Childcare
  const kitaCost = profile.numChildren * tierInfo.childcareCost;

  // 3. Living (Aligned with Sheet: Food €400)
  // Single: €400 (Matches "Food Expenses" from sheet). 
  // Spouse: +€200. Child: +€150.
  const livingCost = 400 + (profile.married ? 200 : 0) + (profile.numChildren * 150);

  const totalMonthlyCost = rentCost + kitaCost + livingCost;
  const totalAnnualCost = totalMonthlyCost * 12;

  // Savings Logic
  // Min Savings: Standard Net - Cost
  const savingsMinEur = Math.max(4800, netMinEur - totalAnnualCost); 
  
  // Max Savings: High Net - (Optimized Cost * 0.9) + Kindergeld
  const savingsMaxEur = Math.max(savingsMinEur + 2000, netMaxEur - (totalAnnualCost * 0.9) + (profile.numChildren * 3000));

  // F. Format
  const toLakhs = (eur: number) => (eur * EXCHANGE_RATE / 100000).toFixed(1);

  return {
    grossRange: `₹${toLakhs(grossMinEur)} - ₹${toLakhs(grossMaxEur)} Lakhs`,
    netRange: `₹${toLakhs(netMinEur)} - ₹${toLakhs(netMaxEur)} Lakhs`,
    monthlySavingsLakhs: `₹${((savingsMinEur * EXCHANGE_RATE / 12) / 1000).toFixed(0)}k - ₹${((savingsMaxEur * EXCHANGE_RATE / 12) / 1000).toFixed(0)}k`,
    annualSavingsLakhs: `₹${toLakhs(savingsMinEur)} - ₹${toLakhs(savingsMaxEur)} Lakhs`,
    calculatedCity: profile.selectedCity
  };
}