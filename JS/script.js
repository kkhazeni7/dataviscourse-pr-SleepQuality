 d3.csv("Data/final_sleep_data.csv").then(function(data) {


    let sleepData = data;
    console.log(sleepData);
    let graph = new Graph(sleepData);
    graph.drawGraph()
 })
