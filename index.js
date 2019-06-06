const ucfirst = require('ucfirst');
const rimraf = require("rimraf");
const path = require('path');
const fs = require('fs');

const schemasPath = path.join(__dirname, 'schemas');
const buildPath = path.join(__dirname, 'build');
const modelsPath = path.join(__dirname, 'build/models');
const routesPath = path.join(__dirname, 'build/routes');
const controllerPath = path.join(__dirname, 'build/controller');
const tempPath = path.join(buildPath, 'temp');

if (!fs.existsSync(buildPath)) {
    fs.mkdirSync(buildPath);
}
if (!fs.existsSync(modelsPath)) {
    fs.mkdirSync(modelsPath);
}
if (!fs.existsSync(routesPath)) {
    fs.mkdirSync(routesPath);
}
if (!fs.existsSync(controllerPath)) {
    fs.mkdirSync(controllerPath);
}

rimraf.sync(tempPath);
fs.mkdirSync(tempPath);

const indexJs = fs.readFileSync(path.join(__dirname, 'app/src/index.src'), 'utf8');
fs.writeFileSync(path.join(buildPath, 'index.js'), indexJs);

let appRoutes = fs.readFileSync(path.join(__dirname, 'app/src/app-routes.src'), 'utf8');
if (!fs.existsSync(path.join(tempPath, 'app-routes.src'))) {
    fs.writeFileSync(path.join(tempPath, 'app-routes.src'), appRoutes);
}

const schemas = fs.readdirSync(schemasPath);
for (key in schemas) {
    const schema = schemas[key].split('.');
    if (schema[schema.length - 1].toLowerCase() === 'schema') {

        // Reading Schema Content
        const schemaContent = fs.readFileSync(path.join(schemasPath, schemas[key]))

        // Creating Model
        const modelName = ucfirst(schema[0]);
        const modelContent = `const mongoose = require('mongoose');\n\nconst ${schema[0]}Schema = mongoose.Schema(${schemaContent});\n\nmodule.exports = mongoose.model('${modelName}', ${schema[0]}Schema);`;
        fs.writeFileSync(path.join(buildPath, `models/${modelName}.js`), modelContent);

        // Creating Routes
        fs.appendFileSync(path.join(tempPath, 'app-routes.src'), `\napp.use('/${schema[0]}', require('./routes/${schema[0]}'))\n`);
        fs.writeFileSync(path.join(routesPath, `${schema[0]}.js`), `const express = require('express');\nconst router = express.Router();\n\n// Controllers\nconst ${schema[0]}Controller = require('../controller/${schema[0]}.js');\n\nrouter.delete('/delete', ${schema[0]}Controller.delete);\nrouter.patch('/update', ${schema[0]}Controller.update);\nrouter.post('/save', ${schema[0]}Controller.save);\nrouter.get('/get', ${schema[0]}Controller.get);\n\nmodule.exports = router;`);
        
        // Creating Controller
        fs.writeFileSync(path.join(controllerPath, `${schema[0]}.js`), 'This is Controller');
    }
}

const appErrorHandling = fs.readFileSync(path.join(__dirname, 'app/src/app-error-handling.src'), 'utf8');
appRoutes = fs.readFileSync(path.join(tempPath, 'app-routes.src'), 'utf8');
fs.writeFileSync(path.join(buildPath, 'app.js'), appRoutes.concat(appErrorHandling));
rimraf.sync(tempPath);