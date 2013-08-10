Game = Game || {};

Game.setupPlayerComponent = function(){

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

            _.each(Game.Lives, function(componentName){
                that.onHit(componentName, function(collidingComponent){
                  if(that.heartBar.length<3){
                    that.heartBar.push(Crafty.e("2D, Canvas, Heart"));
                    collidingComponent[0].obj.destroy();
                  }
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

            this.heartBar = [
                Crafty.e("2D, Canvas, Heart"),
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
        }//,
        // handlekey: function(keyevent) { // handles key events
        //     if(keyevent.keyCode === Crafty.keys.SPACE) { // they hit space
        //         Crafty.e("2D, Canvas, Shot").attr({x:this.x+34, y:500, z:1}); // create a shot at our current position
        //     }
        // }
    });

};

Game.createPlayerComponent = function(playerStart){
    Crafty.e("2D, Canvas, SpriteAnimation, Snowden")
        .attr(playerStart)
        .animate('walk_up', [[0,0], [1,0], [2,0]])
        .animate('walk_right', [[3,0], [4,0], [5,0]])
        .animate('walk_down', [[6,0], [7,0], [8,0]])
        .animate('walk_left', [[9,0], [10,0], [11,0]])
        .bind("KeyDown", function(e) {
            if(e.keyCode === Crafty.keys.LEFT_ARROW || e.keyCode === Crafty.keys.A) {
                if(!this.isPlaying("walk_left"))
                    this.stop().animate("walk_left", 10, -1);
            } else if(e.keyCode === Crafty.keys.RIGHT_ARROW || e.keyCode === Crafty.keys.D) {
                if(!this.isPlaying("walk_right"))
                    this.stop().animate("walk_right", 10, -1);
            } else if(e.keyCode === Crafty.keys.UP_ARROW || e.keyCode === Crafty.keys.W) {
                if(!this.isPlaying("walk_up"))
                    this.stop().animate("walk_up", 10, -1);
            } else if(e.keyCode === Crafty.keys.DOWN_ARROW || e.keyCode === Crafty.keys.S) {
                if(!this.isPlaying("walk_down"))
                    this.stop().animate("walk_down", 10, -1);
            }
        }).bind("KeyUp", function(e) {
            this.stop();
        });
}
