// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top:20,
    right:40,
    bottom:80,
    left: 50
};

var Width = svgWidth - margin.left - margin.right;
var Height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);
// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
     .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, Width]);

  return xLinearScale;

}
// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  // create scales
var yLinearScale = d3.scaleLinear()
    .domain([0,
      d3.max(censusData, d => d[chosenYAxis]*1.1) 
    ])
    .range([height,2]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating yAxis var upon click on axis label
function renderyAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}
// function used for updating circles group with a transition to
// new circles
function renderyCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var label = "In Poverty (%)";
  }
  else if (chosenXAxis === "age") {
    var label = "Age (Median)";
  }
  else if (chosenXAxis === "income") {
    var label = "Household Income (Median)";
  }
 else if (chosenYAxis === "obesity") {
    var label = "Obese(%)";
  }
  else if (chosenYAxis === "smokes") {
    var label = "Smokes (%)";
  }
  else if (chosenYAxis === "healthcare") {
    var label = "Lacks Healthcare(%)";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {

      return (`${d.state}<br>${chosenXAxis} ${d[chosenXAxis]} <br> ${chosenYAxis} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// function used for updating circles group with new tooltip
// function updateToolyTip(chosenYAxis, circlesyGroup) {

// if (chosenYAxis === "obesity") {
//     var label = "Obese(%)";
//   }
//   else if (chosenYAxis === "smokes") {
//     var label = "Smokes (%)";
//   }
//   else if (chosenYAxis === "healthcare") {
//     var label = "Lacks Healthcare(%)";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//          return (`${d.state}<br>${chosenXAxis} ${d[chosenXAxis]} <br> ${chosenXAxis} ${d[chosenYAxis]}`);
//       // return (`${d.state}<br>${chosenXAxis} ${d[chosenXAxis]} <br> ${chosenXAxis} ${d[chosenYAxis]}`);
//     });

//   circlesyGroup.call(toolTip);

//   circlesyGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesyGroup;
// }
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
    
    var xLinearScale = xScale(censusData, chosenXAxis);
    var yLinearScale = yScale(censusData, chosenYAxis);
    // console.log("x-axis data");
    // console.log(d3.min(censusData, d=>d["poverty"]));
    // console.log(d3.max(censusData, d=>d["poverty"]));
    // console.log("y-axis data");
    // console.log(d3.min(censusData, d=>d["healthcare"]));
    // console.log(d3.max(censusData, d=>d["healthcare"]));
    
    // console.log(d3.max(censusData, d=>d["obesity"]));
    // console.log(d3.min(censusData, d=>d["obesity"]));

    // var yLinearScale = d3.scaleLinear()
    //     .domain([d3.min(censusData, d=>d["healthcare"]-1),
    //         d3.max(censusData, d=>d["healthcare"])])
    //     .range([chartHeight,0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${Height})`)
    .call(bottomAxis);

  //   // append y axis
  // var yAxis = chartGroup.append("g")
  // .classed("y-axis", true)
  //   .attr("transform", `translate(${Height}, 0)`)
  //   .call(leftAxis);

    // append y axis
    var yAxis =  chartGroup.append("g")
    .call(leftAxis);

    var circlesGroup =  chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append('g');

    circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "11")
        .attr("fill", "steelblue")
        .attr("opacity", ".5");

    circlesGroup.append("text").text(d=>d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis])-4)
        .attr("y", d => yLinearScale(d[chosenYAxis])+2)
        .style("font-size",".6em")
        .classed("fill-text", true);

    console.log(d => xLinearScale(d[chosenXAxis]));
    console.log(d => yLinearScale(d[chosenYAxis]));
    // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${Width / 2}, ${Height + 10})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age(Median)");

  var incomeLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income") // value to grab for event listener
  .classed("inactive", true)
  .text("Household Income (Median)");

  // Create group for  2 x- axis y  labels
  // .attr("dy","2em")
  // .attr("class", "axis-text")
  var labelsyGroup =    chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    // .attr("y",0)
    // .attr("x",(Height  ))
    // .attr("dy", "1em")
   .classed("axis-text", true)
    .text(chosenYAxis);

  var obeseLabel = labelsyGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "obese") // value to grab for event listener
    .classed("active", true)
    .text("Obese (%)");

  var smokesLabel = labelsyGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  var healthcareLabel = labelsyGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "healthcare") // value to grab for event listener
  .classed("inactive", true)
  .text("Lacks Healthcare(%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis ) {

        // replaces chosenXaxis with value
        chosenXAxis = value;
        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);
        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        }
        else if (chosenXAxis === "income") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
          .classed("active", true)
          .classed("inactive", false);
        }
      }
    });
    // y axis labels event listener
     var circlesyGroup = updateToolTip(chosenYAxis, circlesyGroup);
    labelsyGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis  ) {

        // replaces chosenYaxis with value
        chosenYAxis = value;
       console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);
        // updates y axis with transition
        yAxis = renderyAxes(yLinearScale, yAxis);
        // updates circles with new y values
        circlesyGroup = renderyCircles(circlesyGroup, yLinearScale, chosenYAxis);
        // updates tooltips with new info
        circlesyGroup = updateToolTip(chosenYAxis, circlesyGroup);
        // changes classes to change bold text
        if (chosenYAxis === "obese") {
          obeseLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
            healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        }
        else if (chosenYAxis === "healthcare") {
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel 
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        }
      }
    });
}); 
   
