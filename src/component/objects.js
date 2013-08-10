var Game = window.Game || {},
    Collidable;

Game.Collidable = Collidable = (function() {

  function Collidable(name, componentList, position) {
    if (position == null) {
      position = {
        x: 0,
        y: 0
      };
    }

    if (componentList == null) {
      componentList = [];
    }

    Crafty.c(name, {
      x: position.x,
      y: position.y,
      init: function() {
        for (var i = componentList.length - 1; i >= 0; i--) {
          component = componentList[i];
          this.addComponent(component);
        }
      }
    });
  }

  return Collidable;
})();
