import { fabric } from 'fabric';
import CanvasManager from "../../../Utils/CanvasManager";
import { Ratio } from 'react-bootstrap';
import { PixelMatrix, RGBAData } from '../../../Utils/PixelMatrix';

// GLOBALS
var G_canvasManager : CanvasManager;
var G_fabricCanvas : fabric.Canvas;
var G_ratio : [number, number];
var G_CropCircles  : [fabric.Circle, fabric.Circle, fabric.Circle,fabric.Circle,fabric.Circle,fabric.Circle,fabric.Circle,fabric.Circle];
var G_CropBorders : [fabric.Rect, fabric.Rect, fabric.Rect, fabric.Rect];

// GLOBALS - HTML ELEMENT CHANGE
var HTMLcroppingValue : string;
var HTMLcroppingRatio : [number, number];
var HTMLpercentage : number;


/**
 * 
 * @param border "top", "bottom", "left" or "right"
 * @param position position to set all the according circles to. Also updates the borders!
 * @returns 
 */
function updatePositions(border: string, position: number)
{
    // var pos : fabric.Point = new fabric.Point(0 ,0);
    switch(border)
    {
        
        case "top":
            for(let i = 0; i < 3; i++)
            {
                G_CropCircles[i].set('top', position);
                G_CropCircles[i].setCoords();
            }
            break;
        case "left":
            for(let i = 6; i < 8; i++)
            {
                G_CropCircles[i].set('left', position);
                G_CropCircles[i].setCoords();
            }
            G_CropCircles[0].set('left', position);
            G_CropCircles[0].setCoords();
            break;
        case "right":
            for(let i = 2; i < 5; i++)
            {
                G_CropCircles[i].set('left', position);
                G_CropCircles[i].setCoords()
            }
            break;
            
        case "bottom":
            for(let i = 4; i < 7; i++)
            {
                G_CropCircles[i].set('top', position);
                G_CropCircles[i].setCoords();
            }
            break;
        default:
            break;
        
    }
    updateBorders();
}

function updateBorders()
{
 
    G_CropBorders[0].set('width', (G_CropCircles[2].left as number) - (G_CropCircles[0].left as number));
    G_CropBorders[0].set('height', G_CropCircles[0].top);
    G_CropBorders[0].set('left', G_CropCircles[0].left);
    G_CropBorders[0].set('top', 0); // Why do we need that?? 
    G_CropBorders[0].setCoords();

    G_CropBorders[1].set('width', G_ratio[0] - (G_CropCircles[2].left as number));
    G_CropBorders[1].set('height', G_CropCircles[4].top);
    G_CropBorders[1].setCoords();

    G_CropBorders[2].set('width', G_ratio[0] - (G_CropCircles[0].left as number));
    G_CropBorders[2].set('height', G_ratio[1] - (G_CropCircles[4].top as number));
    G_CropBorders[2].setCoords();

    G_CropBorders[3].set('width', (G_CropCircles[0].left));
    G_CropBorders[3].setCoords();
}


