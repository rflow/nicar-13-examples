var DwarfWinningsChart = Backbone.View.extend({

  className: "dwarf-winnings",
  titleTemplate: _.template("<h4><%= month.substring(0,3) %></h4>"),

  initialize: function(options){
    this.month = options.month;
    this.model = options.model;

    this.title = $(this.titleTemplate(options));

    this.barchart = new Barchart({
      id: "chart-"+ this.month,
      className: "barchart",
      data: this.model.getWinningsFor(this.month),
      maxValue: this.model.maxValue,
      labels: options.labels
    });

    _.bindAll(this);
  },

  append: function(child){
    this.$el.append(child.el);
    child.parent = this;
  },

  clear: function(){
    this.$el.empty();
  },

  render: function(){
    with (this){
      clear();
      title.appendTo($el);
      append(barchart);
      barchart.render();
    }
  }
});