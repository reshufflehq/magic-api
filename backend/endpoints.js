import * as db from '@reshuffle/db';
import Route from './route';

// const sleep = ms => new Promise(res => setTimeout(res, ms));

/* @expose */
export async function endpointsCreateUID() {

  // await sleep(2000);
  // console.log('endpointsCreateUID');

  return db.update('endpoint.nextuid', (uid = 0) => uid + 1);
}

/* @expose */
export async function endpointsList() {

  // await sleep(2000);
  // console.log('endpointsList');

  // const qq = db.Q.filter(db.Q.key.startsWith(''));
  // const ee = await db.find(qq);
  // console.log('\nendpointsGet:');
  // if (ee.length === 0) {
  //   console.log('  <empty>');
  // }
  // for (const e of ee) {
  //   console.log(`  ${e.key}:`, e.value);
  //   // await db.remove(e.key);
  // }

  const query = db.Q.filter(db.Q.key.startsWith(Route.getKeyPrefix()));
  const entries = await db.find(query);
  return entries.map(({ key, value}) => value);
}

/* @expose */
export async function endpointsSave(ep) {

  // await sleep(2000);
  // console.log('endpointsSave: ep =', ep);

  const route = new Route(ep);

  const oldies = await db.find(db.Q.filter(db.Q.all(
    db.Q.key.ne(route.toKey()),
    db.Q.value.uid.eq(ep.uid),
  )));
  if (1 < oldies.length) {
    console.error(`endpointsSave: uid ${uid} not unique:`, oldies);
    return `Error deleting endpoint. Please contact admin`;
  }
  if (oldies.length) {
    await db.remove(oldies[0].key);
  }

  let oldUID;
  await db.update(route.toKey(), old => {
    if (old === undefined || old.uid === ep.uid) {
      return ep;
    } else {
      oldUID = old.uid;
      return old;
    }
  });

  if (oldUID) {
    console.error(`endpointsSave: route ${route} used by uid ${oldUID} not ${ep.uid}`);
    return `Error deleting endpoint. Please reload`;
  };
}

/* @expose */
export async function endpointsDelete(uid) {

  // await sleep(2000);
  // console.log('endpointsDelete: uid =', uid);

  const oldies = await db.find(db.Q.filter(db.Q.value.uid.eq(uid)));
  if (1 < oldies.length) {
    console.error(`endpointsDelete: uid ${uid} not unique:`, oldies);
    return `Error deleting endpoint: Please contact admin`;
  }
  if (oldies.length < 1) {
    console.error(`endpointsDelete: uid ${uid} not found`);
    return `Error deleting endpoint. Please reload`;
  }

  await db.remove(oldies[0].key);
}
