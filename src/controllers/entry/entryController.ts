import type { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createNewEntry, findEntryBySlug } from '../../services/entryService';
import { createEntryDto } from './dtos/createEntryDto';
import { z } from 'zod';

export function entryController(app: Hono) {
  app.get('/entry/:slug', async (c) => {
    const slug = c.req.param('slug');
    const entry = await findEntryBySlug(slug);

    if (!entry) {
      return c.text('Entry not found', 404);
    }
    return c.json(entry);
  });

  app.post('/entry', zValidator('json', z.object(createEntryDto)), (c) => {
    const { title, content, ttl, visitCountThreshold } = c.req.valid('json');

    const newEntry = createNewEntry(title, content, ttl, visitCountThreshold);

    return c.json(newEntry);
  });
  console.log('Entry controller loaded');
  return app;
}
