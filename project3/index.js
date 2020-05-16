//動態button
var btnContainer = document.getElementById("btnDiv");
var btns = btnContainer.getElementsByClassName("btn");

for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

//定義圖表左右距離與整體長寬
var margin = {
    top: 40,
    right: 20,
    bottom: 30,
    left: 60
  },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
.rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var color = d3.scale.ordinal()
  .range(["#ca0020", "#f4a582", "#d5d5d5", "#92c5de", "#0571b0"]);

var svg = d3.select('body').append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var tool = d3.select("body").append("div").attr("class", "toolTip");
// tool.append("div").attr("class", "").style('display', 'none');

function formatNumber(number){
    var digits=number.split("");
    var threeDigits=[];

    // 當數字足夠，從後面取出三個位數，轉成字串塞回 threeDigits
    while (digits.length > 3) {
        threeDigits.unshift(digits.splice(digits.length - 3, 3).join(""));
    }
 
    threeDigits.unshift(digits.join(""));
    digits = threeDigits.join(",");
 
    return digits;
}

function update(data){ 
svg.selectAll("rect").remove();
svg.selectAll("text").remove();
svg.selectAll(".y").remove();
  var categoriesNames = data.map(function(d) {
    return d.categorie;
  });
  
  var rateNames = data[0].values.map(function(d) {
    return d.rate;
  });

  x.domain(rateNames);
  //x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(categorie) {
    return d3.max(categorie.values, function(d) {
      return d.value;
    });
  })]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    // .attr("transform", "rotate(-90)")
    // .attr("y", 6)
    // .attr("dy", ".71em")
    // .style("text-anchor", "end")
    .attr("transform","translate("+(width-margin.right)+","+margin.right+")")
    .style('font-weight', 'bold')
    .text("年/月");

  svg.append("g")
    .attr("class", "y axis")
    //.style('opacity', '0')
    .call(yAxis)
    .append("text")
    //.attr("transform", "rotate(-90)")
    // .attr("y", 6)
    // .attr("dy", ".85em")
    .style("text-anchor", "end")
    //.attr("transform","translate(0,"+(margin.top)+")")
    .style('font-weight', 'bold')
    .text("營收");

  //svg.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

  var slice = svg.selectAll(".slice")
    .data(data)
    .enter().append("g")
    .attr("class", "g");
    // .attr("transform", function(d) {
    //   return "translate(" + x(d.categorie) + ",0)";
    // });

    slice.selectAll("text")
    .data(function(d) {
        return d.values;
    })
    .enter()
    .append('text')
    .attr('class', 'bar-label')
    .attr('text-anchor', 'start')
    //.attr('opacity', 0)
    .attr('fill', '#222')
    .attr('stroke', '#222')
    .attr('font-size',20)
    .text(function (d) { 
        // console.log(d.value.toString());
        // console.log(formatNumber(d.value.toString()));
        return formatNumber(d.value.toString()) + ' 元'; })
    .attr("x", function(d) {
        return x(d.rate)+20;
      })
    .attr("y", function(d) {
        return y(0);
    })
    .attr("display","none");

  slice.selectAll("rect")
    .data(function(d) {
      return d.values;
    })
    .enter().append("rect")
    .attr("width", x.rangeBand())
    .attr("x", function(d) {
      return x(d.rate);
    })
    .style("fill", function(d) {
      return color(d.rate)
    })
    .attr("y", function(d) {
      return y(0);
    })
    .attr("height", function(d) {
      return height - y(0);
    })
    .on("mouseover", function(d) {
      d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(1));
    //   tool.style("left", d3.event.pageX + 34 + "px")
    //   tool.style("top", d3.event.pageY - 12 + "px")
    //   tool.style("display", "inline-block");
    //   tool.html(  d.value + ' 元');
    })
    .on("mouseout", function(d) {
      d3.select(this).style("fill", color(d.rate));
    //   tool.style("display", "none");
    });



  slice.selectAll("rect")
    .transition()
    .delay(100)
    .duration(1000)
    .attr("y", function(d) {
      return y(d.value);
    })
    .attr("height", function(d) {
      return height - y(d.value);
    });

    slice.selectAll("text")
        .transition()
        .delay(100)
        .duration(1000)
        .attr("display","")
        .attr("y", function(d) {
            return y(d.value)-10;
        });
}
update(data1)
 