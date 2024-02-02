import { CanvasObject } from "../../Utils/CanvasObject";
import { fabric } from 'fabric';
import { LayerManager } from "../../Utils/LayerManager";
import CanvasManager from "../../Utils/CanvasManager";

class FabricObjectMock extends fabric.Object {
  zIndex: number = 0;
  public moveTo(index: number): fabric.Object {
    this.zIndex = index;
    return this;
  }
}

describe("CanvasObject", () => {
    test("CanvasObject set z-index changes fabric z-axis", () => {
        let canvasManager: CanvasManager = new CanvasManager();
        let canvas = canvasManager.getFabricCanvas();
        let fabricObjectMock: fabric.Object = new FabricObjectMock();
        let layerManager = new LayerManager(canvasManager);

        let canvasObjectMock: CanvasObject = new CanvasObject(canvas, fabricObjectMock, layerManager);
        canvasObjectMock.setZAxis(5);
        expect(canvasObjectMock.zIndex).toEqual(5);
    });
});