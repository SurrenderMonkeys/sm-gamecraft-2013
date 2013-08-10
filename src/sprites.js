Game = Game || {};

Game.loadSprites = function(){

    Crafty.sprite(20,25, "./web/images/snowden.png", { // player base
        PlayerPic: [0,0]
    },2);

    Crafty.sprite(1, "./web/images/wall.png", {
        WallPic : [0,0,70,70]
    });

    Crafty.sprite(1, "./web/images/alien.png", {
        AlienPic: [0,0,52,42]
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

    Crafty.sprite(20,25,"./web/images/freedomCorp.png",{
        freedomCorp : [0,0]
    });
};