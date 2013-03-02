var DwarfWinnings = Backbone.Model.extend({
	defaults: {
		months: [],
		dwarves: [],
		winningsByMonth: {},
		maxWinnings: 0
	},

	initialize: function(attributes) {
		_.bindAll(this);
		
    this.determineDwarves(attributes.data);
    this.calcWinningsByMonth(attributes.data, attributes.months);
	},

	// figure out list of distinct dwarf names
	determineDwarves: function(dataset){
    this.set("dwarves", dataset.groupBy("Dwarf", ["Winnings"]).column("Dwarf").data);
    this.set("selected-dwarf", this.get("dwarves")[0]);
	},

  // use dataset to calculate winnings per dwarf 
  // for each month in the given list of months
  calcWinningsByMonth: function(dataset, months){
    var winningsByMonth = {};
    var maxMonthlyWinnings = 0;
    var dwarfNames = this.get("dwarves");

    // add calculated column containing month name
    dataset.addComputedColumn("Month", "string", function(row) {
      return months[row["Date"].month()];
    });

    // loop through months, building a representation 
    // of the winnings data for each dwarf in each month
    _(months).each(function(month){
      var monthData = dataset.rows(function(r){ return r["Month"] == month });
      var maxWinningsThisMonth = 0;
      var winningsByDwarf = monthData.groupBy("Dwarf", ["Winnings"]);
      var dwarfWinningsMap = {};

      winningsByDwarf.each(function(row, rowIndex) {
        var winnings = row["Winnings"];
        maxWinningsThisMonth = Math.max(winnings, maxWinningsThisMonth);
        dwarfWinningsMap[row["Dwarf"]] = winnings;
      });

      winningsByMonth[month] = _.map(dwarfNames,function(dwarf){
        return { name: dwarf, value: dwarfWinningsMap[dwarf] || 0 };
      });

      maxMonthlyWinnings = Math.max(maxWinningsThisMonth, maxMonthlyWinnings);
    });

    // keep track of winnings across the year
    this.set("winningsByMonth", winningsByMonth);
    this.set("maxWinnings", maxMonthlyWinnings);
  },

  getWinningsFor: function(month){
  	return this.get("winningsByMonth")[month];
  }
});