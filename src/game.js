Game = window.Game || {};

Game.width = 1200;
Game.height = 800;
Game.tile_width = 20;
Game.tile_height = 25;

Game.components = function(){
    Crafty.c('Grid', {
      init: function() {
        this.attr({

          w: Game.tile_width,
          h: Game.tile_height
        });
        this.addComponent("WallPic");
      },

      // Locate this entity at the given position on the grid
      at: function(x, y) {
        if (x === undefined && y === undefined) {
          return { x: this.x/Game.tile_width, y: this.y/Game.tile_height }
        } else {
          this.attr({ x: x * Game.tile_width, y: y * Game.tile_height });
          return this;
        }
      }
    });

    Crafty.c('Boundary', {
      init: function() {
        this.requires('2D, Canvas, Grid')
      }
    });
};

Game.setupEngine = function () {
    //start crafty with a 600x600 active display area or "stage"
    Crafty.init(Game.width, Game.height);

    // Loading sprites (graphic images)
    Game.loadSprites();
    Game.setupEnvironmentComponents();
    Game.setupPlayerComponent();
    Game.setupEnemyComponents();
    Game.setupScore();

    Game.components();

    Game.obstacles = ["Wall","Boundary"];
    Game.evilComponents = ["Shot","FreedomCorp"];

    Crafty.viewport.init(600, 400);

    // The following code sets up our scene

    Crafty.scene("game", function () { // the scene is called "game"
        Game.playerStart = { x: 100, y: 50, z:5 };
        // set background
        Crafty.background("#FFF"); // this sets the background to a static image

        // make player entity

       Game.snowden = Game.createPlayerComponent(Game.playerStart);

        // create boundaries
        Crafty.e("2D, Canvas, Boundaries");
        Crafty.e("2D, Canvas, Streets");
        Crafty.e("2D, Canvas, Bitcoins");
        Crafty.e("2D, Canvas, Coffee");
        Crafty.e("2D, Canvas, Documents");

        //Game.createAlienComponent();
        Game.createFreedomCorpComponent().attr({x:320,y:200});

        Crafty.e("2D, Canvas, Guardian");

        Crafty.e("2D, Canvas, Wall");

    }); // end of Crafty.scene function definition for "game" scene

    //We just defined the game scene, now we need to tell crafty to run that scene on the stage
    Crafty.scene("game");

    // The result of all of this should be a simple space invaders game
}

Game.animateMoveElement = function(element,e){
    if(e.keyCode === Crafty.keys.LEFT_ARROW || e.keyCode === Crafty.keys.A) {
        element.stop().animate("walk_left", 12, -1);
    } else if(e.keyCode === Crafty.keys.RIGHT_ARROW || e.keyCode === Crafty.keys.D) {
        element.stop().animate("walk_right", 12, -1);
    } else if(e.keyCode === Crafty.keys.UP_ARROW || e.keyCode === Crafty.keys.W) {
        element.stop().animate("walk_up", 12, -1);
    } else if(e.keyCode === Crafty.keys.DOWN_ARROW || e.keyCode === Crafty.keys.S) {
        element.stop().animate("walk_down", 12, -1);
    }
}
