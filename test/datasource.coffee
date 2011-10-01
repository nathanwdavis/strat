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
        new Date(2011,8,6), 
        new Date(2011,8,9),
        (time,ohlcv) -> 
          bars.push({time: time, ohlcv: ohlcv})
      )
      ds.events.on('end', =>
        emitter.emit('success', bars)
        return
      )
      return emitter

    'the callback should get called once for each period': (err,bars) ->
      assert.isNull(err)
      assert.strictEqual(bars.length, 4)

    'for a stock a bar should be emmitted for each week day in the date range': (err, bars) ->
      assert.isNull(err)
      bars = _(bars).sortBy((item) -> item.time)
      assert.strictEqual(bars[0].time, Date.parse('2011-09-06'))
      assert.strictEqual(bars[1].time, Date.parse('2011-09-07'))
      assert.strictEqual(bars[2].time, Date.parse('2011-09-08'))
      assert.strictEqual(bars[3].time, Date.parse('2011-09-09'))

    'callbacks should occur with bars in chronological order': (err, bars) ->
      assert.isNull(err)
      gotTimes = _(bars).pluck('time')
      expectedTimes = _(bars).chain().sortBy((item) -> item.time).pluck('time').value()
      assert.deepEqual(gotTimes, expectedTimes)

.export(module)