export function createCropInternalStructs(canvasManager : CanvasManager)
{
    
    G_canvasManager = canvasManager;
    G_fabricCanvas = canvasManager.canvas;
    G_fabricCanvas.selection = false;
    G_ratio = [G_fabricCanvas.getWidth(), G_fabricCanvas.getHeight()];
    setRatioDropDown("custom");
    HTMLcroppingRatio = G_ratio;
    HTMLpercentage = 100;
    HTMLcroppingValue = "default";
    G_CropCircles = canvasManager.croppingCircles;
    G_CropBorders = canvasManager.croppingBorders;
    
    // CREATE THE CIRCLES AND RECTANGLE FOR MANUAL CROPPING
    var pos : fabric.Point = new fabric.Point(0 ,0);
    G_CropCircles[0].setPositionByOrigin(pos, 'left', 'top');
    G_CropBorders[0].setPositionByOrigin(pos, 'left', 'bottom');
    pos.x = G_ratio[0]/2;
    G_CropCircles[1].setPositionByOrigin(pos, 'center', 'top');
    pos.x = G_ratio[0];
    G_CropCircles[2].setPositionByOrigin(pos, 'right', 'top');
    G_CropBorders[1].setPositionByOrigin(pos, 'right', 'top');
    pos.y += G_ratio[1] / 2;
    G_CropCircles[3].setPositionByOrigin(pos, 'right', 'center');
    pos.y = G_ratio[1] ;
    G_CropCircles[4].setPositionByOrigin(pos, 'right', 'bottom');
    G_CropBorders[2].setPositionByOrigin(pos, 'right', 'bottom');
    pos.x -= G_ratio[0]/2;
    G_CropCircles[5].setPositionByOrigin(pos, 'center', 'bottom');
    pos.x = 0;
    G_CropCircles[6].setPositionByOrigin(pos, 'left', 'bottom');
    G_CropBorders[3].setPositionByOrigin(pos, 'left', 'bottom');
    pos.y -= G_ratio[1]/2;
    G_CropCircles[7].setPositionByOrigin(pos, 'left', 'center');

    G_CropBorders[0].set('width', G_ratio[0]);
    G_CropBorders[0].set('height', 0);
    G_CropBorders[1].set('height', G_ratio[1]);
    G_CropBorders[1].set('width', 0);
    G_CropBorders[2].set('width', G_ratio[0]);
    G_CropBorders[2].set('height', 0);
    G_CropBorders[3].set('height', G_ratio[1]);
    G_CropBorders[3].set('width', 0);

    // add, if not already existent!
    for(let i = 0; i < 8; i++) G_fabricCanvas.add(G_CropCircles[i]);
    for(let i = 0; i < 4; i++) G_fabricCanvas.add(G_CropBorders[i]);
    G_fabricCanvas.renderAll();


    console.log("Objects after initCrop: ", G_fabricCanvas._objects);
    

    // TOP LEFT CIRCLE
    G_CropCircles[0].on("moving", function(e: any)
    {
        setRatioDropDown("custom");
        if(G_CropCircles[0].top && G_CropCircles[0].left && G_CropCircles[7].top && G_CropCircles[1].left)
        {
            if(G_CropCircles[0].top < 0) G_CropCircles[0].top = 0;
            if(G_CropCircles[0].left < 0) G_CropCircles[0].left = 0;
            if(G_CropCircles[0].top > G_CropCircles[7].top - 10) G_CropCircles[0].top = G_CropCircles[7].top - 10;
            if(G_CropCircles[0].left > G_CropCircles[1].left - 10) G_CropCircles[0].left = G_CropCircles[1].left - 10;
            updatePositions("top", G_CropCircles[0].top);
            updatePositions("left", G_CropCircles[0].left);
        }
    });
    // TOP MID CIRCLE
    G_CropCircles[1].on("moving", function(e: any)
    {
        setRatioDropDown("custom");
        if(G_CropCircles[1].top && G_CropCircles[3].top)
        {
            if(G_CropCircles[1].top < 0) G_CropCircles[1].top = 0;
            if(G_CropCircles[1].top > G_CropCircles[3].top - 10)G_CropCircles[1].top = G_CropCircles[3].top - 10;
            updatePositions("top", G_CropCircles[1].top);
        }

    });
    // TOP RIGHT CIRCLE
    G_CropCircles[2].on("moving", function(e: any)
    {
        setRatioDropDown("custom");
        if(G_CropCircles[2].top && G_CropCircles[2].left && G_CropCircles[3].top && G_CropCircles[1].left)
        {
            if(G_CropCircles[2].top < 0) G_CropCircles[2].top = 0;
            if(G_CropCircles[2].left > G_ratio[0]) G_CropCircles[2].left = G_ratio[0];
            if(G_CropCircles[2].top > G_CropCircles[3].top - 10) G_CropCircles[2].top = G_CropCircles[3].top - 10;
            if(G_CropCircles[2].left < G_CropCircles[1].left + 10) G_CropCircles[2].left = G_CropCircles[1].left + 10;
            updatePositions("top", G_CropCircles[2].top);
            updatePositions("right", G_CropCircles[2].left);
        }
    });
    // RIGHT CENTER
    G_CropCircles[3].on("moving", function(e: any)
    {
        setRatioDropDown("custom");
        if(G_CropCircles[3].left && G_CropCircles[5].left)
        {
            if(G_CropCircles[3].left > G_ratio[0])
                G_CropCircles[3].left =  G_ratio[0];
            if(G_CropCircles[3].left < G_CropCircles[5].left + 10)
                G_CropCircles[3].left = G_CropCircles[5].left + 10;
            updatePositions("right", G_CropCircles[3].left);
        }
    });
    // BOTTOM RIGHT
    G_CropCircles[4].on("moving", function(e: any)
    {
        setRatioDropDown("custom");
        if(G_CropCircles[4].top && G_CropCircles[4].left && G_CropCircles[3].top && G_CropCircles[5].left)
        {
            if(G_CropCircles[4].top > G_ratio[1]) G_CropCircles[4].top =  G_ratio[1];
            if(G_CropCircles[4].left > G_ratio[0]) G_CropCircles[4].left = G_ratio[0];
            if(G_CropCircles[4].top < G_CropCircles[3].top + 10) G_CropCircles[4].top = G_CropCircles[3].top + 10;
            if(G_CropCircles[4].left < G_CropCircles[5].left + 10) G_CropCircles[4].left =  G_CropCircles[5].left + 10;
            updatePositions("bottom", G_CropCircles[4].top);
            updatePositions("right", G_CropCircles[4].left);
        }
    });
    // Bottom Center
    G_CropCircles[5].on("moving", function(e: any)
    {
        setRatioDropDown("custom");
        if(G_CropCircles[5].top && G_CropCircles[7].top)
        {
            if(G_CropCircles[5].top > G_ratio[1])
                G_CropCircles[5].top = G_ratio[1];
            if(G_CropCircles[5].top < G_CropCircles[7].top + 10)
                G_CropCircles[5].top = G_CropCircles[7].top + 10;
            updatePositions("bottom", G_CropCircles[5].top);
        }

    });
    // BOTTOM LEFT
    G_CropCircles[6].on("moving", function(e: any)
    {
        setRatioDropDown("custom");
        if(G_CropCircles[6].top && G_CropCircles[6].left && G_CropCircles[7].top && G_CropCircles[5].left)
        {
            if(G_CropCircles[6].top > G_ratio[1]) G_CropCircles[6].top =  G_ratio[1];
            if(G_CropCircles[6].left < 0) G_CropCircles[6].left = 0;
            if(G_CropCircles[6].top < G_CropCircles[7].top + 10) G_CropCircles[6].top = G_CropCircles[7].top + 10;
            if(G_CropCircles[6].left > G_CropCircles[5].left - 10) G_CropCircles[6].left =   G_CropCircles[5].left - 10;
            updatePositions("bottom", G_CropCircles[6].top);
            updatePositions("left", G_CropCircles[6].left);
        }
    });
    // LEFT CENTER
    G_CropCircles[7].on("moving", function(e: any)
    {
        setRatioDropDown("custom");
        if(G_CropCircles[7].left && G_CropCircles[1].left)
        {
            if(G_CropCircles[7].left < 0)
                G_CropCircles[7].left = 0;
            if(G_CropCircles[7].left > G_CropCircles[1].left - 10)
                G_CropCircles[7].left = G_CropCircles[1].left - 10;
            updatePositions("left", G_CropCircles[7].left);
        }
    });
}



