(function() {
  var LineString;

  LineString = (function() {

    function LineString(options) {
      var ls;
      ls = this;
      this.attrAccessible.forEach(function(attr) {
        return ls[attr] = options[attr];
      });
      this.calculatePixels();
    }

    LineString.prototype.coordinates = null;

    LineString.prototype.type = null;

    LineString.prototype.label = null;

    LineString.prototype.shape = null;

    LineString.prototype.tile = null;

    LineString.prototype.attrAccessible = ['coordinates', 'label', 'type', 'shape', 'tile'];

    LineString.prototype.calculatePixels = function() {
      var ls, o;
      this.pixels = [];
      ls = this;
      o = this.tile.offset;
      return this.coordinates.forEach(function(coordinate) {
        var p;
        p = ls.tile.latLngToPixel(coordinate[1], coordinate[0]);
        return ls.pixels.push([p.x - o.left, p.y - o.top]);
      });
    };

    LineString.prototype.clip = function() {};

    LineString.prototype.drawBg = function(ctx) {};

    LineString.prototype.draw = function(ctx) {};

    LineString.prototype.drawLabel = function(ctx) {};

    return LineString;

  })();

  module.exports = LineString;

}).call(this);
