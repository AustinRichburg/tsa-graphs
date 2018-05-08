var airportsValues = [];
var codes2 = [];
var patt = /\d+\.\d+/;
var max = 0;

var valueline = d3.line()
    .x(function(airport) { return x(airport.code); })
    .y(function(airport) { return y(airport.avgCloseAmt); });

var lg = "";

function initLineGraph(){
    lg = d3.select("#line-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function createLineGraph(){
    d3.csv("./data/claims-small.csv")
    .then(function(data){
        if(airportsValues.length == 0){
            parseData2(data);
            getAvgAmount();
        }
        console.log(airportsValues);

        x.domain(airportsValues.map(function(airport) { return airport.code; }));
        y.domain([0, max]);

        lg.append("path")
            .datum(airportsValues)
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
            .data(airportsValues)
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

function parseData2(data){
    data.forEach(function(curr){
        var amt = curr["Close Amount"];
        if(amt === '-'){
            amt = "$0.00";
        }
        curr.amt = +patt.exec(amt);
        // Gets the airport code
        var code = curr["Airport Code"];
        // Creates a new object for each new airport as needed
        if(!codes2.find(function(ele){ return ele === code })){
            codes2.push(code);
            airportsValues.push({
                code: code,
                closeAmt: 0,
                avgCloseAmt: 0
            })
        }
        // Associates the claim with the airport
        airportsValues.find(function(element){ return element.code === code }).closeAmt += curr.amt;
    });
}

function getAvgAmount(){
    airportsValues.forEach(function(airport){
        airport.avgCloseAmt = airport.closeAmt / MONTHS;
        if(airport.avgCloseAmt > max){
            max = airport.avgCloseAmt;
        }
    });
}