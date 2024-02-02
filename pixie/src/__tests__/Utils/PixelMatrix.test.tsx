import { PixelMatrix, RGBAData } from "../../Utils/PixelMatrix";

describe('PixelMatrix', () => {
  let matrixData: RGBAData[][];
  let pixelMatrix: PixelMatrix;

  beforeEach(() => {
    // Initialize a sample matrix for testing
    matrixData = [
      [{ red: 255, green: 0, blue: 0, alpha: 1 }, { red: 0, green: 255, blue: 0, alpha: 1 }],
      [{ red: 0, green: 0, blue: 255, alpha: 1 }, { red: 255, green: 255, blue: 255, alpha: 1 }]
    ];
    pixelMatrix = new PixelMatrix(matrixData);
  });

  test('constructor initializes width and height correctly', () => {
    expect(pixelMatrix.getWidth()).toBe(2);
    expect(pixelMatrix.getHeight()).toBe(2);
  });

  test('getRow returns correct row data', () => {
    const row = pixelMatrix.getRow(1);
    expect(row).toEqual(matrixData[1]);
  });

  test('getColumn returns correct column data', () => {
    const column = pixelMatrix.getColumn(1);
    expect(column).toEqual([matrixData[0][1], matrixData[1][1]]);
  });

  test('getPixel returns correct pixel data', () => {
    const pixel = pixelMatrix.getPixel(1, 1);
    expect(pixel).toEqual(matrixData[1][1]);
  });

  test('setPixel updates pixel data correctly', () => {
    const newPixel: RGBAData = { red: 128, green: 128, blue: 128, alpha: 1 };
    pixelMatrix.setPixel(1, 1, newPixel);
    expect(pixelMatrix.getPixel(1, 1)).toEqual(newPixel);
  });

  test('clone creates a deep copy of the matrix', () => {
    const clone = pixelMatrix.clone();
    expect(clone.getMatrix()).toEqual(matrixData);
    expect(clone).not.toBe(pixelMatrix);
  });

  test('position2DTo1D and position1DTo2D are inverses', () => {
    const x = 1;
    const y = 1;
    const index = PixelMatrix.position2DTo1D(pixelMatrix, x, y);
    expect(index).toBe(3); // Based on the matrix size
    const pos = PixelMatrix.position1DTo2D(pixelMatrix, index);
    expect(pos).toEqual({ x, y });
  });
});
