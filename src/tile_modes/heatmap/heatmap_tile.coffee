async     = require 'async'
Heat      = require 'heatmap'
Tile      = require '../../tile'
pg        = require 'pg'
settings  = require('../../settings').heatmap

class HeatmapTile extends Tile

  constructor: (@x, @y, @zoom, @callback) ->
    super @x, @y, @zoom, @callback
    @heat = Heat @canvas, radius : 10

  query: () ->
    pg.connect settings.postgres, @onConnect.bind(this)

  onConnect: (err, client) ->
    boundaries = @boundaries()

    query = client.query
      text: @statement,
      values: [
        boundaries.upperLeft.lat,
        boundaries.upperLeft.lng,
        boundaries.lowerRight.lat,
        boundaries.lowerRight.lng
      ],
      name: 'waypoints'

    query.on 'row', @row.bind this

    query.on 'end', @ready.bind this

    query.on 'error', (error) ->
      throw error if error

  row: (waypoint) ->
    geo   = JSON.parse(waypoint.geo_json).coordinates
    pixel = @pixelOnTile geo[1], geo[0]

    @heat.addPoint pixel.x, pixel.y, weight: 0.04

  ready: () ->
    @heat.draw()
    @callback()

  statement: [
    "SELECT",
      #"*,",
      "ST_AsGeoJSON(", settings.query.column, ", 8) as geo_json",
    "FROM ",
      "waypoints",
    "WHERE ",
      "ST_Contains(",
        "ST_SetSRID(ST_MakeBox2D(ST_Point($2, $1), ST_Point($4, $3)),4326),",
        settings.query.table, ".", settings.query.column,
      ");"
    ].join ' '

module.exports = HeatmapTile