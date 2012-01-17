pg        = require 'pg'
Street    = require './street'
settings  = require('../../settings').osm_streets

class WayCollection

  constructor: (@tile, @callback) ->
    @shapes  = []
    pg.connect settings.postgres, @queryShapes.bind(this)

  shapes: null

  tile: null

  callback: null

  queryShapes: (err, client) ->

    boundaries = @tile.boundaries()
    collection = this

    query = client.query
      text: collection.statement,
      values: [
        boundaries.upperLeft.lat,
        boundaries.upperLeft.lng,
        boundaries.lowerRight.lat,
        boundaries.lowerRight.lng
      ],
      name: 'ways_in_boundaries'

    query.on 'row', collection.createShape.bind(collection)

    query.on 'end', (() ->
      collection.callback null, collection.shapes
    ).bind collection

    query.on 'error', (error) ->
      throw error if error

  createShape: (row) ->
    geoJson = JSON.parse row.geo_json
    shapeType = this.shapeByType[row.street_type]

    if !shapeType
      #console.info "Couldn't find shape for way type %s", row.street_type
      return

    shape = new shapeType
      coordinates: geoJson.coordinates,
      label:       row.street_name,
      type:        row.street_type,
      shape:       geoJson.type,
      tile:        this.tile

    this.shapes.push shape

  # see http://wiki.openstreetmap.org/wiki/DE:Map_Features
  shapeByType:
    motorway:       Street,
    motorway_link:  Street,
    trunk:          Street,
    trunk_link:     Street,
    primary:        Street,
    primary_link:   Street,
    secondary:      Street,
    secondary_link: Street,
    tertiary:       Street,
    residential:    Street,
    unclassified:   Street,
    road:           Street,
    living_street:  Street,
    service:        Street
    # track
    # pedestrian
    # raceway
    # services
    # bus_guideway
    # path
    # cycleway
    # footway
    # bridleway
    # byway
    # steps

  statement: [
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
  ].join ' '

module.exports = WayCollection