/*------------------------------------------------------------------------------
                                IMPORTS
------------------------------------------------------------------------------*/
import City from './City.js';
import Point from './Point.js'
/*------------------------------------------------------------------------------
                                EXPORTS
------------------------------------------------------------------------------*/
export default (function() {

    /**
     * Parser -
     * A parser for both connections and locations files.
     *
     * @param file the file to be parsed
     * @constructor
     */
    var Parser = function(file) {
        this.file = file;
    };

    Parser.prototype.file = null;

    /**
     * Parser.prototype.getCities -
     * Parse the connections file and initialize each city.
     *
     * @param {function} callback function to call when the entire file is parsed.
     */
    Parser.prototype.getCities = function(callback) {
        var reader = new FileReader();
        var cities = {};

        reader.onload = function(){
            var lines = this.result.split('\n');

            for(let lineNum = 0; lineNum < lines.length; lineNum++){
                var line = lines[lineNum];

                if (line === "END"){
                    break
                }

                var l = line.split(/[\s]+/);   // split on any number of spaces.
                var adjacents = l.map(function(cv) {
                    return cv.trim();
                });
                if(adjacents[adjacents.length-1]=="") adjacents.pop();
                var name = adjacents.shift();
                var num_adjacent = adjacents.shift();  // remove the number of adjacent cities.

                cities[name] = new City(name, adjacents);
            }

            if(typeof callback === "function") {
                callback(cities);
            }
        };

        reader.readAsText(this.file);
    };

    /**
     * Parser.prototype.addLocations -
     * Parse the locations file and update the location of each city.
     *
     * @param {City []} cities the list of cities from the connections file.
     * @param callback function to call when the entire file is parsed.
     */
    Parser.prototype.addLocations = function(cities, callback) {
        var reader = new FileReader();

        reader.onload = function(){
            var lines = this.result.split('\n');

            for(let lineNum = 0; lineNum < lines.length; lineNum++){
                var line = lines[lineNum];

                if (line === "END"){
                    break
                }

                var l = line.split(/[\s]+/);   // split on any number of spaces.
                var locs = l.map(function(cv) {
                    return cv.trim();
                });
                if(locs[locs.length-1]=="") locs.pop();
                var name = locs.shift();
                var x = locs.shift();
                var y = locs.shift();

                cities[name].coords = new Point(parseInt(x), parseInt(y));
            }

            if(typeof callback === "function") {
                callback(cities);
            }
        };

        reader.readAsText(this.file);
    };

    return Parser;
})();
