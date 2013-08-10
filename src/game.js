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


    Crafty.viewport.init(600, 400);

    // The following code sets up our scene

    Crafty.scene("game", function () { // the scene is called "game"
        var playerStart = { x: 300, y: 200, z:5 };
        // set background
        Crafty.background("#FFF"); // this sets the background to a static image

        // make player entity
        Crafty.e("2D, Canvas, SpriteAnimation, Snowden")
            .attr(playerStart)
            .animate('walk_up', 0, 0, 1)
            .animate('walk_up', [[0,0], [1,0], [2,0]])
            // .animate('walk_up',12, -1)
            .animate('walk_right', 0, 0, 1)
            .animate('walk_right', [[3,0], [4,0], [5,0]])
            // .animate('walk_right',12, -1)
            .animate('walk_down', 0, 0, 1)
            .animate('walk_down', [[6,0], [7,0], [8,0]])
            // .animate('walk_down',12, -1)
            .animate('walk_left', 0, 0, 1)
            .animate('walk_left', [[9,0], [10,0], [11,0]])
            // .animate('walk_left',12, -1)
            .bind("KeyDown", function(e) {
                if(e.keyCode === Crafty.keys.LEFT_ARROW || e.keyCode === Crafty.keys.A) {
                    if(!this.isPlaying("walk_left"))
                        this.stop().animate("walk_left", 12, -1);
                } else if(e.keyCode === Crafty.keys.RIGHT_ARROW || e.keyCode === Crafty.keys.D) {
                    if(!this.isPlaying("walk_right"))
                        this.stop().animate("walk_right", 12, -1);
                } else if(e.keyCode === Crafty.keys.UP_ARROW || e.keyCode === Crafty.keys.W) {
                    if(!this.isPlaying("walk_up"))
                        this.stop().animate("walk_up", 12, -1);
                } else if(e.keyCode === Crafty.keys.DOWN_ARROW || e.keyCode === Crafty.keys.S) {
                    if(!this.isPlaying("walk_down"))
                        this.stop().animate("walk_down", 12, -1);
                }
            }).bind("KeyUp", function(e) {
                this.stop();
            });

        // create boundaries
        Crafty.e("2D, Canvas, Boundaries");

        // make alien entity (coordinates are set in component's init function)
        Crafty.e("2D, Canvas, Alien");

        Crafty.e("2D, Canvas, Wall");


    }); // end of Crafty.scene function definition for "game" scene

    //We just defined the game scene, now we need to tell crafty to run that scene on the stage
    Crafty.scene("game");

    // The result of all of this should be a simple space invaders game
}
