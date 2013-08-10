Game = window.Game || {};

Game.setupPlayerComponent = function(){
    Crafty.c("Guardian", {
      x:1100,
      y:0,
      h:100,
      w:100,
      init: function() {
        this.bind("guardian:open", this.handleComplete);
        this.open = false;

        this.addComponent("GuardianPic");
      },
      handleComplete: function() {
        this.open = true;
      }
    });

    // Player component - for handling moving player on screen
    Crafty.c("Snowden", {
        dx: 0, // setting initial vertical speed - note variables are set differently here

        init: function() {
            var that = this;
            var score = Crafty.e("Score");
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
                        Crafty.trigger("game:over");
                        Crafty.e("2D, Canvas, Skull").attr({x:that.x+8,y:that.y+5,z:that.z-3});
                        that.destroy();
                        if (window.confirm("All your lives are belong to us, Do you want to play again?")) {
                          window.location(window.location());
                        } else {
                          window.location("http://www.youtube.com/embed/qItugh-fFgg");
                        }
                    }

                    that.x = Game.playerStart.x;
                    that.y = Game.playerStart.y;

                });
            });

            //setup obstacle collisions
            _.each(Game.obstacles, function(componentName){
                that.onHit(componentName, function(collidingComponent){
                    if (!this.colliding) {
                        var player = this ,
                            origin = {
                                x: player.x - player._movement.x  ,
                                y: player.y - player._movement.y
                            };
                        this.colliding = true;

                            player.x = origin.x;
                            player.y = origin.y;
                            player.colliding = false;

                    }
                });
            });

            that.onHit("Guardian", function(obj) {
              office = obj[0].obj;
              if(office.open){
                if (window.confirm("Congratulations you have told the story to the world, Do you want to play again?")) {
                  window.location(window.location());
                }
              }
            });

            that.onHit("Document", function(doc){
              if(that.documentCount < 5){
                that.documentCount++;
                doc[0].obj.destroy();
              }

              if(that.documentCount == 5){
                Crafty.trigger('guardian:open');
              }
            });

            that.onHit("CoffeeCup", function(collidingComponent){
              if(that.heartBar.length<3){
                that.heartBar.push(Crafty.e("2D, Canvas, Heart"));
                collidingComponent[0].obj.destroy();
              }
            });

            this.onHit("Coin", function(data){
                bitcoin = data[0].obj;
                bitcoin.destroy();
                score.update(20);
            });

            this.heartBar = [Crafty.e("2D, Canvas, Heart"),
                Crafty.e("2D, Canvas, Heart"),
                Crafty.e("2D, Canvas, Heart")
            ];
            this.heartBarOffset = {x: -8, y:-8};
            this.documentCount = 0;
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
        },
    });

};

Game.createPlayerComponent = function(playerStart){

    return Crafty.e("2D, Canvas, SpriteAnimation, Snowden")
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
            var element =this;

            if(! element.keys ) element.keys = [];
            element.keys.push(e);

            Game.animateMoveElement(element,e);

        }).bind("KeyUp", function(e) {
            var element = this;
            _.each(element.keys,function(event,index){
                if(e.keys === event.keys){
                   element.keys.splice(index,1);
                }
            });
           if(element.keys.length > 0)
           {
                   Game.animateMoveElement(element,element.keys[0]);
           }

            else element.stop();
        });

}
