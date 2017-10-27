import City from './City.js';
import Point from './Point.js'

export default (function() {

    var Renderer = function (snap) {
        this.snap = snap;
    };

    Renderer.prototype.snap = null;
    Renderer.prototype.cityRadius = 15;
    Renderer.prototype.isRendered = false;

    Renderer.prototype.onClickCity = function () {
        $('#edit').removeClass("hidden");
        $('#editInfo').addClass("hidden");

        var nodeInfo = Snap.select("#"+this.node.id).select("circle:nth-child(1)").getBBox();
        $('#xcoord').val(nodeInfo.cx);
        $('#ycoord').val(nodeInfo.cy);
        $('#city').val(this.node.id);
    };

    Renderer.prototype.drawCity = function(c) {
        var cir = this.snap.circle(c.coords.x, c.coords.y, this.cityRadius);
        cir.attr({
            // id: c.name,
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

        var group = this.snap.group(cir, text).attr({id: c.name});
        group.click(this.onClickCity);
    };

    Renderer.prototype.highlightCity = function(c, fill="#386cb0") {
        Snap.select("#"+c.name).select("circle:nth-child(1)").attr({
            fill: fill
        });
    };

    Renderer.prototype.animateCity = function (c) {
        Snap.select("#"+c.name).select("circle:nth-child(1)").attr({
            fill: "#a6cee3",
            r: 1
        }).animate({r:15}, 1000);
    };

    Renderer.prototype.calculateBoundaryPoints = function (c2, c1) {
        const theta1 = Math.atan2(c2.coords.y - c1.coords.y, c2.coords.x - c1.coords.x);
        const theta2 = Math.atan2(c1.coords.y - c2.coords.y, c1.coords.x - c2.coords.x);

        const p1 = new Point(c1.coords.x + this.cityRadius * Math.cos(theta1), c1.coords.y + this.cityRadius * Math.sin(theta1));
        const p2 = new Point(c2.coords.x + this.cityRadius * Math.cos(theta2), c2.coords.y + this.cityRadius * Math.sin(theta2));

        return {p1, p2};
    };

    Renderer.prototype.drawLine = function drawLine(c1, c2) {
        var lineId = [c1.name, c2.name].sort().join("");
        if (Snap.select("#"+lineId) !== null){
            // Line already exists. return.
            return;
        }

        var {p1, p2} = this.calculateBoundaryPoints(c2, c1);

        var line = this.snap.line(p1.x, p1.y, p2.x, p2.y);

        line.attr({
            id: lineId,
            stroke: "#beaed4",
            strokeWidth: 1
        });
    };

    Renderer.prototype.animateLine = function (c1, c2) {
        var {p1, p2} = this.calculateBoundaryPoints(c2, c1);
        var lineId = [c1.name, c2.name].sort().join("");

        Snap.select("#"+lineId).attr({
            strokeWidth: 2,
            x1: p1.x, y1: p1.y,
            x2: p1.x, y2: p1.y
        }).animate({x2: p2.x, y2: p2.y}, 1000);
    };

    Renderer.prototype.drawCities = function (cities) {
        if (this.isRendered === true) {
            this.redrawCities(cities);
            return;
        }

        for (const [name, c] of Object.entries(cities)) {
            this.drawCity(c);
            for (var i = 0; i < c.adjacent.length; i++) {
                var adj = cities[c.adjacent[i]];
                this.drawLine(c, adj);
            }
        }
        this.isRendered = true;
    };

    Renderer.prototype.redrawCity = function(c, cities) {
        Snap.select("#"+c.name).remove();
        this.drawCity(c);

        for (var i = 0; i < c.adjacent.length; i++) {
            var adj = cities[c.adjacent[i]];
            this.redrawLine(c, adj);
        }
    };

    Renderer.prototype.redrawLine = function(c1, c2) {
        var lineId = [c1.name, c2.name].sort().join("");
        lineId = "#"+lineId;

        Snap.select(lineId).remove();
        this.drawLine(c1, c2);
    };

    Renderer.prototype.redrawCities = function (cities) {
        for (const [name, c] of Object.entries(cities)) {
            this.redrawCity(c, cities);
        }
    };

    Renderer.prototype.emphasiseLine = function (c1, c2) {
        var lineId = [c1.name, c2.name].sort().join("");

        Snap.select("#"+lineId).attr({
            stroke: "#386cb0",
            strokeWidth: 3
        });
    };

    Renderer.prototype.drawPath = function (path, cities) {
        var pathString = path.shift();
        var prev = cities[pathString];
        for (var i = 0; i < path.length; i++) {
            var current = cities[path[i]];
            this.emphasiseLine(prev, current, true);
            pathString = pathString + " → " + path[i];
            prev = current;
        }
        return pathString;
    };

    return Renderer;
})();
