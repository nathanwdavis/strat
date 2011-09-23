var assert, datasource, periodicities, vows, _;
assert = require('assert');
vows = require('vows');
_ = require('../deps/underscore');
datasource = require('../lib/datasource');
periodicities = require('../lib/strat-common').periodicities;
vows.describe('DefaultHistoricalDatasource').addBatch({
  'when createHistoricalDatasource is invoked': {
    topic: datasource.createHistoricalSource('SPY', periodicities.ONEDAY, new Date('2011-09-01'), new Date('2011-09-04')),
    'the callback should get called once for each period': function(ds) {
      var count;
      count = 0;
      ds.events.on('bar', function(time, ohlcv) {
        return count++;
      });
      return ds.events.on('end', function() {
        return assert.equal(count, 4);
      });
    }
  }
})["export"](module);