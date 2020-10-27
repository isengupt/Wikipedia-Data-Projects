import React, {useRef, useEffect, useState} from 'react'
import './App.css'
import {select, line, curveCardinal, axisBottom, axisRight, scaleLinear, min, max} from 'd3'


function LineChart(props) {
    const {value, ranges} = props;
    const [maxVal, setMaxVal] = useState(75)
    const [minVal, setMinVal] = useState(0)
    const [data, setData] = useState([25,30,45,60,20, 65, 75])
    const svgRef = useRef();

    useEffect(() => {
      console.log("used effect")
        getChartData(value, ranges)
    }, [value, ranges])


  function getChartData(val, rng) {

    fetch('http://localhost:3001/chart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({val, rng}),
    })
      .then(response => {
        return response.json();
      })
      .then(datum => {
        console.log(datum)
     
        let maxValue = 0
        let minValue = Infinity
        let datVals =[]
        for (const item of datum) {
          datVals.push(item.round)
          if (item.round > maxValue) {
          maxValue = item.round
            
          }
          if (item.round < minValue) {
            minValue = item.round
          }
        }
        console.log(maxValue)
        console.log(minValue)
        setMaxVal(maxValue)
        setMinVal(minValue)
        setData(datVals)
      });
  }
    useEffect(() => {
     
        const svg = select(svgRef.current)
        const xScale = scaleLinear().domain([0,data.length-1]).range([0,300])
        const yScale = scaleLinear().domain([minVal, maxVal]).range([150,0])
        const xAxis = axisBottom(xScale).ticks(4).tickFormat((d) => d + ranges[0])
      
       

        svg.select('.x-axis').style("transform", "translateY(150px)" ).call(xAxis)

        const yAxis = axisRight(yScale).ticks(2)
        svg.select('.y-axis').style("transform", "translateX(300px)" ).call(yAxis)
        //xAxis(svg.select(".a-axis"))
        const myLine = line().x((value, index) => xScale(index))
        .y(yScale)
        .curve(curveCardinal)
     /*    svg.selectAll("circle").data(data).join(
        "circle"
        ).attr("r", value => value)
        .attr("cx", value => value * 2 )
        .attr("cy", value => value * 2 )
        .attr("stroke", "red") */
        svg.selectAll(".line").data([data])
        .join("path").attr("class", "line")
        .transition()
        .attr("d", value => myLine(value))
        .attr("fill", "none").attr("stroke", "rgba(103,217,112)")
       

    }, [data, maxVal, minVal])
    return (
    <div className="line-container">
    
    <svg ref={svgRef}>
        <g className="x-axis"/>
        <g className="y-axis"/>
    </svg>
   

    </div>
    )
}

export default LineChart