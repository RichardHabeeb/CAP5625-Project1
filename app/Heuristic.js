/*------------------------------------------------------------------------------
                                IMPORTS
------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------
                                EXPORTS
------------------------------------------------------------------------------*/
export default (function() {
    /**
     * Heuristic -
     * Heuristic functions for the A* algorithm
     *
     * @constructor
     */
    var Heuristic = function() {};

    /**
     * Heuristic.prototype.distBetween -
     * The distance from start to a neighbor for any two directly connected cities.
     *
     * @param  {City} a
     * @param  {City} b
     * @return {Number}
     */
    Heuristic.prototype.distBetween = function(a, b) {
        return (a.name === b.name) ? 0 : 1;
    };

    /**
     * Heuristic.prototype.underEstimateCost -
     * Returns an underestimate distance between two cities
     *
     * @param  {City} current
     * @param  {City} dest
     * @return {Number}
     */
    Heuristic.prototype.underEstimateCost = function(current, dest) {
        return this.distBetween(current, dest); /* We can't do better for an underestimate here (in this case). */
    };

    return Heuristic;
})();
