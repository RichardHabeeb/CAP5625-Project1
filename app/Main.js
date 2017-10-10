import City from './City.js';
import Heuristic from './Heuristic.js';
import Parser from './Parser.js';
import Search from './Search.js';

const inputElement = document.getElementById("input");
inputElement.addEventListener("change", handleFiles, false);

function handleFiles() {
    const fileList = this.files;
    const connectionsFile = fileList[0];

    console.log(connectionsFile.name);
    new Parser(connectionsFile).getCities()
}

console.log(new City());
