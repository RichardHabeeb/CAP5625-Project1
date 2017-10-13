import City from './City.js';
import Heuristic from './Heuristic.js';
import ShortestDistanceHeuristic from './ShortestDistanceHeuristic.js';
import Parser from './Parser.js';
import Search from './Search.js';


$(document).ready(function() {
    $('select').material_select();

    var cities = null;

    var s = Snap("#svg");

    function DrawCity(c) {
        var cir = s.circle(c.coords.x, c.coords.y, 15);
        cir.attr({
            fill: "#4caf50",
            strokeWidth: 0, // CamelCase...
            "fill-opacity": 0.5, // or dash-separated names
        });
        var text = s.text(c.coords.x, c.coords.y + 5, c.name);
        text.attr({
            "text-anchor":"middle",
            "fill":"#1b5e20"
        });

    }

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
                DrawCity(c);

                $("#startCity").append('<option value=' + name + '>' + name + '</option>');
                $("#endCity").append('<option value=' + name + '>' + name + '</option>');
                $("#exclude").append('<option value=' + name + '>' + name + '</option>');
                $("#startCity").trigger('contentChanged');
                $("#endCity").trigger('contentChanged');
                $("#exclude").trigger('contentChanged');
            });

        });
    });

    $("#search").on("click", function() {
        var h = new Heuristic();
        if($("#heuristic").find(":selected").val() == "straight") {
            h = new ShortestDistanceHeuristic();
        }

        $.each(cities, function(name, c){
            c.d = City.prototype.d;
            c.h = City.prototype.h;
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
        for (var i = 0; i < path.length; i++) {
            pathString = pathString + " → " + path[i];
        }

        $("#output").html(pathString);
    });

    $('select').on('contentChanged', function() {
      // re-initialize (update)
      $(this).material_select();
    });





});
