import mongoose from 'mongoose';
import { entryModel, type Entry, type NewEntry } from '../models';

//Migrate to mongoose

export async function createEntry({
  title,
  slug,
  content,
  ttl,
  visitCountThreshold,
}: NewEntry) {
  const entryDocument = new entryModel({
    title,
    slug,
    content,
    ttl,
    visitCountThreshold,
    remainingVisits: visitCountThreshold + 1, //+1 to account for the initial view
    expiresOn: new Date(Date.now() + 1000 * 60 * 60 * ttl),
    createdOn: new Date(),
  });

  await entryDocument.save();

  try {
    entryModel.validate(entryDocument, [
      'id',
      'slug',
      'title',
      'content',
      'expiresOn',
    ]);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.error(error);
      throw new Error('Entry could not be created');
    }
    throw error;
  }
  return entryDocument;
}

export async function findEntryBySlug(slug: string) {
  try {
    const entry = await entryModel.findOne({ slug });

    if (!entry) {
      console.debug(`Entry with slug ${slug} not found`);
      return null;
    }

    if (entry.visitCountThreshold <= 0) {
      console.debug(
        `Visit count threshold is not enabled for entry with slug ${slug}`
      );
      return entry;
    }

    const updatedEntry = await entryModel.findOneAndUpdate(
      { slug, remainingVisits: { $gt: 0 } }, // Ensure remainingVisits is greater than 0
      { $inc: { remainingVisits: -1 } }, // Decrement remainingVisits by 1
      { new: true } // Return the updated document
    );

    if (!updatedEntry) {
      // The entry was not found or remainingVisits was already 0
      console.debug(`Entry with slug ${slug} has reached its threshold`);
      await entryModel.deleteOne({ slug }); // Delete entry if threshold was reached
      return null;
    }

    console.debug(
      `Successfully decremented remaining visits for entry with slug ${slug}`
    );
    return updatedEntry;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteEntry(slug: string) {
  try {
    await entryModel.deleteOne({ slug });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
