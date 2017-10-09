var Rollup = require('broccoli-rollup');
var app = 'app';

module.exports = new Rollup(app, {
  // nodeModulesPath: string Defaults to process.cwd()
  rollup: {
    entry: 'index.js',
    dest: 'my-app.js',
    // cache: true|false Defaults to true
  }
});
