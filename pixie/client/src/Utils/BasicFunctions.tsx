import { CanvasManager } from './CanvasManager';
import { fabric } from 'fabric';

class BasicFunctions {
  private canvas: CanvasManager;
  private isDrawingRectangle: boolean = false;
  private isDrawingCircle: boolean = false;
  private isDrawingEllipse: boolean = false;
  private isDrawingLine: boolean = false;
  private isDrawingTriangle: boolean = false;
  constructor(canvas: CanvasManager) {
    this.canvas = canvas;
  }

  public mirrorY() {  
    this.canvas.saveCurrentCanvasToUndo();
    var currCanvas = this.canvas.getFabricCanvas();
    var objects = currCanvas.getObjects();

    if (objects.length === 1 && objects[0] instanceof fabric.Image) {
      // Canvas is "collapsed", meaning that other functions (e.g. content aware scale) caused it to have no more selectable objects
      let img = objects[0];
      if(currCanvas.width !== undefined && img.width !== undefined && img.left !== undefined && img.scaleX !== undefined) {
        img.set({ flipX: !img.flipX });
        img.set({ left: currCanvas.width - (img.width * img.scaleX + img.left) });
      }
      else {
        console.log("Error: Canvas width, image width, image left or image scaleX is undefined");
      }
    } else {
      // Canvas is not collapsed
      objects.forEach(function(object) {
        let toFlip = object;
        var canvasWidth = currCanvas.width;

        //Update coords: If an objects coords (left,top) is (50,50) with width of 50 with 
        // a canvas size of 500x500 then after flip coords are (400,50)
        if(toFlip.width !== undefined && toFlip.left !== undefined && canvasWidth !== undefined && toFlip.scaleX !== undefined) {
          toFlip.left = canvasWidth - (toFlip.width * toFlip.scaleX + toFlip.left);
          toFlip.flipX = !toFlip.flipX;
        }    
      });
    }

    currCanvas.renderAll();
  }


  public mirrorX() {
    this.canvas.saveCurrentCanvasToUndo();
    var currCanvas = this.canvas.getFabricCanvas();
    var objects = currCanvas.getObjects();

    if (objects.length === 1 && objects[0] instanceof fabric.Image) {
      let img = objects[0];
      if(currCanvas.height !== undefined && img.height !== undefined && img.top !== undefined && img.scaleY !== undefined) {
        img.set({ flipY: !img.flipY });
        img.set({ top: currCanvas.height - (img.height * img.scaleY + img.top) });
      }
      else {
        console.log("Error: Canvas height, image height, image top or image scaleY is undefined");
      }
    }
    else {
      objects.forEach(function(object) {
        let toFlip = object;
        var canvasHeight = currCanvas.height;

        //Update coords: If an objects coords (left,top) is (50,50) with width of 50 with
        // a canvas size of 500x500 then after flip coords are (50,400)
        if(toFlip.height !== undefined && toFlip.top !== undefined && canvasHeight !== undefined && toFlip.scaleY !== undefined) {
          toFlip.top = canvasHeight - (toFlip.height * toFlip.scaleY + toFlip.top);
          toFlip.flipY = !toFlip.flipY;
        }
      });
    }

    currCanvas.renderAll();

  }

  public addTextToCanvas(text: string) {
    this.canvas.saveCurrentCanvasToUndo();
    this.canvas.getFabricCanvas().selection = true;
    // Add user-specified text to the canvas
    const newText = text || 'No Text put in'; // Use a default text if user input is empty
    const textObject = new fabric.Textbox(newText, {
      left: 50, // Adjust the left position as needed
      top: 50, // Adjust the top position as needed
      fontSize: 20,
      width: 150,
      fill: 'black',
      selectable: true,
    });

    this.canvas.getFabricCanvas().add(textObject);
    textObject.bringToFront();
  }

