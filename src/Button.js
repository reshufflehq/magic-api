import React, { useRef, useState } from 'react';
import './Button.css';

export default function Button(props) {

  const interval = useRef();
  const index = useRef();
  const [spinner, setSpinner] = useState();
  const frames = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';

  function reset() {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = undefined;
      setSpinner();
    }
  }

  function handleClick(event) {
    interval.current = setInterval(() => {
      index.current = (index.current + 1) % frames.length;
      setSpinner(frames.charAt(index.current));
    }, 50);

    setSpinner(frames.charAt(index.current = 0));

    props.onClick({ target: event.target, reset });
  }

  const cls = `button ${spinner ? 'spinning' : ''} ${props.className}`;

  return (
    <button className={cls}
            disabled={props.disabled || spinner}
            onClick={handleClick}
    >
      {props.children}
      {spinner &&
        <span className="spinner">
          {spinner}
        </span>
      }
    </button>
  );
}
