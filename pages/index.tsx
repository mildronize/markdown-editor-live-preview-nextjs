// import dynamic, { noSSR } from 'next/dynamic'
import  MarkdownEditor from '../components/Editor/MarkdownEditor';

function IndexPage() {

  function editorDidMount(editor, monaco) {
    editor.focus();
  }
    
  return (
    <>
      <MarkdownEditor
        height={'600px'}
        theme="vs"
        // value={sample}
        onChange={console.log}
        editorDidMount={editorDidMount}
      />
    </>

  )
}

export default IndexPage
