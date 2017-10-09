var Rollup = require('broccoli-rollup');
var app = 'app';

module.exports = new Rollup(app, {
  // nodeModulesPath: string Defaults to process.cwd()
  rollup: {
    entry: 'Main.js',
    dest: 'index.js',
    format: 'iife'
    // cache: true|false Defaults to true
  }
});
