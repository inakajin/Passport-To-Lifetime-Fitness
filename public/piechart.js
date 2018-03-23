
if (visitData) {
  console.log(visitData);
}

let dataTitles={}
//console.log(activityData)
//console.log(JSON.parse(activityData))
//activityData = JSON.parse(activityData)
let aData = JSON.parse(activityData)
let visData = JSON.parse(visitData)
function reset() {
  

let activitylist = []
  for (let x=0; x < aData.length; x++) {
  activitylist.push({ label: aData[x].activity, value: 0 })
    }

let presession = [
  { label: "great", value: 0 },
  { label: "good", value: 0 },
  { label: "ok", value: 0 },
  { label: "ill", value: 0 }
];

let health = [
  { label: "very good", value: 0 },
  { label: "good", value: 0 },
  { label: "bad", value: 0 },
  { label: "very bad", value: 0 }
];

let postsession = [
  { label: "strongly agree", value: 0 },
  { label: "agree", value: 0 },
  { label: "disagree", value: 0 },
  { label: "strongly disagree", value: 0 }
];

let approved = [{ label: "true", value: 0 }, { label: "false", value: 0 }];
dataTitles = {
  activitylist: activitylist,
  presession: presession,
  health: health,
  postsession: postsession,
  approved: approved
};
}
reset() //on load
function constructData(vData, data, dataTitle) {
  vData.forEach(function(visit) {
    //console.log(visit[dataTitle]);
    //console.log(visit);
    //console.log(dataTitle);

    for (var i = 0; i < data.length; i++) {
      //console.log(data[i]);
      if (String(visit[dataTitle]) == data[i].label) {
        data[i].value++;
      }
    }
  });

  //console.log(data);
  return data;
}
var width = 960,
  height = 450,
  radius = Math.min(width, height) / 2;

var svg = d3
  .select("#graph")
  .append("svg")
  .attr("viewBox", "0 0 960 450")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .append("g")
  .attr(
    "transform",
    "translate(" + radius + "," + radius + ") rotate(180) scale(-1, -1)"
  );

svg.append("g").attr("class", "slices");
svg.append("g").attr("class", "labels");
svg.append("g").attr("class", "lines");

var pie = d3.layout
  .pie()
  .sort(null)
  .value(function(d) {
    return d.value;
  });

var arc = d3.svg
  .arc()
  .outerRadius(radius * 1.0)
  .innerRadius(radius * 0.4);

var outerArc = d3.svg
  .arc()
  .innerRadius(radius * 0.5)
  .outerRadius(radius * 1);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d) {
  return d.data.label;
};

var color = d3.scale
  .category20()
  .domain([
    "Assigned",
    "Complete",
    "Overdue",
    "Terminated",
    "Awaiting Review",
    "Attached"
  ])
  .range([
    "#1abc9c",
    "#27ae60",
    "#e74c3c",
    "#f1c40f",
    "#34495e",
    "#3498db",
    "#8e44ad"
  ]);

function randomData() {
  var labels = color.domain();
  return labels
    .map(function(label) {
      return { label: label, value: Math.random() };
    })
    .filter(function() {
      return Math.random() > 0.5;
    })
    .sort(function(a, b) {
      return d3.ascending(a.label, b.label);
    });
}

change(
  constructData(
    visData,
    dataTitles["activitylist"],
    "activitylist"
  )
);

d3.selectAll(".toggledata").on("click", function() {
  //console.log(this.data-type);
  let type = $(this).data("type");
  //console.log(dataTitles[type]);
  //activityData = JSON.parse(activityData)
  reset();
  change(constructData(visData, dataTitles[type], type));
  //console.log(JSON.parse(visitData));
  //change(randomData());
});

function mergeWithFirstEqualZero(first, second) {
  var secondSet = d3.set();
  second.forEach(function(d) {
    secondSet.add(d.label);
  });

  var onlyFirst = first
    .filter(function(d) {
      return !secondSet.has(d.label);
    })
    .map(function(d) {
      return { label: d.label, value: 0 };
    });
  return d3.merge([second, onlyFirst]).sort(function(a, b) {
    return d3.ascending(a.label, b.label);
  });
}

