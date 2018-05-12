var totalAvg = 0;

var bg = null;

function initBarGraph(){
    if(bg){
        console.log("removed graph");
        bg.remove();
    }
    bg = d3.select("#bar-graph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

/**
 * Reads in the data from the claims csv file, parses it, and creates a graph.
 */
function drawBarGraph(){
    d3.csv("./data/claims-small.csv")
    .then(function(data){
        if(airports.length == 0){
            parseData(data);
        }
        console.log(airports);
        x.domain(airports.map(function(airport) { return airport.code; }));
        y.domain([0, 0.5]);

        var tooltip = d3.select("#bar-container").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var tipMouseover = function(airport) {
            var html  = "<p>" + airport.code + "</p><p>Mean: " + airport.avgClaims + "</p><p>Std Dev: " + "</p>";
            tooltip.html(html)
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .transition()
                .duration(200)
                .style("opacity", .9)
        };

        var tipMouseout = function(d) {
            tooltip.transition()
                .duration(300)
                .style("opacity", 0);
        };

        var bars = bg.selectAll(".bar");
        // append the rectangles for the bar chart
        bars
            .data(airports)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(airport){
                return x(airport.code);
            })
            .attr("width", x.bandwidth())
            .attr("y", function(airport){
                return y(airport.avgClaims);
            })
            .attr("height", function(airport){
                return height - y(airport.avgClaims);
            })
            .on("mouseover", tipMouseover)
            .on("mouseout", tipMouseout);

        // add the x Axis
        bg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the y Axis
        bg.append("g")
            .call(d3.axisLeft(y));
    });
}

