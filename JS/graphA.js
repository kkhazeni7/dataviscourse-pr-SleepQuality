class Graph
{
    constructor(data)
    {
        this.sleepData = data;


        // this.singleRoutine = this.sleepData.filter(d => d.SleepNotes.split(":" , 1).length == 1)
        // console.log(this.singleRoutine)

        this.deepSleep = this.sleepData.map(d => d.deep)
        console.log([d3.min(this.deepSleep) , d3.max(this.deepSleep)])
        
         
    }

    drawGraph()
    {
        d3.select("#chart")
           .select("#chart-view")
           .attr("width" , 500)
           .attr("height" , 500)

        this.xScale = d3.scaleLinear()
                         .domain([200,600])
                         .range([50,475])
        this.yScale = d3.scaleLinear()
                         .domain([0,100])
                         .range([400,125])

        var xTicks = [200,300,400,500,600];
        var yTicks = [0,25,50,75,100];
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
        for(let j = 0; j < yTicks.length; j++)
        {
            this.view.append("text")
                      .attr("y" , this.yScale(yTicks[j]))
                      .attr("x" , 25)
                      .text(yTicks[j])
                      .style("font-size", "10pt")
                      .style("font-family" , "sans-serif")
                      .style("font-weight" , 600)
        }


        
        let labelX = this.view.append("text")
                               .classed("label" , true)
                               .attr("x" , 200)
                               .attr("y" , 450)
                               .text("Sleep Length")
                               .style("font-size", "10pt")
                               .style("font-family" , "sans-serif")
                               .style("font-weight" , 600)
        let labelY = this.view.append("text")
                               .classed("label" , true)
                               .attr("x" , 10)
                               .attr("y" , 250)
                               .attr("transform" , "rotate(90)")
                               .text("Sleep Score")
                               .style("font-size", "10pt")
                               .style("font-family" , "sans-serif")
                               .style("font-weight" , 600)
    
        //this.drawRectangles(this.view)
                               
                 
        this.drawPlot(this.view)


                         
           
    }

    drawPlot(view)
    {
        

        let that = this;

        let xScale = d3.scaleLinear()
                        .domain([d3.min(that.sleepData.map(d => d.Duration)),d3.max(that.sleepData.map(d => d.Duration))])
                        .range([50,450])
        let yScale = d3.scaleLinear()
                        .domain([d3.min(that.sleepData.map(d => d.overall_score)),d3.max(that.sleepData.map(d => d.overall_score))])
                        .range([400,125])


        console.log([d3.min(that.sleepData.map(d => d.Duration)),d3.max(that.sleepData.map(d => d.Duration))])
       

        for(let i = 0; i < that.sleepData.length; i++)
        {
            view.append("circle")
                        .data(that.sleepData)
                        .attr("cx" ,xScale(parseInt(that.sleepData[i].Duration)))
                        .attr("cy" ,yScale(parseInt(that.sleepData[i].overall_score)))
                        .attr("r" , 4)
                        .style("fill" , "red")
                        .style("stroke" , "black")
                     
            // view.append("circle")
            //             .data(that.sleepData)
            //             .attr("cx" ,xScale((that.sleepData[i].light)/that.sleepData[i].minutesAsleep))
            //             .attr("cy" ,yScale(that.sleepData[i].overall_score))
            //             .attr("r" , 1.5)
            //             .style("fill" , "blue")
            //             .style("stroke" , "black")
            //  view.append("circle")
            //             .data(that.sleepData)
            //             .attr("cx" ,xScale((that.sleepData[i].wake)/that.sleepData[i].minutesAsleep))
            //             .attr("cy" ,yScale(that.sleepData[i].overall_score))
            //             .attr("r" , 1.5)
            //             .style("fill" , "green")
            //             .style("stroke" , "black")
            // view.append("circle")
            //             .data(that.sleepData)
            //             .attr("cx" ,xScale((that.sleepData[i].rem)/that.sleepData[i].minutesAsleep))
            //             .attr("cy" ,yScale(that.sleepData[i].overall_score))
            //             .attr("r" , 1.5)
            //             .style("fill" , "yellow")
            //             .style("stroke" , "black")
        }

        d3.selectAll("circle").data(that.sleepData)
        .on("click" , function(d , i){
            console.log(d)
            console.log(i)
            that.drawPie(d);
        } )
        //this is for deep sleep percent
        // let plots = view.append("circle")
        //                 .data(that.sleepData)
        //                 .attr("cx" , d => xScale((d.levels.summary.deep.minutes)/d.minutesAsleep))
        //                 .attr("cy" , d => yScale(d.efficiency))
        //                 .attr("r" , 1)
        //                 .style("fill" , "red")
        //                 .style("stroke" , "black")
                    

    }

    drawPie(d)
    {
        let that = this;
        var vals = [{stage: "Deep" , value: d.deep/d.minutesAsleep},
                    {stage: "Light" , value: d.light/d.minutesAsleep},
                    {stage: "Wake" , value: d.wake/d.minutesAsleep},
                    {stage: "Rem" , value: d.rem/d.minutesAsleep}];
        
        var radius = 200;
        var pie = d3.select("#chart")
                     .select("#pie-chart")
                      


        
        var color = d3.scaleOrdinal(d3.schemeDark2)
        var data = d3.pie().sort(null).value(function(d){return d.value;})(vals);
        console.log(data)
        var segments = d3.arc()
                         .innerRadius(0)
                         .outerRadius(200)
                         .padAngle(.05)
                         .padRadius(50);
        var sections = pie.append("svg").attr("width", 500).attr("height", 500).append("g").attr("transform" ,"translate(250,250)")
        .selectAll("path").data(data);
        sections.enter().append("path").attr("d" , segments).attr("fill" , function(d) {return color(d.data.value)})

        var content = pie.select("g").selectAll("text").data(data);
        content.enter().append("text").each(function(d){
            var center = segments.centroid(d);
            d3.select(this).attr("x" , center[0])
            .attr("y", center[1])
            .text(d.data.stage)
        })
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

        
        coffeeAvg = coffeeAvg/coffeeData.length;
        console.log("Coffee Average Quality:  " + coffeeAvg)
        console.log("Number of single days:  " + coffeeData.length)
        teaAvg = teaAvg/teaData.length;
        console.log("Tea Average Quality:  " + teaAvg)
        console.log("Number of single days:  " + teaData.length)
        workAvg = workAvg/workoutData.length;
        console.log("Workout Average Quality:  " + workAvg)
        console.log("Number of single days:  " + workoutData.length)
        stressAvg =  stressAvg/stressData.length;
        console.log("Stress Average Quality:  " + stressAvg)
        console.log("Number of single days:  " + stressData.length)


        

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