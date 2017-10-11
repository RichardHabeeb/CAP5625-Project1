export default (function() {

    var Point = function(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.x = 0;
    Point.prototype.y = 0;
    Point.prototype.dist = function(p) {
        return Math.sqrt((this.x - p.x)*(this.x - p.x) + (this.y - p.y)*(this.y - p.y));
    }


    return Point;
})();
