var Rollup = require('broccoli-rollup');
var lib = 'app';

module.exports = new Rollup(lib, {
  // nodeModulesPath: string Defaults to process.cwd()
  rollup: {
    entry: 'index.js',
    dest: 'my-app.js',
    // cache: true|false Defaults to true
  }
});
