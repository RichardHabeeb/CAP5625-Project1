/*------------------------------------------------------------------------------
                                IMPORTS
------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------
                                EXPORTS
------------------------------------------------------------------------------*/
export default (function() {

    /**
     * Point -
     * X,Y pair as a coordinate on the cartesian plane.
     *
     * @constructor
     * @param  {Number} x
     * @param  {Number} y
     */
    var Point = function(x, y) {
        this.x = x;
        this.y = y;
    };
    Point.prototype.x = 0;
    Point.prototype.y = 0;

    /**
     * Point.prototype.dist -
     * The distance between this point and some other point
     *
     * @param  {Point} p
     * @return {Number}
     */
    Point.prototype.dist = function(p) {
        return Math.sqrt((this.x - p.x)*(this.x - p.x) + (this.y - p.y)*(this.y - p.y));
    };

    return Point;
})();
