(function() {
  var HeatmapTile, OsmStreetTile, express, getTile, server;

  express = require('express');

  server = express.createServer();

  OsmStreetTile = require('./tile_modes/osm_streets').OsmStreetTile;

  HeatmapTile = require('./tile_modes/heatmap').HeatmapTile;

  server.configure(function() {
    server.use(express.static(__dirname + '/../examples'));
    return server.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  getTile = function(Tile, req, res) {
    var onTileReady, tile, x, y, zoom;
    onTileReady = function(err) {
      if (err) throw err;
      res.contentType('image/png');
      res.send(this.canvas.toBuffer());
      return console.log('Rendered tile: x: %s y: %s zoom: %s', x, y, zoom);
    };
    x = req.params.x;
    y = req.params.y;
    zoom = req.params.zoom;
    tile = new Tile(x, y, zoom, onTileReady);
    return tile.query();
  };

  server.get('/tiles/osm_streets/:zoom/:x/:y', function(req, res) {
    return getTile(OsmStreetTile, req, res);
  });

  server.get('/tiles/heatmap/:zoom/:x/:y', function(req, res) {
    return getTile(HeatmapTile, req, res);
  });

  server.listen(3000);

  console.log('Express server listening on port %d, environment: %s', server.address().port, server.settings.env);

}).call(this);
