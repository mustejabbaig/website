import { fabric } from 'fabric'
import {saveAs} from "file-saver";
import { PixelMatrix, RGBAData } from './PixelMatrix';
import { HistoryManager } from './HistoryManager';
import { LayerManager } from './LayerManager';
import { BasicFunctions } from './BasicFunctions';
import { API_URL, PROGRAM_STARTS_WITH_DRAWING_ENABLED } from './Constants';
import ApiService from './ApiService';

enum Tools {
  SELECT,
  PEN,
  PENCIL,
  ERASER,
}



/* This is a singleton class and is managed by the canvas component.
   The CanvasManager abstracts away the low level code, that is used to extract and add information
   to the Canvas. */
export class CanvasManager {

  public HTMLSTATEcurrentFunctionality : string = 'default';

  static __HTMLCanvas : HTMLCanvasElement;
  canvas: fabric.Canvas;

  public currentState: string = 'default'; // 
  private prevImage: fabric.Image | undefined = undefined;

  // features
  history: HistoryManager = new HistoryManager();
  layerManager: LayerManager = new LayerManager(this);
  apiService: ApiService = new ApiService(API_URL);
  // TODO: make private
  public basicFunctions: BasicFunctions = new BasicFunctions(this);
  
  selectedTool: Tools = Tools.PENCIL;

  backgroundColor: string = 'lightblue';

  lastRGBAData: PixelMatrix | undefined;

  croppingCircles: [fabric.Circle, fabric.Circle, fabric.Circle, fabric.Circle, fabric.Circle, fabric.Circle, fabric.Circle, fabric.Circle] = this.createCroppingCircles();;
  croppingBorders: [fabric.Rect, fabric.Rect, fabric.Rect, fabric.Rect] = this.createBorders();
  // CUSTOM BORDER ELEMENTS
  b_cropping_mustAddBordersToCanvas: boolean = true;

  brushMap: Map<string, fabric.BaseBrush> = new Map<string, fabric.BaseBrush>();

  constructor(brushWidth: number = 5, brushColor: string = "black", backgroundColor: string = "lightblue") {
    this.canvas = new fabric.Canvas('my-canvas', {
      isDrawingMode: PROGRAM_STARTS_WITH_DRAWING_ENABLED
    });

    this.setupEvents();
    this.setupCanvas(backgroundColor, brushWidth, brushColor);
  }

  private setupCanvas(backgroundColor: string, brushWidth: number, brushColor: string) {
    // Initialize canvas background
    this.setBackgroundColor(backgroundColor);

    this.activateFrequentReadingFlag();

    this.canvas.freeDrawingBrush.width = brushWidth;
    this.canvas.freeDrawingBrush.color = brushColor;
  }

  private canvasSetupEventOnMouseDown() {
    // events
    /* this.canvas.on('mouse:down', (e) => {
      if(this.canvas.isDrawingMode)
      {
        this.saveCurrentCanvasToUndo();
      }
    }) */
  }

  private canvasSetupEventOnObjectAdded() {
    this.canvas.on('object:added', (e) => {
      const object = e.target!;
      console.log("CANVAS OBJECT ADDED: ", object);
      if(object.get('excludeFromExport'))
    {
        console.log("CANVAS OBJECT ADDED: We don't want to have these things in the layers! Deactivate 'ExcludeFromExport!' if you want that");
        return;
      }

      // add to the layers
      if (this.layerManager.activeLayers.length === 0) 
    {
        console.log("CANVAS OBJECT ADDED: No active Layers");
        this.canvas.remove(object);
      } 
      else 
    {
        console.log("CANVAS OBJECT ADDED: Adding Object to Layers");
        this.layerManager.addNewObjectToActiveLayers(object);

      }
      this.layerManager.updateZLevel();
    });
  }

  private canvasSetupEventOnObjectRemoved() {
    this.canvas.on("object:removed", (e) => {
      const objectToRemove =  e.target!;
      console.log("CANVAS OBJECT REMOVED: ", objectToRemove);
      if(objectToRemove.get('excludeFromExport'))
    {
        console.log("CANVAS OBJECT REMOVED: We don't want to have these things in the layers! Deactivate 'ExcludeFromExport!' if you want that");
        return;
      }

      this.layerManager.removeObjectFromAllLayers(objectToRemove);

      // remove from layers
    });
  }

