import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const calculations = pgTable('calculations', {
  id: serial('id').primaryKey(),
  
  // Lead Profile (Job Context)
  qualification: text('qualification').notNull(),
  yearsExperience: integer('years_experience').notNull(),
  married: boolean('married').default(false),
  numChildren: integer('num_children').default(0),

  // NEW: Contact Details (Lead Gen)
  name: text('name'),
  age: integer('age'),
  email: text('email'),
  phone: text('phone'),

  // Results
  estimatedGrossEth: integer('estimated_gross_eur'), 
  
  // Metadata
  timestamp: timestamp('created_at').defaultNow(),
  rawResult: jsonb('raw_result'),
});