$(document).ready(function() {

  var width = 960,
      height = 700,
      radius = (Math.min(width, height) / 2) - 10;

  var formatNumber = d3.format(",d");

  var x = d3.scaleLinear()
      .range([0, 2 * Math.PI]);

  var y = d3.scaleSqrt()
      .range([radius/5, radius]);

  var color = d3.scaleOrdinal(d3.schemeCategory20c);

  var partition = d3.partition();

  var arc = d3.arc()
      .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
      .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
      .innerRadius(function(d) { console.log((d.data.size)); return Math.max(0, y(d.y0)); })
      .outerRadius(function(d) { return Math.max(0, y(d.y1)); });//******

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");


        function clicked(d) {
          console.log("click")
          svg.transition()
              .duration(750)
              .tween("scale", function() {
                var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                    yd = d3.interpolate(y.domain(), [d.y0, 1]),
                    yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
                return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
              })
            .selectAll("path")
              .attrTween("d", function(d) { return function() { return arc(d); }; });
        }

var ccjson = "counterculture.json";
  d3.json("counterculture.json", function(error, root) {
    if (error) throw error;

    root = d3.hierarchy(root);
    root.sum(function(d) { return d.size; });

    svg.selectAll("path")
        .data(partition(root).descendants())
      .enter().append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color((d.children ? d : d.parent).data.name); })
        .append("text")
          //  .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
            .attr("x", function(d) { return y(d.y0); })
            .attr("dx", "6") // margin
            .attr("dy", ".35em") // vertical-align
            .text(function(d) { return d.name; })
        .on("click", clicked)

        .append("title")
        .text(function(d) { return d.data.name + "\n" + formatNumber(d.value); });
  });
  d3.select(self.frameElement).style("height", height + "px");

});//doc ready function
