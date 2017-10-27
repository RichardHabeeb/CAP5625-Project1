import City from './City.js';
import Heuristic from './Heuristic.js';
import ShortestDistanceHeuristic from './ShortestDistanceHeuristic.js';
import Parser from './Parser.js';
import Search from './Search.js';
import Renderer from './Renderer.js';


$(document).ready(function() {
    $('select').material_select();

    var cities = null;
    var search = null;
    var snap = Snap("#svg");
    var renderer = new Renderer(snap);

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

    function setupSearch() {
        var h = new Heuristic();
        if ($("#heuristic").find(":selected").val() == "straight") {
            h = new ShortestDistanceHeuristic();
        }

        $.each(cities, function (name, c) {
            c.d = City.prototype.d;
            c.h = City.prototype.h;
            c.isExcluded = false;
        });

        var excludes = $("#exclude").val();

        for (var i = 0; i < excludes.length; i++) {
            cities[excludes[i]].isExcluded = true;
        }

        $.each(cities, function (name, c) {
            renderer.drawCity(c);
            $.each(c.adjacent, function (i) {
                    var adj = cities[c.adjacent[i]];
                    if (adj.isExcluded === false) {
                        renderer.drawLine(c, adj);
                    }
                }
            );
        });

        search = new Search(
            cities,
            h,
            $("#startCity").find(":selected").text(),
            $("#endCity").find(":selected").text(),
            renderer
        );
    }

    function checkSearchStatus(status) {
        if (status === "done") {
            var path = search.path;
            var pathString = path.reverse().shift();
            var prev = cities[pathString];
            for (var i = 0; i < path.length; i++) {
                var current = cities[path[i]];
                renderer.drawLine(prev, current, true);
                pathString = pathString + " → " + path[i];
                prev = current;
            }

            $("#output").html(pathString);
            $("#searchStep").addClass("disabled");
            $("#search").addClass("disabled");
        } else if (status === "error") {
            $("#output").html("No Path Found.");
            $("#searchStep").addClass("disabled");
            $("#search").addClass("disabled");
        }
    }

    $("#searchStep").on("click", function() {
        if (search === null) {
            setupSearch();
        }

        var status = search.shortestPathStep();

        checkSearchStatus(status);
    });

    $("#search").on("click", function() {
        if (search === null) {
            setupSearch();
        }

        var status = search.shortestPath();

        checkSearchStatus(status);
    });


    /* Update the start/end/exclude dropdowns */
    $('select').on('contentChanged', function() {
      // re-initialize (update)
      $(this).material_select();
    });

});
