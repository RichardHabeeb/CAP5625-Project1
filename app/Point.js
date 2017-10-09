export default (function() {

    var Point = function(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.x = 0;
    Point.prototype.y = 0;


    return Point;
})();
