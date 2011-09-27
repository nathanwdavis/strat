(function() {
  var assert, datasource, periodicities, vows, _;
  assert = require('assert');
  vows = require('vows');
  _ = require('../deps/underscore');
  datasource = require('../lib/datasource');
  periodicities = require('../lib/strat-common').periodicities;
  vows.describe('DefaultHistoricalDatasource').addBatch({
    'when createHistoricalDatasource is invoked for 4 days': {
      topic: function() {
        var bars, ds;
        bars = [];
        ds = datasource.createHistoricalSource('SPY', periodicities.ONEDAY, new Date('2011-09-01'), new Date('2011-09-04'), function(time, ohlcv) {
          return bars.push({
            time: time,
            ohlcv: ohlcv
          });
        });
        return ds.events.on('end', function() {
          return this.callback(bars);
        });
      },
      'the callback should get called once for each period': function(bars) {
        return assert.equal(bars.length, 4);
      }
    }
  })["export"](module);
}).call(this);
