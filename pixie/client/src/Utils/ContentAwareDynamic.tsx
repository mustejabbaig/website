import CanvasManager from './CanvasManager';
import { PixelMatrix, RGBAData } from './PixelMatrix';

function calculatePixelEnergy(matrix: PixelMatrix, x: number, y: number) {
    // if x or y is out of bounds, return infinity
    if (x < 0 || (x+1) >= matrix.getWidth() || y < 0 || (y+1) >= matrix.getHeight()) {
        return Infinity;
    }
    const dx = colorDifference(matrix.getPixel(x, y), matrix.getPixel(x + 1, y));
    const dy = colorDifference(matrix.getPixel(x, y), matrix.getPixel(x, y + 1));
    return dx + dy;
}
  
function colorDifference(pixel1: RGBAData, pixel2: RGBAData) {
    const dr = pixel1.red - pixel2.red;
    const dg = pixel1.green - pixel2.green;
    const db = pixel1.blue - pixel2.blue;
    return Math.sqrt(dr * dr + dg * dg + db * db);
}

function createEnergyMatrix(matrix: PixelMatrix) : number[][] {
    let energyMatrix: number[][] = [];
    for (let y: number = 0; y < matrix.getHeight(); y++) {
        energyMatrix[y] = [];
        for (let x: number = 0; x < matrix.getWidth(); x++) {
            energyMatrix[y][x] = calculatePixelEnergy(matrix, x, y);
        }
    }
    // set the energy in the energy matrix to the energy of the pixel plus the minimum energy of the pixels above it
    for (let y: number = 1; y < matrix.getHeight(); y++) {
        for (let x: number = 0; x < matrix.getWidth(); x++) {
            energyMatrix[y][x] += Math.min(energyMatrix[y - 1][x - 1] || Infinity, energyMatrix[y - 1][x], energyMatrix[y - 1][x + 1] || Infinity);
        }
    }
    return energyMatrix;
}

function findPathInEnergyMatrix(energyMatrix: number[][]) : number[] {
    // we start at the pixel with the lowest energy in the bottom row and move up
    // moving to the pixel above with the lowest energy

    let bottomRow = energyMatrix[energyMatrix.length - 1];
    let minEnergyIndex = 0;
    let minEnergy = Infinity;
    for(let x = 0; x < bottomRow.length; x++) {
        if(bottomRow[x] < minEnergy) {
            minEnergy = bottomRow[x];
            minEnergyIndex = x;
        }
    }
    // Move up the rows only checking the pixels straight above, to the left and to the right
    let path: number[] = [minEnergyIndex];
    for(let y = energyMatrix.length - 2; y >= 0; y--) {
        let row = energyMatrix[y];
        let minEnergyIndex = path[path.length - 1];
        let minEnergy = Infinity;
        for(let x = minEnergyIndex - 1; x <= minEnergyIndex + 1; x++) {
            if(row[x] < minEnergy) {
                minEnergy = row[x];
                minEnergyIndex = x;
            }
        }
        path.push(minEnergyIndex);
    }
    return path;
    
}

function removePathFromPixelMatrix(matrix: PixelMatrix, path: number[]) : PixelMatrix {
    let newMatrix : RGBAData[][] = [];
    
    for(let y = 0; y < matrix.getHeight(); y++) {
        //matrix.removePixel(path[path.length - y - 1], y);
        let newRow : RGBAData[] = [];
        for(let x = 0; x < matrix.getWidth(); x++) {
            if(x != path[path.length - y - 1]) {
                newRow.push(matrix.getPixel(x, y));
            }
        }
        newMatrix.push(newRow);
    }
    return new PixelMatrix(newMatrix);
}

function dynamicContentAware(canvas: CanvasManager, percentage: number, setProgress: (progress: number) => void) {
    canvas.saveCurrentCanvasToUndo();
    let matrix = canvas.layerManager.getRGBADataFromAllLayers();
    let deletions = Math.floor(matrix.getWidth() * percentage);

    function processDeletion(i: number) {
        if(i < deletions) {
            let energyMatrix = createEnergyMatrix(matrix);
            let path = findPathInEnergyMatrix(energyMatrix);
            matrix = removePathFromPixelMatrix(matrix, path);
            setProgress((i / deletions) * 100); // Update progress
            setTimeout(() => processDeletion(i + 1), 0); // Schedule next deletion
        }
        else {
            console.log("Content Aware Scale done");
            canvas.clear();
            canvas.setRGBAMatrix(matrix);
            setProgress(100); // Set progress to 100 when done
        }
    }


    // This is a very annoying (and ugly) workaround to get a process bar to update while the function is running
    // There is most likely a better way since this probably slows down the process
    processDeletion(0); 
}

export { dynamicContentAware };

