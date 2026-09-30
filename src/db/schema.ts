import { pgTable, uuid, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

export const endpointsTable = pgTable('endpoints', {
  id: uuid('id').defaultRandom().primaryKey(),
  url: text('url').notNull(),
  secret: text('secret').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const deliveriesTable = pgTable('deliveries', {
  id: uuid('id').defaultRandom().primaryKey(),
  endpointId: uuid('endpoint_id').references(() => endpointsTable.id, { onDelete: 'cascade' }).notNull(),
  eventPayload: jsonb('event_payload').notNull(),
  status: text('status').notNull().default('PENDING'), // PENDING, SUCCESS, FAILED
  attempts: integer('attempts').notNull().default(0),
  responseCode: integer('response_code'),
  lastAttemptAt: timestamp('last_attempt_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
