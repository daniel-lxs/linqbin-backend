import type { Entry } from '../data/models';
import {
  getEntryBySlug,
  createEntry,
  updateRemainingVisits,
} from '../data/repositories/entryRepository';
import { Entropy, charset64 } from 'entropy-string';

export function findEntryBySlug(slug: string): Entry | null {
  if (!slug) {
    return null;
  }

  const result = getEntryBySlug(slug);
  //TODO: handle expired entries
  if (!result) {
    console.debug(`Could not find entry with slug ${slug}`);
    return null;
  }

  if (result.expiresOn && new Date() > result.expiresOn) {
    console.debug(`Entry with slug ${slug} has expired`);
    return null;
  }

  if (result.remainingVisits <= 0 && result.visitCountThreshold > 0) {
    console.debug(`Entry with slug ${slug} has reached its threshold`);
    return null;
  }

  updateRemainingVisits(slug);

  return result;
}

export function createNewEntry(
  title: string | undefined,
  content: string,
  ttl: number,
  visitCountThreshold: number
): Entry {
  const slug = new Entropy({ charset: charset64, bits: 32 }).string();

  return createEntry({
    title,
    slug,
    content,
    ttl,
    visitCountThreshold,
  });
}
