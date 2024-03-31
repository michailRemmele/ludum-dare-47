'use strict';

const path = require('path');

module.exports = {
  build: path.join(__dirname, 'build'),
  buildEditor: path.join(__dirname, 'build-editor'),
  public: path.join(__dirname, 'public'),
  indexHtml: path.join(__dirname, 'public/index.html'),
  indexJs: path.join(__dirname, 'src/index.js'),
  editorIndexJs: path.join(__dirname, 'editor/index.js'),
  src: path.join(__dirname, 'src'),
  resources: path.join(__dirname, 'public/resources'),
  graphicResources: path.join(__dirname, 'public/resources/graphics'),
  nodeModules: path.join(__dirname, 'node_modules'),
};
