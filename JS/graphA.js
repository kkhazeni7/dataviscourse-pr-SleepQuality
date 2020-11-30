class Graph
{
    constructor(data)
    {
        this.sleepData = data;
        this.p1Data = data[0]
        this.p2Data = data[1]
        this.p3Data = data[2]
        this.p4Data = data[3]
        this.p5Data = data[4]
        this.p6Data = data[5]
        this.p7Data = data[6]        
        this.p8Data = data[7]

        this.barCounter = 0
        this.barCounter = this.barCounter + 1
        this.barChart = new Bar(this.p1Data,this.sleepData, 0)




        // this.singleRoutine = this.sleepData.filter(d => d.SleepNotes.split(":" , 1).length == 1)
        // console.log(this.singleRoutine)

        // this.deepSleep = this.sleepData.map(d => d.deep)
        // console.log([d3.min(this.deepSleep) , d3.max(this.deepSleep)])
        
         
    }

    drawGraph()
    {

        
         d3.select("#chart")
            .select("#chart-view")
            .attr("width" , 250)
            .attr("height" , 1600)
        let that = this;
        that.view = d3.select("#chart-view")
                       .append("svg")
                       .classed("chart-svg" , true)
                       .attr("width" , 600)
                       .attr("height" , 1800)
        var yTicks = [0,25,50,75,100]

        for(let i = 0; i < 8; i++)
        {

            
            if(i < 4)
            {
            var yLoc = (i + 1) * 200;
            var currPerson = that.sleepData[i]
            this.svgChart = that.view.append("g")
                                .attr("class", "p_chart"+(i+1))
                                .attr("width" , 250)
                                .attr("height" ,250 )
                                .attr("x",20)
                                .attr("y",yLoc - 100)
          
                                
            
            //var dataObject = new Date();
            //var date holds all the dates of the persons data, where as dateArr has the
            //first date, the middle date, and the last date for tick purposes on the x
            //axis for each graph
            var date = currPerson.map(d => d.dateOfSleep)
            var dateArr = [date[0], date[Math.floor(date.length /2)], date[date.length - 1]]

            //Quality will be the overall score of the persons sleep
            //the min_max var will hold the range from the min and max of those scores
            var quality = currPerson.map(d => d.overall_score)
            var min_max = d3.extent(quality)
          
            this.xScale = d3.scaleLinear()
                        .domain([new Date(Date.parse(date[0])), new Date(Date.parse(date[date.length - 1]))])
                        .range([50,250])
            this.yScale = d3.scaleLinear()
                        .domain([0,100])
                        .range([yLoc -100, yLoc - 190])
            that.svgChart.append("text")
                        .attr("x" , yLoc - 875)
                        .attr("y" , 25)
                        .style("stroke" , "black")
                        .style("font-size", "9pt")
                        .attr("transform" , "rotate(270)")         
                        .text("Quality")
            that.svgChart.append("text")
                        .attr("x" , 130)
                        .attr("y" , yLoc-125)
                        .style("stroke" , "grey")
                        .style("font-size", "12pt")
                        .style("stroke-width" , .7)
                        .text("Person " + (i+1))

           for(let j = 0; j < yTicks.length; j++)
            {
                that.svgChart.append("text")
                              .attr("x" ,45)
                              .attr("y", that.yScale(yTicks[j]))
                              .style("stroke" , "gray")
                              .style("font-size", "9pt")
                              .style("text-anchor" , "end")
                              .text(yTicks[j])
            }
            for(let j = 0; j < dateArr.length; j++)
            {
                that.svgChart.append("text")
                             .attr("x", 50 + (75*j))
                             .attr("y" , yLoc - 80)
                             .style("stroke" , "gray")
                             .style("font-size", "9pt")
                             .style("text-anchor" , "start")
                             .text(dateArr[j])
                             
            }
            let lineX = that.view.select(".p_chart"+(i+1)).append("line")
                         .attr("x1" , 50)
                         .attr("y1" ,yLoc-100)
                         .attr("x2" , 250)
                         .attr("y2" , yLoc-100)
                         .style("stroke-width", 2)
                         .style("stroke" , "black")
                   
            let lineY = that.view.select(".p_chart"+(i+1)).append("line")
                         .attr("x1" , 50)
                         .attr("y1" ,yLoc-100)
                         .attr("x2" , 50)
                         .attr("y2" , yLoc - 200)
                         .style("stroke-width", 2)
                         .style("stroke" , "black")
            
            let path = that.view.select(".p_chart"+(i+1)).append("path")
                                    .datum(currPerson)
                                    .attr("fill" , "none")
                                    .attr("stroke" , "steelblue")
                                    .attr("stroke-width" , 1.5)
                                    .attr("d" , d3.line()
                                        .x(d => that.xScale(new Date(Date.parse(d.dateOfSleep))))
                                        .y(d => that.yScale(d.overall_score))
                                    )
                                    .on("mouseover", function(d)
                                    {
                                        that.view.select(".p_chart"+(i+1)).select("path")
                                        .attr("stroke" , "red")
                                    })
                                    .on("mouseout", function(d)
                                    {
                                        that.view.select(".p_chart"+(i+1)).select("path")
                                        .attr("stroke" , "steelblue")
                                        
                                    })
                                    .on("click" , function(d)
                                    {
                                        if(that.barCounter > 0)
                                        {
                                            that.barChart.updateHeaderData(d,i)
                                        }
                                        else{
                                        // that.barCounter = that.barCounter + 1
                                        // that.barChart = new Bar(d,that.sleepData, i)
                                        }
                                        
                                        
                                    })
           
            }
            if(i >= 4)
            {
            var yLoc = (i -3) * 200;
            var currPerson = that.sleepData[i]
            this.svgChart = that.view.append("g")
                                .attr("class", "p_chart"+(i+1))
                                .attr("width" , 250)
                                .attr("height" ,250 )
                                .attr("x", 300)
                                .attr("y",yLoc - 100)
                                
                                

            
            //var dataObject = new Date();
            var date = currPerson.map(d => d.dateOfSleep)
            var dateArr = [date[0], date[Math.floor(date.length/2)], date[date.length - 1]]

            var quality = currPerson.map(d => d.overall_score)
            var min_max = d3.extent(quality)
          
            this.xScale = d3.scaleLinear()
                        .domain([new Date(Date.parse(date[0])), new Date(Date.parse(date[date.length - 1]))])
                        .range([300,500])
            this.yScale = d3.scaleLinear()
                        .domain([0,100])
                        .range([yLoc -100, yLoc - 190])
            that.svgChart.append("text")
                        .attr("x" , 380)
                        .attr("y" , yLoc-125)
                        .style("stroke" , "grey")
                        .style("font-size", "12pt")    
                        .style("stroke-width" , .7)  
                        .text("Person " + (i+1))
            for(let j = 0; j < yTicks.length; j++)
            {
                that.svgChart.append("text")
                              .attr("x" ,295)
                              .attr("y", that.yScale(yTicks[j]))
                              .style("stroke" , "gray")
                              .style("font-size", "9pt")
                              .style("text-anchor" , "end")
                              .text(yTicks[j])
            }
            for(let j = 0; j < dateArr.length; j++)
            {
                that.svgChart.append("text")
                             .attr("x", 300 + (75*j))
                             .attr("y" , yLoc - 80)
                             .style("stroke" , "gray")
                             .style("font-size", "9pt")
                             .style("text-anchor" , "start")
                             .text(dateArr[j])
                             
            }

            
            let lineX = that.view.select(".p_chart"+(i+1)).append("line")
                         .attr("x1" , 300)
                         .attr("y1" ,yLoc-100)
                         .attr("x2" , 500)
                         .attr("y2" , yLoc-100)
                         .style("stroke-width", 2)
                         .style("stroke" , "black")
                   
            let lineY = that.view.select(".p_chart"+(i+1)).append("line")
                         .attr("x1" , 300)
                         .attr("y1" ,yLoc-100)
                         .attr("x2" , 300)
                         .attr("y2" , yLoc - 200)
                         .style("stroke-width", 2)
                         .style("stroke" , "black")
            console.log("about to draw path")
            let path = that.view.select(".p_chart"+(i+1)).append("path")
                                    .datum(currPerson)
                                    .attr("fill" , "none")
                                    .attr("stroke" , "steelblue")
                                    .attr("stroke-width" , 1.5)
                                    .attr("d" , d3.line()
                                        .x(d => that.xScale(new Date(Date.parse(d.dateOfSleep))))
                                        .y(d => that.yScale(d.overall_score))
                                    )
                                    .on("mouseover", function(d)
                                    {
                                        that.view.select(".p_chart"+(i+1)).select("path")
                                        .attr("stroke" , "red")
                                    })
                                    .on("mouseout", function(d)
                                    {
                                        that.view.select(".p_chart"+(i+1)).select("path")
                                        .attr("stroke" , "steelblue")
                                    })
                                    .on("click" , function(d)
                                    {
                                        if(that.barCounter > 0)
                                        {
                                            that.barChart.updateHeaderData(d,i)
                                        }
                                        // else{
                                        // that.barCounter = that.barCounter + 1
                                        // that.barChart = new Bar(d,that.sleepData, i)
                                        // }
                                        
                                    })
                                        
            }
        }                       
           
    }

}