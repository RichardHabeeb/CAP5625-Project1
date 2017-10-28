import City from './City.js';
import Point from './Point.js'

export default (function() {

    var Renderer = function (snap) {
        this.snap = snap;
        this.g = this.snap.group();
    };

    Renderer.prototype.snap = null;
    Renderer.prototype.cityRadius = 15;
    Renderer.prototype.isRendered = false;
    Renderer.prototype.onClickCity = function () {};

    Renderer.prototype.drawCity = function(c) {
        var cir = this.snap.circle(c.coords.x, c.coords.y, this.cityRadius);
        cir.attr({
            // id: c.name,
            fill: "#ccc",
            strokeWidth: 0, // CamelCase...
            "fill-opacity": 0.5, // or dash-separated names
        });

        if(c.isExcluded) {
            cir.attr({
                fill: "#ffff99",
                filter: this.snap.filter(Snap.filter.blur(5, 5))
            });
        }

        var text = this.snap.text(c.coords.x, c.coords.y+5, c.name);
        text.attr({
            "text-anchor": "middle",
            //"fill": "#1b5e20"
            "fill": "#000",

        });

        var group = this.snap.group(cir, text).attr({id: c.name, opacity: 0.0});
        group.animate({'opacity': 1.0}, 1000);
        group.click(this.onClickCity);
        this.g.add(group);
    };

    Renderer.prototype.highlightCity = function(c, fill="#386cb0", callback) {
        Snap.select("#"+c.name).select("circle:nth-child(1)").animate({"fill": fill}, 250, mina.linear, callback);
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
            stroke: "#ddd",
            strokeWidth: 1,
            opacity: 0.0
        });
        line.animate({'opacity':1.0}, 1000);

        this.g.add(line);
    };

    Renderer.prototype.animateLine = function (c1, c2, callback) {
        var {p1, p2} = this.calculateBoundaryPoints(c2, c1);
        var lineId = [c1.name, c2.name].sort().join("")+"_searched";

        var line = this.snap.line(p1.x, p1.y, p2.x, p2.y);

        line.attr({
            id: lineId,
            stroke: "#ddd",
            strokeWidth: 3,
            strokeDasharray: "500",
            strokeDashoffset: 500,
            strokeMiterlimit: 10});

        Snap.animate(500, 0, function( value ){
            line.attr({ 'strokeDashoffset': value })
        }, 500, mina.easeinout, callback);

        this.g.add(line);
    };

    Renderer.prototype.drawCities = function (cities) {
        for (const [name, c] of Object.entries(cities)) {
            this.drawCity(c);
            for (var i = 0; i < c.adjacent.length; i++) {
                var adj = cities[c.adjacent[i]];
                this.drawLine(c, adj);
            }
        }
        this.isRendered = true;
    };

    Renderer.prototype.clear = function(callback) {
        var self = this;
        this.g.animate({"alpha": 0}, 500, mina.linear, function() {
            self.g.remove();
            self.g = self.snap.group();
            if(typeof(callback) === "function") callback();
        });
    }


    Renderer.prototype.emphasiseLine = function (c1, c2) {
        var lineId = [c1.name, c2.name].sort().join("")+"_searched";
        Snap.select("#"+lineId).animate({stroke: "#1b5e20"}, 500);
    };

    Renderer.prototype.drawPath = function (path, cities) {
        var pathString = path.shift();
        var prev = cities[pathString];
        this.highlightCity(prev, "#4caf50");
        for (var i = 0; i < path.length; i++) {
            var current = cities[path[i]];
            this.emphasiseLine(prev, current, true);
            this.highlightCity(current, "#4caf50");
            pathString = pathString + " → " + path[i];
            prev = current;
        }
        return pathString;
    };

    return Renderer;
})();
