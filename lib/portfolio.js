var Portfolio, Positions;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
exports.Portfolio = Portfolio = (function() {
  function Portfolio() {
    this.positions = new Positions;
  }
  return Portfolio;
})();
Positions = (function() {
  __extends(Positions, Array);
  function Positions() {
    Positions.__super__.constructor.apply(this, arguments);
  }
  Positions.prototype.apply = function(trades) {
    return this.push(trades);
  };
  return Positions;
})();