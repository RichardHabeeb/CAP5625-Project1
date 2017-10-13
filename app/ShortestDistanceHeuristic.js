import Heuristic from './Heuristic.js';

export default (function() {

    var ShortestDistanceHeuristic = function() {
    }

    ShortestDistanceHeuristic.prototype = Object.create(Heuristic.prototype);
    ShortestDistanceHeuristic.prototype.distBetween = function(a, b) {
        return a.coords.dist(b.coords);
    };

    return ShortestDistanceHeuristic;
})();
