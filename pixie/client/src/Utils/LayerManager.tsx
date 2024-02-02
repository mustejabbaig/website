import { Layer } from "./Layer";
import { CanvasObject } from "./CanvasObject";
import { DEFAULT_LAYER, DEFAULT_LAYER_Z_INDEX, DEFAULT_LAYER_Z_INDEX_INCREMENT } from "./Constants";
import { PixelMatrix, RGBAData } from "./PixelMatrix";
import { fabric } from 'fabric';
import CanvasManager from "./CanvasManager";
import { cleanup } from "@testing-library/react";

export class LayerManager {
  
  // dict of layers
  layers: Layer[] = [];
  activeLayers: number[] = [];
  /**
   * All the objects in all the layers
   */
  objects: CanvasObject[] = [];
  private canvas: CanvasManager;

  constructor(canvas: CanvasManager) {
    // this.setActiveLayers([DEFAULT_LAYER])
    this.canvas = canvas;
  }
  /**
   * 
   * @returns true, if all the layer ID's are existent just once and the array is consecutive [layerID0, layerID1, layerID2,....]
   */
  validateLayers() : boolean
  {
    for(let i = 0; i < this.layers.length; i++)
    {
       if(this.layers[i].id != i) return false;
    }
    return true;
  }

  /**
   * Adds new Layer
   * @param isActive weather the layer is active or not! 
   */
  addNewLayer(isActive: boolean = true)
  {
    if(isActive) this.activeLayers.push(this.layers.length);
    this.layers.push(new Layer(this.layers.length, isActive));
  }

  /**
   * Creates a new layer and copie's all the object references into the new Layer
   * @param LayerID The LayerID to be copied
   */
  copyLayer(LayerID: number)
  {
    if(LayerID > this.layers.length) new Error("LayerID not found in copyLayer()");
    this.layers.push(new Layer(this.layers.length, this.layers[LayerID].isCurrentlyActive));
    
    let lastIndex = this.layers.length-1;
    for(let i = 0; i < this.layers[LayerID].objects.length; i++) this.layers[lastIndex].objects.push(this.layers[LayerID].objects[i]);

    if(this.layers[LayerID].isActive()) this.activeLayers.push(lastIndex);
  }

  /**
   * This function does NOT update the Canvas (in any way!!) --> so we don't check, if the object even is on the canvas.
   * @param objectToAdd fabric.Object to add to the Manager
   */
  addNewObjectToActiveLayers(objectToAdd : fabric.Object)
  {
    var cObj = new CanvasObject(this.canvas.canvas, objectToAdd, this, this.objects.length + 1);
    this.objects.push(cObj)
    for(let i = 0; i < this.activeLayers.length; i++)
    {
      cObj.layers.push(this.activeLayers[i]);
      this.layers[this.activeLayers[i]].objects.push(cObj);
    }
  }

  /**
   * This function will be called everytime, we delete an object from the canvas!
   * @param objectToRemove the fabric.Object to be removed from the layers
   */
  removeObjectFromAllLayers(objectToRemove: fabric.Object) 
  {
     // find object in layers:
     var found : number = -1;
     for(let i = 0; i < this.objects.length; i++)
     {
        var compObj : fabric.Object = this.objects[i].object;
        if(objectToRemove === compObj)
        {
          found = i;
          break;
        }
     }
     if(found > -1)
     {
        // remove object 
        this.objects[found].layers = [];
        this.cleanUpObjects();
     }
  }

