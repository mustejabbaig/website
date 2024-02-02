import React, { useState } from 'react';
import './App.css';
import Canvas from '../Components/Canvas/Canvas';
import Menu from '../Components/Menu/Menu';
import ToolBar from '../Components/ToolBar/ToolBar';
import Dialogs from '../Components/Dialogs/Dialogs';
import DownloadMenu from '../Components/DownloadMenu/DownloadMenu';
import StartPage from '../Components/StartPage/StartPage';
import { CanvasManager } from '../Utils/CanvasManager';
import screenshot from "../Components/StartPage/startPage_EditorScreenshot_with_explanations.png";
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

const App = () => {
  
  const [canvas, setCanvas] = useState<CanvasManager | null>(null);
  const [leftBarState, setLeftBarState] = useState<string>('default');
  const [downloadMenuState, setDownloadMenuState] = useState<string>("downloadMenuHidden");
  const [startButtonClicked, setStartButtonClicked] = useState(false);

  /* handles Button click on landing page to show Editor */
  const showEditor = () => {
    setStartButtonClicked(true);
  }

  function downloadCanvas(canvas: CanvasManager) {
    if(canvas == null)
      return 
    canvas.canvasToImageURL();
  }

  function onCanvasCreated(canvas: CanvasManager) {
    setCanvas(canvas);
    CanvasManager.greyOutRedoButton();
    CanvasManager.greyOutUndoButton();
    canvas.layerManager.addNewLayer();
  }

  const changeLeftBarState = async (newState: string) => {
    await setLeftBarState(newState);
  }
  const changeDownloadMenuState = (newDownloadMenuState: string) => {
    setDownloadMenuState(newDownloadMenuState);
  }

  return (
    <div>
      {startButtonClicked ? (
        <div className="container-fluid fill">
          <div className="row menu">
            <div className="col-12">
              <Menu canvas={canvas} handleDownload={downloadCanvas} changeLeftBarState={changeLeftBarState} changeDownloadMenuState={changeDownloadMenuState}/>
            </div>
          </div>
          <div className="row content">
              <div className="col-2 leftBar bg-white">
                <ToolBar canvas={canvas!} leftBarState={leftBarState}/>
              </div>
              <div className="col-8 canvas justify-content-center align-middle">
                <Canvas canvas={canvas} onCanvasCreated={onCanvasCreated} handleDownload={downloadCanvas}/>
              </div>
              <div className="col-2 dialogs bg-white">
                <Dialogs canvas={canvas!}/>
                <DownloadMenu downloadMenueState={downloadMenuState} changeDownloadMenuState={changeDownloadMenuState} canvas={canvas}/>
              </div>
            </div>
        </div>
      ) : (
        <div className="container-fluid vh-100">
          <div id="welcomeRow" className="row vh-20 pt-4">
            <div className="col-3"></div>
            <div className="col-4 d-flex justify-content-center">
              <h1 id="welcome">welcome to pixie</h1>
            </div>
            <div className="col-5 d-flex">
              <button className="btn m-1" id="startButton" onClick={showEditor}>start now!</button>
            </div>
          </div>
          <div className="row pt-0 mt-0">
                <img
                    src={screenshot}
                    className="img-fluid pt-0 mt-0"
                />
          </div>
          {/* ehdqdil
          <div id="imageRow" className="row vh-80 mt-0 pt-0 bg-primary">
            <StartPage />
          </div>
          */}
        </div>
      )}
    </div>
  );
};

export default App;
