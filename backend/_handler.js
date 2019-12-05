import express from 'express';
import { defaultHandler } from '@reshuffle/server-function';
import * as db from '@reshuffle/db';
import Route from './route';

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//    If your API endpoints need npm packages, you can import them here    //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

const app = express();

app.all('/api/*', async (req, res) => {
  const start = Date.now();

  const route = new Route(req);
  const ep = await db.get(route.toKey());
  if (!ep) {
    return res.status(404).send(`Not found: ${route}`);
  }

  const f = new Function('req', 'res', ep.code);
  f.call(null, req, res);

  const elapsed = Date.now() - start;
  console.log(`Served ${route} in ${elapsed}ms`);
});

app.use(defaultHandler);
export default app;
