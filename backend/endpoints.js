import * as db from '@reshuffle/db';

/* @expose */
export async function endpointsGet() {
  // await db.remove('/api/a');
  const query = db.Q.filter(db.Q.key.startsWith('@'));
  const endpoints = await db.find(query);
console.log('endpointsGet:', endpoints);
  return endpoints;
}

/* @expose */
export async function endpointsSave(endpoint) {
console.log('endpointsSave:', endpoint);
  const key = `@${endpoint.method}:${endpoint.route}`;
  await db.update(key, () => endpoint);
}
