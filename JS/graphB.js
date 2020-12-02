class Bar
{
    /*
    Constructor for vertical bar chart, initializes several different variables used 
    throughout the creation of the chart.
    */
    constructor(data,overalldata ,i)
    {
        this.currPerson = data
        this.allData = overalldata
        this.numOfPerson = i
        console.log(i)
        this.textOnChart = false
        this.parsedVal = -1
        this.weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

        //this array will be used to hold the values for the 14 day span
        //due to scaling issues, the data with missing days causes the ticks and bars to over lap
        //by putting in this array for scaling the position, we can still put the text we want
        //from the other data arrray
        this.scaleData = [
            "11/10/19",
            "11/11/19",
            "11/12/19",
            "11/13/19",
            "11/14/19",
            "11/15/19",
            "11/16/19",
            "11/17/19",
            "11/18/19",
            "11/19/19",
            "11/20/19",
            "11/21/19",
            "11/22/19",
            "11/23/19",
        ]
        this.drawBar(0)
        
    }

    /**
     * Main method that initializes the view, svg, axes, and barchart for right side of visualization.
     */  
    drawBar(iter)
    {
        //First time populating visualization
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
        var xTicks = []

        if(that.parsedVal == -1)
            xTicks = x.slice((x.length - 1) - 14, x.length - 1)
        else
            xTicks = x.slice(that.parsedVal, that.parsedVal + 14)

        this.label  = d3.select("#bar-chart")
                         .append("header")
                         .append("h3").attr("class" ,"personText")
                         .text("Person " + (that.numOfPerson+1)+ ": Stages of Sleep")
        this.infoLabel = d3.select("#bar-chart")
                            .select("header")
                            .append("h5")
                            .text("All data shown contains 14 days of data")
        this.infoLabelB = d3.select("#bar-chart")
                            .select("header")
                            .append("h5")
                            .text("Select Person and/or Start Date:")

        //Add the drop down menu for person selector
        this.dropdown = d3.select("#bar-chart")
        .append("span")
        
        d3.select("#bar-chart")
        .select("span")
        .append("select")
        .attr("class" , "btn btn-primary dropdown-toggle")
        .attr("id", "dataset")

        //Add the drop down menu for date selector
        this.dropdown = d3.select("#bar-chart")
        .append("span")

        d3.select("#bar-chart")
        .select("span")
        .append("select")
        .attr("class" , "btn btn-primary dropdown-toggle")
        .attr("id", "datasetB")
        .style("margin-left", "5px")
        
        //Fun Facts button
        d3.select('#bar-chart')
            .select("span")
            .append("button")
            .attr("class", "btn btn-primary")
            .attr("id", "funFactsButton")
            .style("margin-left", "5px")
            .text("Fun Facts")    

        //Hide Facts button
        d3.select('#bar-chart')
        .select("span")
        .append("button")
        .attr("class", "btn btn-danger")
        .attr('id', '#hideButton')
        .style("display", "none")
        .style("margin-top", "5px")
        .text("Hide Facts")
        .on('click', function(d){
            if(document.getElementById('#hideButton').style.display == 'block')
            {
                d3.select('.bar-svg')
                .transition().duration(500)
                .attr('height', 1800)
                
                d3.select('.extremeStory').style('display', 'none')
                document.getElementById('#hideButton').style.display = 'none'
                d3.select(".extremeStory").selectAll('text').remove()
            }
        })
        
        //Click off on chart-view (left side) should result in fun facts hiding and resetting
        d3.select('#chart-view').on('click', function(d){
            if(document.getElementById('#hideButton').style.display == 'block')
            {
                d3.select('.bar-svg')
                .transition().duration(500)
                .attr('height', 1800)
                
                d3.select('.extremeStory')
                .style('display', 'none')

                document.getElementById('#hideButton').style.display = 'none'
                d3.select(".extremeStory").selectAll('text').remove()
            }
        })

        //SVG for fun facts
        d3.select('#bar-chart').append("svg").attr('class', 'extremeStory')
        .attr('y', 200)
        .attr('width', 500).attr('height', 150)
        .style('background-color', 'lightgrey').style('opacity', 1).style('stroke-linejoin', "round").style('display', 'none').style("margin-top", "10px")

        //Adding facts button
        d3.select('#bar-chart')
        .select("#funFactsButton")
        .text("Fun Facts")
        .on('click', function(d) {
            if(document.getElementById('#hideButton').style.display == 'block')
            {
                return
            }
            let currentData = that.allData[that.numOfPerson]
            var dates = currentData.map(d => d.dateOfSleep)
            var scores = currentData.map(d => d.overall_score)
            let nameOfDays = []
            for(let i = 0; i < dates.length; i++)
            {
                let numOfDay = new Date(Date.parse(dates[i])).getDay()
                let dayOfWeek = that.weekdays[numOfDay]
                nameOfDays.push(dayOfWeek)
                
            }
            let dayScore = parseInt(0)
            let counter = parseInt(0)
            var dict = {};

            for(let j = 0; j < that.weekdays.length; j++)
            {
                for(let i = 0; i < nameOfDays.length; i++)
                {
                    if(nameOfDays[i] == that.weekdays[j])
                    {
                        dayScore = parseInt(dayScore) + parseInt(scores[i])
                        counter++
                    }
                    
                }
                dict[""+that.weekdays[j]] = (dayScore/counter)

                counter = parseInt(0)
                dayScore = parseInt(0)
            }

            var bestDay = Object.keys(dict).reduce((a, b) => dict[a] > dict[b] ? a : b);
            var worstDay = Object.keys(dict).reduce((a, b) => dict[a] < dict[b] ? a : b);
            console.log(document.getElementById('#hideButton').style.display)
            if(document.getElementById('#hideButton').style.display == 'none')
            {
                d3.select('.bar-svg')
                .transition().duration(500)
                .attr('height', 0)

                document.getElementById('#hideButton').style.display = 'block'
            }

            d3.select('#bar-chart').select('.extremeStory').style('display', 'block').append('text').attr('x', 5).attr('y', 20).text('Fun Facts: ').style('stroke', 'black')

            d3.select('#bar-chart').select('.extremeStory').append('text').attr('x', 10).attr('y', 45)
            .text("Person "+ (parseInt(that.numOfPerson)+parseInt(1)) + " averaged the best quality of sleep on " + bestDay + "s.").style('stroke', 'black')
            
            d3.select('#bar-chart').select('.extremeStory').append('text').attr('x', 10).attr('y', 65)
            .text("Their average quality of sleep on " + bestDay + "'s is " + Number.parseFloat(dict[bestDay]).toFixed(2) + ".").style('stroke', 'black')

            d3.select('#bar-chart').select('.extremeStory').append('text').attr('x', 10).attr('y', 90)
            .text("Person "+ (parseInt(that.numOfPerson)+parseInt(1)) + " averaged the worst quality of sleep on " + worstDay + "s.").style('stroke', 'black')

            d3.select('#bar-chart').select('.extremeStory').append('text').attr('x', 10).attr('y', 110)
            .text("Their average quality of sleep on " + worstDay + "'s is " + Number.parseFloat(dict[worstDay]).toFixed(2) + ".").style('stroke', 'black')

        })

        for(let j = 0; j < (that.currPerson.length-1) -14; j++)
        {
         
            d3.select("#bar-chart")
            .select("span")
            .select("#datasetB")
            .append("option")
            .attr("value", j)
            .text(that.currPerson[j].dateOfSleep)

        }
        for(let i = 0; i < 8; i++)
        {
            if(i == that.numOfPerson)
            {
                d3.select("#bar-chart")
                .select("span")
                .select("#dataset")
                .append("option")
                .attr("selected",true)
                .attr("value" , i)
                .attr("class" , "option"+(i+1))
                .text("Person " + (i+1))

            }
            else{
                d3.select("#bar-chart")
                .select("span")
                .select("#dataset")
                .append("option")
                .attr("value",i)
                .attr("class" , "option"+(i+1))
                .text("Person " + (i+1))
            }
        }

        d3.select("#bar-chart")
        .select("span")
        .select("#dataset")
        .on("change" , function()
        {
            if(document.getElementById('#hideButton').style.display == 'block')
            {
                d3.select('.bar-svg')
                .transition().duration(500)
                .attr('height', 1800)
                
                d3.select('.extremeStory').style('display', 'none')
                document.getElementById('#hideButton').style.display = 'none'
                d3.select(".extremeStory").selectAll('text').remove()
            }
            let dataFile = document.getElementById("dataset").value;
            that.updateHeaderData(that.allData[dataFile], parseInt(dataFile))
        })

        d3.select("#bar-chart")
        .select("span")
        .select("#datasetB")
        .on("change" , function()
        {
            if(document.getElementById('#hideButton').style.display == 'block')
            {
                d3.select('.bar-svg')
                .transition().duration(500)
                .attr('height', 1800)
                
                d3.select('.extremeStory').style('display', 'none')
                document.getElementById('#hideButton').style.display = 'none'
                d3.select(".extremeStory").selectAll('text').remove()
            }
            let dataFile = document.getElementById("datasetB").value;
            console.log(dataFile)

            that.parsedVal = parseInt(dataFile)
            that.datePicked = that.currPerson[that.parsedVal]
            

            that.drawBar(1)
            that.drawRectangles(that.currPerson, xTicks, 1)
        })

        this.bar = d3.select("#bar-chart")
                   .append("svg")
                   .classed("bar-svg" , true)
                   .attr("width" , 700)
                   .attr("height" , 1800)

        d3.select("#bar-chart")
            .select(".bar-svg")
            .append("text")
            .style('stroke', 'black')
            .attr('x', -260)
            .attr('y', 15)
            .attr("transform", "rotate(-90)")
            .text('Time (Hours)')

        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("class" , "greaterLabel")
        .attr("x" , 255)
        .attr("y", 475)
        .style("stroke" , "black")
        .style("font-size", "10pt")
        .text("Number of Nights with > 75% Sleep Quality:  ")
        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("class" , "Greater75")
        .attr("x" , 520)
        .attr("y", 475)
        .style("stroke" , "red")
        .style("font-size", "10pt")
        .style("opacity", 0)
        .text("40")

        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("class" , "lesserLabel")
        .attr("x" , 255)
        .attr("y", 500)
        .style("stroke" , "black")
        .style("font-size", "10pt")
        .text("Number of Nights with < 75% Sleep Quality:  ")
        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("class" , "Less75")
        .attr("x" , 520)
        .attr("y", 500)
        .style("stroke" , "red")
        .style("font-size", "10pt")
        .style("opacity", 0)
        .text("40")


        let lineX = d3.select("#bar-chart")
                    .select(".bar-svg")
                    .append("line")
                   .attr("x1" , 65)
                   .attr("y1" ,400)
                   .attr("x2" , 655)
                   .attr("y2" , 400)
                   .style("stroke-width", 2)
                   .style("stroke" , "black")
             
        let lineY = d3.select("#bar-chart")
                   .select(".bar-svg")
                   .append("line")
                  .attr("x1" , 65)
                  .attr("y1" ,400)
                  .attr("x2" , 65)
                  .attr("y2" , 50)
                  .style("stroke-width", 2)
                  .style("stroke" , "black")
        

                  iter++
        }
        //Second+ times creating the chart
        if(iter > 0)
        {
            let that = this;

            var date = that.currPerson.map(d => d.dateOfSleep)
            var time = that.currPerson.map(d => d.minutesAsleep)

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
            
            var xTicks = []
        if(that.parsedVal == -1)
        {
            xTicks = x.slice((x.length - 1) - 14, x.length - 1)
            this.twoWeeks = that.currPerson.slice((that.currPerson.length - 1) -14, that.currPerson.length - 1)
        }
        else
        {
            xTicks = x.slice(that.parsedVal, that.parsedVal + 14)
            console.log(xTicks)
            this.twoWeeks = that.currPerson.slice(that.parsedVal, that.parsedVal + 14)
        }
        
        this.xScale = d3.scaleLinear()
                  .domain([new Date(Date.parse(that.scaleData[0])), new Date(Date.parse(that.scaleData[that.scaleData.length - 1]))])
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
                    .attr("x" ,45)
                    .attr("y", that.yScale([yMinutes[j]]))
                    .style("stroke" , "gray")
                    .style("font-size", "9pt")
                    .style("text-anchor" , "end")
                    .text(yTicks[j])
                d3.select("#bar-chart")
                    .select(".bar-svg")
                    .append("line")
                    .attr("x1" ,58)
                    .attr("y1", that.yScale([yMinutes[j]]))
                    .attr("x2" ,72)
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
                    .attr("y" ,35 + that.xScale(new Date(Date.parse(that.scaleData[j]))))
                    .attr("x", -410)
                    .attr('transform', 'rotate(-90)')
                    .style("stroke" , "gray")
                    .style("font-size", "9pt")
                    .style("text-anchor" , "end")
                    .text(xTicks[j])
                    
                d3.select("#bar-chart")
                    .select(".bar-svg")
                    .append("line")
                    .attr("x1" ,28 + that.xScale(new Date(Date.parse(that.scaleData[j]))))
                    .attr("y1", 407)
                    .attr("x2" ,28 + that.xScale(new Date(Date.parse(that.scaleData[j]))))
                    .attr("y2", 393)
                    .style("stroke" , "black")
                    .style("stroke-width" , 1)
            }

        that.textOnChart = true
        that.drawRectangles(that.currPerson,xTicks, 0)
    }
    else if(that.textOnChart == true)
    {
        for(let j = 0; j < yTicks.length; j++)
        {
            d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".x-text"+j)
                .text(xTicks[j])    
        }

        for(let j = 0; j < xTicks.length; j++)
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
        }
        that.drawRectangles(that.currPerson,xTicks, 1)
        }
    }
                         
    }

    /**
     * Converts minutes to hours, time objects in data usually come in as minutes
     */
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
    /**
     * Updates the header data of bar chart based on which person is selected,
     * and the start date that is selected.
     */
    updateHeaderData(newData,newI)
    {
        let that = this;
        that.currPerson = newData
        that.numOfPerson = newI
        console.log(newI)

        d3.select("#bar-chart").select("header").select(".personText").text("Person " + (that.numOfPerson+1)+ ": Stages of Sleep")
        that.drawBar(1)
        that.story(1)
    }

    /**
     * Method used to draw each bar on chart. Uses the person's data passed in as well as the selected date
     * to populate bars for bar chart accordingly.
     * @param {*} data 
     * @param {*} dateRange 
     * @param {*} iter 
     */
    drawRectangles(data, dateRange, iter)
    {
        let that = this;
        let xLocations = dateRange
        let dataRange = []
        if(that.parsedVal == -1)
        {
            dataRange = data.slice((data.length-1) - 14, data.length-1)
        }
        else
        {
            dataRange = data.slice(that.parsedVal, that.parsedVal + 14)
        }
       
        this.greaterArr = []
        this.lesserArr = []
        this.indexArrG = []
        this.indexArrL = []
        for(let x = 0; x < 14; x++)
        {
            if(parseInt(dataRange[x].overall_score) >= 75)
            {
                this.greaterArr.push(dataRange[x])
                this.indexArrG.push(x)
            }
            if(parseInt(dataRange[x].overall_score) < 75)
            {
                this.lesserArr.push(dataRange[x])
                this.indexArrL.push(x)
            }
        }
        
        that.story()

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
                    .append("rect").attr("class" , "rect-"+j+""+i).transition().duration(750)
                    .attr("x", 15 + that.xScale(new Date(Date.parse(that.scaleData[j]))))
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
                    .append("rect").attr("class" , "rect-"+j+""+i).transition().duration(750)
                    .attr("x",15 + that.xScale(new Date(Date.parse(that.scaleData[j]))))
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
                    .append("rect").attr("class" , "rect-"+j+""+i).transition().duration(750)
                    .attr("x", 15 + that.xScale(new Date(Date.parse(that.scaleData[j]))))
                    .attr("y",that.yScale(dataRange[j].light) - (400 -that.yScale(dataRange[j].rem)) - (400 -that.yScale(dataRange[j].deep)))
                    .attr("width", 25)
                    .attr("height", 400 - that.yScale(dataRange[j].deep))
                    .style("fill", "skyblue")
                    .style("opacity" , .5)
                }
            }
        }
        that.drawLegend()       
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
                    .select(".rect-"+j+""+i).transition().duration(750)
                    .attr("x", 15 + that.xScale(new Date(Date.parse(that.scaleData[j]))))
                    .attr("y", that.yScale(dataRange[j].light))
                    .attr("width", 25)
                    .attr("height", 400 - that.yScale(dataRange[j].light))
    
                }
                //rem Sleep
                if(i == 1)
                {
                    d3.select("#bar-chart")
                    .select(".bar-svg")
                    .select(".rect-"+j+""+i).transition().duration(750)
                    .attr("x", 15 +that.xScale(new Date(Date.parse(that.scaleData[j]))))
                    .attr("y",that.yScale(dataRange[j].light) - (400 -that.yScale(dataRange[j].rem)))
                    .attr("width", 25)
                    .attr("height", 400 - that.yScale(dataRange[j].rem))

                }
                //deep Sleep
                if(i == 2)
                {
                    d3.select("#bar-chart")
                    .select(".bar-svg")
                    .select(".rect-"+j+""+i).transition().duration(750)
                    .attr("x", 15 + that.xScale(new Date(Date.parse(that.scaleData[j]))))
                    .attr("y",that.yScale(dataRange[j].light) - (400 -that.yScale(dataRange[j].rem)) - (400 -that.yScale(dataRange[j].deep)))
                    .attr("width", 25)
                    .attr("height", 400 - that.yScale(dataRange[j].deep))
 
                }
            }
        }

        }
        d3.select("#bar-chart")
        .select(".bar-svg")
        .selectAll("rect")
        .on("mouseover", function(d,i)
        {
            var iter = Math.floor(i/3)
            let currDate = that.twoWeeks[iter]
            var rem = currDate.rem
            var deep = currDate.deep
            var light = currDate.light


            d3.select("#bar-chart")
            .select(".bar-svg")
            .select(".selectionInfo")
            .style("opacity",1)
            .text(currDate.dateOfSleep)

            d3.select("#bar-chart")
            .select(".bar-svg")
            .select(".remInfo")
            .style("opacity",1)
            .text(that.minutesToHours(rem))

            d3.select("#bar-chart")
            .select(".bar-svg")
            .select(".lightInfo")
            .style("opacity",1)
            .text(that.minutesToHours(light))

            d3.select("#bar-chart")
            .select(".bar-svg")
            .select(".deepInfo")
            .style("opacity",1)
            .text(that.minutesToHours(deep))

            d3.select("#bar-chart")
            .select(".bar-svg")
            .select(".totalInfo")
            .style("opacity",1)
            .text(that.minutesToHours(currDate.minutesAsleep))
        })

    }
    /**
     * Method used to draw legend on bar chart. Matches the three different colors
     * on each bar to the respective stage of sleep.
     */
    drawLegend()
    {
        let that = this;

        //Light Sleep Legend
        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("rect")
        .attr("x" , 550)
        .attr("y", 50)
        .attr("width",10)
        .attr("height",10)
        .style("fill", "steelblue")
        .style("opacity" , .8)
        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("x" , 565)
        .attr("y", 60)
        .style("font-size" , 12)
        .text("Light")
         //Rem Sleep Legend
         d3.select("#bar-chart")
         .select(".bar-svg")
         .append("rect")
         .attr("x" , 550)
         .attr("y", 65)
         .attr("width",10)
         .attr("height",10)
         .style("fill", "skyblue")
         .style("opacity" , .8)
         d3.select("#bar-chart")
         .select(".bar-svg")
         .append("text")
         .attr("x" , 565)
         .attr("y", 75)
         .style("font-size" , 12)
         .text("REM")
          //Rem Sleep Legend
          d3.select("#bar-chart")
          .select(".bar-svg")
          .append("rect")
          .attr("x" , 550)
          .attr("y", 80)
          .attr("width",10)
          .attr("height",10)
          .style("fill", "skyblue")
          .style("opacity" , .5)
          d3.select("#bar-chart")
          .select(".bar-svg")
          .append("text")
          .attr("x" , 565)
          .attr("y", 90)
          .style("font-size" ,12)
          .text("Deep")

          that.infoBox()
    }

    /**
     * Creates and draws the information box that displays below the 
     * chart which shows information on the current bar being hovered on.
     */
    infoBox()
    {

        let that = this
        //Current Selection with date
        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("x" ,112)
        .attr("y", 475)
        .style("stroke" , "black")
        .style("font-size", "10pt")
        .style("text-anchor" , "end")
        .text("Current Selection : ")

        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("class", "selectionInfo")
        .attr("x" ,115)
        .attr("y", 475)
        .style("stroke" , "steelblue")
        .style("font-size", "10pt")
        .style("opacity", 0)

  
        //Rem label and info
        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("x" ,40)
        .attr("y", 500)
        .style("stroke" , "black")
        .style("font-size", "10pt")
        .style("text-anchor" , "end")
        .text("REM : ")

        //this is where the info will be appended
        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("class", "remInfo")
        .attr("x" ,55)
        .attr("y", 500)
        .style("stroke" , "steelblue")
        .style("font-size", "10pt")
        .style("opacity", 0)

        //Deep label and info
        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("x" ,40)
        .attr("y", 525)
        .style("stroke" , "black")
        .style("font-size", "10pt")
        .style("text-anchor" , "end")
        .text("DEEP : ")

        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("class", "deepInfo")
        .attr("x" ,55)
        .attr("y", 525)
        .style("stroke" , "steelblue")
        .style("font-size", "10pt")
        .style("opacity", 0)

        //Light label and info
        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("x" ,47)
        .attr("y", 550)
        .style("stroke" , "black")
        .style("font-size", "10pt")
        .style("text-anchor" , "end")
        .text("LIGHT :")

        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("class", "lightInfo")
        .attr("x" ,55)
        .attr("y", 550)
        .style("stroke" , "steelblue")
        .style("font-size", "10pt")
        .style("opacity", 0)

        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("x" ,40)
        .attr("y", 575)
        .style("stroke" , "black")
        .style("font-size", "10pt")
        .style("text-anchor" , "end")
        .text("Total : ")

        d3.select("#bar-chart")
        .select(".bar-svg")
        .append("text")
        .attr("class", "totalInfo")
        .attr("x" ,55)
        .attr("y", 575)
        .style("stroke" , "steelblue")
        .style("font-size", "10pt")
        .style("opacity", 0)

    }

    /**
     * Method that creates and highlights days that a person experienced 
     * greater or less than 75% sleep quality. Changes the color of the bar being
     * hovered on to red and displays the total amount of days in each category next to the
     * text.
     */
    story()
    {
        let that = this

        d3.select("#bar-chart")
        .select(".bar-svg")
        .select(".Greater75")
        .style("opacity" , 1)
        .style("stroke", 'red')
        .text(" " + that.greaterArr.length)

        d3.select("#bar-chart")
        .select(".bar-svg")
        .select(".Less75")
        .style("opacity" , 1)
        .style("stroke", 'red')
        .text(" " + that.lesserArr.length)

        d3.select("#bar-chart")
        .select(".bar-svg")
        .select(".greaterLabel")
        .on("mouseover" ,function(d)
        {
            
            for(let y = 0; y < that.indexArrG.length; y++)
            {
                var indexValue = that.indexArrG[y]
                d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".rect-"+indexValue+"0")
                .transition()
                .duration(500)
                .style("fill", "red")
                d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".rect-"+indexValue+"1")
                .transition()
                .duration(500)
                .style("opacity",.67)
                .style("fill", "red")
                d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".rect-"+indexValue+"2")
                .transition()
                .duration(500)
                .style("fill", "red")
                
            }
        })
        .on("mouseout" ,function(d)
        {
            
            for(let y = 0; y < that.indexArrG.length; y++)
            {
                var indexValue = that.indexArrG[y]
                d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".rect-"+indexValue+"0")
                .transition()
                .duration(500)
                .style("fill", "steelblue")
                d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".rect-"+indexValue+"1")
                .transition()
                .duration(500)
                .style("fill", "skyblue")
                .style("opacity",.8)
                d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".rect-"+indexValue+"2")
                .transition()
                .duration(500)
                .style("fill", "skyblue")
                
            }
        })
      
        d3.select("#bar-chart")
        .select(".bar-svg")
        .select(".lesserLabel")
        .on("mouseover" ,function(d)
        {
            
            for(let y = 0; y < that.indexArrL.length; y++)
            {
                var indexValue = that.indexArrL[y]
                d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".rect-"+indexValue+"0")
                .transition()
                .duration(500)
                .style("fill", "red")
                d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".rect-"+indexValue+"1")
                .transition()
                .duration(500)
                .style("opacity",.67)
                .style("fill", "red")
                d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".rect-"+indexValue+"2")
                .transition()
                .duration(500)
                .style("fill", "red")
            }
        })
        .on("mouseout" ,function(d)
        {
            
            for(let y = 0; y < that.indexArrL.length; y++)
            {
                var indexValue = that.indexArrL[y]
                d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".rect-"+indexValue+"0")
                .transition()
                .duration(500)
                .style("fill", "steelblue")
                d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".rect-"+indexValue+"1")
                .transition()
                .duration(500)
                .style("fill", "skyblue")
                .style("opacity",.8)
                d3.select("#bar-chart")
                .select(".bar-svg")
                .select(".rect-"+indexValue+"2")
                .transition()
                .duration(500)
                .style("fill", "skyblue")
                
            }
        })
    }
}
