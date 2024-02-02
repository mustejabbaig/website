import { CanvasObject } from './CanvasObject';
import CanvasManager from './CanvasManager';

export class HistoryManager
{
  undo_history: any[]; // WE WANT JSON OBJECTS as members, so we easily can convert them!
  redo_history: any[];

  undo_history_widthHeight: [number,number][];
  redo_history_widthHeight: [number,number][];

  undo_history_layerObjects: CanvasObject[][];
  redo_history_layerObjects: CanvasObject[][];
  constructor()
  {
    this.undo_history = [];
    this.redo_history = [];

    this.undo_history_widthHeight = [];
    this.redo_history_widthHeight = [];

    this.undo_history_layerObjects = [];
    this.redo_history_layerObjects = [];

  }

  clear_undo() : void
  {
    this.undo_history_widthHeight = [];
    this.undo_history = [];
    this.undo_history_layerObjects = [];

  }
  clear_redo() : void
  {
    this.redo_history = [];
    this.redo_history_widthHeight = [];
    this.redo_history_layerObjects = [];
  }

  addToUndo(stateToAdd : CanvasManager, afterRedo : boolean = false)
  {
    let canvasJSON = stateToAdd.canvas.toObject();
    this.undo_history_widthHeight.push([stateToAdd.canvas.width as number, stateToAdd.canvas.height as number]);
    this.undo_history.push(canvasJSON);
    this.undo_history_layerObjects.push(stateToAdd.layerManager.objects.slice());
    if(!afterRedo) this.clear_redo();
    // console.log("Current History:", this.undo_history);
  }

  addToRedo(stateToAdd : CanvasManager)
  {
    let canvasJSON = stateToAdd.canvas.toObject();
    this.redo_history.push(canvasJSON);
    this.redo_history_widthHeight.push([stateToAdd.canvas.width as number, stateToAdd.canvas.height as number]);
    this.redo_history_layerObjects.push(stateToAdd.layerManager.objects.slice());
  }
}
