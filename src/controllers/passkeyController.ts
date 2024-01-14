import type { Hono } from 'hono';
import { generatePasskey } from '../services/passkeyService';

export function passkeyController(app: Hono) {
  app.get('/passkey', (c) => {
    const passkey = generatePasskey();
    return c.json({ passkey });
  });
  console.log('Passkey controller loaded');
  return app;
}
