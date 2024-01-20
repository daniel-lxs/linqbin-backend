import { Schema, model } from 'mongoose';

export const entrySchema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String },
  content: { type: String, required: true },
  ttl: { type: Number, required: true },
  visitCountThreshold: { type: Number, required: true },
  remainingVisits: { type: Number, required: true },
  createdOn: { type: Date, required: true },
  expiresOn: { type: Date, required: true },
});

export const entryModel = model('Entry', entrySchema);

export type Entry = {
  slug: string;
  title?: string | null;
  content: string;
  ttl: number;
  visitCountThreshold: number;
  remainingVisits: number;
  createdOn: string;
  expiresOn: string;
};
export type NewEntry = {
  title?: string;
  slug: string;
  content: string;
  ttl: number;
  visitCountThreshold: number;
};
