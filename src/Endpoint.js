import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';
import './Endpoint.css';

class Dispatcher {
  constructor() {
    this.listeners = [];
  }

  addListener(listener) {
    this.listeners.push(listener);
    return this;
  }

  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (0 <= index) {
      this.listeners.splice(index, 1);
    }
    return this;
  }

  dispatch(...args) {
    for (const listener of this.listeners) {
      listener.call(null, ...args);
    }
    return this;
  }
}

export default function Endpoint(props) {
  const [ editor, setEditor ] = useState();
  const editorRef = useRef(null);

  function applyChange(change) {
    props.onChange(Object.assign({}, props.ep, change));
  }

  function handleMethodChange(event) {
    applyChange({ method: event.target.value });
  }

  function handlePathChange(event) {
    applyChange({ path: '/api/' + event.target.value });
  }

  useEffect(() => {
    const element = editorRef.current;
    if (!element.id) {
      element.id = `editor-${props.ep.uid}`;
      const ed = global.ace.edit(element.id, {
        mode: 'ace/mode/javascript',
        showGutter: false,
        highlightGutterLine: false,
        highlightActiveLine: false,
        showPrintMargin: false,
        useSoftTabs: true,
        tabSize: 2,
        navigateWithinSoftTabs: false,
        minLines: 1,
        maxLines: 20,
        newLineMode: 'unix',
      });
      ed.insert(props.ep.code);
      ed.moveCursorTo(0, 0);

      const changeDispatcher = new Dispatcher();
      ed.addChangeListener = (...args) => {
        return changeDispatcher.addListener(...args);
      };
      ed.removeChangeListener = (...args) => {
        return changeDispatcher.removeListener(...args);
      };
      ed.session.on('change', () => {
        changeDispatcher.dispatch();
      });
      setEditor(ed);
    }

    function handleCodeChange() {
      const code = editor.getValue();
      const ep = Object.assign({}, props.ep, { code });
      props.onChange(ep);
    }

    if (editor) {
      editor.addChangeListener(handleCodeChange);
    }

    return () => {
      if (editor) {
        editor.removeChangeListener(handleCodeChange);
      }
    };
  }, [editor, props]);

  const [ saving, setSaving ] = useState(false);
  const [ deleting, setDeleting ] = useState(false);

  function canSave() {
    return !deleting &&
           !props.isSaved &&
           /^\/api\/[\w\-.]+(\/[\w\-.]+)*$/.test(props.ep.path) &&
           0 < props.ep.code.trim().length;
  }

  async function handleSave(event) {
    setSaving(true);
    await props.onSave(props.ep.uid);
    setSaving(false);
    event.reset();
  }

  function canDelete() {
    return !saving;
  }

  async function handleDelete(event) {
    setDeleting(true);
    await props.onDelete(props.ep.uid, event);
    setDeleting(false);
  }

  return (
    <div className="Endpoint">
      <h2>
        <select value={props.ep.method}
                onChange={handleMethodChange}>
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
        <input type="text"
               value={props.ep.path.substr(5)}
               onChange={handlePathChange}
        />
        <Button onClick={handleSave}
                disabled={!canSave()}>
          Save
        </Button>
        <Button onClick={handleDelete}
                disabled={!canDelete()}
                className="warn">
          Delete
        </Button>
      </h2>
      <div className="code">
        <div>async (req, res, next) => &#123;</div>
        <div className="editor" ref={editorRef}></div>
        <div>&#125;</div>
      </div>
    </div>
  );
}