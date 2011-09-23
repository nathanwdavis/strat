
assert = require 'assert'
vows = require 'vows'
_ = require '../deps/underscore'
datasource = require '../lib/datasource'
{periodicities} = require '../lib/strat-common'

vows.describe('DefaultHistoricalDatasource').addBatch

  'when createHistoricalDatasource is invoked':
    topic: datasource.createHistoricalSource(
        'SPY', 
        periodicities.ONEDAY, 
        new Date('2011-09-01'), 
        new Date('2011-09-04')
    ),

    'the callback should get called once for each period': (ds) ->
      count = 0
      ds.events.on('bar', (time, ohlcv) ->
        count++
      )
      ds.events.on('end', ->
        assert.equal(count, 4)
      )

.export(module)
