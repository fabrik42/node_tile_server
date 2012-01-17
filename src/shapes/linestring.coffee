class LineString

  constructor: (options) ->
    ls = this
    @attrAccessible.forEach (attr) ->
      ls[attr] = options[attr]

    @calculatePixels()

  coordinates: null

  type: null

  label: null

  shape: null

  tile: null

  attrAccessible: [
    'coordinates',
    'label',
    'type',
    'shape',
    'tile'
  ]

  calculatePixels: () ->
    @pixels = []

    ls = this
    o  = @tile.offset

    @coordinates.forEach (coordinate) ->
      # ATTENTION: lat/lng is in reverse order in the coordinates array!
      p = ls.tile.latLngToPixel coordinate[1], coordinate[0]
      ls.pixels.push [ p.x - o.left, p.y  - o.top ]

  clip: () ->

  drawBg: (ctx) ->

  draw: (ctx) ->

  drawLabel: (ctx) ->

module.exports = LineString