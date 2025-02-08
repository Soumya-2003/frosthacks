import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Trait {
  value: number;
  label: string;
  fill: string;
  index: number;
}

interface DayData {
  day: string;
  traits: Trait[];
}

interface ChartContainerProps {
  data: DayData[];
}

interface CustomArcObject extends d3.DefaultArcObject {
  value: number;
  index: number;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ data }) => {
  const chartRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    data.forEach((dayData, index) => {
      if (chartRefs.current[index]) {
        drawBarCircleChart(dayData.traits, chartRefs.current[index]!, dayData.day);
      }
    });
  }, [data]);

  const drawBarCircleChart = (traits: Trait[], target: HTMLElement, title: string) => {
    // Clear any existing SVG in the specific target
    d3.select(target).selectAll("svg").remove();

    const size = 100;
    const radius = 200;
    const sectorWidth = 0.1;
    const radScale = 45;
    const sectorScale = 1.6;

    const svg = d3.select(target)
      .append("svg")
      .attr("width", 500)
      .attr("height", 500);

    const chartGroup = svg.append("g")
      .attr("transform", "translate(250,250)");

    const arc = d3.arc<CustomArcObject>()
      .innerRadius((d) => (d.index / sectorScale) * radius + radScale)
      .outerRadius((d) => ((d.index / sectorScale) + (sectorWidth / sectorScale)) * radius + radScale)
      .startAngle(Math.PI)
      .endAngle(d => Math.PI + (d.value / size) * 2 * Math.PI);

    chartGroup.selectAll("path")
      .data(traits)
      .enter()
      .append("path")
      .attr("fill", d => d.fill)
      .attr("stroke", "#D1D3D4")
      .each(function(d) {
        const path = d3.select(this);
        path.on("mouseover", function() {
            // d3.select(this).style("transform", "scale(1.1)");
          const tooltip = d3.select(target).append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "black")
            .style("color", "white")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .text(`${d.label}: ${d.value}`);

          d3.select(this).on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY - 28) + "px");
          });
        }).on("mouseout", function() {
          d3.select(target).select(".tooltip").remove();
        //   d3.select(this).style("transform", "scale(1)");
        });
      })
      .transition()
      .ease(d3.easeElastic)
      .duration(1000)
      .delay((d, i) => i * 200)
      .attrTween("d", function(b) {
        const i = d3.interpolate({ value: 0, index: b.index }, b);
        return function(t) {
          const interpolated = i(t);
          return arc({
            ...interpolated,
            innerRadius: (interpolated.index / sectorScale) * radius + radScale,
            outerRadius: ((interpolated.index / sectorScale) + (sectorWidth / sectorScale)) * radius + radScale,
            startAngle: Math.PI,
            endAngle: Math.PI + (interpolated.value / size) * 2 * Math.PI
          })!;
        };
      });

      chartGroup.selectAll("text.label")
      .data(traits)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", 10)
      .attr("y", (d, i) => radius * 0.325 + i * 13)
      .attr("text-anchor", "start")
      .attr("font-size", "12px")
      .style("fill", "#eb477e")
      .text(d => `${d.label}: ${d.value}%`);

    svg.append("text")
      .attr("x", 250)
      .attr("y", 250)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .style("fill", "#eb477e")
      .text(title);
  };

  return (
    <div className="flex flex-wrap justify-around gap-4">
      {data.map((dayData, index) => (
        <div
          key={index}
          className="chart"
          ref={el => {
            if (el) {
              chartRefs.current[index] = el;
            }
          }}
        />
      ))}
    </div>
  );
};

export default ChartContainer;