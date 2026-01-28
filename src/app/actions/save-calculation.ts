'use server';

import { db } from '@/lib/db'; 
import { calculations } from '@/lib/db/schema'; // Importing your specific table
import { UserProfile } from '@/lib/calculator';

export interface LeadContactData {
  name: string;
  age: string;
  email: string;
  phone: string;
}

export async function saveLeadAction(
  profile: UserProfile, 
  contact: LeadContactData, 
  annualSavings: string | number
) {
  try {
    // 1. Create the database record matching YOUR schema
    await db.insert(calculations).values({
      // Lead Profile
      qualification: profile.qualification,
      yearsExperience: profile.yearsExperience, // Maps to 'years_experience'
      married: profile.married,
      numChildren: profile.numChildren,         // Maps to 'num_children'

      // Contact Details
      name: contact.name,
      age: parseInt(contact.age) || 0,          // Safety check for integer
      email: contact.email,
      phone: contact.phone,

      // Results: Storing the flexible data (City + Savings) in JSONB
      // because your schema doesn't have specific columns for them yet.
      rawResult: {
        selectedCity: profile.selectedCity,
        projectedSavings: annualSavings.toString()
      },
      
      // Let the DB handle 'timestamp' with defaultNow()
    });

    // 2. THE RICH LOG (Informative & Easy to Read)
    console.log(`
    =================================================
    [NEW LEAD GENERATED] 
    Name:      ${contact.name} (${contact.age} yrs)
    Qual:      ${profile.qualification}
    Exp:       ${profile.yearsExperience} Years
    City:      ${profile.selectedCity}
    Potential: ${annualSavings} / yr
    Phone:     ${contact.phone}
    Email:     ${contact.email}
    =================================================
    `);

    return { success: true };

  } catch (error) {
    console.error("❌ [LEAD ERROR] Failed to save lead:", error);
    console.error("Attempted Data:", { ...contact, ...profile });
    return { success: false };
  }
}