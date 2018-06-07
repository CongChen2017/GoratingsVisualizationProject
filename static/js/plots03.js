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
    var cn_players = [];
    var kr_players = [];
    var wins = [];
    var losses = [];
    var results = [];
    for (i=0; i<response.length; i++) {
        games_label.push(response[i].cn_name + " vs " + response[i].kr_name);
        cn_players.push(response[i].cn_name);
        kr_players.push(response[i].kr_name);
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
            backgroundColor: 'rgba(255, 0, 0, 0.8)',
            // borderColor: window.chartColors.red,
            borderWidth: 1,
            data: wins,
            yAxisID: 'bar-y-axis1'
        }, {
            label: 'Losses',
            backgroundColor: 'rgba(0, 0, 255, 0.8)',
            // borderColor: window.chartColors.blue,
            data: losses,
            yAxisID: 'bar-y-axis1'
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
                display: true,
                position: "bottom",
            },
            scales: {
                xAxes: [{
                    display: false,
                    stacked: true,
                    id:'bar-x-axis',
                }],
                yAxes: [{
                    display: true,
                    stacked: true,
                    id:'bar-y-axis1',
                    ticks: {
                    // Include a dollar sign in the ticks
                    display: true,
                    autoSkip: false,
                    beginAtZero: true,
                    // callback: function(value, index, values) {
                    //     return '$' + value;
                    // }
                }
                }]
    }}
    // $.ajax({}).done(function (response){
    //     chart.data = response;
    //     chart.update();
    // })
    });

    var table_data = [{
        type: 'table',
        header: {
            values: [["Wins"], ["Losses"], ["Ties"]],
            align: "center",

        },
        cells: {
            values: [[W],[L],[D]]
        }
    }]

    Plotly.plot('summary', table_data);

    });
});


   