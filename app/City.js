import Point from './Point.js';

export default (function() {

    var City = function(name, adjacent) {
        this.name = name;
        this.adjacent = adjacent;
    };
    City.prototype.name = "default";
    City.prototype.adjacent = [];
    City.prototype.parent = null;
    City.prototype.h = Number.MAX_VALUE;
    City.prototype.d = Number.MAX_VALUE;
    City.prototype.coords = new Point(0, 0);

    City.prototype.set_coords = function (x, y) {
        this.coords = new Point(x, y)
    };

    return City;
})();
