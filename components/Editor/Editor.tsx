import dynamic, { noSSR } from 'next/dynamic'
import { useEffect, useState } from 'react'

const MonacoEditor = dynamic(import('react-monaco-editor'), { ssr: false })
import { MonacoEditorProps } from 'react-monaco-editor'

export interface EditorProps extends MonacoEditorProps{
  loading?: React.ReactNode | string;
}

const Editor = ({
  loading = 'Loading Monaco Editor ...',
  ...props
} : EditorProps) => {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=> {
    setIsLoading(false);
  }, []);

  function _editorDidMount(editor, monaco) {
    // @ts-ignore
    window.MonacoEnvironment.getWorkerUrl = (moduleId, label) => {
      if (label === 'json') return '/_next/static/json.worker.js'
      if (label === 'css') return '/_next/static/css.worker.js'
      if (label === 'html') return '/_next/static/html.worker.js'
      if (label === 'typescript' || label === 'javascript')
        return '/_next/static/ts.worker.js'
      return '/_next/static/editor.worker.js'
    }
    if (props.editorDidMount) props.editorDidMount(editor, monaco);
    
  }

  return (
    <>
      { isLoading && loading }
      {!isLoading &&
        <MonacoEditor
          {...props}
          editorDidMount={_editorDidMount}
        />
      }
    </>

  )
}

export default Editor;