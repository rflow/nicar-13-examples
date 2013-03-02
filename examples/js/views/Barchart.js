var Barchart = Backbone.View.extend({

  initialize: function(options){
    this.data = options.data;
    this.labels = options.labels || _.pluck(options.data, "name");
    this.maxValue = options.maxValue || d3.max(_.pluck(options.data, "value"));

    _.bindAll(this);
  },

  clear: function(){
    this.$el.empty();
  },

  render: function(){
    this.size = this.measureDimensions(this.$el);
    this.scales = this.calculateScales(this.size, this.data);

    this.clear();
    this.redraw();
  },

  measureDimensions: function(container){
    var results = {};
    var dummyLabel = $("<span>LABEL TEXT</span>").hide().appendTo(container);

    // read width and height from container
    results.width = container.width();
    results.height = container.height();

    // calc label height based on dummy label and then set bar height accordingly
    results.labelHeight = dummyLabel.height();
    results.barHeight = results.height - results.labelHeight;
    results.labelOffset = results.barHeight + results.labelHeight;
    
    // clean up dummy label from DOM
    dummyLabel.remove();

    return results;
  },

  calculateScales: function(dimensions, data){
    var scales = {};

    // create x scale (maps ordinal item categories to bar positions)
    scales.xAxis = d3.scale.ordinal().rangeBands([0, dimensions.width], 0.15, 0),
    
    // create y scale (maps values to bar heights)
    scales.yAxis = d3.scale.linear().range([0, dimensions.barHeight]);

    // set the input domain for each scale, according to the data
    scales.xAxis.domain(_.pluck(data, "name"));
    scales.yAxis.domain([0, this.maxValue]);

    return scales;
  },

  redraw: function(){
    var data = this.data,
        labels = this.labels,
        scales = this.scales,
        size = this.size,
        chart = this.svg = d3.select(this.el).append("svg")
        .attr("width", this.size.width)
        .attr("height", this.size.height)
        .append("g")
        .attr("class", "chart");

    chart.selectAll(".bar")
         .data(data)
         .enter()
         .append("rect")
         .attr("class", function(item, index){ return "bar category-" + index })
         .attr("x", function(item){ return scales.xAxis(item.name) })
         .attr("y", function(item){ return size.barHeight - scales.yAxis(item.value) })
         .attr("width", scales.xAxis.rangeBand())
         .attr("height", function(item){ return scales.yAxis(item.value) })
         .append("title")
         .text(function(item){ return item.name + " won $" + item.value });

    chart.selectAll(".label")
         .data(data)
         .enter()
         .append("text")
         .attr("class", "label")
         .text(function(item, index) { return labels[index]; })
         .attr("text-anchor", "middle")
         .attr("x", function(item) { return scales.xAxis(item.name) + scales.xAxis.rangeBand()/2; })
         .attr("y", size.labelOffset);
  }
});