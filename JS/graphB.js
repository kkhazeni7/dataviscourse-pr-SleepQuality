class Bar
{
    constructor(data, i)
    {
        this.currPerson = data
        this.numOfPerson = i
        console.log(i)
        this.textOnChart = false
        this.drawBar(0)
        
    }

    drawBar(iter)
    {
        if(iter < 1)
        {
        d3.select("#chart")
        .select("#bar-chart")
        .attr("width" , 700)
        .attr("height" , 1600)
        let that = this;

        var maxTime = d3.max(that.currPerson.map(d => d.minutesAsleep))

        //minutesToHours is a method that takes in given minutes and converts to an hour minute string format
        var stringTimeD = that.minutesToHours(maxTime)
        var stringTimeC = that.minutesToHours(Math.floor(maxTime*(3/4)))
        var stringTimeB = that.minutesToHours(maxTime/2)
        var stringTimeA = that.minutesToHours(Math.floor(maxTime*(1/4)))

        var yTicks = ["0:00" , stringTimeA, stringTimeB, stringTimeC, stringTimeD]
        //The first chunk of data will be present in a two week span, the default will be from the last recording date
        //to 14 days(2 weeks) prior, hence the x.length - 14
        var x = that.currPerson.map(d => d.dateOfSleep)
        var xTicks = x.slice((x.length - 1) - 14, x.length - 1)

        
        


        this.label  = d3.select("#bar-chart")
                         .append("header")
                         .append("h3")
                         .text("Person " + (that.numOfPerson + 1 )+ ": Stages of Sleep")
        this.bar = d3.select("#bar-chart")
                   .append("svg")
                   .classed("bar-svg" , true)
                   .attr("width" , 700)
                   .attr("height" , 1800)

        let lineX = d3.select("#bar-chart")
                    .select(".bar-svg")
                    .append("line")
                   .attr("x1" , 50)
                   .attr("y1" ,400)
                   .attr("x2" , 640)
                   .attr("y2" , 400)
                   .style("stroke-width", 2)
                   .style("stroke" , "black")
             
        let lineY = d3.select("#bar-chart")
                   .select(".bar-svg")
                   .append("line")
                  .attr("x1" , 50)
                  .attr("y1" ,400)
                  .attr("x2" , 50)
                  .attr("y2" , 50)
                  .style("stroke-width", 2)
                  .style("stroke" , "black")
        

                  iter++
        }
        if(iter > 0)
        {
        let that = this;
        //console.log(that.currPerson)
        var date = that.currPerson.map(d => d.dateOfSleep)
        var time = that.currPerson.map(d => d.minutesAsleep)
        //console.log(time)


        var maxTime = d3.max(that.currPerson.map(d => d.minutesAsleep))
        var minTime = d3.min(that.currPerson.map(d => d.minutesAsleep))

        //minutesToHours is a method that takes in given minutes and converts to an hour minute string format
        var stringTimeD = that.minutesToHours(maxTime)
        var stringTimeC = that.minutesToHours(Math.floor(maxTime*(3/4)))
        var stringTimeB = that.minutesToHours(Math.floor(maxTime/2))
        var stringTimeA = that.minutesToHours(Math.floor(maxTime*(1/4)))

        var yMinutes =[0 ,Math.floor(maxTime*(1/4)), Math.floor(maxTime/2), Math.floor(maxTime*(3/4)), maxTime ]
        var yTicks = ["0:00" , stringTimeA, stringTimeB, stringTimeC, stringTimeD]
        //The first chunk of data will be present in a two week span, the default will be from the last recording date
        //to 14 days(2 weeks) prior, hence the x.length - 14
        var x = that.currPerson.map(d => d.dateOfSleep)
        var xTicks = x.slice((x.length - 1) - 14, x.length - 1)
        this.xScale = d3.scaleLinear()
                  .domain([new Date(Date.parse(xTicks[0])), new Date(Date.parse(xTicks[xTicks.length - 1]))])
                  .range([50,600])
        this.yScale = d3.scaleLinear()
                  .domain([0,yMinutes[yMinutes.length - 1]])
                  .range([400, 60])

        if(that.textOnChart == false)
        {
            for(let j = 0; j < yTicks.length; j++)
            {
                d3.select("#bar-chart")
                    .select(".bar-svg")
                    .append("text")
                    .attr("class" , "y-text"+j)
                    .attr("x" ,30)
                    .attr("y", that.yScale([yMinutes[j]]))
                    .style("stroke" , "gray")
                    .style("font-size", "9pt")
                    .style("text-anchor" , "end")
                    .text(yTicks[j])
                d3.select("#bar-chart")
                    .select(".bar-svg")
                    .append("line")
                    .attr("x1" ,43)
                    .attr("y1", that.yScale([yMinutes[j]]))
                    .attr("x2" ,57)
                    .attr("y2", that.yScale([yMinutes[j]]))
                    .style("stroke" , "black")
                    .style("stroke-width" , 1)

        
                  }
        for(let j = 0; j < xTicks.length; j++)
        {
            d3.select("#bar-chart")
                .select(".bar-svg")
                .append("text")
                .attr("class" , "x-text"+j)
                .attr("y" ,20 + that.xScale(new Date(Date.parse(xTicks[j]))))
                .attr("x", -410)
                .attr('transform', 'rotate(-90)')
                .style("stroke" , "gray")
                .style("font-size", "9pt")
                .style("text-anchor" , "end")
                .text(xTicks[j])
                .on("mouseover", function()
                {
                    d3.select("#bar-chart")
                      .select(".bar-svg")
                      .select(".x-text"+j)
                      .style("font-size" , 25)
                })
                .on("mouseout", function()
                {
                    d3.select("#bar-chart")
                      .select(".bar-svg")
                      .select(".x-text"+j)
                      .style("font-size" , 12)
                })
                
                
            d3.select("#bar-chart")
                .select(".bar-svg")
                .append("line")
                .attr("x1" ,13 + that.xScale(new Date(Date.parse(xTicks[j]))))
                .attr("y1", 407)
                .attr("x2" ,13 + that.xScale(new Date(Date.parse(xTicks[j]))))
                .attr("y2", 393)
                .style("stroke" , "black")
                .style("stroke-width" , 1)

        
        }
        that.textOnChart = true
        console.log(that.currPerson)
        that.drawRectangles(that.currPerson,xTicks, 0)
    }
    else if(that.textOnChart == true)
        {
         for(let j = 0; j < yTicks.length; j++)
        {
            d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".y-text"+j)
                .text(yTicks[j])    
        }
        for(let j = 0; j < xTicks.length; j++)
        {
            d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".x-text"+j)
                .text(xTicks[j])
                .on("mouseover", function()
                {
                    d3.select("#bar-chart")
                      .select(".bar-svg")
                      .select(".x-text"+j)
                      .style("font-size" , 25)
                })
                .on("mouseout", function()
                {
                    d3.select("#bar-chart")
                      .select(".bar-svg")
                      .select(".x-text"+j)
                      .style("font-size" , 12)
                })       
        }
        console.log(that.currPerson)
        that.drawRectangles(that.currPerson,xTicks, 1)

        }
    }
    
        
                        
    }

    minutesToHours(num)
    {
        var hours = Math.floor(num / 60);  
        var minutes = num % 60;
        if(minutes < 10)
        {
            return hours+ ":0" + minutes
        }
        else
        {
        return hours+ ":" + minutes
        }
    }
    updateHeaderData(newData,newI)
    {
        let that = this;
        that.currPerson = newData
        that.numOfPerson = newI
        console.log(newI)

        d3.select("#bar-chart").select("header").select("h3").text("Person " + (that.numOfPerson + 1 )+ ": Stages of Sleep")
        that.drawBar(1)
    }

    drawRectangles(data, dateRange, iter)
    {
        let that = this;
        let xLocations = dateRange
        let dataRange = data.slice((data.length-1) - 14, data.length-1)
        console.log(dataRange)
        console.log(dateRange)

     
   
        //first time doing rectangles
        if(iter < 1)
        {
            for(let j = 0; j < dataRange.length; j++)
            {
            for(let i = 0; i < 3; i++)
            {
                //light Sleep
                if(i == 0)
                {
                    d3.select("#bar-chart")
                    .select(".bar-svg")
                    .append("rect").attr("class" , "rect-"+j+""+i)
                    .attr("x", that.xScale(new Date(Date.parse(xLocations[j]))))
                    .attr("y", that.yScale(dataRange[j].light))
                    .attr("width", 25)
                    .attr("height", 400 - that.yScale(dataRange[j].light))
                    .style("fill", "steelblue")
                    .style("opacity" , .8)
                  
                }
                //rem Sleep
                if(i == 1)
                {
                    d3.select("#bar-chart")
                    .select(".bar-svg")
                    .append("rect").attr("class" , "rect-"+j+""+i)
                    .attr("x",that.xScale(new Date(Date.parse(xLocations[j]))))
                    .attr("y",that.yScale(dataRange[j].light) - (400 -that.yScale(dataRange[j].rem)))
                    .attr("width", 25)
                    .attr("height", 400 - that.yScale(dataRange[j].rem))
                    .style("fill", "skyblue")
                    .style("opacity" , .8)
                }
                //deep Sleep
                if(i == 2)
                {
                    d3.select("#bar-chart")
                    .select(".bar-svg")
                    .append("rect").attr("class" , "rect-"+j+""+i)
                    .attr("x", that.xScale(new Date(Date.parse(xLocations[j]))))
                    .attr("y",that.yScale(dataRange[j].light) - (400 -that.yScale(dataRange[j].rem)) - (400 -that.yScale(dataRange[j].deep)))
                    .attr("width", 25)
                    .attr("height", 400 - that.yScale(dataRange[j].deep))
                    .style("fill", "skyblue")
                    .style("opacity" , .5)
                }
            }
        }
        }

        //second or more times, must access the id or class of the rectangle and change heights
        //and not draw over the existing ones
        if(iter > 0)
        {
            for(let j = 0; j < dataRange.length; j++)
            {
            for(let i = 0; i < 3; i++)
            {
                //light Sleep
                if(i == 0)
                {
                    d3.select("#bar-chart")
                    .select(".bar-svg")
                    .select(".rect-"+j+""+i)
                    .attr("x", that.xScale(new Date(Date.parse(xLocations[j]))))
                    .attr("y", that.yScale(dataRange[j].light))
                    .attr("width", 25)
                    .attr("height", 400 - that.yScale(dataRange[j].light))
                    
                  
                }
                //rem Sleep
                if(i == 1)
                {
                    d3.select("#bar-chart")
                    .select(".bar-svg")
                    .select(".rect-"+j+""+i)
                    .attr("x",that.xScale(new Date(Date.parse(xLocations[j]))))
                    .attr("y",that.yScale(dataRange[j].light) - (400 -that.yScale(dataRange[j].rem)))
                    .attr("width", 25)
                    .attr("height", 400 - that.yScale(dataRange[j].rem))

                }
                //deep Sleep
                if(i == 2)
                {
                    d3.select("#bar-chart")
                    .select(".bar-svg")
                    .select(".rect-"+j+""+i)
                    .attr("x", that.xScale(new Date(Date.parse(xLocations[j]))))
                    .attr("y",that.yScale(dataRange[j].light) - (400 -that.yScale(dataRange[j].rem)) - (400 -that.yScale(dataRange[j].deep)))
                    .attr("width", 25)
                    .attr("height", 400 - that.yScale(dataRange[j].deep))
 
                }
            }
        }
        }
    }
}
