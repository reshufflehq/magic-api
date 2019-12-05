import React, { useRef, useState } from 'react';
import './Button.css';

export default function Button(props) {

  const interval = useRef();
  const frame = useRef();
  const [ spinner, setSpinner ] = useState();
  const SPINNER = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';

  function reset() {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = undefined;
      setSpinner();
    }
  }

  function handleClick(event) {
    interval.current = setInterval(() => {
      frame.current = (frame.current + 1) % SPINNER.length;
      setSpinner(SPINNER.charAt(frame.current));
    }, 50);

    setSpinner(SPINNER.charAt(frame.current = 0));

    props.onClick({ target: event.target, reset });
  }

  return (
    <button className={`Button ${spinner ? 'spinning' : ''} ${props.className}`}
            disabled={props.disabled || spinner}
            onClick={handleClick}
    >
      {props.children}
      { spinner &&
        <span className="spinner">
          {spinner}
        </span>
      }
    </button>
  );
}
