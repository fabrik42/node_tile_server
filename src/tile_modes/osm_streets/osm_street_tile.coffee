async         = require 'async'
Tile          = require '../../tile'
WayCollection = require './way_collection'

class OsmStreetTile extends Tile
  
  query: () ->
    @ways = new WayCollection(this, this.dataReady.bind(this));

  dataReady: (err, shapes) ->
    throw err if err

    tile = this
  
    async.forEach this.ways.shapes, (shape, done) ->
      shape.drawBg tile.ctx
      done()
    , this.drawingError

    async.forEach this.ways.shapes, (shape, done) ->
      shape.draw tile.ctx
      done()
    , this.drawingError

    this.callback()
    
module.exports = OsmStreetTile  