import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
const Editor = dynamic(import('./Editor/Editor'), { ssr: false });
import { EditorProps } from './Editor/Editor';

const DragNDropEditor = (props: EditorProps) => {

  const [eventDrag, setEventDrag] = useState({
    onDragOver: (e) => { },
    onDropCapture: (e) => { },
    onDragLeaveCapture: (e) => { }
  })

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

  function onDrop(e, target, instance) {
    addData(target, instance);
    console.log(e);
    e.preventDefault();
  }

  function importNoSSR(editorInstance) {
    const loader = async () => {

      const MonacoDrag = await import('./Editor/monacoDragAndDropProvider')
      const dragProvider = new MonacoDrag.MonacoDragNDropProvider(onDrop, () => editorInstance);
      setEventDrag({
        onDragOver: dragProvider.props.onDragOver,
        onDropCapture: dragProvider.props.onDropCapture,
        onDragLeaveCapture: dragProvider.props.onDragLeaveCapture,
      })
    }
    loader();
  }

  function _editorDidMount(editorInstance, monaco) {
    // Make sure no ssr part in this extension
    importNoSSR(editorInstance);

    if (props.editorDidMount) props.editorDidMount(editorInstance, monaco);
  }

  return (
    <span
      onDragOver={eventDrag.onDragOver}
      onDropCapture={eventDrag.onDropCapture}
      onDragLeaveCapture={eventDrag.onDragLeaveCapture}
    >
      <Editor
        {...props}
        language="markdown"
        editorDidMount={_editorDidMount}
      />
    </span>

  )
}

export default DragNDropEditor;


