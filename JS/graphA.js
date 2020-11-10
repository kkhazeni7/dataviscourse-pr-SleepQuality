class Graph
{
    constructor(data)
    {
        this.sleepData = data;

        this.singleRoutine = this.sleepData.filter(d => d.SleepNotes.split(":" , 1).length == 1)
          console.log(this.singleRoutine)

        
         
    }

    drawGraph()
    {
        d3.select("#chart")
           .select("#chart-view")
           .attr("width" , 500)
           .attr("height" , 500)



        this.xScale = d3.scaleLinear()
                         .domain([0,100])
                         .range([50,475])

        var xTicks = [0,25,50,75,100];
        this.view = d3.select("#chart-view")
                       .append("svg")
                       .classed("chart-svg" , true)
                       .attr("width" , 500)
                       .attr("height" , 500)
        
        let lineX = this.view.append("line")
                         .attr("x1" , 50)
                         .attr("y1" ,400)
                         .attr("x2" , 50)
                         .attr("y2" , 100)
                         .attr("stroke-wdith", 2)
                         .attr("stroke" , "black")
        let lineY = this.view.append("line")
                         .attr("x1" , 50)
                         .attr("y1" ,400)
                         .attr("x2" , 600)
                         .attr("y2" , 400)
                         .attr("stroke-wdith", 2)
                         .attr("stroke" , "black")
        
        for(let j = 0; j < xTicks.length; j++)
        {
            this.view.append("text")
                      .attr("x" , this.xScale(xTicks[j]))
                      .attr("y" , 420)
                      .text(xTicks[j])
                      .style("font-size", "10pt")
                      .style("font-family" , "sans-serif")
                      .style("font-weight" , 600)
        }

        
        let labelX = this.view.append("text")
                               .classed("label" , true)
                               .attr("x" , 200)
                               .attr("y" , 450)
                               .text("Sleep Quality")
                               .style("font-size", "10pt")
                               .style("font-family" , "sans-serif")
                               .style("font-weight" , 600)
        let labelY = this.view.append("text")
                               .classed("label" , true)
                               .attr("x" , 10)
                               .attr("y" , 250)
                               .attr("transform" , "rotate(90)")
                               .text("Routine")
                               .style("font-size", "10pt")
                               .style("font-family" , "sans-serif")
                               .style("font-weight" , 600)
    
        this.drawRectangles(this.view)
                               
                               


                         
           
    }

    drawRectangles(view)
    {


        var coffeeData = [];
        var teaData = [];
        var workoutData = [];
        var stressData = [];
        
        var coffeeAvg = 0;
        var teaAvg = 0;
        var workAvg = 0;
        var stressAvg = 0;

        //var ateData = [];
        //var stressData = [];

        let that = this;
        for(let i = 0; i < that.singleRoutine.length; i++)
        {
            if(that.singleRoutine[i].SleepNotes == "Drank coffee")
            {
                coffeeData.push(that.singleRoutine[i])
                coffeeAvg = coffeeAvg + parseInt(that.singleRoutine[i].Quality)
            }
            if(that.singleRoutine[i].SleepNotes == "Drank tea")
            {
                teaData.push(that.singleRoutine[i])
                teaAvg = teaAvg + parseInt(that.singleRoutine[i].Quality)

            }
            if(that.singleRoutine[i].SleepNotes == "Worked out")
            {
                workoutData.push(that.singleRoutine[i])
                workAvg = workAvg + parseInt(that.singleRoutine[i].Quality)

            }
            if(that.singleRoutine[i].SleepNotes == "Stressful day")
            {
                stressData.push(that.singleRoutine[i])
                stressAvg = stressAvg + parseInt(that.singleRoutine[i].Quality)

            }
        }

        console.log(coffeeAvg)
        coffeeAvg = coffeeAvg/coffeeData.length;
        console.log(coffeeAvg)
        teaAvg = teaAvg/teaData.length;
        workAvg = workAvg/workoutData.length;
        stressAvg =  stressAvg/stressData.length;


        console.log(coffeeData)
        console.log(teaData)
        this.widthScale = d3.scaleLinear()
            .domain([0 , 100])
            .range([0, 400]);


        
        let rectCoffee = view.append("rect")
                        .attr("x" , 50)
                        .attr("y" , 370)
                        .attr("width" ,that.widthScale(coffeeAvg))
                        .attr("height" , 30)
                        .style("fill" , "firebrick")
                        .style("stroke-width" , "1px")
                        .style("stroke" , "black")
        let rectTea = view.append("rect")
                        .attr("x" , 50)
                        .attr("y" , 320)
                        .attr("width" ,that.widthScale(teaAvg))
                        .attr("height" , 30)
                        .style("fill" , "steelblue")
                        .style("stroke-width" , "1px")
                        .style("stroke" , "black")
       let rectWork = view.append("rect")
                        .attr("x" , 50)
                        .attr("y" , 270)
                        .attr("width" ,that.widthScale(workAvg))
                        .attr("height" , 30)
                        .style("fill" , "green")
                        .style("stroke-width" , "1px")
                        .style("stroke" , "black")
       let rectStress = view.append("rect")
                        .attr("x" , 50)
                        .attr("y" , 220)
                        .attr("width" ,that.widthScale(stressAvg))
                        .attr("height" , 30)
                        .style("fill" , "orange")
                        .style("stroke-width" , "1px")
                        .style("stroke" , "black")
    }
}