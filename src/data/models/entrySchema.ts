import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const entrySchema = sqliteTable('entries', {
  id: integer('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title'),
  content: text('content').notNull(),
  ttl: integer('ttl').notNull(),
  visitCountThreshold: integer('visitCountThreshold').notNull(),
  remainingVisits: integer('remainingVisits').notNull(),
  createdOn: integer('createdOn', { mode: 'timestamp' }).notNull(),
  expiresOn: integer('expiresOn', { mode: 'timestamp' }).notNull(),
  deletedOn: integer('deletedOn', { mode: 'timestamp' }),
});

export type NewEntry = Pick<
  Entry,
  'slug' | 'title' | 'content' | 'ttl' | 'visitCountThreshold'
>;

export type Entry = {
  id: number;
  slug: string;
  title?: string;
  content: string;
  ttl: number;
  visitCountThreshold: number;
  remainingVisits: number;
  createdOn: Date;
  expiresOn: Date;
  deletedOn: Date | null;
};
