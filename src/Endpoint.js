import React, { useEffect, useRef, useState } from 'react';
import '@reshuffle/code-transform/macro';
import './Endpoint.css';

// const route = /^[\w\-\.]+(\/[\w\-\.]+)*$/;

export default function Endpoint(props) {

  const [ editor, setEditor ] = useState();
  const editorRef = useRef(null);

  function applyChange(change) {
    const ep = Object.assign({}, props.ep, change);
    props.onChange(ep);
    return ep;
  }

  function handleChange(event) {
    applyChange({ [event.target.name]: event.target.value });
  }

  useEffect(() => {
    const element = editorRef.current;
    if (!element.id) {
      element.id = `editor-${props.ep.index}`;
      const ed = global.ace.edit(element.id, {
        mode: 'ace/mode/javascript',
        useSoftTabs: true,
        tabSize: 2,
        navigateWithinSoftTabs: false,
        minLines: 1,
        maxLines: 20,
        newLineMode: 'unix',
      });
      ed.insert(props.ep.code);
      ed.moveCursorTo(0, 0);
      ed.focus();
      setEditor(ed);
    }
  }, [props.ep]);

  function handleSave() {
    const ep = applyChange({ code: editor.getValue() });
    props.onSave(ep);
  }

  return (
    <div className="Endpoint">
      <h2>
        <select name="method"
                value={props.ep.method}
                onChange={handleChange}>
          <option value="GET">GET</option>
          <option value="HEAD">HEAD</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="CONNECT">CONNECT</option>
          <option value="OPTIONS">OPTIONS</option>
          <option value="TRACE">TRACE</option>
          <option value="PATH">PATH</option>
        </select>
        <span>/api/</span>
        <input name="route"
                    type="text"
                    value={props.ep.route}
                    onChange={handleChange}
         />
         <button onClick={handleSave}>Save</button>
      </h2>
      <div className="code">
        <div>async (req, res, next) => &#123;</div>
        <div className="editor" ref={editorRef}></div>
        <div>&#125;</div>
      </div>
    </div>
  );
}