"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var DrawingArea = function (_a) {
    var p5Instance = _a.p5Instance;
    var canvasRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (p5Instance) {
            canvasRef.current = p5Instance.createGraphics(400, 400);
        }
    }, [p5Instance]);
    (0, react_1.useEffect)(function () {
        if (p5Instance && canvasRef.current) {
            p5Instance.draw = function () {
                var _a;
                console.log("draw");
                p5Instance.background(200);
                if (p5Instance.mouseIsPressed) {
                    (_a = canvasRef.current) === null || _a === void 0 ? void 0 : _a.line(p5Instance.pmouseX, p5Instance.pmouseY, p5Instance.mouseX, p5Instance.mouseY);
                }
                if (canvasRef.current) {
                    p5Instance.image(canvasRef.current, 0, 0);
                }
            };
        }
    }, [p5Instance]);
    return <></>;
};
exports.default = DrawingArea;
