Character ={};

Character.init = function () {
	Crafty.init(600,400);

	Crafty.sprite(20,25, "./web/images/snowden.png", { // player base
        PlayerPic: [0,0]
    },2);

    Crafty.c("Snowden", {
        dx: 0, // setting initial vertical speed - note variables are set differently here

        init: function() {  // init function is automatically run when entity with this component is created
            this.bind("EnterFrame",this.handlebase); // bind the EnterFrame event to the "handlebase" function below

            this.addComponent("PlayerPic"); // add the player picture to this entity
            //this.addComponent("Collision");
            this.addComponent("Fourway");
            this.fourway(4,0);

            // this.onHit("Alien",function(){
            //     this.x = 0 ;
            //     this.y = 0 ;
            // });
        },
        handlebase: function() { // runs every frame
            if (this.x < 0) this.x = 0; // stop left
            if (this.x > 575) this.x = 575; // stop right
            if (this.y < 0 ) this.y = 0;
            if(this.y>375) this.y= 375;
            //this.animate();
        }
    }); // end of Player component


    Crafty.scene("game", function () { // the scene is called "game"

        // set background
        Crafty.background("#FFF"); // this sets the background to a static image

        // make player entity
        Crafty.e("2D, Canvas, SpriteAnimation, Snowden")
        .attr({ x: 300, y: 100, z:1 })
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

        // make alien entity (coordinates are set in component's init function)
        //Crafty.e("2D, Canvas, Alien");

    }); // end of Crafty.scene function definition for "game" scene

    //We just defined the game scene, now we need to tell crafty to run that scene on the stage
    Crafty.scene("game");
}