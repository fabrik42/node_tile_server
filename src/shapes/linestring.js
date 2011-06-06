var async = require('async');

module.exports = (function(){

LineString = function() {};

LineString.prototype.coordinates = null;

LineString.prototype.type = null;

LineString.prototype.label = null;

LineString.prototype.shape = null;

LineString.prototype.tile = null;

LineString.prototype.attrAccessible = [
  'coordinates',
  'label',
  'type',
  'shape',
  'tile'
];

LineString.prototype.initialize = function(options) {
  var ls = this;
  this.attrAccessible.forEach(function(attr){
    ls[attr] = options[attr];
  });
  
  this.calculatePixels();
};

LineString.prototype.calculatePixels = function() {
  this.pixels = [];

  var p,
      ls = this,
      o = this.tile.offset;

  this.coordinates.forEach(function(coordinate){
    //ATTENTION: lat/lng is in reverse order in the coordinates array!
    p = ls.tile.latLngToPixel(coordinate[1], coordinate[0]);
    ls.pixels.push([ p.x - o.left, p.y  - o.top ]);
  });
};

LineString.prototype.clip = function() {};

LineString.prototype.drawBg = function(ctx) {};

LineString.prototype.draw = function(ctx) {};

LineString.prototype.drawLabel = function(ctx) {};

return LineString;

})();