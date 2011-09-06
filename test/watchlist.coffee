assert = require 'assert'
vows = require 'vows'
_ = require '../deps/underscore'

{WatchList} = require('../lib/watchlist')

vows.describe('WatchList').addBatch

  'when passing it some ticker symbols':
    topic: new WatchList ["spy","qqqq"]

    'it creates an array-like': (watchList) ->
      assert.equal watchList.constructor Array

    'it creates an object with series for each ticker': (watchList) ->
      assert.ok _.isObject(watchList[0].series)
      assert.ok _.isObject(watchList[1].series)

    'TickerData items respond to publishBar invoke': (watchList) ->
      watchList[0].events.on('newbar', (bar) ->
        assert.ok bar.open
        assert.ok bar.close
      )
      assert.doesNotThrow ->
        watchList[0].publishBar {open:1.00, high:1.10, low:0.98, close:1.01}


  'when params are passed as arguments (not array)':
    topic: new WatchList "spy", "qqqq", "bnd"

    'the returned object is same as if an array is passed': (watchList) ->
      expected = new WatchList ["spy", "qqqq", "bnd"]
      assert.deepEqual(watchList[0].series, expected[0].series)
      assert.strictEqual(watchList[2].symbol, watchList[2].symbol)


  'it is compatible with':
    topic: new WatchList ["spy", "qqqq", "bnd"]

    'underscore.js map': (watchList) ->
      collection = null
      assert.doesNotThrow ->
        collection = _.map(watchList, ((tickerData) ->
          tickerData.symbol
        ))
      assert.deepEqual(collection, ["spy", "qqqq", "bnd"])


.export(module)



