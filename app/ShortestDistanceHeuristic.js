/*------------------------------------------------------------------------------
                                IMPORTS
------------------------------------------------------------------------------*/
import Heuristic from './Heuristic.js';

/*------------------------------------------------------------------------------
                                EXPORTS
------------------------------------------------------------------------------*/
export default (function() {


    /**
     * ShortestDistanceHeuristic -
     * Straight line distance heuristic functions for the A* algorithm.
     *
     * @constructor
     */
    var ShortestDistanceHeuristic = function() {

    };

    /* Inherit parent prototype. */
    ShortestDistanceHeuristic.prototype = Object.create(Heuristic.prototype);


    /**
     * ShortestDistanceHeuristic.prototype.distBetween -
     * Overwrite parent distance between function to get the straight line distance.
     *
     * @param  {City} a
     * @param  {City} b
     * @return {Number}
     */
    ShortestDistanceHeuristic.prototype.distBetween = function(a, b) {
        return a.coords.dist(b.coords);
    };

    return ShortestDistanceHeuristic;
})();