export function createCropLeftSideHTML()
{
    HTMLcroppingValue = "default";
    HTMLcroppingRatio = [0,0];
    HTMLpercentage = 100;
    let content = 
    <div>
        <label htmlFor="ratioSelectForm">select ratio</label>
            <select id="ratioSelectDropDown" defaultValue="custom" onChange={changeRatioVariables}>
                <option value="1:1">1:1</option>
                <option value="4:3">4:3</option>
                <option value="16:9">16:9</option>
                <option value="9:16">9:16</option>
                <option value="custom">User Selected</option>
            </select>
        <label htmlFor="rangeSlider">Select Percentage!</label>
            <input type="range"  id="rangeSlider" min="20" max="100" defaultValue="100" onChange={(event)=>{
                HTMLpercentage = Number(event.target.value);
                let d = document.getElementById('selectedNumber');
                if(d) d.textContent = event.target.value + "%";
                console.log(HTMLpercentage);
            }} />
                <p id="selectedNumber">100%</p>
        <button className="btn btn-outline-dark btn-block" id="moveBordersBtn" onClick={moveBorders}>move borders</button>
        <button className="btn btn-outline-dark btn-block" id="applyCroppingBtn" onClick={executeCrop}>apply cropping</button>
    </div>;
    return content;
}

/**
 * 
 * @param entry ratio "x:y" or "custom"
 * Please only enter "custom" if you don't know the specific ratios!
 */
function setRatioDropDown(entry: string)
{
    HTMLcroppingValue = entry;
    let d = document.getElementById("ratioSelectDropDown");
    if(d) (d as HTMLInputElement).value = entry;
}


