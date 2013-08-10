Game = Game || {};

Game.setupEnvironmentComponents = function(){
    Crafty.c("Heart", {init: function(){this.addComponent("HeartPic");}});
    Crafty.c("Skull", {init: function(){this.addComponent("SkullPic");}});
    Crafty.c("Wall",{
        x:200,
        y:200,
        init: function(){
            this.addComponent("WallPic");
        }
    });

    Crafty.c("Coffee", {
        init: function(){
          var positions = [{x:100,y:100},{x:400,y:500},{x:600,y:200}];

          for (var i = positions.length - 1; i >= 0; i--) {
            pos = positions[i];
            Crafty.e("2D, DOM, CoffeeCup").attr({x: pos.x, y: pos.y, z: 1});
          }
        }
    });

    Crafty.c("Documents", {
        init: function(){
          var positions = [{x:400,y:100},{x:1100,y:100},{x:240,y:700},{x:1000,y:750},{x:500,y:500}];

          for (var i = positions.length - 1; i >= 0; i--) {
            pos = positions[i];
            Crafty.e("2D, DOM, Document").attr({x: pos.x, y: pos.y, z: 1});
          }
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

    Crafty.c("Streets", {
        init: function() {
            for (var x = 0; x < Game.width/Game.tile_width; x++) {
                for (var y = 0; y < Game.height/Game.tile_height; y++) {
                    var at_edge = x == 0 || x == (Game.width/Game.tile_width -1) || y == 0 || y == (Game.height/Game.tile_height - 1);
                    if (Game.MapData[y][x] === 0) {
                        Crafty.e('Boundary').at(x, y);
                    }
                }
            }
        }
    });

    Crafty.c("Bitcoins", {
        init: function() {
            var count = 0;
            while (count < 50) {
                for (var i = 1; i < Game.height/Game.tile_height; i++) {
                    for (var j = 1; j < Game.width/Game.tile_width; j++) {
                        if (Game.MapData[i][j] === 1) {
                            if (i > 1 && i < Game.height/Game.tile_height && j > 1 && j < Game.width/Game.tile_width && Math.random() < 0.02) {
                                Crafty.e("2D, DOM, Coin")
                                .attr({x: (j * Game.tile_width), y: (i * Game.tile_height) - 40});
                                count = count + 1;
                            }
                        }
                    }
                }
            }
        }
    });

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



};
