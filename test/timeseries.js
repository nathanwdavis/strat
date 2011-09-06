var BarSeries, TimeSeries, assert, helpers, vows, _, _ref;
helpers = require('./test-helpers');
assert = require('assert');
vows = require('vows');
_ = require('../deps/underscore');
_ref = require('../lib/timeseries'), TimeSeries = _ref.TimeSeries, BarSeries = _ref.BarSeries;
vows.describe('TimeSeries').addBatch({
  'when ctor is invoked with no options param': {
    topic: new TimeSeries(),
    'some default instance attributes should get set': function(series) {
      return assert.ok(series.periodicity);
    },
    'some important "private" attributes should get set': function(series) {
      assert.ok(_.isArray(series.series));
      return assert.ok(typeof series.times === 'object');
    }
  },
  'when invoking set': {
    topic: new TimeSeries(),
    'invoking set creates a new item in the series': function(series) {
      var time;
      time = Date.parse("2011-09-01");
      assert.doesNotThrow(function() {
        return series.set(time, {
          open: 1.00,
          high: 1.10,
          low: 0.98,
          close: 1.01
        });
      });
      assert.ok(series.times.indexOf(time) === 0);
      return assert.deepEqual(series.series[0], {
        open: 1.00,
        high: 1.10,
        low: 0.98,
        close: 1.01,
        time: time
      });
    },
    'setting on existing time/key just updates the existing data': function(series) {
      var time;
      time = Date.parse("2011-09-01");
      series.set(time, {
        open: 1.00,
        high: 1.10,
        low: 0.98,
        close: 1.01
      });
      series.set(time, {
        open: 2.00,
        high: 2.10,
        low: 1.98,
        close: 2.01
      });
      assert.ok(series.times.indexOf(time) === 0);
      assert.ok(!series.times[1]);
      return assert.deepEqual(series.series[0], {
        open: 2.00,
        high: 2.10,
        low: 1.98,
        close: 2.01,
        time: time
      });
    },
    'setting a new latest time/key adds to the end': function(series) {
      var time0, time1;
      time0 = Date.parse('2011-09-01');
      series.set(time0, {
        open: 1.00,
        high: 1.10,
        low: 0.98,
        close: 1.01
      });
      time1 = Date.parse('2011-09-02');
      series.set(time1, {
        open: 2.00,
        high: 2.10,
        low: 1.98,
        close: 2.01
      });
      assert.ok(series.times.indexOf(time0) === 0);
      assert.ok(series.times.indexOf(time1) === 1);
      return assert.deepEqual(series.series[1], {
        open: 2.00,
        high: 2.10,
        low: 1.98,
        close: 2.01,
        time: time1
      });
    },
    'setting a new NON-latest time/key adds to chronologically correct index': function(series) {
      var time;
      time = [Date.parse('2011-09-01'), Date.parse('2011-09-02'), Date.parse('2011-09-03')];
      series.set(time[0], {
        open: 1.00,
        high: 1.10,
        low: 0.98,
        close: 1.01
      });
      series.set(time[2], {
        open: 2.00,
        high: 2.10,
        low: 1.98,
        close: 2.01
      });
      series.set(time[1], {
        open: 1.50,
        high: 1.60,
        low: 1.48,
        close: 1.51
      });
      assert.ok(series.times.indexOf(time[1]) === 1);
      return assert.deepEqual(series.series[1], {
        open: 1.50,
        high: 1.60,
        low: 1.48,
        close: 1.51,
        time: time[1]
      });
    }
  },
  'when invoking get': {
    topic: function() {
      var series;
      series = new TimeSeries;
      series.set(Date.parse('2011-09-01'), 10.00);
      series.set(Date.parse('2011-09-02'), 11.30);
      series.set(Date.parse('2011-09-03'), 10.99);
      series.set(Date.parse('2011-09-04'), 10.75);
      series.set(Date.parse('2011-09-05'), 10.91);
      return series;
    },
    'providing an exact matched time gets the data for that time': function(series) {
      var actual;
      actual = series.get(Date.parse('2011-09-04'));
      assert.strictEqual(actual, 10.75);
      return assert.strictEqual(series.indexOf(10.75), 3);
    },
    'providing an NON matching time gets the latest data up until that time': function(series) {
      var actual;
      actual = series.get(Date.parse('2011-09-04') + 60);
      assert.strictEqual(actual, 10.75);
      return assert.strictEqual(series.indexOf(10.75), 3);
    },
    'providing an time that is before anything in the series returns undefined': function(series) {
      var actual;
      actual = series.get(Date.parse('2011-08-30'));
      return assert.strictEqual(actual, void 0);
    }
  },
  'when BarSeries behaves just like TimeSeries with a Bar object': {
    topic: new BarSeries,
    'invoking setBar creates a new item in the series': function(series) {
      var time;
      time = Date.parse("2011-09-01");
      assert.doesNotThrow(function() {
        return series.setBar(time, 1.00, 1.10, 0.98, 1.01);
      });
      assert.ok(series.times.indexOf(time) === 0);
      return assert.deepEqual(series.series[0], {
        open: 1.00,
        high: 1.10,
        low: 0.98,
        close: 1.01,
        vol: void 0,
        time: time
      });
    },
    'setting on existing time/key just updates the existing data': function(series) {
      var time;
      time = Date.parse("2011-09-01");
      series.setBar(time, 1.00, 1.10, 0.98, 1.01);
      series.setBar(time, 2.00, 2.10, 1.98, 2.01);
      assert.ok(series.times.indexOf(time) === 0);
      assert.ok(!series.times[1]);
      return assert.deepEqual(series.series[0], {
        open: 2.00,
        high: 2.10,
        low: 1.98,
        close: 2.01,
        vol: void 0,
        time: time
      });
    },
    'setting a new latest time/key adds to the end': function(series) {
      var time0, time1;
      time0 = Date.parse('2011-09-01');
      series.setBar(time0, 1.00, 1.10, 0.98, 1.01);
      time1 = Date.parse('2011-09-02');
      series.setBar(time1, 2.00, 2.10, 1.98, 2.01);
      assert.ok(series.times.indexOf(time0) === 0);
      assert.ok(series.times.indexOf(time1) === 1);
      return assert.deepEqual(series.series[1], {
        open: 2.00,
        high: 2.10,
        low: 1.98,
        close: 2.01,
        vol: void 0,
        time: time1
      });
    },
    'setting a new NON-latest time/key adds to chronologically correct index': function(series) {
      var time;
      time = [Date.parse('2011-09-01'), Date.parse('2011-09-02'), Date.parse('2011-09-03')];
      series.setBar(time[0], 1.00, 1.10, 0.98, 1.01);
      series.setBar(time[2], 2.00, 2.10, 1.98, 2.01);
      series.setBar(time[1], 1.50, 1.60, 1.48, 1.51);
      assert.ok(series.times.indexOf(time[1]) === 1);
      return assert.deepEqual(series.series[1], {
        open: 1.50,
        high: 1.60,
        low: 1.48,
        close: 1.51,
        vol: void 0,
        time: time[1]
      });
    }
  },
  'underscore methods are mapped to series data': {
    topic: function() {
      var series;
      series = new TimeSeries;
      series.set('2011-09-01', 10.00);
      series.set('2011-09-02', 11.30);
      series.set('2011-09-03', 10.99);
      series.set('2011-09-04', 10.75);
      series.set('2011-09-05', 10.91);
      return series;
    },
    '#each': function(series) {
      return assert.doesNotThrow(function() {
        return series.each(function(point) {
          var out;
          return out = point.toString();
        });
      });
    },
    '#map': function(series) {
      var points;
      points = series.map(function(point) {
        return point;
      });
      return assert.deepEqual(points, [10.00, 11.30, 10.99, 10.75, 10.91]);
    },
    '#last': function(series) {
      var lastPoint;
      lastPoint = series.last();
      return assert.strictEqual(lastPoint, 10.91);
    }
  }
})["export"](module);