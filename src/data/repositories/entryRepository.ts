import { drizzle } from 'drizzle-orm/postgres-js';
import { getClient } from '../connection';
import { entries, type NewEntry } from '../models';
import { eq } from 'drizzle-orm';

export async function createEntry({
  title,
  slug,
  content,
  ttl,
  visitCountThreshold,
}: NewEntry) {
  try {
    const db = drizzle(getClient());
    const entry = await db
      .insert(entries)
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
      .returning({
        slug: entries.slug,
        title: entries.title,
        content: entries.content,
        ttl: entries.ttl,
        visitCountThreshold: entries.visitCountThreshold,
        remainingVisits: entries.remainingVisits,
        createdOn: entries.createdOn,
        expiresOn: entries.expiresOn,
      })
      .execute();

    return entry[0];
  } catch (error) {
    // handle error
    console.error(error);
    throw new Error('Failed to create entry');
  }
}

export async function findEntryBySlug(slug: string) {
  try {
    const db = drizzle(getClient(), { schema: { entries } });

    // Check if the entry exists
    const existingEntry = await db.query.entries.findFirst({ with: { slug } });

    if (!existingEntry) {
      console.debug(`Entry with slug ${slug} not found`);
      return null;
    }

    // Check if visit count threshold is not enabled
    if (existingEntry.visitCountThreshold <= 0) {
      console.debug(
        `Visit count threshold is not enabled for entry with slug ${slug}`
      );
      return existingEntry;
    }

    if (existingEntry.remainingVisits <= 0) {
      console.debug(`Entry with slug ${slug} has reached its threshold`);
      await db.delete(entries).where(eq(entries.slug, slug)); // Delete entry if threshold was reached
      return null;
    }

    const updatedEntry = await db
      .update(entries)
      .set({ remainingVisits: existingEntry.remainingVisits - 1 })
      .where(eq(entries.slug, slug))
      .returning({
        slug: entries.slug,
        title: entries.title,
        content: entries.content,
        ttl: entries.ttl,
        visitCountThreshold: entries.visitCountThreshold,
        remainingVisits: entries.remainingVisits,
        createdOn: entries.createdOn,
        expiresOn: entries.expiresOn,
      })
      .execute();

    console.debug(
      `Successfully decremented remaining visits for entry with slug ${slug}`
    );
    return updatedEntry[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteEntry(slug: string) {
  try {
    const db = drizzle(getClient());
    await db.delete(entries).where(eq(entries.slug, slug));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
