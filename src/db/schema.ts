import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table linked to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Optimization runs history table
export const optimizationRuns = pgTable('optimization_runs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  userUid: text('user_uid'),
  name: text('name'),
  matrixCount: integer('matrix_count').notNull(),
  dimensions: text('dimensions').notNull(), // JSON array of numbers e.g. [10, 30, 5, 60]
  minimumCost: text('minimum_cost').notNull(), // Formatted or numeric string
  parenthesization: text('parenthesization').notNull(),
  costTable: text('cost_table').notNull(), // JSON matrix
  splitTable: text('split_table').notNull(), // JSON matrix
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  runs: many(optimizationRuns),
}));

export const optimizationRunsRelations = relations(optimizationRuns, ({ one }) => ({
  user: one(users, {
    fields: [optimizationRuns.userId],
    references: [users.id],
  }),
}));
