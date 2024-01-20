import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createNewEntry, getEntryBySlug } from '../../services/entryService';
import { createEntryDto } from './dtos/createEntryDto';
import { z } from 'zod';
import { HTTPException } from 'hono/http-exception';
import type { Entry } from '../../data/models';

export function entryController(app: Hono) {
  const entry = new Hono();

  entry.get('/:slug', async (c) => {
    const slug = c.req.param('slug');
    const entry = await getEntryBySlug(slug);

    if (!entry) {
      return c.text('Entry not found', 404);
    }
    return c.json(entry);
  });

  entry.post('/', zValidator('json', z.object(createEntryDto)), async (c) => {
    const { title, content, ttl, visitCountThreshold } = c.req.valid('json');
    let createdEntry: Entry | null = null;

    try {
      createdEntry = await createNewEntry(
        title,
        content,
        ttl,
        visitCountThreshold
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new HTTPException(400, {
          message: error.message,
        });
      }
      throw new HTTPException(400, {
        message: 'Failed to create a new entry',
      });
    }

    return c.json(createdEntry);
  });

  app.route('/entry', entry);
  console.log('Entry controller loaded');
  return app;
}
