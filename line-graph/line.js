var max = 0;

var valueline = d3.line()
    .x(function(airport) { return x(airport.code); })
    .y(function(airport) { return y(airport.avgCloseAmt); });

var lg = null;

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

function drawLineGraph(){
    d3.csv("./data/claims-small.csv")
    .then(function(data){
        if(airports.length == 0){
            parseData(data);
        }
        console.log(airports);

        x.domain(airports.map(function(airport) { return airport.code; }));
        y.domain([0, max]);

        lg.append("path")
            .datum(airports)
            .attr("class", "line")
            .attr("d", valueline);

        var tooltip = d3.select("#line-container").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var tipMouseover = function(airport) {
            var html  = "<p>" + airport.code + "</p>$" + airport.avgCloseAmt.toFixed(2);
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

        lg.selectAll("dot")
            .data(airports)
            .enter().append("circle")
            .attr("r", 3.5)
            .attr("cx", function(airport) { return x(airport.code); })
            .attr("cy", function(airport) { return y(airport.avgCloseAmt); })
            .on("mouseover", tipMouseover)
            .on("mouseout", tipMouseout);

        lg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        lg.append("g")
            .call(d3.axisLeft(y));

    });
}
