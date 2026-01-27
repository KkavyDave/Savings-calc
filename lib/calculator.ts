// src/lib/calculator.ts

// 1. CITY DATA (Unchanged)
// Kept 'churchTaxRate' because it differs by State (Bavaria/BW = 8%, others = 9%).
export const CITY_OPTS = {
  // BAVARIA (8% Church Tax)
  'Munich':    { tier: 1, baseRent: 1400, childcareCost: 450, churchTaxRate: 0.08 },
  'Nuremberg': { tier: 3, baseRent: 850,  childcareCost: 120, churchTaxRate: 0.08 },

  // BADEN-WÜRTTEMBERG (8% Church Tax)
  'Stuttgart': { tier: 1, baseRent: 1300, childcareCost: 200, churchTaxRate: 0.08 },

  // REST OF GERMANY (9% Church Tax)
  'Frankfurt': { tier: 1, baseRent: 1350, childcareCost: 290, churchTaxRate: 0.09 },
  'Hamburg':   { tier: 2, baseRent: 1150, childcareCost: 50,  churchTaxRate: 0.09 },
  'Düsseldorf':{ tier: 2, baseRent: 1050, childcareCost: 250, churchTaxRate: 0.09 },
  'Cologne':   { tier: 2, baseRent: 1050, childcareCost: 200, churchTaxRate: 0.09 },
  'Berlin':    { tier: 2, baseRent: 1100, childcareCost: 23,  churchTaxRate: 0.09 },
  'Dortmund':  { tier: 3, baseRent: 750,  childcareCost: 100, churchTaxRate: 0.09 },
  'Essen':     { tier: 3, baseRent: 750,  childcareCost: 100, churchTaxRate: 0.09 },
  'Leipzig':   { tier: 3, baseRent: 750,  childcareCost: 150, churchTaxRate: 0.09 },
  'Dresden':   { tier: 3, baseRent: 700,  childcareCost: 160, churchTaxRate: 0.09 },
  'Hanover':   { tier: 3, baseRent: 800,  childcareCost: 130, churchTaxRate: 0.09 },
  'Bremen':    { tier: 3, baseRent: 800,  childcareCost: 130, churchTaxRate: 0.09 },
} as const;

export type CityName = keyof typeof CITY_OPTS;

export type UserScenario = {
  role: 'Nurse' | 'Doctor';
  grossAnnualEth: number;
  taxClass: 1 | 3 | 4;
  married: boolean;
  partnerWorks: boolean;
  hasChildren: boolean;
  numChildren: number;
  city: CityName;
  maidService: 'None' | 'Weekly (4h)' | 'Regular (10h)';
  eatingOut: 'Rarely' | 'Weekly' | 'Frequent';
  healthInsurance: 'Public' | 'Private';
  customFoodBudget: number;
  useCustomFood: boolean;
  isChurchMember: boolean;
};

