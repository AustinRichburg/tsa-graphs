/* Used to hold unique airportsClaims, their claims, and their number of claims sorted by months within each year. */
var airportsClaims = [];

/* Holds the average number of claims per month for each unique airport */
//var avgs = [];

/* Holds the airport codes. This is used for validation purposes */
var codes = [];

var totalAvg = 0;

var bg = "";

function initBarGraph(){
    bg = d3.select("#bar-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

/**
 * Reads in the data from the claims csv file, parses it, and creates a graph.
 */
function createBarGraph(){
    d3.csv("./data/claims-small.csv")
    .then(function(data){
        if(airportsClaims.length == 0){
            parseData(data);
            //setDates();
            avgClaims();
        }
        console.log(airportsClaims);
        x.domain(airportsClaims.map(function(airport) { return airport.code; }));
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

        // append the rectangles for the bar chart
        bg.selectAll(".bar")
            .data(airportsClaims)
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


/**
 * Creates a new object for each unique airport passed to it and sorts claims based on the airport
 * @param {Array} data The data being parsed
 */
// function parseData(data){
//     data.forEach(function(curr){
//         // Gets the airport code
//         var code = curr["Airport Code"];
//         // Gets the claim date
//         var date = new Date(curr["Incident Date"]);
//         // Creates a new object for each new airport as needed
//         if(!codes.find(function(ele){ return ele === code })){
//             codes.push(code);
//             airportsClaims.push({
//                 code: code,
//                 years: {},
//                 claims: []
//             })
//         }
//         // Associates the claim with the airport
//         airportsClaims.find(function(element){ return element.code === code }).claims.push(date);
//     });
// }

function parseData(data){
    data.forEach(function(curr){
        // Gets the airport code
        var code = curr["Airport Code"];
        // Creates a new object for each new airport as needed
        if(!codes.find(function(ele){ return ele === code })){
            codes.push(code);
            airportsClaims.push({
                code: code,
                claims: 0,
                avgClaims: 0
            })
        }
        // Associates the claim with the airport
        airportsClaims.find(function(element){ return element.code === code }).claims++;
    });
}

/**
 * Sorts each claim for each airport into new objects based off the month and year of the claims
 */
function setDates(){
    airportsClaims.forEach(function(airport){
        // Goes through individual claims
        airport.claims.forEach(function(claim){
            var year = claim.getFullYear();
            var month = getFullMonth(claim.getMonth());
            // Creates a new year when needed
            if(!airport.years[year]){
                airport.years[year] = {};
            }
            // Creates a new month when needed
            if(!airport.years[year][month]){
                airport.years[year][month] = 0;
            }
            // Counts a new claim
            airport.years[year][month]++;
        });
    });
}

/**
 * Creates a new object for each airport in the avgs array and counts the number of claims per month across all years
 */
// function avgClaims(){
//     // For Each Airport
//     airportsClaims.forEach(function(airport){
//         // Creates a new airport in the avgs array
//         avgs.push({
//             code: airport.code
//         });
//         // Stores the airport from the avgs array as we are using it
//         var currAvgCode = avgs.find(function(curr){ return curr.code === airport.code });
//         // For Each Year
//         Object.keys(airport.years).forEach(function(year){
//             // For Each Month in the current Year
//             Object.keys(airport.years[year]).forEach(function(month){
//                 // Creates a new month
//                 if(!currAvgCode[month]){
//                     currAvgCode[month] = 0;
//                 }
//                 // Adds the claims total to the global total per airport
//                 currAvgCode[month] += airport.years[year][month];
//             });
//         });
//     });
// }

function avgClaims(){
    var sum = 0;
    airportsClaims.forEach(function(airport){
        sum += airport.claims;
        airport.avgClaims = airport.claims / MONTHS;
    });
    totalAvg = sum / airportsClaims.length;
    console.log("Average: " + totalAvg);
}

/**
 * Returns the month name based off of an index
 * @param {int} month The index of the month
 */
function getFullMonth(month){
    switch(month){
        case 0:
            return "Jan";
        case 1:
            return "Feb";
        case 2:
            return "Mar";
        case 3:
            return "Apr";
        case 4:
            return "May";
        case 5:
            return "Jun";
        case 6:
            return "Jul";
        case 7:
            return "Aug";
        case 8:
            return "Sep";
        case 9:
            return "Oct";
        case 10:
            return "Nov";
        case 11:
            return "Dec";
    }
}