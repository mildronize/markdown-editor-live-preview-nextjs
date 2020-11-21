import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGFM from 'remark-gfm';
import './MarkdownPreview.css';

interface Dictionary {
  [key : string]: any
}

function parseChildNodeToElement(t) {
  // Copyright (c) 2010 Roy Sharon <roy@roysharon.com>
  // Using this file is subject to the MIT License <http://creativecommons.org/licenses/MIT/>

  if (typeof (t) != 'object') return;

  if (t.getRangeAt) {
    // we have a Selection object
    if (t.rangeCount == 0) return;
    t = t.getRangeAt(0);
  }

  if (t.cloneRange) {
    // we have a Range object
    var r = t.cloneRange();	// do not modify the source range
    r.collapse(true);		// collapse to start
    var t = r.startContainer;
    // if start is an element then startOffset is the child number
    // in which the range starts
    if (t.nodeType == 1) t = t.childNodes[r.startOffset];
  }

  if (t.nodeType == 1) {
    var o = t;
    // if we have a BR element then we want to skip back
    // or otherwise when we scroll into view the browser
    // will scroll past the BR
    while (o && o.nodeType == 1 && o.tagName == 'BR') o = o.previousSibling;
    if (o) t = o; // we may have reached the first element
  }

  // if t is not an element node then we need to skip back until we find the
  // previous element with which we can call scrollIntoView()
  o = t;
  while (o && o.nodeType != 1) o = o.previousSibling;
  t = o || t.parentNode;

  return t;
  // if (t) t.scrollIntoView();
}

function MarkdownPreview({ activeLine, ...props }: any) {

  const markdownPreviewRef = useRef(null);

  const buildMapLines = (nodes) => {
    const mapLines : Dictionary[] = [];

    nodes.forEach(node => {
      const sourcePosition = parseChildNodeToElement(node).dataset.sourcepos || '';
      const sourcePositionSplit = sourcePosition.split('-');

      let startPositionLine = 0, endPositionLine = 0;

      if(sourcePositionSplit && sourcePositionSplit.length > 0 && sourcePositionSplit[0] !== ''){
        startPositionLine = Number(sourcePositionSplit[0].split(':')[0]);
      }

      if(sourcePositionSplit && sourcePositionSplit.length > 1 && sourcePositionSplit[1] !== ''){
        endPositionLine = Number(sourcePositionSplit[1].split(':')[0]);
      }

      const lines: Dictionary = {}
      lines['node'] = node;
      lines['startLine'] = startPositionLine;
      lines['endLine'] = endPositionLine;
      mapLines.push(lines);
    });

    return mapLines;
  }

  const findFirstNodeLine  = (mapNodeLines, startLine) => {
    for(let i =0;i <mapNodeLines.length; i++ ){
      if(startLine == mapNodeLines[i].startLine){
        return mapNodeLines[i];
      }
    }
    return undefined;
  };

  useEffect(() => {

    // data-sourcepos="3:1-3:13"
    const nodes = (markdownPreviewRef.current as Node).childNodes;
    const mapNodeLines = buildMapLines(nodes);

    mapNodeLines.forEach(item => {
      if(activeLine >= item.startLine && activeLine <= item.endLine){
        // parseChildNodeToElement(item.node).scrollIntoView({ behavior: 'smooth' });
        const firstNodeLine = findFirstNodeLine(mapNodeLines, item.startLine);
        console.log(firstNodeLine)
        if(firstNodeLine)
          parseChildNodeToElement(item.node).scrollIntoView({ behavior: 'smooth' });
        else
          parseChildNodeToElement(firstNodeLine.node).scrollIntoView({ behavior: 'smooth' });
      }
    });

  }, [activeLine])


  return (
    <>
      <div className="markdown-preview" ref={markdownPreviewRef} >
        <ReactMarkdown sourcePos={true}  {...props} allowDangerousHtml={true} plugins={[remarkGFM]} />
      </div>
    </>
  )
}

export default MarkdownPreview;