  // Example of how to use addTextToCanvas in a separate function
  public addUserText() {
    const userText = prompt('Enter your text:');
    if(userText != null && userText != ''){
      this.addTextToCanvas(userText);
    }
  }

public stift(canvas: CanvasManager) {
  var currCanvas = canvas.getFabricCanvas();
  currCanvas.isDrawingMode = true;

}

public  pencil(canvas: CanvasManager) {
  var currCanvas = canvas.getFabricCanvas();
  currCanvas.isDrawingMode = true;


  canvas.setBrushWidth(3); 
  canvas.setBrushColor("blue"); 

}

public rotate() {
  this.canvas.saveCurrentCanvasToUndo();
  var currCanvas = this.canvas.getFabricCanvas();

    if (!currCanvas) {
      return;
    }

    const centerX = currCanvas.width ? currCanvas.width / 2 : 0;
    const centerY = currCanvas.height ? currCanvas.height / 2 : 0;

    currCanvas.forEachObject(function (obj: any) {
      const deltaX = obj?.left !== undefined ? obj.left - centerX : 0;
      const deltaY = obj?.top !== undefined ? obj.top - centerY : 0;

      const angle = Math.atan2(deltaY, deltaX);

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const newAngle = angle + Math.PI / 2; 
      const newX = centerX + distance * Math.cos(newAngle);
      const newY = centerY + distance * Math.sin(newAngle);

      obj.set({
        left: newX,
        top: newY,
        angle: (obj.angle || 0) + 90, 
      });
    });


    currCanvas.renderAll();
  }

  public rotateByAnyAmount(degrees: number) {
    this.canvas.saveCurrentCanvasToUndo();
    var currCanvas = this.canvas.getFabricCanvas();
  
    if (!currCanvas) {
      return;
    }
  
    const centerX = currCanvas.width ? currCanvas.width / 2 : 0;
    const centerY = currCanvas.height ? currCanvas.height / 2 : 0;
  
    const radians = degrees * (Math.PI / 180);
  
    currCanvas.forEachObject(function (obj: any) {
      const deltaX = obj?.left !== undefined ? obj.left - centerX : 0;
      const deltaY = obj?.top !== undefined ? obj.top - centerY : 0;
  
      const angle = Math.atan2(deltaY, deltaX);
  
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const newAngle = angle + radians; 
      const newX = centerX + distance * Math.cos(newAngle);
      const newY = centerY + distance * Math.sin(newAngle);
  
      obj.set({
        left: newX,
        top: newY,
        angle: (obj.angle || 0) + degrees,
      });
    });
  
    currCanvas.renderAll();
  }
  
  /*
  rect = new fabric.Rect({
    left: originX,
    top: originY,
    originX: 'left',
    originY: 'top',
    width: pointer.x - originX,
    height: pointer.y - originY,
    fill: 'rgba(255,0,0,0.5)',
    transparentCorners: false
  });
  */
  public activateShapeDrawing(shape: string, color: string, opacity: number, borderColor: string, borderThickness: number) {
    this.disableAllShapeDrawing();
  
    switch (shape) {
      case 'rectangle':
        this.enableRectangleDrawing(color, opacity, borderColor, borderThickness);
        break;
      case 'circle':
        this.enableCircleDrawing(color, opacity, borderColor, borderThickness);
        break;
      case 'ellipse':
        this.enableEllipseDrawing(color, opacity, borderColor, borderThickness);
        break;
      case 'line':
        this.enableLineDrawing(color, opacity, borderColor, borderThickness);
        break;
      case 'triangle':
        this.enableTriangleDrawing(color, opacity, borderColor, borderThickness);
        break;
    }
  }

  public disableAllShapeDrawing() {
    this.isDrawingRectangle = false;
    this.isDrawingCircle = false;
    this.isDrawingEllipse = false;
    this.isDrawingLine = false;
    this.isDrawingTriangle = false;

    const canvas = this.canvas.getFabricCanvas();
    //canvas.off('mouse:down', this.onRectangleMouseDown);
    canvas.off('mouse:down');
    canvas.off('mouse:move', this.onRectangleMouseMove);
    canvas.off('mouse:up', this.onRectangleMouseUp);

    //canvas.off('mouse:down', this.onCircleMouseDown);
    canvas.off('mouse:down');
    canvas.off('mouse:move', this.onCircleMouseMove);
    canvas.off('mouse:up', this.onCircleMouseUp);

    //canvas.off('mouse:down', this.onEllipseMouseDown);
    canvas.off('mouse:down');
    canvas.off('mouse:move', this.onEllipseMouseMove);
    canvas.off('mouse:up', this.onEllipseMouseUp);

    //canvas.off('mouse:down', this.onLineMouseDown);
    canvas.off('mouse:down');
    canvas.off('mouse:move', this.onLineMouseMove);
    canvas.off('mouse:up', this.onLineMouseUp);

    //canvas.off('mouse:down', this.onTriangleMouseDown);
    canvas.off('mouse:down');
    canvas.off('mouse:move', this.onTriangleMouseMove);
    canvas.off('mouse:up', this.onTriangleMouseUp);
  }

