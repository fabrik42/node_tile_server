(function() {
  var Heat, HeatmapTile, Tile, async, pg, settings;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  async = require('async');

  Heat = require('heatmap');

  Tile = require('../../tile');

  pg = require('pg');

  settings = require('../../settings').heatmap;

  HeatmapTile = (function() {

    __extends(HeatmapTile, Tile);

    function HeatmapTile(x, y, zoom, callback) {
      this.x = x;
      this.y = y;
      this.zoom = zoom;
      this.callback = callback;
      HeatmapTile.__super__.constructor.call(this, this.x, this.y, this.zoom, this.callback);
      this.heat = Heat(this.canvas, {
        radius: 10
      });
    }

    HeatmapTile.prototype.query = function() {
      return pg.connect(settings.postgres, this.onConnect.bind(this));
    };

    HeatmapTile.prototype.onConnect = function(err, client) {
      var boundaries, query;
      boundaries = this.boundaries();
      query = client.query({
        text: this.statement,
        values: [boundaries.upperLeft.lat, boundaries.upperLeft.lng, boundaries.lowerRight.lat, boundaries.lowerRight.lng],
        name: 'waypoints'
      });
      query.on('row', this.row.bind(this));
      query.on('end', this.ready.bind(this));
      return query.on('error', function(error) {
        if (error) throw error;
      });
    };

    HeatmapTile.prototype.row = function(waypoint) {
      var geo, pixel;
      geo = JSON.parse(waypoint.geo_json).coordinates;
      pixel = this.pixelOnTile(geo[1], geo[0]);
      return this.heat.addPoint(pixel.x, pixel.y, {
        weight: 0.04
      });
    };

    HeatmapTile.prototype.ready = function() {
      this.heat.draw();
      return this.callback();
    };

    HeatmapTile.prototype.statement = ["SELECT", "ST_AsGeoJSON(", settings.query.column, ", 8) as geo_json", "FROM ", "waypoints", "WHERE ", "ST_Contains(", "ST_SetSRID(ST_MakeBox2D(ST_Point($2, $1), ST_Point($4, $3)),4326),", settings.query.table, ".", settings.query.column, ");"].join(' ');

    return HeatmapTile;

  })();

  module.exports = HeatmapTile;

}).call(this);
