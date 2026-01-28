'use server';

import { db } from '@/lib/db'; 
import { calculations } from '@/lib/db/schema'; 
import { UserProfile } from '@/lib/calculator';

export interface LeadContactData {
  name: string;
  age: string;
  email: string;
  phone: string;
  state: string; // <-- Added this
}

export async function saveLeadAction(
  profile: UserProfile, 
  contact: LeadContactData, 
  annualSavings: string | number
) {
  try {
    await db.insert(calculations).values({
      // Lead Profile
      qualification: profile.qualification,
      yearsExperience: profile.yearsExperience,
      married: profile.married,
      numChildren: profile.numChildren,

      // Contact Details
      name: contact.name,
      age: parseInt(contact.age) || 0,
      email: contact.email,
      phone: contact.phone,

      // Results & Extra Data (Storing State here!)
      rawResult: {
        selectedCity: profile.selectedCity,
        projectedSavings: annualSavings.toString(),
        originState: contact.state // <-- SAVED HERE
      },
    });

    // RICH LOGGING (Updated with State)
    console.log(`
    =================================================
    [NEW LEAD GENERATED] 
    Name:      ${contact.name} (${contact.age} yrs)
    Origin:    ${contact.state} (India)
    Qual:      ${profile.qualification}
    Exp:       ${profile.yearsExperience} Years
    Dest:      ${profile.selectedCity}
    Potential: ${annualSavings} / yr
    Phone:     ${contact.phone}
    Email:     ${contact.email}
    =================================================
    `);

    return { success: true };

  } catch (error) {
    console.error("❌ [LEAD ERROR] Failed to save lead:", error);
    return { success: false };
  }
}