export default (function() {

    var Parser = function(file) {
        this.file = file;
    };

    Parser.prototype.file = null;

    Parser.prototype.getCities = function() {
        var reader = new FileReader();
        reader.onload = function(){
            var lines = this.result.split('\n');

            var outputElement = document.getElementById("output");
            var listElement = document.createElement("ol");

            outputElement.appendChild(listElement);

            for(var lineNum = 0; lineNum < lines.length; lineNum++){
                var line = lines[lineNum];

                if (line === "END"){
                    break
                }

                var li = document.createElement("li");
                li.innerHTML = line;
                listElement.appendChild(li)
            }
        };
        reader.readAsText(this.file);
    };

    return Parser;
})();
