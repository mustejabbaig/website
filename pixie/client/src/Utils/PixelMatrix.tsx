import { fabric } from 'fabric';
export class RGBAData {
  red: number = 0;
  green: number = 0;
  blue: number = 0;
  alpha: number = 0;

  constructor(r: number | undefined, g: number | undefined,b: number | undefined,a: number | undefined)
  {
    if(r) this.red = r;
    else this.red = 0;
    if(g) this.green = g;
    else this.green = 0;
    if(b) this.blue = b;
    else this.blue = 0;
    if(a) this.alpha = a;
    else this.alpha = 0;
  }
}

export class PixelMatrix {
  width: number;
  height: number;
  matrix: RGBAData[][];

  constructor(matrix: RGBAData[][]) {
    //!!! IMPORTANT !!! I'm pretty sure this was mixed up
    //! previously these two were defined as this.width = matrix.length and this height = matrix[0].length
    //! So if you have any issues with your methods that use these attributes this may be why
    this.width = matrix[0].length;
    this.height = matrix.length;
    this.matrix = matrix;
  }

  /**
   * 
   * @param matrix the Pixeldata to get the width from
   * @param x width position 
   * @param y height position
   * @returns the index of the Pixeldata corresponding to x and y
   */
  static position2DTo1D(matrix: PixelMatrix, x: number, y: number): number {
    return y * matrix.getWidth() + x;
  }

  /**
   * 
   * @param matrix to look up the index from
   * @param index index to look up
   * @returns x (width) and y (height) position
   */
  static position1DTo2D(matrix: PixelMatrix, index: number): {x: number, y: number} {
    let  retX = index % matrix.getWidth();
    let retY = index - retX;
    retY/= matrix.getWidth();

    return {
      x: retX, 
      y: retY
    };
  }

  /**
   * 
   * @param y The row to return as array
   * @returns the array as RGBA (references)
   */
  getRow(y: number): RGBAData[] {
    if (y < 0 || y >= this.height) {
      throw new Error("PixelMatrix.getRow: Index out of bounds");
    }
    return this.matrix[y];
  }

  /**
   * 
   * @param x the column to return as array
   * @returns the array as RGBA (references)
   */
  getColumn(x: number): RGBAData[] {

    let col: RGBAData[] = [];
    for (let y: number = 0; y < this.height; y++) {
      col.push(this.getPixel(x,y));
    }
    return col;
  }

  /**
   * 
   * @param x width position
   * @param y height position
   * @returns RGBA as reference
   */
  getPixel(x: number, y: number): RGBAData {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      throw new Error("PixelMatrix.getPixel: Index out of bounds");
    }
    return this.matrix[y][x];
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  /**
   * 
   * @returns reference to the RGBA Array
   */
  public getMatrix(): RGBAData[][] {
    return this.matrix;
  }

  /**
   * @todo this doesn't really copy.
   * @returns the copy (reference)
   */
  public clone(): PixelMatrix {
    let matrix: RGBAData[][] = [];
    for (let x: number = 0; x < this.width; x++) {
      let row: RGBAData[] = [];
      for (let y: number = 0; y < this.height; y++) {
        row.push(this.matrix[y][x]);
      }
      matrix.push(row);
    }
    return new PixelMatrix(matrix);
  }

  /**
   * 
   * @param x width position
   * @param y height position
   * @param pixel 
   */
  public setPixel(x: number, y: number, pixel: RGBAData) {
    this.matrix[y][x] = pixel;
  }

  /**
   * 
   * @returns true, if the array is black (rgb(0,0,0)) -- Transparency is not important in this case
   */
  public isOnlyZeroes(): boolean {
    for (let x: number = 0; x < this.width; x++) {
      for (let y: number = 0; y < this.height; y++) {
        if (this.matrix[y][x].red != 0 || this.matrix[y][x].green != 0 || this.matrix[y][x].blue != 0) {
          return false;
        }
      }
    }
    return true;
  }


  /**
   * 
   * @returns a image URL for WhatEVER use :))
   */
  public  convertToImgUrl(addOnLoad : boolean = false) : string
  {
    let offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = this.width;
    offScreenCanvas.height = this.height;
    let offCtx = offScreenCanvas.getContext('2d');

    if (offCtx === null) {
      throw new Error("offCtx is null");
    }

    let imageData = offCtx.createImageData(this.width, this.height);
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let index = (y * this.width + x) * 4;
        let pixel = this.getPixel(x, y);
        imageData.data[index] = pixel.red;
        imageData.data[index + 1] = pixel.green;
        imageData.data[index + 2] = pixel.blue;
        imageData.data[index + 3] = pixel.alpha;
      }
    }
    offCtx.putImageData(imageData, 0, 0);
    return offScreenCanvas.toDataURL()
  }


  /**
   * 
   * @returns a more or less raw rgba (int) array, contained in "ImageData"
   * 
   */
  public toImageData(): ImageData {
    const height = this.getHeight();
    const width = this.getWidth();
    const imageData = new ImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixel = this.getPixel(x, y);
        const index = (y * width + x) * 4;
        imageData.data[index] = pixel.red;
        imageData.data[index + 1] = pixel.green;
        imageData.data[index + 2] = pixel.blue;
        imageData.data[index + 3] = pixel.alpha;
      }
    }
    return imageData;
  }
}
