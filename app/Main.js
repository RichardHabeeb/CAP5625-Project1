import City from './City.js';
import Heuristic from './Heuristic.js';
import ShortestDistanceHeuristic from './ShortestDistanceHeuristic.js';
import Parser from './Parser.js';
import Search from './Search.js';

const connectionsElement = document.getElementById("connections");
connectionsElement.addEventListener("change", handleConnectionsFile, false);

const locationsElement = document.getElementById("locations");
locationsElement.addEventListener("change", handleLocationsFile, false);

var cities = null;

function handleConnectionsFile() {
    const fileList = this.files;
    const connectionsFile = fileList[0];

    console.log("Connections file: " + connectionsFile.name);
    (new Parser(connectionsFile)).getCities(function(c) {
        console.log("File read:", c);
        document.getElementById("locationSelect").style.display = "block";

        cities = c;
    });
}

function handleLocationsFile() {
    const fileList = this.files;
    const locationsFile = fileList[0];

    console.log("Locations file: " + locationsFile.name);
    (new Parser(locationsFile)).addLocations(cities, function(locations) {
        console.log("Locations read:", locations);
        console.log(cities);
        document.getElementById("start").style.display = "block";

        const elementList = ["startCity", "endCity", "exclude"];

        for (var i = 0; i < elementList.length; i++){
            var elem = document.getElementById(elementList[i]);

            for (var k in cities) {
                var option = document.createElement("option");
                option.textContent = k;
                option.value = k;
                elem.appendChild(option);
            }
        }
    });
}

function astar() {
    console.log("Form submitted.");

    const startCity = document.getElementById("startCity").value;
    const endCity = document.getElementById("endCity").value;
    const exclude = document.getElementById("exclude").value;
    const heuristic = document.getElementById("heuristic").value;

    console.log(startCity);

    /*for (var i = 0; i < exclude.length; i++){
        cities.delete(exclude[i])
    }*/

   /* var searcher;
    if (heuristic === "shortest"){
        searcher = new Search(cities, new ShortestDistanceHeuristic());
    } else {
        searcher = new Search(cities, new Heuristic());
    }
    searcher.shortestPath(startCity, endCity);*/
}

