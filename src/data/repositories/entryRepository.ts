import { eq } from 'drizzle-orm';
import { getDb } from '../connection';
import { entrySchema, type Entry, type NewEntry } from '../models/entrySchema';
import { assertEntity } from '../../utils/assertEntity';

export function createEntry({
  title,
  slug,
  content,
  ttl,
  visitCountThreshold,
}: NewEntry): Entry {
  const db = getDb();

  const result = db
    .insert(entrySchema)
    .values({
      title,
      slug,
      content,
      ttl,
      visitCountThreshold,
      remainingVisits: visitCountThreshold + 1, //+1 to account for the initial view
      expiresOn: new Date(Date.now() + 1000 * 60 * 60 * ttl),
      createdOn: new Date(),
    })
    .returning()
    .all()[0];

  if (assertEntity(result, ['id', 'slug', 'title', 'content', 'expiresOn'])) {
    return {
      ...result,
      title: result.title || undefined,
    };
  }

  throw new Error('Entry could not be created');
}

export function getEntryBySlug(slug: string): Entry | null {
  const db = getDb();
  const result = db
    .select()
    .from(entrySchema)
    .where(eq(entrySchema.slug, slug))
    .all()[0]; //get is bugged

  if (assertEntity(result, ['id', 'slug', 'title', 'content', 'expiresOn'])) {
    return {
      ...result,
      title: result.title || undefined,
    };
  }
  return null;
}

export function updateRemainingVisits(slug: string) {
  //Get the current remaining visits and substract one
  const entry = getEntryBySlug(slug);

  if (!entry) {
    console.error(`Could not find entry with slug ${slug}`);
    return;
  }

  const db = getDb();
  db.update(entrySchema)
    .set({ remainingVisits: entry.remainingVisits - 1 })
    .where(eq(entrySchema.slug, slug))
    .run();
}