function changeRatioVariables(event : any)
{
    HTMLcroppingValue = event.target.value;
    HTMLcroppingRatio = [G_ratio[0], G_ratio[1]];
    if(HTMLcroppingValue && HTMLcroppingValue != "default" && HTMLcroppingValue != "custom") 
    {
        var splitted : string[] = HTMLcroppingValue.split(":", 2);
        HTMLcroppingRatio = [Number(splitted[0]), Number(splitted[1])];
    }
    
    console.log(HTMLcroppingRatio[0], HTMLcroppingRatio[1]);
}
function moveBorders()
{
    console.log("HTMLCroppingValue", HTMLcroppingValue);
    if(HTMLcroppingValue == "default" || HTMLcroppingValue == "custom")
    {
        console.log("Please select a ratio!");
        return;
    }

    let newRatio : number = HTMLcroppingRatio[0] / HTMLcroppingRatio[1];
    let oldRatio : number = G_ratio[0] / G_ratio[1];
    let scaleValue : number = HTMLpercentage / 100.0;

    var newHeight = -1;
    var newWidth = -1;
    
    // Move top and bottom towards each other!
    if(newRatio > oldRatio)
    {
        newHeight = (HTMLcroppingRatio[1] * G_ratio[0] / HTMLcroppingRatio[0])*scaleValue;
        newWidth = G_ratio[0] * scaleValue;
       
    }
    else if(newRatio < oldRatio)
    {
        newWidth = (HTMLcroppingRatio[0] * G_ratio[0] / HTMLcroppingRatio[1])*scaleValue;
        newHeight = G_ratio[1] * scaleValue;
    }
    else if(newRatio == oldRatio)
    {
        newWidth = G_ratio[0] *scaleValue;
        newHeight = G_ratio[1] * scaleValue;
    }
    console.log("newWidth", newWidth);
    console.log("newHeight: ", newHeight);
    updatePositions("top", (G_ratio[1] - newHeight) / 2);
    updatePositions("left", (G_ratio[0] - newWidth) / 2);
    updatePositions("right", G_ratio[0] - (G_ratio[0] - newWidth) / 2);
    updatePositions("bottom", G_ratio[1] - ((G_ratio[1] - newHeight) / 2));
    G_fabricCanvas.renderAll();
}

function executeCrop()
{
    alert("We will Crop the image into all active layers. But beware: The user added objects won't be selectable anymore, and any layering information from before won't be accessible anymore!");
    
    let newWidth : number = (G_CropCircles[2].get('left') as number) -  (G_CropCircles[0].get('left') as number);
    let newHeight : number = (G_CropCircles[6].get('top') as number) - (G_CropCircles[0].get('top') as number); 
    let cornerPos : [number, number] = [G_CropCircles[0].get('left') as number , G_CropCircles[0].get('top') as number];

    if(newWidth == G_ratio[0] && newHeight == G_ratio[1])
    {
        alert("Please change Something!");
        return;
    }

    G_canvasManager.clearCroppingElementsFromCanvas();

    var RGBA : PixelMatrix = G_canvasManager.layerManager.getRGBADataFromAllLayers();
    var rgbaRealValues : RGBAData[][] = RGBA.matrix;
    rgbaRealValues =  rgbaRealValues.slice(cornerPos[1], newHeight + cornerPos[1]);


    for(let i  = 0; i < rgbaRealValues.length; i++)
                rgbaRealValues[i] = rgbaRealValues[i].slice(cornerPos[0], newWidth + cornerPos[0]);


    RGBA.matrix = rgbaRealValues;
    RGBA.height = rgbaRealValues.length;
    RGBA.width = rgbaRealValues[0].length;

    // add to canvas, before remove all objects
    var objToAddURL = RGBA.convertToImgUrl();
    var fabricImgObj = new Image();
    fabricImgObj.src = objToAddURL;
    G_fabricCanvas.setWidth(newWidth);
    G_fabricCanvas.setHeight( newHeight);
    G_fabricCanvas.clear();

    fabricImgObj.onload = function()
    {
        var img = new fabric.Image(fabricImgObj);
        img.set({
            originX: "left",
            originY: "top",
            angle: 0,
            padding: 0,
            top: 0,
            left: 0,
            selectable: false
            
        });
        G_fabricCanvas.add(img);
        G_fabricCanvas.renderAll();
    }

    createCropInternalStructs(G_canvasManager);
}
