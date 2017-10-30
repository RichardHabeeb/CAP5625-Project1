/*------------------------------------------------------------------------------
                                IMPORTS
------------------------------------------------------------------------------*/
import City from './City.js';
import Point from './Point.js';
import Heuristic from './Heuristic.js';
import ShortestDistanceHeuristic from './ShortestDistanceHeuristic.js';
import Parser from './Parser.js';
import Search from './Search.js';
import Renderer from './Renderer.js';

/*------------------------------------------------------------------------------
                                EXPORTS
------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------
                                EVENTS
------------------------------------------------------------------------------*/


/**
 * On document load.
 */
$(document).ready(function() {
    $('select').material_select();

    var cities = null;
    var search = null;
    var snap = Snap("#svg");
    var renderer = new Renderer(snap);
    var isEdit = false;


    /**
     * On connections file added.
     */
    $("#connections").on("change", function() {
        const fileList = this.files;
        const connectionsFile = fileList[0];

        /* Parse the file, enable locations field. */
        (new Parser(connectionsFile)).getCities(function(c) {
            console.log("File read:", c);

            $("#locationsBtn").removeClass("disabled");
            cities = c;
        });
    });

    /**
     * On locations file added.
     */
    $("#locations").on("change", function() {
        const fileList = this.files;
        const locationsFile = fileList[0];

        /* Parse the file, update all the form fields. */
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
                $("#editCity").append('<option value=' + name + '>' + name + '</option>');
                $("#startCity").trigger('contentChanged');
                $("#endCity").trigger('contentChanged');
                $("#editCity").trigger('contentChanged');
                $("#exclude").trigger('contentChanged');
            });

            renderer.drawCities(cities);
        });
    });

    /**
     * setupSearch -
     * Create a search object and initialize it. Configure the form for execution.
     *
     * @return {Boolean}  If the forms are configured correctly.
     */
    function setupSearch() {

        if( typeof(cities[$("#startCity").find(":selected").text()]) === "undefined" ||
            typeof(cities[$("#endCity").find(":selected").text()]) === "undefined")
        {
            return false;
        }

        var h = new Heuristic();
        if ($("#heuristic").find(":selected").val() == "straight") {
            h = new ShortestDistanceHeuristic();
        }

        $.each(cities, function (name, c) {
            c.d = City.prototype.d;
            c.h = City.prototype.h;
        });

        search = new Search(
            cities,
            h,
            $("#startCity").find(":selected").text(),
            $("#endCity").find(":selected").text(),
            renderer
        );

        $("#startCity").prop( "disabled", true );
        $("#endCity").prop( "disabled", true );
        $("#heuristic").prop( "disabled", true );
        $("#startCity").trigger('contentChanged');
        $("#endCity").trigger('contentChanged');
        $("#heuristic").trigger('contentChanged');

        $("#editMode").addClass("disabled");

        return true;
    };

    /**
     * checkSearchStatus -
     * Update the status of the forms based on the search status.
     *
     * @param  {String} status the status of the A* algorithm
     */
    function checkSearchStatus(status) {
        if (status === "done") {
            var path = search.path;
            var pathString = renderer.drawPath(path, cities);

            $("#output").html(pathString);
            $("#output").slideDown();
            $("#searchStep").addClass("disabled");
            $("#search").addClass("disabled");
            $("#reset").removeClass("disabled");
        } else if (status === "error") {
            $("#output").html("No Path Found.");
            $("#output").slideDown();
            $("#searchStep").addClass("disabled");
            $("#search").addClass("disabled");
        }
    };

    /**
     * On searchStep click.
     */
    $("#searchStep").on("click", function() {
        if (search === null) {
            if(!setupSearch()) return; /* Check for valid params. */
        }

        /* Do single step. */
        search.shortestPathStep(function(status) {
            checkSearchStatus(status);
        });
    });

    /**
     * On search click
     */
    $("#search").on("click", function() {
        if (search === null) {
            if(!setupSearch()) return; /* Check for valid params. */
        }

        /* Don't want do this mid search (TODO allow pausing and playing) */
        $("#reset").addClass("disabled");
        $("#search").addClass("disabled");
        $("#searchStep").addClass("disabled");

        /* Do all the steps */
        search.shortestPath(function(status) {
            checkSearchStatus(status);
        });
    });

    /**
     * On reset click
     * Reset locations, search, and visualization.
     */
    $("#reset").on("click", function() {
        const locationsFile = $("#locations")[0].files[0];
        search = null;

        /* Re build the cities dictionary */
        (new Parser(locationsFile)).addLocations(cities, function() {
            renderer.clear(function() {
                renderer.drawCities(cities);

                $("#searchStep").removeClass("disabled");
                $("#search").removeClass("disabled");
                $("#editMode").removeClass("disabled");

                $("#startCity").removeAttr("disabled");
                $("#endCity").removeAttr("disabled");
                $("#heuristic").removeAttr("disabled");
                $("#startCity").trigger('contentChanged');
                $("#endCity").trigger('contentChanged');
                $("#heuristic").trigger('contentChanged');
            });
        });
    });

    /**
     * On update click. Move a city.
     */
    $("#update").on("click", function() {

        var city = $("#editCity").find(":selected").text();
        var xcoord = $("#xcoord").val();
        var ycoord = $("#ycoord").val();

        cities[city].coords = new Point(parseInt(xcoord), parseInt(ycoord));

        renderer.clear(function() {
            renderer.drawCities(cities);
        });
    });

    /**
     * On editMode click.
     */
    $("#editMode").on("click", function() {
        if (isEdit === true) {
            isEdit = false;
            $("#editMode").html("Enter Edit Mode").removeClass("red").addClass("blue");
            $("#editForm").slideToggle();
            $("#search").fadeToggle();
            $("#searchStep").fadeToggle();
            $("#reset").fadeToggle();

            var excludes = $("#exclude").val();

            for (var i = 0; i < excludes.length; i++) {
                cities[excludes[i]].isExcluded = true;
            }

            renderer.clear(function() {
                renderer.drawCities(cities);
            });

        } else {
            isEdit = true;
            $("#editMode").html("Exit Edit Mode").removeClass("blue").addClass("red");
            $("#editForm").slideToggle();
            $("#search").fadeToggle();
            $("#searchStep").fadeToggle();
            $("#reset").fadeToggle();
        }
    });

    /**
     * updateCityForm -
     * Update the edit form for a cities coordinates.
     *
     * @param  {String} name the name of a city
     */
    var updateCityForm = function(name) {
        $('#xcoord').val(cities[name].coords.x);
        $('#ycoord').val(cities[name].coords.y);
    }

    /**
     * renderer.onClickCity -
     * Configure the renderer to handle city clicks on new cities it draws.
     */
    renderer.onClickCity = function () {
        $("#editCity").val(this.node.id);
        $("#editCity").trigger('contentChanged');
        $("#editCity").trigger('change');
    };

    /**
     * On editCity change
     */
    $("#editCity").on("change", function() {
        updateCityForm($("#editCity").find(":selected").text());
    });

    /* Update the start/end/exclude dropdowns. Materialize CSS quirk. */
    $('select').on('contentChanged', function() {
        // re-initialize (update)
        $(this).material_select();
    });
});
