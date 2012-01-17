LineString = require('../../shapes').LineString

class Street extends LineString

  options:
    background:
      strokeStyle: '#3A3A3A'
      lineWidth: 7
    foreground:
      strokeStyle: '#EAEAEA'
      lineWidth: 5

  drawBg: (ctx) ->
    @_draw ctx, @options.background

  draw: (ctx) ->
    @_draw ctx, @options.foreground

  _draw: (ctx, options) ->
    return if !@pixels.length

    ctx.strokeStyle = options.strokeStyle
    ctx.lineWidth = options.lineWidth
    ctx.lineJoin = 'round'
    ctx.beginPath()

    ctx.moveTo @pixels[0][0], @pixels[0][1]

    @pixels.slice(1).forEach (pixel) ->
      ctx.lineTo pixel[0], pixel[1]

    ctx.stroke()

  drawLabel: (ctx) ->

module.exports = Street