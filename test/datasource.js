var assert, datasource, periodicities, vows, _;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
assert = require('assert');
vows = require('vows');
_ = require('../deps/underscore');
datasource = require('../lib/datasource');
periodicities = require('../lib/strat-common').periodicities;
vows.describe('DefaultHistoricalDatasource').addBatch({
  'when createHistoricalDatasource is invoked for 4 days': {
    topic: function() {
      var bars, callback, ds;
      bars = [];
      ds = datasource.createHistoricalSource('SPY', periodicities.ONEDAY, new Date(2011, 8, 5), new Date(2011, 8, 8), function(time, ohlcv) {
        return bars.push({
          time: time,
          ohlcv: ohlcv
        });
      });
      callback = this.callback;
      return ds.events.on('end', __bind(function() {
        return callback(bars);
      }, this));
    }
  }
})["export"](module);