export const calculateGermanReality = (data: UserScenario) => {
  const { 
    grossAnnualEth, married, partnerWorks, hasChildren, numChildren, 
    city, maidService, eatingOut, healthInsurance,
    customFoodBudget, useCustomFood, isChurchMember
  } = data;
  
  const monthlyGross = grossAnnualEth / 12;
  const cityData = CITY_OPTS[city];

  // --- 1. DETERMINE TAX CLASS ---
  let calculatedTaxClass = 1;
  if (married) {
    calculatedTaxClass = partnerWorks ? 4 : 3;
  }

  // --- 2. SOCIAL SECURITY (2026 Constants) ---
  const KV_CEILING = 5812.50; // Health Insurance Limit
  
  // UNIFIED PENSION LIMIT (Kept as per user instruction)
  const RV_CEILING = 8050.00; 
  
  const rv = Math.min(monthlyGross, RV_CEILING) * 0.093;
  const av = Math.min(monthlyGross, RV_CEILING) * 0.013;
  
  let kvAndPv = 0;
  if (healthInsurance === 'Public') {
    // Health (KV): 7.3% Base + 1.25% Avg Surcharge
    const kv = Math.min(monthlyGross, KV_CEILING) * 0.0855; 
    
    // Care (PV) - 2026 Rates & PUEG Child Discount
    // UPDATE: Childless base rose to 2.4%, Parent base to 1.8%
    let pvRate = 0.024; // New 2026 Childless Rate
    if (hasChildren) {
       pvRate = 0.018; // New 2026 Parent Base
       if (numChildren > 1) {
         // Cap discount at 5 children (max 1.0% reduction)
         const discount = Math.min(numChildren - 1, 4) * 0.0025; 
         pvRate -= discount;
       }
    }
    const pv = Math.min(monthlyGross, KV_CEILING) * pvRate;
    kvAndPv = kv + pv;
  } else {
    kvAndPv = 620; // Private Estimate
  }
  const totalSocial = rv + av + kvAndPv;

  // --- 3. PROGRESSIVE TAX ENGINE (Tiered Linear Approximation) ---
  // Note: Allowance kept at €12,348 / €24,696 as per current config
  const taxFreeLimit = calculatedTaxClass === 3 ? 24696 : 12348;
  const taxableIncome = Math.max(0, grossAnnualEth - (totalSocial * 12) - taxFreeLimit);
  
  let annualTax = 0;

  // Helper: Calculates tax in buckets to mimic geometric curve
  const calcTieredTax = (income: number) => {
    let tax = 0;
    let remainder = income;

    // Bucket 1: Low Income Progression (~19% avg)
    // Range: €0 to €4,652 (above allowance)
    const tier1Limit = 4652; 
    const tier1Amt = Math.min(remainder, tier1Limit);
    tax += tier1Amt * 0.19; 
    remainder -= tier1Amt;

    if (remainder <= 0) return tax;

    // Bucket 2: Main Progression (~33% avg)
    // Range: €4,653 to €57,531 (New upper limit based on €69,879 threshold)
    // Old Math: 54,413 width. New Math: 69,879 (Threshold) - 12,348 (Allowance) = 57,531 width.
    const tier2Limit = 57531 - 4652; // Width of Zone 3
    const tier2Amt = Math.min(remainder, tier2Limit);
    tax += tier2Amt * 0.33; 
    remainder -= tier2Amt;

    if (remainder <= 0) return tax;

    // Bucket 3: Top Tax Rate (42%)
    // Range: From €69,879 up to €277,826
    const reichensteuerThreshold = 277826;
    // Current total accounted for: Allowance (12348) + Tier 1/2 width (57531) = 69,879
    const tier3Limit = reichensteuerThreshold - (12348 + 57531); 
    
    const tier3Amt = Math.min(remainder, tier3Limit);
    tax += tier3Amt * 0.42;
    remainder -= tier3Amt;

    if (remainder <= 0) return tax;

    // Bucket 4: Rich Tax (45%)
    tax += remainder * 0.45;
    
    return tax;
  };

  if (taxableIncome > 0) {
    annualTax = calcTieredTax(taxableIncome);
  }

  // Soli (High Earner Surcharge)
  // UPDATE: 2026 Threshold increased to ~€20,350 annual tax liability
  const soli = annualTax > 20350 ? annualTax * 0.055 : 0;
  
  // Church Tax (Uses City Specific Rate: 8% or 9%)
  const kirchensteuer = isChurchMember ? (annualTax * cityData.churchTaxRate) : 0;
  
  const monthlyTax = (annualTax + soli + kirchensteuer) / 12;

  // --- 4. REALITY EXPENSES (Unchanged) ---
  let rentMultiplier = 1.0;
  if (married) rentMultiplier += 0.25; 
  if (hasChildren) rentMultiplier += 0.15 + (numChildren * 0.1);
  
  const finalRent = cityData.baseRent * rentMultiplier;

  const householdSize = 1 + (married ? 1 : 0) + numChildren;
  const electricityAndInternet = 50 + 40 + (householdSize * 25); 

  let finalFoodCost = 0;
  if (useCustomFood) {
    finalFoodCost = customFoodBudget;
  } else {
    const baseFood = { 'Rarely': 350, 'Weekly': 550, 'Frequent': 900 };
    finalFoodCost = baseFood[eatingOut] * (1 + (householdSize - 1) * 0.4);
  }

  const maidCosts = { 'None': 0, 'Weekly (4h)': 380, 'Regular (10h)': 950 };
  const fixedCosts = 58 + 18.36 + 5 + electricityAndInternet; 
  const childcare = hasChildren ? (cityData.childcareCost * numChildren) : 0;

  const totalExpenses = finalRent + maidCosts[maidService] + finalFoodCost + fixedCosts + childcare;

  // --- 5. NET & WEALTH ---
  const childBenefit = hasChildren ? (numChildren * 259) : 0;
  const netIncome = monthlyGross - totalSocial - monthlyTax + childBenefit;
  const monthlySavingsEur = Math.max(0, netIncome - totalExpenses);

  const savings3YearInr = (monthlySavingsEur * 36 * 92) / 100000; 

  return {
    gross: Math.round(monthlyGross),
    net: Math.round(netIncome),
    tax: Math.round(monthlyTax),
    socialSecurity: Math.round(totalSocial),
    expenses: Math.round(totalExpenses),
    savingsEur: Math.round(monthlySavingsEur),
    savingsInr: Math.round(monthlySavingsEur * 92),
    wealth3Year: savings3YearInr.toFixed(1),
    expenseBreakdown: {
      rent: Math.round(finalRent),
      maid: maidCosts[maidService],
      food: Math.round(finalFoodCost),
      childcare: Math.round(childcare),
      other: Math.round(fixedCosts)
    },
    meta: {
      churchTax: Math.round(kirchensteuer / 12),
      householdSize,
      cityTier: cityData.tier,
      taxClass: calculatedTaxClass
    }
  };
};