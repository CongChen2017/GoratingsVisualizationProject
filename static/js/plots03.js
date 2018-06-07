var $size = Plotly.d3.select("#teamsize");
$size.on('change', function() {
    var teamsize = $size.property('value');
    console.log(teamsize);
    var base_url = "/teamfight/";

    endpoint = base_url + teamsize;
    // console.log(endpoint);
        // console.log(endpoint);
    Plotly.d3.json(endpoint, function(error, response) {
            console.log(response);
        
    var games_label = [];
    var wins = [];
    var losses = [];
    var results = [];
    for (i=0; i<response.length; i++) {
        games_label.push(response[i].cn_name + " vs " + response[i].kr_name);
        wins.push(-response[i].Win);
        losses.push(response[i].Loss);
        results.push(response[i].Result);
    };

    // console.log(games_label);
    // console.log(wins);
    console.log(results);
    var W = 0;
    var L = 0;
    var D = 0;

    for (j=0; j<results.length; j++) {
        if (results[j]=="Win") {
            W = W+1;
        }
        else if (results[j] == "Draw") {
            D = D+1;
        }
        else { L = L+1; }
    };

    var color = Chart.helpers.color;
    var horizontalBarChartData = {
        labels: games_label,
        datasets: [{
            label: 'Wins',
            backgroundColor: "red",
            // borderColor: window.chartColors.red,
            borderWidth: 1,
            data: wins
        }, {
            label: 'Losses',
            backgroundColor: "blue",
            // borderColor: window.chartColors.blue,
            data: losses
        }]

    };

    if(window.myHorizontalBar) {window.myHorizontalBar.destroy()};

    var ctx = document.getElementById('canvas').getContext('2d');
    window.myHorizontalBar = new Chart(ctx, {
        type: 'horizontalBar',
        data: horizontalBarChartData,
        options: {
            // Elements options apply to all of the options unless overridden in a dataset
            // In this case, we are setting the border of each horizontal bar to be 2px wide
            elements: {
                rectangle: {
                    borderWidth: 2,
                }
            },
            responsive: true,
            legend: {
                position: 'right',
            },
            scales: {
                xAxes: [{
                    display: false
                }]
            },
            title: {
                display: true,
                text: 'Game History Chinese Players vs S. Korean Players'
            }
        }
    }
    // $.ajax({}).done(function (response){
    //     chart.data = response;
    //     chart.update();
    // })
    );

    var table_data = [{
        type: 'table',
        header: {
            values: [["Wins"], ["Losses"], ["Draw"]],
            align: "center",

        },
        cells: {
            values: [[W],[L],[D]]
        }
    }]

    Plotly.plot('summary', table_data);

    });
});



// document.getElementById('randomizeData').addEventListener('click', function() {
//     var zero = Math.random() < 0.2 ? true : false;
//     horizontalBarChartData.datasets.forEach(function(dataset) {
//         dataset.data = dataset.data.map(function() {
//             return zero ? 0.0 : randomScalingFactor();
//         });

//     });
//     window.myHorizontalBar.update();
// });

// var colorNames = Object.keys(window.chartColors);

// document.getElementById('addDataset').addEventListener('click', function() {
//     var colorName = colorNames[horizontalBarChartData.datasets.length % colorNames.length];
//     var dsColor = window.chartColors[colorName];
//     var newDataset = {
//         label: 'Dataset ' + horizontalBarChartData.datasets.length,
//         backgroundColor: color(dsColor).alpha(0.5).rgbString(),
//         borderColor: dsColor,
//         data: []
//     };

//     for (var index = 0; index < horizontalBarChartData.labels.length; ++index) {
//         newDataset.data.push(randomScalingFactor());
//     }

//     horizontalBarChartData.datasets.push(newDataset);
//     window.myHorizontalBar.update();
// });

// document.getElementById('addData').addEventListener('click', function() {
//     if (horizontalBarChartData.datasets.length > 0) {
//         var month = MONTHS[horizontalBarChartData.labels.length % MONTHS.length];
//         horizontalBarChartData.labels.push(month);

//         for (var index = 0; index < horizontalBarChartData.datasets.length; ++index) {
//             horizontalBarChartData.datasets[index].data.push(randomScalingFactor());
//         }

//         window.myHorizontalBar.update();
//     }
// });

// document.getElementById('removeDataset').addEventListener('click', function() {
//     horizontalBarChartData.datasets.splice(0, 1);
//     window.myHorizontalBar.update();
// });

// document.getElementById('removeData').addEventListener('click', function() {
//     horizontalBarChartData.labels.splice(-1, 1); // remove the label first

//     horizontalBarChartData.datasets.forEach(function(dataset) {
//         dataset.data.pop();
//     });

//     window.myHorizontalBar.update();
// });
    





