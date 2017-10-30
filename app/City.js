/*------------------------------------------------------------------------------
                                IMPORTS
------------------------------------------------------------------------------*/
import Point from './Point.js';

/*------------------------------------------------------------------------------
                                EXPORTS
------------------------------------------------------------------------------*/
export default (function() {
    /**
     * Represents a city
     * @constructor
     * @param {String} name
     * @param {Number} adjacent
     */
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
    City.prototype.isExcluded = false;

    return City;
})();
