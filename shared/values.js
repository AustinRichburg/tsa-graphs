/* The number of months from 2010 - 2013. Used to find the mean. */
const MONTHS = 48;

/* The array to hold all of the parsed data:
    {
        code: The airport code,
        closeAmt: The total amount of value of the claims,
        avgCloseAmt: The average value of claims per month,
        claims: The number of claims per airport,
        avgClaims: The average number of claims per month
    }
*/
var airports = [];

/* The largest avgCloseAmt in the dataset. Used to determine the height of the line graph. */
var maxValue = 0;
var maxClaim = 0;

/* Regex pattern used to find prices (ex. 654.82) */
var patt = /\d+\.\d{2}/;

var totalAvg = 0;
var stdDev = 0;

/* The dimensions of the graphs */
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 2550 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

/* The x-axis dimensions */
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

/* The y-axis dimensions */
var y = d3.scaleLinear()
    .range([height, 0]);

/**
 * Parses data to fill the airports object
 * @param {*} data The data that is being parsed
 */
function parseData(data){
    // Only called if airports is empty
    if(airports.length == 0){
        console.log("parsing data...");
        data.forEach(function(curr){
            var amt = curr["Close Amount"];
            // Some values have a - symbol and others have $0.00. They appear to be interchangable
            if(amt === '-'){
                amt = "$0.00";
            }
            // Convert the value to a Number
            curr.amt = +patt.exec(amt);
            // Gets the current airport code
            var code = curr["Airport Code"];
            var airline = curr["Airline Name"];
            // Creates a new object for each new airport as needed
            if(!airports.find(function(airport){ return airport.code === code })){
                airports.push({
                    code: code,
                    closeAmt: 0,
                    avgCloseAmt: 0,
                    claims: 0,
                    avgClaims: 0
                });
            }
            // Get the newly created airport and adds a new claim and the value
            var airport = airports.find(function(element){ return element.code === code });
            airport.closeAmt += curr.amt;
            airport.claims++;
        });
        // Gets the averages once all the data has been parsed
        getAvgs();
    }
}

/**
 * Gets the average claims and value of all of the airports in the dataset
 */
function getAvgs(){
    var sum = 0;
    airports.forEach(function(airport){
        sum += airport.claims;
        airport.avgClaims = airport.claims / MONTHS;
        airport.avgCloseAmt = airport.closeAmt / MONTHS;
        if(airport.avgCloseAmt > maxValue){
            maxValue = airport.avgCloseAmt;
        }
        if(airport.avgClaims > maxClaim){
            maxClaim = airport.avgClaims;
        }
    });
    totalAvg = sum / airports.length;
    console.log("Average: " + totalAvg);
    getStdDev();
}

function getStdDev(){
    var sum = 0;
    airports.forEach(function(airport){
        sum += (airport.avgClaims - totalAvg) * (airport.avgClaims - totalAvg);
    });
    var variance = sum / airports.length;
    stdDev = Math.sqrt(variance);
    console.log("std dev: " + stdDev);
}

/**
 * Called when the user inputs their own data via the form
 * @param {*} userData The data that the user entered
 */
function update(userData){
    // Change the value to a Number
    var closeAmt = +patt.exec(userData.value);
    // Get the airpotr if it was already in the dataset, otherwise, create a new one
    var updated = airports.find(function(airport){ return airport.code == userData.code });
    if(updated == undefined){
        airports.push({
            code: userData.code,
            closeAmt: 0,
            avgCloseAmt: 0,
            claims: 0,
            avgClaims: 0
        });
        updated = airports[length - 1];
        console.log(updated + "\n" + airports);
    }
    updated.closeAmt += closeAmt;
    updated.claims++;
    // Get the new averages
    getAvgs();
    console.log("Updated!\n" + airports);
}