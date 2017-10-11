export default (function() {

    var Heuristic = function() {

    }
    Heuristic.prototype.distBetween = function(a, b) {
        return 1;
    };

    Heuristic.prototype.underEstimateCost = function(current, dest) {
        return this.distBetween(current, dest);
    };


    return Heuristic;
})();
