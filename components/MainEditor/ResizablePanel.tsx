// https://github.com/bjgrosse/react-resize-panel
import React, { useEffect, useRef, useState } from "react";
import { DraggableCore } from "react-draggable";
import { debounce } from "lodash";
import $ from "cash-dom";
import "./ResizablePanel.css";

const ResizablePanel = ({ direction, children, ...props }: any) => {

  const [size, setSize] = useState(0);
  const contentRef = useRef(null);
  const wrapperRef = useRef(null);

  const isHorizontal = () => true;
  // direction === "w" || direction === "e";

  useEffect(() => {
    const content = contentRef.current;
    const actualContent = content.children[0];
    let initialSize = isHorizontal()
      ? $(actualContent).outerWidth(true)
      : $(actualContent).outerHeight(true);

    // Initialize the size value based on the content's current size
    setSize(initialSize);
    validateSize();
  }, [])

  const validateSize = () => {
    const content = contentRef.current;
    const wrapper = wrapperRef.current;
    const actualContent = content.children[0];
    let containerParent = wrapper.parentElement;

    //
    // Or if our size doesn't equal the actual content size, then we
    // must have pushed past the min size of the content, so resize back
    //let minSize = isHorizontal ? $(actualContent).outerWidth(true) : $(actualContent).outerHeight(true);
    let minSize = isHorizontal()
      ? actualContent.scrollWidth
      : actualContent.scrollHeight;

    let margins = isHorizontal()
      ? $(actualContent).outerWidth(true) - $(actualContent).outerWidth()
      : $(actualContent).outerHeight(true) - $(actualContent).outerHeight();
    minSize += margins;

    if (size !== minSize) {
      setSize(minSize);
    } else {
      // If our resizing has left the parent container's content overflowing
      // then we need to shrink back down to fit
      let overflow = isHorizontal()
        ? containerParent.scrollWidth - containerParent.clientWidth
        : containerParent.scrollHeight - containerParent.clientHeight;

      if (overflow) {
        console.log("overflow", overflow);
        setSize(
          isHorizontal()
            ? actualContent.clientWidth - overflow
            : actualContent.clientHeight - overflow
        );
      }
    }
  }

  const handleDrag = (e, ui) => {
    const factor = direction === "e" || direction === "s" ? -1 : 1;

    // modify the size based on the drag delta
    let delta = isHorizontal() ? ui.deltaX : ui.deltaY;
    setSize(Math.max(10, size - delta * factor));
  };

  const handleDragEnd = (e, ui) => {
    validateSize();
  };

  // Render

  const dragHandlers = {
    onDrag: handleDrag,
    onStop: handleDragEnd
  };

  // style={{ flexGrow: '1' }}
  let contentStyle = isHorizontal()
    ? { width: size + "px" }
    : { height: size + "px"};

  return (
    <div>
      {/* <DraggableCore key="handle" {...dragHandlers}>
      <div className='ResizeBarHorizontal'>
        <div className='ResizeHandleHorizontal'>
          <span />
        </div>
      </div>
    </DraggableCore> */}
      <div
        ref={wrapperRef}
        className='ContainerHorizontal'
      >

        <div
          key="content"
          ref={contentRef}
          className={'ResizeContentHorizontal'}
          style={contentStyle}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default ResizablePanel;
