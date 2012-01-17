(function() {
  var Street, WayCollection, pg, settings;

  pg = require('pg');

  Street = require('./street');

  settings = require('../../settings').osm_streets;

  WayCollection = (function() {

    function WayCollection(tile, callback) {
      this.tile = tile;
      this.callback = callback;
      this.shapes = [];
      pg.connect(settings.postgres, this.queryShapes.bind(this));
    }

    WayCollection.prototype.shapes = null;

    WayCollection.prototype.tile = null;

    WayCollection.prototype.callback = null;

    WayCollection.prototype.queryShapes = function(err, client) {
      var boundaries, collection, query;
      boundaries = this.tile.boundaries();
      collection = this;
      query = client.query({
        text: collection.statement,
        values: [boundaries.upperLeft.lat, boundaries.upperLeft.lng, boundaries.lowerRight.lat, boundaries.lowerRight.lng],
        name: 'ways_in_boundaries'
      });
      query.on('row', collection.createShape.bind(collection));
      query.on('end', (function() {
        return collection.callback(null, collection.shapes);
      }).bind(collection));
      return query.on('error', function(error) {
        if (error) throw error;
      });
    };

    WayCollection.prototype.createShape = function(row) {
      var geoJson, shape, shapeType;
      geoJson = JSON.parse(row.geo_json);
      shapeType = this.shapeByType[row.street_type];
      if (!shapeType) return;
      shape = new shapeType({
        coordinates: geoJson.coordinates,
        label: row.street_name,
        type: row.street_type,
        shape: geoJson.type,
        tile: this.tile
      });
      return this.shapes.push(shape);
    };

    WayCollection.prototype.shapeByType = {
      motorway: Street,
      motorway_link: Street,
      trunk: Street,
      trunk_link: Street,
      primary: Street,
      primary_link: Street,
      secondary: Street,
      secondary_link: Street,
      tertiary: Street,
      residential: Street,
      unclassified: Street,
      road: Street,
      living_street: Street,
      service: Street
    };

    WayCollection.prototype.statement = ["SELECT", "tags->'name' as street_name,", "tags->'highway' as street_type,", "ST_AsGeoJSON(linestring, 8) as geo_json,", "*", "FROM ", "ways ", "WHERE ", "tags ? 'highway' ", "AND ", "ST_Intersects(", "ST_SetSRID(ST_MakeBox2D(ST_Point($2, $1), ST_Point($4, $3)),4326),", "linestring", ");"].join(' ');

    return WayCollection;

  })();

  module.exports = WayCollection;

}).call(this);
