import express from 'express';
import { defaultHandler } from '@reshuffle/server-function';
import * as db from '@reshuffle/db';

const app = express();

app.all('/api/*', async (req, res) => {
  const key = `@${req.method}:${req.path.substr(5)}`;
  const ep = await db.get(key);
  if (!ep) {
    return res.status(404).send(`Not found: ${req.method} ${req.path}`);
  }
  console.log(`Serving ${req.method} ${req.path} => {`);
  console.log(ep.code.split('\n').map(l => '  ' + l).join('\n'));
  console.log('}');
  const f = new Function('req', 'res', ep.code);
  return f.call(null, req, res);
});

app.use(defaultHandler);
export default app;
