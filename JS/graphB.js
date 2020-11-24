class Bar
{
    constructor(data, i)
    {
        this.currPerson = data
        this.numOfPerson = i
        console.log(i)
        this.drawBar()
    }

    drawBar()
    {
        d3.select("#chart")
        .select("#bar-chart")
        .attr("width" , 700)
        .attr("height" , 1600)
        let that = this;
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
                   .attr("x1" , 10)
                   .attr("y1" ,400)
                   .attr("x2" , 550)
                   .attr("y2" , 400)
                   .style("stroke-width", 2)
                   .style("stroke" , "black")
             
        let lineY = d3.select("#bar-chart")
                   .select(".bar-svg")
                   .append("line")
                  .attr("x1" , 10)
                  .attr("y1" ,400)
                  .attr("x2" , 10)
                  .attr("y2" , 50)
                  .style("stroke-width", 2)
                  .style("stroke" , "black")
        //console.log(that.currPerson)
        var date = that.currPerson.map(d => d.dateOfSleep)
        var time = that.currPerson.map(d => d.minutesAsleep)
        //console.log(time)


        this.xScale = d3.scaleLinear()
                  .domain([new Date(Date.parse(date[0])), new Date(Date.parse(date[date.length - 1]))])
                  .range([10,550])
        this.yScale = d3.scaleLinear()
                  .domain([400,50])
                  .range([yLoc -100, yLoc - 190])
        
                        
    }
    updateHeaderData(newData,newI)
    {
        let that = this;
        that.currPerson = newData
        that.numOfPerson = newI
        console.log(newI)

        d3.select("#bar-chart").select("header").select("h3").text("Person " + (that.numOfPerson + 1 )+ ": Stages of Sleep")
    }
}
