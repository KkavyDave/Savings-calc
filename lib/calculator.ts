export const CITY_OPTS = [
  "Tier 1 (Munich, Frankfurt, Stuttgart)",
  "Tier 2 (Berlin, Hamburg, Cologne)",
  "Tier 3 (Leipzig, Dresden, Halle)"
];

export interface UserProfile {
  qualification: string;
  yearsExperience: number;
  married: boolean;
  numChildren: number;
  selectedCity: string;
}

export interface RangeResult {
  grossRange: string;
  netRange: string;
  annualSavingsLakhs: string; // "₹12.5 - ₹16.0 Lakhs"
  calculatedCity: string;
}

export function calculateSimpleRange(profile: UserProfile): RangeResult {
  
  // --- 1. BASE GROSS SALARY (ANNUAL) ---
  // Based on TVöD-P 7 Step 2 (~€3,340/mo) + Monthly Shift Allowances (~€400) + 13th Month Salary
  // Base Annual ≈ €45,000
  let estimatedGross = 45000;

  // --- 2. LOGIC CHANGE: EXPERIENCE MULTIPLIER ---
  // Indian experience is discounted. Most start as freshers.
  if (profile.yearsExperience < 5) {
    // No Boost - "Fresher" level in Germany
    estimatedGross = estimatedGross; 
  } 
  else if (profile.yearsExperience >= 5 && profile.yearsExperience <= 10) {
    // 5-10 Years: +5% Recognition
    estimatedGross = estimatedGross * 1.05; 
  } 
  else {
    // 10+ Years: +10% Recognition
    estimatedGross = estimatedGross * 1.10; 
  }

  // --- 3. CITY ADJUSTMENT (Cost of Living Allowance) ---
  // Tier 1 cities often pay a "Ballungsraumzulage" (Metro Allowance) ~€150/mo
  if (profile.selectedCity.includes("Tier 1")) {
    estimatedGross += 1800; // +€150 * 12
  }

  // --- 4. NET CALCULATION (Simplified Tax) ---
  // Married (Tax Class 3) keeps ~68% | Single (Tax Class 1) keeps ~60%
  const retentionRate = profile.married ? 0.68 : 0.60;
  let netSalary = estimatedGross * retentionRate;

  // Add Kindergeld (Child Benefit): ~€250/month per child (Tax free)
  const childBenefit = profile.numChildren * 250 * 12;
  const totalAnnualNet = netSalary + childBenefit;

  // --- 5. SAVINGS CALCULATION ---
  // Estimated Annual Living Costs (Rent, Food, Transport)
  // Tier 1: High Cost | Tier 3: Low Cost
  let annualLivingCost = 12000; // Base (Tier 2) ~€1000/mo
  
  if (profile.selectedCity.includes("Tier 1")) {
    annualLivingCost = 15600; // ~€1300/mo
  } else if (profile.selectedCity.includes("Tier 3")) {
    annualLivingCost = 10200; // ~€850/mo
  }

  // Married people have slightly higher living costs (shared apartment)
  if (profile.married) {
    annualLivingCost *= 1.4; // +40% for spouse
  }
  // Children add cost (~€200 marginal cost/mo per child after Kindergeld offset)
  annualLivingCost += (profile.numChildren * 1500);

  const potentialSavingsEUR = totalAnnualNet - annualLivingCost;

  // --- 6. FORMATTING OUTPUT ---
  
  // Exchange Rate
  const INR_RATE = 104;

  // Create a realistic spread (+/- €1.5k for salaries, +/- ₹1 Lakh for savings)
  const minGross = estimatedGross - 1500;
  const maxGross = estimatedGross + 2500;
  
  const minNet = totalAnnualNet - 1000;
  const maxNet = totalAnnualNet + 1500;

  // Savings in Lakhs
  const minSavingsLakhs = ((potentialSavingsEUR - 1000) * INR_RATE) / 100000;
  const maxSavingsLakhs = ((potentialSavingsEUR + 2000) * INR_RATE) / 100000;

  // Helper to format Euro "€45.5k"
  const fmtEur = (val: number) => `€${(val/1000).toFixed(1)}k`;

  return {
    grossRange: `${fmtEur(minGross)} - ${fmtEur(maxGross)}`,
    netRange: `${fmtEur(minNet)} - ${fmtEur(maxNet)}`,
    // Formats as "₹12.5 - ₹15.2 Lakhs"
    annualSavingsLakhs: `₹${minSavingsLakhs.toFixed(1)} - ₹${maxSavingsLakhs.toFixed(1)} Lakhs`,
    calculatedCity: profile.selectedCity
  };
}