import React from 'react';
import ReactDOM from 'react-dom';
import Endpoints from './Endpoints';
import * as serviceWorker from './serviceWorker';
import './index.css';

ReactDOM.render(
  <div>
    <h1>Instant API</h1>
    <Endpoints/>
  </div>,
  document.getElementById('root')
);

serviceWorker.unregister();
