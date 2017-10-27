import City from './City.js';
import Point from './Point.js'

export default (function() {

    var Renderer = function (snap) {
        this.snap = snap;
    };

    Renderer.prototype.snap = null;
    Renderer.prototype.cityRadius = 15;

    Renderer.prototype.drawCity = function(c) {
        var cir = this.snap.circle(c.coords.x, c.coords.y, this.cityRadius);
        cir.attr({
            id: c.name,
            fill: "#4caf50",
            strokeWidth: 0, // CamelCase...
            "fill-opacity": 0.5, // or dash-separated names
        });

        if(c.isExcluded) {
            cir.attr({
                fill: "#ffff99",
                filter: this.snap.filter(Snap.filter.blur(5, 5))
            });
        }

        var text = this.snap.text(c.coords.x, c.coords.y, c.name);
        text.attr({
            "text-anchor": "middle",
            "fill": "#1b5e20"
        });
    };

    Renderer.prototype.drawLine = function drawLine(c1, c2, emphasise=false) {
        var theta1 = Math.atan2(c2.coords.y - c1.coords.y, c2.coords.x - c1.coords.x);
        var theta2 = Math.atan2(c1.coords.y - c2.coords.y, c1.coords.x - c2.coords.x);

        var p1 = new Point(c1.coords.x + this.cityRadius * Math.cos(theta1), c1.coords.y + this.cityRadius * Math.sin(theta1));
        var p2 = new Point(c2.coords.x + this.cityRadius * Math.cos(theta2), c2.coords.y + this.cityRadius * Math.sin(theta2));

        var line = this.snap.line(p1.x, p1.y, p2.x, p2.y);
        var id = [c1.name, c2.name].sort().join();

        if (emphasise === true) {
            line.attr({
                id: id,
                stroke: "#386cb0",
                strokeWidth: 3
            });
        } else {
            line.attr({
                id: id,
                stroke: "#beaed4",
                strokeWidth: 1
            });
        }
    };

    return Renderer;
})();