  private setupEvents() {
    this.canvasSetupEventOnMouseDown();
    this.canvasSetupEventOnObjectAdded();
    this.canvasSetupEventOnObjectRemoved();
  }

  private activateFrequentReadingFlag() {
    // we use multiple algorithms that use RGBA matrices, so we need to read the data property frequently
    CanvasManager.__HTMLCanvas = this.canvas.getContext().canvas;
    // TODO: this doesn't work. If this can't be turned on, a warning will be thrown in the console
    this.canvas.getContext().canvas.getContext('2d', { willReadFrequently: true });
    // this is definetely false
    // this.canvas.getContext().getContextAttributes().willReadFrequently = true;
  }

  public setupBrushes() {
    this.brushMap.set("pencil", new fabric.PencilBrush(this.canvas));
    this.brushMap.set("pen", new fabric.PencilBrush(this.canvas));
    //@ts-ignore
    this.brushMap.set("eraser", new fabric.EraserBrush(this.canvas));
  }


  public processConvertWhiteToAlpha(matrix: PixelMatrix): PixelMatrix {
    for (let x = 0; x < matrix.getWidth(); x++) {
      for (let y = 0; y < matrix.getHeight(); y++) {
        let pixel = matrix.getPixel(x, y);
        // Check if the pixel is white and convert to transparent
        if (pixel.red === 255 && pixel.green === 255 && pixel.blue === 255) {
          pixel.alpha = 0;
        }
        matrix.setPixel(x, y, pixel);
      }
    }
    return matrix;
  }

  public pixelMatrixToDataURL(matrix: PixelMatrix): string {
    let offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = matrix.getWidth();
    offScreenCanvas.height = matrix.getHeight();
    let offCtx = offScreenCanvas.getContext('2d');

    if (offCtx === null) {
      throw new Error("offCtx is null");
    }

    let imageData = offCtx.createImageData(matrix.getWidth(), matrix.getHeight());
    for (let x = 0; x < matrix.getWidth(); x++) {
      for (let y = 0; y < matrix.getHeight(); y++) {
        let index = (y * matrix.getWidth() + x) * 4;
        let pixel = matrix.getPixel(x, y);
        imageData.data[index] = pixel.red;
        imageData.data[index + 1] = pixel.green;
        imageData.data[index + 2] = pixel.blue;
        imageData.data[index + 3] = pixel.alpha;
      }
    }
    offCtx.putImageData(imageData, 0, 0);

    return offScreenCanvas.toDataURL();
  }
  /*
  public static async getRGBADataFromCanvas(fabricCanvas: fabric.StaticCanvas): Promise<PixelMatrix> {
    let virtualCanvas = await CanvasManager.canvasMakeVirtualCopy(fabricCanvas);

    // set background color
    // WHY? 
    // virtualCanvas.backgroundColor = 'white';
    virtualCanvas.renderAll();

    // Example: Adding a rectangle to the virtual canvas
    const ctx: CanvasRenderingContext2D = virtualCanvas.getContext();
    let imageData = ctx.getImageData(0, 0, virtualCanvas.getWidth(), virtualCanvas.getHeight());
    let width: number = imageData.width;
    let data: Uint8ClampedArray = imageData.data;
    let matrix: RGBAData[][] = [];

    for (let y: number = 0; y < imageData.height; y++) {
      let row: RGBAData[] = [];
      for (let x: number = 0; x < width; x++) {
        let index: number = (y * width + x) * 4;
        row.push({red: data[index], green: data[index + 1], blue: data[index + 2], alpha: data[index + 3]});
      }
      matrix.push(row);
    }

    return new PixelMatrix(matrix);
  }

  
  public static canvasMakeVirtualCopy(canvas: fabric.StaticCanvas): Promise<fabric.Canvas> {
    return new Promise((resolve) => {
      const virtualCanvasEl = document.createElement('canvas');
      virtualCanvasEl.width = canvas.getWidth();
      virtualCanvasEl.height = canvas.getHeight();

      const virtualCanvas = new fabric.Canvas(virtualCanvasEl);
      const objects = canvas.getObjects();
      const totalObjects = objects.length;
      let clonedObjectsCount = 0;

      objects.forEach((obj) => {
        obj.clone((clonedObj: fabric.Object) => {
          virtualCanvas.add(clonedObj);
          clonedObjectsCount++;
          if (clonedObjectsCount === totalObjects) {
            virtualCanvas.renderAll();
            resolve(virtualCanvas);
          }
        }, ['src']); // Include 'src' for images
      });

      // If there are no objects, resolve immediately
      if (totalObjects === 0) {
        resolve(virtualCanvas); 
      }
    });
  }*/

