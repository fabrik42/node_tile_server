(function() {
  var Canvas, Tile;

  Canvas = require('canvas');

  Tile = (function() {

    function Tile(x, y, zoom, callback) {
      this.x = x;
      this.y = y;
      this.zoom = zoom;
      this.callback = callback;
      this.canvas = new Canvas(this.size, this.size);
      this.ctx = this.canvas.getContext('2d');
      this.offset = {
        top: this.y * this.size,
        left: this.x * this.size
      };
    }

    Tile.prototype.x = null;

    Tile.prototype.y = null;

    Tile.prototype.zoom = null;

    Tile.prototype.callback = null;

    Tile.prototype.canvas = null;

    Tile.prototype.ctx = null;

    Tile.prototype.offset = null;

    Tile.prototype.ways = null;

    Tile.prototype.size = 256;

    Tile.prototype.earthRadius = 6378137;

    Tile.prototype.minLat = -85.05112878;

    Tile.prototype.maxLat = 85.05112878;

    Tile.prototype.minLng = -180;

    Tile.prototype.maxLng = 180;

    Tile.prototype.drawingError = function(err) {
      if (err) throw err;
    };

    Tile.prototype.query = function() {};

    Tile.prototype.boundaries = function() {
      return {
        upperLeft: this.pixelToLatLng(this.x * this.size, this.y * this.size),
        lowerRight: this.pixelToLatLng((this.x + 1) * this.size, (this.y + 1) * this.size)
      };
    };

    Tile.prototype.mapsize = function() {
      return this.size << this.zoom;
    };

    Tile.prototype.pixelOnTile = function(lat, lng) {
      var absolute;
      absolute = this.latLngToPixel(lat, lng);
      return {
        x: absolute.x - this.offset.left,
        y: absolute.y - this.offset.top
      };
    };

    Tile.prototype.pixelToLatLng = function(pixelX, pixelY) {
      var latitude, longitude, mapSize, x, y;
      mapSize = this.mapsize();
      x = (this.clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5;
      y = 0.5 - (this.clip(pixelY, 0, mapSize - 1) / mapSize);
      latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
      longitude = 360 * x;
      return {
        lat: latitude,
        lng: longitude
      };
    };

    Tile.prototype.latLngToPixel = function(lat, lng) {
      var mapSize, sinLat, x, y;
      lat = this.clip(lat, this.minLat, this.maxLat);
      lng = this.clip(lng, this.minLng, this.maxLng);
      x = (lng + 180) / 360;
      sinLat = Math.sin(lat * Math.PI / 180);
      y = 0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI);
      mapSize = this.mapsize();
      return {
        x: Math.round(this.clip(x * mapSize + 0.5, 0, mapSize - 1)),
        y: Math.round(this.clip(y * mapSize + 0.5, 0, mapSize - 1))
      };
    };

    Tile.prototype.clip = function(value, min, max) {
      return Math.min(Math.max(value, min), max);
    };

    return Tile;

  })();

  module.exports = Tile;

}).call(this);
