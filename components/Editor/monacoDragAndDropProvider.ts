// https://github.com/microsoft/monaco-editor/issues/1050
import React from 'react';
import { editor } from 'monaco-editor';

/*
 <span {...dragProvider.props} >
    <Component .. />
 </span>
*/

const { ContentWidgetPositionPreference } = editor;

export type TDropHandler = (e: React.DragEvent, target: editor.IMouseTarget, instance: editor.IStandaloneCodeEditor) => void;
export type TInstanceGetter = () => editor.IStandaloneCodeEditor;

export class MonacoDragNDropProvider {
  onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    this.onDropHandler && this.onDropHandler(e, this.dragTarget, this.getInstance());
    this.removeMouseDownWidget();
  };

  onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    const instance = this.getInstance();
    instance && this.displayMouseDropPosition(instance, instance.getTargetAtClientPoint(e.clientX, e.clientY));
    e.preventDefault();
  };

  removeMouseDownWidget = () => {
    const instance = this.getInstance();
    if (instance && this.mouseDropWidget && this.domNode) {
      instance.removeContentWidget(this.mouseDropWidget);
      this.mouseDropWidget = null;
    }
  };

  props: React.HTMLAttributes<HTMLDivElement> = {
    onDragOver: this.onDragOver,
    onDropCapture: this.onDrop,
    onDragLeaveCapture: this.removeMouseDownWidget
  };

  domNode: HTMLDivElement = null;
  mouseDropWidget: editor.IContentWidget = null;
  dragTarget: editor.IMouseTarget;

  buildMouseDropWidget = () => {
    if (!this.domNode) {
      // Build cursor for dropping
      this.domNode = document.createElement('div');
      this.domNode.className = this.dropClassName;
      this.domNode.style.pointerEvents = 'none';
      this.domNode.style.borderLeft = '2px solid #ccc';
      this.domNode.innerHTML = '&nbsp;';
    }
    return {
      getId: () => 'drag',
      getDomNode: () => this.domNode,
      getPosition: () => ({
        position: this.dragTarget.position,
        preference: [ContentWidgetPositionPreference.EXACT, ContentWidgetPositionPreference.EXACT]
      })
    };
  };

  displayMouseDropPosition = (instance: editor.IStandaloneCodeEditor, target: editor.IMouseTarget) => {
    this.dragTarget = target;
    if (this.mouseDropWidget) {
      instance.layoutContentWidget(this.mouseDropWidget);
    } else {
      this.mouseDropWidget = this.buildMouseDropWidget();

      // Target should be not null
      target && instance.addContentWidget(this.mouseDropWidget);
    }
  };

  getInstance: TInstanceGetter;
  dropClassName: string;
  onDropHandler: TDropHandler;
  constructor(onDrop: TDropHandler, getInstance: TInstanceGetter, dropClassName: string = 'drop') {
    this.dropClassName = dropClassName;
    this.onDropHandler = onDrop;
    this.getInstance = getInstance;
  }
}
