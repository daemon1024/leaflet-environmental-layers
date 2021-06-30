const { generateSpreadsheetLayer } = require("./genSpreadsheetLayer");

let layerData = JSON.parse(fs.readFileSync("input.json", "utf8"));
generateSpreadsheetLayer(
  layerData,
  "../src/spreadsheetLayers/layers.json",
  "../src/info.json",
  true
);
