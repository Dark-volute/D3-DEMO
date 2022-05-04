function initBar() {
    var width = 400;
    var height = 400;
  
    //在 body 里添加一个 SVG 画布   
    var svg = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    //画布周边的空白
    var padding = { left: 30, right: 30, top: 20, bottom: 20 };
  
    //定义一个数组
    var dataset = [10, 20, 30, 40, 33, 24, 12, 5];
  
    //x轴的比例尺
    var xScale = d3.scaleBand()
      .domain(d3.range(dataset.length))
      .range([0, width - padding.left - padding.right]);
  
  
    //y轴的比例尺
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset)])
      .range([height - padding.top - padding.bottom, 0]);
  
  
    //定义x轴
    var xAxis = d3.axisBottom()
      .scale(xScale)
  
    //定义y轴
    var yAxis = d3.axisLeft()
      .scale(yScale)
  
    //矩形之间的空白
    var rectPadding = 4;
  
    //添加矩形元素
    var rects = svg.selectAll(".MyRect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "MyRect")
      .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
      .attr("x", function (d, i) {
        // console.log(xScale(i) )
        return xScale(i) + rectPadding / 2;
      })
      .attr("width", xScale.bandwidth() - rectPadding)
      .attr("y", function (d) {
        var min = yScale.domain()[0];
        return yScale(min);
      })
      .attr("height", function (d) {
        return 0;
      })
      .transition()
      .delay(function (d, i) {
        return i * 200;
      })
      .duration(500)
      .ease(d3.easeLinear)
      .attr("y", function (d) {
        return yScale(d);
      })
      .attr("height", function (d) {
        return height - padding.top - padding.bottom - yScale(d);
      });
  
    //添加文字元素
    var texts = svg.selectAll(".MyText")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "MyText")
      .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
      .attr("x", function (d, i) {
        return xScale(i) + rectPadding / 2;
      })
      .attr("dx", function () {
        return (xScale.bandwidth() - rectPadding) / 2;
      })
      .attr("dy", function (d) {
        return 20;
      })
      .text(function (d) {
        return d;
      })
      .attr("y", function (d) {
        var min = yScale.domain()[0];
        return yScale(min);
      })
      .transition()
      .delay(function (d, i) {
        return i * 200;
      })
      .duration(500)
      .ease(d3.easeLinear)
      .attr("y", function (d) {
        return yScale(d);
      });
    //添加x轴
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
      .call(xAxis);
  
    //添加y轴
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
      .call(yAxis);
  }