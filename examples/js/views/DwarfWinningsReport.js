var DwarfWinningsReport = Backbone.View.extend({

  className: "dwarf-winnings-report",

  initialize: function(options){
    this.model = options.model; 
    this.key = new BarKey({ data: this.model.get("dwarves") });
    this.charts = this.createMonthCharts(this.model);

    _.bindAll(this);
  },

  append: function(child){
    this.$el.append(child.el);
    child.parent = this;
  },

  clear: function(){
    this.$el.empty();
  },

  // rendering routine clears child objects, 
  // re-appends them and then asks them to render themselves
  render: function(){
    var key = this.key;
    var charts = this.charts;
    var months = this.model.get("months");
    var report = this;

    report.clear();

    _(months).each(function(month){
      report.append(charts[month]);
      charts[month].render();  
    });

    report.append(key);
    key.render();
  },

  hide: function(){
    this.$el.hide();
  },

  reveal: function(){
    this.$el.find(".key").fadeTo(0,0);
    this.$el.find(".dwarf-winnings").fadeTo(0,0);
    
    var delay = 0;

    this.$el.show();
    this.$el.find(".dwarf-winnings").each(function(i) {
      delay = (i + 1) * 150;
      $(this).delay(delay).fadeTo(750,1);
    });

    this.$el.find(".key").delay(delay+150).fadeTo(750,1);
  },

  // loop through months, creating a chart for each one
  createMonthCharts: function(model){
    var charts = {};
    var months = model.get("months");
    var dwarves = model.get("dwarves")
    var maxValue = model.get("maxWinnings");

    var labels = _(dwarves).map(function(dn){ return dn.substring(0,1) });

    _(months).each(function(month){
      charts[month] = new DwarfWinningsChart({ 
        id: "winnings-"+month, 
        month: month, 
        model: model,
        labels: labels
      });
    });

    return charts;
  },
});