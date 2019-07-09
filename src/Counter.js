import React, { useEffect, useState } from 'react';

/*
 * Make sure to import the Reshuffle macro before importing any backend
 * functions.
 */
import '@reshuffle/code-transform/macro';

import './Counter.css';

/*
 * We can import backend functions into our code and call them like any
 * regular function. The only thing to note is that instead of returning
 * a value directly, these functions return a Promise() to the return value,
 * so make sure to use .then() or await to get the actual response.
 */
import {
  counterGet,
  counterIncrement,
} from '../backend/counter';

/**
 * Counter component.
 */
export default function Counter() {
  const [count, setCount] = useState();

  /*
   * count is undefined when the component is first rendered. We use this
   * to issue a call to the backend to get the initial count. Any backend
   * function returns a Promise() which is resolved with the value
   * returned from the backend.
   *
   * We issue the call to the backend inside useEffect(), so that it does
   * not happen within the rendering stage of the component.
   */
  useEffect(() => {
    if (count === undefined) {
      counterGet()

        /*
         * The backend returns the count value. This value is undefined
         * when the application is run for the first time, in which case
         * we use the default value of zero.
         */
        .then(count => setCount(count || 0))

        /*
         * If the backend call generated an error, we set count to null.
         * This will cause the page to display a simple error string (see
         * below).
         */
        .catch(() => setCount(null));
    }
  });

  /*
   * We still need to check if counter is undefined in the rendering
   * stage so that, the page will display this loading string until we
   * get tan actual count value.
   */
  if (count === undefined) {
    return 'Loading...';
  }

  /*
   * A null count indicates an error occurred while calling the backend
   * function. The page will simply display an error string in this case.
   */
  if (count === null) {
    return 'Error';
  }

  /*
   * We increment the local counter first (triggering a render) and then
   * send the update to the backend. This results in a more responsive UI
   * but has the downside that the display is updated before the new value
   * is persisted in the backend. If the backend fails to update, the user
   * will think that the counter was updated, but a subsequent app reload
   * would show a different value.
   *
   * In a real app, we would probably wait for the backend to update before
   * updating the display. Alternatively we could update the display first
   * but add an indicator for 'Updating' or 'Saving'.
   */
  function increment() {
    setCount(count + 1);
    counterIncrement();
  }

  return (
    <div className="Counter">
      <div className="count">{count}</div>
      <button className="increment" onClick={increment}>
        +1
      </button>
    </div>
  );
}
