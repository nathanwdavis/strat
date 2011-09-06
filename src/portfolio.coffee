
exports.Portfolio = class Portfolio

  constructor: ->
    @positions = new Positions


class Positions extends Array

  apply: (trades) ->
    @push(trades)
