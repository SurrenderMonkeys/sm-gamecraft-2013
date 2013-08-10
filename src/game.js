Game = window.Game || {};

Game.width = 1200;
Game.height = 800;
Game.tile_width = 20;
Game.tile_height = 25;

Game.loadSprites = function(){

    Crafty.sprite(20,25, "./web/images/snowden.png", { // player base
        PlayerPic: [0,0]
    },2);

    Crafty.sprite(1, "./web/images/wall.png", {
        WallPic : [0,0,70,70]
    });

    Crafty.sprite(1, "./web/images/alien.png", {
        AlienPic: [0,0,60,57]
    });

    Crafty.sprite(1, "./web/images/shot.png", {	// player shots
        ShotPic: [0,0,12,17]
    });

    Crafty.sprite(1, "./web/images/bit.png", {
        BitsPic: [0,0,15,16]
    });

    Crafty.sprite(1,"./web/images/Heart.png",{
        HeartPic : [0,0,8,7]
    });

    Crafty.sprite(1,"./web/images/Skull.png",{
        SkullPic : [0,0,57,17]
    });
};

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

    Game.components();

    Game.obstacles = ["Wall","Boundary"];
    Game.evilComponents = ["Alien","Shot"];


    Crafty.viewport.init(600, 400);

    Crafty.c("Heart", {init: function(){this.addComponent("HeartPic");}})
    Crafty.c("Skull", {init: function(){this.addComponent("SkullPic");}})


    // Player component - for handling moving player on screen
    Crafty.c("Snowden", {
        dx: 0, // setting initial vertical speed - note variables are set differently here

        init: function() {
            var that = this;
            this.bind("EnterFrame",this.handlebase); // bind the EnterFrame event to the "handlebase" function below
            this.bind("KeyDown",this.handlekey); // bind the EnterFrame event to the "handlebase" function below

            this.addComponent("PlayerPic"); // add the player picture to this entity
            this.addComponent("Collision");
            this.addComponent("Fourway");
            this.fourway(4,0);

            //setup die collisions
            _.each(Game.evilComponents, function(componentName){
                that.onHit(componentName, function(collidingComponent){
                    that.heartBar.pop().destroy();

                    if(that.heartBar.length<=0){
                        Crafty.e("2D, Canvas, Skull").attr({x:that.x+8,y:that.y+5,z:that.z-3});
                        that.destroy();
                    }

                    that.x = 21;
                    that.y = 26;

                });
            });

            //setup obstacle collisions
            _.each(Game.obstacles, function(componentName){
                that.onHit(componentName, function(collidingComponent){
                    if (!this.colliding) {
                        var player = this ,
                            origin = {
                                x: player.x - player._movement.x * 1.1 ,
                                y: player.y - player._movement.y * 1.1
                            };
                        this.colliding = true;
                        setTimeout(function () {
                            player.x = origin.x;
                            player.y = origin.y;
                            player.colliding = false;
                        }, 10);
                    }
                });
            });

            this.heartBar = [Crafty.e("2D, Canvas, Heart"),
                Crafty.e("2D, Canvas, Heart"),
                Crafty.e("2D, Canvas, Heart")
            ];
            this.heartBarOffset = {x: -8, y:-8};

        },
        handlebase: function() { // runs every frame
            var that = this;
            Crafty.viewport.scroll('_x', -(this.x + (this.w / 2) - (Crafty.viewport.width / 2) ));
            Crafty.viewport.scroll('_y', -(this.y + (this.h / 2) - (Crafty.viewport.height / 2) ));

            _.each(this.heartBar,function(element,index){
                element.x = that.x + index * 8 + that.heartBarOffset.x + that._movement.x;
                element.y = that.y + that.heartBarOffset.y + that._movement.y;
                element.z = that.z + 1;
            });
        },
        handlekey: function(keyevent) { // handles key events
            if(keyevent.keyCode === Crafty.keys.SPACE) { // they hit space
                Crafty.e("2D, Canvas, Shot").attr({x:this.x+34, y:500, z:1}); // create a shot at our current position
            }
        }
    });

    Crafty.c("Wall",{
        x:200,
        y:200,
        init: function(){
            this.addComponent("WallPic");
        }
    });

    Crafty.c("Boundaries", {
        init: function() {
            for (var x = 0; x < Game.width/Game.tile_width; x++) {
                for (var y = 0; y < Game.height/Game.tile_height; y++) {
                    var at_edge = x == 0 || x == (Game.width/Game.tile_width -1) || y == 0 || y == (Game.height/Game.tile_height - 1);
                    if (at_edge) {
                        Crafty.e('Boundary').at(x, y);
                    }
                }
            }
        }
    });

    // Shot component - for handling shots
    Crafty.c("Shot", {
        dy: 0, // setting initial vertical speed - note variables are set differently here

        init: function() {  // init function is automatically run when entity with this component is created
            this.bind("EnterFrame",this.handleshot); // bind the EnterFrame event to the "handleshot" function below
            this.addComponent("ShotPic"); // add the picture to this entity
        },
        handleshot: function() { // happens every frame
            this.y -= 5; // move up
            if (this.y < -10) this.destroy(); // kill the shot if it goes offscreen
        }
    }); // end of Shot component

    // Alien component - for handling aliens
    Crafty.c("Alien", {
        y: -100, // setting initial vertical speed - note variables are set differently here
        x: 50,
        z:3,
        dx: 6,

        init: function() {  // init function is automatically run when entity with this component is created
            this.bind("EnterFrame",this.handlealien); // bind the EnterFrame event to the "handlealien" function below
            this.addComponent("AlienPic"); // add the picture to this entity

            this.addComponent("Collision"); // add the collision component
            this.onHit("Shot",this.gotshot); // set up a function to call if we get hit by a shot
        },
        handlealien: function() { // happens every frame

            this.y += (100-this.y)*0.05;  // descend toward y=100

            this.y += Crafty.math.randomInt(-1,1); // add a small random component to y position - ship could move -1, 0, or 1

            this.x += this.dx; // move according to speed

            if (this.x < 5) { // hit left side
                this.x = 5; // stop
                this.dx = 6; // move rightward now
            }
            if (this.x > 535) { // hit right side
                this.x = 535; // stop
                this.dx = -6; // move leftward now
            }
        },
        gotshot: function() { //happens when we get hit by a shot

            // create explosion pieces
            for (i=0;i<20;i++) { // create a bunch of chunks
                Crafty.e("2D, Canvas, Bits").attr({x:this.x + 22, y:this.y + 21, z:6});
            }

            // get rid of us - but with trickery
            this.y -= 2500; // bump up off screen - it will look like we disappear, but we'll come back

        }

    }); // end of alien component

    // Bits component - for handling Bitss
    Crafty.c("Bits", {
        init: function() {  // init function is automatically run when entity with this component is created

            this.bind("EnterFrame",this.handleBits); // bind the EnterFrame event to the "handleBits" function below
            this.addComponent("BitsPic"); // add the picture to this entity

            // set up some random movement and spin for this bit
            this.dx = Crafty.math.randomInt(-150,150)/20.0; // random dx and dy so it'll move
            this.dy = Crafty.math.randomInt(-150,150)/20.0;
            this.rotation = Crafty.math.randomInt(0,359); // rotation
            this.rotspeed = Crafty.math.randomInt(-50,50)/10.0; // rotation speed
        },
        handleBits: function() { // happens every frame
            // move the bit
            this.x += this.dx;
            this.y += this.dy;

            this.rotation += this.rotspeed; // rotate the bit according to its speed

            this.dy += 0.5; // apply gravity

            if (this.y > 600) this.destroy(); // kill the bit if it goes offscreen
        }
    }); // end of Bits component


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
