import React from "react";
import { useEffect, useState } from 'react';
import './Menu.css';
import { CanvasManager } from "../../Utils/CanvasManager";
import logo from "./pixie_Banner_Final.png";
import { PixelMatrix } from "../../Utils/PixelMatrix";

interface MyMenuProps {
  canvas: CanvasManager | null;
  handleDownload: (canvas: CanvasManager) => void;
  changeLeftBarState: (newState: string) => void;
  changeDownloadMenuState: (newDownloadMenuState: string) => void;
}


  const Menu: React.FC<MyMenuProps> = ({canvas, handleDownload, changeLeftBarState, changeDownloadMenuState }) => {
  const handleButtonClick = async (button: string) =>
  {
    // TECHNICAL FUNCTIONALITY that maybe doesnt need the buttons from the right??
    // FOR EXAMPLE: 
    let pState = 'default';
    changeLeftBarState('default');
    if(canvas) pState = canvas.HTMLSTATEcurrentFunctionality;
    if(button === 'undo')
    {
      canvas?.undo();
      changeLeftBarState(pState);
    }
    else if(button === 'redo')
    {
      canvas?.redo();
      changeLeftBarState(pState);
    }
    else if (button === 'save_to') {
      changeDownloadMenuState("downloadMenuVisible");
      // changeLeftBarState(PREVIOUS_STATE);
    }

    // TECHNICAL FUNCTIONALITY WHICH WILL BE HANDLED FROM THE RIGHT AREA
    else
    {
      if(canvas)
        canvas.HTMLSTATEcurrentFunctionality = button;
        changeLeftBarState(button);
    }
      
  }

  const handleImageUploadIntoNewLayer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File = event.target.files![0];
    canvas!.addImageFromFile(file, 'default', true, false);
  }

  const handleImageUploadCompletlyNewProject= (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File = event.target.files![0];
    canvas!.addImageFromFile(file, 'newProject', true, true);
  }

  const handleImageUploadIntoActiveLayers= (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File = event.target.files![0];
    canvas!.addImageFromFile(file, 'insideActiveLayer', true, false);
  }

  return (
    <div className="container-fluid enuFill bg-white">
      <div className="row align-items-center">
        <div className="col-lg-2 col-md-12" id="logo">
          <img src={logo} className="img-fluid" alt="pixie"></img>
        </div>
        <div className="col-lg-10 col-md-12 p-0" id="buttons">
          <div className="align-middle ml-0">
            <nav className="navbar navbar-expand-lg navbar-light">
              <div>
                <input
                  id="uploadImageButtonNewProject"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleImageUploadCompletlyNewProject}/>
              </div>
              <div>
                <input
                  id="uploadImageButtonNewLayer"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleImageUploadIntoNewLayer}/>
              </div>
              <div>
                <input
                  id="uploadImageButtonActiveLayers"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleImageUploadIntoActiveLayers}/>
              </div>
              <div className="navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">

                  <li className="nav-item dropdown">
                    <a className="btn btn-secondary dropdown-toggle btn-block" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      File
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <a className="dropdown-item" href="#"
                      onClick={() => {document.getElementById('uploadImageButtonNewProject')!.click()}}
                      >Open as new Project</a>
                      <a className="dropdown-item" href="#"
                      onClick={() => {document.getElementById('uploadImageButtonNewLayer')!.click()}}
                      >Open in new Layer</a>
                      <a className="dropdown-item" href="#"
                      onClick={() => {document.getElementById('uploadImageButtonActiveLayers')!.click()}}
                      >Open in active Layers</a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" onClick={() => {handleDownload(canvas!)}} href="#">Save as</a>
                      <a className="dropdown-item" onClick={() => {handleButtonClick('save_to')}} href="#">Save to</a>
                      <a className="dropdown-item" onClick={() => canvas!.clear()}  href="#">Clear</a>
                    </div>
                  </li>

                  <li className="nav-item">
                    <a role="button" className="btn btn-outline-dark btn-block" id="undoButton"
                      onClick={() => handleButtonClick('undo')}
                      >undo</a>
                  </li>

                  <li className="nav-item">
                    <a role="button" className="btn btn-outline-dark btn-block" id="redoButton"
                      onClick={() => handleButtonClick('redo')}
                      >redo</a>
                  </li>

                  <li className="nav-item active">
                    <a role="button" className="btn btn-outline-dark btn-block" title="paint on your image with various colours" onClick={() => handleButtonClick('brush')}>brush</a>
                  </li>

                  <li className="nav-item active">
                    <a role="button" className="btn btn-outline-dark btn-block" title="add text to your image" onClick={() => handleButtonClick('text')}>text</a>
                  </li>

                  <li className="nav-item active">
                    <a role="button" className="btn btn-outline-dark btn-block" title="rotate your image"  onClick={() => handleButtonClick('rotate')}>rotate</a>
                  </li>

                  <li className="nav-item active">
                    <a role="button" className="btn btn-outline-dark btn-block" title="mirror your image on x or y axis" onClick={() => handleButtonClick('mirror')}>mirror</a>
                  </li>

                  <li className="nav-item active">
                    <a role="button" className="btn btn-outline-dark btn-block" onClick={() => handleButtonClick('select')}
                      >select</a>
                  </li>

                  <li className="nav-item active">
                    <a role="button" className="btn btn-outline-dark btn-block" title="crop your image by manually moving th borders or letting the smart algorith choose for you" onClick={() => handleButtonClick('crop')} >crop</a> 
                  </li>

                  <li className="nav-item active">
                    <a role="button" className="btn btn-outline-dark btn-block" title="add colour and texture filters to your image"  onClick={() => handleButtonClick('advanced')}>filter</a>
                  </li>

                  <li className="nav-item active">
                    <a role="button" className="btn btn-outline-dark btn-block" title="insert shapes like a circle, a square or a line" onClick={() => handleButtonClick('shapes')}>shapes</a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
