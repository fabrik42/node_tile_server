Canvas = require 'canvas'

class Tile

  constructor: (@x, @y, @zoom, @callback) ->
    @canvas = new Canvas @size, @size
    @ctx = @canvas.getContext '2d'

    @offset =
      top:  @y * @size,
      left: @x * @size

  x: null

  y: null

  zoom: null

  callback: null

  canvas: null

  ctx: null

  offset: null

  ways: null

  # based on http://msdn.microsoft.com/en-us/library/bb259689.aspx
  size: 256

  earthRadius: 6378137

  minLat: -85.05112878

  maxLat: 85.05112878

  minLng: -180

  maxLng: 180

  drawingError: (err) ->
    throw err if err

  query: () ->

  boundaries: () ->
    upperLeft:  @pixelToLatLng(@x * @size, @y * @size),
    lowerRight: @pixelToLatLng((@x+1) * @size, (@y+1) * @size)

  mapsize: () ->
    @size << @zoom

  pixelOnTile: (lat, lng) ->
    absolute = @latLngToPixel lat, lng

    x: absolute.x - @offset.left
    y: absolute.y - @offset.top

  pixelToLatLng: (pixelX, pixelY) ->
    mapSize = @mapsize()
    x = (@clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5
    y = 0.5 - (@clip(pixelY, 0, mapSize - 1) / mapSize)
    latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI
    longitude = 360 * x

    lat: latitude,
    lng: longitude

  latLngToPixel: (lat, lng) ->
    lat = @clip(lat, @minLat, @maxLat)
    lng = @clip(lng, @minLng, @maxLng)

    x = (lng + 180) / 360
    sinLat = Math.sin(lat * Math.PI / 180)
    y = 0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)
    mapSize = @mapsize()

    x: Math.round(this.clip(x * mapSize + 0.5, 0, mapSize - 1)),
    y: Math.round(this.clip(y * mapSize + 0.5, 0, mapSize - 1))

  clip: (value, min, max) ->
    Math.min(Math.max(value, min), max);

module.exports = Tile