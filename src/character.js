Character ={};

Character.init = function () {
	Crafty.init(600,400);

	Crafty.sprite(20, 25, "./web/images/snowden.png", { // player base
        PlayerPic: [0,0]
    }, 5);

    Crafty.c("Snowden", {
        dx: 0, // setting initial vertical speed - note variables are set differently here

        init: function() {  // init function is automatically run when entity with this component is created
            this.bind("EnterFrame",this.handlebase); // bind the EnterFrame event to the "handlebase" function below
            this.bind("KeyDown",this.handlekey); // bind the EnterFrame event to the "handlebase" function below


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
        },
        handlekey: function(keyevent) { // handles key events
            if(keyevent.keyCode === Crafty.keys.SPACE) { // they hit space
            	console.log('yout hit space');
            	//this.animate();
                //Crafty.e("2D, Canvas, Shot").attr({x:this.x+34, y:500, z:1}); // create a shot at our current position
            }
        }
    }); // end of Player component


    Crafty.scene("game", function () { // the scene is called "game"

        // set background
        Crafty.background("#FFF"); // this sets the background to a static image

        // make player entity
        Crafty.e("2D, Canvas, Snowden, PlayerPic")
        .attr({ x: 300, y: 100, z:1 })
        .animate('walk_left', 9, 0, 11)
        .animate('walk_left',0, 100);
        // .animate('walk_right', 3, 0, 5)
        // .animate('walk_up', 0, 0, 2)
        // .animate('walk_down', 6, 0, 8);


        // make alien entity (coordinates are set in component's init function)
        //Crafty.e("2D, Canvas, Alien");

    }); // end of Crafty.scene function definition for "game" scene

    //We just defined the game scene, now we need to tell crafty to run that scene on the stage
    Crafty.scene("game");
}