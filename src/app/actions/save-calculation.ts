'use server';

import { db } from '@/lib/db';
import { calculations } from '@/lib/db/schema';
import { UserProfile } from '@/lib/calculator';

export interface LeadContactData {
  name: string;
  age: string; // Keeping as string to handle form input easily, we parse later
  email: string;
  phone: string;
}

export async function saveLeadAction(
  profile: UserProfile, 
  contact: LeadContactData, 
  estimatedGross: number
) {
  try {
    if (!profile.qualification || !contact.email) return { success: false };

    await db.insert(calculations).values({
      // Job Profile
      qualification: profile.qualification,
      yearsExperience: profile.yearsExperience,
      married: profile.married,
      numChildren: profile.numChildren,
      
      // Contact Info
      name: contact.name,
      age: parseInt(contact.age) || 0,
      email: contact.email,
      phone: contact.phone,

      // Result
      estimatedGrossEth: estimatedGross,
    });

    console.log(`[Lead Gen] New Lead: ${contact.name} (${contact.email})`);
    return { success: true };

  } catch (error) {
    console.error('Failed to save lead:', error);
    return { success: false };
  }
}