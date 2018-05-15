/* Initially sets the bar graph to null. It does this to know if it needs to redraw the graph on update. */
var bg = null;

/**
 * Sets up the bar graph. If it was already there, there remove it so it can be redrawn.
 */
function initBarGraph(){
    // Removes the bar graph if it already existed
    if(bg){
        console.log("removed graph");
        bg.remove();
    }
    // Creates the space for the graph
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
        // Only parses data if it has not been done yet
        if(airports.length == 0){
            parseData(data);
        }
        console.log(airports);
        // Sets up the domains (the ticks) for the axes
        x.domain(airports.map(function(airport) { return airport.code; }));
        y.domain([0, maxClaim]);

        // Appends the transparent tooltip to the graph
        var tooltip = d3.select("#bar-container").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        /**
         * Called when the user hovers the mouse over a bar on the graph. Shows the tooltip with the info about the bar being viewed.
         * @param {*} airport The airport associated with the bar being viewed
         */
        var tipMouseover = function(airport) {
            var html  = "<p>" + airport.code + "</p><p>Mean: " + airport.avgClaims + "</p><p>Std Dev: " + stdDev + "</p>";
            tooltip.html(html)
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .transition()
                .duration(200)
                .style("opacity", .9)
        };

        /**
         * On mouse out, the tooltip becomes completely transparent again
         * @param {*} airport Not used
         */
        var tipMouseout = function(airport) {
            tooltip.transition()
                .duration(300)
                .style("opacity", 0);
        };

        // Append the rectangles for the bar chart
        bg.selectAll(".bar")
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

        // Append the x-axis
        bg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Append the y-axis
        bg.append("g")
            .call(d3.axisLeft(y));
    });
}

