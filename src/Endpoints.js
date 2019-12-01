import React, { useEffect, useState } from 'react';
import Endpoint from './Endpoint';
import '@reshuffle/code-transform/macro';
import './Endpoints.css';

/*
 * We can import backend functions into our code and call them like any
 * regular function. The only thing to note is that instead of returning
 * a value directly, these functions return a Promise() to the return value,
 * so make sure to use .then() or await to get the actual response.
 */
import {
  endpointsGet,
  endpointsSave,
} from '../backend/endpoints';

export default function Endpoints() {
  const [endpoints, setEndpoints] = useState();

  /*
   * endpoints is undefined when the component is first rendered. We use this
   * to issue a call to the backend to get the endpoints list. Any backend
   * function returns a Promise() which is resolved with the value
   * returned from the backend.
   *
   * We issue the call to the backend inside useEffect(), so that it does
   * not happen within the rendering stage of the component.
   */
  useEffect(() => {
    if (endpoints === undefined) {
      endpointsGet()

        /*
         * The backend returns the endpoints list. This value is undefined
         * when the application is run for the first time, in which case
         * we use the default value of an empty array.
         */
        .then(response => {
          const eps = response.map(x => x.value);
          eps.sort((a, b) => a.index - b.index);
          setEndpoints(eps);
        })

        /*
         * If the backend call generated an error, we set endpoints to null.
         * This will cause the page to display a simple error string (see
         * below).
         */
        .catch(() => setEndpoints(null));
    }
  });

  /*
   * We still need to check if endpoints is undefined in the rendering
   * stage so that, the page will display this loading string until we
   * get an actual endpoints list.
   */
  if (endpoints === undefined) {
    return 'Loading...';
  }

  /*
   * A null endpoints list indicates an error occurred while calling the
   * backend. The page will simply display an error string in this case.
   */
  if (endpoints === null) {
    return 'Error';
  }

  function handleChange(ep) {
    const head = endpoints.slice(0, ep.index);
    const tail = endpoints.slice(ep.index + 1);
    setEndpoints(head.concat([ep], tail));
  }

  function handleSave(ep) {
    endpointsSave(ep)
      .catch(() => setEndpoints(null));
  }

  function add() {
    const ep = {
      index: endpoints.length,
      method: 'GET',
      route: '',
      code: '',
    };
    setEndpoints(endpoints.concat([ep]));
  }

  return (
    <div className="Endpoints">
      {endpoints.map((ep, i) =>
        <Endpoint key={i}
                  ep={ep}
                  onChange={handleChange}
                  onSave={handleSave}
        />
      )}
      <button onClick={add}>Add Endpoint</button>
    </div>
  );
}
