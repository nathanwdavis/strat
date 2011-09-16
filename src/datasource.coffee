{periodicities} = require './strat-common'
http = require 'http'

class DefaultHistoricalSource
  constructor: (@symbol, periodicity, @start, end, onBarCallback) ->
    @periodicity = if _([periodicities.ONEDAY, periodicities.ONEWEEK]).include(periodicity)
        periodicity
      else throw "invalid periodicity"
    @end = end ? undefined

    @events = new EventEmitter
    _.isFunction(onBarCallback) and @events.on('bar', onBarCallback)

    periodicityParam = if @periodicity == periodicities.ONEWEEK then 'd' else 'w'
    reqOpt = 
      host: 'ichart.finance.yahoo.com'
      port: 80
      path: "/table.csv?s=#{symbol}&a=#{start.month}&b=#{start.day}&c=#{start.year}&d=#{end.month}&e=#{end.day}&f=#{end.year}&g=#{periodicityParam}&ignore=.csv"
    http.get(reqOpt, (res) ->
      if res.statusCode not 200
        throw "invalid symbol"
    ).on('error', (err) ->
      throw "download failed: #{err.message}"
    )

class DefaultOHLCStream
  constructor: (@symbol, periodicity, pollFrequency, onBarCallback) ->
    @periodicity = if _(periodicities).include(periodicity)
      periodicity 
    else throw "invalid periodicity"
    @pollFrequency = pollFrequency ? periodicities.ONEMIN