  /**
   * updates the ZLevel according to the position and stamp
   * Also updates the visibility of all the according objects!
   */
  updateZLevel()
  {
      // first: update the internal zLevel
      for(let i = 0; i < this.objects.length; i++)
      {
        this.objects[i].zLevelInternal = i;
      }
      var activeObjects :  fabric.Object[] = [];
      var inActiveObjects : fabric.Object[] = [];

      for(let i = 0; i < this.layers.length; i++)
      {

        if(!this.activeLayers.includes(i))
        {
            // is not an active layer
            for(let j = 0; j < this.layers[i].objects.length; j++)
              inActiveObjects.push(this.layers[i].objects[j].object);
        }
        else
        {
          // active Layer
          this.layers[i].sortObjectsByZLevel();
          for(let j = 0; j < this.layers[i].objects.length; j++)
            activeObjects.push(this.layers[i].objects[j].object);
        }
      }

      for(let i = 0; i < inActiveObjects.length; i++)
          inActiveObjects[i].set("visible", false);
      for(let i = 0; i < activeObjects.length; i++)
      {
        activeObjects[i].set("visible", true);
        this.canvas.canvas.bringToFront(activeObjects[i]);
      }
      this.canvas.canvas.renderAll();
  }

  private clearLayer(layerID : number)
  {
    if(layerID >= this.layers.length) new Error("LayerID not existent!");

    for(let i = 0; i < this.layers[layerID].objects.length; i++)
    {
      let objToRemove : CanvasObject = this.layers[layerID].objects[i];
      objToRemove.removeObjectFromLayer(layerID);
    }

    this.layers[layerID].objects = [];
  }

  /**
   * Will empty out all the Active Layers
   */
  clearAllActiveLayers()
  {
      for(let i = 0; i < this.activeLayers.length; i++) this.clearLayer(this.activeLayers[i]);
      this.cleanUpObjects();
  }

  /**
   * Effectivly Removes all Object from the canvas --> use with caution!
   */
  clearAllLayers()
  {
      for(let i = 0; i < this.layers.length; i++) this.clearLayer(i);
      this.cleanUpObjects();
  }

  /**
   * This function will remove all objects, that are not inside any Layers, from the canvas. Use with caution.
   * Also, all the Z-Levels will be updated accordingly.
   */
  cleanUpObjects()
  {
    var ElementsToKeep : CanvasObject[] = [];
    for(let i = 0; i < this.objects.length; i++)
    {
      if(this.objects[i].layers.length == 0)
      {
        var objToRemove : CanvasObject = this.objects[i];
        this.canvas.canvas.remove(objToRemove.object);
        // find the object in the layer References
        for(let l = 0; l <this.layers.length; l++)
        {
          for(let o = 0; o  < this.layers[l].objects.length; o++)
          {
            var cmpObj : CanvasObject = this.layers[l].objects[o];
            if(cmpObj === objToRemove)
            {
              // We found and remove
              var newObjArray = [];
              for(let o2 = 0; o2 < this.layers[l].objects.length; o2++)
              {
                if(o2 == o) continue;
                newObjArray.push(this.layers[l].objects[o2]);
              }
              this.layers[l].objects = newObjArray;
            }
          }
        }
      }
      else
        ElementsToKeep.push(this.objects[i]);
    }
    this.objects = ElementsToKeep;
    this.updateZLevel();
  }

  /**
   * Use with caution. Will effectivly clean out the Canvas!
   */
  removeAllLayers()
  {
    for(let i = this.layers.length - 1; i >= 0; i-- )
      this.removeLayer(i);
  }

  /**
   * 
   * @param layerID ID to deactivate
   */
  deactivateLayer(layerID :  number)
  {
    if(layerID >= this.layers.length) new Error("layerID not present in deactivateLayer()");
    if(this.activeLayers.includes(layerID))
    {
      let newArr : number[] = [];
      for(let i = 0; i < this.activeLayers.length; i++)
      {
        if(this.activeLayers[i] == layerID) continue;
        newArr.push(this.activeLayers[i]);
      }
      this.activeLayers = newArr;

      this.updateZLevel();
    }
  }

  activateLayer(layerID: number)
  {
    if(layerID >= this.layers.length) new Error("layerID not present in deactivateLayer()");
    if(!this.activeLayers.includes(layerID))
    {
      this.activeLayers.push(layerID);
      this.activeLayers.sort();
      this.updateZLevel();
    }
  }

