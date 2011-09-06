_ = require "../deps/underscore.js"
{EventEmitter} = require 'events'
{BarSeries} = require './timeseries'
{periodicities} = require './strat-common'

exports.WatchList = class WatchList extends Array
  constructor: (symbols) ->
    args = symbols
    if not _.isArray symbols
      args = Array::slice.call(arguments,1)
      args.unshift(symbols)

    @events = events = new EventEmitter

    buildTickerData = (s) ->
      tickerData = new TickerData(s)
      tickerData.events.on('newbar', (ohlcv) ->
        events.emit('newbar', ohlcv); return
      )
      tickerData

    @push buildTickerData s for s in args


class TickerData
  constructor: (@symbol) ->
    @series = new BarSeries
    @events = new EventEmitter

  publishBar: (date, ohlcv) ->
    @series.setBar(date, ohlcv)
    @events.emit('newbar', date, ohlcv)
    return


class DefaultHistoricalSource
  constructor: (@symbol, periodicity, @start, end) ->
    @periodicity = if _([periodicities.ONEDAY, periodicities.ONEWEEK]).include(periodicity)
        periodicity
      else throw "invalid periodicity"
    @end = end ? undefined

class DefaultOHLCStream
  constructor: (@symbol, periodicity, pollFrequency) ->
    @periodicity = if _(periodicities).include(periodicity) 
      periodicity 
    else throw "invalid periodicity"
    @pollFrequency = pollFrequency ? periodicities.ONEMIN

