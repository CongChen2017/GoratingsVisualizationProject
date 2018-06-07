
var $selSamples = Plotly.d3.select("#ddlViewBy");
var $plotly = Plotly.d3.select('#PieChart').select(".plotly");
var col1 = 'rgba(255, 99, 132, 0.7)';
var col2 = 'rgba(54, 162, 235, 0.7)';
var col3 = 'rgba(255, 206, 86, 0.7)';

$selSamples.on("change", myFunction);
function myFunction() {
    selected = Plotly.d3.select('select').property('value');
    console.log(selected);
    if ( selected === '1' ) {
        var endpoint = "/Top10";
        buildtable(endpoint);
    }
    else if (selected === '2') {
        var endpoint = "/Top20";
        buildtable(endpoint);
    }
    else if (selected === '3') {
        var endpoint = "/Top50";
        buildtable(endpoint);
    }
    console.log(endpoint);
    }

function buildtable(endpoint) {
    Plotly.d3.json(endpoint, function(error, response) {
        console.log(response)
        // console.log(response.name)
        // console.log(response.rank)

        // put data into table
        

        var name_list = [];
        var elo_list = [];
        var nation_list = [];
        var rank_list = [];

        for (i=0; i<response.length; i++) {
            name_list.push(response[i]["Name"]);
            elo_list.push(response[i]["Elo"]);
            nation_list.push(response[i]["Nation"]);
            rank_list.push(response[i]["Rank"]);
        };


        console.log(nation_list);

        var nation_color = [];

        for (c=0; c<nation_list.length; c++) {
            if (nation_list[c]==='cn') {
                nation_color.push(col1);
            }
            else if (nation_list[c] === 'kr') {
                nation_color.push(col2);
            }
            else {
                nation_color.push(col3);
            }
        };

        
        var country_count =[];
        

        var unique_nation = nation_list.filter(function(v,i) { return i==nation_list.lastIndexOf(v); });
        console.log(unique_nation);

        for (j=0; j<unique_nation.length; j++){
            var count = 0;
            for(var i = 0; i < nation_list.length; ++i){
            if(nation_list[i] == unique_nation[j])
                count++;
            }
            country_count.push(count);
        };

        console.log(country_count);

        var pie_data = [{
                values: country_count,
                labels: unique_nation,
                text: "Nationality",
                type: 'pie',
                textinfo: 'none',
                marker: {
                    colors: [col2, col3, col1]
                  },
            }];

            // Define pie plot layout
            var pie_layout = {
                height: 400,
                width: 400
                };

            // Output pie plot
            // if ($plotly.node() != null) {   // Redraw, if updating
            //     var PlotArea = document.getElementById("PieChart");
            //     // Call plotly.restyle to pass new data to it
            //     Plotly.restyle(PlotArea, "values", [pie_data]);
            // } else {
            //     // Build it fresh
            Plotly.newPlot("PieChart", pie_data, pie_layout);
            //     isBeingUpdated = true;  // From now on, we are updating the plot
            // } 

        var table_values = [
          rank_list,
          name_list,
          nation_list,
          elo_list
          ]

        var table_data = [{
          type: 'table',
          header: {
            values: [["Rank"], ["Name"],
                         ["Nationality"], ["Elo"]],
            align: "center",
            line: {width: 1, color: 'black'},
            fill: {color: "grey"},
            font: {family: "Arial", size: 12, color: "white"}
          },
          cells: {
            values: table_values,
            align: "center",
            line: {color: "black", width: 1},
            font: {family: "Arial", size: 11, color: ["black"]}
          }
        }]

        var table_layout = {
          autosize: false,
          width: 300,
          height: 700,
          margin: {
            l: 0,
            r: 50,
            b: 100,
            t: 10,
            pad: 4
          },
          plot_bgcolor: '#c7c7c7'
        };

        Plotly.newPlot('tabletable', table_data, table_layout);


        if(window.myHorizontalBar) {window.myHorizontalBar.destroy()};

        var ctx = document.getElementById('myChart').getContext('2d');

        window.myHorizontalBar = new Chart(ctx,{
                       type:'horizontalBar',
                       data:{
                           labels:name_list,
                           datasets:[{
                               // label: ,
                               data:elo_list,
                           backgroundColor:nation_color,
                           // 'rgba(255, 99, 132, 0.2)'
                           // 'rgba(54, 162, 235, 0.2)',
                           // 'rgba(255, 206, 86, 0.2)'
                           borderWidth:1,
                           hoverBorderWidth:2

                           }],
                       },
                       options:{

                           legend:{
                             display: false
                               }
                           }}
                       
                   );
    });
};
    // On select of new sample, add data to the array and chart
    // $selSamples.on('change', optionChanged);

    // // Add options to dropdown
    // var options = $selSamples
    //     .selectAll('option')
    //     .data(response).enter()
    //     .append('option')
    //         .attr("value", (d => d.rank))
    //         .text(d => d.name);
    
    // // Add a blank option at the top.
    // var $ddBlank = $selSamples.insert("option", ":first-child")
    //     .text("Select...").attr("value", "").attr("selected", true);
    // });

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

