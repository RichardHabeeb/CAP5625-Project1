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
        while(frontier.length > 0)
        {
            var current = this.cities[frontier.shift()];
            done[current.name] = current;

            if(current.name == destCity) {
                //TODO print path.
                console.log("yay");
                break;
            }

            for(var i=0; i<current.adjacent.length; i++)
            {
                var next = this.cities[current.adjacent[i]];
                if(typeof(next) === "undefined")
                    console.log(current);
                if(next.name in done) continue;

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
    };


    return Search;
})();
