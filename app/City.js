import Point from './Point.js';

export default (function() {

    var City = function(name, num_adjacent, adjacent) {
        this.name = name;
        this.num_adjacent = num_adjacent;
        this.adjacent = adjacent;
    };
    City.prototype.name = "default";
    City.prototype.num_adjacent = 0;
    City.prototype.adjacent = [];
    City.prototype.parent = null;
    City.prototype.h = Number.MAX_VALUE;
    City.prototype.coords = new Point(0, 0);

    City.prototype.set_coords = function (x, y) {
        this.coords = new Point(x, y)
    };

    return City;
})();
