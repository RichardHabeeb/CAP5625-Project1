import City from './City.js';
import Point from './Point.js'

export default (function() {

    var Parser = function(file) {
        this.file = file;
    };

    Parser.prototype.file = null;

    /* Parse the connections file */
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
                var num_adjacent = adjacents.shift();

                cities[name] = new City(name, adjacents);
            }

            if(typeof callback === "function") {
                callback(cities);
            }
        };

        reader.readAsText(this.file);
    };


    /* Parse the locations file */
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

                cities[name].setCoords(x, y);
            }

            if(typeof callback === "function") {
                callback(cities);
            }
        };

        reader.readAsText(this.file);
    };

    return Parser;
})();
