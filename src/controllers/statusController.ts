import type { Hono } from 'hono';

export function statusController(app: Hono) {
  app.get('/', (c) => {
    return c.text('OK');
  });
  console.log('Status controller loaded');
  return app;
}
