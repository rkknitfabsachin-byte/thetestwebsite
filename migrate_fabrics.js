const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data', 'fabrics.json');
let fabrics = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Default specs based on DOT KNIT
const defaultSpecs = {
  gsm: "180 / 200",
  width: "42” – 46”",
  composition: "100% Cotton",
  finish: "Bio Wash / Compact",
  moq: "100 Kg"
};

fabrics = fabrics.map(fabric => {
  if (!fabric.specs) {
    fabric.specs = { ...defaultSpecs };
  }
  return fabric;
});

fs.writeFileSync(dataPath, JSON.stringify(fabrics, null, 2));
console.log('Successfully migrated fabrics.json to include specs.');
