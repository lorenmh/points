/* globals d3 */

function sample(xRange, yRange, num) {
  return Array.apply(null, {length: num})
    .map((p, i) => {
      return {
        id: i,
        x: Math.random() * xRange,
        y: Math.random() * yRange
      };
    })
  ;
}

function d(p0, p1) {
  return distance(p0.x, p0.y, p1.x, p1.y);
}

function distance(x0, y0, x1, y1) {
  return Math.sqrt(Math.pow(x1-x0, 2) + Math.pow(y1-y0, 2));
}

function Bucket(w, h, d) {
  var xN = Math.floor(w / d),
      yN = Math.floor(h / d),
      array = Array.apply(null, {length: xN})
        .map(() => {
          return Array.apply(null, {length: yN})
            .map(() => [])
          ;
        })
  ;

  return {d, xN, yN, array};
}

function insert(bucket, p) {
  var i = ptoi(bucket, p);

  bucket.array[i[0]][i[1]].push(p);
}

function ptoi(bucket, p) {
  return [
    Math.min(Math.floor(p.x / bucket.d), bucket.xN - 1),
    Math.min(Math.floor(p.y / bucket.d), bucket.yN - 1)
  ];
}

function neighborIndices(bucket, p) {
  var index = ptoi(bucket, p),
      xI = index[0],
      yI = index[1]
  ;
  return Array.apply(null, {length: 9})
    .map((_, i) => [xI + Math.floor(i / 3) - 1, yI + (i % 3) - 1])
    .filter((n) => {
      return n[0] >= 0 && n[0] < bucket.xN && n[1] >= 0 && n[1] < bucket.yN;
    })
  ;
}

function neighbors(bucket, p) {
  var indices = neighborIndices(bucket, p)
  ;

  return indices.reduce((p, i) => {
    return p.concat(bucket.array[i[0]][i[1]]);
  }, []);
}

var points = sample(100, 100, 10000);
var bucket = Bucket(100, 100, 10);
points.forEach((p) => insert(bucket, p));

var target = document.body;

var b = target.getBoundingClientRect(),
    w = b.width,
    h = b.height
;

var xScale = d3.scale.linear()
  .domain([0, 100])
  .range([0, w])
;

var yScale = d3.scale.linear()
  .domain([0, 100])
  .range([h, 0])
;

var svg = d3.select(target).append('svg')
;

svg
  .attr({
    width: w,
    height: h
  })
;

var circles = svg.selectAll('circle')
  .data(points)
;

circles.enter()
    .append('circle')
    .attr({
      cx: (p) => xScale(p.x),
      cy: (p) => yScale(p.y),
      r: 1,
      fill: 'black'
    })
;

circles.on
