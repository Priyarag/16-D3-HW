// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top:20,
    right:40,
    bottom:80,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

    d3.csv("assets/data/data.csv").then(function(censusData) {
    // if(err) throw err;
    censusData.forEach(function(data){
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    data.healthcare = +data.healthcare;
    data.income = +data.income;

    });
    
    console.log(censusData)
    
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d=>d["age"]-1),
        d3.max(censusData,d=>d["age"]+1)])
        .range([0,width]);

    console.log("x-axis data");
    console.log(d3.min(censusData, d=>d["age"]));
    console.log(d3.max(censusData, d=>d["age"]));
    console.log("y-axis data");
    console.log(d3.min(censusData, d=>d["smokes"]));
    console.log(d3.max(censusData, d=>d["smokes"]+1));
    
    console.log(d3.max(censusData, d=>d["obesity"]));
    console.log(d3.min(censusData, d=>d["obesity"]));

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d=>d["smokes"]-1),
            d3.max(censusData, d=>d["smokes"]+3)])
        .range([height,0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
    .call(leftAxis);

    var circlesGroup =  chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append('g');

    circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d["age"]))
        .attr("cy", d => yLinearScale(d["smokes"]))
        .attr("r", d=>d.obesity / 2)
        .attr("fill", "steelblue")
        .attr("opacity", ".5");

    circlesGroup.append("text").text(d=>d.abbr)
        .attr("x", d => xLinearScale(d.age)-4)
        .attr("y", d => yLinearScale(d.smokes)+2)
        .style("font-size",".6em")
        .classed("fill-text", true);

    console.log(d => xLinearScale(d.age));
    console.log(d => yLinearScale(d.smokes));
    // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var censusDataLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Smokers Vs. Age");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Smokers");

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
            var state = +d.state;
            var smokes = +d.smokes;
            var healthcare = +d.age;

      return (`${d.state}<br>${"Smokers:"} ${d.smokes} <br> ${"Age:"} ${d.age}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
});