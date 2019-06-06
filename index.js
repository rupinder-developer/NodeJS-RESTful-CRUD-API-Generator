const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, 'Schemas');

fs.readdirSync(directoryPath);