  public enableRectangleDrawing(color: string, opacity: number, borderColor: string, borderThickness: number) {
    this.isDrawingRectangle = true;
    const currCanvas = this.canvas.getFabricCanvas();
    console.log("rectangle drawing enabled");

    currCanvas.on('mouse:down', (o) => this.onRectangleMouseDown(o, color, opacity, borderColor, borderThickness));
    currCanvas.on('mouse:move', this.onRectangleMouseMove);
    currCanvas.on('mouse:up', this.onRectangleMouseUp);
  }

  private onRectangleMouseDown(o: fabric.IEvent, color: string, opacity: number, borderColor: string, borderThickness: number) {
    if (!this.isDrawingRectangle) return;
    console.log("rectangle mouse down event");

    const currCanvas = this.canvas.getFabricCanvas();
    const pointer = currCanvas.getPointer(o.e);
    //const originX = pointer.x;
    //const originY = pointer.y;
    console.log(`Mouse Down - x: ${pointer.x}, y: ${pointer.y}`);

    const rect = new fabric.Rect({
      //left: originX,
      //top: originY,
      left: pointer.x,
      top: pointer.y,
      originX: 'left',
      originY: 'top',
      //width: pointer.x - originX,
      //height: pointer.y - originY,
      width: 1,
      height: 1,
      angle: 0,
      fill: color,
      opacity: opacity,
      stroke: borderColor,
      strokeWidth: borderThickness,
      transparentCorners: false,
    });

    currCanvas.add(rect);
    currCanvas.setActiveObject(rect);
  }

  private onRectangleMouseMove(o: fabric.IEvent) {
    if (!this.isDrawingRectangle) return;
  
    const currCanvas = this.canvas.getFabricCanvas();
    const pointer = currCanvas.getPointer(o.e);
    const activeObject = currCanvas.getActiveObject() as fabric.Rect;
  
    if (!activeObject || !(activeObject instanceof fabric.Rect)) return;
  
    const activeLeft = activeObject.left || 0;
    const activeTop = activeObject.top || 0;
  
    activeObject.set({
      left: Math.min(pointer.x, activeLeft),
      top: Math.min(pointer.y, activeTop),
      width: Math.abs(activeLeft - pointer.x),
      height: Math.abs(activeTop - pointer.y),
    });
  
    currCanvas.renderAll();
  }
  

  private onRectangleMouseUp() {
    if (!this.isDrawingRectangle) return;
    this.isDrawingRectangle = false;
  }
  
  public enableCircleDrawing(color: string, opacity: number, borderColor: string, borderThickness: number) {
    this.isDrawingCircle = true;
    const currCanvas = this.canvas.getFabricCanvas();

    currCanvas.on('mouse:down', (o) => this.onCircleMouseDown(o, color, opacity, borderColor, borderThickness));
    currCanvas.on('mouse:move', this.onCircleMouseMove.bind(this));
    currCanvas.on('mouse:up', this.onCircleMouseUp.bind(this));
  }

  private onCircleMouseDown(o: fabric.IEvent, color: string, opacity: number, borderColor: string, borderThickness: number) {
    if (!this.isDrawingCircle) return;

    const pointer = this.canvas.getFabricCanvas().getPointer(o.e);
    const originX = pointer.x;
    const originY = pointer.y;

    const circle = new fabric.Circle({
      left: originX,
      top: originY,
      originX: 'center',
      originY: 'center',
      radius: 1, 
      fill: color,
      opacity: opacity,
      stroke: borderColor,
      strokeWidth: borderThickness,
      transparentCorners: false
    });

    this.canvas.getFabricCanvas().add(circle);
    this.canvas.getFabricCanvas().setActiveObject(circle);
  }

