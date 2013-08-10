Game = window.Game || {};

Game.setupEnemyComponents = function () {


    // Shot component - for handling shots
    Crafty.c("Shot", {
        dy: 0, // setting initial vertical speed - note variables are set differently here

        init: function () {  // init function is automatically run when entity with this component is created
            this.bind("EnterFrame", this.handleshot); // bind the EnterFrame event to the "handleshot" function below
            this.addComponent("ShotPic"); // add the picture to this entity
        },
        handleshot: function () { // happens every frame
            this.y -= 5; // move up
            if (this.y < -10) this.destroy(); // kill the shot if it goes offscreen
        }
    }); // end of Shot component

    // Alien component - for handling aliens
    // Crafty.c("Alien", {
    //     y: -100, // setting initial vertical speed - note variables are set differently here
    //     x: 50,
    //     z: 3,
    //     dx: 6,

    //     init: function () {  // init function is automatically run when entity with this component is created
    //         this.bind("EnterFrame", this.handlealien); // bind the EnterFrame event to the "handlealien" function below
    //         this.addComponent("AlienPic"); // add the picture to this entity

    //         this.addComponent("Collision"); // add the collision component
    //         this.onHit("Shot", this.gotshot); // set up a function to call if we get hit by a shot
    //     },
    //     handlealien: function () { // happens every frame

    //         this.y += (100 - this.y) * 0.05;  // descend toward y=100

    //         this.y += Crafty.math.randomInt(-1, 1); // add a small random component to y position - ship could move -1, 0, or 1

    //         this.x += this.dx; // move according to speed

    //         if (this.x < 5) { // hit left side
    //             this.x = 5; // stop
    //             this.dx = 6; // move rightward now
    //         }
    //         if (this.x > 535) { // hit right side
    //             this.x = 535; // stop
    //             this.dx = -6; // move leftward now
    //         }
    //     },
    //     gotshot: function () { //happens when we get hit by a shot

    //         // create explosion pieces
    //         for (i = 0; i < 20; i++) { // create a bunch of chunks
    //             Crafty.e("2D, Canvas, Bits").attr({x: this.x + 22, y: this.y + 21, z: 6});
    //         }

    //         // get rid of us - but with trickery
    //         this.y -= 2500; // bump up off screen - it will look like we disappear, but we'll come back

    //     }

    // }); // end of alien component


    Crafty.c("FreedomCorp", {
        z: 3,
        speed: 1,
        dx: 1,
        dy: 1,
        range: 100,
        init: function () {
            var that = this;
            this.bind("EnterFrame", this.moveRandomly);
            this.addComponent("FreedomCorpPic");
            this.addComponent("Collision");

            that.animate('walk_up', 0, 0, 2)    ;
            that.animate('walk_right', 0, 1, 2)      ;
            that.animate('walk_down', 0, 2, 2)             ;
            that.animate('walk_left', 0, 3, 2)   ;

            //setup obstacle collisions
            _.each(Game.obstacles, function(componentName){
                that.onHit(componentName, function(collidingComponent){
                     var unit = that ;

                            unit.dx = -unit.dx;
                            unit.dy = -unit.dy;
                });
            });


            setInterval(function () {
                that.dx = Crafty.math.randomInt(-1, 1) * that.speed;
                that.dy = Crafty.math.randomInt(-1, 1) * that.speed;

            }, 1000);
        },
        moveRandomly: function () {
            var that = this,
                snowden = Game.snowden;
            this.x += this.dx;
            this.y += this.dy;

            if(that.dx < 0) {
                if(!that.isPlaying("walk_left"))
                    that.stop().animate("walk_left", 12, -1);
            } else if(that.dx > 0) {
                if(!that.isPlaying("walk_right"))
                    that.stop().animate("walk_right", 12, -1);
            } else if(that.dy < 0) {
                if(!that.isPlaying("walk_up"))
                    that.stop().animate("walk_up", 12, -1);
            } else if(that.dy > 0) {
                if(!that.isPlaying("walk_down"))
                    that.stop().animate("walk_down", 12, -1);
            }else {
                that.stop();
            };


          if(that.range > Math.sqrt( Math.pow(snowden.x - that.x,2)+Math.pow(snowden.y -that.y,2))){
             if(snowden.x > that.x) that.dx = that.speed ;
              else that.dx = -that.speed;
             if(snowden.y > that.y ) that.dy = that.speed;
              else that.dy = -that.speed;
          }
        }
    });
};

// Game.createAlienComponent = function () {
//     return Crafty.e("2D, Canvas, Alien");
// };

Game.createFreedomCorpComponent = function () {
    return Crafty.e("2D, Canvas, SpriteAnimation, FreedomCorp");
};
