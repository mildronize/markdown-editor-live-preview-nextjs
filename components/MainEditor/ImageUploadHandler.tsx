import { useState, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Styles = styled.div`
/* .files input {
  display: none !important;
} */
`;

function ImageUploadHandler({ imageUploadRef }: any) {

  const onUploadFormHandler = (event) => {
    var file = event.target.files[0];
    uploadFile(file);
  };

  const uploadFile = async (file: any) => {
    const data = new FormData();
    data.append("file", file);
    await axios.post("http://localhost:8000/upload", data, {
      onUploadProgress: (ProgressEvent) => {
        console.log(`Loading ... (${(ProgressEvent.loaded / ProgressEvent.total) * 100})`)
      },
    }).then(res => {
      console.log("upload success");
    }).catch((err) => {
      console.error("upload fail");
    });

  }

  return (
    <Styles>
      <div className="form-group files">
        <input style={{ display: 'none' }} ref={imageUploadRef} type="file" className="form-control" multiple onChange={onUploadFormHandler} />
      </div>
    </Styles>

  )
}

export default ImageUploadHandler;
