import { useState } from 'react';
import  MarkdownEditor from '../components/Editor/MarkdownEditor';
import ReactMarkdown from 'react-markdown'
import remarkGFM from 'remark-gfm';


function IndexPage() {

  const [value, setValue] = useState("");

  const handleEditorChange = (newValue, e) => {
    setValue(newValue);
  }

  function editorDidMount(editor, monaco) {
    editor.focus();
  }
    
  return (
    <>
    <div style={{ display: 'flex' }} >
      <div style={{ width: '49%' }} >
      <MarkdownEditor
        height={'600px'}
        theme="vs"
        editorDidMount={editorDidMount}
        value={value}
        onChange={handleEditorChange}
      />
      </div>
      <div style={{ width: '49%' }} >
        <h1>Output</h1>
        <ReactMarkdown className="markdown-preview" plugins={[remarkGFM]} children={value} />
      </div>
    </div>

      
    </>

  )
}

export default IndexPage;