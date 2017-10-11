import City from './City.js';

export default (function() {

    var Parser = function(file) {
        this.file = file;
    };

    Parser.prototype.file = null;

    Parser.prototype.getCities = function() {
        var reader = new FileReader();
        // var cities = new Map();
        var cities = new Object();

        reader.onload = function(){
            var lines = this.result.split('\n');

            for(let lineNum = 0; lineNum < lines.length; lineNum++){
                var line = lines[lineNum];

                if (line === "END"){
                    break
                }

                var l = line.split(/ +/);   // split on any number of spaces.
                var name = l.pop();
                var num_adjacent = l.pop();

                cities[name] = new City(name, num_adjacent, l);
                // cities.set(name, new City(name, num_adjacent, l));
            }
        };
        reader.readAsText(this.file);

        return cities;
    };

    return Parser;
})();
