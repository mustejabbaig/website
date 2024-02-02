import { CanvasManager } from "../../Utils/CanvasManager";

describe("CanvasManager", () => {
    test("CanvasManager is instantiable", () => {
        expect(new CanvasManager()).toBeInstanceOf(CanvasManager);
    });
});