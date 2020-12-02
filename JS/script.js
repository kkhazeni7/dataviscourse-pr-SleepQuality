Promise.all([
   d3.csv("Data/final_sleep_data.csv"),
   d3.csv("Data/final_sleep_data_2.csv"),
   d3.csv("Data/final_sleep_data_3.csv"),
   d3.csv("Data/final_sleep_data_4.csv"),
   d3.csv("Data/final_sleep_data_5.csv"),
   d3.csv("Data/final_sleep_data_6.csv"),
   d3.csv("Data/final_sleep_data_7.csv"),
   d3.csv("Data/final_sleep_data_8.csv")

   
])
.then(function(data) {
   
    let sleepData = data;

    let graph = new Graph(sleepData);
    graph.drawGraph()

})
