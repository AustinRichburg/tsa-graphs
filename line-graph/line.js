/* The line on the graph */
var valueline = d3.line()
    .x(function(airport) { return x(airport.code); })
    .y(function(airport) { return y(airport.avgCloseAmt); });

/* Initially sets the line graph to null. It does this to know if it needs to redraw the graph on update. */
var lg = null;

/**
 * Sets up the line graph. If it was already there, there remove it so it can be redrawn.
 */
function initLineGraph(){
    if(lg){
        lg.remove();
    }
    lg = d3.select("#line-graph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

/**
 * Reads in the data from the claims csv file, parses it, and creates a graph.
 */
function drawLineGraph(){
    d3.csv("./data/claims-small.csv")
    .then(function(data){
        // Only parses data if it has not been done yet
        if(airports.length == 0){
            parseData(data);
        }
        console.log(airports);

        // Sets up the domains (the ticks) for the axes
        x.domain(airports.map(function(airport) { return airport.code; }));
        y.domain([0, maxValue]);

        // Appends the line to the graph
        lg.append("path")
            .datum(airports)
            .attr("class", "line")
            .attr("d", valueline);

        // Appends the transparent tooltip to the graph
        var tooltip = d3.select("#line-container").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        /**
         * Called when the user hovers the mouse over a bar on the graph. Shows the tooltip with the info about the bar being viewed.
         * @param {*} airport The airport associated with the bar being viewed
         */
        var tipMouseover = function(airport) {
            var html  = "<p>" + airport.code + "</p>$" + airport.avgCloseAmt.toFixed(2);
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

        // Adds the dots to the line at each point
        lg.selectAll("dot")
            .data(airports)
            .enter().append("circle")
            .attr("r", 3.5)
            .attr("cx", function(airport) { return x(airport.code); })
            .attr("cy", function(airport) { return y(airport.avgCloseAmt); })
            .on("mouseover", tipMouseover)
            .on("mouseout", tipMouseout);

        // Append the x-axis
        lg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Append the y-axis
        lg.append("g")
            .call(d3.axisLeft(y));

    });
}
