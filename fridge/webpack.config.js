const path = require('path');

module.exports = {
    entry: ['./src/myfirebase.js','./src/fridge.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devtool: 'eval-source-map',
};