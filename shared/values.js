/* The number of months from 2010 - 2013. Used to find the mean. */
const MONTHS = 48;

var airports = [];

var max = 0;

var patt = /\d+\.\d+/;

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 2060 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

var y = d3.scaleLinear()
    .range([height, 0]);

function parseData(data){
    if(airports.length == 0){
        console.log("parsing data...");
        data.forEach(function(curr){
            var amt = curr["Close Amount"];
            if(amt === '-'){
                amt = "$0.00";
            }
            curr.amt = +patt.exec(amt);
            // Gets the airport code
            var code = curr["Airport Code"];
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

            var airport = airports.find(function(element){ return element.code === code });
            airport.closeAmt += curr.amt;
            airport.claims++;
        });
        getAvgs();
    }
}

function getAvgs(){
    var sum = 0;
    airports.forEach(function(airport){
        sum += airport.claims;
        airport.avgClaims = airport.claims / MONTHS;
        airport.avgCloseAmt = airport.closeAmt / MONTHS;
        if(airport.avgCloseAmt > max){
            max = airport.avgCloseAmt;
        }
    });
    totalAvg = sum / airports.length;
    console.log("Average: " + totalAvg);
}

function update(userData){
    var closeAmt = +patt.exec(userData.value);
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
    getAvgs();
    console.log("Updated!\n" + airports);
}