  private onCircleMouseMove(o: fabric.IEvent) {
    if (!this.isDrawingCircle) return;
  
    const canvas = this.canvas.getFabricCanvas();
    const pointer = canvas.getPointer(o.e);
    const activeObject = canvas.getActiveObject();
  
    if (activeObject && activeObject instanceof fabric.Circle) {
      const activeLeft = activeObject.left || 0;
      const activeTop = activeObject.top || 0;
  
      const radius = Math.sqrt(Math.pow(activeLeft - pointer.x, 2) + Math.pow(activeTop - pointer.y, 2));
      activeObject.set({ radius: radius }).setCoords();
      canvas.renderAll();
    }
  }
  

  private onCircleMouseUp() {
    if (!this.isDrawingCircle) return;

    this.isDrawingCircle = false;
    const canvas = this.canvas.getFabricCanvas();
    const activeObject = canvas.getActiveObject();

    //if (activeObject && activeObject instanceof fabric.Circle) {
    //}

    //canvas.off('mouse:down', this.onCircleMouseDown);
    canvas.off('mouse:down');
    canvas.off('mouse:move', this.onCircleMouseMove);
    canvas.off('mouse:up', this.onCircleMouseUp);
  }
   
  public enableEllipseDrawing(color: string, opacity: number, borderColor: string, borderThickness: number) {
    this.isDrawingEllipse = true;
    const currCanvas = this.canvas.getFabricCanvas();

    currCanvas.on('mouse:down', (o) => this.onEllipseMouseDown(o, color, opacity, borderColor, borderThickness));
    currCanvas.on('mouse:move', this.onEllipseMouseMove.bind(this));
    currCanvas.on('mouse:up', this.onEllipseMouseUp.bind(this));
  }

  private onEllipseMouseDown(o: fabric.IEvent, color: string, opacity: number, borderColor: string, borderThickness: number) {
    if (!this.isDrawingEllipse) return;

    const pointer = this.canvas.getFabricCanvas().getPointer(o.e);
    const originX = pointer.x;
    const originY = pointer.y;

    const ellipse = new fabric.Ellipse({
      left: originX,
      top: originY,
      originX: 'left',
      originY: 'top',
      rx: 1, 
      ry: 1, 
      fill: color,
      opacity: opacity,
      stroke: borderColor,
      strokeWidth: borderThickness,
      transparentCorners: false
    });

    this.canvas.getFabricCanvas().add(ellipse);
    this.canvas.getFabricCanvas().setActiveObject(ellipse);
  }

  private onEllipseMouseMove(o: fabric.IEvent) {
    if (!this.isDrawingEllipse) return;
  
    const canvas = this.canvas.getFabricCanvas();
    const pointer = canvas.getPointer(o.e);
    const activeObject = canvas.getActiveObject();
  
    if (activeObject && activeObject instanceof fabric.Ellipse) {
      const activeLeft = activeObject.left || 0;
      const activeTop = activeObject.top || 0;
  
      const rx = Math.abs(pointer.x - activeLeft) / 2;
      const ry = Math.abs(pointer.y - activeTop) / 2;
  
      activeObject.set({ rx: rx, ry: ry }).setCoords();
      canvas.renderAll();
    }
  }
  

  private onEllipseMouseUp() {
    if (!this.isDrawingEllipse) return;

    this.isDrawingEllipse = false;
    const canvas = this.canvas.getFabricCanvas();
    const activeObject = canvas.getActiveObject();

    //if (activeObject && activeObject instanceof fabric.Ellipse) {
    //}

    //canvas.off('mouse:down', this.onEllipseMouseDown);
    canvas.off('mouse:down');
    canvas.off('mouse:move', this.onEllipseMouseMove);
    canvas.off('mouse:up', this.onEllipseMouseUp);
  }

  public enableLineDrawing(color: string, opacity: number, borderColor: string, borderThickness: number) {
    this.isDrawingLine = true;
    const currCanvas = this.canvas.getFabricCanvas();

    currCanvas.on('mouse:down', (o) => this.onLineMouseDown(o, color, opacity, borderColor, borderThickness));
    currCanvas.on('mouse:move', this.onLineMouseMove.bind(this));
    currCanvas.on('mouse:up', this.onLineMouseUp.bind(this));
  }

