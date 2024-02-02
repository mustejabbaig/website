import { fabric } from 'fabric';
import CanvasManager from './CanvasManager';
import { PixelMatrix, RGBAData } from './PixelMatrix';

type Vertex = number;

export interface Edge {
  to: Vertex;
  from: Vertex;
  weight: number;
}

export class WeightedGraph {
    V: number;
    E: number;
    edges: Edge[];
    adj: Edge[][];
    // For Depth First Search
    marked: boolean[];
    parent: number[];
    onStack: boolean[];
    reversePost: Vertex[];
    cycle: Vertex[];


    constructor(V: number) {
        this.V = V;
        this.E = 0;
        this.edges = [];
        this.adj = [];
        this.marked = [];
        this.parent = [];
        this.onStack = [];
        this.reversePost = [];
        this.cycle = [];
    }

    addEdge(v: Vertex, w: Vertex, weight: number) {
        this.edges.push({to: w, from: v, weight: weight});
        this.E++;
        if (!this.adj[v]) {
            this.adj[v] = [];
        }
        this.adj[v].push({to: w, from: v, weight: weight});
    }

    // Depth First Search as seen in Algorithms and Data Structures
    dfs(v: Vertex) {
        this.marked[v] = true;
        this.onStack[v] = true;
        for (let e of this.incident(v)) {
            let w = e.to;
            if(this.cycle.length > 0) {
                return;
            }
            if (!this.marked[w]) {
                this.parent[w] = v;
                this.dfs(w);
            } else if (this.onStack[w]) {
                // Cycle detected
                this.cycle = [];
                this.cycle.push(w);
                for (let x = v; x != w; x = this.parent[x]) {
                    this.cycle.push(x);
                }
                this.cycle.push(w);
                return;

            }
        }
        this.onStack[v] = false;
        this.reversePost.push(v);
    }

    public reversePostOrder(): Vertex[] {
        return this.reversePost;
    }

    public incident(v: Vertex): Edge[] {
        if (v < 0 || v >= this.V) {
            console.log('Vertex out of bounds');
            return [];
        }
        return this.adj[v] || [];
    }
}