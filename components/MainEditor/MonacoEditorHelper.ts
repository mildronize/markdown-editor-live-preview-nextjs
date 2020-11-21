import monaco, { editor } from 'monaco-editor';

export class MonacoEditorHelper {
  constructor(private editor: editor.IStandaloneCodeEditor) { }

  public writeTextAtTarget(target, text: string) {
    const range = target.range;
    const id = { major: 1, minor: 1 };
    const op = { identifier: id, range, text, forceMoveMarkers: true };
    this.editor.executeEdits("my-source", [op]);
  }

  public writeTextAtCurrentCursor(text: string) {
    if (this.editor && monaco) {
      this.editor.getModel().applyEdits([{
        range: monaco.Range.fromPositions(this.editor.getPosition()),
        text
      }]);
    }
  }

}
