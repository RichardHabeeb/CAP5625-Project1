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
        // var searcher = new Search(cities, new Heuristic());
        var searcher = new Search(cities, new ShortestDistanceHeuristic());
        searcher.shortestPath("D4", "G5");
    });
}


