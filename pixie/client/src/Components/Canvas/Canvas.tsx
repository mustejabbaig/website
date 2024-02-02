import React from "react";
import { useEffect, useState } from 'react';
import '../../Utils/CanvasManager';
import { CanvasManager } from "../../Utils/CanvasManager";

interface MyCanvasProps {
  canvas: CanvasManager | null;
  onCanvasCreated: (canvas: CanvasManager) => void;
  handleDownload: (canvas: CanvasManager) => void;
}

const Canvas: React.FC<MyCanvasProps> = ({canvas, onCanvasCreated, handleDownload}) => {
  const [image, setImage] = useState("");
  
  useEffect(() => {
    const newCanvas = new CanvasManager(5, 'black', 'white');
    
    // the parent handles the canvas
    onCanvasCreated(newCanvas);
    return () => {
      if (newCanvas == null) {
        console.log("WARNING: canvas is null!")
        return
      }
      // Cleanup when component unmounts
      newCanvas.destroy()
    };
  }, []);
  
  useEffect(() => {
    if (canvas == null)
      return
    // TODO: fix this
    // canvas.updateBackgroundImage(image);
  }, [image, canvas]);

  return (
    <div>
      <div>
        <canvas id="my-canvas" width="500" height="500" style={{ position: 'relative', zIndex: 2 }} />
      </div>
    </div>
  );
};
export default Canvas;