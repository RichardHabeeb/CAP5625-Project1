import City from './City.js';
import Heuristic from './Heuristic.js';
import ShortestDistanceHeuristic from './ShortestDistanceHeuristic.js';
import Parser from './Parser.js';
import Search from './Search.js';
import Renderer from './Renderer.js';


$(document).ready(function() {
    $('select').material_select();

    var cities = null;

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
    var search = null;

    $("#searchStep").on("click", function() {
        if (search === null) {
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

            var snap = Snap("#svg");
            var renderer = new Renderer(snap);

            $.each(cities, function(name, c) {
                c.setShape(renderer.getCityShape(c));
                $.each(c.adjacent, function (i) {
                        var adj = cities[c.adjacent[i]];
                        if (adj.isExcluded === false) {
                            renderer.drawLine(c, adj);
                        }
                    }
                );
            });

            search = new Search (
                cities,
                h,
                $("#startCity").find(":selected").text(),
                $("#endCity").find(":selected").text());
        }

        search.shortestPathStep();
    });

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

        var snap = Snap("#svg");
        var renderer = new Renderer(snap);

        $.each(cities, function(name, c) {
            c.setShape(renderer.getCityShape(c));
            $.each(c.adjacent, function (i) {
                    var adj = cities[c.adjacent[i]];
                    if (adj.isExcluded === false) {
                        renderer.drawLine(c, adj);
                    }
                }
            );
        });

        var s = new Search (
            cities,
            h,
            $("#startCity").find(":selected").text(),
            $("#endCity").find(":selected").text());



        /*var s = new Search(cities, h);

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
            renderer.drawLine(prev, current, true);
            pathString = pathString + " → " + path[i];
            prev = current;
        }

        $("#output").html(pathString);*/
    });


    /* Update the start/end/exclude dropdowns */
    $('select').on('contentChanged', function() {
      // re-initialize (update)
      $(this).material_select();
    });

});
