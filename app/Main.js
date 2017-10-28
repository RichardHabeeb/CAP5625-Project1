import City from './City.js';
import Point from './Point.js';
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
    var isEdit = false;

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
            $("#search").removeClass("disabled");
            $("#searchStep").removeClass("disabled");
            $("#editMode").removeClass("disabled");
            $("#reset").removeClass("disabled");

            $.each(cities, function(name, c)
            {
                $("#startCity").append('<option value=' + name + '>' + name + '</option>');
                $("#endCity").append('<option value=' + name + '>' + name + '</option>');
                $("#exclude").append('<option value=' + name + '>' + name + '</option>');
                $("#startCity").trigger('contentChanged');
                $("#endCity").trigger('contentChanged');
                $("#exclude").trigger('contentChanged');
            });

            renderer.drawCities(cities);



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
            var pathString = renderer.drawPath(path, cities);

            $("#output").html(pathString);
            $("#output").slideDown();
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

        $("#editMode").addClass("disabled");
        search.shortestPathStep(function(status) {
            checkSearchStatus(status);
        });
    });

    $("#search").on("click", function() {
        if (search === null) {
            setupSearch();
        }

        $("#editMode").addClass("disabled");
        search.shortestPath(function(status) {
            checkSearchStatus(status);
        });
    });

    /* Reset locations, search, and visualization. */
    $("#reset").on("click", function() {
        const locationsFile = $("#locations")[0].files[0];
        search = null;
        (new Parser(locationsFile)).addLocations(cities, function() {
            renderer.clear(function() {
                renderer.drawCities(cities);

                $("#searchStep").removeClass("disabled");
                $("#search").removeClass("disabled");
                $("#editMode").removeClass("disabled");
            });
        });
    });

    $("#update").on("click", function() {
        var city = $("#city").val();
        var xcoord = $("#xcoord").val();
        var ycoord = $("#ycoord").val();

        cities[city].setCoords(new Point(parseInt(xcoord), parseInt(ycoord)));

        renderer.redrawCity(cities[city], cities);
    });

    $("#editMode").on("click", function() {
        if (isEdit) {
            $(this).html("Enter Edit Mode").removeClass("red").addClass("blue");
            $("#editForm").slideToggle();
            $("#search").fadeToggle();
            $("#searchStep").fadeToggle();
            $("#reset").fadeToggle();

            var excludes = $("#exclude").val();

            for (var i = 0; i < excludes.length; i++) {
                cities[excludes[i]].isExcluded = true;
                renderer.redrawCity(cities[excludes[i]], cities);
            }

            isEdit = false;
        } else {
            $(this).html("Exit Edit Mode").removeClass("blue").addClass("red");
            $("#editForm").slideToggle();
            $("#search").fadeToggle();
            $("#searchStep").fadeToggle();
            $("#reset").fadeToggle();

            isEdit = true;
        }
    });

    renderer.onClickCity = function () {
        $('#edit').removeClass("hidden");
        $('#editInfo').addClass("hidden");

        var nodeInfo = Snap.select("#"+this.node.id).select("circle:nth-child(1)").getBBox();
        $('#xcoord').val(nodeInfo.cx);
        $('#ycoord').val(nodeInfo.cy);
        $('#city').val(this.node.id);
    };

    /* Update the start/end/exclude dropdowns */
    $('select').on('contentChanged', function() {
        // re-initialize (update)
        $(this).material_select();
    });

});
