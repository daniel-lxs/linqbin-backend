import { zValidator } from '@hono/zod-validator';
import type { Hono } from 'hono';
import { z } from 'zod';
import { parseWebsiteTitle } from '../services/pageInfoService';

export function pageInfoController(app: Hono) {
  app.post(
    '/page-info',
    zValidator(
      'json',
      z.object({
        url: z.string(),
      })
    ),
    async (c) => {
      const { url } = c.req.valid('json');
      const title = await parseWebsiteTitle(url);
      return c.json({ title });
    }
  );
  console.log('PageInfo controller loaded');
  return app;
}
