import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(import('react-monaco-editor'), { ssr: false })
// var extension = new MonacoMarkdown.MonacoMarkdownExtension()
// extension.activate(editor)

// const MonacoMarkdown = dynamic(import('../monaco-markdown-extension/index'), { ssr: false })
// MonacoMarkdownExtension

import * as MonacoMarkdown from '../monaco-markdown-extension';

function IndexPage() {

  function editorDidMount(editor, monaco) {
    // @ts-ignore
    window.MonacoEnvironment.getWorkerUrl = (moduleId, label) => {
      if (label === 'json') return '/_next/static/json.worker.js'
      if (label === 'css') return '/_next/static/css.worker.js'
      if (label === 'html') return '/_next/static/html.worker.js'
      if (label === 'typescript' || label === 'javascript')
        return '/_next/static/ts.worker.js'
      return '/_next/static/editor.worker.js'
    }

    var extension = new MonacoMarkdown.MonacoMarkdownExtension()
    extension.activate(editor);

    console.log('editorDidMount', editor);
    editor.focus();
  }

  return (
    <MonacoEditor
      height={'600px'}
      language="markdown"
      theme="vs"
      // value={sample}
      onChange={console.log}
      editorDidMount={editorDidMount}
    />


  )
}

export default IndexPage
