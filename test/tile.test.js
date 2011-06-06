var Tile = require('../src/tile.js'),
    // somewhere in dieburg...
    t = new Tile(8594, 5563, 14, function(err){});

module.exports = {

  "size is 256": function(test) {
      test.equal(t.size, 256);
      test.done();
  },

  "mapsize": function(test) {
      test.equal(t.mapsize(), 4194304); // see http://msdn.microsoft.com/en-us/library/bb259689.aspx
      test.done();
  },

  "latLngToPixel": function(test) {
      // oxford circus in london x: 8185, y: 5447, z: 14
      var t = new Tile(8185, 5447, 14, function(err){}),
          // northpole
          upperLeft =  t.latLngToPixel(51.52241608253253,  -0.15380859375),
          round = Math.round;

      // some rounding errors are ok, but 10px accuracy would be nice
      test.equal(round(upperLeft.x / 10), round(8185 * 256 / 10));
      test.equal(round(upperLeft.y / 10), round(5447 * 256 / 10));
      test.done();
  },

  "pixelToLatLng": function(test) {
      // oxford circus in london x: 8185, y: 5447, z: 14
      var t = new Tile(8185, 5447, 14, function(err){}),
          upperLeft =  t.pixelToLatLng(8185 * 256, 5447 * 256);

      test.equal(upperLeft.lat.toFixed(3), (51.522).toFixed(3));
      test.equal(upperLeft.lng.toFixed(3), (-0.154).toFixed(3));
      test.done();
  },

  "boundaries": function(test) {
      var boundaries = t.boundaries();

      test.equal(boundaries.upperLeft.lat.toFixed(3), (49.9087).toFixed(3));
      test.equal(boundaries.upperLeft.lng.toFixed(3),   (8.833).toFixed(3));
      test.equal(boundaries.lowerRight.lat.toFixed(3), (49.895).toFixed(3));
      test.equal(boundaries.lowerRight.lng.toFixed(3),  (8.855).toFixed(3));
      test.done();
  },

  "clip": function(test) {
      test.equal(t.clip(50, 10, 100), 50);
      test.equal(t.clip(10, 50, 100), 50);
      test.equal(t.clip(100, 10, 50), 50);
      test.done();
  }

}