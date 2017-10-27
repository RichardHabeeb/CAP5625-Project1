import City from './City.js';

export default (function() {

    var Renderer = function (snap) {
        this.snap = snap;
    };

    Renderer.prototype.snap = null;

    Renderer.prototype.drawCity = function(c) {
        var cir = this.snap.circle(c.coords.x, c.coords.y, 15);
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

        var text = this.snap.text(c.coords.x, c.coords.y-15, c.name);
        text.attr({
            "text-anchor": "middle",
            "fill": "#1b5e20"
        });
    };

    Renderer.prototype.drawLine = function drawLine(c1, c2, emphasise=false) {
        var p1 = c1.coords;
        var p2 = c2.coords;

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

