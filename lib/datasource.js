var DefaultHistoricalSource, DefaultOHLCStream, http, periodicities;
periodicities = require('./strat-common').periodicities;
http = require('http');
DefaultHistoricalSource = (function() {
  function DefaultHistoricalSource(symbol, periodicity, start, end, onBarCallback) {
    var periodicityParam, reqOpt;
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
    http.get(reqOpt, function(res) {
      if (res.statusCode(!200)) {
        throw "invalid symbol";
      }
    }).on('error', function(err) {
      throw "download failed: " + err.message;
    });
  }
  return DefaultHistoricalSource;
})();
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