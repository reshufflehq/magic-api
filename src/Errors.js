import React from 'react';
import './Errors.css';

export default function Errors(props) {
  const cls = `errors ${props.errors.length ? '' : ' none'}`;

  return (
    <div className={cls} >
      <button onClick={props.onClear}>×</button>
      <div className="messages">
        {props.errors.map((err, i) => (
          <div key={i}>
            {err}
          </div>
        ))}
      </div>
    </div>
  );
}