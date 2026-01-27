import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const calculations = pgTable('calculations', {
  id: serial('id').primaryKey(),
  
  // User Profile
  role: text('role').notNull(),
  grossIncome: integer('gross_income').notNull(),
  city: text('city').notNull(),
  
  // Family Config
  married: boolean('married').default(false),
  partnerWorks: boolean('partner_works').default(false),
  kids: integer('kids').default(0),
  taxClass: integer('tax_class'),

  // The Reality Result (What we calculated)
  netSavingsEur: integer('net_savings_eur'),
  
  // Metadata
  timestamp: timestamp('created_at').defaultNow(),
  // Full raw data dump (useful if you change logic later and want to re-run analysis)
  rawScenario: jsonb('raw_scenario'),
});