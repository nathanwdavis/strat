
assert = require 'assert'
vows = require 'vows'
_ = require '../deps/underscore'
datasource = require '../lib/datasource'
{periodicities} = require '../lib/strat-common'

vows.describe('DefaultHistoricalDatasource').addBatch

  'when createHistoricalDatasource is invoked for 4 days':
    topic: ->
      bars = []
      ds = datasource.createHistoricalSource(
        'SPY', 
        periodicities.ONEDAY, 
        new Date(2011,8,5), 
        new Date(2011,8,8),
        (time,ohlcv) -> 
          bars.push({time: time, ohlcv: ohlcv})
      )
      callback = @callback
      ds.events.on('end', =>
        callback(bars)
      )
    #,
    # Not working yet
    #'the callback should get called once for each period': (bars) ->
    #  assert.equal(bars.length, 4)

.export(module)
