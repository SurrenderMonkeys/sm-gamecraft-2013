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
        })
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
        this.requires('2D, Canvas, Grid, Color, Solid')
          .color('#000');
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

    Game.components();

    Game.obstacles = ["Wall","Boundary"];
    Game.evilComponents = ["Alien","Shot"];
    Game.collectables = ["Bitcoin"];
    Game.lives = ["Coffee"];


    Crafty.viewport.init(600, 400);

    // The following code sets up our scene

    Crafty.scene("game", function () { // the scene is called "game"
        var playerStart = { x: 300, y: 200, z:5 };
        // set background
        Crafty.background("#FFF"); // this sets the background to a static image

        // make player entity
       Game.createPlayerComponent(playerStart);

        // create boundaries
        Crafty.e("2D, Canvas, Boundaries");

        Crafty.e("2D, Canvas, Bitcoins");

        Crafty.e("2D, Canvas, Coffee");

        Game.createAlienComponent();
        Game.createFreedomCorpComponent().attr({x:200,y:300});

        Crafty.e("2D, Canvas, Wall");


    }); // end of Crafty.scene function definition for "game" scene

    //We just defined the game scene, now we need to tell crafty to run that scene on the stage
    Crafty.scene("game");

    // The result of all of this should be a simple space invaders game
}
