import dynamic, { noSSR } from 'next/dynamic'
import Editor, { EditorProps} from './Editor';

const MarkdownEditor = (props: EditorProps) => {

  function importNoSSR(editor) {
    const loader = async () => {
      let MonacoMarkdown = await import('./monaco-markdown-extension')
      var extension = new MonacoMarkdown.MonacoMarkdownExtension;
      extension.activate(editor);
    }
    loader();
  }

  function _editorDidMount(editor, monaco) {
    // Make sure no ssr part in this extension 
    importNoSSR(editor);
    if(props.editorDidMount) props.editorDidMount(editor, monaco);
  }

  return (
    <>
      <Editor
        {...props}
        language="markdown"
        editorDidMount={_editorDidMount}
      />
    </>

  )
}

export default MarkdownEditor;