//         // var data = [global_trace, trace];

//         // var layout = {
//         //       width: 800,
//         //       height: 500,
//         //       title: "Go Player(s) Rating",
//         //       yaxis: {
//         //         title: "Elo Score"
//         //       },
//         //       xaxis: {
//         //         title: "Date"
//         //       }
//         //     };
        
//         // Plotly.newPlot('plot', data, layout);    

//     });
// };
    // // Get data from '/samples/<sample>' endpoint (for the top 10 samples for our pie chart)
    // endpoint = base_url + "/samples/" + sample;
    // Plotly.d3.json(endpoint, function(error, response) {
    //     if (error) return console.warn(error);
    
    //     // Place the top 10 OTU_ID's into a list
    //     top_otu_ids = response.otu_ids.slice(0, num_items).map(d => d);
    //     console.log(top_otu_ids);

    //     // Get all OTU_IDs and samples
    //     sample_values = response.sample_values.filter(d => d =! 0); // Only non-zero sample values
    //     otu_ids = response.otu_ids.slice(0, sample_values.length).map(d => d);  // Only OTU_ids for non-zero sample_values

    //     // Place the top 10 sample values into a list
    //     top_sample_values = response.sample_values.slice(0, num_items).map(d => d);

    //     // Get data from '/otu' endpoint
    //     endpoint = base_url + "/otu";
    //     Plotly.d3.json(endpoint, function(error, response) {
    //         if (error) return console.warn(error);
            
    //         // Get the corresponding OTU descriptions for the otu_id list from above
    //         // Place top 10 OTU descriptions into a list
    //         var top_otu_descriptions = [], otu_descriptions = [];      
    //         for (i = 0; i < 10; i++) { 
    //             var otu_index = otu_ids[i] - 1; // Set index to OTU_ID minus one, to get the index for the descriptions array

    //             // Append to otu_descriptions array
    //             otu_descriptions.push(response[otu_index]);

    //             // Append to top_otu_descriptions array
    //             if (i < 10)
    //                 top_otu_descriptions.push(response[otu_index]);
    //         }

    //         // Assemble pie plot data
    //         var data = [{
    //             values: top_sample_values,
    //             labels: top_otu_ids,
    //             text: otu_descriptions,
    //             type: 'pie',
    //             textinfo: 'none'
    //         }];
        
    //         // Define pie plot layout
    //         var layout = {
    //             height: 600,
    //             width: 800
    //           };
            
    //         // Output pie plot
    //         if ($plotly.node() != null) {   // Redraw, if updating
    //             var PlotArea = document.getElementById("pie");
    //             // Call plotly.restyle to pass new data to it
    //             Plotly.restyle(PlotArea, "values", [data]);
    //         } else {
    //             // Build it fresh
    //             Plotly.plot("pie", data, layout);
    //             isBeingUpdated = true;  // From now on, we are updating the plot
    //         }   
            
    //         // Output bubble plot
    //         var sample_values_sizes = sample_values.map(d => d*5); // Increase the size of the bubbles fourfold, so we can see them!
    //         var trace1 = {
    //             x: otu_ids,
    //             y: sample_values,
    //             mode: 'markers',
    //             text: otu_descriptions,
    //             marker: {
    //                 color: otu_ids,
    //                 colorscale: [[0, 'rgb(200, 255, 200)'], [1, 'rgb(0, 100, 0)']],
    //                 cmin: Math.min(otu_ids),
    //                 cmax: Math.max(otu_ids),
    //                 size: sample_values_sizes,
    //                 sizemode: 'area',
    //                 sizeref: 1,
    //                 showscale: true,
    //                 colorbar: {
    //                   thickness: 10,
    //                   y: 0.5,
    //                   ypad: 0,
    //                   title: 'OTU ID',
    //                   titleside: 'bottom',
    //                   outlinewidth: 1,
    //                   outlinecolor: 'black',
    //                   tickfont: {
    //                     family: 'Lato',
    //                     size: 14,
    //                     color: 'green'
    //                   }
    //                 }
    //               }
    //           };
    //           var data = [trace1];
    //           Plotly.newPlot('bubble', data);
    //     });
    // });

    // // Gauge Plot 
    // endpoint = base_url + "/wfreq/" + sample;
    // Plotly.d3.json(endpoint, function (error, response) {
    //     // Enter a speed between 0 and 180
    //     var freq_adj = response.WFREQ * 18

    //     // Trig to calc meter point
    //     var degrees = 180 - freq_adj,
    //         radius = .5;
    //     var radians = degrees * Math.PI / 180;
    //     var x = radius * Math.cos(radians);
    //     var y = radius * Math.sin(radians);

    //     // Path: may have to change to create a better triangle
    //     var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
    //         pathX = String(x),
    //         space = ' ',
    //         pathY = String(y),
    //         pathEnd = ' Z';
    //     var path = mainPath.concat(pathX, space, pathY, pathEnd);

    //     var data = [{
    //         type: 'scatter',
    //         x: [0], y: [0],
    //         marker: { size: 14, color: '850000' },
    //         showlegend: false,
    //         name: 'Washing Frequency',
    //         text: response.WFREQ,
    //         hoverinfo: 'text+name'
    //     },
    //     {
    //         values: [50 / 5, 50 / 5, 50 / 5, 50 / 5, 50 / 5, 50],
    //         rotation: 90,
    //         text: ['Very high', 'High', 'Average', 'Low',
    //             'Very low'],
    //         textinfo: 'text',
    //         textposition: 'inside',
    //         marker: {
    //             colors: ['rgba(rgba(0, 255, 0, .75)',
    //                 'rgba(200, 255, 150, .75)', 'rgba(255, 255, 42, .75)',
    //                 'rgba(255, 140, 0, .75)', 'rgba(255, 0, 0, .75)',
    //                 'rgba(255, 255, 255, 0)']
    //         },
    //         labels: ['More than 9', '6 to 8', '4 to 6', '2 to 4', '0 to 2', ''],
    //         hoverinfo: 'label',
    //         hole: .5,
    //         type: 'pie',
    //         showlegend: false
    //     }];

    //     var layout = {
    //         shapes: [{
    //             type: 'path',
    //             path: path,
    //             fillcolor: '850000',
    //             line: {
    //                 color: '850000'
    //             }
    //         }],
    //         title: '<b>Washing Frequency Gauge</b> <br> Washing times/wk',
    //         height: 400,
    //         width: 400,
    //         xaxis: {
    //             zeroline: false, showticklabels: false,
    //             showgrid: false, range: [-1, 1]
    //         },
    //         yaxis: {
    //             zeroline: false, showticklabels: false,
    //             showgrid: false, range: [-1, 1]
    //         }
    //     };

    //     Plotly.newPlot('gauge', data, layout);
    // });
