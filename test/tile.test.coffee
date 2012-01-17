Tile = require('../lib/tile')

# somewhere in dieburg...
t = new Tile 8594, 5563, 14, (err)->

module.exports =
  "true is ok": (test) ->
    test.ok true
    test.done()

  "size is 256": (test) ->
    test.equal t.size, 256
    test.done()

  "mapsize": (test) ->
    #see http://msdn.microsoft.com/en-us/library/bb259689.aspx
    test.equal t.mapsize(), 4194304
    test.done()

  "latLngToPixel": (test) ->
    # oxford circus in london x: 8185, y: 5447, z: 14
    t = new Tile 8185, 5447, 14, (err) ->
    # northpole
    upperLeft =  t.latLngToPixel 51.52241608253253,  -0.15380859375
    round = Math.round

    # some rounding errors are ok, but 10px accuracy would be nice
    test.equal round(upperLeft.x / 10), round(8185 * 256 / 10)
    test.equal round(upperLeft.y / 10), round(5447 * 256 / 10)
    test.done()

  "pixelToLatLng": (test) ->
    # oxford circus in london x: 8185, y: 5447, z: 14
    t = new Tile 8185, 5447, 14, (err) ->
    upperLeft = t.pixelToLatLng 8185 * 256, 5447 * 256

    test.equal upperLeft.lat.toFixed(3), (51.522).toFixed(3)
    test.equal upperLeft.lng.toFixed(3), (-0.154).toFixed(3)
    test.done()

  "boundaries": (test) ->
      t = new Tile 8594, 5563, 14, (err)->
      boundaries = t.boundaries()
      
      test.equal boundaries.upperLeft.lat.toFixed(3), (49.9087).toFixed(3)
      test.equal boundaries.upperLeft.lng.toFixed(3),   (8.833).toFixed(3)
      test.equal boundaries.lowerRight.lat.toFixed(3), (49.895).toFixed(3)
      test.equal boundaries.lowerRight.lng.toFixed(3),  (8.855).toFixed(3)
      test.done()

  "clip": (test) ->
      test.equal(t.clip(50, 10, 100), 50)
      test.equal(t.clip(10, 50, 100), 50)
      test.equal(t.clip(100, 10, 50), 50)
      test.done()