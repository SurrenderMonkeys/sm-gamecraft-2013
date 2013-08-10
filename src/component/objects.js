var Game = window.Game || {},
    Collidable;

Game.Collidable = Collidable = (function() {

  function Collidable(name, spriteComponent, position) {
    if (position == null) {
      position = {
        x: 0,
        y: 0
      };
    }

    Crafty.c(name, {
      x: position.x,
      y: position.y,
      init: function() {
        return this.addComponent(spriteComponent);
      }
    });
  }

  return Collidable;
})();