// var $selSamples = Plotly.d3.select("#selSamples");  // Locate dropdown box containing samples
// var $choose = Plotly.d3.select("#choose");
// var $plotly = Plotly.d3.select('#plot').select(".plotly");
// var selectedSample = "";  // Initialize selectedSample variable
// var isBeingUpdated = false; // Define page initialization variable (if true, then plot is on page)
// var otu_ids = [];
// var otu_descriptions = [];
// var global_trace;

// function BuildDropdown() {
//     // Get data from '/names' endpoint
//     endpoint = "/names";
//     Plotly.d3.json(endpoint, function(error, response) {
//         // console.log(response)
//         // console.log(response.name)
//         // console.log(response.rank)

//         // On select of new sample, add data to the array and chart
//         $selSamples.on('change', optionChanged);

//         // Add options to dropdown
//         var options = $selSamples
//             .selectAll('option')
//             .data(response).enter()
//             .append('option')
//                 .attr("value", (d => d.rank))
//                 .text(d => d.name);
        
//         // Add a blank option at the top.
//         var $ddBlank = $selSamples.insert("option", ":first-child")
//             .text("Select...").attr("value", "").attr("selected", true);
//         });
// }

// function BuildDropdown2() {
//     // Get data from '/names' endpoint
//     endpoint = "/names";
//     Plotly.d3.json(endpoint, function(error, response) {
//         // console.log(response);

//         // On select of new sample, add data to the array and chart
//         $choose.on('change', optionChanged2);

//         // Add options to dropdown
//         var options2 = $choose
//             .selectAll('option')
//             .data(response).enter()
//             .append('option')
//                 .attr("value", (d => d.rank))
//                 .text(d => d.name);
        
//         // Add a blank option at the top.
//         var $ddBlank = $choose.insert("option", ":first-child")
//             .text("Select...").attr("value", "").attr("selected", true);
//         });
// }

// BuildDropdown();

// BuildDropdown2();

// function optionChanged() {
//     // Obtain selected sample from dropdown
//     selectedPlayer = Plotly.d3.select('select').property('value');
//     // console.log(selectedPlayer)
//     // Call plot function with the new sample value
//     buildLineChart(selectedPlayer);
// };

// function optionChanged2() {
//     // Obtain selected sample from dropdown
//     selectedPlayer = Plotly.d3.select('#choose').property('value');
//     // console.log(selectedPlayer)
//     // Call plot function with the new sample value
//     updateLineChart(selectedPlayer);
// };
// // var base_url = "http://localhost:5000";

// function buildLineChart(player) {

//      // Get data from '/sample/<sample>' endpoint (for our metadata table)
//      endpoint = "/players/" + player;
//      Plotly.d3.json(endpoint, function(error, response) {
//          // console.log(response)

//          var winrate = response.Wins/response.Total*100;
//          var rate = winrate.toFixed(2)

//          // console.log(response.Wins);
//          // console.log(rate);
//          // Place sample metadata values into table
//          $sidebar = Plotly.d3.select(".sample-sidebar");
//          $sidebar.select("table").classed("displayed", true);  // Show table
//          $sidebar.select(".rank").text(response.Rank);
//          $sidebar.select(".rating").text(response.Elo);
//          $sidebar.select(".age").text(response.Birthday);
//          $sidebar.select(".location").text(response.Nation.toUpperCase());
//          $sidebar.select(".total").text(response.Total);
//          $sidebar.select(".wins").text(response.Wins);
//          $sidebar.select(".losses").text(response.Losses);
//          $sidebar.select(".rate").text(rate+"%");

//          // Place sample name in header
//          Plotly.d3.select(".col-md-8").select(".panel-body").text("Name: " + response.Name);  


//          var trace = {
//             type: "scatter",
//             mode: "lines",
//             name: response.Name,
//             x: response.Games.Date,
//             y: response.Games.Rating,
//             line: {color: '#17BECF'}

//         }

//         global_trace = trace;

//         var data = [trace];

//         var layout = {
//               width: 800,
//               height: 500,
//               title: "Go Player(s) Rating",
//               yaxis: {
//                 title: "Elo Score"
//               },
//               xaxis: {
//                 title: "Date"
//               }
//             };
        
//         Plotly.newPlot('plot', data, layout);    
        
        

//     });
// };

// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };

// function updateLineChart(player) {

//      // Get data from '/sample/<sample>' endpoint (for our metadata table)
//      endpoint = "/players/" + player;
//      Plotly.d3.json(endpoint, function(error, response) {
//          console.log(response)

//          var newcolor = getRandomColor();
//          var trace = {
//             type: "scatter",
//             mode: "lines",
//             name: response.Name,
//             x: response.Games.Date,
//             y: response.Games.Rating,
//             line: {color: newcolor}

//         }

//         Plotly.addTraces('plot', trace);

//     });
// };
   