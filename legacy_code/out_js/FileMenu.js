"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var FileMenu = function (_a) {
    var onExport = _a.onExport, onImport = _a.onImport;
    return (<div>
      <button onClick={onExport}>Bild exportieren</button>
      <button onClick={onImport}>Bild importieren</button>
    </div>);
};
exports.default = FileMenu;
