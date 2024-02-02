"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_p5_1 = require("react-p5");
var DrawingArea_1 = require("./DrawingArea");
var FileMenu_1 = require("./FileMenu");
var App = function () {
    var _a = (0, react_1.useState)(null), p5Instance = _a[0], setP5Instance = _a[1];
    var _b = (0, react_1.useState)(null), renderer = _b[0], setRenderer = _b[1];
    var setup = function (p5, canvasParentRef) {
        var renderer = p5.createCanvas(400, 400).parent(canvasParentRef);
        setRenderer(renderer);
        setP5Instance(p5);
    };
    var handleExport = function () {
        /*if (renderer && renderer.canvas) {
          const dataURL = renderer.canvas.toDataURL();
          const link = document.createElement('a');
          link.download = 'drawing.png';
          link.href = dataURL;
          link.click();
        }*/
    };
    var handleImport = function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function (event) {
            var _a;
            var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (file && p5Instance) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img = p5Instance.loadImage(e.target.result, function () {
                        p5Instance.image(img, 0, 0);
                    });
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };
    return (<div>
      <FileMenu_1.default onExport={handleExport} onImport={handleImport}/>
      <react_p5_1.default setup={setup}/>
      <DrawingArea_1.default p5Instance={p5Instance}/>
    </div>);
};
exports.default = App;
