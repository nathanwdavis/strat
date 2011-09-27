
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
        new Date('2011-09-01'), 
        new Date('2011-09-04'),
        (time,ohlcv) -> 
          bars.push({time: time, ohlcv: ohlcv})
      )
      ds.events.on('end', ->
        @callback(bars)
      )
    ,

    'the callback should get called once for each period': (bars) ->
      assert.equal(bars.length, 4)

.export(module)
