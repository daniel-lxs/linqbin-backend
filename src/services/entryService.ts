import type { Entry } from '../data/models';
import {
  createEntry,
  deleteEntry,
  findEntryBySlug,
} from '../data/repositories/entryRepository';
import { Entropy, charset64 } from 'entropy-string';

export async function getEntryBySlug(slug: string): Promise<Entry | null> {
  if (!slug || slug.length !== 6) {
    //Save resources on invalid slugs
    console.debug(`[EntryService] Invalid slug ${slug}`);
    return null;
  }

  const entry = await findEntryBySlug(slug);

  if (!entry) {
    console.debug(
      `[EntryService] Entry with slug ${slug} not found or has reached its threshold`
    );
    return null;
  }

  const currentDate = new Date();
  if (currentDate.getTime() > entry.expiresOn.getTime()) {
    console.debug(`[EntryService] Entry with slug ${slug} has expired`);
    await deleteEntry(slug);
    return null;
  }

  return entry;
}

export async function createNewEntry(
  title: string | undefined,
  content: string,
  ttl: number,
  visitCountThreshold: number
): Promise<Entry> {
  try {
    const slug = new Entropy({ charset: charset64, bits: 32 }).string();
    const createdEntry = await createEntry({
      title,
      slug,
      content,
      ttl,
      visitCountThreshold,
    });
    console.log(`[EntryService] Created new entry with slug ${slug}`);
    return createdEntry;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create a new entry');
  }
}
