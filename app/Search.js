import Point from './Point.js'

export default (function() {

    var Search = function(cities, heuristic, startCity, destCity, renderer) {
        this.cities = cities;
        this.heuristic = heuristic;

        this.startCity = startCity;
        this.destCity = destCity;

        this.frontier = [this.cities[startCity]];
        this.done = {};
        this.cities[startCity].d = 0;

        this.path = "";
        this.status = "start";

        this.renderer = renderer
    };

    Search.prototype.shortestPathStep = function (callback) {
        var self = this;

        if (this.frontier.length == 0) {
            this.status = "error";
            if(typeof(callback) === "function") callback(this.status);
            return;
        }

        var current = this.frontier.shift();
        this.done[current.name] = current;
        this.status = "searching";

        // Color current node.
        this.renderer.highlightCity(current);

        if(current.name == this.destCity) {
            this.path = this.tracePath(this.startCity, this.cities[this.destCity], []).reverse();
            this.status = "done";
            if(typeof(callback) === "function") callback(this.status);
            return;
        }

        var numAnimationsComplete = 0;
        var numAnimationsTarget = 0;
        var checkAnimationStatus = function() {
            if(++numAnimationsComplete >= numAnimationsTarget) {
                if(typeof(callback) === "function") callback(self.status);
            }
        }

        for(var i=0; i<current.adjacent.length; i++)
        {
            var next = this.cities[current.adjacent[i]];
            if(typeof(next) === "undefined")
                console.log(current);
            if(next.name in this.done || next.isExcluded) continue;

            var newDist = current.d + this.heuristic.distBetween(current, next);
            if(newDist >= next.d) continue;

            numAnimationsTarget += 2;

            this.renderer.animateLine(current, next, checkAnimationStatus);
            self.renderer.highlightCity(next, "#ff7f00", checkAnimationStatus);

            next.parent = current;
            next.d = newDist;
            next.h = next.d + this.heuristic.underEstimateCost(next, this.cities[this.destCity]);

            if(this.frontier.indexOf(next.name) === -1) {
                this.frontier.push(next);
                this.frontier.sort(function(a, b) {
                    return a.h - b.h;
                });
            }
        }

        // Color current node Done.
        numAnimationsTarget += 1;
        this.renderer.highlightCity(current, "#386cb0", checkAnimationStatus);
    };

    Search.prototype.shortestPath = function(callback) {
        var self = this;
        var loop = function(status) {
            if (status === "done" || status === "error") {
                if(typeof(callback) === "function") callback(status);
            } else {
                self.shortestPathStep(loop);
            }

        }
        this.shortestPathStep(loop);
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
