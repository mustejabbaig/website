import CanvasManager from './CanvasManager';
import { PixelMatrix, RGBAData } from './PixelMatrix';
import { WeightedGraph, Edge } from './ContentAwareGraph';

// The algorithm and the implementation is based on the Algorithm and Data Structures course and the exercise that was to be completed for the course

class ShortestPathTopological {
    s: number;
    parent: number[];
    dist: number[];

    constructor(graph: WeightedGraph, s: number) {
        this.s = s;
        this.parent = [];
        this.dist = [];
        for (let i = 0; i < graph.V; i++) {
            this.dist[i] = Infinity; //Dist = Unendlich für alle nicht erreichbaren
            this.parent[i] = -1; //Parent = -1 für alle nicht erreichbaren
        }
        this.dist[s] = 0;
        this.parent[s] = s;
        graph.dfs(s);

        let reversePost = graph.reversePost;
        while (reversePost.length != 0) {
            let poppedValue = reversePost.pop();
            if (poppedValue !== undefined) {
                for (let e of graph.incident(poppedValue)) {
                    this.relax(e);
                }
            }
        }
    }


    relax(e: Edge) {
    // If we find an edge with a lower contrast => new parent
        if (!e) {
            return;
        }
        let newDist = this.dist[e.from] + e.weight;
        if (this.dist[e.to] > newDist) {
            this.parent[e.to] = e.from;
            this.dist[e.to] = newDist;
        }
    }

    hasPathTo(v: number) {
        return this.parent[v] != -1;
    }

    public pathTo(v: number) {
        if (!this.hasPathTo(v)) {
            return null;
        }
        let path: number[] = [];
        for (let w = v; w != this.s; w = this.parent[w]) {
            path.push(w);
        }
        path.push(this.s);
        return path;
    }


}

function coordinateToNode(x: number, y: number, matrix: PixelMatrix): number {
    let node = (y * matrix.getWidth()) + x;
    return node;
}


function createGraphWithWeights(matrix: PixelMatrix): WeightedGraph {
    let graph: WeightedGraph = new WeightedGraph(matrix.getWidth() * matrix.getHeight() + 2);
    let delta = 1; // This defines how many pixels we connect to the right and left of our current pixel. 1 indicates we connect not only the pixel right below, but also one to the left and one to the right
    for (let y = 1; y < matrix.getHeight(); y++) {
        for (let x = 0; x < matrix.getWidth(); x++) {
            let vFrom = coordinateToNode(x, y - 1, matrix);
            for (let d = -delta; d <= delta; d++) {
                if (x + d >= 0 && x + d < matrix.getWidth()) { // So we dont go past the borders
                    let vTo = coordinateToNode(x + d, y, matrix);
                    let weight = contrast(x, y - 1, x + d, y, matrix);
                    graph.addEdge(vFrom, vTo, weight); // Connect top with bottom pixel and use contrast as edge weight
                }
            }
        }
    }

    // Here we use two additional nodes vSource and vTarget to connect the top and bottom row of the image to the source and target node
    //      vSource  
    //    - - | - -
    //    | | | | |   
    //    x x x x x     <--- This is the image, x represents a pixel
    //    x x x x x
    //    | | | | |
    //    - - | - -
    //     vTarget
    let vSource = matrix.getWidth() * matrix.getHeight();
    let vTarget = matrix.getWidth() * matrix.getHeight() + 1;
    for (let x = 0; x < matrix.getWidth(); x++) {
        let vTop = coordinateToNode(x, 0, matrix);
        graph.addEdge(vSource, vTop, 0);
        let vBottom = coordinateToNode(x, matrix.getHeight() - 1, matrix);
        graph.addEdge(vBottom, vTarget, 0);
    }
    return graph;
}


function contrast(x1: number, y1: number, x2: number, y2: number, matrix: PixelMatrix) {
    let pixel1 = matrix.getPixel(x1, y1);
    let pixel2 = matrix.getPixel(x2, y2);
    // Could probably replace this with a better contrast formula but fine for now
    let contrast = Math.sqrt(Math.pow(pixel1.red - pixel2.red, 2) + Math.pow(pixel1.green - pixel2.green, 2) + Math.pow(pixel1.blue - pixel2.blue, 2));
    return contrast;
}

//This function returns the given matrix with the given path removed
function removeVerticalPath(matrix: PixelMatrix, path: number[]) {
    let newMatrix: RGBAData[][] = [];
    for (let i: number = 0; i < matrix.getHeight(); i++) {
        let k = 0;
        for (let j: number = 0; j < matrix.getWidth() - 1; j++) {
            if(path[i] % matrix.getWidth() == j) {
                k++;    //Punkt wird bei Kopie einfach übersprungen, falls er in path auftritt
            }
            if(!newMatrix[i]) {
                newMatrix[i] = [];
            }
            newMatrix[i][j] = matrix.getPixel(k,i);
            k++;
        }
    }
    return newMatrix;
}

function leastContrastPath(matrix: PixelMatrix): number[] {
    let graph = createGraphWithWeights(matrix);
    let spt = new ShortestPathTopological(graph, matrix.getWidth() * matrix.getHeight());
    let path = spt.pathTo(matrix.getWidth() * matrix.getHeight() + 1);
    if (path == null) {
        return [];
    }
    path.pop();
    path.shift(); // Remove source and target node from path as they are not part of the image (explained above)
    return path;
}

async function contentAwareScale(canvas: CanvasManager, percentage: number, setProgress: (progress: number) => void) {
    alert("This may take a while. This works best if the picture fills the entire canvas (i.e. no blank canvas remainder at the bottom) All objects won't be able to be selected as objects anymore!"); //TODO Maybe a confirmation window?
    canvas.saveCurrentCanvasToUndo();
    // let matrix = await CanvasManager.getRGBADataFromCanvas(canvas.getFabricCanvas());
    var matrix : PixelMatrix = canvas.layerManager.getRGBADataFromActiveLayers();
    let deletions = Math.floor(matrix.getWidth() * percentage); // Scale picture width down by given percentage
    function processDeletion(i: number) {
        if (i < deletions) {
            let path = leastContrastPath(matrix);
            matrix = new PixelMatrix(removeVerticalPath(matrix, path));
            setProgress((i / deletions) * 100); // Update progress
            setTimeout(() => processDeletion(i + 1), 0); // Schedule next deletion
        } else {
            console.log("Content Aware Scale done");
            canvas.clear();

            // canvas.setRGBAMatrix(matrix); 
            // TODO: just add the Matrix As Object.
            // BUT we need to remove all objects before that!
            setProgress(100); // Set progress to 100 when done
            //canvas.saveCurrentCanvasToUndo(); this still causes some issues
        }
    }
    

    // This is a very annoying workaround to get a process bar to update while the function is running
    // There is most likely a better way since this probably slows down the process
    processDeletion(0); 
}

export { contentAwareScale };