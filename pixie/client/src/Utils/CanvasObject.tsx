import { LayerManager } from "./LayerManager";

export class CanvasObject {
  /**
   * The Canvas this object belongs to
   */
  fabricCanvas: fabric.Canvas;
  /**
   * reference to the fabric Object
   */
  object: fabric.Object;

  /**
   * layer ID's this object belongs to
   */
  layers: number[] = [];
  /**
   * reference to the layerManager
   */
  layerManager: LayerManager;

  zLevelInternal: number = 0;

  constructor(fabricCanvas: fabric.Canvas, object: fabric.Object, layerManager: LayerManager, zLevel : number = 0) {
    if(!fabricCanvas || !object || !layerManager) new Error("Invalid References in CanvasObject constructor!");
    this.fabricCanvas = fabricCanvas;
    this.object = object;
    this.layerManager = layerManager;
    this.zLevelInternal = zLevel;
  }

  /*public setZAxis(zIndex: number) {
    this.zIndex = zIndex;
    this.fabricCanvas.moveTo(this.object, zIndex);
  }*/

  /**
   * 
   * @returns all the LayerID's this object belongs too.
   */
  public getLayers(): number[] {
    return this.layers;
  }


  /*
  public addLayer(layer: number) {
    this.layers.push(layer);
    this.layerManager.updateObject(this);
  }

  public setSelectable(selectable: boolean) {
    this.object.set('selectable', selectable);
  }

  public deactivate() {
    this.setSelectable(false);
  }

  public removeObjectFromCanvas() {
    if(this.object) {
      this.fabricCanvas.remove(this.object);
    }
  }*/


  /**
   * This function doesn't do any checking weather the array containing Layer ID's will be empty after that.
   * This responsibility is given to the caller of the function. (For Example: Use LayerManager Validation and Removal!)
   * @param layer The LayerID to find and remove from the array of LayerIDs
   */
  public removeObjectFromLayer(layer: number) 
  {
    var newIDs : number[] = [];
    for(let i = 0; i < this.layers.length; i++)
    {
      if(this.layers[i] == layer) 
      {
        continue;
      }
      newIDs.push(this.layers[i]); 
    }
    this.layers = newIDs;
  }

  /*
  public updateLayerId(oldId: number, newId: number) {
    // replaces old id with new id, leaves rest as it was
    this.layers = this.layers.map((layer) => {
      return layer === oldId ? newId : layer;
    });
  }

  public getFabricObject(): fabric.Object {
    return this.object;
  }
  */
}