  /**
   * Removes the layer with given ID -- if the objects aren't in any other layers, they will be lost on the canvas!
   * ATTENTION: will set the ID's bigger than the ID to delete to -1 their original value (moving them down!)
   */
  removeLayer(layerID: number)
  {
    this.clearLayer(layerID);

    var newLayerArray : Layer[] = [];
    for(let i = 0; i < this.layers.length; i++)
    {
      if(i == layerID) continue;
      
      newLayerArray.push(this.layers[i]);
      if(i > layerID) newLayerArray[newLayerArray.length - 1].id -= 1;
    }
    this.layers = newLayerArray;

    var newALayerArray : number[] = [];
    for(let i = 0; i < this.activeLayers.length; i++)
    {
        if(this.activeLayers[i] == layerID)
            continue;

        if(i <= layerID) newALayerArray.push(this.activeLayers[i]);
        else newALayerArray.push(this.activeLayers[i] - 1);
        
    }
    this.activeLayers = newALayerArray;
    this.updateZLevel();
  }

  /**
   * finds the layer ID and deletes it, if found!
   * @param layerID the layer ID to find
   * @return true, if found and deleted!
   */
  /*
  public deleteLayer(layerID: number) {
    let canvasObjects = this.layerGetObjects(layer);
    for(let canvasObject of canvasObjects) {
      canvasObject.removeObject(canvasObject.getFabricObject());
    }
    delete this.layers[layer];
  }


  public addActiveLayer(layer: number) {
    this.setActiveLayers([...this.activeLayers, layer]);
  }

  public layerGetObjects(layerId: number): CanvasObject[] {
    let objects: CanvasObject[] = [];
    for (let object of this.objects) {
      if (object.getLayers().includes(layerId)) {
        objects.push(object);
      }
    }
    return objects;
  } 

  public setActiveLayers(layers: number[]) {
    let oldObjects = this.getObjecsFromLayerIds(this.activeLayers);
    console.log("oldObjects: ", oldObjects)
    oldObjects.forEach((oldObject) => {
      oldObject.deactivate();
    });
    for (let layerId of this.activeLayers) {
      let layer = this.getLayer(layerId);
      layer.deactivate();
    }
    
    this.activeLayers = layers

    for (let layerId of layers) {
      let layer = this.getLayer(layerId);
      layer.activate();
    }
    let newObjects = this.getObjecsFromLayerIds(this.activeLayers);
    newObjects.forEach((newObject) => {
      newObject.activate();
    });
  }

  public setActiveLayer(layer: number) {
    let activeLayers = [layer];
    this.setActiveLayers(activeLayers);
  }

  public removeActiveLayer(layer: number) {
    let activeLayers = this.activeLayers.filter((l) => {
      return l !== layer;
    });
    this.setActiveLayers(activeLayers);
  }

  public getLayers(layers: number[]): Layer[] {
    let layerObjects: Layer[] = [];
    for (let layer of layers) {
      layerObjects.push(this.getLayer(layer));
    }
    return layerObjects;
  }
  
  public getLayer(layer: number): Layer {
    if (this.layers[layer] == null) {
      this.addLayer(layer);
    }
    return this.layers[layer];
  }

  public getActiveLayers(): Layer[] {
    let activeLayers: Layer[] = [];
    for (let layer in this.layers) {
      if (this.layers[layer].isActive()) {
        activeLayers.push(this.layers[layer]);
      }
    }
    console.log("active layers: ", activeLayers);
    return activeLayers;
  }

  public getActiveLayerIds(): number[] {
    let activeLayerIds: number[] = [];
    for (let layer in this.layers) {
      if (this.layers[layer].isActive()) {
        activeLayerIds.push(this.layers[layer].getId());
      }
    }
    console.log("active layers: ", activeLayerIds);
    return activeLayerIds;
  }

  // return all objects that are visible on any active layer
  public getObjectsFromActiveLayers(): CanvasObject[] {
    let activeLayerIds = this.getActiveLayerIds();
    console.log("active LayerID:", activeLayerIds);
    let objects = this.getObjecsFromLayerIds(activeLayerIds);
    return objects;
  }

  public updateLayerIndex(oldId: number, newId: number) {
    let temp = this.layers[oldId]; 
    temp.setId(newId);
    // Move the layer to newId
    this.layers[newId] = temp;

    // update objects to new id
    for(let object of this.objects) {
      object.updateLayerId(oldId, newId);
    }
  } */


