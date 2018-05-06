//########### Problem with effiency... possible fix would be to sort data into years first and then parse into years as needed.
// ie) Sort into years 2010, 2011, etc and when the user chooses to view a graph in 2012, THEN parse the data and create the graph rather than parsing data across
//     all years at once

/* Used to hold unique airports, their claims, and their number of claims sorted by months within each year. */
var airports = [];

/* Holds the average number of claims per month for each unique airport */
//var avgs = [];

/* Holds the airport codes. This is used for validation purposes */
var codes = [];

/* The number of months from 2010 - 2013. Used to find the mean. */
const MONTHS = 48;

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 2060 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/**
 * Reads in the data from the claims csv file, parses it, and creates a graph.
 */
d3.csv("./data/claims-small.csv")
    .then(function(data){
        parseData(data);
        //setDates();
        avgClaims();
        console.log(airports);
        x.domain(airports.map(function(airport) { return airport.code; }));
        y.domain([0, 0.5]);
        // append the rectangles for the bar chart
        svg.selectAll(".bar")
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
            });

        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));
    });

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
//             airports.push({
//                 code: code,
//                 years: {},
//                 claims: []
//             })
//         }
//         // Associates the claim with the airport
//         airports.find(function(element){ return element.code === code }).claims.push(date);
//     });
// }

function parseData(data){
    data.forEach(function(curr){
        // Gets the airport code
        var code = curr["Airport Code"];
        // Creates a new object for each new airport as needed
        if(!codes.find(function(ele){ return ele === code })){
            codes.push(code);
            airports.push({
                code: code,
                claims: 0,
                avgClaims: 0
            })
        }
        // Associates the claim with the airport
        airports.find(function(element){ return element.code === code }).claims++;
    });
}

/**
 * Sorts each claim for each airport into new objects based off the month and year of the claims
 */
function setDates(){
    airports.forEach(function(airport){
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
//     airports.forEach(function(airport){
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
    airports.forEach(function(airport){
        airport.avgClaims = airport.claims / MONTHS;
    });
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

// var data = [10, 5, 12, 15];
// var width = 300,
//     scaleFactor = 20,
//     barHeight = 30;

// var graph = d3.select("body")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", barHeight * data.length);

// var bar = graph.selectAll("g")
//     .data(data)
//     .enter()
//     .append("g")
//     .attr("transform", function(d, i){
//         return "translate(0, " + i * barHeight + ")";
//     });

// bar.append("rect")
//     .attr("width", function(d){
//         return d * scaleFactor;
//     })
//     .attr("height", barHeight - 1);

// bar.append("text")
//     .attr("x", function(d){ return d * scaleFactor; })
//     .attr("y", barHeight / 2)
//     .attr("dy", ".35em")
//     .text(function(d){ return d; });