import Point from './Point.js';

export default (function() {

    var City = function(name, coords) {
        this.name = name;
        this.coords = coords;
    }
    City.prototype.name = "default";
    City.prototype.adjacent = [];
    City.prototype.parent = NULL;
    City.prototype.h = Number.MAX_VALUE;
    City.prototype.coords = new Point(0, 0);


    return City;
})();
