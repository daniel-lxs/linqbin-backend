import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { entryController } from './controllers/entry/entryController';
import { pageInfoController } from './controllers/pageInfoController';
import { passkeyController } from './controllers/passkeyController';

const app = new Hono();
app.use(
  cors({
    origin: 'https://linqb.in',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
);

entryController(app);
pageInfoController(app);
passkeyController(app);

app.get('/', (c) => {
  return c.text('OK');
});

console.log(`Server listening on port ${process.env.PORT || 4000}`);

export default {
  fetch: app.fetch,
  port: process.env.PORT || 4000,
};
