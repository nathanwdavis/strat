_ = require '../deps/underscore'
{periodicities} = require './strat-common'

exports.TimeSeries = class TimeSeries

  constructor: (options) ->
    options = _.defaults(options ? {},
      periodicity: periodicities.ONEDAY
      series: []
      times: []
    )
    _.extend(@, options)

    methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect',
      'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include',
      'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size',
      'first', 'head', 'rest', 'tail', 'last', 'without', 'indexOf', 'lastIndexOf', 
      'isEmpty', 'groupBy']

    _.each(methods, (method) ->
      TimeSeries::[method] = ->
        return _[method].apply(_, [@series].concat(_.toArray(arguments)))
      return
    )

  set: (time, data) ->
    data.time = time
    if time > _.last(@times)
      #simple push
      @times.push time
      @series.push data
    else
      existingIdx = _.indexOf(@times, time, true)
      if existingIdx >= 0
        @times[existingIdx] = time
        @series[existingIdx] = data
      else
        #re-index needed
        targetIdx = _.sortedIndex(@times, time)
        @times.splice(targetIdx, 0, time)
        @series.splice(targetIdx, 0, data)

  get: (time) ->
    idx = _(@times).indexOf(time, true)
    if idx < 0
      idx = _(@times).sortedIndex(time)
      idx-- if idx >= 0
    if idx >= 0
      @series[idx]


exports.BarSeries = class BarSeries extends TimeSeries

  setBar: (time,o,h,l,c,v) ->
    @set(time, {open:o, high:h, low:l, close:c, vol:v})

