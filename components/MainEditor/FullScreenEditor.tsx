import { useState, useRef, useEffect } from 'react';
import MainEditor from './MainEditor';
import ImageUploadHandler from './ImageUploadHandler';
import './FullScreenEditor.css';
import styled from 'styled-components';
import MarkdownPreview from './MarkdownPreview';

const Styles = styled.div`

.full-screen-wrapper{
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}

.full-screen {
  height: 100%;
}

body {
  margin: 0;
}

.full-screen {
  display: flex;
  overflow: hidden;
  flex-direction: column;

  .header,
  .footer {
    height: 50px;
    background: #555;
    color: white;
    flex: 0 0 auto;
    overflow: scroll;
  }

  .main {

    flex: 1 1 auto;
    display: flex;
    overflow: hidden;

    > .left,
    > .right{
      width: 50%;
      background: #eee;
      flex: 0 0 auto;
      /* overflow: scroll; */
    }

    > .middle {
      flex: 1 1 auto;
      overflow: scroll;
    }
  }

}
`;

function FullScreenEditor() {

  const imageUploadRef = useRef(null);
  const markdownPreviewRef = useRef(null);

  const [value, setValue] = useState("");
  const [activeLine, setActiveLine ] = useState(1);

  const handleEditorChange = (newValue, e) => {
    setValue(newValue);
    localStorage.setItem('markdown_draft', value);
  }

  function editorDidMount(editor, monaco) {
    editor.focus();
  }

  const onUploadImageButtonClick = () => {
    // Click upload
    imageUploadRef.current.click();
  };

  useEffect(()=> {
    if(localStorage.getItem('markdown_draft')){
      setValue(localStorage.getItem('markdown_draft'));
    }
  },[]);

  return (
    <Styles>

      <div className="full-screen-wrapper">
        <div className="full-screen">
          <div className="header">

            <ImageUploadHandler
              imageUploadRef={imageUploadRef} />

            <button onClick={onUploadImageButtonClick}>Upload Image ...</button>

          </div>
          <div className="main">
            <div className="left">
              <MainEditor
                language="markdown"
                theme="vs"
                width={'100%'}
                editorDidMount={editorDidMount}
                value={value}
                setActiveLine={setActiveLine}
                onChange={handleEditorChange}
              />
            </div>
            <div className="middle">
              <MarkdownPreview /* isMatchLine={isMatchLine} */ activeLine={activeLine} children={value} />
            </div>

          </div>
          <div className="footer">Footer </div>
        </div>
      </div>


    </Styles>

  )
}

export default FullScreenEditor;
