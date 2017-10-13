import City from './City.js';
import Heuristic from './Heuristic.js';
import ShortestDistanceHeuristic from './ShortestDistanceHeuristic.js';
import Parser from './Parser.js';
import Search from './Search.js';


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

    $("#search").on("click", function() {
        var h = new Heuristic();
        if($("#heuristic").find(":selected").text() == "straight") {
            h = new ShortestDistanceHeuristic();
        }

        $.each(cities, function(name, c){
            c.d = City.prototype.d;
            c.h = City.prototype.h;
        });

        var s = new Search(cities, h);

        s.shortestPath(
            $("#startCity").find(":selected").text(),
            $("#endCity").find(":selected").text());
    });

    $('select').on('contentChanged', function() {
      // re-initialize (update)
      $(this).material_select();
    });

});
