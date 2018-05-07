/* The number of months from 2010 - 2013. Used to find the mean. */
const MONTHS = 48;

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 2060 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

var y = d3.scaleLinear()
    .range([height, 0]);