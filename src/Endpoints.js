import React, { useEffect, useState } from 'react';
import Button from './Button';
import Endpoint from './Endpoint';
import '@reshuffle/code-transform/macro';
import './Endpoints.css';

import {
  endpointsCreateUID,
  endpointsList,
  endpointsSave,
  endpointsDelete,
} from '../backend/endpoints';

class EP {
  constructor(ep) {
    this.uid = ep.uid;
    this.method = ep.method || 'GET';
    this.path = ep.path || '';
    this.code = ep.code || '  return res.status(200).send(\'Ok\');';
  }

  equals(ep) {
    return !ep ? false : (this.method === ep.method &&
                          this.path === ep.path &&
                          this.code === ep.code);
  }

  compare(ep) {
    return this.uid - ep.uid;
  }
}

const STATUS_INIT = {};
const STATUS_LOADING = {};
const STATUS_ERROR = {};
const STATUS_IS_INIT = s => s === STATUS_INIT;
const STATUS_IS_LOADING = s => s === STATUS_LOADING;
const STATUS_IS_ERROR = s => s === STATUS_ERROR;
const STATUS_IS_LOADED = s => (
  s &&
  !STATUS_IS_INIT(s) &&
  !STATUS_IS_LOADING(s) &&
  !STATUS_IS_ERROR(s)
);

export default function Endpoints(props) {
  const [ saved, setSaved ] = useState(STATUS_INIT);
  const [ endpoints, setEndpoints ] = useState();

  useEffect(() => {
    if (STATUS_IS_INIT(saved)) {
      endpointsList()
        .then(eps => {
          const svs = {};
          for (const ep of eps) {
            svs[ep.uid] = new EP(ep);
          };
          setSaved(svs);
        })
        .catch(e => {
          console.error(e);
          props.showError('Error connecting to server. Please reload');
          setSaved(STATUS_ERROR);
        });
      setSaved(STATUS_LOADING);
    }
    else if (STATUS_IS_LOADED(saved) && !endpoints) {
      const eps = Object.values(saved);
      eps.sort((a, b) => a.compare(b));
      setEndpoints(eps);
    }
  }, [saved, endpoints, props]);

  if (STATUS_IS_INIT(saved) || STATUS_IS_LOADING(saved) || !endpoints) {
    return 'Loading...';
  }
  if (STATUS_IS_ERROR(saved)) {
    return 'Error';
  }

  function serverError(e) {
    console.error(e);
    return props.showError('Error connecting to server. Please reload');
  }

  function findEndpointByUID(uid) {
    return endpoints.findIndex(e => e.uid === uid);
  }

  function handleChange(ep) {
    const index = findEndpointByUID(ep.uid);
    if (index < 0) {
      console.error(`handleChange(${ep.uid}): Endpint not found`);
      return props.showError('Internal error. Please reload');
    }

    const head = endpoints.slice(0, index);
    const tail = endpoints.slice(index + 1);
    setEndpoints(head.concat([new EP(ep)], tail));
  }

  async function handleSave(uid) {
    const index = findEndpointByUID(uid);
    if (index < 0) {
      console.error(`handleSave(${uid}): Endpint not found`);
      return props.showError('Internal error. Please reload');
    }

    const ep = endpoints[index];

    try {
      const error = await endpointsSave(ep);
      if (error) {
        console.error(`handleSave(${uid}): Server error`);
        return props.showError(error);
      }
    } catch (e) {
      return serverError(e);
    }

    setSaved(Object.assign({}, saved, { [ep.uid]: ep }));
    handleChange(ep);
  }

  async function handleDelete(uid, event) {
    const index = findEndpointByUID(uid);
    if (index < 0) {
      event.reset();
      console.error(`handleDelete(${uid}): Endpint not found`);
      props.showError('Internal error. Please reload');
      return false;
    }

    try {
      if (saved[uid]) {
        const error = await endpointsDelete(uid);
        if (error) {
          console.error(`handleDelete(${uid}): Server error`);
          props.showError(error);
          return false;
        }
      }
    } catch (e) {
      serverError(e);
      return false;
    } finally {
      event.reset();
    }

    const head = endpoints.slice(0, index);
    const tail = endpoints.slice(index + 1);
    setEndpoints(head.concat(tail));
    return true;
  }

  async function add(event) {
    try {
      const uid = await endpointsCreateUID();
      const ep = new EP({ uid });
      setEndpoints(endpoints.concat([ep]));
    } catch (e) {
      return serverError(e);
    } finally {
      event.reset();
    }
  }

  return (
    <div className="Endpoints">
      {endpoints.map((ep, i) =>
        <Endpoint key={i}
                  ep={ep}
                  isSaved={ep.equals(saved[ep.uid])}
                  onChange={handleChange}
                  onSave={handleSave}
                  onDelete={handleDelete}
        />
      )}
      <Button onClick={add}>Add Endpoint</Button>
    </div>
  );
}
