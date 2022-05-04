function drawLine(svg) {
    const ret = [];
    const delta = (45 * Math.PI) / 180;
    let p = new Vector2D(10, 0);
    const dir = new Vector2D(100, 0);
    ret.push(p);
    p = p.copy().add(dir.rotate(delta));
    ret.push(p);
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        p = p.copy().add(dir.rotate(-delta));
      } else {
        p = p.copy().add(dir.rotate(delta));
      }
      ret.push(p);
    }
  
    for (let i = 1; i < ret.length; i++) {
      svg.line({
        x1: ret[i - 1].x,
        y1: ret[i - 1].y,
        x2: ret[i].x,
        y2: ret[i].y,
        stroke: "red",
        style: "transparent: 0.5",
      });
    }
  }
  
  function drawPath(svg) {
    svg.path({
      d: [
        ["M", 0, 0],
        ["L", 100, 100],
        ["h", 100],
        ["v", 100],
        ["q", 150, 100, 300, 0],
      ],
      stroke: "black",
      strokeWidth: "2",
      fill: "transparent",
      class: "flex",
    });
  }