  public applyPixelMatrixToCanvas(pixelMatrix: PixelMatrix) {
    const ctx: CanvasRenderingContext2D = this.canvas.getContext();
    const imageData: ImageData = pixelMatrix.toImageData();
    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * 
   * @param file the HTML File to be uploaded
   * @param mode 'default' == 'intoNewLayer', 'insideActiveLayer', 'newProject'
   * @param dimensionChange if image is bigger than dimension of canvas --> we will edit it!
   * @param forceDimensionChange even if image is smaller --> canvas dimensions will be changed accordingly
   */
  public addImageFromFile(file: File, mode: string = 'default', dimensionChange: boolean = false, forceDimensionChange: boolean =  false) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl: string = e.target!.result as string;

      
      if(mode === 'insideActiveLayer')
      {
          alert("WARNING! All Data in all active layers will be lost!");
          // TODO Clear all active Layers
          this.layerManager.clearAllActiveLayers();
          this.addImageFromUrl(imageUrl, false, dimensionChange, forceDimensionChange);
          
      }
      
      else if(mode === 'newProject')
      {
        alert("WARNING! All unsaved Data will be lost!");
        this.layerManager.removeAllLayers();
        this.layerManager.addNewLayer(true);
        this.addImageFromUrl(imageUrl, false, true, true);
      }
      else // intoNewLayer
      {
        this.layerManager.addNewLayer(true);
        var tmpActiveLayers = this.layerManager.activeLayers;
        this.layerManager.activeLayers = [this.layerManager.layers.length - 1];
        this.layerManager.activeLayers = tmpActiveLayers;
        this.layerManager.updateZLevel();
      }

      
      console.log("DEBUG: ", this.layerManager);
    };
    reader.readAsDataURL(file);
  }
