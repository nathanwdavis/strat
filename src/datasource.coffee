{periodicities} = require './strat-common'
http = require 'http'
{EventEmitter} = require 'events'
_ = require '../deps/underscore'

class DefaultHistoricalSource
  constructor: (@symbol, periodicity, @start, end, onBarCallback) ->
    @periodicity = if _([periodicities.ONEDAY, periodicities.ONEWEEK]).include(periodicity)
        periodicity
      else throw "invalid periodicity"
    @end = end ? undefined

    @events = events = new EventEmitter
    _.isFunction(onBarCallback) and @events.on('bar', onBarCallback)

    periodicityParam = if @periodicity == periodicities.ONEWEEK then 'w' else 'd'
    reqOpt = 
      host: 'ichart.finance.yahoo.com'
      port: 80
      path: "/table.csv?s=#{symbol}&a=#{start.getMonth()}&b=#{start.getDate()}&c=#{start.getFullYear()}&d=#{end.getMonth()}&e=#{end.getDate()}&f=#{end.getFullYear()}&g=#{periodicityParam}&ignore=.csv"
    resBody = ""
    http.get(reqOpt, (res) ->
      if res.statusCode != 200
        throw "invalid symbol"
      res.setEncoding('utf8')
      res.on('data', (chunk) ->
        resBody += chunk
      )
      res.on('end', ->
        data = parseHistoricalCsv(resBody, true)
        _(data).each((bar) ->
          events.emit('bar', bar.time, bar)
        )
        events.emit('end')
      )
    ).on('error', (err) ->
      throw "download failed: #{err.message}"
    )

exports.parseHistoricalCsv = parseHistoricalCsv = (csv, removeHeader) ->
  lines = csv.split('\n')
  if removeHeader then lines = lines.slice(1)
  lines = _(lines).filter((line) -> line != "")
  bars = _(lines).map((line) ->
    barData = line.split(',')
    ohlcv =
      time: Date.parse(barData[0])
      open: parseFloat(barData[1])
      high: parseFloat(barData[2])
      low: parseFloat(barData[3])
      close: parseFloat(barData[4])
      vol: parseInt(barData[5])
      adjustedClose: parseFloat(barData[6])
  )
  bars

exports.createHistoricalSource = (symbol, periodicity, start, end, onBarCallback) ->
  new DefaultHistoricalSource(symbol, periodicity, start, end, onBarCallback)

class DefaultOHLCStream
  constructor: (@symbol, periodicity, pollFrequency, onBarCallback) ->
    @periodicity = if _(periodicities).include(periodicity)
      periodicity 
    else throw "invalid periodicity"
    @pollFrequency = pollFrequency ? periodicities.ONEMIN

