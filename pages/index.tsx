import { useState } from 'react';
import MainEditor from '../components/MainEditor/MainEditor';
import ReactMarkdown from 'react-markdown'
import remarkGFM from 'remark-gfm';
import FullScreenEditor from '../components/MainEditor/FullScreenEditor';

function MainPage() {

  return (
    <>
      <FullScreenEditor />
    </>

  )
}

export default MainPage;
