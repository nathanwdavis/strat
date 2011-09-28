(function() {
  var EventEmitter, assert, datasource, periodicities, vows, _;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  EventEmitter = require('events').EventEmitter;
  assert = require('assert');
  vows = require('vows');
  _ = require('../deps/underscore');
  datasource = require('../lib/datasource');
  periodicities = require('../lib/strat-common').periodicities;
  vows.describe('DefaultHistoricalDatasource').addBatch({
    'when createHistoricalDatasource is invoked for 4 days': {
      topic: function() {
        var bars, ds, emitter;
        emitter = new EventEmitter;
        bars = [];
        ds = datasource.createHistoricalSource('SPY', periodicities.ONEDAY, new Date(2011, 8, 5), new Date(2011, 8, 8), function(time, ohlcv) {
          return bars.push({
            time: time,
            ohlcv: ohlcv
          });
        });
        ds.events.on('end', __bind(function() {
          debugger;          emitter.emit('success', bars);
        }, this));
        return emitter;
      },
      'the callback should get called once for each period': function(err, bars) {
        debugger;        assert.isNull(err);
        return assert.strictEqual(bars.length, 3);
      }
    }
  })["export"](module);
}).call(this);