/**
 *  make image smaller than canvas if it is too big
 * @memberof CanvasManager
 */
  boundImage(img: fabric.Image) {
    if(img.width! > this.canvas.getWidth() || img.height! > this.canvas.getHeight())
   {
      let scale = 1;
      if(img.width! > this.canvas.getWidth())
      {
        scale = this.canvas.getWidth() / img.width!;
      }
      else
      {
        scale = this.canvas.getHeight() / img.height!;
      }
      img.scale(scale);
    }
  }

  /**
   * Adds the image into all the active layers!
   * @param url image URL to add
   * @param selectable is it selectable
   * @param fixDimensions if image is bigger than dimension of canvas --> we will edit it!
   * @param forceFixDimension even if image is smaller --> canvas dimensions will be changed accordingly
   */
   public async addImageFromUrl(url: string, selectable: boolean = false, fixDimensions: boolean = true, forceFixDimension: boolean = false)
   {
    await fabric.Image.fromURL(url, (img) => {
      // TODO: is this really what we want?

      // options
      img.set('selectable', selectable);
      img.set('evented', selectable);
      img.set('hasControls', selectable)
      
      if(fixDimensions)
      {
        if(!forceFixDimension && (img.width as number) <= this.canvas.getWidth() && (img.height as number) <= this.canvas.getHeight() ) {} // NOTHING TO DO HERE
        else
        {
          this.canvas.setWidth(img.width as number);
          this.canvas.setHeight(img.height as number);
        }
      }
      
      this.canvas.add(img);
    });
  }

  public destroy() {
    this.canvas.dispose();
  }

  public getLayerManager(): LayerManager {
    return this.layerManager;
  }

  public getFabricCanvas(): fabric.Canvas {
    return this.canvas;
  }

  public getSelectedTool(): Tools {
    return this.selectedTool;
  }

  public setSelectTool() {
    this.selectedTool = Tools.SELECT;
    this.canvas.isDrawingMode = false;
  }

  public setPenTool() {
    this.selectedTool = Tools.PEN;
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.isDrawingMode = true;
    this.setBrushWidth(3); 
    this.setBrushColor("blue"); 
  }

  public setPencilTool() {
    this.selectedTool = Tools.PENCIL;
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.isDrawingMode = true;
    this.setBrushWidth(3); 
    this.setBrushColor("black"); 
  }

  public setEraserTool() {
    this.selectedTool = Tools.ERASER;
    // TODO: Fix this, as this is may be security issue, that means the software
    // may crash when the user is using the eraser tool.
    // HACK: somehow I added the typescript interface at 
    // ../types/fabric-augmentation.d.ts to augment fabric, but it doesn't
    // really work. This file should have enhanced the fabric typescript
    // interface.
    //@ts-ignore
    this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas);
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.width = 10;
  }

  public setTool(tool: Tools) {
    switch (tool) {
      case Tools.SELECT:
        this.setSelectTool();
        break;
      case Tools.PEN:
        this.setPenTool();
        break;
      case Tools.PENCIL:
        this.setPencilTool();
        break;
      case Tools.ERASER:
        this.setEraserTool();
        break;
      default:
        console.log("Tool not implemented yet!");
        break;
    }
  }

  public clear() {
    this.canvas.clear();
    this.canvas.backgroundColor = this.backgroundColor;
  }

  public updateBackgroundImage() {
    // TODO: fix this
    /*fabric.Image.fromURL(image, function (oImg) {
      // Clear the canvas before changing dimensions
      canvas.clear();
      canvas.setDimensions({ width: oImg.width as number, height: oImg.height as number });
      canvas.setBackgroundImage(oImg, canvas.renderAll.bind(canvas), {
      });
      });*/
  }

  public canvasToImageURL() {
    this.canvas.renderAll();  
    saveAs(this.canvas.toDataURL()); 
  }

  public async downloadCanvasToFormats(fileType:string="png", fileName:string="picture00") {
    // add accepted fileTypes to this array
    if (["png", "jpg", "gif", "avif", "webp", "pngc"].indexOf(fileType) >= 0){
      this.canvas.renderAll();
      try {
        let imageData: string = this.canvas.toDataURL() + "." + fileType;
        const resizedImage = await this.apiService.resizeImage(imageData);
        // Create a link to download the image
        const link = document.createElement('a');
        link.href = resizedImage;
        link.download = fileName + '.' + fileType;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

/*   // now with rgbadata
  public async getRGBAMatrix(): Promise<PixelMatrix> {
    return this.layerManager.getRGBADataFromLayerId(0);
  } */

  public redFilter() {
    fabric.Image.fromURL(this.canvas.toDataURL(), (img) => {
      var filter = new fabric.Image.filters.BlendColor({
        color: '#00ff00',
        mode: 'tint',
        alpha: 1.0
      });

      img.filters?.push(filter);
      img.applyFilters();
      this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
    });
  }

  public applyRedFilter() {
    const imageDataUrl = this.canvas.toDataURL();
    console.log("one");
    fabric.Image.fromURL(imageDataUrl, (img) => {
      console.log("two");
      const filter = new fabric.Image.filters.BlendColor({
        color: '#FF0000', 
        mode: 'tint',
        alpha: 1.0
      });
      console.log("three");
      img.filters = [filter];
      console.log("four");
      img.applyFilters();
      console.log("five");
      this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
      console.log("six");
    });
  }

public applyRedTintFilterToObjects() {
  var currCanvas = this.getFabricCanvas();
  currCanvas.forEachObject((obj: any) => {
    if (this.HTMLSTATEcurrentFunctionality === 'redFilter') {
      var filter = new fabric.Image.filters.BlendColor({
        color: 'red', 
        mode: 'multiply', 
        alpha: 0.5
      });

      obj.filters?.push(filter);
      obj.applyFilters();
    }
  });

  currCanvas.renderAll();
}

public applySepiaFilterToCanvasImage() {
  this.canvas.getObjects().forEach((object) => {
    if (object instanceof fabric.Image) {
      const filter = new fabric.Image.filters.Sepia();
      object.filters?.push(filter);
      object.applyFilters();
      this.canvas.add(object);
    }
  });
  this.canvas.renderAll();

}

public applyContrastFilterToCanvasImage(contrastValue: number) {
  const normalizedContrast = contrastValue / 100;

  this.canvas.getObjects().forEach((object) => {
    if (object instanceof fabric.Image) {
      const filters = object.filters ?? [];
      const existingFilterIndex = filters.findIndex(filter => (filter as any).type === 'Contrast');
      const contrastFilter = new fabric.Image.filters.Contrast({ contrast: normalizedContrast });

      if (existingFilterIndex !== -1) {
        filters[existingFilterIndex] = contrastFilter;
      } else {
        filters.push(contrastFilter);
      }

      object.filters = filters;
      object.applyFilters();
    }
  });
  this.canvas.renderAll();
}


public applySharpenFilterToCanvasImage() {
  const sharpenMatrix = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  this.canvas.getObjects().forEach((object) => {
    if (object instanceof fabric.Image) {
      const sharpenFilterExists = object.filters?.some(filter => {
        const convoluteFilter = filter as any;
        return convoluteFilter.type === 'Convolute' && 
               convoluteFilter.matrix.join(',') === sharpenMatrix.join(',');
      });

      if (!sharpenFilterExists) {
        var filter = new fabric.Image.filters.Convolute({
          matrix: sharpenMatrix
        });
        object.filters?.push(filter);
        object.applyFilters();
      }
    }
  });
  this.canvas.renderAll();
}

public removeSharpenFilterFromCanvasImage() {
  const sharpenMatrix = [0, -1, 0, -1, 5, -1, 0, -1, 0].join(',');
  this.canvas.getObjects().forEach((object) => {
    if (object instanceof fabric.Image) {
      object.filters = object.filters?.filter(filter => {
        const convoluteFilter = filter as any;
        return !(convoluteFilter.type === 'Convolute' && 
                 convoluteFilter.matrix.join(',') === sharpenMatrix);
      });
      object.applyFilters();
    }
  });
  this.canvas.renderAll();
}

public applyGammaFilterToCanvasImage(rgb: number[]) {
  this.canvas.getObjects().forEach((object) => {
    if (object instanceof fabric.Image) {
      const gammaValues = rgb.map((value: number) => value / 128 + 1);

      // @ts-ignore
      var filter = new fabric.Image.filters.Gamma({ gamma: gammaValues });

      if (object.filters) {
        const existingFilterIndex = object.filters.findIndex(filter => (filter as any).type === 'Gamma');
        if (existingFilterIndex >= 0) {
          object.filters[existingFilterIndex] = filter;
        } else {
          object.filters.push(filter);
        }
      }

      object.applyFilters();
    }
  });
  this.canvas.renderAll();
}


/*public applyBNW1FilterToCanvasImage(object: any) {
  // @ts-ignore
  const filter = new fabric.Image.filters.BlackWhite();
  object.filters.push(filter);
  object.applyFilters();
}
public applyBNW2FilterToCanvasImage(object: any) {
  const filter = new fabric.Image.filters.Grayscale();
  object.filters.push(filter);
  object.applyFilters();
}
public applyBNW3FilterToCanvasImage(object: any) {
  const filter = new fabric.Image.filters.Contrast({ contrast: -0.1});
  object.filters.push(filter);
  object.applyFilters();
}*/


public applyGrayscaleFilterToCanvasImage(object: any) {
  const filter = new fabric.Image.filters.Grayscale();
  object.filters.push(filter);
  object.applyFilters();
}

public cloneCanvasImage(object: any) {
  return fabric.util.object.clone(object);
}

public applyInvertFilterToCanvasImage(object: any) {
  const filter = new fabric.Image.filters.Invert();
  object.filters.push(filter);
  object.applyFilters();
}

public applyBlurFilterToCanvasImage(object: any) {
  const filter = new fabric.Image.filters.Blur({
    blur: 0.1
  });
  object.filters.push(filter);
  object.applyFilters();
}


public applyPencilFilter() {
  this.canvas.getObjects().forEach((object) => {
    if (object instanceof fabric.Image) {
      this.applyGrayscaleFilterToCanvasImage(object);

      const clonedObject = this.cloneCanvasImage(object);
      //this.applyGrayscaleFilterToCanvasImage(clonedObject);
      this.applyInvertFilterToCanvasImage(clonedObject);
      this.applyBlurFilterToCanvasImage(clonedObject);

      object.filters!.push(new fabric.Image.filters.BlendImage({
        image: clonedObject,
        mode: 'multiply', 
        alpha: 0.5
      }));

      //this.applyGrayscaleFilterToCanvasImage(object);
      //this.applyInvertFilterToCanvasImage(object);
      object.applyFilters();
      this.canvas.add(object);
    }
  });

  this.canvas.renderAll();
}





  

  public setRGBAMatrix(matrix: PixelMatrix): void {
    let processedMatrix: PixelMatrix = this.processConvertWhiteToAlpha(matrix);
    let dataurl = this.pixelMatrixToDataURL(processedMatrix);
    this.addImageFromUrl(dataurl);
  }

  getRGBAFromPosition(x: number, y: number): RGBAData {
    let imageData: ImageData = this.canvas.getContext().getImageData(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
    let width: number = imageData.width;
    let data: Uint8ClampedArray = imageData.data;
    let index: number = (y * width + x) * 4;
    return {red: data[index], green: data[index + 1], blue: data[index + 2], alpha: data[index + 3]};
  } 


  /**
   * THIS IS NOT YET IMPLEMENTED
   * DONT USE
   * @param x 
   * @param y 
   * @param rgba 
   */
  setRGBAAtposition(x: number, y: number, rgba: RGBAData): void {
    // TODO
    console.log("setRGBAAtposition not implemented yet!");
  }

  /**
   * 
   * @param x Position x coordinate
   * @param y Position y coordinate
   * @returns the index of the rgba Matrix containing all the Image Data!
   */
  getIndexFromPosition(x: number, y: number) : number | undefined
  {
    let imageData: ImageData = this.canvas.getContext().getImageData(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
    let width: number = imageData.width;
    let index: number = (y * width + x) * 4;
    return index;
  }

  // UNDO REDO RELATED FEATURES
  /**
   * 
   * Puts the last canvas inside the Undo-History as active one, if there is one!
   * It also add's the current Canvas state to the redo-History!
   */
  public undo()
  {
    /* if(this.history.undo_history.length === 0)
    {
      console.log("Nothing to be undone!");
      return;
    }

    var overwriteCanvas = this.history.undo_history.pop();
    let dim = this.history.undo_history_widthHeight.pop();
    let layerObj = this.history.undo_history_layerObjects.pop();
    
    if(this.history.undo_history.length === 0) CanvasManager.greyOutUndoButton();

    if(overwriteCanvas)
    {
      // console.log("overwriteCanvas:", overwriteCanvas);
      let canvasCopy = fabric.util.object.clone(overwriteCanvas);

      if(this.history.redo_history.length === 0) CanvasManager.activateRedoButton();
      this.history.addToRedo(this);

      this.canvas.loadFromJSON(canvasCopy, function()
      {});
    } 
    if(dim)
    {
      this.canvas.setWidth(dim[0]);
      this.canvas.setHeight(dim[1]);
    }  
    if(layerObj)
    {
      this.layerManager.objects = layerObj;
    }
    else console.log("Something is not correct with the layer in the undo history!");

    this.canvas.renderAll(); */
  }


  /**
   * 
   * Put's the last canvas from the Redo-History as new active Canvas, when there is one!
   */
  public redo()
  {
    /* if(this.history.redo_history.length === 0)
    {
      console.log("Nothing to be redone!");
      return;
    }
    var overwriteCanvas = this.history.redo_history.pop();
    let layerObj = this.history.redo_history_layerObjects.pop();
    let dim = this.history.redo_history_widthHeight.pop();

    if(this.history.redo_history.length === 0) CanvasManager.greyOutRedoButton();
    if(overwriteCanvas)
    {
      // console.log("overwriteCanvas:", overwriteCanvas);
      let canvasCopy = fabric.util.object.clone(overwriteCanvas);
      if(this.history.undo_history.length === 0) CanvasManager.activateUndoButton();
      this.history.addToUndo(this, true);
      this.canvas.loadFromJSON(canvasCopy, function()
      {
          // DO NOTHING!
      });   
    } 
    if(dim)
    {
      this.canvas.setWidth(dim[0]);
      this.canvas.setHeight(dim[1]);
    }  
  
    if(layerObj)
    {
      this.layerManager.objects = layerObj;
    }
    else 
    {
      console.log("Redo History: ", this.history.redo_history);
      console.log("Something is not correct with the layer in the redo history!");
    }
    this.canvas.renderAll(); */
  }

  /**
   * Saves the complete current State of the canvas into the history!
   */
  public saveCurrentCanvasToUndo()
  {
    /* if(this.history.undo_history.length === 0) CanvasManager.activateUndoButton();
    // console.log("Call function: saveCurrentCanvasToUndo()");
    this.history.addToUndo(this, false);
    if(this.history.redo_history.length === 0) CanvasManager.greyOutRedoButton(); */
  }

  static greyOutUndoButton()
  {
    // console.log("greyOut UNDO Button!");
    let bt = document.getElementById("undoButton");
    // console.log("greyOutUndoButton: ", bt);
    if (bt == null) return;
    // deactivate the undo button it is a bootstrap button
    (bt as HTMLButtonElement).classList.remove('active');
    bt.classList.add('disabled');
  }

  static greyOutRedoButton()
  {
    // HACK: We should do it with react states
    // console.log("greyOut Redo Button!");
    let bt = document.getElementById("redoButton");
    if (bt == null) return;
    (bt as HTMLButtonElement).classList.remove('active');
    (bt as HTMLButtonElement).classList.add('disabled');
  }

  /**
   * 
   * Activates the HTML Undo Button Element
   * This does NOT undo anything inside the canvas
   */
  static activateUndoButton()
  {
    /* // console.log("activate UNDO Button!");
    let bt = document.getElementById("undoButton");
    if (bt == null) return;
    (bt as HTMLButtonElement).classList.remove('disabled');
    (bt as HTMLButtonElement).classList.add('active'); */
  }
  /**
   * 
   * Activates the HTML Redo Button Element
   * This does NOT redo anything inside the canvas
   */
  static activateRedoButton()
  {
    /* let bt = document.getElementById("redoButton"); */
    /* if (bt == null) return; */
    /* (bt as HTMLButtonElement).classList.remove('disabled'); */
    /* (bt as HTMLButtonElement).classList.add('active'); */
  }

  // getters and setters
  public setBrushWidth(width: number) {
    this.canvas.freeDrawingBrush.width = width;
  }

  public getBrushWidth(): number {
    return this.canvas.freeDrawingBrush.width;
  }

  public setBrushColor(color: string) {
    this.canvas.freeDrawingBrush.color = color;
  }

  public getBrushColor(): string {
    return this.canvas.freeDrawingBrush.color;
  }

  /**
   * Sets the backgroundColor of the Canvas!
   * @param color color as descriptor (e.g. 'red') or 'rgba(...)'
   */
  public setBackgroundColor(color: string) {
    this.canvas.setBackgroundColor(color, this.canvas.renderAll.bind(this.canvas));
    this.backgroundColor = color;
  };

  /**
   * 
   * @returns the current Backgroundcolor as String according to the fabric standard
   */
  public getBackgroundColor(): string {
    return this.backgroundColor;
  }

  // Cropping Related Features

  /**
   * 
   * @returns initial Borders, which are not yet added to the canvas 
   * @attention only add to Canvas when calling the crop functionality, so that there are not problems with the layer functionality
   */
    private createBorders() :  [fabric.Rect,fabric.Rect,fabric.Rect,fabric.Rect]
    {
    let ret :  [fabric.Rect,fabric.Rect,fabric.Rect,fabric.Rect]= [
      new fabric.Rect({
        originX: "left",
        originY: "top"}),
      new fabric.Rect({
        originX: "right",
        originY: "top"}),
      new fabric.Rect({
        originX: "right",
        originY: "bottom"}),
      new fabric.Rect({
        originX: "left",
        originY: "bottom"}),
    ];

    for(let i = 0; i < 4; i++)
    {
      ret[i].set('excludeFromExport', true);
      ret[i].set('centeredRotation', false);
      ret[i].set('centeredScaling', false);
      ret[i].set('hasControls', false);
      ret[i].set('evented', false);
      ret[i].set('visible', true);
      ret[i].set('width', 10);
      ret[i].set('height', 10);
      ret[i].set('fill', 'rgba(0.2,0.2,0.2,0.1)');
      ret[i].set('dirty', true);
      ret[i].set('strokeWidth', 0);
      ret[i].set('hasBorders', false);
    }
    return ret;
  }

  /**
   * 
   * @returns new created cropping Circles for placing on the borders
   * @attention only add to canvas, when actually using the crop functionality!
   */
  private createCroppingCircles() : [fabric.Circle,fabric.Circle,fabric.Circle,fabric.Circle,fabric.Circle,fabric.Circle,fabric.Circle,fabric.Circle] {
    let ret : [fabric.Circle,fabric.Circle,fabric.Circle,fabric.Circle,fabric.Circle,fabric.Circle,fabric.Circle,fabric.Circle] 
    = [
      new fabric.Circle({
        originX: "left",
        originY: "top",
      }),
      new fabric.Circle({
        lockMovementX: true,
        originX: "center",
        originY: "top",
      }),
      new fabric.Circle({
        originX: "right",
        originY: "top",
      }),
      new fabric.Circle({
        lockMovementY: true,
        originX: "right",
        originY: "center",
      }),
      new fabric.Circle({
        originX: "right",
        originY: "bottom",
      }),
      new fabric.Circle({
        lockMovementX: true,
        originX: "center",
        originY: "bottom",
      }),
      new fabric.Circle({
        originX: "left",
        originY: "bottom",
      }),
      new fabric.Circle({
        lockMovementY: true,
        originX: "left",
        originY: "center",
      }),
    ];

    for(let i = 0; i < 8; i++)
    {
      ret[i].set('fill', 'black');
      ret[i].set('radius', 2);
      ret[i].set('hasControls', false);
      ret[i].set('selectable', true);
      ret[i].set('hasBorders', false);
      ret[i].set('excludeFromExport', true);
    }

    return ret;
  }

  /**
   * Removes the Cropping Elements from the canvas.
   * @attention call this function, when exiting the Cropping Functionality, or whenever you don't need the elements anymore, after adding them!
   */
  clearCroppingElementsFromCanvas()
  {
    if(this.canvas)
    {
      for(let i = 0; i < 8; i++)
      {
        this.canvas.remove(this.croppingCircles[i]);
      }
      for(let i = 0; i < 4; i++)
      {
        this.canvas.remove(this.croppingBorders[i]);
      }
      this.b_cropping_mustAddBordersToCanvas = true;
    }

  }

  removeObjectWithContentAwareFill() {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) {
      console.log("Kein Objekt ausgewählt");
      return;
    }

    // Berechnen der umgebenden Bereichsgröße
    const boundingRect = activeObject.getBoundingRect();
    const ctx = this.canvas.getContext();
    if (!ctx) {
      console.log("Canvas Context ist undefined");
      return;
    }

    const fillColor = fillWithAverageColor(ctx, boundingRect.left, boundingRect.top, boundingRect.width, boundingRect.height);
    ctx.fillStyle = fillColor;
    ctx.fillRect(boundingRect.left, boundingRect.top, boundingRect.width, boundingRect.height);

    // Entfernen des ausgewählten Objekts
    this.canvas.remove(activeObject);
    this.canvas.renderAll();
  }

  rotate() {
    this.basicFunctions.rotate();
  }

  mirrorX() {
    this.basicFunctions.mirrorX();
  }

  mirrorY() {
    this.basicFunctions.mirrorY();
  }

  addUserText() {
    this.basicFunctions.addUserText();
  }
}

function fillWithAverageColor(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): string {
  const surroundingImageData = ctx.getImageData(x - 1, y - 1, width + 2, height + 2);
  const data = surroundingImageData.data;
  let r = 0, g = 0, b = 0, count = 0;

  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);

  return `rgb(${r}, ${g}, ${b})`;
}

export { Tools };
export default CanvasManager;
