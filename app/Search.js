export default (function() {

    var Search = function() {

    }

    Search.prototype.aStar = function(cities, startCity, destCity, heuristic) {

        var frontier = [startCity];
        var current = frontier[0];
        while(frontier.length > 0 && frontier[0] != destCity)
        {
            for(var i=0; i<current.adjacent.length; i++)
            {
                var next = current.adjacent[i];
                if(current.parent == next) continue;

                //TODO compute H
                var h = 0;

                //TODO need logic to see if we've been here before with a better H

                

            }
        }
    };


    return Search;
})();
