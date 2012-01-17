(function() {
  var OsmStreetTile, Tile, WayCollection, async;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  async = require('async');

  Tile = require('../../tile');

  WayCollection = require('./way_collection');

  OsmStreetTile = (function() {

    __extends(OsmStreetTile, Tile);

    function OsmStreetTile() {
      OsmStreetTile.__super__.constructor.apply(this, arguments);
    }

    OsmStreetTile.prototype.query = function() {
      return this.ways = new WayCollection(this, this.dataReady.bind(this));
    };

    OsmStreetTile.prototype.dataReady = function(err, shapes) {
      var tile;
      if (err) throw err;
      tile = this;
      async.forEach(this.ways.shapes, function(shape, done) {
        shape.drawBg(tile.ctx);
        return done();
      }, this.drawingError);
      async.forEach(this.ways.shapes, function(shape, done) {
        shape.draw(tile.ctx);
        return done();
      }, this.drawingError);
      return this.callback();
    };

    return OsmStreetTile;

  })();

  module.exports = OsmStreetTile;

}).call(this);
