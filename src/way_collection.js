var shapes = require(__dirname+'/shapes'),
    pg = require('pg'),
    settings = require(__dirname+'/settings');

module.exports = (function(){

WayCollection = function(tile, callback) {
  this.shapes  = [];
  this.tile = tile;
  this.callback = callback;

  pg.connect(settings.postgres, this.queryShapes.bind(this));
};

WayCollection.prototype.shapes = null;
WayCollection.prototype.tile = null;
WayCollection.prototype.callback = null;

WayCollection.prototype.queryShapes = function(err, client) {
  
  var boundaries = this.tile.boundaries(),
      collection = this;  
  
  var query = client.query({
    text: collection.statement,
    values: [
      boundaries.upperLeft.lat,
      boundaries.upperLeft.lng,
      boundaries.lowerRight.lat,
      boundaries.lowerRight.lng
    ],
    name: 'ways_in_boundaries'
  });

  query.on('row', collection.createShape.bind(collection));

  query.on('end', (function() {
    collection.callback(null, collection.shapes);
  }).bind(collection));

  query.on('error', function(error) {
    if(error) throw error;
  });  
};

WayCollection.prototype.createShape = function(row) {
  var geoJson = JSON.parse(row.geo_json),
      shapeType = this.shapeByType[row.street_type];

  if(!shapeType) {
    //console.info("Couldn't find shape for way type %s", row.street_type);
    return;
  }

  var shape = new shapeType({
    coordinates: geoJson.coordinates,
    label:       row.street_name,
    type:        row.street_type,
    shape:       geoJson.type,
    tile:        this.tile
  });

  this.shapes.push(shape);
};

// see http://wiki.openstreetmap.org/wiki/DE:Map_Features
WayCollection.prototype.shapeByType = {
  motorway:       shapes.Street,
  motorway_link:  shapes.Street,
  trunk:          shapes.Street,
  trunk_link:     shapes.Street,
  primary:        shapes.Street,
  primary_link:   shapes.Street,
  secondary:      shapes.Street,
  secondary_link: shapes.Street,
  tertiary:       shapes.Street,
  residential:    shapes.Street,
  unclassified:   shapes.Street,
  road:           shapes.Street,
  living_street:  shapes.Street,
  service:        shapes.Street
  // track
  // pedestrian
  // raceway
  // services
  // bus_guideway
  // path
  // cycleway
  // footway
  // bridleway
  // byway
  // steps
};

WayCollection.prototype.statement = [
  "SELECT",
    "tags->'name' as street_name,",
    "tags->'highway' as street_type,",
    "ST_AsGeoJSON(linestring, 8) as geo_json,",
    "*",
  "FROM ",
    "ways ",
  "WHERE ",
    "tags ? 'highway' ",
  "AND ",
    "ST_Intersects(",
      "ST_SetSRID(ST_MakeBox2D(ST_Point($2, $1), ST_Point($4, $3)),4326),",
       "linestring",
    ");"
].join(' ');

return WayCollection;

})();