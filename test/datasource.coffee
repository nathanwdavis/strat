{EventEmitter} = require 'events'
assert = require 'assert'
vows = require 'vows'
_ = require '../deps/underscore'
datasource = require '../lib/datasource'
{periodicities} = require '../lib/strat-common'

vows.describe('DefaultHistoricalDatasource').addBatch

  'when createHistoricalDatasource is invoked for 4 days':
    topic: ->
      emitter = new EventEmitter
      bars = []
      ds = datasource.createHistoricalSource(
        'SPY', 
        periodicities.ONEDAY, 
        new Date(2011,8,5), 
        new Date(2011,8,8),
        (time,ohlcv) -> 
          bars.push({time: time, ohlcv: ohlcv})
      )
      ds.events.on('end', =>
        debugger
        emitter.emit('success', bars)
        return
      )
      return emitter
    ,
    #Not working yet
    'the callback should get called once for each period': (err,bars) ->
      debugger
      assert.isNull(err)
      assert.strictEqual(bars.length, 3)

.export(module)
