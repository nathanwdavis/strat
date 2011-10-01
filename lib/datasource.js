var DefaultHistoricalSource, DefaultOHLCStream, EventEmitter, http, parseHistoricalCsv, periodicities, _;
periodicities = require('./strat-common').periodicities;
http = require('http');
EventEmitter = require('events').EventEmitter;
_ = require('../deps/underscore');
DefaultHistoricalSource = (function() {
  function DefaultHistoricalSource(symbol, periodicity, start, end, onBarCallback) {
    var events, periodicityParam, reqOpt, resBody;
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
    this.events = events = new EventEmitter;
    _.isFunction(onBarCallback) && this.events.on('bar', onBarCallback);
    periodicityParam = this.periodicity === periodicities.ONEWEEK ? 'w' : 'd';
    reqOpt = {
      host: 'ichart.finance.yahoo.com',
      port: 80,
      path: "/table.csv?s=" + symbol + "&a=" + (start.getMonth()) + "&b=" + (start.getDate()) + "&c=" + (start.getFullYear()) + "&d=" + (end.getMonth()) + "&e=" + (end.getDate()) + "&f=" + (end.getFullYear()) + "&g=" + periodicityParam + "&ignore=.csv"
    };
    resBody = "";
    http.get(reqOpt, function(res) {
      if (res.statusCode !== 200) {
        throw "invalid symbol";
      }
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        return resBody += chunk;
      });
      return res.on('end', function() {
        var data;
        data = parseHistoricalCsv(resBody, true);
        _(data).each(function(bar) {
          return events.emit('bar', bar.time, bar);
        });
        return events.emit('end');
      });
    }).on('error', function(err) {
      throw "download failed: " + err.message;
    });
  }
  return DefaultHistoricalSource;
})();
exports.parseHistoricalCsv = parseHistoricalCsv = function(csv, removeHeader) {
  var bars, lines;
  lines = csv.split('\n');
  if (removeHeader) {
    lines = lines.slice(1);
  }
  lines = _(lines).filter(function(line) {
    return line !== "";
  });
  bars = _(lines).map(function(line) {
    var barData, ohlcv;
    barData = line.split(',');
    return ohlcv = {
      time: Date.parse(barData[0]),
      open: parseFloat(barData[1]),
      high: parseFloat(barData[2]),
      low: parseFloat(barData[3]),
      close: parseFloat(barData[4]),
      vol: parseInt(barData[5]),
      adjustedClose: parseFloat(barData[6])
    };
  });
  return bars.reverse();
};
exports.createHistoricalSource = function(symbol, periodicity, start, end, onBarCallback) {
  return new DefaultHistoricalSource(symbol, periodicity, start, end, onBarCallback);
};
DefaultOHLCStream = (function() {
  function DefaultOHLCStream(symbol, periodicity, pollFrequency, onBarCallback) {
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