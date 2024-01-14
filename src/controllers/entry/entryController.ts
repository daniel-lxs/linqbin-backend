import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createNewEntry, findEntryBySlug } from '../../services/entryService';
import { createEntryDto } from './dtos/createEntryDto';
import { z } from 'zod';

export function entryController(app: Hono) {
  const entry = new Hono();

  entry.get('/:slug', async (c) => {
    const slug = c.req.param('slug');
    const entry = await findEntryBySlug(slug);

    if (!entry) {
      return c.text('Entry not found', 404);
    }
    return c.json(entry);
  });

  entry.post('/', zValidator('json', z.object(createEntryDto)), (c) => {
    const { title, content, ttl, visitCountThreshold } = c.req.valid('json');

    const newEntry = createNewEntry(title, content, ttl, visitCountThreshold);

    return c.json(newEntry);
  });

  app.route('/entry', entry);
  console.log('Entry controller loaded');
  return app;
}
