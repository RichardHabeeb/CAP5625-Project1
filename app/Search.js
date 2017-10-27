export default (function() {

    var Search = function(cities, heuristic, startCity, destCity) {
        this.cities = cities;
        this.heuristic = heuristic;

        this.startCity = startCity;
        this.destCity = destCity;

        // this.frontier = [startCity];
        this.frontier = [this.cities[startCity]];
        this.done = {};
        this.cities[startCity].d = 0;

        this.path = "";
        this.status = "start";
    };

    Search.prototype.shortestPathStep = function () {
        if (this.frontier.length == 0) {
            this.status = "error";
            return this.status;
        }

        // var current = this.cities[this.frontier.shift()];
        var current = this.frontier.shift();
        this.done[current.name] = current;
        this.status = "searching";

        if(current.name == this.destCity) {
            console.log("Done.");
            this.path = this.tracePath(this.startCity, this.cities[this.destCity], []);
            this.status = "done";
            console.log(this.path);
            return this.status;
        }

        for(var i=0; i<current.adjacent.length; i++)
        {
            var next = this.cities[current.adjacent[i]];
            if(typeof(next) === "undefined")
                console.log(current);
            if(next.name in this.done || next.isExcluded) continue;

            var newDist = current.d + this.heuristic.distBetween(current, next);
            if(newDist >= next.d) continue;

            next.shape.attr({fill: "#000"});

            next.parent = current;
            next.d = newDist;
            next.h = next.d + this.heuristic.underEstimateCost(next, this.cities[this.destCity]);

            if(this.frontier.indexOf(next.name) == -1) {
                console.log("push next.");

                this.frontier.push(next);
                this.frontier.sort(function(a, b) {
                    return a.h - b.h;
                });
                console.log(this.frontier);
            }
        }

        return this.status;
    };

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

    /* Trace the discovered path backwards recursively */
    Search.prototype.tracePath = function(startCityName, destCity, path) {
        if(typeof(destCity) === "undefined" || destCity === null) return;

        console.log(destCity.name);
        path.push(destCity.name);

        if(destCity.name === startCityName) return path;
        return this.tracePath(startCityName, destCity.parent, path);
    };

    return Search;
})();
