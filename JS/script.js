// d3.csv("Data/datasleep.csv").then(function(data) {


//     //console.log(data)

//     let graph = new Graph(data)
//     graph.drawGraph()
// })

Promise.all([
    d3.csv("Data/final_sleep_data.csv"),
  
  ]).then(function(data) {

     let sleepData = data;
     console.log(sleepData);




   // console.log(data[0][0])  // first row of cities
    //console.log(data[1][0])  // first row of animals
  });
// var sleepJson = d3.json("Data/sleep.json").then(function(data) {



   
//     // let graph = new Graph(data)
//     // graph.drawGraph()
// })
// .catch(function(d) {
//     console.log("rejected: " + d)
// })

// var scoreCSV = d3.csv("Data/sleep_score.csv").then(function(data) {


   

//     // let graph = new Graph(data)
//     // graph.drawGraph()
// })
// .catch(function(d) {
//     console.log("rejected: " + d)
// })

// console.log(scoreCSV)
