Game = {};

Game.loadSprites = function(){
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
};

Game.setupEngine = function () {

    //start crafty with a 600x600 active display area or "stage"
    Crafty.init(600, 600);

    // Loading sprites (graphic images)
    Game.loadSprites();

    Game.obstacles = ["Wall"];
    Game.evilComponents = ["Alien","Shot"];

    Crafty.sprite(1, "./web/images/player.png", { // player base
        PlayerPic: [0,0,57,71]
    });


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
                that.onHit(componentName, function(){
                    that.x = 0;
                    that.y = 0;
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
                        this.coliding = true;
                        setTimeout(function () {
                            player.x = origin.x;
                            player.y = origin.y;
                            player.colliding = false;
                        }, 10);
                    }
                });
            });

        },
        handlebase: function() { // runs every frame
            if (this.x < 0) this.x = 0; // stop left
            if (this.x > 520) this.x = 520; // stop right
            if (this.y < 0 ) this.y = 0;
            if(this.y>520) this.y= 520;
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

        // set background
        Crafty.background("#FFF"); // this sets the background to a static image

        // make player entity
        Crafty.e("2D, Canvas, Snowden").attr({ x: 300, y: 500, z:5 });

        // make alien entity (coordinates are set in component's init function)
        Crafty.e("2D, Canvas, Alien");

        Crafty.e("2D, Canvas, Wall");

    }); // end of Crafty.scene function definition for "game" scene

    //We just defined the game scene, now we need to tell crafty to run that scene on the stage
    Crafty.scene("game");

    // The result of all of this should be a simple space invaders game
}