  private onLineMouseDown(o: fabric.IEvent, color: string, opacity: number, borderColor: string, borderThickness: number) {
    if (!this.isDrawingLine) return;

    const pointer = this.canvas.getFabricCanvas().getPointer(o.e);
    const originX = pointer.x;
    const originY = pointer.y;

    const line = new fabric.Line([originX, originY, originX, originY], {
      stroke: color,
      opacity: opacity,
      strokeWidth: borderThickness,
      selectable: true,
      hasControls: true,
      hasBorders: true
    });

    this.canvas.getFabricCanvas().add(line);
    this.canvas.getFabricCanvas().setActiveObject(line);
  }

  private onLineMouseMove(o: fabric.IEvent) {
    if (!this.isDrawingLine) return;

    const canvas = this.canvas.getFabricCanvas();
    const pointer = canvas.getPointer(o.e);
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject instanceof fabric.Line) {
      activeObject.set({ x2: pointer.x, y2: pointer.y }).setCoords();
      canvas.renderAll();
    }
  }

  private onLineMouseUp() {
    if (!this.isDrawingLine) return;

    this.isDrawingLine = false;
    const canvas = this.canvas.getFabricCanvas();
    const activeObject = canvas.getActiveObject();

    //if (activeObject && activeObject instanceof fabric.Line) {
    //}

    //canvas.off('mouse:down', this.onLineMouseDown);
    canvas.off('mouse:down');
    canvas.off('mouse:move', this.onLineMouseMove);
    canvas.off('mouse:up', this.onLineMouseUp);
  }
  
  public enableTriangleDrawing(color: string, opacity: number, borderColor: string, borderThickness: number) {
    this.isDrawingTriangle = true;
    const currCanvas = this.canvas.getFabricCanvas();

    currCanvas.on('mouse:down', (o) => this.onTriangleMouseDown(o, color, opacity, borderColor, borderThickness));
    currCanvas.on('mouse:move', this.onTriangleMouseMove.bind(this));
    currCanvas.on('mouse:up', this.onTriangleMouseUp.bind(this));
  }

  private onTriangleMouseDown(o: fabric.IEvent, color: string, opacity: number, borderColor: string, borderThickness: number) {
    if (!this.isDrawingTriangle) return;

    const pointer = this.canvas.getFabricCanvas().getPointer(o.e);
    const originX = pointer.x;
    const originY = pointer.y;

    const triangle = new fabric.Triangle({
      left: originX,
      top: originY,
      width: 0,
      height: 0,
      fill: color,
      opacity: opacity,
      stroke: borderColor,
      strokeWidth: borderThickness,
      selectable: true,
      hasControls: true,
      hasBorders: true
    });

    this.canvas.getFabricCanvas().add(triangle);
    this.canvas.getFabricCanvas().setActiveObject(triangle);
  }

  private onTriangleMouseMove(o: fabric.IEvent) {
    if (!this.isDrawingTriangle) return;
  
    const canvas = this.canvas.getFabricCanvas();
    const pointer = canvas.getPointer(o.e);
    const activeObject = canvas.getActiveObject();
  
    if (activeObject && activeObject instanceof fabric.Triangle) {
      const activeLeft = activeObject.left || 0;
      const activeTop = activeObject.top || 0;
  
      const width = Math.abs(pointer.x - activeLeft);
      const height = Math.abs(pointer.y - activeTop);
      activeObject.set({ width: width, height: height }).setCoords();
      canvas.renderAll();
    }
  }
  

  private onTriangleMouseUp() {
    if (!this.isDrawingTriangle) return;

    this.isDrawingTriangle = false;
    const canvas = this.canvas.getFabricCanvas();
    const activeObject = canvas.getActiveObject();

    //if (activeObject && activeObject instanceof fabric.Triangle) {
    //}

    //canvas.off('mouse:down', this.onTriangleMouseDown);
    canvas.off('mouse:down');
    canvas.off('mouse:move', this.onTriangleMouseMove);
    canvas.off('mouse:up', this.onTriangleMouseUp);
  }
  
}





export { BasicFunctions };