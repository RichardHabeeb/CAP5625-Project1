export default (function() {

    var Search = function(cities, heuristic) {
        this.cities = cities;
        this.heuristic = heuristic;
    }
    Search.prototype.shortestPath = function(startCity, destCity) {
        console.log(this.cities);
        this.cities[startCity].d = 0;
        var frontier = [startCity];
        var done = {};
        var dest;

        while(frontier.length > 0)
        {
            var current = this.cities[frontier.shift()];
            done[current.name] = current;

            if(current.name == destCity) {
                dest = current;
                break;
            }

            for(var i=0; i<current.adjacent.length; i++)
            {
                var next = this.cities[current.adjacent[i]];
                if(typeof(next) === "undefined")
                    console.log(current);
                if(next.name in done || next.isExcluded) continue;

                var newDist = current.d + this.heuristic.distBetween(current, next);
                if(newDist >= next.d) continue;

                next.parent = current;
                next.d = newDist;
                next.h = next.d + this.heuristic.underEstimateCost(next, this.cities[destCity]);

                if(frontier.indexOf(next.name) == -1) {
                    frontier.push(next.name);
                    frontier.sort(function(a, b) {
                        return a.h - b.h;
                    });
                }
            }
        }

        return this.tracePath(startCity, dest, []);
    };

    Search.prototype.tracePath = function(startCityName, destCity, path) {
        if(typeof(destCity) === "undefined" || destCity === null) return;

        console.log(destCity.name);
        path.push(destCity.name);

        if(destCity.name === startCityName) return path;
        return this.tracePath(startCityName, destCity.parent, path);
    };

    return Search;
})();
