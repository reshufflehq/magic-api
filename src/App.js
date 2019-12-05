import React, { useState } from 'react';
import Errors from './Errors';
import Endpoints from './Endpoints';
import './App.css';

export default function App() {

  const [ errors, setErrors ] = useState([]);

  function clearErrors() {
    setErrors([]);
  }

  function showError(msg) {
    setErrors(errors.concat([msg]));
  }

  return (
    <React.Fragment>
      <Errors errors={errors} onClear={clearErrors}/>
      <h1><span role="img" aria-label="magic">💫</span> Magic API</h1>
      <Endpoints showError={showError}/>
    </React.Fragment>
  );
}
