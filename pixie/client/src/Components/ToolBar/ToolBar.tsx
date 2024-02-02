// ToolBar.tsx
import './ToolBar.css'; // Your CSS file for styling
import React, { useEffect, useState, useCallback } from 'react';
import { CanvasManager, Tools } from '../../Utils/CanvasManager';
import { BasicFunctions } from '../../Utils/BasicFunctions';
import { contentAwareScale } from '../../Utils/ContentAwareScale';
import { dynamicContentAware } from '../../Utils/ContentAwareDynamic';
import { createCropInternalStructs, createCropLeftSideHTML } from './__util/crop';
import { SketchPicker } from 'react-color';

interface Position {
  x: number;
  width: number;
}

interface MyMenuProps {
  canvas: CanvasManager;
  leftBarState: string;
}

// TODO: can this be removed?
/** 
 * JUST A PRECAUTION, DONT DELETE, DONT CHANGE
 */
var PREVIOUS_STATE: string = 'default';

const ToolBar: React.FC<MyMenuProps> = ({ canvas, leftBarState }) => {
  const [position, setGeom] = useState<Position>({ x: 0, width: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [brushThickness, setBrushThickness] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000'); 
  const [contentAwareScaleFactor, setContentAwareScaleFactor] = useState(50);

  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [isSharpened, setIsSharpened] = useState(false);

  const [isGrayscale, setIsGrayscale] = useState(false);
  const [isInvert, setIsInvert] = useState(false);
  const [isSepia, setIsSepia] = useState(false);
  const [isBlacknWhite, setIsBlacknWhite] = useState(false);
  const [isBrownie, setIsBrownie] = useState(false);
  const [isVintage, setIsVintage] = useState(false);
  const [isKodachrome, setIsKodachrome] = useState(false);
  const [isTechnicolor, setIsTechnicolor] = useState(false);
  const [isPolaroid, setIsPolaroid] = useState(false);


  const [contrast, setContrast] = useState(0);

  const [color, setColor] = useState("#ffff00"); 
  

  const handleShapeClick = (shapeType: string) => {
    const colorPicker = document.getElementById('colorPicker') as HTMLInputElement | null;
    const opacitySlider = document.getElementById('opacitySlider') as HTMLInputElement | null;

    const borderColorPicker = document.getElementById('borderColorPicker') as HTMLInputElement;
    const borderThicknessSlider = document.getElementById('borderThicknessSlider') as HTMLInputElement;

    if (colorPicker && opacitySlider && borderColorPicker && borderThicknessSlider) {
      const color = colorPicker.value;
      const opacity = parseFloat(opacitySlider.value);
      const borderColor = borderColorPicker.value;
      const borderThickness = parseInt(borderThicknessSlider.value);

      if (canvas && canvas.basicFunctions) {
        canvas.basicFunctions.activateShapeDrawing(shapeType, color, opacity, borderColor, borderThickness);
      }

      /*if (canvas && canvas.basicFunctions) {
        const { basicFunctions } = canvas;

        switch (shapeType) {
          case 'rectangle':
            canvas.basicFunctions.enableRectangleDrawing(color, opacity, borderColor, borderThickness);
            break;
          case 'circle':
            canvas.basicFunctions.enableCircleDrawing(color, opacity, borderColor, borderThickness);
            break;
          case 'ellipse':
            canvas.basicFunctions.enableEllipseDrawing(color, opacity, borderColor, borderThickness);
            break;
          case 'line':
            canvas.basicFunctions.enableLineDrawing(color, opacity, borderColor, borderThickness);
            break;
          case 'triangle':
            canvas.basicFunctions.enableTriangleDrawing(color, opacity, borderColor, borderThickness);
            break;
          default:
            break;
        }
      }*/
    }
  };


  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
    const rgb = hexToRgb(event.target.value);
    if (rgb && canvas) {
      canvas.applyGammaFilterToCanvasImage(rgb);
    }
  };
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
  };

  useEffect(() => {
    if (canvas) {
      const initialRgb = hexToRgb(color);
      if (initialRgb) {
        canvas.applyGammaFilterToCanvasImage(initialRgb);
      }
    }
  }, [canvas, color]);
  

  const handleContrastChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newContrast = parseFloat(event.target.value);
    setContrast(newContrast);
    canvas.applyContrastFilterToCanvasImage(newContrast);
  };

  const handleSharpenChange = () => {
    const newStatus = !isSharpened;
    setIsSharpened(newStatus);
    if (newStatus) {
      canvas.applySharpenFilterToCanvasImage();
    } else {
      canvas.removeSharpenFilterFromCanvasImage();
    }
  };

  /*const handleGrayscaleChange = () => {
    const newStatus = !isGrayscale;
    setIsGrayscale(newStatus);
    if (newStatus) {
      canvas.applyGrayscaleFilterToCanvasImage();
    } else {
      canvas.removeGrayscaleFilterFromCanvasImage();
    }
  };*/

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    var diff = Math.abs(e.clientX - e.currentTarget.getBoundingClientRect().right);
    if (diff < 10) {
      setIsDragging(true);
      setGeom({
        x: e.currentTarget.getBoundingClientRect().left,
        width: e.clientX - e.currentTarget.getBoundingClientRect().left,
      });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging)
        return;

      setGeom(prevPosition => ({
        x: prevPosition.x,
        width: e.clientX - prevPosition.x,
      }));
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);

    canvas.setBrushWidth(brushThickness);
    canvas.setBrushColor(brushColor);
  }, [brushThickness, brushColor, canvas]);

  const handleBrushThicknessChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const thickness = parseInt(e.target.value, 10);
    setBrushThickness(thickness);
    canvas.setBrushWidth(thickness);
  }, [canvas]);

  const handleBrushColorChange = useCallback((color: { hex: string }) => {
    setBrushColor(color.hex);
    canvas.setBrushColor(color.hex);
  }, [canvas]);

 const handleScaleFactorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const factor = parseInt(e.target.value, 10);
    setContentAwareScaleFactor(factor);
  };
  

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  /* HUH?
  const handleSelectTool = (tool: string) => {
    // Handle tool change logic here
    canvas.setSelectTool();
  };*/

  const [progress, setProgress] = useState(0); //Simple (and primitive) progress bar for advanced functions


  // CONTENT AND FUNCTIONALITY HERE! (for example button onClick Events!)
  let content;
  console.log("SELECTED STATE IN LEFT BAR: ", leftBarState);
  if (canvas) {
    // if something needs clearing from other states, put it in here!
    canvas.canvas.isDrawingMode = false;
    canvas.canvas.selection = false;
    canvas.clearCroppingElementsFromCanvas();
  }


  if (leftBarState === 'default') {
    content = <div>select a tool to start</div>;
  }
  if (leftBarState === 'brush') {
    canvas.canvas.isDrawingMode = true;
    content = (
      <div className ="container-fluid bg-white align-items-center">
        <div className="row align-items-center">
          <div className="col-6">
            <button className="btn btn-outline-dark btn-block"
              onClick={() => canvas.setTool(Tools.PEN)}>
              pen
            </button>
          </div>
          <div className="col-6">
            <button className="btn btn-outline-dark btn-block"
              onClick={() => {
                //for consistency purposes
                setBrushThickness(3); // Thickness as defined in basic.pencil
                setBrushColor('#0000FF'); // Color as defined in basic.pencil
                canvas.setTool(Tools.PENCIL);
              }}>
              pencil
            </button>
          </div>
        </div>
        <div className="row align-items-center">
          <div className='col-12'>
            <label htmlFor="customRange1" className="form-label mt-3">
              thickness
            </label>
            <input
              type="range"
              className="form-range"
              min="1"
              max="100"
              id="customRange1"
              value={brushThickness}
              onChange={handleBrushThicknessChange}
            />
          </div>
        </div>
        <div className="row align-items-center" id="colorPick">
          <div className='col-12'>
            <label  className="form-label">colour</label>
            <SketchPicker color={brushColor} onChange={handleBrushColorChange} />
          </div>
        </div>
        {/* Since this doesnt do anything, it is commented out for now
        <div>
          <label htmlFor="customRange2" className="form-label">
            Opacity
          </label>
          <input type="range" className="form-range" min="1" max="20" id="customRange2" />
        </div> */} 
        
      </div>
    );
          }
  if (leftBarState === 'crop') {
    content = createCropLeftSideHTML();
    createCropInternalStructs(canvas);
  }

  if (leftBarState === 'shapes') {
    content = 
      <div className="row align-items-center">
        <div className='col-12'>select a shape to start</div>
        <div className="col-6">
          <button className="btn btn-outline-dark btn-block" onClick={() => handleShapeClick('rectangle')}>rectangle</button>
          <button className="btn btn-outline-dark btn-block" onClick={() => handleShapeClick('circle')}>circle</button>
          <button className="btn btn-outline-dark btn-block" onClick={() => handleShapeClick('ellipse')}>ellipse</button>
          <button className="btn btn-outline-dark btn-block" onClick={() => handleShapeClick('line')}>line</button>
          <button className="btn btn-outline-dark btn-block" onClick={() => handleShapeClick('triangle')}>triangle</button>
      </div>
        <div className="col-12 mt-3">
            <label htmlFor="colorPicker">Color</label>
            <input type="color" id="colorPicker" />
        </div>

        <div className="col-12 mt-3">
            <label htmlFor="opacitySlider">Opacity</label>
            <input type="range" id="opacitySlider" min="0" max="1" step="0.01" defaultValue="1" />
        </div>

        <div className="col-12 mt-3">
          <label htmlFor="borderColorPicker">Border color</label>
          <input type="color" id="borderColorPicker" />
        </div>

        <div className="col-12 mt-3">
          <label htmlFor="borderThicknessSlider">Border thickness</label>
          <input type="range" id="borderThicknessSlider" min="1" max="10" step="1" defaultValue="1" />
        </div>
      </div>
  }

  if (leftBarState === 'mirror') {
    content =
      <div>mirror your image
        <div>
          <button className="btn btn-outline-dark btn-block my-1" onClick={() => {
            canvas.basicFunctions.mirrorY();
          }}>mirror on Y-axis</button>
        </div>
        <div>
          <button className="btn btn-outline-dark btn-block my-1" onClick={() => {
            canvas.basicFunctions.mirrorX();
          }}>mirror on X-axis</button>
        </div>
      </div>;


  }
  if (leftBarState === 'rotate') {
    content = 
      <div className="container-fluid bg-white">
        <div className="row align-items-center">
          <p>rotate your image by...</p>
        </div>
        <div>
          <button className="btn btn-outline-dark btn-block my-1"
            onClick={() => {
              //basic.rotate(canvas, 1.57079632679, 90);
              //basic.rotate(canvas, Math.PI / 2);
              //basic.rotate(canvas, 90);
              console.log("aa");
              //basic.rotate(canvas);
              canvas.basicFunctions.rotateByAnyAmount(90);
            }}
          >
            90 degrees
          </button>
        </div>
        <div>
        <button className="btn btn-outline-dark btn-block my-1"
          onClick={() => {
            //basic.rotate(canvas, 3.14159265, 180);
            //basic.rotate(canvas, Math.PI);
            console.log("bb");
            canvas.basicFunctions.rotate();
            canvas.basicFunctions.rotate();
          }}
        >
          180 degrees
        </button>
      </div>
      <div>
      <button className="btn btn-outline-dark btn-block my-1"
        onClick={() => {
          //basic.rotate(canvas, 4.71238898, 270);
          //basic.rotate(canvas, Math.PI * 1.5);
          console.log("cc");
          canvas.basicFunctions.rotate();
          canvas.basicFunctions.rotate();
          canvas.basicFunctions.rotate();
        }}
      >
        270 degrees
      </button>
    </div>
    <div>
        <label htmlFor="rotationSlider" className="form-label">
          Rotate:
        </label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="360"
          id="rotationSlider"
          value={rotationDegrees}
          onChange={(e) => {
            const newDegrees = parseInt(e.target.value, 10);
            setRotationDegrees(newDegrees);
            canvas.basicFunctions.rotateByAnyAmount(newDegrees - rotationDegrees);
          }}
        />
        <input
          type="number"
          value={rotationDegrees}
          onChange={(e) => {
            const newDegrees = parseInt(e.target.value, 10) || 0;
            setRotationDegrees(newDegrees);
            canvas.basicFunctions.rotateByAnyAmount(newDegrees - rotationDegrees);
          }}
          style={{ marginLeft: '10px', width: '60px' }}
        />
      </div>
    </div>
  }
  if (leftBarState === 'select') {
    canvas.canvas.selection = true;
    content = <div>
      <div>please select an object</div>
      <div>
        <button className="btn btn-outline-dark btn-block my-1" onClick={() => canvas.removeObjectWithContentAwareFill()}>
          Objekt entfernen
        </button>
      </div>
      </div>;
  }
  if (leftBarState === 'advanced') {
    content = (
      <div className="container-fluid justify-content-start">
        <div className="row justify-content-start">
          <h5 className='m-0 p-0'>content aware scaling</h5>
        </div>

        <div className="row justify-content-start">
          <label htmlFor="rangeForCAscale" className="form-label">
              Scaling Factor: {contentAwareScaleFactor}%
            </label>
            <input type="range" className="form-range" min="1" max="99" id="rangeForCAscale"
            value={contentAwareScaleFactor}
            onChange={handleScaleFactorChange} />
        </div>

        <div className="row justify-content-start">
          <div>
            <button className="btn btn-outline-dark btn-block my-1" 
              onClick={() => { dynamicContentAware(canvas, contentAwareScaleFactor/100, setProgress) }}> start scaling</button>
          </div>
          <div style={{ border: '1px solid #000', width: '100%', height: '20px' }}>
            <div style={{ background: '#00f', width: `${progress}%`, height: '100%' }} />
          </div>
        </div>

        <div className="row justify-content-start">
          <h5 className='m-0 p-0'>colour filter</h5>
        </div>

        <div className="row justify-content-start">
          <button className="btn btn-outline-dark btn-block my-1"
            onClick={() => {
              console.log("hi")
              canvas.applySepiaFilterToCanvasImage();
            }}
          >sepia filter
          </button>
        </div>

        <div className="row justify-content-start">
          <input type="checkbox" className="btn-block btn-check" id="btn-check" autoComplete="off" checked={isSharpened} 
          onChange={handleSharpenChange} />
          <label className="btn btn-outline-dark" htmlFor="btn-check">sharpen image</label>
        </div>

        <div className="row justify-content-start">
          <label htmlFor="constrastSlider">contrast</label>
          <input
            id="constrastSlider"
            type="range" 
            min="-100" 
            max="100" 
            value={contrast} 
            onChange={handleContrastChange} 
          />
        </div>
      
        <div className="row">
          <label htmlFor="colorFilter">colour</label>
          <input id="colorFilter" type="color" value={color} onChange={handleColorChange} />
        </div>

        <div>
          <button className="btn btn-outline-dark btn-block my-1" onClick={() => canvas.applyPencilFilter()}>
            pencil filter
          </button>
        </div>
      </div>
    );

  }
  else if (leftBarState === 'text') {
    content = <div>Text Button State
      <div>
        <button className="btn btn-outline-dark btn-block my-1" onClick={() => { canvas.basicFunctions.addUserText() }}>add text</button>
      </div>
    </div>;
  }

  /* this is generally useless since we use bootstrap and have a css for the specifics
    TODO: dont know whether we need anything related to isDragging or position?
  return (
    <div
      style={{
        width: position.width + 'px',
        minWidth: '200px',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#E6E6EA',
        padding: '10px',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        cursor: isDragging ? 'col-resize' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      {content}
    </div>
  );
  */
 return (
  <div className= "toolbarFill bg-white" onMouseDown={handleMouseDown}>
    {content}
  </div>
  );
};

export default ToolBar;
