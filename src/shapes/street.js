module.exports = (function(){

Street = function(options) {
  this.initialize(options);
};

Street.prototype = new LineString();

Street.prototype.options = {
  background: {
    strokeStyle: '#3A3A3A',
    lineWidth: 7
  },
  foreground: {
    strokeStyle: '#EAEAEA',
    lineWidth: 5
  }
};

Street.prototype.drawBg = function(ctx) {
  this._draw(ctx, this.options.background);
};

Street.prototype.draw = function(ctx) {
  this._draw(ctx, this.options.foreground);
};

Street.prototype._draw = function(ctx, options) {
  if(!this.pixels.length) return;

  ctx.strokeStyle = options.strokeStyle;
  ctx.lineWidth = options.lineWidth;
  ctx.lineJoin = 'round';
  ctx.beginPath();

  ctx.moveTo(this.pixels[0][0], this.pixels[0][1]);
  this.pixels.slice(1).forEach(function(pixel){
    ctx.lineTo(pixel[0], pixel[1]);
  });
  ctx.stroke();
};

Street.prototype.drawLabel = function(ctx) {};

return Street;

})();