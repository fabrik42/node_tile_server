(function() {
  var LineString, Street;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  LineString = require('../../shapes').LineString;

  Street = (function() {

    __extends(Street, LineString);

    function Street() {
      Street.__super__.constructor.apply(this, arguments);
    }

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
      return this._draw(ctx, this.options.background);
    };

    Street.prototype.draw = function(ctx) {
      return this._draw(ctx, this.options.foreground);
    };

    Street.prototype._draw = function(ctx, options) {
      if (!this.pixels.length) return;
      ctx.strokeStyle = options.strokeStyle;
      ctx.lineWidth = options.lineWidth;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(this.pixels[0][0], this.pixels[0][1]);
      this.pixels.slice(1).forEach(function(pixel) {
        return ctx.lineTo(pixel[0], pixel[1]);
      });
      return ctx.stroke();
    };

    Street.prototype.drawLabel = function(ctx) {};

    return Street;

  })();

  module.exports = Street;

}).call(this);
