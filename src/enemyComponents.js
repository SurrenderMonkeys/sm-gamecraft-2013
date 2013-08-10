Game = Game || {};

Game.setupEnemyComponents = function (){


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

}