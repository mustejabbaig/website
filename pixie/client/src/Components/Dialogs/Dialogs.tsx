import React, { useEffect, useState } from 'react';
import './Dialogs.css'; // Your CSS file for styling
import { CanvasManager } from '../../Utils/CanvasManager';

interface MyDialogsProps {
  canvas: CanvasManager;
}

/* The right menu bar */
const Dialogs: React.FC<MyDialogsProps> = ({ canvas }) => {
  const showLayerPreview = (layerNumber: number) => {
    // TODO: Replace this with logic to display the preview of the layer's content
    alert(`Show Preview for Layer ${layerNumber}`);
  };

  const [numLayers, setNumLayers] = useState<number>(1); //initial number of layers
  const [layerStatus, setLayerStatus] = useState<boolean[]>(Array(numLayers).fill(true));

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, layerIndex: 0 });

  const handleContextMenu = (event: React.MouseEvent, index: number) => {
    //Open a right click menu whenever we right click a layer in accordance to Anforderungsanalyse
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      layerIndex: index
    });
  };


  /* Old static code for reference
  useEffect(() => {
    let layers: number[] = [];
    if (checked1) {
      layers.push(DEFAULT_LAYER);
    }
    if (checked2) {
      layers.push(DEFAULT_LAYER + 1);
    }
    if (checked3) {
      layers.push(DEFAULT_LAYER + 2);
    }
    console.log("UseEffect0: ");
    if (canvas == null) {
      return;
    }
    console.log("UseEffect: ", layers);
    canvas.setActiveLayers(layers);

    var objects = canvas.getActiveObjects();
    console.log("obj size: ", objects.length);
    objects.forEach((object) => {
      console.log("object: ", object);
    });
  }, [checked1, checked2, checked3]);
  
  const handleChangeLayer1 = () => {
    console.log("checked1 before: ", checked1)
    setChecked1(!checked1)

    console.log("set reset active layer:", checked1);

    canvas.setResetActiveLayer(DEFAULT_LAYER, checked1)

    if (checked1)
      return;

    canvas.setActiveLayer(DEFAULT_LAYER);
    var objects = canvas.getActiveObjects();
    console.log("obj size: ", objects.length);
    objects.forEach((object) => {
      console.log("object: ", object);
    });
  }
  */

  
  function handleAddLayer()
  {
   /* //because of the async nature of the useStates, we use a variable so that the correct number gets passed
    let indexOfNew = numLayers; //since index starts at zero and numLayers at 1, we just assign numLayers to index and dont add +1
    setNumLayers(numLayers + 1);
    setLayerStatus([...layerStatus, true]); //newly added layers are automatically active
    console.log(`number of layers: ${indexOfNew+1}`);
    canvas.addNewLayer(indexOfNew);*/
    canvas.layerManager.addNewLayer();
    setLayerStatus([...layerStatus, true]);
    setNumLayers(numLayers+1);
  }

  function handleLayerCheckbox(index: number, isActive: boolean) {
    const newLayerStatus = [...layerStatus]; 
    newLayerStatus[index] = !isActive;
    setLayerStatus(newLayerStatus);

    console.log(`Layer ${index+1} checkbox changed to ${!isActive}`);

    if(isActive) { //Layer is now unchecked, using isActive since setLayerStatus may not be finished yet
      canvas.layerManager.deactivateLayer(index);
      return;
    }

    //If we land here the checkbox is now checked
    canvas.layerManager.activateLayer(index);
  }
  
  // TODO: Add "Remove Layer" button on all layers
  function handleDeleteLayer(layerID: number) {
    if(numLayers > 1) {
      // TODO add confirmation popup
      canvas.layerManager.removeLayer(layerID);

      setNumLayers(numLayers - 1);
      const newLayerStatus = [...layerStatus];
      newLayerStatus.splice(layerID, 1);//delete the true/false that belonged to that array
      setLayerStatus(newLayerStatus); 

      setContextMenu({ visible: false, x: 0, y: 0, layerIndex: 0 }); //hide our menu again
    }
    else {
      // TODO? cant delete last layer 
      // comment from Nico: why??
    }
  }

  return (
    <div className="container-fluid layer-panel">
      {/* Render layers with checkboxes */}
      {layerStatus.map((isActive, index) => (
        <div className="row " key={index} onContextMenu={(event) => handleContextMenu(event, index)}>
          <button
          onClick={() => {}}
          type="button"
          className="btn btn-outline-dark layerButton"
          >
            <input 
            type="checkbox" 
            className="layer-checkbox" 
            checked={isActive}
            onChange={() => handleLayerCheckbox(index,isActive)}/
            > 
            
          <button
            type="button"
            className="btn btn-outline-dark preview-button btn-sm"
          >
            Show Preview
          </button>
           Layer {index+1} 
          </button>
        </div>
      ))}

      {contextMenu.visible && (
    <div className="context-menu btn btn-outline-dark" style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}>
      <button onClick={() => handleDeleteLayer(contextMenu.layerIndex)}>
        Delete Layer </button>
    </div>
  )}

      <button
        type="button"
        className="btn btn-outline-dark bottom-right-button"
        onClick={handleAddLayer}>
        Add Layer
      </button>

    </div>
  );
};

export default Dialogs;


// // ToolBar.tsx
// import React from 'react';
// import './Dialogs.css'; // Your CSS file for styling
// import { useState } from 'react';
// import { CanvasManager } from '../../utils/CanvasManager';


// interface MyDialogsProps {
//   canvas: CanvasManager;
// }

// /* The right menu bar */
// const Dialogs: React.FC<MyDialogsProps> = ({canvas }) => {
//   const getLayerPreview = (layerNumber: number): JSX.Element => {
//     // Replace this with logic to get a visual preview of the layer contents
//     // For now, a placeholder div is used
//     return <div className="layer-preview">Layer {layerNumber} Preview</div>;
//   };
//   return (
//     <div>
//       <button onClick={() => {
//         console.log("works1");
//         canvas.setActiveLayer(1);
//         var objects = canvas.getActiveLayer().getObjects();
//         console.log("obj size: ", objects.length);
//         objects.forEach((object) => {
//           console.log("object: ", object);
//         });
//       }} type="button" className="btn btn-outline-primary"
//       >
//         <input type="checkbox" className="layer-checkbox" />  Layer 1</button>
//       <button onClick={() => {
//         console.log("works2");
//         canvas.setActiveLayer(2);
//         var objects = canvas.getActiveLayer().getObjects();
//         console.log("obj size: ", objects.length);
//         objects.forEach((object) => {
//           console.log("object: ", object);
//         });
//       }} type="button" className="btn btn-outline-primary"
//       > <input type="checkbox" className="layer-checkbox" />
//       Layer 2</button>
//       <button onClick={() => {
//         console.log("works3");
//         canvas.setActiveLayer(3);
//         var objects = canvas.getActiveLayer().getObjects();
//         console.log("obj size: ", objects.length);
//         objects.forEach((object) => {
//           console.log("object: ", object);
//         });
//       }} type="button" className="btn btn-outline-primary"
//       >
//        <input type="checkbox" className="layer-checkbox" />
// Layer 3</button>
      
      
//       <button type="button" className="btn btn-outline-primary bottom-right-button">
//         Add Layer
//       </button>{/* Add more tool buttons here */}
//     </div>
//   );
// };

// export default Dialogs;