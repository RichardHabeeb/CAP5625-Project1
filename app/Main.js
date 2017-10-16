import City from './City.js';
import Heuristic from './Heuristic.js';
import ShortestDistanceHeuristic from './ShortestDistanceHeuristic.js';
import Parser from './Parser.js';
import Search from './Search.js';


$(document).ready(function() {
    $('select').material_select();

    var cities = null;

    var s = Snap("#svg");


    /* Draw a single city given a city object TODO: move rendering to a new class */
    function DrawCity(c) {
        if (c.isExcluded === false) {
            var cir = s.circle(c.coords.x, c.coords.y, 15);
            cir.attr({
                fill: "#4caf50",
                strokeWidth: 0,
                "fill-opacity": 0.5,
            });
            var text = s.text(c.coords.x, c.coords.y + 5, c.name);
            text.attr({
                "text-anchor": "middle",
                "fill": "#1b5e20"
            });

            $.each(c.adjacent, function (i) {
                    var adj = cities[c.adjacent[i]];
                    if (adj.isExcluded === false) {
                        drawLine(c.coords.x, c.coords.y, adj.coords.x, adj.coords.y);
                    }
                }
            );
        }
    }


    /* Draw a line on the canvas TODO: change this to cities or points */
    function drawLine(x1, y1, x2, y2, emphasise=false) {
        var line = s.line(x1, y1, x2, y2);
        console.log(x1 + " " + x2);
        if (emphasise === true) {
            line.attr({
                stroke: "#386cb0",
                strokeWidth: 3
            });
        } else {
            line.attr({
                stroke: "#beaed4",
                strokeWidth: 1
            });
        }
    }


    /* Call the parser once we have a connections file */
    $("#connections").on("change", function() {
        const fileList = this.files;
        const connectionsFile = fileList[0];

        console.log("Connections file: " + connectionsFile.name);
        (new Parser(connectionsFile)).getCities(function(c) {
            console.log("File read:", c);

            $("#locationsBtn").removeClass("disabled");
            cities = c;
        });
    });


    /* Call the parser again once we have a locations file */
    $("#locations").on("change", function() {
        const fileList = this.files;
        const locationsFile = fileList[0];

        console.log("Locations file: " + locationsFile.name);
        (new Parser(locationsFile)).addLocations(cities, function(locations) {
            console.log("Locations read:", locations);
            console.log(cities);

            $("#startCity").removeAttr("disabled");
            $("#endCity").removeAttr("disabled");
            $("#exclude").removeAttr("disabled");

            $.each(cities, function(name, c)
            {
                $("#startCity").append('<option value=' + name + '>' + name + '</option>');
                $("#endCity").append('<option value=' + name + '>' + name + '</option>');
                $("#exclude").append('<option value=' + name + '>' + name + '</option>');
                $("#startCity").trigger('contentChanged');
                $("#endCity").trigger('contentChanged');
                $("#exclude").trigger('contentChanged');
            });

        });
    });


    /* Handle search button click
            - Setup hueristic
            - Draw cities

            TODO: modularize this code
     */
    $("#search").on("click", function() {
        var h = new Heuristic();
        if($("#heuristic").find(":selected").val() == "straight") {
            h = new ShortestDistanceHeuristic();
        }

        $.each(cities, function(name, c){
            c.d = City.prototype.d;
            c.h = City.prototype.h;
            c.isExcluded = false;
        });

        var excludes = $("#exclude").val();

        for (var i = 0; i < excludes.length; i++) {
            cities[excludes[i]].isExcluded = true;
        }

        $.each(cities, function(name, c) {
            DrawCity(c);
        });

        var s = new Search(cities, h);

        var path = s.shortestPath(
            $("#startCity").find(":selected").text(),
            $("#endCity").find(":selected").text());

        if(typeof(path) === "undefined") {
            $("#output").html("No Path Found.");
            return;
        }

        var pathString = path.reverse().shift();
        var prev = cities[pathString];
        for (var i = 0; i < path.length; i++) {
            var current = cities[path[i]];
            drawLine(prev.coords.x, prev.coords.y, current.coords.x, current.coords.y, true);
            pathString = pathString + " → " + path[i];
            prev = current;
        }

        $("#output").html(pathString);
    });


    /* Update the start/end/exclude dropdowns */
    $('select').on('contentChanged', function() {
      // re-initialize (update)
      $(this).material_select();
    });

});
