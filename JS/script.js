d3.csv("Data/datasleep.csv").then(function(data) {


    console.log(data)

    let graph = new Graph(data)
    graph.drawGraph()
})