  /**
   * 
   * @param layerIds layerIDs to get the rgba information from
   * @returns 
   */
  private getRGBADataFromLayerIds(layerIds: number[]): PixelMatrix  {
    
    if(layerIds.length == 0)
    {
      throw new Error("Implement getRGBA for no Layers please!");
      return new PixelMatrix([]);
    }

    var virtualHTMLCanvas = document.createElement("canvas");
    var virtualCanvas: fabric.Canvas = new fabric.Canvas(virtualHTMLCanvas);
    virtualCanvas.setHeight(this.canvas.canvas.height as number);
    virtualCanvas.setWidth(this.canvas.canvas.width as number);
    virtualCanvas.backgroundColor = this.canvas.canvas.backgroundColor;
    
    let objects: CanvasObject[] = [];

    // add Objects to Draw!
    for(let i = 0; i < this.objects.length; i++)
    {
      var objToPossiblyAdd : CanvasObject = this.objects[i];
      for(let j = 0; j < layerIds.length; j++)
      {
        let nTc : number = layerIds[j];
        if(objToPossiblyAdd.layers.includes(nTc))
        {
          objects.push(objToPossiblyAdd);
          break;
        }
      }
    }

    // make all objects visible on the virtual canvas
    var isVisibleArray : (boolean | undefined)[] = [];
    for (let object of objects) {
      virtualCanvas.add(object.object);
      isVisibleArray.push(object.object.get("visible"));
      object.object.set("visible", true);
    }

    virtualCanvas.renderAll();
    const ctx : CanvasRenderingContext2D  = virtualCanvas.getContext();
    let imageData = ctx.getImageData(0,0,virtualCanvas.getWidth(), virtualCanvas.getHeight());

    let rgbaRaw : RGBAData[][] = [];
    let imageDataRaw = imageData.data;

    for(let h = 0; h < (this.canvas.canvas.height as number); h++)
    {
      rgbaRaw.push([]);
      for(let w = 0; w < (this.canvas.canvas.width as number); w++)
      {
        let indexInRawArray = (this.canvas.canvas.width as number * h + w) * 4;
        rgbaRaw[h].push(new RGBAData(
          imageDataRaw[indexInRawArray],
          imageDataRaw[indexInRawArray+1],
          imageDataRaw[indexInRawArray+2],
          imageDataRaw[indexInRawArray+3]))
      }
    }

    // set objects to their original visibility
    var i = 0;
    for(let object of objects)
    {
        object.object.set("visible", isVisibleArray[i]);
        i = i + 1;
    }

    virtualCanvas.clearContext(virtualCanvas.getContext());
    virtualCanvas.dispose();
    this.canvas.canvas.renderAll();
    return new PixelMatrix(rgbaRaw);
  }

  /**
   * 
   * @returns the RGBAMatrix containing Information to all the active layers
   */
  public getRGBADataFromActiveLayers(): PixelMatrix {
    return this.getRGBADataFromLayerIds(this.activeLayers);
  }
  
  public getRGBADataFromLayerId(layerId: number): PixelMatrix {
    return this.getRGBADataFromLayerIds([layerId]);
  }

  public getRGBADataFromAllLayers() : PixelMatrix
  { 
    var arr : number[] =  [];
    for(let i = 0; i < this.layers.length; i++) arr.push(i);
    return this.getRGBADataFromLayerIds(arr);
  }
}
