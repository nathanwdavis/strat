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

    @events = new EventEmitter
    _.isFunction(onBarCallback) and @events.on('bar', onBarCallback)

    periodicityParam = if @periodicity == periodicities.ONEWEEK then 'd' else 'w'
    reqOpt = 
      host: 'ichart.finance.yahoo.com'
      port: 80
      path: "/table.csv?s=#{symbol}&a=#{start.month}&b=#{start.day}&c=#{start.year}&d=#{end.month}&e=#{end.day}&f=#{end.year}&g=#{periodicityParam}&ignore=.csv"
    resBody = ""
    http.get(reqOpt, (res) ->
      if res.statusCode not 200
        throw "invalid symbol"
      res.setEncoding('utf8')
      res.on('data', (chunk) ->
        resBody += chunk
      )
      res.on('end', ->
        data = parseHistoricalCsv(resBody)
        _(data).each((bar) ->
          @events.emit('bar', bar.time, bar)
        )
        @events.emit('end')
      )
    ).on('error', (err) ->
      throw "download failed: #{err.message}"
    )

exports.parseHistoricalCsv = (csv) ->
  lines = csv.split('\n')
  bars = _(lines).map((line) ->
    if not doRead
      doRead = true
      return
    else
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

exports.createHistoricalSource = (symbol, periodicity, start, end, onBarCallback) ->
  new DefaultHistoricalSource(symbol, periodicity, start, end, onBarCallback)

class DefaultOHLCStream
  constructor: (@symbol, periodicity, pollFrequency, onBarCallback) ->
    @periodicity = if _(periodicities).include(periodicity)
      periodicity 
    else throw "invalid periodicity"
    @pollFrequency = pollFrequency ? periodicities.ONEMIN

