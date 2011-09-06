var BarSeries, DefaultHistoricalSource, DefaultOHLCStream, EventEmitter, TickerData, WatchList, periodicities, _;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
_ = require("../deps/underscore.js");
EventEmitter = require('events').EventEmitter;
BarSeries = require('./timeseries').BarSeries;
periodicities = require('./strat-common').periodicities;
exports.WatchList = WatchList = (function() {
  __extends(WatchList, Array);
  function WatchList(symbols) {
    var args, buildTickerData, events, s, _i, _len;
    args = symbols;
    if (!_.isArray(symbols)) {
      args = Array.prototype.slice.call(arguments, 1);
      args.unshift(symbols);
    }
    this.events = events = new EventEmitter;
    buildTickerData = function(s) {
      var tickerData;
      tickerData = new TickerData(s);
      tickerData.events.on('newbar', function(ohlcv) {
        events.emit('newbar', ohlcv);
      });
      return tickerData;
    };
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      s = args[_i];
      this.push(buildTickerData(s));
    }
  }
  return WatchList;
})();
TickerData = (function() {
  function TickerData(symbol) {
    this.symbol = symbol;
    this.series = new BarSeries;
    this.events = new EventEmitter;
  }
  TickerData.prototype.publishBar = function(date, ohlcv) {
    this.series.setBar(date, ohlcv);
    this.events.emit('newbar', date, ohlcv);
  };
  return TickerData;
})();
DefaultHistoricalSource = (function() {
  function DefaultHistoricalSource(symbol, periodicity, start, end) {
    this.symbol = symbol;
    this.start = start;
    this.periodicity = (function() {
      if (_([periodicities.ONEDAY, periodicities.ONEWEEK]).include(periodicity)) {
        return periodicity;
      } else {
        throw "invalid periodicity";
      }
    })();
    this.end = end != null ? end : void 0;
  }
  return DefaultHistoricalSource;
})();
DefaultOHLCStream = (function() {
  function DefaultOHLCStream(symbol, periodicity, pollFrequency) {
    this.symbol = symbol;
    this.periodicity = (function() {
      if (_(periodicities).include(periodicity)) {
        return periodicity;
      } else {
        throw "invalid periodicity";
      }
    })();
    this.pollFrequency = pollFrequency != null ? pollFrequency : periodicities.ONEMIN;
  }
  return DefaultOHLCStream;
})();