function change(data) {
  var duration = +document.getElementById("duration").value;
  var data0 = svg
    .select(".slices")
    .selectAll("path.slice")
    .data()
    .map(function(d) {
      return d.data;
    });
  if (data0.length == 0) data0 = data;
  var was = mergeWithFirstEqualZero(data, data0);
  var is = mergeWithFirstEqualZero(data0, data);

  /* ------- SLICE ARCS -------*/

  var slice = svg
    .select(".slices")
    .selectAll("path.slice")
    .data(pie(was), key);

  slice
    .enter()
    .insert("path")
    .attr("class", "slice")
    .on("mouseover", function(d) {
      console.log(d);
      d3
        .select("#tooltip")
        .style("left", d3.event.pageX - 200 + "px")
        .style("top", d3.event.pageY - 200 + "px")
        .style("opacity", 1)
        .select("#value")
        .text(d.data.label + " :" + d.value);
    })
    .on("mouseout", function() {
      // Hide the tooltip
      d3.select("#tooltip").style("opacity", 0);
    })
    //.append("svg:title") .text(function(d) { return d.data.label; })
    .style("fill", function(d) {
      return color(d.data.label);
    })
    .each(function(d) {
      this._current = d;
    });

  slice = svg
    .select(".slices")
    .selectAll("path.slice")
    .data(pie(is), key);

  slice
    .transition()
    .duration(duration)
    .attrTween("d", function(d) {
      var interpolate = d3.interpolate(this._current, d);
      var _this = this;
      return function(t) {
        _this._current = interpolate(t);
        return arc(_this._current);
      };
    });

  slice = svg
    .select(".slices")
    .selectAll("path.slice")
    .data(pie(data), key);

  slice
    .exit()
    .transition()
    .delay(duration)
    .duration(0)
    .remove();

  /* ------- TEXT LABELS -------*/

  var text = svg
    .select(".labels")
    .selectAll("text")
    .data(pie(was), key);

  text
    .enter()
    .append("text")
    .attr("dy", ".35em")
    .style("opacity", 0)
    .text(function(d) {
      return d.data.label;
    })
    .each(function(d) {
      this._current = d;
    });

  function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  text = svg
    .select(".labels")
    .selectAll("text")
    .data(pie(is), key);

  text
    .transition()
    .duration(duration)
    .style("opacity", function(d) {
      return d.data.value == 0 ? 0 : 1;
    })
    .attrTween("transform", function(d) {
      var interpolate = d3.interpolate(this._current, d);
      var _this = this;
      return function(t) {
        var d2 = interpolate(t);
        _this._current = d2;
        var pos = outerArc.centroid(d2);
        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      };
    })
    .styleTween("text-anchor", function(d) {
      var interpolate = d3.interpolate(this._current, d);
      return function(t) {
        var d2 = interpolate(t);
        return midAngle(d2) < Math.PI ? "start" : "end";
      };
    });

  text = svg
    .select(".labels")
    .selectAll("text")
    .data(pie(data), key);

  text
    .exit()
    .transition()
    .delay(duration)
    .remove();

  /* ------- SLICE TO TEXT POLYLINES -------*/

  var polyline = svg
    .select(".lines")
    .selectAll("polyline")
    .data(pie(was), key);

  polyline
    .enter()
    .append("polyline")
    .style("opacity", 0)
    .each(function(d) {
      this._current = d;
    });

  polyline = svg
    .select(".lines")
    .selectAll("polyline")
    .data(pie(is), key);

  polyline
    .transition()
    .duration(duration)
    .style("opacity", function(d) {
      return d.data.value == 0 ? 0 : 1;
    })
    .attrTween("points", function(d) {
      this._current = this._current;
      var interpolate = d3.interpolate(this._current, d);
      var _this = this;
      return function(t) {
        var d2 = interpolate(t);
        _this._current = d2;
        var pos = outerArc.centroid(d2);
        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
        return [arc.centroid(d2), outerArc.centroid(d2), pos];
      };
    });

  polyline = svg
    .select(".lines")
    .selectAll("polyline")
    .data(pie(data), key);

  polyline
    .exit()
    .transition()
    .delay(duration)
    .remove();
}
