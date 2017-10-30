/*------------------------------------------------------------------------------
                                IMPORTS
------------------------------------------------------------------------------*/
import Point from './Point.js';

/*------------------------------------------------------------------------------
                                EXPORTS
------------------------------------------------------------------------------*/
export default (function() {

    /**
     * Search -
     * The A* algorithm.
     *
     * @constructor
     * @param  {dictionary} cities    A dictionary of cities mapped by name.
     * @param  {Heuristic} heuristic The heuristic functions to use
     * @param  {String} startCity name of start
     * @param  {String} destCity  name of destination
     * @param  {Renderer} renderer  renderer
     */
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

    /**
     * Search.prototype.shortestPathStep -
     * Do a single step in the A* algorithm.
     *
     * @param  {Function} callback function to call when all animations complete
     */
    Search.prototype.shortestPathStep = function (callback) {
        var self = this;

        /* Have we exhausted all options? */
        if (this.frontier.length == 0) {
            this.status = "error";
            if(typeof(callback) === "function") callback(this.status);
            return;
        }

        /* Take best vertex off the frontier */
        var current = this.frontier.shift();
        this.done[current.name] = current;
        this.status = "searching";

        /* Is this the destination? */
        if(current.name == this.destCity) {
            this.path = this.tracePath(this.startCity, this.cities[this.destCity], []).reverse();
            this.status = "done";
            if(typeof(callback) === "function") callback(this.status);
            return;
        }

        /* Handle animation callbacks */
        var numAnimationsComplete = 0;
        var numAnimationsTarget = 0;
        var checkAnimationStatus = function() {
            if(++numAnimationsComplete >= numAnimationsTarget) {
                if(typeof(callback) === "function") callback(self.status);
            }
        }

        /* Iterate through adjacent verticies */
        for(var i=0; i<current.adjacent.length; i++)
        {
            var next = this.cities[current.adjacent[i]];
            if(typeof(next) === "undefined")
                console.log(current);
            if(next.name in this.done || next.isExcluded) continue;

            /* Compute the real distance traveled. Is this less than other paths so far to this vertex? */
            var newDist = current.d + this.heuristic.distBetween(current, next);
            if(newDist >= next.d) continue;

            /* Animate! */
            numAnimationsTarget += 2;
            this.renderer.animateLine(current, next, checkAnimationStatus);
            self.renderer.highlightCity(next, "#ff7f00", checkAnimationStatus);

            /* Compute the heuristic from this adjacent vertex to the destination. */
            next.parent = current;
            next.d = newDist;
            next.h = next.d + this.heuristic.underEstimateCost(next, this.cities[this.destCity]);

            /* Add this adjacent node to the frontier and sort */
            if(this.frontier.indexOf(next.name) === -1) {
                this.frontier.push(next);
                this.frontier.sort(function(a, b) {
                    return a.h - b.h;
                });
            }
        }

        /* Color current node. */
        numAnimationsTarget++;
        this.renderer.highlightCity(current, "#386cb0", checkAnimationStatus);
    };

    /**
     * Search.prototype.shortestPath -
     * Execute as many steps are needed to complete the A* algorithm.
     *
     * @param  {Function} callback function to call when all animations are complete.
     */
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

    /**
     * Search.prototype.tracePath -
     * Trace the discovered path backwards recursively.
     *
     * @param  {String} startCityName
     * @param  {City} destCity
     * @param  {Array} path
     * @return {Array}
     */
    Search.prototype.tracePath = function(startCityName, destCity, path) {
        if(typeof(destCity) === "undefined" || destCity === null) return;

        console.log(destCity.name);
        path.push(destCity.name);

        if(destCity.name === startCityName) return path;
        return this.tracePath(startCityName, destCity.parent, path);
    };

    return Search;
})();
