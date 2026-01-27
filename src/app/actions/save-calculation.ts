'use server';

import { db } from '@/lib/db';
import { calculations } from '@/lib/db/schema';
import { UserScenario, CITY_OPTS } from '@/lib/calculator';

export async function saveCalculationAction(data: UserScenario, savingsEur: number) {
  try {
    // 1. Sanity Check: Don't save empty/spam clicks
    if (!data || data.grossAnnualEth < 10000) {
      return { success: false };
    }

    // 2. Save to Neon
    await db.insert(calculations).values({
      role: data.role,
      grossIncome: data.grossAnnualEth,
      city: data.city,
      married: data.married,
      partnerWorks: data.partnerWorks,
      kids: data.numChildren,
      taxClass: data.taxClass,
      netSavingsEur: savingsEur, // Saving the result!
      rawScenario: data, // Saving the full JSON object
    });

    console.log(`[Analytics] Saved: ${data.role} in ${data.city} (€${savingsEur}/mo)`);
    return { success: true };

  } catch (error) {
    console.error('Failed to save calculation:', error);
    // Return success:false but don't crash the app
    return { success: false };
  }
}