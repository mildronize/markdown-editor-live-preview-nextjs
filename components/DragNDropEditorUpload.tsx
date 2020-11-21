import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic'
import axios from 'axios';
const Editor = dynamic(import('./Editor/Editor'), { ssr: false });
import { EditorProps } from './Editor/Editor';
import './DragNDropEditorUpload.css';

// import DropArea from './Dropzone';

const DragNDropEditor = (props: EditorProps) => {

  const inputEl = useRef(null);

  const [eventDrag, setEventDrag] = useState({
    onDragOver: (e) => { },
    onDropCapture: (e) => { },
    onDragLeaveCapture: (e) => { }
  })

  const [monaco, setMonaco] = useState(null);
  const [editor, setEditor] = useState(null);
  const [enableDropArea, setEnableDropArea] = useState(false);

  // const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {

  }, []);

  function addData(target, editor) {
    var line = target.position;
    var range = target.range;
    var id = { major: 1, minor: 1 };
    var text = "FOO";
    var op = { identifier: id, range: range, text: text, forceMoveMarkers: true };
    editor.executeEdits("my-source", [op]);
  }

  function onDropEditor(e, target, instance) {
    // addData(target, instance);
    // onButtonClick();
    console.log('on Drop editor');
    e.preventDefault();
  }

  function importNoSSR(editorInstance) {
    const loader = async () => {

      const MonacoDrag = await import('./Editor/monacoDragAndDropProvider')
      const dragProvider = new MonacoDrag.MonacoDragNDropProvider(onDropEditor, () => editorInstance);
      setEventDrag({
        onDragOver: dragProvider.props.onDragOver,
        onDropCapture: dragProvider.props.onDropCapture,
        onDragLeaveCapture: dragProvider.props.onDragLeaveCapture,
      })
      setEditor(editorInstance);
      setMonaco(await import('monaco-editor'));
    }
    loader();
  }

  function _editorDidMount(editorInstance, monaco) {
    // Make sure no ssr part in this extension
    importNoSSR(editorInstance);

    if (props.editorDidMount) props.editorDidMount(editorInstance, monaco);
  }

  // function loadModuleAsync(moduleName) {
  //   const loader = async () => await import(moduleName);
  //   return loader();
  // }

  function writeText(text: string) {
    if (editor && monaco) {
      editor.getModel().applyEdits([{
        range: monaco.Range.fromPositions(editor.getPosition()),
        text
      }]);
    }
  }

  const onUploadImageButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.click();
    if (editor) {
      // console.log(editor.getPosition);
      writeText('efwfewe wef');
    }
  };

  const onUploadFormHandler = (event) => {
    var file = event.target.files[0];
    // if (
    //   this.maxSelectFile(event) &&
    //   this.checkMimeType(event) &&
    //   this.checkFileSize(event)
    // ) {
    // if return true allow to setState
    // setSelectedFile(files);
    // }
    uploadFile(file);
  };

  const uploadFile = (file: any) => {
    const data = new FormData();
    data.append("file", file);
    axios
      .post("http://localhost:8000/upload", data, {
        onUploadProgress: (ProgressEvent) => {
          console.log(`Loading ... (${(ProgressEvent.loaded / ProgressEvent.total) * 100})`)
        },
      })
      .then((res) => {
        console.log("upload success");
      })
      .catch((err) => {
        console.error("upload fail");
      });
  }

  function onDragOver(e) {
    setEnableDropArea(true);
    eventDrag.onDragOver(e);
  }

  function onDrop(e) {
    disableDropArea();
    eventDrag.onDropCapture(e);
  }

  function onDropOut(e) {
    disableDropArea();
    eventDrag.onDragLeaveCapture(e);
  }

  function disableDropArea() {
    setEnableDropArea(false);
  }

  return (
    <span>

      <div className="form-group files">
        <input ref={inputEl} type="file" className="form-control" multiple onChange={onUploadFormHandler} />
      </div>

      <button onClick={onUploadImageButtonClick}>Upload Image</button>

      {enableDropArea && <div
        onDragLeaveCapture={disableDropArea}
        onDropCapture={disableDropArea}
        onClick={disableDropArea}
        style={{ backgroundColor: '#ccc', height: '500px', width: '50%' }}
      >
        DropArea
            </div>}
      {!enableDropArea && <span
        onDragOver={onDragOver}
        onDropCapture={onDrop}
        onDragLeaveCapture={onDropOut}
      >
        <Editor
          {...props}
          language="markdown"
          editorDidMount={_editorDidMount}
        />
      </span>}
    </span>

  )
}

export default DragNDropEditor;


