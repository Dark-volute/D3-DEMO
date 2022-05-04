import * as d3 from "d3";
import { defineComponent, onMounted, render} from 'vue'
import intersect from 'path-intersection';

export default function towLine() {
  const width = 640;
  const height = 720;
  const marginLeft = 40;
  const marginBottom = 40;
  const marginRight = 40;
  const marginTop = 40;

  const source1 = [
    { x: 0, y: 0 },
    { x: 22, y: 12 },
    { x: 142, y: 42 },
    { x: 212, y: 212 },
    { x: 222, y: 152 },
    { x: 272, y: 112 },
    { x: 322, y: 112 }
  ]
  const source2 = [
    { x: 0, y: 0 },
    { x: 12, y: 82 },
    { x: 42, y: 42 },
    { x: 212, y: 112 },
    { x: 122, y: 52 },
    { x: 172, y: 12 },
    { x: 222, y: 112 },
  ]

  const data = source1.concat(source2)

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const X = d3.map(data, ({ x }) => x)
  const Y = d3.map(data, ({ y }) => y)

  const xDomain = d3.nice(...d3.extent(X), width / 80)
  const yDomain = d3.nice(...d3.extent(Y), height / 80)

  const xRange = [marginLeft, width - marginRight]
  const xScale = d3.scaleLinear(xDomain, xRange);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80)


  const yRange = [height - marginBottom, marginTop]
  const yScale = d3.scaleLinear(yDomain, yRange);
  const yAxis = d3.axisLeft(yScale).ticks(height / 80)


  function generatePath(data, color) {
    const line = d3.line()
      .curve(d3.curveCatmullRom)
      .x(i => xScale(data[i].x))
      .y(i => yScale(data[i].y));

    const linePath = line(d3.range(data.length))
    const path = svg.append("path")
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", 'round')
      .attr("stroke-linecap", 'round')
      .attr("d", linePath);

    return {
      path,
      linePath
    }
  }

  const { path: path1, linePath: linePath1 } = generatePath(source1, '#2fc25b')
  const { path: path2, linePath: linePath2 } = generatePath(source2, '#1890ff')

  svg.append("g")
    .attr("transform", `translate(${0},${height - marginBottom})`)
    .call(xAxis)

  svg.append("g")
    .attr("transform", `translate(${marginLeft}, ${0})`)
    .call(yAxis)

  svg.append("g")
    .attr("fill", 'white')
    .attr("stroke", 'black')
    .attr("stroke-width", 1)
    .selectAll("circle")
    .data(d3.range(data.length))
    .join("circle")
    .attr("cx", i => xScale(X[i]))
    .attr("cy", i => yScale(Y[i]))
    .attr("r", 3);

  const crossPoints = intersect(linePath1, linePath2)

  // svg.append("g")
  //   .attr("fill", 'white')
  //   .attr("stroke", 'red')
  //   .attr("stroke-width", 1)
  //   .selectAll("path")
  //   .data(d3.range(crossPoints.length))
  //   .enter()
  //   .append('path')
  //   .attr('d', d3.symbol().type(d3.symbolTriangle).size(60))
  //   .attr('transform', i => `translate(${crossPoints[i].x}, ${crossPoints[i].y})`);


  const crossCircle = svg.append("g")
    .attr("fill", 'white')
    .attr("stroke", 'red')
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(d3.range(crossPoints.length))
    .join("circle")
    .attr("cx", i => crossPoints[i].x)
    .attr("cy", i => crossPoints[i].y)
    .attr("r", 4)
    .on('mouseover', (d) => {
      const x = d3.select(d.target).attr('cx')
      const y = d3.select(d.target).attr('cy')

      var f = d3.format(".2f");

      const select = d3.selectAll('.tooltips')
      select.style('visibility', 'visible')
      select.style('top', d.offsetY + 'px')
      select.style('left', d.offsetX + 'px')
      select.html(`x: ${f(xScale.invert(x))}, y: ${f(yScale.invert(y))}`)
    })
    .on('mouseout', () => {
      d3.selectAll('.tooltips')
        .style('visibility', 'hidden')
    })


  function length(path) {
    return path.node().getTotalLength();
  }

  function animate() {
    const l1 = length(path1);
    const l2 = length(path2);

    path1
      .interrupt()
      .attr("stroke-dasharray", `0,${l1}`)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr("stroke-dasharray", `${l1},${l1}`);

    path2
      .interrupt()
      .attr("stroke-dasharray", `0,${l2}`)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr("stroke-dasharray", `${l2},${l2}`);


    crossCircle
      .interrupt()
      .attr("opacity", 0)
      .transition()
      .delay(i => 500)
      .attr("opacity", 1);
  }

  animate();

  return svg.node()
}
