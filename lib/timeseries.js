var BarSeries, TimeSeries, periodicities, _;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
_ = require('../deps/underscore');
periodicities = require('./strat-common').periodicities;
exports.TimeSeries = TimeSeries = (function() {
  function TimeSeries(options) {
    var methods;
    options = _.defaults(options != null ? options : {}, {
      periodicity: periodicities.ONEDAY,
      series: [],
      times: []
    });
    _.extend(this, options);
    methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size', 'first', 'head', 'rest', 'tail', 'last', 'without', 'indexOf', 'lastIndexOf', 'isEmpty', 'groupBy'];
    _.each(methods, function(method) {
      TimeSeries.prototype[method] = function() {
        return _[method].apply(_, [this.series].concat(_.toArray(arguments)));
      };
    });
  }
  TimeSeries.prototype.set = function(time, data) {
    var existingIdx, targetIdx;
    data.time = time;
    if (time > _.last(this.times)) {
      this.times.push(time);
      return this.series.push(data);
    } else {
      existingIdx = _.indexOf(this.times, time, true);
      if (existingIdx >= 0) {
        this.times[existingIdx] = time;
        return this.series[existingIdx] = data;
      } else {
        targetIdx = _.sortedIndex(this.times, time);
        this.times.splice(targetIdx, 0, time);
        return this.series.splice(targetIdx, 0, data);
      }
    }
  };
  TimeSeries.prototype.get = function(time) {
    var idx;
    idx = _(this.times).indexOf(time, true);
    if (idx < 0) {
      idx = _(this.times).sortedIndex(time);
      if (idx >= 0) {
        idx--;
      }
    }
    if (idx >= 0) {
      return this.series[idx];
    }
  };
  return TimeSeries;
})();
exports.BarSeries = BarSeries = (function() {
  __extends(BarSeries, TimeSeries);
  function BarSeries() {
    BarSeries.__super__.constructor.apply(this, arguments);
  }
  BarSeries.prototype.setBar = function(time, o, h, l, c, v) {
    return this.set(time, {
      open: o,
      high: h,
      low: l,
      close: c,
      vol: v
    });
  };
  return BarSeries;
})();