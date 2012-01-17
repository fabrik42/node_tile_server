express       = require 'express'
server        = express.createServer()
OsmStreetTile = require('./tile_modes/osm_streets').OsmStreetTile
HeatmapTile   = require('./tile_modes/heatmap').HeatmapTile

server.configure () ->
  server.use express.static(__dirname + '/../examples')
  server.use express.errorHandler({ dumpExceptions: true, showStack: true })

getTile = (Tile, req, res) ->
  onTileReady = (err) ->
    throw err if(err)

    res.contentType 'image/png'
    res.send this.canvas.toBuffer()
    console.log 'Rendered tile: x: %s y: %s zoom: %s', x, y, zoom

  x = req.params.x
  y = req.params.y
  zoom = req.params.zoom
  tile = new Tile x, y, zoom, onTileReady

  tile.query()

server.get '/tiles/osm_streets/:zoom/:x/:y', (req, res) ->
  getTile(OsmStreetTile, req, res)

server.get '/tiles/heatmap/:zoom/:x/:y', (req, res) ->
  getTile(HeatmapTile, req, res)

server.listen 3000

console.log 'Express server listening on port %d, environment: %s', server.address().port, server.settings.env