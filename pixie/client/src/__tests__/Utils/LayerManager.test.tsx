import { CanvasObject } from "../../Utils/CanvasObject";
import { DEFAULT_LAYER_Z_INDEX, DEFAULT_LAYER_Z_INDEX_INCREMENT } from "../../Utils/Constants";
import { LayerManager } from "../../Utils/LayerManager";
import { fabric } from 'fabric';
import CanvasManager from "../../Utils/CanvasManager";


class FabricCanvasMock extends fabric.Canvas {
  constructor() {
    super("canvas");
  }
}

class FabricObjectMock extends fabric.Object {
  
}

describe('LayerManager', () => {
  test('LayerManager: objects gets added to active Layers', () => {

    let canvasManager: CanvasManager = new CanvasManager();
    let canvas = canvasManager.getFabricCanvas();
    let layerManager: LayerManager = new LayerManager(canvasManager);
    let fabricObjectMock: fabric.Object = new FabricObjectMock();
    let canvasObjectMock: CanvasObject = new CanvasObject(canvas, fabricObjectMock, layerManager);
    layerManager.addObject(new CanvasObject(canvas, fabricObjectMock, layerManager));

    let expectedLayers: number[] = [0];
    layerManager.setActiveLayers([0]);
    canvasObjectMock = new CanvasObject(canvas, fabricObjectMock, layerManager);
    expect(canvasObjectMock.getLayers()).toEqual(expectedLayers);

    expectedLayers = [1];
    layerManager.setActiveLayers(expectedLayers)
    canvasObjectMock = new CanvasObject(canvas, fabricObjectMock, layerManager);
    expect(canvasObjectMock.getLayers()).toEqual(expectedLayers);
    
    expectedLayers = [0, 3, 6, 9];
    layerManager.setActiveLayers(expectedLayers);
    canvasObjectMock = new CanvasObject(canvas, fabricObjectMock, layerManager);
    expect(canvasObjectMock.getLayers()).toEqual(expectedLayers);
  });

  test('LayerManager: Objects set correctly', () => {
    let canvasManager: CanvasManager = new CanvasManager();
    let canvas = canvasManager.getFabricCanvas();
    let layerManager: LayerManager = new LayerManager(canvasManager);
    let fabricObjectMock: fabric.Object = new FabricObjectMock();
    let canvasObjectMock: CanvasObject = new CanvasObject(canvas, fabricObjectMock, layerManager);
    layerManager.addObject(canvasObjectMock)

    let expectedZIndex: number = 0;
    layerManager.setActiveLayers([0])
    canvasObjectMock = new CanvasObject(canvas, fabricObjectMock, layerManager);
    layerManager.addObject(canvasObjectMock)
    expect(canvasObjectMock.zIndex).toEqual(expectedZIndex);

    expectedZIndex = 1;
    layerManager.setActiveLayers([1])
    canvasObjectMock = new CanvasObject(canvas, fabricObjectMock, layerManager);
    layerManager.addObject(canvasObjectMock)
    console.log("layerManager: ", layerManager.getActiveLayers()[0].getZ())
    expect(canvasObjectMock.zIndex).toEqual(expectedZIndex);
    
    expectedZIndex = 4;
    layerManager.setActiveLayers([0, 3, 6, 9])
    canvasObjectMock = new CanvasObject(canvas, fabricObjectMock, layerManager);
    layerManager.addObject(canvasObjectMock)
    expect(canvasObjectMock.zIndex).toEqual(expectedZIndex);

    expectedZIndex = 5;
    layerManager.setActiveLayers([0, 3, 4])
    canvasObjectMock = new CanvasObject(canvas, fabricObjectMock, layerManager);
    layerManager.addObject(canvasObjectMock)
    expect(canvasObjectMock.zIndex).toEqual(expectedZIndex);
  });

  test('LayerManager: Layer z-index gets set correctly', () => {
    let canvasManager: CanvasManager = new CanvasManager();
    let canvas = canvasManager.getFabricCanvas();
    let layerManager: LayerManager = new LayerManager(canvasManager);
    let fabricObjectMock: fabric.Object = new FabricObjectMock();
    let canvasObjectMock: CanvasObject = new CanvasObject(canvas, fabricObjectMock, layerManager);
    layerManager.addObject(canvasObjectMock)

    let expectedZIndex: number = DEFAULT_LAYER_Z_INDEX;
    layerManager.setActiveLayers([0])
    canvasObjectMock = new CanvasObject(canvas, fabricObjectMock, layerManager);
    expect(layerManager.getActiveLayers()[0].getZ()).toEqual(expectedZIndex);

    expectedZIndex = DEFAULT_LAYER_Z_INDEX + DEFAULT_LAYER_Z_INDEX_INCREMENT;
    layerManager.setActiveLayers([1])
    canvasObjectMock = new CanvasObject(canvas, fabricObjectMock, layerManager);
    expect(layerManager.getActiveLayers()[0].getZ()).toEqual(expectedZIndex);
    
    expectedZIndex = DEFAULT_LAYER_Z_INDEX + 3*DEFAULT_LAYER_Z_INDEX_INCREMENT;
    layerManager.setActiveLayers([0, 3, 9])
    canvasObjectMock = new CanvasObject(canvas, fabricObjectMock, layerManager);
    expect(layerManager.getActiveLayers()[2].getZ()).toEqual(expectedZIndex);

    expectedZIndex = DEFAULT_LAYER_Z_INDEX + 4*DEFAULT_LAYER_Z_INDEX_INCREMENT;
    layerManager.setActiveLayers([0, 3, 4])
    canvasObjectMock = new CanvasObject(canvas, fabricObjectMock, layerManager);
    expect(layerManager.getActiveLayers()[2].getZ()).toEqual(expectedZIndex);
  });

  test('layerManager has complete functionality', () => {
    let canvasManager: CanvasManager = new CanvasManager();
    let canvas = canvasManager.getFabricCanvas();
    let layerManager: LayerManager = new LayerManager(canvasManager);
    
    let expectedLayers: number[] = [];
    expect(layerManager.getActiveLayerIds()).toEqual(expectedLayers);

    expectedLayers = [2];
    layerManager.setActiveLayer(2);
    expect(layerManager.getActiveLayerIds()).toEqual(expectedLayers);

    expectedLayers = [1, 3, 4]
    layerManager.setActiveLayers(expectedLayers);
    expect(layerManager.getActiveLayerIds()).toEqual(expectedLayers);

    layerManager.removeActiveLayer(2);
    expect(layerManager.getActiveLayerIds()).toEqual(expectedLayers);

    layerManager.removeActiveLayer(3);
    expectedLayers = [1, 4]
    expect(layerManager.getActiveLayerIds()).toEqual(expectedLayers);

    layerManager.removeActiveLayer(1);
    layerManager.removeActiveLayer(4);
    expectedLayers = []
    expect(layerManager.getActiveLayerIds()).toEqual(expectedLayers);

    layerManager.addActiveLayer(1);
    layerManager.addActiveLayer(2);
    layerManager.addActiveLayer(3);
    expectedLayers = [1, 2, 3]
    expect(layerManager.getActiveLayerIds()).toEqual(expectedLayers);

    layerManager.setActiveLayers([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expectedLayers = [1, 4, 5, 6, 10];
    layerManager.removeActiveLayer(2);
    layerManager.removeActiveLayer(3);
    layerManager.removeActiveLayer(7);
    layerManager.removeActiveLayer(8);
    layerManager.removeActiveLayer(9);
    layerManager.addActiveLayer(10);
    expect(layerManager.getActiveLayerIds()).toEqual(expectedLayers);
  });
});