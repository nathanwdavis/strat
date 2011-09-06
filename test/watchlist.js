var WatchList, assert, vows, _;
assert = require('assert');
vows = require('vows');
_ = require('../deps/underscore');
WatchList = require('../lib/watchlist').WatchList;
vows.describe('WatchList').addBatch({
  'when passing it some ticker symbols': {
    topic: new WatchList(["spy", "qqqq"]),
    'it creates an array-like': function(watchList) {
      return assert.equal(watchList.constructor(Array));
    },
    'it creates an object with series for each ticker': function(watchList) {
      assert.ok(_.isObject(watchList[0].series));
      return assert.ok(_.isObject(watchList[1].series));
    },
    'TickerData items respond to publishBar invoke': function(watchList) {
      watchList[0].events.on('newbar', function(bar) {
        assert.ok(bar.open);
        return assert.ok(bar.close);
      });
      return assert.doesNotThrow(function() {
        return watchList[0].publishBar({
          open: 1.00,
          high: 1.10,
          low: 0.98,
          close: 1.01
        });
      });
    }
  },
  'when params are passed as arguments (not array)': {
    topic: new WatchList("spy", "qqqq", "bnd"),
    'the returned object is same as if an array is passed': function(watchList) {
      var expected;
      expected = new WatchList(["spy", "qqqq", "bnd"]);
      assert.deepEqual(watchList[0].series, expected[0].series);
      return assert.strictEqual(watchList[2].symbol, watchList[2].symbol);
    }
  },
  'it is compatible with': {
    topic: new WatchList(["spy", "qqqq", "bnd"]),
    'underscore.js map': function(watchList) {
      var collection;
      collection = null;
      assert.doesNotThrow(function() {
        return collection = _.map(watchList, (function(tickerData) {
          return tickerData.symbol;
        }));
      });
      return assert.deepEqual(collection, ["spy", "qqqq", "bnd"]);
    }
  }
})["export"](module);