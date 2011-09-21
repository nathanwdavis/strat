var DefaultHistoricalSource, DefaultOHLCStream, http, parseHistoricalCsv, periodicities, _;
periodicities = require('./strat-common').periodicities;
http = require('http');
_ = require('../deps/underscore');
DefaultHistoricalSource = (function() {
  function DefaultHistoricalSource(symbol, periodicity, start, end, onBarCallback) {
    var periodicityParam, reqOpt, resBody;
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
    this.events = new EventEmitter;
    _.isFunction(onBarCallback) && this.events.on('bar', onBarCallback);
    periodicityParam = this.periodicity === periodicities.ONEWEEK ? 'd' : 'w';
    reqOpt = {
      host: 'ichart.finance.yahoo.com',
      port: 80,
      path: "/table.csv?s=" + symbol + "&a=" + start.month + "&b=" + start.day + "&c=" + start.year + "&d=" + end.month + "&e=" + end.day + "&f=" + end.year + "&g=" + periodicityParam + "&ignore=.csv"
    };
    resBody = "";
    http.get(reqOpt, function(res) {
      if (res.statusCode(!200)) {
        throw "invalid symbol";
      }
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        return resBody += chunk;
      });
      return res.on('end', function() {
        var data;
        data = parseHistoricalCsv(resBody);
        return _(data).each(function(bar) {
          return this.events.emit('bar', bar.time, bar);
        });
      });
    }).on('error', function(err) {
      throw "download failed: " + err.message;
    });
  }
  return DefaultHistoricalSource;
})();
parseHistoricalCsv = function(csv) {
  var bars, lines;
  lines = csv.split('\n');
  return bars = _(lines).map(function(line) {
    var barData, doRead, ohlcv;
    if (!doRead) {
      doRead = true;
    } else {
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
    }
  });
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