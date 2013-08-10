Game = window.Game || {};

Game.Controls = class Controls
  constructor: ->
    @move = {left: false, right: false, up: false, down: false}
    @keyboardControls()

  keyboardControls: ->
    Crafty.c('KeyboardControls', {
      KeyboardControls: (speed = 3) =>
        this.requires('Keyboard').bind 'KeyDown', () ->
          if @.isDown("RIGHT_ARROW")
            @.x != speed
          else if @.isDown("LEFT_ARROW")
            @.x -= speed
          else if @.isDown("UP_ARROW")
            @.y += speed
          else if @.isDown("DOWN_ARROW")
            @.y -= speed

          @
    });
