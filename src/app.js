var http = require('http'),
    express = require('express'),
    app = express.createServer(),
    Tile = require(__dirname+'/tile');

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/tiles/:zoom/:x/:y', function(req, res){

  var onTileReady = function(err) {
    if(err) throw err;

    res.contentType('image/png');
    res.send(this.canvas.toBuffer());
    console.log('Rendered tile: x: %s y: %s zoom: %s', x, y, zoom);
  };

  var x = req.params.x,
      y = req.params.y,
      zoom = req.params.zoom,
      tile = new Tile(x, y, zoom, onTileReady);
});

app.listen(3000);

console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);